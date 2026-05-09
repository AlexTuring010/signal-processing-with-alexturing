import type { ItemRenderProps } from '@/lib/collectibles/types'
import { headAnchor } from '@/lib/collectibles/anchors'

/**
 * Lucky Cap — green ball cap with a four-leaf clover patch on the
 * front. Awarded for an Apple Catcher high score ≥ 100.
 */
export function LuckyCap({ adult }: ItemRenderProps) {
  const { x, y } = headAnchor(adult)
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      {/* Brim */}
      <path
        d="M-22 3 Q-22 6 -18 6 L18 6 Q22 6 22 3 Z"
        fill="#2c6e3a"
      />
      {/* Cap body */}
      <path
        d="M-17 3 Q-15 -8 0 -10 Q15 -8 17 3 Z"
        fill="#3a8a4a"
      />
      {/* Highlight */}
      <ellipse cx="-5" cy="-4" rx="6" ry="2.5" fill="white" opacity="0.25" />
      {/* Clover patch — four small white leaves */}
      <circle cx="0" cy="-4" r="1.4" fill="#fff5d8" />
      <circle cx="-2" cy="-2" r="1.4" fill="#fff5d8" />
      <circle cx="2" cy="-2" r="1.4" fill="#fff5d8" />
      <circle cx="0" cy="0" r="1.4" fill="#fff5d8" />
      <circle cx="0" cy="-2" r="0.6" fill="#3a8a4a" />
    </g>
  )
}
