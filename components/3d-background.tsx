"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Edges, Line, Preload } from "@react-three/drei"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

type SceneMotion = {
  x: number
  y: number
  scroll: number
}

function useSceneMotion() {
  const motion = useRef<SceneMotion>({ x: 0, y: 0, scroll: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      motion.current.x = (event.clientX / window.innerWidth - 0.5) * 0.75
      motion.current.y = (event.clientY / window.innerHeight - 0.5) * 0.65
    }

    const handleScroll = () => {
      motion.current.scroll = window.scrollY
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return motion
}

function FloatingInfrastructure({
  position,
  color,
  scale,
  speed,
}: {
  position: [number, number, number]
  color: string
  scale: number
  speed: number
}) {
  const ref = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += speed * delta
    ref.current.rotation.x += speed * 0.25 * delta
    ref.current.position.y = position[1] + Math.sin(performance.now() * 0.00025 + speed) * 0.08
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.1, 1.1, 1.1]} />
        <meshStandardMaterial
          color="#111111"
          emissive={color}
          emissiveIntensity={0.14}
          roughness={0.12}
          metalness={0.8}
        />
        <Edges threshold={15} color={color} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.28, 18, 18]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.18}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>
    </group>
  )
}

function ConnectionLine({
  points,
}: {
  points: [number, number, number][]
}) {
  const vectorPoints = useMemo(
    () => points.map((point) => new THREE.Vector3(point[0], point[1], point[2])),
    [points],
  )

  return (
    <Line
      points={vectorPoints}
      color="#e5b468"
      lineWidth={1.2}
      transparent
      opacity={0.3}
      dashed={false}
    />
  )
}

function StructureCore({
  position,
  rotation,
  scale,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += 0.015 * delta
    ref.current.rotation.z += 0.01 * delta
  })

  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1.4, 0.45, 1.4]} />
      <meshStandardMaterial
        color="#121212"
        transparent
        opacity={0.16}
        roughness={0.08}
        metalness={0.9}
      />
      <Edges threshold={15} color="#e5b468" />
    </mesh>
  )
}

function BackgroundScene() {
  const sceneRef = useRef<THREE.Group>(null)
  const motion = useSceneMotion()
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  }, [])

  useFrame((_, delta) => {
    if (!sceneRef.current) return

    const targetY = -motion.current.scroll * 0.00008
    sceneRef.current.position.x += (motion.current.x * 1.1 - sceneRef.current.position.x) * 0.04
    sceneRef.current.position.y += (motion.current.y * 1.1 + targetY - sceneRef.current.position.y) * 0.04
    sceneRef.current.rotation.y += 0.005 * delta
    if (!reducedMotionRef.current) {
      sceneRef.current.rotation.z += 0.0035 * delta
    }
  })

  const infrastructurePoints: [number, number, number][] = useMemo(
    () => [
      [-2.4, 0.35, -4.1],
      [-0.8, -0.9, -4.9],
      [1.25, 0.3, -5.5],
      [2.6, 0.75, -4.3],
      [0.4, 1.35, -5.9],
    ],
    [],
  )

  const connectionGroups: [number, number, number][][] = useMemo(
    () => [
      [
        [-2.4, 0.35, -4.1],
        [-0.8, -0.9, -4.9],
      ],
      [
        [-0.8, -0.9, -4.9],
        [1.25, 0.3, -5.5],
      ],
      [
        [1.25, 0.3, -5.5],
        [2.6, 0.75, -4.3],
      ],
      [
        [2.6, 0.75, -4.3],
        [0.4, 1.35, -5.9],
      ],
      [
        [0.4, 1.35, -5.9],
        [-2.4, 0.35, -4.1],
      ],
    ],
    [],
  )

  return (
    <group ref={sceneRef}>
      <fog attach="fog" args={["#070808", 4.5, 16]} />
      <ambientLight color="#f0e2b6" intensity={0.22} />
      <directionalLight color="#e5b468" intensity={0.28} position={[3.4, 4, 3]} />
      <pointLight color="#f1d998" intensity={0.18} position={[-2.8, 1.2, -2.1]} />
      <pointLight color="#ecd19d" intensity={0.14} position={[2.2, -1.6, -3]} />

      <group position={[0, 0.35, 0]}>
        <StructureCore position={[-1.8, 1.05, -4.1]} rotation={[0.18, 0.45, 0.1]} scale={1.05} />
        <StructureCore position={[2.05, -0.8, -5.0]} rotation={[1.1, 0.25, 0.18]} scale={0.92} />
        <StructureCore position={[0.22, 1.6, -5.8]} rotation={[0.78, 0.72, 0.12]} scale={0.7} />

        {infrastructurePoints.map((position, index) => (
          <FloatingInfrastructure
            key={index}
            position={position}
            scale={1}
            speed={0.055 + index * 0.018}
            color={index % 2 === 0 ? "#e5b468" : "#f3ddb3"}
          />
        ))}

        {connectionGroups.map((points, index) => (
          <ConnectionLine key={index} points={points} />
        ))}
      </group>
    </group>
  )
}

export default function ThreeDBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "transparent" }}
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
