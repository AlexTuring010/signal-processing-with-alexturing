import type { ItemRenderProps } from '@/lib/collectibles/types'
import { headAnchor } from '@/lib/collectibles/anchors'

/**
 * Στέμμα Αρμονικών — a small gold crown whose spikes are sized like
 * Fourier-series harmonic stems: tall fundamental in the center, with
 * progressively shorter peaks on either side. Sits slightly forward
 * so the adult antenna pokes through behind the central spike.
 */
export function HarmonicCrown({ adult }: ItemRenderProps) {
  const { x, y } = headAnchor(adult)
  // Base x-positions and heights for 5 harmonic spikes.
  // Center spike is tallest; outer ones taper.
  const spikes = [
    { dx: -10, h: 5 },
    { dx: -5, h: 8 },
    { dx: 0, h: 11 },
    { dx: 5, h: 8 },
    { dx: 10, h: 5 },
  ]
  return (
    <g transform={`translate(${x} ${y - 2})`} aria-hidden="true">
      {/* Band */}
      <path
        d="M-13 0 L-13 4 Q-13 6 -11 6 L11 6 Q13 6 13 4 L13 0 Z"
        fill="rgb(var(--warn))"
      />
      {/* Spikes (lines) */}
      {spikes.map((s, i) => (
        <path
          key={i}
          d={`M${s.dx - 1.5} 0 L${s.dx} ${-s.h} L${s.dx + 1.5} 0 Z`}
          fill="rgb(var(--warn))"
        />
      ))}
      {/* Tiny gem at the central spike tip */}
      <circle cx="0" cy="-11" r="1.5" fill="rgb(var(--danger))" />
      <circle cx="-0.5" cy="-11.4" r="0.5" fill="white" opacity="0.9" />
      {/* Highlight along the band */}
      <line
        x1="-9"
        y1="2"
        x2="9"
        y2="2"
        stroke="white"
        strokeWidth="0.6"
        opacity="0.5"
      />
    </g>
  )
}
