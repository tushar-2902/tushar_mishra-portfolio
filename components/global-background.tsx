"use client"

import { ParticleNetwork } from "./particle-network"

export default function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <ParticleNetwork />
    </div>
  )
}
