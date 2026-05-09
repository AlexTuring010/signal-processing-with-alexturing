import type { ItemRenderProps } from '@/lib/collectibles/types'

/**
 * Φιλομαθής Φανέλα — book-themed vest with a small open-book
 * patch on the chest. Awarded for marking ≥ 50% of chapters
 * complete via the existing CompleteToggle.
 *
 * Uses the same body-silhouette + U-neck contract as SignalShirt
 * (see `feedback_pet_clothing_design.md`).
 */
export function StudiousVest({ adult }: ItemRenderProps) {
  const rx = adult ? 39 : 35
  const ry = adult ? 38 : 34
  const sideY = 8
  const ctrlY = adult ? 32 : 30
  const xAtSide = rx * Math.sqrt(Math.max(0, 1 - (sideY / ry) ** 2))
  const STITCH = '#3a2a18'
  const FILL = '#7a5a36'
  return (
    <g transform="translate(60 60)" aria-hidden="true">
      <path
        d={`M ${-xAtSide} ${sideY}
            A ${rx} ${ry} 0 0 0 ${xAtSide} ${sideY}
            Q 0 ${ctrlY} ${-xAtSide} ${sideY}
            Z`}
        fill={FILL}
      />
      {/* Open-book patch on the chest. */}
      <g transform="translate(0 22)">
        {/* Pages — two leaves */}
        <path
          d="M-6 0 L-1 -2 L-1 4 L-6 6 Z"
          fill="#fff7e6"
          stroke={STITCH}
          strokeWidth="0.5"
        />
        <path
          d="M6 0 L1 -2 L1 4 L6 6 Z"
          fill="#fff7e6"
          stroke={STITCH}
          strokeWidth="0.5"
        />
        {/* Spine line */}
        <line x1="0" y1="-2" x2="0" y2="5" stroke={STITCH} strokeWidth="0.6" />
        {/* Tiny text rows */}
        <line x1="-5" y1="1" x2="-2" y2="0.4" stroke={STITCH} strokeWidth="0.3" />
        <line x1="-5" y1="2.5" x2="-2" y2="2" stroke={STITCH} strokeWidth="0.3" />
        <line x1="2" y1="0.4" x2="5" y2="1" stroke={STITCH} strokeWidth="0.3" />
        <line x1="2" y1="2" x2="5" y2="2.5" stroke={STITCH} strokeWidth="0.3" />
      </g>
      {/* Stitched neckline — traces the U-curve. */}
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
