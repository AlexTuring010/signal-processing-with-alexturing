import type { ItemRenderProps } from '@/lib/collectibles/types'

/**
 * Σακάκι AM — formal burgundy jacket with a U-neckline and two
 * gold buttons stacked on the centerline.
 *
 * Same body-silhouette + U-neck contract as SignalShirt (see
 * scripts/sprite-preview): arc with sweep-flag=0 traces the lower
 * body, a Q-curve dips the neckline below the mouth.
 */
export function AmJacket({ adult }: ItemRenderProps) {
  const rx = adult ? 39 : 35
  const ry = adult ? 38 : 34
  const sideY = 8
  const ctrlY = adult ? 32 : 30
  const xAtSide = rx * Math.sqrt(Math.max(0, 1 - (sideY / ry) ** 2))
  const STITCH = '#15050a'
  const BUTTON = '#d4a857'
  // Lower button sits just below where the V of the U-neck would
  // converge; upper button is 5 px above on the centerline.
  const lowerButtonY = ctrlY - 2
  const upperButtonY = lowerButtonY - 5
  const gradId = `am-jacket-fill-${adult ? 'a' : 'b'}`
  return (
    <g transform="translate(60 60)" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a2533" />
          <stop offset="100%" stopColor="#2a0e16" />
        </linearGradient>
      </defs>
      <path
        d={`M ${-xAtSide} ${sideY}
            A ${rx} ${ry} 0 0 0 ${xAtSide} ${sideY}
            Q 0 ${ctrlY} ${-xAtSide} ${sideY}
            Z`}
        fill={`url(#${gradId})`}
      />
      <circle cx="0" cy={lowerButtonY} r="2" fill={BUTTON} />
      <circle cx="-0.5" cy={lowerButtonY - 0.5} r="0.7" fill="white" opacity="0.75" />
      <circle cx="0" cy={upperButtonY} r="2" fill={BUTTON} />
      <circle cx="-0.5" cy={upperButtonY - 0.5} r="0.7" fill="white" opacity="0.75" />
      <path
        d={`M ${-xAtSide + 1} ${sideY}
            Q 0 ${ctrlY - 1} ${xAtSide - 1} ${sideY}`}
        stroke={STITCH}
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  )
}
