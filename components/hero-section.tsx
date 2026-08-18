"use client"

import { ArrowRight, Sparkles, Terminal } from "lucide-react"
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons"
import { getTechIcon } from "@/components/tech-icon"
import { TiltCard } from "@/components/tilt-card"
import { heroTech, profile, stats } from "@/lib/portfolio-data"
import TypingTerminal from "@/components/typing-terminal"

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center pt-28 pb-20"
    >
      <div className="absolute inset-0 bg-grid opacity-30" aria-hidden="true" />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
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