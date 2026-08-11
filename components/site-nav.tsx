"use client"

import { useEffect, useState } from "react"
import { Menu, Terminal, X, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
]

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const updateActiveSection = () => {
      const sections = Array.from(document.querySelectorAll("section[id]"))
      const offset = window.innerHeight * 0.3
      const active = sections.reduce((current, section) => {
        const rect = section.getBoundingClientRect()
        return rect.top <= offset && rect.bottom > offset ? section.id : current
      }, "home")
      setActiveSection(active)
    }

    updateActiveSection()
    window.addEventListener("scroll", updateActiveSection)
    return () => window.removeEventListener("scroll", updateActiveSection)
  }, [])

  // theme (avoid hydration mismatch)
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <header className="fixed inset-x-0 top-5 z-50 px-4 transition-all duration-300 sm:px-6">
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-surface/95 px-5 py-3 shadow-[0_35px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-300",
          scrolled ? "backdrop-blur-2xl" : "",
        )}
      >
        <a href="#home" className="flex items-center gap-3 rounded-full px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-white/5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-[0_0_30px_rgba(0,240,255,0.16)]">
            <Terminal className="size-4" />
          </span>
          <span className="tracking-tight">Tushar Mishra</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const sectionId = link.href.slice(1)
            const isActive = activeSection === sectionId
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative inline-flex items-center rounded-full px-3 py-2 text-sm transition-all duration-200",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                  )}
                >
                  {link.label}
                  {isActive ? (
                    <span className="absolute left-1/2 -bottom-2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_20px_rgba(0,240,255,0.24)]" />
                  ) : null}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all duration-200 hover:bg-primary/20 md:inline-flex"
          >
            Hire Me
          </a>
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="hidden h-10 w-10 items-center justify-center rounded-full bg-foreground/[0.08] text-foreground shadow-[0_0_20px_rgba(0,0,0,0.12)] transition hover:bg-white/10 md:inline-flex"
          >
            {mounted ? (
              resolvedTheme === "dark" ? (
                <Sun className="size-4 text-primary" />
              ) : (
                <Moon className="size-4 text-accent" />
              )
            ) : (
              <Sun className="size-4 text-primary/60" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground shadow-[0_0_20px_rgba(0,0,0,0.12)] md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass-soft mx-4 mt-3 rounded-3xl border border-white/10 p-3 shadow-2xl md:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
