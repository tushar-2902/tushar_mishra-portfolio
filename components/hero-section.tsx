"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons"
import { ParticleNetwork } from "@/components/particle-network"
import { getTechIcon } from "@/components/tech-icon"
import { heroTech, profile } from "@/lib/portfolio-data"

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-20"
    >
      <div className="absolute inset-0 grid-bg opacity-60" aria-hidden="true" />
      <ParticleNetwork />

      <div
        className="absolute left-1/2 top-1/3 -z-0 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]"
        aria-hidden="true"
      />

      <div
        className="absolute right-10 bottom-20 -z-0 h-72 w-72 rounded-full bg-accent/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Content */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Azure • Kubernetes • Terraform • GitHub Actions • DevSecOps
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
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] glow-primary"
            >
              Resume
            </a>

            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-medium transition-colors hover:bg-foreground/10"
            >
              View Projects
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>

            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-medium transition-colors hover:bg-foreground/10"
            >
              <GithubIcon className="size-4" />
              GitHub
            </a>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl glass p-4 text-center transition hover:scale-105">
              <h3 className="text-xl font-bold text-primary">1.5+</h3>
              <p className="text-xs text-muted-foreground">
                Years Experience
              </p>
            </div>

            <div className="rounded-xl glass p-4 text-center transition hover:scale-105">
              <h3 className="text-xl font-bold text-primary">AZ-104</h3>
              <p className="text-xs text-muted-foreground">
                Microsoft Certified
              </p>
            </div>

            <div className="rounded-xl glass p-4 text-center transition hover:scale-105">
              <h3 className="text-xl font-bold text-primary">15+</h3>
              <p className="text-xs text-muted-foreground">
                Cloud & DevOps Tools
              </p>
            </div>

            <div className="rounded-xl glass p-4 text-center transition hover:scale-105">
              <h3 className="text-xl font-bold text-primary">Azure & AWS</h3>
              <p className="text-xs text-muted-foreground">
                Cloud Platforms
              </p>
            </div>
          </div>

          {/* Social Icons */}
          <div className="mt-6 flex items-center gap-3">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="flex size-10 items-center justify-center rounded-xl glass text-muted-foreground transition-colors hover:text-primary"
            >
              <GithubIcon className="size-5" />
            </a>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex size-10 items-center justify-center rounded-xl glass text-muted-foreground transition-colors hover:text-primary"
            >
              <LinkedinIcon className="size-5" />
            </a>
          </div>

          <div className="mt-4">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              View My GitHub Projects →
            </a>
          </div>
        </div>

        {/* Floating Tech Orbit */}
        <div className="relative mx-auto hidden aspect-square w-full max-w-md lg:block">
          <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-foreground/10" />
          <div className="absolute inset-12 animate-spin-slow rounded-full border border-dashed border-foreground/10 [animation-direction:reverse]" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-28 flex-col items-center justify-center rounded-2xl glass text-center glow-primary">
              <span className="text-2xl font-semibold text-primary">∞</span>
              <span className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                CI / CD
              </span>
            </div>
          </div>

          {heroTech.map((tech, i) => {
            const Icon = getTechIcon(tech)
            const angle = (i / heroTech.length) * Math.PI * 2
            const radius = 46
            const x = 50 + Math.cos(angle) * radius
            const y = 50 + Math.sin(angle) * radius

            return (
              <div
                key={tech}
                className="absolute"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div
                  className="animate-float-slow"
                  style={{ animationDelay: `${i * 0.4}s` }}
                >
                  <div className="group flex size-16 flex-col items-center justify-center gap-1 rounded-2xl glass transition-colors hover:bg-primary/15">
                    <Icon className="size-5 text-primary" />
                    <span className="text-[9px] font-medium text-muted-foreground">
                      {tech}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
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