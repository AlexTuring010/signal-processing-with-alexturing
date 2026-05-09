import type { ItemRenderProps } from '@/lib/collectibles/types'
import { headAnchor } from '@/lib/collectibles/anchors'

/**
 * Κορώνα Compost — earthy crown made of leaves and twigs. Awarded
 * for composting the orchard 5 times.
 */
export function CompostCrown({ adult }: ItemRenderProps) {
  const { x, y } = headAnchor(adult)
  return (
    <g transform={`translate(${x} ${y - 2})`} aria-hidden="true">
      {/* Twig band */}
      <path
        d="M-13 0 L-13 4 Q-13 6 -11 6 L11 6 Q13 6 13 4 L13 0 Z"
        fill="#7d5a32"
      />
      {/* Five leaf "spikes" rising from the band — alternating green
          and warm brown. */}
      <path d="M-11 0 Q-9 -8 -7 0 Z" fill="#5a8a3a" />
      <path d="M-5 -1 Q-3 -10 -1 -1 Z" fill="#7a4a2a" />
      <path d="M0 -2 Q2 -12 4 -2 Z" fill="#5a8a3a" />
      <path d="M5 -1 Q7 -10 9 -1 Z" fill="#7a4a2a" />
      <path d="M9 0 Q11 -8 13 0 Z" fill="#5a8a3a" />
      {/* Tiny berry on the central tallest spike */}
      <circle cx="2" cy="-12" r="1.4" fill="#c33b4a" />
      {/* Highlight along the band */}
      <line
        x1="-9"
        y1="2"
        x2="9"
        y2="2"
        stroke="#a87a4a"
        strokeWidth="0.5"
        opacity="0.7"
      />
    </g>
  )
}
