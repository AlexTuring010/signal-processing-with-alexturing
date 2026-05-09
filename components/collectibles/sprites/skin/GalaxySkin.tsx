import type { ItemRenderProps } from '@/lib/collectibles/types'

/**
 * Νυχτερινό σκιν (Galaxy) — purple-black gradient body with small
 * white star dots scattered across the surface. Skin-slot, drawn
 * over the default body fill inside the tilt group.
 */
export function GalaxySkin({ adult }: ItemRenderProps) {
  const bodyW = adult ? 78 : 70
  const bodyH = adult ? 76 : 68
  const gradId = `galaxy-skin-${adult ? 'a' : 'b'}`
  return (
    <g aria-hidden="true">
      <defs>
        <radialGradient id={gradId} cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#7c5fbf" />
          <stop offset="60%" stopColor="#3a2c70" />
          <stop offset="100%" stopColor="#160e30" />
        </radialGradient>
      </defs>
      <ellipse
        cx="60"
        cy="60"
        rx={bodyW / 2}
        ry={bodyH / 2}
        fill={`url(#${gradId})`}
      />
      {/* Star dots scattered across the body. */}
      <circle cx="44" cy="52" r="0.9" fill="white" opacity="0.9" />
      <circle cx="68" cy="62" r="0.7" fill="white" opacity="0.8" />
      <circle cx="55" cy="78" r="0.9" fill="white" opacity="0.85" />
      <circle cx="76" cy="48" r="0.6" fill="white" opacity="0.7" />
      <circle cx="40" cy="74" r="0.6" fill="white" opacity="0.7" />
      <circle cx="60" cy="42" r="0.5" fill="white" opacity="0.6" />
      <circle cx="50" cy="68" r="0.4" fill="white" opacity="0.55" />
      <circle cx="78" cy="74" r="0.5" fill="white" opacity="0.65" />
      <circle cx="46" cy="86" r="0.4" fill="white" opacity="0.5" />
      <circle cx="72" cy="86" r="0.5" fill="white" opacity="0.6" />
      <circle cx="36" cy="62" r="0.3" fill="white" opacity="0.45" />
      <circle cx="80" cy="56" r="0.3" fill="white" opacity="0.5" />
    </g>
  )
}
