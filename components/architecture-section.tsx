import { ArrowDown, ArrowRight } from "lucide-react"
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
  const [active, setActive] = useState<number | null>(null)

  const descriptions: Record<string, string> = {
    Developer: "Developer edits code and opens pull requests.",
    GitHub: "Source code and collaboration (PRs, reviews).",
    "GitHub Actions": "CI pipelines that build and test changes.",
    "Docker Build": "Container images built from source.",
    "Container Registry": "Secure storage for container images.",
    Kubernetes: "Orchestrates containers in production (AKS/EKS).",
    "Monitoring Stack": "Prometheus/Grafana for metrics and alerts.",
    Production: "Live environment with production workloads.",
  }

  return (
    <section className="relative py-24 sm:py-32">
      <div
        className="absolute inset-0 -z-10 grid-bg opacity-40"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Architecture Showcase"
          title="End-to-end DevOps delivery workflow"
          description="From a developer commit to a monitored production release — fully automated and secured."
        />

        <ScrollReveal className="mt-14 rounded-3xl glass p-6 sm:p-10">
          <ol className="flex flex-wrap items-stretch justify-center gap-3">
            {pipeline.map((step, i) => {
              const Icon = getTechIcon(iconFor[step] ?? step)
              const isLast = i === pipeline.length - 1
              return (
                <li key={step} className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onMouseLeave={() => setActive(null)}
                      onClick={() => setActive((v) => (v === i ? null : i))}
                      className="flex w-32 flex-col items-center gap-2 rounded-2xl bg-foreground/[0.04] px-3 py-4 text-center ring-1 ring-foreground/10 transition-colors hover:ring-primary/40"
                      aria-expanded={active === i}
                      aria-controls={`node-desc-${i}`}
                    >
                      <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <Icon className="size-5" />
                      </span>
                      <span className="text-xs font-medium leading-tight">{step}</span>
                    </button>

                    <div
                      id={`node-desc-${i}`}
                      role="region"
                      className={`absolute left-1/2 top-full z-10 w-56 -translate-x-1/2 rounded-lg bg-card p-3 text-xs text-muted-foreground shadow-lg transition-all duration-200 ${
                        active === i ? "opacity-100 translate-y-2" : "opacity-0 pointer-events-none"
                      }`}
                      style={{ transformOrigin: "top center" }}
                    >
                      {descriptions[step] ?? "Part of the delivery pipeline."}
                    </div>
                  </div>

                  {!isLast && (
                    <>
                      <ArrowRight className="hidden size-5 shrink-0 text-primary/70 sm:block" />
                      <ArrowDown className="size-5 shrink-0 text-primary/70 sm:hidden" />
                    </>
                  )}
                </li>
              )
            })}
          </ol>
        </ScrollReveal>
      </div>
    </section>
  )
}
