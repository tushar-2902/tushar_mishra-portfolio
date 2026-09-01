"use client"

import { useEffect, useRef } from "react"

// Color definitions strictly adhering to theme:
// Warm Amber/Gold for main stars & links, Subtle Violet for secondary, Warm White for distant stars.
// Absolutely NO BLUE, NAVY, CYAN, TEAL, or GREEN.
const COLOR_AMBER = "229, 180, 104"
const COLOR_AMBER_BRIGHT = "245, 196, 118"
const COLOR_VIOLET = "177, 125, 171"
const COLOR_WHITE = "255, 250, 240"

interface Star3D {
  // 3D base coordinates in world space
  x: number
  y: number
  z: number
  // Velocity in 3D
  vx: number
  vy: number
  vz: number
  // Orbital frequency & phase for smooth organic cosmic motion
  orbitFreqX: number
  orbitFreqY: number
  orbitAmpX: number
  orbitAmpY: number
  phase: number
  // Visual attributes
  baseSize: number
  baseAlpha: number
  type: "amber" | "violet" | "white"
  hasHalo: boolean
  twinkleSpeed: number
  // Projected screen coordinates computed each frame
  projX: number
  projY: number
  projScale: number
  projAlpha: number
  visible: boolean
}

interface DistantStar {
  x: number
  y: number
  size: number
  alpha: number
  twinklePhase: number
  twinkleSpeed: number
}

interface DataPulse {
  fromIdx: number
  toIdx: number
  progress: number
  speed: number
  color: string
}

export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0
    let height = 0
    let centerX = 0
    let centerY = 0
    let animationFrame = 0

    // Smooth lerped mouse interaction for subtle 3D camera parallax
    const mouse = {
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
    }

    // 3D Starlink Constellation Nodes
    let stars: Star3D[] = []
    // Distant background starfield
    let distantStars: DistantStar[] = []
    // Dynamic optical laser mesh data pulses
    let pulses: DataPulse[] = []

    const FOCAL_LENGTH = 550
    const DEPTH_RANGE = 900
    const CAMERA_Z = 200

    const initScene = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width || window.innerWidth
      height = rect.height || window.innerHeight
      centerX = width / 2
      centerY = height / 2

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const isMobile = width < 768
      // Constellation node count (hundreds of points distributed across 3D space)
      const count = isMobile ? 120 : 230

      stars = Array.from({ length: count }, (_, i) => {
        // Spatial distribution in a broad 3D volume
        const spreadX = width * 1.3
        const spreadY = height * 1.3

        const rand = Math.random()
        const type: "amber" | "violet" | "white" =
          rand < 0.72 ? "amber" : rand < 0.88 ? "violet" : "white"

        return {
          x: (Math.random() - 0.5) * spreadX,
          y: (Math.random() - 0.5) * spreadY,
          z: Math.random() * DEPTH_RANGE,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          vz: (Math.random() - 0.5) * 0.35,
          orbitFreqX: Math.random() * 0.0006 + 0.0003,
          orbitFreqY: Math.random() * 0.0006 + 0.0003,
          orbitAmpX: Math.random() * 25 + 10,
          orbitAmpY: Math.random() * 25 + 10,
          phase: Math.random() * Math.PI * 2,
          baseSize: Math.random() * 1.8 + 1.2,
          baseAlpha: Math.random() * 0.45 + 0.55,
          type,
          hasHalo: type !== "white" && Math.random() > 0.65,
          twinkleSpeed: Math.random() * 0.02 + 0.008,
          projX: 0,
          projY: 0,
          projScale: 0,
          projAlpha: 0,
          visible: false,
        }
      })

      // Distant micro-stars for continuous deep-space atmosphere
      const distantCount = isMobile ? 80 : 160
      distantStars = Array.from({ length: distantCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.0 + 0.4,
        alpha: Math.random() * 0.5 + 0.2,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
      }))
    }

    let lastTime = performance.now()

    const draw = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1)
      lastTime = currentTime

      ctx.clearRect(0, 0, width, height)

      // Smooth mouse lerp for subtle 3D camera yaw/pitch and parallax
      mouse.currentX += (mouse.targetX - mouse.currentX) * 0.04
      mouse.currentY += (mouse.targetY - mouse.currentY) * 0.04

      const rotY = mouse.currentX * 0.16 // Camera yaw
      const rotX = -mouse.currentY * 0.12 // Camera pitch
      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)

      const spreadX = width * 1.3
      const spreadY = height * 1.3
      const halfSpreadX = spreadX / 2
      const halfSpreadY = spreadY / 2

      // 1. Draw Deep Space Background Atmospheric Glow (Pure Dark Charcoal/Graphite Base)
      const bgGrad1 = ctx.createRadialGradient(
        width * 0.22,
        height * 0.25,
        20,
        width * 0.22,
        height * 0.25,
        width * 0.55,
      )
      bgGrad1.addColorStop(0, `rgba(${COLOR_AMBER}, 0.07)`)
      bgGrad1.addColorStop(1, "rgba(7, 8, 8, 0)")
      ctx.fillStyle = bgGrad1
      ctx.fillRect(0, 0, width, height)

      const bgGrad2 = ctx.createRadialGradient(
        width * 0.8,
        height * 0.72,
        20,
        width * 0.8,
        height * 0.72,
        width * 0.5,
      )
      bgGrad2.addColorStop(0, `rgba(${COLOR_VIOLET}, 0.05)`)
      bgGrad2.addColorStop(1, "rgba(7, 8, 8, 0)")
      ctx.fillStyle = bgGrad2
      ctx.fillRect(0, 0, width, height)

      // 2. Draw Distant Background Starfield (Warm White & Soft Gold twinkling)
      for (const ds of distantStars) {
        ds.twinklePhase += ds.twinkleSpeed
        const twinkle = ds.alpha * (0.7 + Math.sin(ds.twinklePhase) * 0.3)
        const parallaxX = ds.x + mouse.currentX * 12
        const parallaxY = ds.y + mouse.currentY * 12

        ctx.beginPath()
        ctx.arc(parallaxX, parallaxY, ds.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${COLOR_WHITE}, ${twinkle})`
        ctx.fill()
      }

      // 3. Update & Project 3D Starlink Constellation Nodes
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]

        if (!reducedMotion) {
          // Slow 3D linear drift
          star.x += star.vx
          star.y += star.vy
          star.z += star.vz

          // Smooth orbital harmonic perturbation
          star.phase += 0.015
          const orbitX = Math.sin(currentTime * star.orbitFreqX + star.phase) * 0.2
          const orbitY = Math.cos(currentTime * star.orbitFreqY + star.phase) * 0.2
          star.x += orbitX
          star.y += orbitY

          // 3D Bounding volume toroidal wrapping
          if (star.x < -halfSpreadX) star.x += spreadX
          if (star.x > halfSpreadX) star.x -= spreadX
          if (star.y < -halfSpreadY) star.y += spreadY
          if (star.y > halfSpreadY) star.y -= spreadY
          if (star.z < 0) star.z += DEPTH_RANGE
          if (star.z > DEPTH_RANGE) star.z -= DEPTH_RANGE
        }

        // Apply 3D Camera Rotation (Yaw & Pitch)
        const xRot = star.x * cosY + (star.z - DEPTH_RANGE / 2) * sinY
        const zMid = -(star.x) * sinY + (star.z - DEPTH_RANGE / 2) * cosY
        const yRot = star.y * cosX - zMid * sinX
        const zFinal = star.y * sinX + zMid * cosX + DEPTH_RANGE / 2 + CAMERA_Z

        if (zFinal > 20) {
          const scale = FOCAL_LENGTH / zFinal
          star.projScale = scale
          star.projX = centerX + xRot * scale
          star.projY = centerY + yRot * scale

          // Alpha modulation based on 3D depth distance
          const depthNorm = Math.max(0, Math.min(1, 1 - (zFinal - CAMERA_Z) / DEPTH_RANGE))
          star.projAlpha = star.baseAlpha * (0.28 + depthNorm * 0.72)
          star.visible =
            star.projX >= -40 &&
            star.projX <= width + 40 &&
            star.projY >= -40 &&
            star.projY <= height + 40
        } else {
          star.visible = false
        }
      }

      // 4. Dynamic 3D Interconnect Network Lines (Starlink Constellation Mesh)
      const baseLinkDistance = width < 768 ? 120 : 160

      for (let i = 0; i < stars.length; i++) {
        const starA = stars[i]
        if (!starA.visible) continue

        for (let j = i + 1; j < stars.length; j++) {
          const starB = stars[j]
          if (!starB.visible) continue

          const dx = starA.projX - starB.projX
          const dy = starA.projY - starB.projY
          const dist2D = Math.hypot(dx, dy)

          // 3D depth similarity check (prevents connecting nodes that are far in 3D depth)
          const zDiff = Math.abs(starA.z - starB.z)
          const avgScale = (starA.projScale + starB.projScale) / 2
          const maxLinkDist = baseLinkDistance * (0.65 + avgScale * 0.85)

          if (dist2D < maxLinkDist && zDiff < 320) {
            const distRatio = 1 - dist2D / maxLinkDist
            const zRatio = 1 - zDiff / 320
            const strength = distRatio * zRatio

            const isViolet = starA.type === "violet" || starB.type === "violet"
            const colorRgb = isViolet ? COLOR_VIOLET : COLOR_AMBER
            const lineAlpha = (0.06 + strength * 0.42) * Math.min(starA.projAlpha, starB.projAlpha)

            ctx.beginPath()
            ctx.moveTo(starA.projX, starA.projY)
            ctx.lineTo(starB.projX, starB.projY)
            ctx.strokeStyle = `rgba(${colorRgb}, ${lineAlpha})`
            ctx.lineWidth = 0.5 + strength * 0.8 * avgScale
            ctx.stroke()

            // Random optical mesh pulse generation
            if (Math.random() < 0.0018 && pulses.length < 24) {
              pulses.push({
                fromIdx: i,
                toIdx: j,
                progress: 0,
                speed: Math.random() * 0.02 + 0.015,
                color: isViolet ? `rgba(${COLOR_VIOLET}, 0.9)` : `rgba(${COLOR_AMBER_BRIGHT}, 0.95)`,
              })
            }
          }
        }
      }

      // 5. Draw Dynamic Data Pulses traveling along constellation links
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p]
        pulse.progress += pulse.speed

        if (pulse.progress >= 1.0) {
          pulses.splice(p, 1)
          continue
        }

        const a = stars[pulse.fromIdx]
        const b = stars[pulse.toIdx]

        if (a && b && a.visible && b.visible) {
          const px = a.projX + (b.projX - a.projX) * pulse.progress
          const py = a.projY + (b.projY - a.projY) * pulse.progress
          const pulseSize = 1.8 * ((a.projScale + b.projScale) / 2)

          ctx.beginPath()
          ctx.arc(px, py, Math.max(1.0, pulseSize), 0, Math.PI * 2)
          ctx.fillStyle = pulse.color
          ctx.shadowColor = pulse.color
          ctx.shadowBlur = 6
          ctx.fill()
          ctx.shadowBlur = 0
        }
      }

      // 6. Draw 3D Constellation Nodes (Stars with Depth & Glow)
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]
        if (!star.visible) continue

        const radius = Math.max(0.7, star.baseSize * star.projScale * 1.5)
        const isViolet = star.type === "violet"
        const isWhite = star.type === "white"
        const colorRgb = isViolet ? COLOR_VIOLET : isWhite ? COLOR_WHITE : COLOR_AMBER
        const brightColorRgb = isViolet ? COLOR_VIOLET : isWhite ? COLOR_WHITE : COLOR_AMBER_BRIGHT

        // Draw soft ambient halo for foreground & featured nodes
        if (star.hasHalo && star.projScale > 0.7) {
          const haloRadius = radius * 3.8
          ctx.beginPath()
          ctx.arc(star.projX, star.projY, haloRadius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${colorRgb}, ${star.projAlpha * 0.14})`
          ctx.fill()
        }

        // Main node core
        ctx.beginPath()
        ctx.arc(star.projX, star.projY, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${brightColorRgb}, ${star.projAlpha})`
        if (star.projScale > 0.8) {
          ctx.shadowColor = `rgba(${colorRgb}, 0.75)`
          ctx.shadowBlur = 5 * star.projScale
        }
        ctx.fill()
        ctx.shadowBlur = 0
      }

      if (!reducedMotion) {
        animationFrame = requestAnimationFrame(draw)
      } else {
        cancelAnimationFrame(animationFrame)
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      mouse.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    }

    const handlePointerLeave = () => {
      mouse.targetX = 0
      mouse.targetY = 0
    }

    initScene()
    window.addEventListener("resize", initScene)
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true })

    animationFrame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", initScene)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerleave", handlePointerLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none h-screen w-screen"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  )
}