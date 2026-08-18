"use client"

import { ArrowDown, ArrowRight, Zap } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { SectionHeading } from "@/components/section-heading"
import { getTechIcon } from "@/components/tech-icon"
import { pipeline } from "@/lib/portfolio-data"
import { useState } from "react"

const iconFor: Record<string, string> = {
  Developer: "Bash",
  GitHub: "GitHub Actions",
  "GitHub Actions": "GitHub Actions",
  "Docker Build": "Docker",
  "Container Registry": "Container Registry",
  Kubernetes: "Kubernetes",
  "Monitoring Stack": "Prometheus",
  Production: "AWS",
}

export function ArchitectureSection() {
  const [active, setActive] = useState<number | null>(0)

  const descriptions: Record<string, string> = {
    Developer: "Code written with Git pre-commit security hooks, linting, and unit tests.",
    GitHub: "Main branch protection, peer PR review approvals, and automated webhooks.",
    "GitHub Actions": "CI pipeline executes Terraform validate, SonarQube scan, and image build.",
    "Docker Build": "Multi-stage distroless Docker image created with minimal attack surface.",
    "Container Registry": "Azure Container Registry (ACR) vulnerability scanning with Trivy.",
    Kubernetes: "Azure Kubernetes Service (AKS) cluster managed with Helm and GitOps.",
    "Monitoring Stack": "Prometheus metrics collection, Grafana dashboards, and Alertmanager.",
    Production: "High-availability, zero-downtime rolling deployment with Azure Load Balancers.",
  }

  return (
    <section id="architecture" className="relative py-24 sm:py-32">
      <div
        className="absolute left-1/2 top-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[140px]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Architecture"
          title="Automated CI/CD Delivery Pipeline"
          description="From source commit to resilient cloud production: an automated, security-gated DevOps workflow."
        />

        <ScrollReveal className="mt-14 rounded-3xl glass p-6 sm:p-10 border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          {/* Pipeline flow */}
          <ol className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {pipeline.map((step, i) => {
              const Icon = getTechIcon(iconFor[step] ?? step)
              const isLast = i === pipeline.length - 1
              const isSelected = active === i

              return (
                <li key={step} className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={`group relative flex w-28 sm:w-32 flex-col items-center gap-2 rounded-2xl p-3.5 text-center transition-all duration-300 ${
                      isSelected
                        ? "bg-primary/15 ring-2 ring-primary shadow-[0_0_28px_rgba(229,178,93,0.22)] scale-105"
                        : "bg-white/[0.03] ring-1 ring-white/10 hover:bg-white/[0.07] hover:ring-primary/40"
                    }`}
                    aria-expanded={isSelected}
                  >
                    <span className="text-[10px] font-mono text-muted-foreground group-hover:text-primary">
                      0{i + 1}
                    </span>

                    <span
                      className={`flex size-10 items-center justify-center rounded-xl transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-[0_0_18px_rgba(229,178,93,0.4)]"
                          : "bg-white/5 text-primary group-hover:bg-primary/15"
                      }`}
                    >
                      <Icon className="size-5" />
                    </span>

                    <span className="text-xs font-semibold leading-tight text-foreground/90">
                      {step}
                    </span>
                  </button>

                  {!isLast && (
                    <div className="flex items-center text-primary/60">
                      <ArrowRight className="hidden size-4 shrink-0 sm:block animate-pulse" />
                      <ArrowDown className="size-4 shrink-0 sm:hidden animate-pulse" />
                    </div>
                  )}
                </li>
              )
            })}
          </ol>

          {/* Active Detail Box */}
          {active !== null && (
            <div className="mt-8 rounded-2xl border border-primary/20 bg-white/[0.03] p-5 backdrop-blur-md transition-all duration-300">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary/20 text-primary">
                  <Zap className="size-4" />
                </span>
                <h4 className="text-sm font-semibold text-primary">
                  Stage 0{active + 1}: {pipeline[active]}
                </h4>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {descriptions[pipeline[active]]}
              </p>
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  )
}