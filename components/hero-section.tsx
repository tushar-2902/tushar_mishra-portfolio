"use client"

import { useEffect, useRef } from "react"
import { ArrowRight, Sparkles, Terminal } from "lucide-react"
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons"
import { getTechIcon } from "@/components/tech-icon"
import { TiltCard } from "@/components/tilt-card"
import { heroTech, profile, stats } from "@/lib/portfolio-data"
import TypingTerminal from "@/components/typing-terminal"

type Particle = {
  x: number
  y: number
  r: number
  alpha: number
  drift: number
  twinkle: number
}

type Satellite = {
  x: number
  y: number
  baseX: number
  baseY: number
  radiusX: number
  radiusY: number
  phase: number
  speed: number
  size: number
  alpha: number
  angle: number
}

function HeroConstellation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (reduceMotionQuery.matches) {
      const resize = () => {
        const rect = canvas.getBoundingClientRect()
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = Math.max(1, Math.floor(rect.width * dpr))
        canvas.height = Math.max(1, Math.floor(rect.height * dpr))
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

        const width = rect.width
        const height = rect.height

        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = "rgba(15, 18, 22, 0.18)"
        ctx.fillRect(0, 0, width, height)

        const starCount = Math.max(24, Math.min(48, Math.floor((width * height) / 70)))
        for (let i = 0; i < starCount; i += 1) {
          const x = Math.random() * width
          const y = Math.random() * height
          const r = Math.random() * 1.8 + 0.8
          ctx.beginPath()
          ctx.arc(x, y, r, 0, Math.PI * 2)
          ctx.fillStyle = "rgba(255,255,255,0.4)"
          ctx.fill()
        }
      }

      resize()
      return () => undefined
    }

    let width = 0
    let height = 0
    let frameId = 0
    let pointerX = 0
    let pointerY = 0
    let pointerActive = false
    let particles: Particle[] = []
    let satellites: Satellite[] = []

    const initScene = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const isMobile = width < 768
      const isTablet = width < 1200
      const particleCount = isMobile ? 40 : isTablet ? 75 : 110
      const satelliteCount = isMobile ? 7 : isTablet ? 11 : 16

      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.7,
        alpha: Math.random() * 0.55 + 0.25,
        drift: Math.random() * Math.PI * 2,
        twinkle: Math.random() * 0.03 + 0.015,
      }))

      satellites = Array.from({ length: satelliteCount }, (_, index) => {
        const orbitX = width * (0.18 + Math.random() * 0.64)
        const orbitY = height * (0.2 + Math.random() * 0.55)
        const radiusX = width * (0.08 + Math.random() * 0.22)
        const radiusY = height * (0.08 + Math.random() * 0.14)

        return {
          x: orbitX,
          y: orbitY,
          baseX: orbitX,
          baseY: orbitY,
          radiusX,
          radiusY,
          phase: index * 1.35 + Math.random() * Math.PI,
          speed: (0.00035 + Math.random() * 0.0008) * (isMobile ? 0.8 : 1),
          size: isMobile ? 2.1 : 2.6,
          alpha: 0.6 + Math.random() * 0.35,
          angle: Math.random() * Math.PI * 2,
        }
      })
    }

    const drawOrbits = () => {
      const orbitStyles = [
        { color: "rgba(245, 190, 107, 0.12)", offset: 0 },
        { color: "rgba(194, 142, 194, 0.10)", offset: 0.7 },
        { color: "rgba(255,255,255,0.08)", offset: 1.3 },
      ]

      orbitStyles.forEach(({ color, offset }) => {
        ctx.beginPath()
        ctx.ellipse(
          width * (0.5 + offset * 0.05),
          height * (0.48 + offset * 0.03),
          width * (0.2 + offset * 0.08),
          height * (0.18 + offset * 0.05),
          -0.2 + offset * 0.15,
          0,
          Math.PI * 2,
        )
        ctx.strokeStyle = color
        ctx.lineWidth = 1
        ctx.stroke()
      })
    }

    const drawParticles = (time: number) => {
      for (const particle of particles) {
        const driftX = pointerActive ? (pointerX - width / 2) * 0.03 : 0
        const driftY = pointerActive ? (pointerY - height / 2) * 0.03 : 0
        const x = particle.x + Math.sin(time * particle.twinkle + particle.drift) * 4 + driftX * 0.7
        const y = particle.y + Math.cos(time * particle.twinkle * 1.25 + particle.drift) * 4 + driftY * 0.7

        ctx.beginPath()
        ctx.arc(x, y, particle.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${particle.alpha})`
        ctx.shadowBlur = particle.r > 1.4 ? 10 : 4
        ctx.shadowColor = "rgba(255,255,255,0.75)"
        ctx.fill()
      }

      ctx.shadowBlur = 0
    }

    const drawConnections = () => {
      for (let i = 0; i < satellites.length; i += 1) {
        const satA = satellites[i]
        for (let j = i + 1; j < satellites.length; j += 1) {
          const satB = satellites[j]
          const dx = satA.x - satB.x
          const dy = satA.y - satB.y
          const distance = Math.hypot(dx, dy)
          const maxDistance = width < 768 ? 120 : width < 1200 ? 150 : 200

          if (distance < maxDistance) {
            const strength = 1 - distance / maxDistance
            ctx.beginPath()
            ctx.moveTo(satA.x, satA.y)
            ctx.lineTo(satB.x, satB.y)
            ctx.strokeStyle = `rgba(245, 190, 107, ${0.12 + strength * 0.22})`
            ctx.lineWidth = 0.8 + strength * 0.9
            ctx.stroke()
          }
        }
      }
    }

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height)

      const glow = ctx.createRadialGradient(
        width * 0.42,
        height * 0.3,
        20,
        width * 0.42,
        height * 0.3,
        width * 0.7,
      )
      glow.addColorStop(0, "rgba(245, 190, 107, 0.18)")
      glow.addColorStop(0.45, "rgba(194, 142, 194, 0.08)")
      glow.addColorStop(1, "rgba(6, 9, 12, 0)")
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, width, height)

      drawOrbits()

      const driftX = pointerActive ? (pointerX - width / 2) * 0.08 : 0
      const driftY = pointerActive ? (pointerY - height / 2) * 0.06 : 0

      for (const sat of satellites) {
        sat.phase += sat.speed
        sat.x = sat.baseX + Math.cos(sat.phase) * sat.radiusX + driftX * 0.9
        sat.y = sat.baseY + Math.sin(sat.phase * 1.25 + sat.angle) * sat.radiusY + driftY * 0.8

        ctx.beginPath()
        ctx.fillStyle = `rgba(245, 190, 107, ${sat.alpha})`
        ctx.shadowBlur = 14
        ctx.shadowColor = "rgba(245, 190, 107, 0.8)"
        ctx.arc(sat.x, sat.y, sat.size, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.fillStyle = "rgba(255,255,255,0.9)"
        ctx.arc(sat.x + sat.size * 0.3, sat.y - sat.size * 0.2, sat.size * 0.42, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.shadowBlur = 0
      drawConnections()
      drawParticles(time)

      frameId = window.requestAnimationFrame(render)
    }

    initScene()
    frameId = window.requestAnimationFrame(render)

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX - (canvas.getBoundingClientRect().left || 0)
      pointerY = event.clientY - (canvas.getBoundingClientRect().top || 0)
      pointerActive = true
    }

    const handlePointerLeave = () => {
      pointerActive = false
    }

    const handleResize = () => {
      initScene()
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerleave", handlePointerLeave)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full opacity-80" />
    </div>
  )
}

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen items-center pt-28 pb-20"
    >
      <HeroConstellation />
      <div className="absolute inset-0 bg-grid opacity-30" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Content */}
        <div>
          {/* Live Availability & Tech Stack Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary shadow-[0_0_24px_rgba(229,178,93,0.15)]">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Available for Cloud & DevOps Roles
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-3 text-primary" />
              AZ-104 Certified
            </div>
          </div>

          <h1 className="mt-6 text-balance text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-gradient">{profile.name}</span>
          </h1>

          <p className="mt-3 text-2xl font-medium text-foreground/90 sm:text-3xl">
            {profile.role}
          </p>

          <p className="mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            <span className="font-medium text-primary">
              {profile.certLine}
            </span>
            <br className="hidden sm:block" />
            {profile.experienceLine}
            <br className="hidden sm:block" />
            Building scalable cloud infrastructure, Kubernetes platforms,
            CI/CD pipelines, Terraform automation, and DevSecOps solutions
            across Azure and AWS environments.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="/Tushar-Mishra-Resume.pdf"
              download
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(229,178,93,0.35)]"
            >
              Resume
            </a>

            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-medium transition-all duration-200 hover:bg-white/10 hover:border-primary/30"
            >
              View Projects
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 text-primary" />
            </a>

            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-medium transition-colors hover:bg-white/10 hover:text-primary"
            >
              <GithubIcon className="size-4" />
              GitHub
            </a>
          </div>

          {/* Stats Cards */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <TiltCard
                key={s.label}
                className="rounded-2xl glass p-4 text-center border border-white/10 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_16px_40px_rgba(229,178,93,0.12)]"
              >
                <h3 className="text-2xl font-bold text-primary">{s.value}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </TiltCard>
            ))}
          </div>

          {/* Social Icons & GitHub Direct Link */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="flex size-10 items-center justify-center rounded-xl glass text-muted-foreground transition-colors hover:text-primary hover:border-primary/30"
            >
              <GithubIcon className="size-5" />
            </a>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex size-10 items-center justify-center rounded-xl glass text-muted-foreground transition-colors hover:text-primary hover:border-primary/30"
            >
              <LinkedinIcon className="size-5" />
            </a>

            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline ml-2"
            >
              View My GitHub Projects →
            </a>
          </div>
        </div>

        {/* Desktop: Modern Interactive DevOps Terminal */}
        <div className="relative mx-auto hidden w-full max-w-lg lg:block">
          <div
            className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/20 via-accent/15 to-primary/10 blur-xl opacity-60"
            aria-hidden="true"
          />
          <TypingTerminal className="relative" />
        </div>

        {/* Mobile Tech Chips */}
        <div className="flex flex-wrap gap-2 lg:hidden">
          {heroTech.map((tech) => {
            const Icon = getTechIcon(tech)

            return (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 rounded-lg glass px-3 py-1.5 text-xs text-muted-foreground"
              >
                <Icon className="size-3.5 text-primary" />
                {tech}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}