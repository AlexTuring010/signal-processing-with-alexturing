import type { ItemRenderProps } from '@/lib/collectibles/types'

/**
 * Φάσορ σκιν — indigo body with three rotating phasor arrows
 * radiating from the center, evoking phase modulation.
 */
export function PhasorSkin({ adult }: ItemRenderProps) {
  const bodyW = adult ? 78 : 70
  const bodyH = adult ? 76 : 68
  const gradId = `phasor-skin-${adult ? 'a' : 'b'}`
  return (
    <g aria-hidden="true">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#7d6cb8" />
          <stop offset="100%" stopColor="#1c1248" />
        </radialGradient>
      </defs>
      <ellipse
        cx="60"
        cy="60"
        rx={bodyW / 2}
        ry={bodyH / 2}
        fill={`url(#${gradId})`}
      />
      {/* Phasor arrows — three rotating vectors at 60°, 180°, 300°. */}
      {[60, 180, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180
        const len = 14
        const x2 = 60 + Math.cos(rad) * len
        const y2 = 60 + Math.sin(rad) * len
        // Arrowhead — small triangle perpendicular to the vector tip.
        const ahLen = 2.2
        const tx1 = x2 + Math.cos(rad + Math.PI - 0.45) * ahLen
        const ty1 = y2 + Math.sin(rad + Math.PI - 0.45) * ahLen
        const tx2 = x2 + Math.cos(rad + Math.PI + 0.45) * ahLen
        const ty2 = y2 + Math.sin(rad + Math.PI + 0.45) * ahLen
        return (
          <g key={deg}>
            <line
              x1="60"
              y1="60"
              x2={x2}
              y2={y2}
              stroke="white"
              strokeWidth="1.2"
              opacity="0.85"
              strokeLinecap="round"
            />
            <path
              d={`M ${x2} ${y2} L ${tx1} ${ty1} L ${tx2} ${ty2} Z`}
              fill="white"
              opacity="0.85"
            />
          </g>
        )
      })}
      {/* Center hub. */}
      <circle cx="60" cy="60" r="2" fill="white" opacity="0.9" />
    </g>
  )
}
