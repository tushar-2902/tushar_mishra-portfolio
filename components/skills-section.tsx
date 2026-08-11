import { ScrollReveal } from "@/components/scroll-reveal"
import { SectionHeading } from "@/components/section-heading"
import { getTechIcon } from "@/components/tech-icon"
import { skillGroups } from "@/lib/portfolio-data"

export function SkillsSection() {
  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div
        className="absolute left-0 top-1/2 -z-10 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/10 blur-[150px]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Skills"
          title="The DevOps toolchain I build with"
          description="A full stack of cloud, automation, and security tooling used across the software delivery lifecycle."
        />

        <div className="mt-14 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
          <div className="grid gap-5">
            <ScrollReveal className="group relative overflow-hidden rounded-[2rem] glass-neon border border-primary/15 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,240,255,0.16)]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" aria-hidden="true" />
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                  Cloud
                </span>
                <p className="text-sm text-muted-foreground">
                  Core infrastructure, orchestration, and delivery tooling for modern platforms.
                </p>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {skillGroups[0].skills.map((skill) => {
                  const Icon = getTechIcon(skill)
                  return (
                    <span
                      key={skill}
                      className="group inline-flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground transition-all duration-300 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                    >
                      <Icon className="size-5 text-primary" />
                      {skill}
                    </span>
                  )
                })}
              </div>
            </ScrollReveal>

            <div className="grid gap-5 sm:grid-cols-2">
              {skillGroups.slice(1, 3).map((group, i) => {
                const Icon = getTechIcon(group.skills[0])
                return (
                  <ScrollReveal
                    key={group.category}
                    delay={i * 80}
                    className="group rounded-[1.75rem] glass p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,240,255,0.12)]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[0_0_20px_rgba(0,240,255,0.12)]">
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
                          {group.category}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {group.skills.length} key tools
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {group.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-2xl bg-foreground/[0.05] px-3 py-2 text-sm text-muted-foreground ring-1 ring-white/5 transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>

          <div className="grid gap-5">
            {skillGroups.slice(3).map((group, i) => {
              const Icon = getTechIcon(group.skills[0])
              return (
                <ScrollReveal
                  key={group.category}
                  delay={i * 80}
                  className="group rounded-[1.75rem] glass p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_24px_80px_rgba(0,240,255,0.12)]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[0_0_20px_rgba(0,240,255,0.12)]">
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
                          {group.category}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {group.skills.length} tools
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-[0.25em]">
                      {group.skills.length}
                    </span>
                  </div>
                  <div className="mt-6 grid gap-3">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-2 text-sm text-muted-foreground transition-all duration-300 hover:bg-primary/10 hover:text-primary"
                      >
                        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
