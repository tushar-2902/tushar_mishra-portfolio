"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

type ScrollRevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  tilt?: boolean
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  tilt = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [])

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

  useEffect(() => {
    const el = ref.current
    if (!el || !tilt || reducedMotionRef.current) return

    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches
    if (isCoarsePointer) return

    const handleMouseMove = (event: MouseEvent): void => {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
      const rotateX = (0.5 - y) * 12
      const rotateY = (x - 0.5) * 12
      const translateY = -8
      const scale = 1.02

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${translateY}px) scale(${scale})`
      el.style.setProperty("--tilt-x", `${x * 100}%`)
      el.style.setProperty("--tilt-y", `${y * 100}%`)
    }

    const handleMouseLeave = (): void => {
      const isVisible = el.classList.contains("is-visible")
      el.style.transform = isVisible ? "translateY(0) scale(1)" : "translateY(32px) scale(1)"
      el.style.setProperty("--tilt-x", "50%")
      el.style.setProperty("--tilt-y", "50%")
    }

    el.addEventListener("mousemove", handleMouseMove)
    el.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      el.removeEventListener("mousemove", handleMouseMove)
      el.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [tilt])

  return (
    <div
      ref={ref}
      className={cn("reveal", className, tilt && "tilt-card")}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
