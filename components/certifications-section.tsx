import { Award, BadgeCheck } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { SectionHeading } from "@/components/section-heading"
import { certifications } from "@/lib/portfolio-data"

export function CertificationsSection() {
  return (
    <section id="certifications" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Certifications"
          title="Validated, industry-recognized skills"
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {certifications.map((cert, i) => (
            <ScrollReveal
              key={cert.name}
              delay={i * 90}
              className="group relative overflow-hidden rounded-3xl glass p-7 transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className="absolute -right-10 -top-10 size-32 rounded-full bg-primary/15 blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-50"
                aria-hidden="true"
              />
              <span className="relative flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30">
                <Award className="size-6" />
              </span>
              <p className="relative mt-5 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-primary">
                <BadgeCheck className="size-3.5" />
                {cert.issuer}
              </p>
              <h3 className="relative mt-2 text-lg font-semibold leading-snug">
                {cert.name}
              </h3>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
