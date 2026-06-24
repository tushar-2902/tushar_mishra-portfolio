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

        <div className="mt-14 grid grid-cols-1 gap-6">
          {featured && (
            <ScrollReveal className="group relative overflow-hidden rounded-3xl glass p-8 transition-all duration-300 hover:-translate-y-1 sm:p-10">
              <div
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                  <Star className="size-3.5" />
                  Flagship Project
                </span>
              </div>
              <h3 className="mt-5 text-balance text-2xl font-semibold sm:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
                {featured.summary}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Key Features
                  </h4>
                  <ul className="mt-4 space-y-2.5">
                    {featured.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-sm">
                        <span className="flex size-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                          <Check className="size-3" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Tech Stack
                  </h4>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {featured.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg bg-foreground/[0.05] px-3 py-1.5 text-xs ring-1 ring-foreground/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {rest.map((project, i) => (
              <ScrollReveal
                key={project.title}
                delay={i * 80}
                className="group flex h-full flex-col rounded-3xl glass p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-foreground/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <Folder className="size-5" />
                  </span>
                  <ArrowUpRight className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{project.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {project.summary}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-foreground/[0.05] px-2 py-1 text-[11px] text-muted-foreground ring-1 ring-foreground/5"
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
