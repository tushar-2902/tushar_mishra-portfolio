import { ArrowDown, ArrowRight } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { SectionHeading } from "@/components/section-heading"
import { getTechIcon } from "@/components/tech-icon"
import { pipeline } from "@/lib/portfolio-data"

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
                <li
                  key={step}
                  className="flex items-center gap-3"
                >
                  <div className="flex w-32 flex-col items-center gap-2 rounded-2xl bg-foreground/[0.04] px-3 py-4 text-center ring-1 ring-foreground/10 transition-colors hover:ring-primary/40">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-xs font-medium leading-tight">
                      {step}
                    </span>
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
