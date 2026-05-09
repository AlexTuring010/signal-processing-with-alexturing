import type { ItemRenderProps } from '@/lib/collectibles/types'

/**
 * Τριγωνικό σκιν — body with a triangular pyramid pattern
 * radiating from the center, hinting at the f²-shaped output noise
 * PSD that appears after FM demodulation.
 */
export function TriangleSkin({ adult }: ItemRenderProps) {
  const bodyW = adult ? 78 : 70
  const bodyH = adult ? 76 : 68
  const gradId = `tri-skin-${adult ? 'a' : 'b'}`
  return (
    <g aria-hidden="true">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#ffe0a3" />
          <stop offset="100%" stopColor="#7a3424" />
        </radialGradient>
      </defs>
      <ellipse
        cx="60"
        cy="60"
        rx={bodyW / 2}
        ry={bodyH / 2}
        fill={`url(#${gradId})`}
      />
      {/* Three triangles arranged like a wedge sweep up from the
          center — quick visual cue for an f² noise spectrum. */}
      <path
        d="M 60 90 L 44 60 L 60 60 Z"
        fill="white"
        opacity="0.18"
      />
      <path
        d="M 60 90 L 76 60 L 60 60 Z"
        fill="white"
        opacity="0.18"
      />
      <path
        d="M 60 60 L 50 36 L 70 36 Z"
        fill="white"
        opacity="0.22"
      />
      {/* Small gridlines on the wedges */}
      <line x1="60" y1="60" x2="60" y2="90" stroke="white" strokeWidth="0.5" opacity="0.4" />
      <line x1="60" y1="60" x2="60" y2="36" stroke="white" strokeWidth="0.5" opacity="0.4" />
    </g>
  )
}
