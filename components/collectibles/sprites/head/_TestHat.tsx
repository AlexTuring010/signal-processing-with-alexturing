import type { ItemRenderProps } from '@/lib/collectibles/types'
import { headAnchor } from '@/lib/collectibles/anchors'

/**
 * Phase 1 placeholder hat — a small soft-pastel cap. Intentionally
 * generic; serves to exercise the layered sprite pipeline end-to-end.
 *
 * Sized so the adult's antenna tuft pops out above the crown rather
 * than being hidden under it. Real per-page hats land in Phase 5 and
 * each gets a designed silhouette around `ADULT_ANTENNA_ZONE`.
 */
export function TestHat({ adult }: ItemRenderProps) {
  const { x, y } = headAnchor(adult)
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      {/* Flat brim sitting at the head anchor. */}
      <ellipse cx="0" cy="2" rx="20" ry="3" fill="rgb(var(--accent))" />
      {/* Small dome — kept short so the adult's antenna ball (centered at
          y=12, top at y=9) clears the crown (top here at y=22-2-5=15
          for baby / y=18-2-5=11 for adult — antenna pokes through). */}
      <ellipse cx="0" cy="-2" rx="11" ry="5" fill="rgb(var(--accent))" />
      {/* Soft highlight */}
      <ellipse
        cx="-3"
        cy="-3"
        rx="4"
        ry="2"
        fill="white"
        opacity="0.3"
      />
    </g>
  )
}
