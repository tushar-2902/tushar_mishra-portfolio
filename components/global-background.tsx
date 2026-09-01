"use client"

import { ParticleNetwork } from "./particle-network"

export default function GlobalBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <ParticleNetwork />
    </div>
  )
}
