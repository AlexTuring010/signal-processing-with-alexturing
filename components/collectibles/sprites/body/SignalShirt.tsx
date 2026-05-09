import type { ItemRenderProps } from '@/lib/collectibles/types'

/**
 * Φανέλα Σήματος — dark-blue gradient t-shirt with a centered
 * sine-wave print and a stitched U-neckline.
 *
 * Shape contract for body-slot items (see scripts/sprite-preview):
 *   - Lower-body silhouette via SVG arc (rx, ry MUST match the body
 *     ellipse in PetSprite.tsx). Use sweep-flag=0 so the arc goes
 *     through the *bottom* of the body.
 *   - U-shape neckline via a Q-curve closing the path: high at the
 *     sides (under the arms), dipping down at the center to clear
 *     the mouth.
 *   - Arms render *on top of* this layer in PetSprite, so the cuff
 *     of any sleeve is the inner side of the arm nubs.
 */
export function SignalShirt({ adult }: ItemRenderProps) {
  const rx = adult ? 39 : 35
  const ry = adult ? 38 : 34
  const sideY = 8
  const ctrlY = adult ? 32 : 30
  const xAtSide = rx * Math.sqrt(Math.max(0, 1 - (sideY / ry) ** 2))
  const STITCH = '#0f2447'
  const waveY = adult ? 26 : 24
  const waveHalfW = adult ? 9 : 8
  // Static id is fine — the gradient stops are identical for every
  // instance, so even if catalog + pet render the same component
  // both reference the same defs and look right.
  const gradId = `signal-shirt-fill-${adult ? 'a' : 'b'}`
  return (
    <g transform="translate(60 60)" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5b85bf" />
          <stop offset="100%" stopColor="#1f3a76" />
        </linearGradient>
      </defs>
      <path
        d={`M ${-xAtSide} ${sideY}
            A ${rx} ${ry} 0 0 0 ${xAtSide} ${sideY}
            Q 0 ${ctrlY} ${-xAtSide} ${sideY}
            Z`}
        fill={`url(#${gradId})`}
      />
      <path
        d={`M ${-waveHalfW} ${waveY}
            Q ${-waveHalfW * 0.5} ${waveY - 2.2} 0 ${waveY}
            Q ${waveHalfW * 0.5} ${waveY + 2.2} ${waveHalfW} ${waveY}`}
        stroke={STITCH}
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M ${-xAtSide + 1} ${sideY}
            Q 0 ${ctrlY - 1} ${xAtSide - 1} ${sideY}`}
        stroke={STITCH}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  )
}
