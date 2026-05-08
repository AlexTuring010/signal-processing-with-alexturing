import type { ItemRenderProps } from '@/lib/collectibles/types'
import { headAnchor } from '@/lib/collectibles/anchors'

/**
 * Σκουφάκι Καλωσορίσματος — soft cuffed beanie tucked low on the head
 * with a small pom on top. Sits forward of the antenna so the adult's
 * tuft pops out the top.
 */
export function WelcomeBeanie({ adult }: ItemRenderProps) {
  const { x, y } = headAnchor(adult)
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      {/* Cuff strip */}
      <path
        d="M-18 1 L-18 4 Q-18 6 -16 6 L16 6 Q18 6 18 4 L18 1 Z"
        fill="rgb(var(--warn))"
      />
      <line x1="-15" y1="3" x2="15" y2="3" stroke="white" strokeWidth="0.6" opacity="0.4" />
      {/* Crown — short dome that leaves room for the antenna */}
      <path
        d="M-15 1 Q-13 -7 -7 -8 Q0 -10 7 -8 Q13 -7 15 1 Z"
        fill="rgb(var(--warn))"
      />
      {/* Highlight */}
      <ellipse cx="-5" cy="-4" rx="4" ry="2" fill="white" opacity="0.3" />
      {/* Pom */}
      <circle cx="0" cy="-11" r="2.5" fill="rgb(var(--accent-soft))" />
      <circle cx="-1" cy="-11.5" r="0.9" fill="white" opacity="0.6" />
    </g>
  )
}
