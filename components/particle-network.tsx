"use client"

import { useEffect, useRef } from "react"

type Node = {
  x: number
  y: number
  vx: number
  vy: number
}

export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let nodes: Node[] = []

    const mouse = {
      x: -9999,
      y: -9999,
    }

    let frame = 0

    const accent = "120, 190, 255"

    function resize() {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()

      width = rect.width
      height = rect.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = width * dpr
      canvas.height = height * dpr

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(
        70,
        Math.floor((width * height) / 16000),
      )

      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, width, height)

      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy

        if (n.x < 0 || n.x > width) {
          n.vx *= -1
        }

        if (n.y < 0 || n.y > height) {
          n.vy *= -1
        }

        const dxm = n.x - mouse.x
        const dym = n.y - mouse.y
        const distM = Math.hypot(dxm, dym)

        if (distM < 140 && distM > 0) {
          const force = (140 - distM) / 140

          n.x += (dxm / distM) * force * 1.2
          n.y += (dym / distM) * force * 1.2
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]

          const dist = Math.hypot(
            a.x - b.x,
            a.y - b.y,
          )

          if (dist < 130) {
            const opacity = (1 - dist / 130) * 0.5

            ctx.strokeStyle = `rgba(${accent}, ${opacity})`
            ctx.lineWidth = 1

            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      for (const n of nodes) {
        const near =
          Math.hypot(
            n.x - mouse.x,
            n.y - mouse.y,
          ) < 140

        ctx.beginPath()

        ctx.arc(
          n.x,
          n.y,
          near ? 2.6 : 1.8,
          0,
          Math.PI * 2,
        )

        ctx.fillStyle = `rgba(${accent}, ${
          near ? 0.95 : 0.6
        })`

        ctx.fill()
      }

      if (!prefersReduced) {
        frame = requestAnimationFrame(draw)
      }
    }

    function onMove(e: MouseEvent) {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()

      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    function onLeave() {
      mouse.x = -9999
      mouse.y = -9999
    }

    resize()

    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseout", onLeave)

    draw()

    return () => {
      cancelAnimationFrame(frame)

      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseout", onLeave)
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
