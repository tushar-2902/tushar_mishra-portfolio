import { CheckCircle2 } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { SectionHeading } from "@/components/section-heading"
import { focusAreas, stats } from "@/lib/portfolio-data"

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="About"
          title="Engineering reliable cloud infrastructure"
          description="I design, automate, and ship cloud-native systems — turning manual operations into resilient, secure, and observable pipelines."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
          <ScrollReveal className="glass rounded-3xl p-8">
            <h3 className="text-xl font-semibold">Professional Summary</h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Junior DevOps Engineer with 1.5+ years of hands-on experience
              building automated CI/CD pipelines, provisioning cloud
              infrastructure with Terraform, and operating containerized
              workloads on Kubernetes. Microsoft Certified Azure Administrator
              Associate (AZ-104) with a strong focus on DevSecOps, GitOps, and
              production-grade observability.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {focusAreas.map((area) => (
                <div
                  key={area}
                  className="flex items-center gap-2.5 rounded-xl bg-foreground/[0.03] px-4 py-3 text-sm ring-1 ring-foreground/5"
                >
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  {area}
                </div>
              ))}
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <ScrollReveal
                key={stat.label}
                delay={i * 80}
                tilt
                className="flex flex-col justify-center rounded-3xl glass p-6 transition-colors hover:bg-primary/10"
              >
                <span className="text-3xl font-semibold text-gradient sm:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
