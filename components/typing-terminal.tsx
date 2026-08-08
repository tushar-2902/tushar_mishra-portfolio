"use client"

import React, { useEffect, useState } from "react"

interface TypingTerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  commands: string[]
  typingSpeed?: number
  pauseMs?: number
}

export default function TypingTerminal({
  commands,
  typingSpeed = 40,
  pauseMs = 1100,
  className,
  ...rest
}: TypingTerminalProps) {
  const [idx, setIdx] = useState(0)
  const [sub, setSub] = useState(0)
  const [forward, setForward] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    let handle: number
    if (forward) {
      if (sub < commands[idx].length) {
        handle = window.setTimeout(() => setSub((s) => s + 1), typingSpeed)
      } else {
        handle = window.setTimeout(() => setForward(false), pauseMs)
      }
    } else {
      if (sub > 0) {
        handle = window.setTimeout(() => setSub((s) => s - 1), typingSpeed / 2)
      } else {
        // move to next command
        setForward(true)
        setIdx((i) => (i + 1) % commands.length)
      }
    }

    return () => window.clearTimeout(handle)
  }, [sub, forward, idx, commands, typingSpeed, pauseMs, mounted])

  // prefers-reduced-motion
  const [reduced] = useState(
    typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  const display = reduced ? commands[0] : commands[idx].slice(0, sub)

  return (
    <div
      {...rest}
      className={"rounded-lg bg-foreground/[0.02] p-4 font-mono text-sm " +
        (className || "")}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-destructive/60" />
        <div className="h-2 w-2 rounded-full bg-accent/60" />
        <div className="h-2 w-2 rounded-full bg-primary/60" />
      </div>

      <pre className="mt-3 text-sm leading-relaxed text-foreground/90 overflow-x-auto">
        <code>{display}
          <span className="inline-block w-0.5 bg-foreground align-middle ml-1 animate-[blink_1s_steps(2,_start)_infinite]" />
        </code>
      </pre>

      <div className="mt-3 text-xs text-muted-foreground">
        {reduced ? "Commands preview" : `Running: ${commands[idx]}`}
      </div>
    </div>
  )
}
