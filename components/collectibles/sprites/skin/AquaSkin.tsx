import type { ItemRenderProps } from '@/lib/collectibles/types'

/**
 * Θαλασσί σκιν — teal-to-deep-cyan body with a faint horizontal
 * ripple. Smooth, "filtered" look — fitting for a noise-through-
 * filter unlock.
 */
export function AquaSkin({ adult }: ItemRenderProps) {
  const bodyW = adult ? 78 : 70
  const bodyH = adult ? 76 : 68
  const gradId = `aqua-skin-${adult ? 'a' : 'b'}`
  return (
    <g aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86dde0" />
          <stop offset="100%" stopColor="#1c4f64" />
        </linearGradient>
      </defs>
      <ellipse
        cx="60"
        cy="60"
        rx={bodyW / 2}
        ry={bodyH / 2}
        fill={`url(#${gradId})`}
      />
      {/* Three faint horizontal ripples suggest a filtered waveform. */}
      <path
        d="M 30 56 Q 60 52 90 56"
        stroke="white"
        strokeWidth="0.7"
        fill="none"
        opacity="0.35"
        strokeLinecap="round"
      />
      <path
        d="M 28 70 Q 60 66 92 70"
        stroke="white"
        strokeWidth="0.7"
        fill="none"
        opacity="0.3"
        strokeLinecap="round"
      />
      <path
        d="M 32 84 Q 60 80 88 84"
        stroke="white"
        strokeWidth="0.7"
        fill="none"
        opacity="0.25"
        strokeLinecap="round"
      />
    </g>
  )
}
