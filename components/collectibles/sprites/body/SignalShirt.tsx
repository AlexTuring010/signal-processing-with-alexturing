import type { ItemRenderProps } from '@/lib/collectibles/types'

/**
 * Φανέλα Σήματος — saturated mint t-shirt with a sine-wave print on
 * the chest.
 *
 * Shape contract for body-slot items (see scripts/sprite-preview):
 *   - Lower-body silhouette via SVG arc (rx, ry MUST match the body
 *     ellipse in PetSprite.tsx). Use sweep-flag=0 so the arc goes
 *     through the *bottom* of the body, not the top.
 *   - U-shape neckline via a Q-curve closing the path: high at the
 *     sides (under the arms), dipping down at the center to clear
 *     the mouth.
 *   - Arms render *on top of* this layer in PetSprite, so the cuff
 *     of any sleeve is the inner side of the arm nubs.
 */
export function SignalShirt({ adult }: ItemRenderProps) {
  const rx = adult ? 39 : 35
  const ry = adult ? 38 : 34
  // sideY: y where the neckline meets the body silhouette (under the
  // arms). ctrlY: Q-control point pulling the curve down at center,
  // apex sits roughly halfway between sideY and ctrlY (~y=20 here),
  // i.e. clearly below the mouth (y_rel 12-18).
  const sideY = 8
  const ctrlY = adult ? 32 : 30
  const xAtSide = rx * Math.sqrt(Math.max(0, 1 - (sideY / ry) ** 2))
  const SHIRT = '#3eb371'
  const SHIRT_OUTLINE = '#1f6e44'
  const waveY = adult ? 26 : 23
  return (
    <g transform="translate(60 60)" aria-hidden="true">
      <path
        d={`M ${-xAtSide} ${sideY}
            A ${rx} ${ry} 0 0 0 ${xAtSide} ${sideY}
            Q 0 ${ctrlY} ${-xAtSide} ${sideY}
            Z`}
        fill={SHIRT}
      />
      <path
        d={`M ${-xAtSide + 1} ${sideY}
            Q 0 ${ctrlY - 1} ${xAtSide - 1} ${sideY}`}
        stroke={SHIRT_OUTLINE}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M ${-xAtSide * 0.5} ${waveY}
            Q ${-xAtSide * 0.25} ${waveY - 3} 0 ${waveY}
            Q ${xAtSide * 0.25} ${waveY + 3} ${xAtSide * 0.5} ${waveY}`}
        stroke={SHIRT_OUTLINE}
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  )
}
