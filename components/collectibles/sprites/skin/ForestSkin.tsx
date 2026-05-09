import type { ItemRenderProps } from '@/lib/collectibles/types'

/**
 * Δάσος σκιν (Forest) — deep mossy green body with a few small leaf
 * marks scattered like dappled foliage. Skin slot.
 */
export function ForestSkin({ adult }: ItemRenderProps) {
  const bodyW = adult ? 78 : 70
  const bodyH = adult ? 76 : 68
  const gradId = `forest-skin-${adult ? 'a' : 'b'}`
  return (
    <g aria-hidden="true">
      <defs>
        <radialGradient id={gradId} cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#84c896" />
          <stop offset="60%" stopColor="#3f8052" />
          <stop offset="100%" stopColor="#1d3f28" />
        </radialGradient>
      </defs>
      <ellipse
        cx="60"
        cy="60"
        rx={bodyW / 2}
        ry={bodyH / 2}
        fill={`url(#${gradId})`}
      />
      {/* Leaf marks — small ellipses tilted at a few angles. */}
      <ellipse
        cx="46"
        cy="58"
        rx="2.2"
        ry="0.8"
        fill="#a8e0b4"
        opacity="0.7"
        transform="rotate(-30 46 58)"
      />
      <ellipse
        cx="74"
        cy="64"
        rx="2"
        ry="0.7"
        fill="#a8e0b4"
        opacity="0.65"
        transform="rotate(20 74 64)"
      />
      <ellipse
        cx="56"
        cy="78"
        rx="2.2"
        ry="0.8"
        fill="#a8e0b4"
        opacity="0.7"
        transform="rotate(-10 56 78)"
      />
      <ellipse
        cx="68"
        cy="50"
        rx="1.8"
        ry="0.6"
        fill="#a8e0b4"
        opacity="0.6"
        transform="rotate(40 68 50)"
      />
      <ellipse
        cx="50"
        cy="86"
        rx="1.6"
        ry="0.6"
        fill="#a8e0b4"
        opacity="0.55"
        transform="rotate(15 50 86)"
      />
    </g>
  )
}
