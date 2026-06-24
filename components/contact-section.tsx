"use client"

import { useState, type FormEvent } from "react"
import { CheckCircle2, Mail, Send, User } from "lucide-react"
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons"
import { ScrollReveal } from "@/components/scroll-reveal"
import { SectionHeading } from "@/components/section-heading"
import { profile } from "@/lib/portfolio-data"

export function ContactSection() {
  const [sent, setSent] = useState(false)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSent(true)
  }

  const details = [
    { icon: User, label: "Name", value: profile.name },
    { icon: User, label: "Role", value: profile.role },
    { icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  ]

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div
        className="absolute left-1/2 top-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[150px]"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something reliable"
          description="Open to DevOps and Cloud Engineering roles. Reach out and I'll respond quickly."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <ScrollReveal className="rounded-3xl glass p-8">
            <h3 className="text-lg font-semibold">Get in touch</h3>
            <ul className="mt-6 space-y-4">
              {details.map((d) => (
                <li key={d.label} className="flex items-start gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <d.icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {d.label}
                    </p>
                    {d.href ? (
                      <a
                        href={d.href}
                        className="text-sm font-medium transition-colors hover:text-primary"
                      >
                        {d.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium">{d.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex gap-3">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground/[0.05] py-3 text-sm font-medium ring-1 ring-foreground/10 transition-colors hover:text-primary"
              >
                <GithubIcon className="size-4" />
                GitHub
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground/[0.05] py-3 text-sm font-medium ring-1 ring-foreground/10 transition-colors hover:text-primary"
              >
                <LinkedinIcon className="size-4" />
                LinkedIn
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100} className="rounded-3xl glass p-8">
            {sent ? (
              <div className="flex h-full min-h-72 flex-col items-center justify-center text-center">
                <span className="flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <CheckCircle2 className="size-8" />
                </span>
                <h3 className="mt-5 text-xl font-semibold">Message sent</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Thanks for reaching out — I&apos;ll get back to you soon.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 rounded-xl bg-foreground/[0.05] px-5 py-2.5 text-sm font-medium ring-1 ring-foreground/10 transition-colors hover:text-primary"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Name">
                    <input
                      required
                      name="name"
                      type="text"
                      placeholder="Your name"
                      className="form-input"
                    />
                  </Field>
                  <Field label="Email">
                    <input
                      required
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      className="form-input"
                    />
                  </Field>
                </div>
                <Field label="Subject">
                  <input
                    required
                    name="subject"
                    type="text"
                    placeholder="What's this about?"
                    className="form-input"
                  />
                </Field>
                <Field label="Message">
                  <textarea
                    required
                    name="message"
                    rows={5}
                    placeholder="Tell me about the role or project..."
                    className="form-input resize-none"
                  />
                </Field>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01] glow-primary"
                >
                  <Send className="size-4" />
                  Send Message
                </button>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>

      <style>{`
        .form-input {
          width: 100%;
          border-radius: 0.75rem;
          background: color-mix(in oklch, var(--foreground) 4%, transparent);
          border: 1px solid color-mix(in oklch, var(--foreground) 12%, transparent);
          padding: 0.7rem 0.9rem;
          font-size: 0.875rem;
          color: var(--foreground);
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .form-input::placeholder { color: var(--muted-foreground); }
        .form-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px color-mix(in oklch, var(--primary) 25%, transparent);
        }
      `}</style>
    </section>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  )
}
