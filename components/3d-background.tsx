"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Line, Preload } from "@react-three/drei"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"

const AMBER = "#e5b468"
const VIOLET = "#b17db1"
const STARLIGHT = "#ffffff"
const DARK_AMBER = "#c99542"

type Particle = {
  id: string
  base: [number, number, number]
  size: number
  color: string
  opacity: number
  speed: number
  phase: number
}

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
  const motion = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      motion.current.targetX = (event.clientX / window.innerWidth - 0.5) * 2
      motion.current.targetY = (event.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
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
    const z = randomBetween(-4.0, 0.5)
    const layer = z < -2.2 ? "distance" : z < -0.8 ? "mid" : "foreground"
    const size =
      layer === "foreground"
        ? randomBetween(0.14, 0.24)
        : layer === "mid"
        ? randomBetween(0.09, 0.14)
        : randomBetween(0.05, 0.08)

    const color =
      Math.random() < 0.45 ? STARLIGHT : Math.random() < 0.75 ? AMBER : VIOLET
    const opacity =
      layer === "distance"
        ? randomBetween(0.4, 0.6)
        : layer === "mid"
        ? randomBetween(0.65, 0.85)
        : randomBetween(0.85, 1.0)

    return {
      id: `node-${index}`,
      base: [randomBetween(-4.2, 4.2), randomBetween(-2.8, 2.8), z],
      size,
      color,
      opacity,
      speed: randomBetween(0.2, 0.45),
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
      .slice(0, 4)

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

/* Bold Floating 3D Geometric Polyhedra and Holographic Cloud Shapes */
function FloatingGeometricCluster({ isMobile }: { isMobile: boolean }) {
  const icosahedronRef = useRef<THREE.Mesh>(null)
  const octahedronRef = useRef<THREE.Mesh>(null)
  const torusRef = useRef<THREE.Mesh>(null)
  const dodecahedronRef = useRef<THREE.Mesh>(null)
  const boxRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime
    const clampedDelta = Math.min(delta, 0.1)

    if (icosahedronRef.current) {
      icosahedronRef.current.rotation.x += 0.35 * clampedDelta
      icosahedronRef.current.rotation.y += 0.45 * clampedDelta
      icosahedronRef.current.position.y = 1.4 + Math.sin(t * 0.8) * 0.2
    }
    if (octahedronRef.current) {
      octahedronRef.current.rotation.y -= 0.4 * clampedDelta
      octahedronRef.current.rotation.z += 0.3 * clampedDelta
      octahedronRef.current.position.y = -1.3 + Math.cos(t * 0.7) * 0.22
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = Math.PI / 3.5 + Math.sin(t * 0.5) * 0.15
      torusRef.current.rotation.y += 0.25 * clampedDelta
      torusRef.current.rotation.z += 0.2 * clampedDelta
    }
    if (dodecahedronRef.current) {
      dodecahedronRef.current.rotation.x -= 0.28 * clampedDelta
      dodecahedronRef.current.rotation.y += 0.35 * clampedDelta
      dodecahedronRef.current.position.y = 0.9 + Math.sin(t * 0.6 + 1) * 0.16
    }
    if (boxRef.current) {
      boxRef.current.rotation.y += 0.32 * clampedDelta
      boxRef.current.rotation.x += 0.22 * clampedDelta
      boxRef.current.position.y = -0.7 + Math.sin(t * 0.75 + 2) * 0.18
    }
  })

  return (
    <group>
      {/* 3D Wireframe Icosahedron (Amber Neon - Right Area) */}
      <Float speed={2.0} rotationIntensity={0.8} floatIntensity={1.0}>
        <mesh
          ref={icosahedronRef}
          position={[isMobile ? 1.8 : 3.2, 1.4, -1.5]}
          scale={isMobile ? 0.9 : 1.35}
        >
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color={AMBER}
            wireframe
            emissive={AMBER}
            emissiveIntensity={0.85}
            transparent
            opacity={0.85}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </Float>

      {/* 3D Wireframe Octahedron (Violet Neon - Left Area) */}
      <Float speed={2.4} rotationIntensity={0.9} floatIntensity={1.1}>
        <mesh
          ref={octahedronRef}
          position={[isMobile ? -1.8 : -3.2, -1.3, -1.2]}
          scale={isMobile ? 0.85 : 1.25}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={VIOLET}
            wireframe
            emissive={VIOLET}
            emissiveIntensity={0.9}
            transparent
            opacity={0.8}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </Float>

      {/* 3D Floating Torus Ring (Central Horizon Ring) */}
      <mesh
        ref={torusRef}
        position={[0.1, 0.2, -2.8]}
        scale={isMobile ? 2.5 : 4.2}
      >
        <torusGeometry args={[1, 0.05, 16, 64]} />
        <meshStandardMaterial
          color={AMBER}
          emissive={DARK_AMBER}
          emissiveIntensity={0.65}
          transparent
          opacity={0.6}
          roughness={0.2}
          metalness={0.95}
        />
      </mesh>

      {/* 3D Wireframe Dodecahedron (Top Left Area) */}
      {!isMobile && (
        <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.9}>
          <mesh
            ref={dodecahedronRef}
            position={[-2.8, 1.8, -2.2]}
            scale={1.05}
          >
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={STARLIGHT}
              wireframe
              emissive={VIOLET}
              emissiveIntensity={0.6}
              transparent
              opacity={0.7}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </Float>
      )}

      {/* 3D Floating Cloud Data Cube (Bottom Right Area) */}
      {!isMobile && (
        <Float speed={2.1} rotationIntensity={0.8} floatIntensity={1.0}>
          <mesh
            ref={boxRef}
            position={[2.9, -1.5, -2.0]}
            scale={1.1}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={AMBER}
              wireframe
              emissive={DARK_AMBER}
              emissiveIntensity={0.75}
              transparent
              opacity={0.75}
              roughness={0.15}
              metalness={0.9}
            />
          </mesh>
        </Float>
      )}
    </group>
  )
}

/* Individual Glowing Particle Node */
function ParticleNode({ particle }: { particle: Particle }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }, delta) => {
    if (!ref.current) return
    const time = clock.elapsedTime
    const floatY = Math.sin(time * particle.speed + particle.phase) * 0.16
    const driftX = Math.cos(time * particle.speed * 0.8 + particle.phase) * 0.12
    ref.current.position.set(
      particle.base[0] + driftX,
      particle.base[1] + floatY,
      particle.base[2],
    )
    ref.current.rotation.y += 0.003 * Math.min(delta, 0.1)
  })

  return (
    <mesh ref={ref} scale={particle.size}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={particle.color}
        emissive={particle.color}
        emissiveIntensity={particle.opacity * 1.5}
        roughness={0.1}
        metalness={0.5}
        transparent
        opacity={particle.opacity}
      />
    </mesh>
  )
}

/* Connection Line between Star Nodes */
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
      lineWidth={0.65}
      transparent
      opacity={0.4}
      dashed={false}
    />
  )
}

/* Full 3D Interactive Scene */
function BackgroundScene() {
  const isMobile = useMobileMode()
  const reducedMotion = useReducedMotion()
  const pointerMotion = usePointerMotion()
  const sceneRef = useRef<THREE.Group>(null)

  const particleCount = isMobile ? 42 : 80
  const maxConnectionDistance = isMobile ? 1.8 : 2.4

  const particles = useMemo(() => createParticles(particleCount), [particleCount])
  const connections = useMemo(
    () => createConnections(particles, maxConnectionDistance),
    [particles, maxConnectionDistance],
  )

  useFrame((_, delta) => {
    if (!sceneRef.current) return

    // Smooth lerp pointer tracking
    const p = pointerMotion.current
    p.x += (p.targetX - p.x) * 0.05
    p.y += (p.targetY - p.y) * 0.05

    const targetRotX = p.y * 0.1
    const targetRotY = p.x * 0.15

    sceneRef.current.rotation.y += (targetRotY - sceneRef.current.rotation.y) * 0.06
    sceneRef.current.rotation.x += (targetRotX - sceneRef.current.rotation.x) * 0.06
    sceneRef.current.position.x += (p.x * 0.6 - sceneRef.current.position.x) * 0.05
    sceneRef.current.position.y += (-p.y * 0.4 - sceneRef.current.position.y) * 0.05

    if (!reducedMotion.current) {
      sceneRef.current.rotation.z += 0.001 * Math.min(delta, 0.1)
    }
  })

  return (
    <group ref={sceneRef}>
      <ambientLight color="#f6e8cc" intensity={0.5} />
      <pointLight color={AMBER} intensity={1.2} position={[-2.5, 2.0, 1.0]} />
      <pointLight color={VIOLET} intensity={1.1} position={[2.5, 1.5, 0.5]} />
      <pointLight color={STARLIGHT} intensity={0.6} position={[0, -2.0, 1.5]} />

      {/* Floating 3D Geometric Polyhedra & Rings */}
      <FloatingGeometricCluster isMobile={isMobile} />

      {/* 3D Particle Constellation Nodes */}
      <group>
        {particles.map((particle) => (
          <ParticleNode key={particle.id} particle={particle} />
        ))}
      </group>

      {/* 3D Network Interconnect Lines */}
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
      {/* Ambient background glow matching exact brand colors */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 18% 18%, rgba(229,180,104,0.18), transparent 32%), radial-gradient(circle at 82% 75%, rgba(177,125,171,0.14), transparent 34%), radial-gradient(circle at 50% 50%, rgba(229,180,104,0.06), transparent 50%)`,
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
        camera={{ position: [0, 0, 7.5], fov: 45, near: 0.1, far: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <BackgroundScene />
        <Preload all />
      </Canvas>
    </div>
  )
}