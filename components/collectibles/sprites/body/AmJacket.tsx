import type { ItemRenderProps } from '@/lib/collectibles/types'
import { BODY_CENTER } from '@/lib/collectibles/anchors'

/**
 * Σακάκι AM — a small formal jacket with two lapels and a single
 * button. Reads as "evening attire" against the soft pastel body.
 * Body-slot, so it tilts with the sick-mood wobble.
 */
export function AmJacket({ adult }: ItemRenderProps) {
  const { x, y } = BODY_CENTER
  const w = adult ? 32 : 28
  const h = adult ? 26 : 22
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      {/* Jacket body — slightly darker than the shirt for contrast */}
      <path
        d={`M${-w / 2} ${-h / 2 + 4}
             Q${-w / 2} ${-h / 2} ${-w / 2 + 4} ${-h / 2}
             L${w / 2 - 4} ${-h / 2}
             Q${w / 2} ${-h / 2} ${w / 2} ${-h / 2 + 4}
             L${w / 2} ${h / 2}
             Q${w / 2} ${h / 2 + 4} ${w / 2 - 3} ${h / 2 + 4}
             L${-w / 2 + 3} ${h / 2 + 4}
             Q${-w / 2} ${h / 2 + 4} ${-w / 2} ${h / 2}
             Z`}
        fill="rgb(var(--accent))"
      />
      {/* V-shaped opening showing inner shirt color */}
      <path
        d={`M-7 ${-h / 2 + 1} L0 ${h / 2 - 6} L7 ${-h / 2 + 1} Z`}
        fill="rgb(var(--bg-elevated))"
      />
      {/* Lapels */}
      <path
        d={`M-7 ${-h / 2 + 1} L-2 ${-h / 2 + 6} L-3 ${h / 2 - 9} L-7 ${h / 2 - 5} Z`}
        fill="rgb(var(--accent-soft))"
      />
      <path
        d={`M7 ${-h / 2 + 1} L2 ${-h / 2 + 6} L3 ${h / 2 - 9} L7 ${h / 2 - 5} Z`}
        fill="rgb(var(--accent-soft))"
      />
      {/* Single button at the V tip */}
      <circle cx="0" cy={h / 2 - 7} r="1.4" fill="rgb(var(--warn))" />
      <circle cx="-0.3" cy={h / 2 - 7.3} r="0.5" fill="white" opacity="0.7" />
      {/* Subtle shoulder highlight */}
      <path
        d={`M${-w / 2 + 4} ${-h / 2 + 3} Q${-w / 4} ${-h / 2 + 1} -3 ${-h / 2 + 2}`}
        stroke="white"
        strokeWidth="0.8"
        fill="none"
        opacity="0.35"
      />
    </g>
  )
}
