import { ScrollReveal } from "@/components/scroll-reveal"
import { SectionHeading } from "@/components/section-heading"
import { getTechIcon } from "@/components/tech-icon"
import { skillGroups } from "@/lib/portfolio-data"

export function SkillsSection() {
  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div
        className="absolute left-0 top-1/2 -z-10 h-80 w-80 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"
        aria-hidden="true"
      />
      <div className="absolute right-0 top-24 -z-10 h-96 w-96 rounded-full bg-accent/10 blur-[140px]" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Skills"
          title="The DevOps toolchain I build with"
          description="A full stack of cloud, automation, and security tooling used across the software delivery lifecycle."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {skillGroups.map((group, i) => {
            const Icon = getTechIcon(group.skills[0])
            return (
              <ScrollReveal
                key={group.category}
                delay={i * 40}
                tilt
                className="group glass rounded-[1.5rem] p-5 transition duration-300 ease-out hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_22px_56px_rgba(229,178,93,0.10)]"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-[0_0_16px_rgba(229,178,93,0.10)]">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
                      {group.category}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {group.skills.length} tools
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill) => {
                    const ChipIcon = getTechIcon(skill)
                    return (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-muted-foreground transition duration-200 ease-out hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                      >
                        <ChipIcon className="size-4 text-primary" />
                        {skill}
                      </span>
                    )
                  })}
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
