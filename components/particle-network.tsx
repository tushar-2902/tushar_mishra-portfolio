"use client"

import { useEffect, useRef } from "react"

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
}

export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (canvas === null) {
      return
    }

    const context = canvas.getContext("2d")

    if (context === null) {
      return
    }

    const ctx: CanvasRenderingContext2D = context

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    let width = 0
    let height = 0
    let devicePixelRatio = Math.min(
      window.devicePixelRatio || 1,
      2
    )

    let particles: Particle[] = []
    let animationFrame = 0

    const mouse = {
      x: -9999,
      y: -9999,
    }

    const accent = "193, 182, 169"

    const resize = (): void => {
      const currentCanvas = canvasRef.current

      if (currentCanvas === null) {
        return
      }

      const rect = currentCanvas.getBoundingClientRect()

      width = rect.width
      height = rect.height

      devicePixelRatio = Math.min(
        window.devicePixelRatio || 1,
        2
      )

      currentCanvas.width = Math.floor(
        width * devicePixelRatio
      )

      currentCanvas.height = Math.floor(
        height * devicePixelRatio
      )

      ctx.setTransform(
        devicePixelRatio,
        0,
        0,
        devicePixelRatio,
        0,
        0
      )

      const particleCount = Math.min(
        70,
        Math.max(
          20,
          Math.floor((width * height) / 16000)
        )
      )

      particles = Array.from(
        { length: particleCount },
        (): Particle => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
        })
      )
    }

    const draw = (): void => {
      ctx.clearRect(0, 0, width, height)

      // Move particles
      for (const particle of particles) {
        particle.x += particle.vx
        particle.y += particle.vy

        if (
          particle.x <= 0 ||
          particle.x >= width
        ) {
          particle.vx *= -1
        }

        if (
          particle.y <= 0 ||
          particle.y >= height
        ) {
          particle.vy *= -1
        }

        const dx =
          particle.x - mouse.x

        const dy =
          particle.y - mouse.y

        const distance = Math.hypot(dx, dy)

        if (
          distance < 140 &&
          distance > 0
        ) {
          const force =
            (140 - distance) / 140

          particle.x +=
            (dx / distance) *
            force *
            1.2

          particle.y +=
            (dy / distance) *
            force *
            1.2
        }
      }

      // Draw connections
      for (
        let i = 0;
        i < particles.length;
        i++
      ) {
        for (
          let j = i + 1;
          j < particles.length;
          j++
        ) {
          const first = particles[i]
          const second = particles[j]

          const distance = Math.hypot(
            first.x - second.x,
            first.y - second.y
          )

          if (distance < 130) {
            const opacity =
              (1 - distance / 130) * 0.5

            ctx.strokeStyle = `rgba(${accent}, ${opacity})`
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(
              first.x,
              first.y
            )
            ctx.lineTo(
              second.x,
              second.y
            )
            ctx.stroke()
          }
        }
      }

      // Draw particles
      for (const particle of particles) {
        const distance = Math.hypot(
          particle.x - mouse.x,
          particle.y - mouse.y
        )

        const nearMouse = distance < 140

        ctx.beginPath()

        ctx.arc(
          particle.x,
          particle.y,
          nearMouse ? 2.6 : 1.8,
          0,
          Math.PI * 2
        )

        ctx.fillStyle = `rgba(${accent}, ${
          nearMouse ? 0.95 : 0.6
        })`

        ctx.fill()
      }

      if (!reducedMotion) {
        animationFrame =
          requestAnimationFrame(draw)
      }
    }

    const handleMouseMove = (
      event: MouseEvent
    ): void => {
      const currentCanvas =
        canvasRef.current

      if (currentCanvas === null) {
        return
      }

      const rect =
        currentCanvas.getBoundingClientRect()

      mouse.x =
        event.clientX - rect.left

      mouse.y =
        event.clientY - rect.top
    }

    const handleMouseLeave = (): void => {
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()

    window.addEventListener(
      "resize",
      resize
    )

    window.addEventListener(
      "mousemove",
      handleMouseMove
    )

    window.addEventListener(
      "mouseout",
      handleMouseLeave
    )

    draw()

    return (): void => {
      cancelAnimationFrame(
        animationFrame
      )

      window.removeEventListener(
        "resize",
        resize
      )

      window.removeEventListener(
        "mousemove",
        handleMouseMove
      )

      window.removeEventListener(
        "mouseout",
        handleMouseLeave
      )
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}
