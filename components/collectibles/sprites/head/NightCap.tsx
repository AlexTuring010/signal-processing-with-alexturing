import type { ItemRenderProps } from '@/lib/collectibles/types'
import { headAnchor } from '@/lib/collectibles/anchors'

/**
 * Νυχτερινό Σκουφάκι — pointed midnight-blue nightcap with a small
 * crescent moon emblem on the front. Awarded for opening the site
 * between 00:00 and 06:00 local time.
 */
export function NightCap({ adult }: ItemRenderProps) {
  const { x, y } = headAnchor(adult)
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      {/* Cuff */}
      <path
        d="M-15 1 L-15 5 Q-15 7 -13 7 L13 7 Q15 7 15 5 L15 1 Z"
        fill="#1c2c52"
      />
      {/* Cap body — rises to a tilted point */}
      <path
        d="M-13 1 Q-12 -10 -2 -14 Q4 -16 8 -8 L13 1 Z"
        fill="#26396b"
      />
      {/* Tip pom */}
      <circle cx="-3" cy="-15" r="2" fill="#fff5d8" />
      {/* Crescent moon emblem */}
      <circle cx="0" cy="-3" r="2.4" fill="#fff5d8" />
      <circle cx="1.2" cy="-3.2" r="1.9" fill="#26396b" />
    </g>
  )
}
