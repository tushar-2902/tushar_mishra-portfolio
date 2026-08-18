"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Line, Preload } from "@react-three/drei"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"

const AMBER = "#e5b468"
const VIOLET = "#b17db1"
const STARLIGHT = "#f4f0ff"
const DARK_AMBER = "#946f33"

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
    const z = randomBetween(-6.5, -1.8)
    const layer = z < -4.8 ? "distance" : z < -3.2 ? "mid" : "foreground"
    const size =
      layer === "foreground"
        ? randomBetween(0.12, 0.2)
        : layer === "mid"
        ? randomBetween(0.07, 0.11)
        : randomBetween(0.04, 0.065)

    const color =
      Math.random() < 0.5 ? STARLIGHT : Math.random() < 0.75 ? AMBER : VIOLET
    const opacity =
      layer === "distance"
        ? randomBetween(0.25, 0.4)
        : layer === "mid"
        ? randomBetween(0.45, 0.65)
        : randomBetween(0.8, 1)

    return {
      id: `node-${index}`,
      base: [randomBetween(-5.5, 5.5), randomBetween(-3.2, 3.2), z],
      size,
      color,
      opacity,
      speed: randomBetween(0.18, 0.4),
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

/* Floating 3D Geometric Cloud Nodes */
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
      icosahedronRef.current.rotation.x += 0.3 * clampedDelta
      icosahedronRef.current.rotation.y += 0.4 * clampedDelta
      icosahedronRef.current.position.y = 1.6 + Math.sin(t * 0.7) * 0.15
    }
    if (octahedronRef.current) {
      octahedronRef.current.rotation.y -= 0.35 * clampedDelta
      octahedronRef.current.rotation.z += 0.25 * clampedDelta
      octahedronRef.current.position.y = -1.5 + Math.cos(t * 0.6) * 0.18
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.4) * 0.1
      torusRef.current.rotation.y += 0.2 * clampedDelta
      torusRef.current.rotation.z += 0.15 * clampedDelta
    }
    if (dodecahedronRef.current) {
      dodecahedronRef.current.rotation.x -= 0.22 * clampedDelta
      dodecahedronRef.current.rotation.y += 0.3 * clampedDelta
      dodecahedronRef.current.position.y = 0.8 + Math.sin(t * 0.5 + 1) * 0.12
    }
    if (boxRef.current) {
      boxRef.current.rotation.y += 0.28 * clampedDelta
      boxRef.current.rotation.x += 0.18 * clampedDelta
      boxRef.current.position.y = -0.9 + Math.sin(t * 0.65 + 2) * 0.14
    }
  })

  return (
    <group>
      {/* 3D Wireframe Icosahedron (Amber Glow - Top Right) */}
      <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.8}>
        <mesh
          ref={icosahedronRef}
          position={[isMobile ? 2.4 : 4.2, 1.6, -3.5]}
          scale={isMobile ? 0.75 : 1.1}
        >
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color={AMBER}
            wireframe
            emissive={AMBER}
            emissiveIntensity={0.45}
            transparent
            opacity={0.65}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>

      {/* 3D Wireframe Octahedron (Violet Glow - Bottom Left) */}
      <Float speed={2.2} rotationIntensity={0.8} floatIntensity={0.9}>
        <mesh
          ref={octahedronRef}
          position={[isMobile ? -2.4 : -4.4, -1.5, -3.2]}
          scale={isMobile ? 0.7 : 1.0}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={VIOLET}
            wireframe
            emissive={VIOLET}
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>

      {/* 3D Floating Torus Ring (Central Ambience - Mid Depth) */}
      <mesh
        ref={torusRef}
        position={[0.2, 0.4, -5.2]}
        scale={isMobile ? 2.2 : 3.4}
      >
        <torusGeometry args={[1, 0.04, 16, 64]} />
        <meshStandardMaterial
          color={AMBER}
          emissive={DARK_AMBER}
          emissiveIntensity={0.35}
          transparent
          opacity={0.4}
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>

      {/* 3D Wireframe Dodecahedron (Top Left) */}
      {!isMobile && (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.7}>
          <mesh
            ref={dodecahedronRef}
            position={[-3.8, 2.2, -4.2]}
            scale={0.85}
          >
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={STARLIGHT}
              wireframe
              emissive={VIOLET}
              emissiveIntensity={0.3}
              transparent
              opacity={0.45}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
        </Float>
      )}

      {/* 3D Floating Cloud Data Cube (Bottom Right) */}
      {!isMobile && (
        <Float speed={1.9} rotationIntensity={0.7} floatIntensity={0.85}>
          <mesh
            ref={boxRef}
            position={[3.9, -1.8, -3.8]}
            scale={0.9}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={AMBER}
              wireframe
              emissive={DARK_AMBER}
              emissiveIntensity={0.4}
              transparent
              opacity={0.5}
              roughness={0.2}
              metalness={0.85}
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
    const floatY = Math.sin(time * particle.speed + particle.phase) * 0.12
    const driftX = Math.cos(time * particle.speed * 0.75 + particle.phase) * 0.08
    ref.current.position.set(
      particle.base[0] + driftX,
      particle.base[1] + floatY,
      particle.base[2],
    )
    ref.current.rotation.y += 0.002 * Math.min(delta, 0.1)
  })

  return (
    <mesh ref={ref} scale={particle.size}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={particle.color}
        emissive={particle.color}
        emissiveIntensity={particle.opacity * 1.1}
        roughness={0.15}
        metalness={0.4}
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
      lineWidth={0.35}
      transparent
      opacity={0.22}
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

  const particleCount = isMobile ? 38 : 72
  const maxConnectionDistance = isMobile ? 1.7 : 2.3

  const particles = useMemo(() => createParticles(particleCount), [particleCount])
  const connections = useMemo(
    () => createConnections(particles, maxConnectionDistance),
    [particles, maxConnectionDistance],
  )

  useFrame((_, delta) => {
    if (!sceneRef.current) return

    // Smooth lerp pointer tracking
    const p = pointerMotion.current
    p.x += (p.targetX - p.x) * 0.04
    p.y += (p.targetY - p.y) * 0.04

    const targetRotX = p.y * 0.08
    const targetRotY = p.x * 0.12

    sceneRef.current.rotation.y += (targetRotY - sceneRef.current.rotation.y) * 0.06
    sceneRef.current.rotation.x += (targetRotX - sceneRef.current.rotation.x) * 0.06
    sceneRef.current.position.x += (p.x * 0.45 - sceneRef.current.position.x) * 0.05
    sceneRef.current.position.y += (-p.y * 0.3 - sceneRef.current.position.y) * 0.05

    if (!reducedMotion.current) {
      sceneRef.current.rotation.z += 0.0008 * Math.min(delta, 0.1)
    }
  })

  return (
    <group ref={sceneRef}>
      <ambientLight color="#f6e8cc" intensity={0.35} />
      <pointLight color={AMBER} intensity={0.7} position={[-3.5, 2.5, -1.2]} />
      <pointLight color={VIOLET} intensity={0.6} position={[3.2, 1.8, -2.4]} />
      <pointLight color={STARLIGHT} intensity={0.3} position={[0, -2.5, -1.0]} />

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
          background: `radial-gradient(circle at 18% 18%, rgba(229,180,104,0.14), transparent 28%), radial-gradient(circle at 82% 75%, rgba(177,125,171,0.11), transparent 30%), radial-gradient(circle at 50% 50%, rgba(229,180,104,0.04), transparent 50%)`,
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
        camera={{ position: [0, 0, 10], fov: 42, near: 0.1, far: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <BackgroundScene />
        <Preload all />
      </Canvas>
    </div>
  )
}