"use client"

import { useEffect, useRef } from "react"

type Star = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: "amber" | "violet"
  featured: boolean
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

      const starCount = Math.min(
        width < 640 ? 72 : 150,
        Math.max(width < 640 ? 48 : 90, Math.floor((width * height) / 14500)),
      )
      stars = Array.from({ length: starCount }, () => createStar())
    }

    const createStar = (): Star => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.09,
        vy: (Math.random() - 0.5) * 0.09,
        size: 0.65 + Math.random() * 1.15,
        alpha: 0.28 + Math.random() * 0.42,
        color: Math.random() > 0.84 ? "violet" : "amber",
        featured: Math.random() > 0.9,
      }
    }

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)

      const pointerOffsetX = mouse.x * 3
      const pointerOffsetY = mouse.y * 3

      for (const star of stars) {
        if (!reducedMotion) {
          star.x += star.vx
          star.y += star.vy
          if (star.x < -12) star.x = width + 12
          if (star.x > width + 12) star.x = -12
          if (star.y < -12) star.y = height + 12
          if (star.y > height + 12) star.y = -12
        }
      }

      const maxLinkDistance = width < 640 ? 105 : width < 1100 ? 135 : 175
      for (let index = 0; index < stars.length; index += 1) {
        const star = stars[index]
        for (let nextIndex = index + 1; nextIndex < stars.length; nextIndex += 1) {
          const nextStar = stars[nextIndex]
          const dx = star.x - nextStar.x
          const dy = star.y - nextStar.y
          const distance = Math.hypot(dx, dy)
          if (distance >= maxLinkDistance) continue

          const strength = 1 - distance / maxLinkDistance
          const midpointX = (star.x + nextStar.x) / 2
          const midpointY = (star.y + nextStar.y) / 2
          const curve = Math.sin((time * 0.00012) + index) * 4 * strength
          const strokeAlpha = 0.025 + strength * 0.11

          context.beginPath()
          context.moveTo(star.x, star.y)
          context.quadraticCurveTo(midpointX - dy * 0.02 + curve, midpointY + dx * 0.02 + curve, nextStar.x, nextStar.y)
          context.strokeStyle = star.color === "violet" || nextStar.color === "violet"
            ? `rgba(190, 145, 207, ${strokeAlpha * 0.8})`
            : `rgba(229, 178, 93, ${strokeAlpha})`
          context.lineWidth = 0.45 + strength * 0.35
          context.stroke()
        }
      }

      for (const star of stars) {
        const px = star.x + pointerOffsetX
        const py = star.y + pointerOffsetY
        const twinkle = 0.86 + Math.sin(time * 0.0012 + star.x) * 0.14
        const radius = star.size * (star.featured ? 1.35 : 1)
        const color = star.color === "violet" ? "190, 145, 207" : "229, 178, 93"

        if (star.featured) {
          context.beginPath()
          context.arc(px, py, radius * 4.5, 0, Math.PI * 2)
          context.fillStyle = `rgba(${color}, ${0.045 * twinkle})`
          context.fill()
        }
        context.beginPath()
        context.arc(px, py, radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(${color}, ${star.alpha * twinkle})`
        context.shadowBlur = star.featured ? 8 : 3
        context.shadowColor = `rgba(${color}, 0.55)`
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

    animationFrame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerleave", handlePointerLeave)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 -z-10 h-screen w-screen" />
}