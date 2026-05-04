'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type Mode = 'simplex' | 'half-duplex' | 'full-duplex'

type Props = {
  mode: Mode
  /** Optional title rendered above the diagram. */
  title?: string
  examples?: string
}

/**
 * Three-mode animated arrow diagram showing direction of information flow.
 * - simplex: one constant left→right arrow
 * - half-duplex: arrows alternate, one direction at a time
 * - full-duplex: both arrows light up simultaneously
 */
export function DuplexAnimation({ mode, title, examples }: Props) {
  const [phase, setPhase] = useState<'a' | 'b'>('a')

  useEffect(() => {
    if (mode === 'simplex' || mode === 'full-duplex') return
    const id = window.setInterval(() => {
      setPhase((p) => (p === 'a' ? 'b' : 'a'))
    }, 1100)
    return () => window.clearInterval(id)
  }, [mode])

  const showAtoB =
    mode === 'simplex' ||
    mode === 'full-duplex' ||
    (mode === 'half-duplex' && phase === 'a')
  const showBtoA =
    mode === 'full-duplex' || (mode === 'half-duplex' && phase === 'b')

  return (
    <div className="rounded-lg border border-border bg-bg-elevated p-4">
      {title && <h4 className="mb-3 text-sm font-semibold tracking-tight">{title}</h4>}
      <svg viewBox="0 0 320 130" className="w-full" role="img" aria-label={`${mode} επικοινωνία`}>
        <defs>
          <marker
            id={`arrow-${mode}-fwd`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgb(var(--accent))" />
          </marker>
          <marker
            id={`arrow-${mode}-bwd`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgb(var(--accent))" />
          </marker>
        </defs>

        {/* Endpoint A */}
        <g>
          <circle cx="40" cy="65" r="28" fill="rgb(var(--accent-soft))" stroke="rgb(var(--accent))" strokeWidth="2" />
          <text x="40" y="70" textAnchor="middle" className="fill-fg text-sm font-semibold">
            A
          </text>
        </g>
        {/* Endpoint B */}
        <g>
          <circle cx="280" cy="65" r="28" fill="rgb(var(--accent-soft))" stroke="rgb(var(--accent))" strokeWidth="2" />
          <text x="280" y="70" textAnchor="middle" className="fill-fg text-sm font-semibold">
            B
          </text>
        </g>

        {/* Forward arrow A → B */}
        <line
          x1="72"
          y1="55"
          x2="248"
          y2="55"
          stroke="rgb(var(--accent))"
          strokeWidth="3"
          markerEnd={`url(#arrow-${mode}-fwd)`}
          className={cn(
            'transition-opacity duration-500',
            showAtoB ? 'opacity-100' : 'opacity-15',
          )}
        />
        {/* Backward arrow B → A */}
        <line
          x1="248"
          y1="80"
          x2="72"
          y2="80"
          stroke="rgb(var(--accent))"
          strokeWidth="3"
          markerEnd={`url(#arrow-${mode}-bwd)`}
          className={cn(
            'transition-opacity duration-500',
            showBtoA ? 'opacity-100' : 'opacity-15',
          )}
        />

        {/* Empty placeholder line for simplex (so layout stays balanced) */}
        {mode === 'simplex' && (
          <line
            x1="72"
            y1="80"
            x2="248"
            y2="80"
            stroke="rgb(var(--border))"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        )}

        <text x="160" y="115" textAnchor="middle" className="fill-fg-muted text-[11px]">
          {mode === 'simplex' && 'Μόνο μία κατεύθυνση'}
          {mode === 'half-duplex' && 'Και οι δύο, αλλά μία τη φορά'}
          {mode === 'full-duplex' && 'Και οι δύο ταυτόχρονα'}
        </text>
      </svg>
      {examples && (
        <p className="mt-2 text-center text-xs text-fg-muted">
          <span className="text-fg-subtle">π.χ.</span> {examples}
        </p>
      )}
    </div>
  )
}
