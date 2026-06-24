import { Briefcase, Dot } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { SectionHeading } from "@/components/section-heading"
import { experience } from "@/lib/portfolio-data"

export function ExperienceSection() {
  return (
    <section id="experience" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Experience"
          title="Career timeline"
          description="Roles where I delivered automation, cloud infrastructure, and reliable deployments."
        />

        <div className="relative mt-14 pl-8 sm:pl-12">
          <div
            className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent sm:left-5"
            aria-hidden="true"
          />

          <div className="space-y-8">
            {experience.map((job, i) => (
              <ScrollReveal key={job.title} delay={i * 100}>
                <div className="relative">
                  <span
                    className="absolute -left-[1.55rem] top-6 flex size-7 items-center justify-center rounded-full bg-primary/15 ring-4 ring-background sm:-left-[2.05rem]"
                    aria-hidden="true"
                  >
                    <Briefcase className="size-3.5 text-primary" />
                  </span>

                  <article className="rounded-3xl glass p-6 transition-colors hover:bg-foreground/[0.04] sm:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {job.period}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {job.company}
                    </p>

                    <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {job.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-center gap-1 text-sm text-foreground/90"
                        >
                          <Dot className="size-5 shrink-0 text-primary" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
