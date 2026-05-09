import type { ItemRenderProps } from '@/lib/collectibles/types'

/**
 * Bessel σκιν — gold body with concentric rings emanating from the
 * center, mimicking the J₀ Bessel function visualization. Skin slot.
 */
export function BesselSkin({ adult }: ItemRenderProps) {
  const bodyW = adult ? 78 : 70
  const bodyH = adult ? 76 : 68
  const gradId = `bessel-skin-${adult ? 'a' : 'b'}`
  return (
    <g aria-hidden="true">
      <defs>
        <radialGradient id={gradId} cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#fde08e" />
          <stop offset="100%" stopColor="#9c6a1e" />
        </radialGradient>
      </defs>
      <ellipse
        cx="60"
        cy="60"
        rx={bodyW / 2}
        ry={bodyH / 2}
        fill={`url(#${gradId})`}
      />
      {/* Concentric rings — fading outward, hinting at Bessel sidebands. */}
      <ellipse
        cx="60"
        cy="60"
        rx={bodyW / 2 - 4}
        ry={bodyH / 2 - 3}
        fill="none"
        stroke="white"
        strokeWidth="0.7"
        opacity="0.45"
      />
      <ellipse
        cx="60"
        cy="60"
        rx={bodyW / 2 - 10}
        ry={bodyH / 2 - 8}
        fill="none"
        stroke="white"
        strokeWidth="0.7"
        opacity="0.4"
      />
      <ellipse
        cx="60"
        cy="60"
        rx={bodyW / 2 - 16}
        ry={bodyH / 2 - 13}
        fill="none"
        stroke="white"
        strokeWidth="0.7"
        opacity="0.35"
      />
      <ellipse
        cx="60"
        cy="60"
        rx={bodyW / 2 - 22}
        ry={bodyH / 2 - 18}
        fill="none"
        stroke="white"
        strokeWidth="0.7"
        opacity="0.3"
      />
    </g>
  )
}
