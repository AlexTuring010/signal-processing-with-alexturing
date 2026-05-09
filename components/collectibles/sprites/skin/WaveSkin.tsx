import type { ItemRenderProps } from '@/lib/collectibles/types'

/**
 * Καμπύλο σκιν — body with a smooth diagonal gradient (peach →
 * lavender) and a single bold sine-wave running across the chest.
 * For the signal-transformations page where time-shifts and
 * scalings live.
 */
export function WaveSkin({ adult }: ItemRenderProps) {
  const bodyW = adult ? 78 : 70
  const bodyH = adult ? 76 : 68
  const gradId = `wave-skin-${adult ? 'a' : 'b'}`
  return (
    <g aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffd4a8" />
          <stop offset="50%" stopColor="#e6a4d8" />
          <stop offset="100%" stopColor="#7f5cb8" />
        </linearGradient>
      </defs>
      <ellipse
        cx="60"
        cy="60"
        rx={bodyW / 2}
        ry={bodyH / 2}
        fill={`url(#${gradId})`}
      />
      {/* A single bold sine wave swept across the body at chest height. */}
      <path
        d="M 30 64
           Q 40 56 50 64
           Q 60 72 70 64
           Q 80 56 90 64"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      />
    </g>
  )
}
