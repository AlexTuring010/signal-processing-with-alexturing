import type { ItemRenderProps } from '@/lib/collectibles/types'

/**
 * Ηλιοβασίλεμα σκιν (Sunset) — warm coral-to-magenta gradient body
 * with a faint horizon stripe across the middle. Hints at AM
 * broadcast carriers riding waves of light at dusk.
 */
export function SunsetSkin({ adult }: ItemRenderProps) {
  const bodyW = adult ? 78 : 70
  const bodyH = adult ? 76 : 68
  const gradId = `sunset-skin-${adult ? 'a' : 'b'}`
  return (
    <g aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd28a" />
          <stop offset="40%" stopColor="#ff8e6d" />
          <stop offset="100%" stopColor="#7e2c5f" />
        </linearGradient>
      </defs>
      <ellipse
        cx="60"
        cy="60"
        rx={bodyW / 2}
        ry={bodyH / 2}
        fill={`url(#${gradId})`}
      />
      {/* Soft horizon line across the middle. */}
      <ellipse
        cx="60"
        cy="62"
        rx={bodyW / 2 - 4}
        ry="1.2"
        fill="white"
        opacity="0.4"
      />
      {/* Tiny sun glow off-center. */}
      <circle cx="48" cy="48" r="3.5" fill="#ffe0a8" opacity="0.65" />
      <circle cx="48" cy="48" r="1.5" fill="#fff5d8" opacity="0.95" />
    </g>
  )
}
