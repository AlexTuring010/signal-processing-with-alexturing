import type { ItemRenderProps } from '@/lib/collectibles/types'
import { EYES_ANCHOR } from '@/lib/collectibles/anchors'

/**
 * Μονόκλ SSB — single-lens eyepiece on the right eye, with a thin
 * chain trailing toward the body. The visual joke: SSB transmits
 * one sideband only — so the pet wears one lens only.
 */
export function SsbMonocle(_: ItemRenderProps) {
  const { x, y } = EYES_ANCHOR
  return (
    <g aria-hidden="true">
      {/* Lens on the right eye */}
      <circle
        cx={x + 10}
        cy={y}
        r="6"
        fill="#dde9f0"
        fillOpacity="0.4"
        stroke="#2a3540"
        strokeWidth="1.4"
      />
      {/* Glint */}
      <circle cx={x + 8} cy={y - 2} r="1.2" fill="white" opacity="0.85" />
      {/* Chain — drapes from the bottom-right of the lens down to
          the right edge of the body. */}
      <path
        d={`M ${x + 14} ${y + 4}
            Q ${x + 22} ${y + 12} ${x + 30} ${y + 18}`}
        stroke="#2a3540"
        strokeWidth="0.8"
        fill="none"
        strokeDasharray="1 1"
        opacity="0.85"
      />
    </g>
  )
}
