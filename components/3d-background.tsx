"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Edges, Line, Preload } from "@react-three/drei"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

function usePointerMotion() {
  const motion = useRef({ x: 0, y: 0, scroll: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      motion.current.x = (event.clientX / window.innerWidth - 0.5) * 0.75
      motion.current.y = (event.clientY / window.innerHeight - 0.5) * 0.6
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

function InfrastructureCluster({
  position,
  color,
  scale,
  rotationSpeed,
}: {
  position: [number, number, number]
  color: string
  scale: number
  rotationSpeed: number
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return
    }

    groupRef.current.rotation.y += rotationSpeed * delta
    groupRef.current.rotation.x += rotationSpeed * 0.3 * delta
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.6, 0.84, 0.84]} />
        <meshStandardMaterial
          color="#161616"
          emissive="#2d1f0f"
          emissiveIntensity={0.1}
          roughness={0.24}
          metalness={0.7}
        />
        <Edges threshold={15} color={color} />
      </mesh>

      <mesh position={[1.05, 0.24, -0.5]} scale={0.38}>
        <boxGeometry args={[0.86, 0.28, 0.86]} />
        <meshStandardMaterial
          color="#1d1d1d"
          emissive={color}
          emissiveIntensity={0.06}
          roughness={0.2}
          metalness={0.7}
        />
        <Edges threshold={15} color={color} />
      </mesh>

      <mesh position={[-0.88, 0.2, 0.88]} scale={0.28}>
        <sphereGeometry args={[0.34, 20, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.12}
          roughness={0.45}
          metalness={0.2}
        />
      </mesh>

      <mesh position={[-0.2, -0.35, 0.88]} rotation={[0.45, 0.3, 0]} scale={0.18}>
        <icosahedronGeometry args={[0.44, 0]} />
        <meshStandardMaterial
          color="#191919"
          emissive="#20170e"
          emissiveIntensity={0.08}
          roughness={0.28}
          metalness={0.7}
        />
        <Edges threshold={15} color={color} />
      </mesh>
    </group>
  )
}

function WireframeShell({
  position,
  radius,
}: {
  position: [number, number, number]
  radius: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (!meshRef.current) {
      return
    }

    meshRef.current.rotation.y += 0.04 * delta
    meshRef.current.rotation.x += 0.02 * delta
  })

  return (
    <mesh ref={meshRef} position={position} rotation={[0.4, 0.2, 0]}>
      <icosahedronGeometry args={[radius, 0]} />
      <meshStandardMaterial
        color="#3f3f3f"
        transparent
        opacity={0.1}
        wireframe
      />
    </mesh>
  )
}

function NodeLineNetwork() {
  const linePoints = useMemo(() => {
    const rawPoints: [number, number, number][][] = [
      [
        [-3.8, 1.2, -4.5],
        [-2.2, 0.7, -3.2],
        [-1.1, 0.35, -4.2],
      ],
      [
        [2.4, 0.7, -5],
        [1.1, -0.2, -4.2],
        [0.2, 0.8, -3.5],
      ],
      [
        [-0.4, -1.2, -4.8],
        [1.8, -1.1, -4.2],
        [3, -0.4, -5.3],
      ],
    ]

    return rawPoints.map((group) =>
      group.map(
        (point) => new THREE.Vector3(point[0], point[1], point[2])
      )
    )
  }, [])

  return (
    <group>
      {linePoints.map((points, index) => (
        <Line
          key={index}
          points={points}
          color="#e5b468"
          lineWidth={0.6}
          transparent
          opacity={0.18}
          dashed={false}
        />
      ))}
    </group>
  )
}

function BackgroundScene() {
  const sceneRef = useRef<THREE.Group>(null)
  const pointerMotion = usePointerMotion()
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  }, [])

  useFrame((_, delta) => {
    if (!sceneRef.current) {
      return
    }

    const motion = pointerMotion.current
    const targetRotationY = motion.x * 0.12
    const targetRotationX = motion.y * 0.07
    const targetY = -motion.scroll * 0.0002

    sceneRef.current.rotation.y += (targetRotationY - sceneRef.current.rotation.y) * 0.06
    sceneRef.current.rotation.x += (targetRotationX - sceneRef.current.rotation.x) * 0.05
    sceneRef.current.position.y += (targetY - sceneRef.current.position.y) * 0.08

    if (!reducedMotionRef.current) {
      sceneRef.current.rotation.z += 0.008 * delta
    }
  })

  const clusterData = useMemo(
    () => [
      {
        position: [-3.4, 1.1, -4.4] as [number, number, number],
        color: "#e5b468",
        scale: 1,
        rotationSpeed: 0.12,
      },
      {
        position: [2.8, 0.4, -5.1] as [number, number, number],
        color: "#f6e5bb",
        scale: 1.1,
        rotationSpeed: -0.08,
      },
      {
        position: [1.3, -1.3, -4.8] as [number, number, number],
        color: "#e7c281",
        scale: 0.86,
        rotationSpeed: 0.1,
      },
    ],
    []
  )

  return (
    <group ref={sceneRef}>
      <fog attach="fog" args={["#0c0d0f", 6, 18]} />
      <ambientLight color="#f3e6c3" intensity={0.26} />
      <directionalLight color="#f0d99f" intensity={0.45} position={[6, 8, 5]} />
      <pointLight color="#f7e6b1" intensity={0.18} position={[-4, 2, -3]} />
      <pointLight color="#ecd8a5" intensity={0.12} position={[3, -2, -2]} />

      <group position={[0, 0.2, 0]}>
        {clusterData.map((item, index) => (
          <InfrastructureCluster key={index} {...item} />
        ))}

        <WireframeShell position={[-1.8, 1.4, -3.6]} radius={1.9} />
        <WireframeShell position={[2.1, -0.2, -4.1]} radius={1.6} />
        <WireframeShell position={[0.8, 1.9, -5.6]} radius={1.4} />

        <NodeLineNetwork />
      </group>
    </group>
  )
}

export default function ThreeDBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        camera={{ position: [0, 0, 12], fov: 40, near: 0.1, far: 35 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 1.6]}
      >
        <BackgroundScene />
        <Preload all />
      </Canvas>
    </div>
  )
}
