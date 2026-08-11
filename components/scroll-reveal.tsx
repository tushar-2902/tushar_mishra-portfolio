"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type ScrollRevealTag = "div" | "li" | "section" | "article"

type ScrollRevealProps<T extends ScrollRevealTag = "div"> = {
  children: ReactNode
  className?: string
  delay?: number
  as?: T
} & Omit<React.ComponentPropsWithoutRef<T>, "className" | "style" | "children">

export function ScrollReveal<T extends ScrollRevealTag = "div">({
  children,
  className,
  delay = 0,
  as,
  ...rest
}: ScrollRevealProps<T>) {
  const ref = useRef<HTMLDivElement | HTMLLIElement | HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const Tag = (as ?? "div") as T

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement>}
      className={cn("reveal", className)}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
