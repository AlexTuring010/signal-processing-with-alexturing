import type { ItemRenderProps } from '@/lib/collectibles/types'
import { headAnchor } from '@/lib/collectibles/anchors'

/**
 * FM Ακουστικά — over-ear headphones with a dark band arching across
 * the head and two earcup pads sitting on the sides. Occupies the
 * head slot per the catalog table; the band passes behind the antenna
 * on adults rather than covering it.
 */
export function FmHeadphones({ adult }: ItemRenderProps) {
  const { x, y } = headAnchor(adult)
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      {/* Headband — thick arch from earcup to earcup */}
      <path
        d="M-18 6 Q-18 -8 0 -8 Q18 -8 18 6"
        stroke="rgb(var(--fg))"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Inner band sheen */}
      <path
        d="M-15 4 Q-15 -5 0 -5 Q15 -5 15 4"
        stroke="white"
        strokeWidth="0.6"
        fill="none"
        opacity="0.4"
      />
      {/* Left earcup */}
      <ellipse cx="-19" cy="8" rx="4.5" ry="5.5" fill="rgb(var(--fg))" />
      <ellipse cx="-19" cy="8" rx="2.8" ry="3.6" fill="rgb(var(--accent))" />
      <circle cx="-19" cy="8" r="0.8" fill="white" opacity="0.7" />
      {/* Right earcup */}
      <ellipse cx="19" cy="8" rx="4.5" ry="5.5" fill="rgb(var(--fg))" />
      <ellipse cx="19" cy="8" rx="2.8" ry="3.6" fill="rgb(var(--accent))" />
      <circle cx="19" cy="8" r="0.8" fill="white" opacity="0.7" />
    </g>
  )
}
