'use client'

import { useEffect, useState } from 'react'
import type { ActionKind } from '@/lib/pet/types'

type Props = {
  /** A change in this tuple triggers a fresh particle burst. */
  trigger: { kind: ActionKind; at: number } | null
}

const DURATIONS: Partial<Record<ActionKind, number>> = {
  feed: 700,
  play: 600,
  pet: 1000,
  heal: 900,
}

/**
 * Renders a one-shot particle burst inside the stage scene whenever the
 * action `trigger` changes. Uses pure CSS keyframes from globals.css.
 */
export function Particles({ trigger }: Props) {
  const [active, setActive] = useState<{ kind: ActionKind; at: number } | null>(null)

  useEffect(() => {
    if (!trigger) return
    setActive(trigger)
    const dur = DURATIONS[trigger.kind] ?? 800
    const id = window.setTimeout(() => setActive(null), dur + 50)
    return () => window.clearTimeout(id)
  }, [trigger])

  if (!active) return null

  switch (active.kind) {
    case 'feed':
      return <Crumbs />
    case 'play':
      return <StarBurst />
    case 'pet':
      return <Hearts />
    case 'heal':
      return <Sparkles />
    default:
      return null
  }
}

function Crumbs() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="pet-crumb block h-1.5 w-1.5 rounded-full bg-warn"
          style={{ animationDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  )
}

function StarBurst() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2">
      {[-1, 0, 1].map((i) => (
        <span
          key={i}
          className="pet-star absolute text-base"
          style={{ left: `${i * 14}px`, animationDelay: `${(i + 1) * 50}ms` }}
        >
          ✦
        </span>
      ))}
    </div>
  )
}

function Hearts() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {[-1, 0, 1].map((i) => (
        <span
          key={i}
          className="pet-heart absolute text-sm"
          style={{
            color: 'rgb(var(--danger))',
            left: `${i * 12 - 6}px`,
            animationDelay: `${(i + 1) * 80}ms`,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  )
}

function Sparkles() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="pet-sparkle absolute text-xs"
          style={{
            color: 'rgb(var(--accent))',
            transform: `rotate(${i * 90}deg) translateY(-12px)`,
            animationDelay: `${i * 70}ms`,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  )
}

/** Z's drifting up while sleeping. Always rendering when shown. */
export function SleepZs() {
  return (
    <div className="pointer-events-none absolute right-3 top-2 text-fg-muted">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="pet-zzz absolute text-xs font-semibold"
          style={{ animationDelay: `${i * 600}ms`, left: `${i * 4}px` }}
        >
          z
        </span>
      ))}
    </div>
  )
}
