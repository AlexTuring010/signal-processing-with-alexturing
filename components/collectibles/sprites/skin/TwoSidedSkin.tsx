import type { ItemRenderProps } from '@/lib/collectibles/types'

/**
 * Δίφασμα σκιν — body with vertical bars that mirror about the
 * center axis. The bright central stripe is the carrier; the
 * fade-out bars on either side mirror like ±f conventions.
 */
export function TwoSidedSkin({ adult }: ItemRenderProps) {
  const bodyW = adult ? 78 : 70
  const bodyH = adult ? 76 : 68
  const clipId = `two-sided-skin-clip-${adult ? 'a' : 'b'}`
  // Symmetric bars: brightest at center, fade outward.
  const bars = [
    { x: 60, w: 6, fill: '#fff7d8' },
    { x: 50, w: 4, fill: '#f5d49a' },
    { x: 64, w: 4, fill: '#f5d49a' },
    { x: 42, w: 3, fill: '#d39966' },
    { x: 71, w: 3, fill: '#d39966' },
    { x: 35, w: 3, fill: '#7a583a' },
    { x: 78, w: 3, fill: '#7a583a' },
  ]
  return (
    <g aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <ellipse cx="60" cy="60" rx={bodyW / 2} ry={bodyH / 2} />
        </clipPath>
      </defs>
      {/* Dark backdrop */}
      <ellipse
        cx="60"
        cy="60"
        rx={bodyW / 2}
        ry={bodyH / 2}
        fill="#1c1830"
      />
      <g clipPath={`url(#${clipId})`}>
        {bars.map((b, i) => (
          <rect
            key={i}
            x={b.x - b.w / 2}
            y={60 - bodyH / 2}
            width={b.w}
            height={bodyH}
            fill={b.fill}
          />
        ))}
      </g>
    </g>
  )
}
