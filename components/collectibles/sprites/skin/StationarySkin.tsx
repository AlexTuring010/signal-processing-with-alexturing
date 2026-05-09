import type { ItemRenderProps } from '@/lib/collectibles/types'

/**
 * Στάσιμο σκιν — uniform muted taupe body, no patterns. The visual
 * pun: stationarity = no spatial variation in the statistics.
 */
export function StationarySkin({ adult }: ItemRenderProps) {
  const bodyW = adult ? 78 : 70
  const bodyH = adult ? 76 : 68
  return (
    <g aria-hidden="true">
      <ellipse
        cx="60"
        cy="60"
        rx={bodyW / 2}
        ry={bodyH / 2}
        fill="#a59679"
      />
    </g>
  )
}
