"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Line, Preload } from "@react-three/drei"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"

type Particle = {
  id: string
  base: [number, number, number]
  size: number
  color: string
  opacity: number
  speed: number
  phase: number
}

const AMBER = "#e5b468"
const VIOLET = "#b17db1"
const STARLIGHT = "#f4f0ff"
const BACKGROUND_COLOR = "#070808"

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function useReducedMotion() {
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [])

  return reducedMotion
}

function usePointerMotion() {
  const motion = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      motion.current.x = (event.clientX / window.innerWidth - 0.5) * 0.9
      motion.current.y = (event.clientY / window.innerHeight - 0.5) * 0.85
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return motion
}

function useMobileMode() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(max-width: 880px)")
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  return isMobile
}

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, index) => {
    const z = randomBetween(-5.8, -2.1)
    const layer = z < -4.4 ? "distance" : z < -3.1 ? "mid" : "foreground"
    const size =
      layer === "foreground"
        ? randomBetween(0.11, 0.18)
        : layer === "mid"
        ? randomBetween(0.065, 0.095)
        : randomBetween(0.035, 0.055)
    const color =
      Math.random() < 0.55 ? STARLIGHT : Math.random() < 0.7 ? VIOLET : AMBER
    const opacity =
      layer === "distance"
        ? randomBetween(0.2, 0.34)
        : layer === "mid"
        ? randomBetween(0.4, 0.55)
        : randomBetween(0.78, 0.95)

    return {
      id: `node-${index}`,
      base: [randomBetween(-4.2, 4.2), randomBetween(-2.4, 2.4), z],
      size,
      color,
      opacity,
      speed: randomBetween(0.14, 0.32),
      phase: randomBetween(0, Math.PI * 2),
    }
  })
}

function createConnections(particles: Particle[], maxDistance: number) {
  const pairs = new Set<string>()
  const results: [Particle, Particle][] = []

  for (const source of particles) {
    const sorted = particles
      .map((target) => ({
        target,
        distance: new THREE.Vector3(...source.base).distanceTo(
          new THREE.Vector3(...target.base),
        ),
      }))
      .filter((item) => item.target.id !== source.id)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5)

    for (const item of sorted) {
      if (item.distance > maxDistance) break
      const key = [source.id, item.target.id].sort().join("|")
      if (!pairs.has(key)) {
        pairs.add(key)
        results.push([source, item.target])
      }
    }
  }

  return results
}

function ParticleNode({ particle }: { particle: Particle }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }, delta) => {
    if (!ref.current) return
    const time = clock.elapsedTime
    const floatY = Math.sin(time * particle.speed + particle.phase) * 0.08
    const driftX = Math.cos(time * particle.speed * 0.8 + particle.phase) * 0.05
    ref.current.position.set(
      particle.base[0] + driftX,
      particle.base[1] + floatY,
      particle.base[2],
    )
    ref.current.rotation.y += 0.0015 * delta
    ref.current.rotation.x += 0.001 * delta
  })

  return (
    <mesh ref={ref} scale={particle.size}>
      <sphereGeometry args={[1, 18, 18]} />
      <meshStandardMaterial
        color={particle.color}
        emissive={particle.color}
        emissiveIntensity={particle.opacity * 0.9}
        roughness={0.18}
        metalness={0.38}
        transparent
        opacity={particle.opacity}
      />
    </mesh>
  )
}

function ConnectionLine({
  source: sourceBase,
  target: targetBase,
  color,
}: {
  source: [number, number, number]
  target: [number, number, number]
  color: string
}) {
  const points = useMemo(
    () => [new THREE.Vector3(...sourceBase), new THREE.Vector3(...targetBase)],
    [sourceBase, targetBase],
  )

  return (
    <Line
      points={points}
      color={color}
      lineWidth={0.25}
      transparent
      opacity={0.2}
      dashed={false}
    />
  )
}

function BackgroundScene() {
  const isMobile = useMobileMode()
  const reducedMotion = useReducedMotion()
  const pointerMotion = usePointerMotion()
  const sceneRef = useRef<THREE.Group>(null)

  const particleCount = isMobile ? 34 : 60
  const maxConnectionDistance = isMobile ? 1.6 : 2.2

  const particles = useMemo(() => createParticles(particleCount), [particleCount])
  const connections = useMemo(
    () => createConnections(particles, maxConnectionDistance),
    [particles, maxConnectionDistance],
  )

  useFrame((_, delta) => {
    if (!sceneRef.current) return

    const targetX = pointerMotion.current.x * 0.12
    const targetY = pointerMotion.current.y * 0.08

    sceneRef.current.rotation.y += (targetX - sceneRef.current.rotation.y) * 0.05
    sceneRef.current.rotation.x += (targetY - sceneRef.current.rotation.x) * 0.05
    sceneRef.current.position.x +=
      (pointerMotion.current.x * 0.55 - sceneRef.current.position.x) * 0.04
    sceneRef.current.position.y +=
      (pointerMotion.current.y * 0.35 - sceneRef.current.position.y) * 0.04

    if (!reducedMotion.current) {
      sceneRef.current.rotation.z += 0.0012 * delta
    }
  })

  return (
    <group ref={sceneRef}>
      <fog attach="fog" args={[BACKGROUND_COLOR, 4.5, 16]} />
      <ambientLight color="#f2e0b7" intensity={0.22} />
      <pointLight color="#dbad5b" intensity={0.16} position={[-2.6, 2.1, -1.4]} />
      <pointLight color="#d49d7f" intensity={0.12} position={[2.3, 1.6, -2.6]} />

      <group>
        {particles.map((particle) => (
          <ParticleNode key={particle.id} particle={particle} />
        ))}
      </group>

      {connections.map(([source, target]) => (
        <ConnectionLine
          key={`${source.id}-${target.id}`}
          source={source.base}
          target={target.base}
          color={
            source.color === VIOLET || target.color === VIOLET ? VIOLET : AMBER
          }
        />
      ))}
    </group>
  )
}

export default function ThreeDBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 20% 15%, rgba(229,180,104,0.12), transparent 22%), radial-gradient(circle at 82% 72%, rgba(177,125,171,0.08), transparent 24%)`,
          opacity: 0.35,
          pointerEvents: "none",
        }}
      />
      <Canvas
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
        camera={{ position: [0, 0, 11], fov: 40, near: 0.1, far: 25 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.4]}
      >
        <BackgroundScene />
        <Preload all />
      </Canvas>
    </div>
  )
}