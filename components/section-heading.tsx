import { ScrollReveal } from "@/components/scroll-reveal"

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <ScrollReveal className="mx-auto max-w-2xl text-center">
      <span className="inline-block rounded-full glass px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </ScrollReveal>
  )
}
