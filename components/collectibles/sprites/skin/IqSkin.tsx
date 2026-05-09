import type { ItemRenderProps } from '@/lib/collectibles/types'

/**
 * IQ σκιν — body split into a cool-blue I-channel half (left) and
 * a warm-red Q-channel half (right). The seam runs vertically down
 * the centerline.
 */
export function IqSkin({ adult }: ItemRenderProps) {
  const bodyW = adult ? 78 : 70
  const bodyH = adult ? 76 : 68
  const clipId = `iq-skin-clip-${adult ? 'a' : 'b'}`
  return (
    <g aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <ellipse cx="60" cy="60" rx={bodyW / 2} ry={bodyH / 2} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {/* I-channel — cool blue on the left half */}
        <rect
          x={60 - bodyW / 2}
          y={60 - bodyH / 2}
          width={bodyW / 2}
          height={bodyH}
          fill="#5d8cd4"
        />
        {/* Q-channel — warm red on the right half */}
        <rect
          x="60"
          y={60 - bodyH / 2}
          width={bodyW / 2}
          height={bodyH}
          fill="#d46c8c"
        />
        {/* Soft midline blend */}
        <rect
          x="56"
          y={60 - bodyH / 2}
          width="8"
          height={bodyH}
          fill="url(#iq-skin-mid)"
        />
      </g>
      <defs>
        <linearGradient id="iq-skin-mid" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#5d8cd4" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#a87cb0" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#d46c8c" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* I and Q labels on each side. */}
      <text
        x="46"
        y="58"
        fontSize="6"
        fill="white"
        fontFamily="serif"
        fontStyle="italic"
        opacity="0.85"
      >
        I
      </text>
      <text
        x="72"
        y="58"
        fontSize="6"
        fill="white"
        fontFamily="serif"
        fontStyle="italic"
        opacity="0.85"
      >
        Q
      </text>
    </g>
  )
}
