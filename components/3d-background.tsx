"use client"

import { useEffect, useRef, useState } from "react"

const AMBER = "#e5b468"
const VIOLET = "#b17db1"
const STARLIGHT = "#ffffff"
const AMBER_GLOW = "rgba(229, 180, 104, "
const VIOLET_GLOW = "rgba(177, 125, 171, "

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

    // Stars
    let stars: Star[] = []
    // Satellites (Starlink Constellation)
    let satellites: Satellite[] = []
    // Laser Pulses
    let pulses: LaserPulse[] = []
    // Shooting Stars
    let shootingStars: ShootingStar[] = []

    const initScene = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Initialize Stars
      const starCount = Math.floor((width * height) / 4500)
      stars = Array.from({ length: Math.max(120, starCount) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() < 0.85 ? Math.random() * 1.2 + 0.4 : Math.random() * 2.0 + 1.2,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        phase: Math.random() * Math.PI * 2,
      }))

      // Initialize Satellites (Multi-plane Starlink Constellation + Satellite Trains)
      const isMobile = width < 768
      const satCount = isMobile ? 18 : 34
      satellites = []

      // 1. Orbital Plane Satellites
      for (let i = 0; i < satCount; i++) {
        const planeAngle = (Math.PI / 4) * (i % 4 === 0 ? 0.3 : i % 4 === 1 ? -0.4 : 0.6)
        const speed = Math.random() * 0.45 + 0.35
        satellites.push({
          id: i,
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(planeAngle) * speed,
          vy: Math.sin(planeAngle) * speed,
          angle: planeAngle,
          size: Math.random() * 1.5 + 3.0,
          altitude: Math.random() * 0.5 + 0.8,
          orbitalPlane: i % 3,
          signalTimer: Math.random() * 180,
          signalWaves: [],
          color: i % 3 === 0 ? AMBER : i % 3 === 1 ? VIOLET : STARLIGHT,
        })
      }

      // 2. Starlink "Train" (Synchronized row of satellites moving together)
      const trainSize = isMobile ? 4 : 7
      const trainAngle = -0.32
      const startX = width * 0.15
      const startY = height * 0.35
      const trainSpeed = 0.55

      for (let j = 0; j < trainSize; j++) {
        satellites.push({
          id: 100 + j,
          x: startX - j * 48 * Math.cos(trainAngle),
          y: startY - j * 48 * Math.sin(trainAngle),
          vx: Math.cos(trainAngle) * trainSpeed,
          vy: Math.sin(trainAngle) * trainSpeed,
          angle: trainAngle,
          size: 3.5,
          altitude: 1.1,
          orbitalPlane: 99,
          signalTimer: j * 25,
          signalWaves: [],
          color: AMBER,
        })
      }

      // Shooting stars
      shootingStars = Array.from({ length: 2 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 0.5,
        len: Math.random() * 80 + 60,
        speed: Math.random() * 8 + 12,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        alpha: 0,
        active: false,
      }))
    }

    initScene()

    let lastTime = performance.now()

    const spawnShootingStar = () => {
      const star = shootingStars.find((s) => !s.active)
      if (star) {
        star.x = Math.random() * width * 0.8
        star.y = Math.random() * height * 0.4
        star.alpha = 1.0
        star.active = true
      }
    }

    const shootingStarInterval = setInterval(spawnShootingStar, 4500)

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      ctx.clearRect(0, 0, width, height)

      // 1. Draw Deep Space Background Glows
      const bgGrad1 = ctx.createRadialGradient(
        width * 0.2,
        height * 0.2,
        20,
        width * 0.2,
        height * 0.2,
        width * 0.55,
      )
      bgGrad1.addColorStop(0, "rgba(229, 180, 104, 0.08)")
      bgGrad1.addColorStop(1, "rgba(7, 8, 8, 0)")
      ctx.fillStyle = bgGrad1
      ctx.fillRect(0, 0, width, height)

      const bgGrad2 = ctx.createRadialGradient(
        width * 0.8,
        height * 0.75,
        20,
        width * 0.8,
        height * 0.75,
        width * 0.5,
      )
      bgGrad2.addColorStop(0, "rgba(177, 125, 171, 0.07)")
      bgGrad2.addColorStop(1, "rgba(7, 8, 8, 0)")
      ctx.fillStyle = bgGrad2
      ctx.fillRect(0, 0, width, height)

      // 2. Draw Stars with Twinkling
      for (const s of stars) {
        s.phase += s.twinkleSpeed
        const currentAlpha = Math.max(0.2, Math.min(1.0, s.alpha + Math.sin(s.phase) * 0.25))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`
        ctx.fill()
      }

      // 3. Draw Shooting Stars
      for (const ss of shootingStars) {
        if (!ss.active) continue
        ss.x += Math.cos(ss.angle) * ss.speed
        ss.y += Math.sin(ss.angle) * ss.speed
        ss.alpha -= 0.018

        if (ss.alpha <= 0 || ss.x > width + 100 || ss.y > height + 100) {
          ss.active = false
          continue
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.len
        const tailY = ss.y - Math.sin(ss.angle) * ss.len

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y)
        grad.addColorStop(0, "rgba(229, 180, 104, 0)")
        grad.addColorStop(0.7, `${AMBER_GLOW}${ss.alpha * 0.6})`)
        grad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`)

        ctx.strokeStyle = grad
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(ss.x, ss.y)
        ctx.stroke()
      }

      // 4. Update & Draw Intersatellite Laser Mesh (ISLs)
      const maxLinkDist = width < 768 ? 160 : 240

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
                ? `${VIOLET_GLOW}${linkStrength * 0.4})`
                : `${AMBER_GLOW}${linkStrength * 0.45})`

            // Laser beam line
            ctx.strokeStyle = strokeColor
            ctx.lineWidth = linkStrength * 1.2
            ctx.beginPath()
            ctx.moveTo(satA.x, satA.y)
            ctx.lineTo(satB.x, satB.y)
            ctx.stroke()

            // Random laser pulse spawn
            if (Math.random() < 0.0035 && pulses.length < 25) {
              pulses.push({
                fromX: satA.x,
                fromY: satA.y,
                toX: satB.x,
                toY: satB.y,
                progress: 0,
                speed: Math.random() * 0.02 + 0.015,
                color: satA.color === VIOLET ? VIOLET : AMBER,
              })
            }
          }
        }

        // 5. Cursor Ground Station Uplink / Downlink
        if (mouse.active) {
          const mdx = satA.x - mouse.x
          const mdy = satA.y - mouse.y
          const mouseDist = Math.sqrt(mdx * mdx + mdy * mdy)
          const maxMouseDist = 280

          if (mouseDist < maxMouseDist) {
            const mouseStrength = 1 - mouseDist / maxMouseDist
            const uplinkGrad = ctx.createLinearGradient(satA.x, satA.y, mouse.x, mouse.y)
            uplinkGrad.addColorStop(0, `${AMBER_GLOW}${mouseStrength * 0.8})`)
            uplinkGrad.addColorStop(1, `${AMBER_GLOW}0.05)`)

            ctx.strokeStyle = uplinkGrad
            ctx.lineWidth = mouseStrength * 1.8
            ctx.setLineDash([4, 4])
            ctx.beginPath()
            ctx.moveTo(satA.x, satA.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.stroke()
            ctx.setLineDash([])
          }
        }
      }

      // 6. Update and Draw Laser Data Pulses
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
        ctx.arc(px, py, 2.2, 0, Math.PI * 2)
        ctx.fillStyle = pulse.color
        ctx.shadowColor = pulse.color
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // 7. Update and Draw Starlink Satellites
      for (const sat of satellites) {
        // Move satellites
        sat.x += sat.vx
        sat.y += sat.vy

        // Wrap around screen boundaries with margin
        const margin = 80
        if (sat.x > width + margin) sat.x = -margin
        if (sat.x < -margin) sat.x = width + margin
        if (sat.y > height + margin) sat.y = -margin
        if (sat.y < -margin) sat.y = height + margin

        // Signal wave emission (Starlink phased-array radar beacon)
        sat.signalTimer++
        if (sat.signalTimer > 180) {
          sat.signalTimer = 0
          sat.signalWaves.push({ r: 2, alpha: 0.85 })
        }

        // Draw Expanding Signal Waves
        for (let wIdx = sat.signalWaves.length - 1; wIdx >= 0; wIdx--) {
          const wave = sat.signalWaves[wIdx]
          wave.r += 0.8
          wave.alpha -= 0.015

          if (wave.alpha <= 0 || wave.r > 60) {
            sat.signalWaves.splice(wIdx, 1)
            continue
          }

          ctx.beginPath()
          ctx.arc(sat.x, sat.y, wave.r, 0, Math.PI * 2)
          ctx.strokeStyle =
            sat.color === VIOLET
              ? `${VIOLET_GLOW}${wave.alpha * 0.5})`
              : `${AMBER_GLOW}${wave.alpha * 0.6})`
          ctx.lineWidth = 1.0
          ctx.stroke()
        }

        // Draw Satellite Graphics: Central Bus + Solar Array Wings + Antenna
        ctx.save()
        ctx.translate(sat.x, sat.y)
        ctx.rotate(sat.angle)

        // Glow Aura
        const aura = ctx.createRadialGradient(0, 0, 1, 0, 0, sat.size * 3.2)
        aura.addColorStop(
          0,
          sat.color === VIOLET ? `${VIOLET_GLOW}0.9)` : `${AMBER_GLOW}0.95)`,
        )
        aura.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.fillStyle = aura
        ctx.beginPath()
        ctx.arc(0, 0, sat.size * 3.2, 0, Math.PI * 2)
        ctx.fill()

        // Solar Array Wing 1 (Top Wing)
        ctx.fillStyle = AMBER
        ctx.fillRect(-sat.size * 0.5, -sat.size * 2.2, sat.size, sat.size * 1.5)

        // Solar Array Wing 2 (Bottom Wing)
        ctx.fillRect(-sat.size * 0.5, sat.size * 0.7, sat.size, sat.size * 1.5)

        // Central Satellite Bus (Main Body)
        ctx.fillStyle = STARLIGHT
        ctx.fillRect(-sat.size * 0.65, -sat.size * 0.65, sat.size * 1.3, sat.size * 1.3)

        // Optical Laser / Antenna Point
        ctx.beginPath()
        ctx.arc(sat.size * 0.8, 0, 1.4, 0, Math.PI * 2)
        ctx.fillStyle = sat.color
        ctx.fill()

        ctx.restore()
      }

      // 8. Draw Cursor Ground Station Dish / Hologram Ring
      if (mouse.active) {
        mouse.pulseRadius = (mouse.pulseRadius + 0.6) % 36
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 6 + mouse.pulseRadius * 0.5, 0, Math.PI * 2)
        ctx.strokeStyle = `${AMBER_GLOW}${Math.max(0, 0.4 - mouse.pulseRadius / 90)})`
        ctx.lineWidth = 1.2
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = AMBER
        ctx.shadowColor = AMBER
        ctx.shadowBlur = 10
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
          background: `radial-gradient(circle at 18% 18%, rgba(229,180,104,0.14), transparent 28%), radial-gradient(circle at 82% 75%, rgba(177,125,171,0.11), transparent 30%), #070808`,
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