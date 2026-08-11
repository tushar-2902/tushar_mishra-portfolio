"use client"

import { ParticleNetwork } from "./particle-network"

export default function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <ParticleNetwork />

      <div
        className="absolute inset-0 soft-grid opacity-18 mix-blend-screen"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 noise opacity-08"
        aria-hidden="true"
      />

      <div
        className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px] opacity-80"
        aria-hidden="true"
      />

      <div
        className="absolute right-10 bottom-20 h-72 w-72 rounded-full bg-accent/10 blur-[120px] opacity-80"
        aria-hidden="true"
      />
    </div>
  )
}
