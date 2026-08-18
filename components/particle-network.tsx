"use client"

import { useEffect, useRef } from "react"

type Star = {
  x: number
  y: number
  z: number
  size: number
  speed: number
  alpha: number
  color: string
}

export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const mouse = { x: 0, y: 0 }

    let width = 0
    let height = 0
    let animationFrame = 0
    let stars: Star[] = []

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const starCount = Math.min(220, Math.max(120, Math.floor((width * height) / 14)))
      stars = Array.from({ length: starCount }, () => createStar())
    }

    const createStar = (): Star => {
      const depth = Math.random()
      const x = (Math.random() - 0.5) * 2
      const y = (Math.random() - 0.5) * 2
      const size = 0.8 + Math.random() * 2.8 + (1 - depth) * 1.8
      const speed = 0.1 + (1 - depth) * 0.8

      return {
        x,
        y,
        z: depth,
        size,
        speed,
        alpha: 0.3 + Math.random() * 0.7,
        color: Math.random() > 0.82 ? "rgba(151, 206, 255, 1)" : "rgba(220, 244, 255, 1)",
      }
    }

    const resetStar = (star: Star) => {
      star.x = (Math.random() - 0.5) * 2
      star.y = (Math.random() - 0.5) * 2
      star.z = 1
      star.size = 0.8 + Math.random() * 2.8
      star.speed = 0.1 + Math.random() * 0.7
      star.alpha = 0.25 + Math.random() * 0.75
    }

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)
      context.fillStyle = "rgba(8, 13, 18, 0.18)"
      context.fillRect(0, 0, width, height)

      const parallaxX = mouse.x * 0.18
      const parallaxY = mouse.y * 0.18

      for (const star of stars) {
        if (reducedMotion) {
          star.z = Math.max(0.1, star.z - 0.002)
        } else {
          star.z = Math.max(0.08, star.z - star.speed * 0.012)
        }

        if (star.z <= 0.08) {
          resetStar(star)
        }

        const perspective = 1.2 / star.z
        const offsetX = (star.x + parallaxX * (1.15 - star.z)) * width * 0.62 * perspective
        const offsetY = (star.y + parallaxY * (1.15 - star.z)) * height * 0.62 * perspective

        const px = width / 2 + offsetX
        const py = height / 2 + offsetY

        const radius = Math.max(0.6, star.size * perspective)
        const alpha = Math.min(1, star.alpha * (0.5 + perspective * 0.75))

        if (px < -20 || px > width + 20 || py < -20 || py > height + 20) {
          resetStar(star)
          continue
        }

        context.beginPath()
        context.arc(px, py, radius, 0, Math.PI * 2)
        context.fillStyle = star.color.replace(/1\)$/, `${alpha})`)
        context.shadowBlur = radius * 2.4
        context.shadowColor = "rgba(120, 214, 255, 0.5)"
        context.fill()
      }

      context.shadowBlur = 0

      if (!reducedMotion) {
        animationFrame = requestAnimationFrame(draw)
      } else {
        cancelAnimationFrame(animationFrame)
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      mouse.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    }

    const handlePointerLeave = () => {
      mouse.x = 0
      mouse.y = 0
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerleave", handlePointerLeave)

    if (!reducedMotion) {
      animationFrame = requestAnimationFrame(draw)
    } else {
      draw(0)
    }

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerleave", handlePointerLeave)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 -z-10 h-screen w-screen" />
}