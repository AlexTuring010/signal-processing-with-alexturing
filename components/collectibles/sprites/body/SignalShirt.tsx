import type { ItemRenderProps } from '@/lib/collectibles/types'
import { BODY_CENTER } from '@/lib/collectibles/anchors'

/**
 * Φανέλα Σήματος — a soft pastel t-shirt with a single sine-wave
 * print across the chest. Body-slot item, so it tilts with the pet
 * during the sick-mood wobble (rendered inside the tilt group).
 */
export function SignalShirt({ adult }: ItemRenderProps) {
  const { x, y } = BODY_CENTER
  // Body widens with stage — keep the shirt fitted without overflow.
  const w = adult ? 32 : 28
  const h = adult ? 24 : 22
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      {/* Shirt body — soft rounded rectangle covering the upper torso */}
      <path
        d={`M${-w / 2} ${-h / 2 + 6}
             Q${-w / 2} ${-h / 2} ${-w / 2 + 6} ${-h / 2}
             L${w / 2 - 6} ${-h / 2}
             Q${w / 2} ${-h / 2} ${w / 2} ${-h / 2 + 6}
             L${w / 2} ${h / 2}
             Q${w / 2} ${h / 2 + 4} ${w / 2 - 4} ${h / 2 + 4}
             L${-w / 2 + 4} ${h / 2 + 4}
             Q${-w / 2} ${h / 2 + 4} ${-w / 2} ${h / 2}
             Z`}
        fill="rgb(var(--accent-soft))"
      />
      {/* Neckline notch */}
      <path
        d={`M-3 ${-h / 2} Q0 ${-h / 2 + 3} 3 ${-h / 2}`}
        fill="rgb(var(--accent))"
      />
      {/* Sine wave print — chest height */}
      <path
        d={`M${-w / 2 + 4} 2
             Q${-w / 4} -3 0 2
             Q${w / 4} 7 ${w / 2 - 4} 2`}
        stroke="rgb(var(--accent))"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      {/* Highlight along the shoulder */}
      <path
        d={`M${-w / 2 + 5} ${-h / 2 + 3} Q${-w / 4} ${-h / 2 + 1} 0 ${-h / 2 + 2}`}
        stroke="white"
        strokeWidth="0.8"
        fill="none"
        opacity="0.45"
      />
    </g>
  )
}
