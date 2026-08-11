import { ArrowUpRight, Check, Folder, Star } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { SectionHeading } from "@/components/section-heading"
import { projects } from "@/lib/portfolio-data"

export function ProjectsSection() {
  const featured = projects.find((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div
        className="absolute right-0 top-20 -z-10 h-96 w-96 rounded-full bg-accent/10 blur-[150px]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Production-grade engineering work"
          description="Selected projects showcasing cloud architecture, automation, and DevSecOps in practice."
        />

        <div className="mt-14 grid gap-6">
          {featured && (
            <ScrollReveal className="group relative overflow-hidden rounded-[2rem] border border-primary/15 bg-surface/90 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_50px_140px_rgba(0,240,255,0.2)]">
              <div className="absolute inset-x-5 top-5 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" aria-hidden="true" />
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary shadow-[0_0_24px_rgba(0,240,255,0.14)]">
                  <Star className="size-3.5" />
                  Flagship Project
                </span>
                <div className="hidden rounded-full border border-primary/20 bg-white/5 px-4 py-2 text-xs text-muted-foreground sm:inline-flex">
                  Premium Delivery
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <h3 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    {featured.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {featured.summary}
                  </p>
                </div>
                <div className="rounded-3xl border border-primary/20 bg-white/5 px-5 py-4 text-sm text-primary shadow-[0_0_30px_rgba(0,240,255,0.12)]">
                  <p className="font-semibold">DevOps Focus</p>
                  <p className="mt-2 text-muted-foreground">GitOps, AKS, security gates, observability</p>
                </div>
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-2">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                    Key Features
                  </h4>
                  <ul className="mt-4 space-y-3">
                    {featured.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-foreground">
                        <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[0_0_20px_rgba(0,240,255,0.1)]">
                          <Check className="size-4" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                    Tech Stack
                  </h4>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {featured.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-2xl bg-white/5 px-3 py-2 text-sm text-muted-foreground ring-1 ring-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {rest.map((project, i) => (
              <ScrollReveal
                key={project.title}
                delay={i * 80}
                className="group flex h-full flex-col rounded-[1.75rem] glass p-6 border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_28px_90px_rgba(0,240,255,0.12)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-[0_0_20px_rgba(0,240,255,0.12)]">
                    <Folder className="size-5" />
                  </span>
                  <ArrowUpRight className="size-5 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">{project.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {project.summary}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-2xl bg-white/5 px-3 py-2 text-xs text-muted-foreground ring-1 ring-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
