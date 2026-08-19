"use client"

import { useEffect, useRef, useState } from "react"

const AMBER = "#f5be6b"
const BRIGHT_AMBER = "#ffca7a"
const VIOLET = "#c28ec2"
const STARLIGHT = "#ffffff"
const AMBER_GLOW = "rgba(245, 190, 107, "
const VIOLET_GLOW = "rgba(194, 142, 194, "

interface Star {
  x: number
  y: number
  radius: number
  alpha: number
  twinkleSpeed: number
  phase: number
}

interface Satellite {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  size: number
  altitude: number
  orbitalPlane: number
  signalTimer: number
  signalWaves: { r: number; alpha: number }[]
  color: string
}

interface LaserPulse {
  fromX: number
  fromY: number
  toX: number
  toY: number
  progress: number
  speed: number
  color: string
}

interface ShootingStar {
  x: number
  y: number
  len: number
  speed: number
  angle: number
  alpha: number
  active: boolean
}

export default function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = 0
    let height = 0

    const mouse = {
      x: -1000,
      y: -1000,
      active: false,
      pulseRadius: 0,
    }

    let stars: Star[] = []
    let satellites: Satellite[] = []
    let pulses: LaserPulse[] = []
    let shootingStars: ShootingStar[] = []

    const initScene = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Initialize Dense Starfield
      const starCount = Math.floor((width * height) / 3200)
      stars = Array.from({ length: Math.max(160, starCount) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() < 0.8 ? Math.random() * 1.4 + 0.6 : Math.random() * 2.4 + 1.4,
        alpha: Math.random() * 0.6 + 0.4,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        phase: Math.random() * Math.PI * 2,
      }))

      // Initialize Satellites (Starlink Fleet)
      const isMobile = width < 768
      const satCount = isMobile ? 24 : 42
      satellites = []

      // 1. Multi-plane orbital satellites
      for (let i = 0; i < satCount; i++) {
        const planeAngle = (Math.PI / 4) * (i % 4 === 0 ? 0.35 : i % 4 === 1 ? -0.45 : i % 4 === 2 ? 0.7 : -0.2)
        const speed = Math.random() * 0.55 + 0.4
        satellites.push({
          id: i,
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(planeAngle) * speed,
          vy: Math.sin(planeAngle) * speed,
          angle: planeAngle,
          size: Math.random() * 2.0 + 4.0,
          altitude: Math.random() * 0.5 + 0.8,
          orbitalPlane: i % 3,
          signalTimer: Math.random() * 140,
          signalWaves: [],
          color: i % 3 === 0 ? BRIGHT_AMBER : i % 3 === 1 ? VIOLET : STARLIGHT,
        })
      }

      // 2. Starlink "Satellite Train" (prominent synchronized chain)
      const trainSize = isMobile ? 5 : 8
      const trainAngle = -0.28
      const startX = width * 0.1
      const startY = height * 0.3
      const trainSpeed = 0.65

      for (let j = 0; j < trainSize; j++) {
        satellites.push({
          id: 100 + j,
          x: startX - j * 54 * Math.cos(trainAngle),
          y: startY - j * 54 * Math.sin(trainAngle),
          vx: Math.cos(trainAngle) * trainSpeed,
          vy: Math.sin(trainAngle) * trainSpeed,
          angle: trainAngle,
          size: 4.8,
          altitude: 1.2,
          orbitalPlane: 99,
          signalTimer: j * 20,
          signalWaves: [],
          color: BRIGHT_AMBER,
        })
      }

      // Shooting stars
      shootingStars = Array.from({ length: 3 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 0.5,
        len: Math.random() * 100 + 80,
        speed: Math.random() * 10 + 14,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        alpha: 0,
        active: false,
      }))
    }

    initScene()

    const spawnShootingStar = () => {
      const star = shootingStars.find((s) => !s.active)
      if (star) {
        star.x = Math.random() * width * 0.85
        star.y = Math.random() * height * 0.45
        star.alpha = 1.0
        star.active = true
      }
    }

    const shootingStarInterval = setInterval(spawnShootingStar, 3200)

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // 1. Draw Space Nebular Ambient Glows
      const bgGrad1 = ctx.createRadialGradient(
        width * 0.25,
        height * 0.25,
        10,
        width * 0.25,
        height * 0.25,
        width * 0.6,
      )
      bgGrad1.addColorStop(0, "rgba(245, 190, 107, 0.12)")
      bgGrad1.addColorStop(0.5, "rgba(245, 190, 107, 0.04)")
      bgGrad1.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = bgGrad1
      ctx.fillRect(0, 0, width, height)

      const bgGrad2 = ctx.createRadialGradient(
        width * 0.8,
        height * 0.7,
        10,
        width * 0.8,
        height * 0.7,
        width * 0.55,
      )
      bgGrad2.addColorStop(0, "rgba(194, 142, 194, 0.10)")
      bgGrad2.addColorStop(0.5, "rgba(194, 142, 194, 0.03)")
      bgGrad2.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = bgGrad2
      ctx.fillRect(0, 0, width, height)

      // 2. Draw Faint Orbital Trajectory Rings Across the Sky
      ctx.strokeStyle = "rgba(245, 190, 107, 0.07)"
      ctx.lineWidth = 1.0
      ctx.setLineDash([8, 12])
      ctx.beginPath()
      ctx.ellipse(width * 0.5, height * 0.45, width * 0.7, height * 0.35, -0.3, 0, Math.PI * 2)
      ctx.stroke()

      ctx.strokeStyle = "rgba(194, 142, 194, 0.06)"
      ctx.beginPath()
      ctx.ellipse(width * 0.5, height * 0.55, width * 0.75, height * 0.4, 0.25, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])

      // 3. Draw Stars with Dynamic Twinkle
      for (const s of stars) {
        s.phase += s.twinkleSpeed
        const currentAlpha = Math.max(0.25, Math.min(1.0, s.alpha + Math.sin(s.phase) * 0.35))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)"
        ctx.shadowBlur = s.radius > 1.5 ? 6 : 0
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // 4. Draw Shooting Star Meteors
      for (const ss of shootingStars) {
        if (!ss.active) continue
        ss.x += Math.cos(ss.angle) * ss.speed
        ss.y += Math.sin(ss.angle) * ss.speed
        ss.alpha -= 0.02

        if (ss.alpha <= 0 || ss.x > width + 100 || ss.y > height + 100) {
          ss.active = false
          continue
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.len
        const tailY = ss.y - Math.sin(ss.angle) * ss.len

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y)
        grad.addColorStop(0, "rgba(245, 190, 107, 0)")
        grad.addColorStop(0.6, `${AMBER_GLOW}${ss.alpha * 0.7})`)
        grad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`)

        ctx.strokeStyle = grad
        ctx.lineWidth = 2.2
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(ss.x, ss.y)
        ctx.stroke()
      }

      // 5. Intersatellite Laser Cross-Links (Optical Mesh)
      const maxLinkDist = width < 768 ? 180 : 270

      for (let i = 0; i < satellites.length; i++) {
        const satA = satellites[i]

        for (let j = i + 1; j < satellites.length; j++) {
          const satB = satellites[j]
          const dx = satA.x - satB.x
          const dy = satA.y - satB.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < maxLinkDist) {
            const linkStrength = 1 - dist / maxLinkDist
            const strokeColor =
              satA.color === VIOLET || satB.color === VIOLET
                ? `${VIOLET_GLOW}${linkStrength * 0.55})`
                : `${AMBER_GLOW}${linkStrength * 0.65})`

            ctx.strokeStyle = strokeColor
            ctx.lineWidth = linkStrength * 1.5
            ctx.beginPath()
            ctx.moveTo(satA.x, satA.y)
            ctx.lineTo(satB.x, satB.y)
            ctx.stroke()

            // Spawn traveling laser pulses
            if (Math.random() < 0.005 && pulses.length < 35) {
              pulses.push({
                fromX: satA.x,
                fromY: satA.y,
                toX: satB.x,
                toY: satB.y,
                progress: 0,
                speed: Math.random() * 0.025 + 0.02,
                color: satA.color === VIOLET ? VIOLET : BRIGHT_AMBER,
              })
            }
          }
        }

        // 6. Cursor Ground Station Uplink / Downlink
        if (mouse.active) {
          const mdx = satA.x - mouse.x
          const mdy = satA.y - mouse.y
          const mouseDist = Math.sqrt(mdx * mdx + mdy * mdy)
          const maxMouseDist = 320

          if (mouseDist < maxMouseDist) {
            const mouseStrength = 1 - mouseDist / maxMouseDist
            const uplinkGrad = ctx.createLinearGradient(satA.x, satA.y, mouse.x, mouse.y)
            uplinkGrad.addColorStop(0, `${AMBER_GLOW}${mouseStrength * 0.95})`)
            uplinkGrad.addColorStop(1, `${AMBER_GLOW}0.15)`)

            ctx.strokeStyle = uplinkGrad
            ctx.lineWidth = mouseStrength * 2.2
            ctx.setLineDash([5, 4])
            ctx.beginPath()
            ctx.moveTo(satA.x, satA.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
            ctx.setLineDash([])
          }
        }
      }

      // 7. Update & Draw High-Speed Laser Data Pulses
      for (let pIdx = pulses.length - 1; pIdx >= 0; pIdx--) {
        const pulse = pulses[pIdx]
        pulse.progress += pulse.speed

        if (pulse.progress >= 1.0) {
          pulses.splice(pIdx, 1)
          continue
        }

        const px = pulse.fromX + (pulse.toX - pulse.fromX) * pulse.progress
        const py = pulse.fromY + (pulse.toY - pulse.fromY) * pulse.progress

        ctx.beginPath()
        ctx.arc(px, py, 2.8, 0, Math.PI * 2)
        ctx.fillStyle = pulse.color
        ctx.shadowColor = pulse.color
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // 8. Update & Draw Starlink Satellites (Solar Wings, Chassis, Radar Pulse)
      for (const sat of satellites) {
        sat.x += sat.vx
        sat.y += sat.vy

        const margin = 80
        if (sat.x > width + margin) sat.x = -margin
        if (sat.x < -margin) sat.x = width + margin
        if (sat.y > height + margin) sat.y = -margin
        if (sat.y < -margin) sat.y = height + margin

        // Radar signal wave emission
        sat.signalTimer++
        if (sat.signalTimer > 150) {
          sat.signalTimer = 0
          sat.signalWaves.push({ r: 3, alpha: 0.95 })
        }

        // Draw Expanding Signal Wave Rings
        for (let wIdx = sat.signalWaves.length - 1; wIdx >= 0; wIdx--) {
          const wave = sat.signalWaves[wIdx]
          wave.r += 0.9
          wave.alpha -= 0.014

          if (wave.alpha <= 0 || wave.r > 70) {
            sat.signalWaves.splice(wIdx, 1)
            continue
          }

          ctx.beginPath()
          ctx.arc(sat.x, sat.y, wave.r, 0, Math.PI * 2)
          ctx.strokeStyle =
            sat.color === VIOLET
              ? `${VIOLET_GLOW}${wave.alpha * 0.6})`
              : `${AMBER_GLOW}${wave.alpha * 0.7})`
          ctx.lineWidth = 1.2
          ctx.stroke()
        }

        // Draw Satellite Graphics
        ctx.save()
        ctx.translate(sat.x, sat.y)
        ctx.rotate(sat.angle)

        // Radial Glow Halo
        const aura = ctx.createRadialGradient(0, 0, 1, 0, 0, sat.size * 3.6)
        aura.addColorStop(
          0,
          sat.color === VIOLET ? `${VIOLET_GLOW}1.0)` : `${AMBER_GLOW}1.0)`,
        )
        aura.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.fillStyle = aura
        ctx.beginPath()
        ctx.arc(0, 0, sat.size * 3.6, 0, Math.PI * 2)
        ctx.fill()

        // Solar Array Wing 1 (Top Wing)
        ctx.fillStyle = BRIGHT_AMBER
        ctx.fillRect(-sat.size * 0.55, -sat.size * 2.4, sat.size * 1.1, sat.size * 1.6)

        // Solar Array Wing 2 (Bottom Wing)
        ctx.fillRect(-sat.size * 0.55, sat.size * 0.8, sat.size * 1.1, sat.size * 1.6)

        // Central Satellite Body (Chassis)
        ctx.fillStyle = STARLIGHT
        ctx.fillRect(-sat.size * 0.7, -sat.size * 0.7, sat.size * 1.4, sat.size * 1.4)

        // Optical Laser / Communication Beacon
        ctx.beginPath()
        ctx.arc(sat.size * 0.9, 0, 1.8, 0, Math.PI * 2)
        ctx.fillStyle = sat.color
        ctx.shadowColor = sat.color
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0

        ctx.restore()
      }

      // 9. Draw Cursor Ground Station Dish / Tracking Reticle
      if (mouse.active) {
        mouse.pulseRadius = (mouse.pulseRadius + 0.7) % 40
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 8 + mouse.pulseRadius * 0.6, 0, Math.PI * 2)
        ctx.strokeStyle = `${AMBER_GLOW}${Math.max(0, 0.5 - mouse.pulseRadius / 80)})`
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = BRIGHT_AMBER
        ctx.shadowColor = BRIGHT_AMBER
        ctx.shadowBlur = 12
        ctx.fill()
        ctx.shadowBlur = 0
      }

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    const handlePointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.active = true
    }

    const handlePointerLeave = () => {
      mouse.active = false
    }

    const handleResize = () => {
      initScene()
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      cancelAnimationFrame(animationFrameId)
      clearInterval(shootingStarInterval)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerleave", handlePointerLeave)
      window.removeEventListener("resize", handleResize)
    }
  }, [mounted])

  if (!mounted) {
    return (
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `radial-gradient(circle at 18% 18%, rgba(245,190,107,0.14), transparent 28%), radial-gradient(circle at 82% 75%, rgba(194,142,194,0.11), transparent 30%), #070808`,
        }}
      />
    )
  }

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full pointer-events-none"
        style={{ display: "block" }}
      />
    </div>
  )
}