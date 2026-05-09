import type { ItemRenderProps } from '@/lib/collectibles/types'

/**
 * Πολκά σκιν — soft pink body with white dots scattered like
 * independent random samples on the surface.
 */
export function PolkaSkin({ adult }: ItemRenderProps) {
  const bodyW = adult ? 78 : 70
  const bodyH = adult ? 76 : 68
  const gradId = `polka-skin-${adult ? 'a' : 'b'}`
  return (
    <g aria-hidden="true">
      <defs>
        <radialGradient id={gradId} cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#ffc1d4" />
          <stop offset="100%" stopColor="#c8628c" />
        </radialGradient>
      </defs>
      <ellipse
        cx="60"
        cy="60"
        rx={bodyW / 2}
        ry={bodyH / 2}
        fill={`url(#${gradId})`}
      />
      {/* Scattered white polka dots — different sizes for variety. */}
      <circle cx="44" cy="50" r="2.4" fill="white" opacity="0.92" />
      <circle cx="72" cy="56" r="2" fill="white" opacity="0.88" />
      <circle cx="56" cy="74" r="2.6" fill="white" opacity="0.92" />
      <circle cx="80" cy="74" r="1.8" fill="white" opacity="0.85" />
      <circle cx="40" cy="70" r="1.6" fill="white" opacity="0.8" />
      <circle cx="60" cy="44" r="1.4" fill="white" opacity="0.78" />
      <circle cx="74" cy="42" r="1.2" fill="white" opacity="0.7" />
      <circle cx="48" cy="86" r="1.6" fill="white" opacity="0.8" />
      <circle cx="68" cy="86" r="1.4" fill="white" opacity="0.75" />
      <circle cx="38" cy="56" r="1" fill="white" opacity="0.65" />
    </g>
  )
}
