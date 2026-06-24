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

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <ScrollReveal
              key={group.category}
              delay={(i % 3) * 80}
              className="group rounded-3xl glass p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-primary/[0.07]"
            >
              <h3 className="text-sm font-semibold uppercase tracking-widest text-primary">
                {group.category}
              </h3>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {group.skills.map((skill) => {
                  const Icon = getTechIcon(skill)
                  return (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-2 rounded-xl bg-foreground/[0.04] px-3 py-2 text-sm ring-1 ring-foreground/5 transition-colors hover:ring-primary/40"
                    >
                      <Icon className="size-4 text-primary" />
                      {skill}
                    </span>
                  )
                })}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
