'use client'

import { useEffect, useState } from 'react'
import { useOrchardStore } from '@/lib/orchard/store'
import { PlotCard } from './PlotCard'

type Props = {
  selectedPlotId: string | null
  onSelect: (plotId: string) => void
  /** Re-render heartbeat (ms timestamp). Parent owns the rAF clock. */
  now: number
}

/**
 * The orchard scene: a 4×3 grid of plots over a soft pastel hill background.
 * The grid is responsive — on narrow screens it falls back to 3 columns.
 */
export function Scene({ selectedPlotId, onSelect, now }: Props) {
  const plots = useOrchardStore((s) => s.state.plots)

  return (
    <div className="relative flex-1 overflow-hidden">
      <HillBackground />

      {/* 3×4 grid that distributes rows evenly across the available height
          (no aspect-square — cells are slightly tall-ish rectangles so the
          whole grid fits without overflowing the panel). */}
      <div className="relative z-10 grid h-full min-h-0 grid-cols-3 grid-rows-4 gap-1.5 px-2 py-2">
        {plots.map((p) => (
          <PlotCard
            key={p.id}
            plot={p}
            selected={selectedPlotId === p.id}
            now={now}
            onClick={() => onSelect(p.id)}
          />
        ))}
      </div>
    </div>
  )
}

/** Soft pastel sky-and-hill backdrop. Theme-aware via existing tokens. */
function HillBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(180deg, rgb(var(--accent-soft) / 0.35) 0%, rgb(var(--bg-soft)) 55%, rgb(var(--bg-soft)) 100%)',
      }}
    >
      {/* Distant hill silhouette */}
      <svg
        viewBox="0 0 800 200"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-1/2 w-full opacity-40"
      >
        <path
          d="M0,160 C150,90 320,140 460,90 C600,40 720,110 800,80 L800,200 L0,200 Z"
          fill="rgb(var(--accent-soft))"
        />
        <path
          d="M0,180 C120,140 280,170 420,150 C560,130 700,170 800,150 L800,200 L0,200 Z"
          fill="rgb(var(--bg))"
          opacity="0.5"
        />
      </svg>
    </div>
  )
}

/**
 * 1-second heartbeat hook: returns Date.now() and re-renders every `intervalMs`
 * while `active`. Used by the modal to keep growth timers and storage bars live.
 */
export function useNowHeartbeat(active: boolean, intervalMs: number = 1000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(id)
  }, [active, intervalMs])
  return now
}
