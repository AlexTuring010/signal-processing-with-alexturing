import type { ItemRenderProps } from '@/lib/collectibles/types'

/**
 * Ριγέ σκιν — vertical stripes alternating cream and warm orange,
 * clipped to the body silhouette. Reads like passband bars on a
 * filter sweep.
 */
export function StripesSkin({ adult }: ItemRenderProps) {
  const bodyW = adult ? 78 : 70
  const bodyH = adult ? 76 : 68
  const clipId = `stripes-skin-clip-${adult ? 'a' : 'b'}`
  // Stripe geometry: 6 vertical bands across the body width.
  const stripeW = bodyW / 6
  const stripes = []
  for (let i = 0; i < 6; i++) {
    const x = 60 - bodyW / 2 + i * stripeW
    stripes.push({ x, color: i % 2 === 0 ? '#f5b072' : '#fff0d8' })
  }
  return (
    <g aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <ellipse cx="60" cy="60" rx={bodyW / 2} ry={bodyH / 2} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {stripes.map((s, i) => (
          <rect
            key={i}
            x={s.x}
            y={60 - bodyH / 2}
            width={stripeW + 0.6}
            height={bodyH}
            fill={s.color}
          />
        ))}
      </g>
      {/* Subtle gradient overlay to keep the rounded body feel. */}
      <ellipse
        cx="60"
        cy="60"
        rx={bodyW / 2}
        ry={bodyH / 2}
        fill="url(#stripes-skin-shade)"
      />
      <defs>
        <radialGradient id="stripes-skin-shade" cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor="white" stopOpacity="0.18" />
          <stop offset="100%" stopColor="black" stopOpacity="0.18" />
        </radialGradient>
      </defs>
    </g>
  )
}
