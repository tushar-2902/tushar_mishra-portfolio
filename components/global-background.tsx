"use client"

import { ParticleNetwork } from "./particle-network"

export default function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <ParticleNetwork />

      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(229,178,93,0.04),transparent_18%),radial-gradient(circle_at_82%_10%,rgba(179,120,206,0.03),transparent_18%)] mix-blend-screen opacity-80"
        aria-hidden="true"
      />

      <div
        className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px] opacity-90"
        aria-hidden="true"
      />

      <div
        className="absolute right-10 bottom-20 h-72 w-72 rounded-full bg-accent/10 blur-[120px] opacity-90"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%,rgba(0,0,0,0.08))] opacity-20"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.02),transparent_22%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.015),transparent_22%)] opacity-30 mix-blend-screen"
        aria-hidden="true"
      />
    </div>
  )
}
