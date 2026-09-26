"use client"

import { useEffect, useRef } from "react"

const COLOR_AMBER = "198, 148, 68"
const COLOR_AMBER_BRIGHT = "218, 169, 82"
const COLOR_VIOLET = "177, 125, 171"

interface ConstellationNode {
  x: number
  y: number
  z: number
  phase: number
  driftX: number
  driftY: number
  size: number
  alpha: number
  color: "amber" | "violet"
  glow: boolean
}

export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const motionMultiplier = 1.35

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let width = 0
    let height = 0
    let animationFrame = 0
    let nodes: ConstellationNode[] = []

    const mouse = {
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0,
    }

    const createNodes = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width || window.innerWidth
      height = rect.height || window.innerHeight

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = width < 768 ? 29 : 45
      const generated: ConstellationNode[] = []

      for (let i = 0; i < count; i += 1) {
        const rand = Math.random()
        const color: ConstellationNode["color"] = rand < 0.72 ? "amber" : "violet"

        generated.push({
          x: width * (0.08 + Math.random() * 0.84),
          y: height * (0.08 + Math.random() * 0.84),
          z: 0.35 + Math.random() * 0.8,
          phase: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 8,
          driftY: (Math.random() - 0.5) * 8,
          size: 0.85 + Math.random() * 0.8,
          alpha: 0.28 + Math.random() * 0.2,
          color,
          glow: Math.random() > 0.82,
        })
      }

      nodes = generated
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height)

      mouse.currentX += (mouse.targetX - mouse.currentX) * 0.04
      mouse.currentY += (mouse.targetY - mouse.currentY) * 0.04

      const glowA = ctx.createRadialGradient(
        width * 0.24,
        height * 0.18,
        10,
        width * 0.24,
        height * 0.18,
        width * 0.7,
      )
      glowA.addColorStop(0, "rgba(229, 180, 104, 0.08)")
      glowA.addColorStop(0.4, "rgba(177, 125, 171, 0.032)")
      glowA.addColorStop(1, "rgba(8, 9, 11, 0)")
      ctx.fillStyle = glowA
      ctx.fillRect(0, 0, width, height)

      const projected = nodes.map((node) => {
        const driftX = reducedMotion
          ? 0
          : Math.sin(time * 0.00017 * motionMultiplier + node.phase) * 8 + node.driftX * 0.2
        const driftY = reducedMotion
          ? 0
          : Math.cos(time * 0.0002 * motionMultiplier + node.phase) * 8 + node.driftY * 0.2

        const parallaxX = node.x + driftX + mouse.currentX * 14 * node.z
        const parallaxY = node.y + driftY + mouse.currentY * 12 * node.z

        return {
          ...node,
          px: parallaxX,
          py: parallaxY,
        }
      })

      const linkDistance = width < 768 ? 118 : 160

      for (let i = 0; i < projected.length; i += 1) {
        const a = projected[i]

        for (let j = i + 1; j < projected.length; j += 1) {
          const b = projected[j]
          const dx = a.px - b.px
          const dy = a.py - b.py
          const dist = Math.hypot(dx, dy)

          if (dist < linkDistance) {
            const strength = 1 - dist / linkDistance
            const alpha = (0.075 + strength * 0.15) * (0.65 + a.z * 0.35)
            const isViolet = a.color === "violet" || b.color === "violet"
            const lineColor = isViolet ? COLOR_VIOLET : COLOR_AMBER

            ctx.beginPath()
            ctx.moveTo(a.px, a.py)
            ctx.lineTo(b.px, b.py)
            ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`
            ctx.lineWidth = 0.35 + strength * 0.7
            ctx.stroke()
          }
        }
      }

      for (const node of projected) {
        const isViolet = node.color === "violet"
        const rgb = isViolet ? COLOR_VIOLET : COLOR_AMBER
        const glowRgb = isViolet ? COLOR_VIOLET : COLOR_AMBER_BRIGHT
        const radius = node.size * (0.9 + node.z * 1.2)

        if (node.glow) {
          const halo = radius * 2.8
          ctx.beginPath()
          ctx.arc(node.px, node.py, halo, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${rgb}, ${node.alpha * 0.05})`
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(node.px, node.py, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${glowRgb}, ${node.alpha * 0.75})`
        if (node.glow) {
          ctx.shadowColor = `rgba(${rgb}, 0.35)`
          ctx.shadowBlur = 3
        }
        ctx.fill()
        ctx.shadowBlur = 0
      }

      if (!reducedMotion) {
        animationFrame = window.requestAnimationFrame(draw)
      } else {
        window.cancelAnimationFrame(animationFrame)
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

    createNodes()
    window.addEventListener("resize", createNodes)
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true })
    animationFrame = window.requestAnimationFrame(draw)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", createNodes)
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
