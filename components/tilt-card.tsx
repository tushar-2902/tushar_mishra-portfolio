"use client"

import { type HTMLAttributes, type ReactNode, useRef } from "react"
import { cn } from "@/lib/utils"

type TiltCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function TiltCard({ children, className, ...props }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return
    }

    const card = ref.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    const rotateY = (x - 0.5) * 12
    const rotateX = (0.5 - y) * 12

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.01)`
    card.style.setProperty("--tilt-x", `${x * 100}%`)
    card.style.setProperty("--tilt-y", `${y * 100}%`)
  }

  const handleMouseLeave = () => {
    const card = ref.current
    if (!card) return

    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)"
    card.style.setProperty("--tilt-x", "50%")
    card.style.setProperty("--tilt-y", "50%")
  }

  return (
    <div
      ref={ref}
      {...props}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("tilt-card", className)}
    >
      {children}
    </div>
  )
}
