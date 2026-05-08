import type { ItemRenderProps } from '@/lib/collectibles/types'
import { headAnchor } from '@/lib/collectibles/anchors'

/**
 * Phase 1 placeholder hat — a soft pastel beret-y shape sitting on the
 * pet's head anchor. Intentionally generic; serves to exercise the
 * layered sprite pipeline end-to-end. Replaced by real per-page hats
 * in Phase 5.
 */
export function TestHat({ adult }: ItemRenderProps) {
  const { x, y } = headAnchor(adult)
  return (
    <g transform={`translate(${x} ${y - 4})`} aria-hidden="true">
      {/* Brim */}
      <ellipse cx="0" cy="2" rx="22" ry="4" fill="rgb(var(--accent))" />
      {/* Crown */}
      <ellipse cx="0" cy="-3" rx="14" ry="9" fill="rgb(var(--accent))" />
      {/* Highlight */}
      <ellipse
        cx="-4"
        cy="-5"
        rx="5"
        ry="3"
        fill="white"
        opacity="0.25"
      />
      {/* Pom on top */}
      <circle cx="0" cy="-12" r="2.5" fill="rgb(var(--accent-soft))" />
    </g>
  )
}
