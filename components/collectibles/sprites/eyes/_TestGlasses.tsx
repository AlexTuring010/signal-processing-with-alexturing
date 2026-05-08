import type { ItemRenderProps } from '@/lib/collectibles/types'
import { EYES_ANCHOR } from '@/lib/collectibles/anchors'

/**
 * Phase 1 placeholder glasses. Two thin-rimmed circles connected by a
 * tiny bridge over the eye anchor. Stays still when the pet tilts sick
 * because eyes-slot items render outside the tilt group.
 *
 * Replaced by real per-page eyewear in Phase 5.
 */
export function TestGlasses(_: ItemRenderProps) {
  const { x, y } = EYES_ANCHOR
  return (
    <g aria-hidden="true">
      {/* Left lens */}
      <circle
        cx={x - 10}
        cy={y}
        r="6"
        fill="none"
        stroke="rgb(var(--fg))"
        strokeWidth="1.5"
      />
      {/* Right lens */}
      <circle
        cx={x + 10}
        cy={y}
        r="6"
        fill="none"
        stroke="rgb(var(--fg))"
        strokeWidth="1.5"
      />
      {/* Bridge */}
      <line
        x1={x - 4}
        y1={y}
        x2={x + 4}
        y2={y}
        stroke="rgb(var(--fg))"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Tiny glint */}
      <circle cx={x - 12} cy={y - 2} r="1.2" fill="white" opacity="0.7" />
      <circle cx={x + 8} cy={y - 2} r="1.2" fill="white" opacity="0.7" />
    </g>
  )
}
