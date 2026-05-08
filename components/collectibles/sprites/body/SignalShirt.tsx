import type { ItemRenderProps } from '@/lib/collectibles/types'
import { BODY_CENTER } from '@/lib/collectibles/anchors'

/**
 * Φανέλα Σήματος — a soft pastel belly-band shirt with a sine wave
 * print across the chest. Sized and positioned so it sits *below* the
 * face (eyes y=50, mouth y=72-78) — covering the lower torso so the
 * face stays the body's accent gradient, not a flat shirt color.
 *
 * Body-slot, so it tilts with the pet during the sick-mood wobble
 * (rendered inside the tilt group). Doesn't extend to the arms.
 */
export function SignalShirt({ adult }: ItemRenderProps) {
  const { x, y } = BODY_CENTER
  // Wider on adult to match the bigger body silhouette.
  const w = adult ? 38 : 34
  const h = adult ? 18 : 16
  // Push down so the shirt's top sits just at chin level (y≈68 abs)
  // instead of covering the eye area. Adult body extends a bit lower,
  // so it gets a tiny bit more offset.
  const dy = adult ? 17 : 15
  return (
    <g transform={`translate(${x} ${y + dy})`} aria-hidden="true">
      {/* Soft pastel band hugging the lower torso. */}
      <ellipse cx="0" cy="0" rx={w / 2} ry={h / 2} fill="rgb(var(--accent-soft))" />
      {/* Crisp neckline edge so the shirt reads as fabric, not just a fill. */}
      <path
        d={`M ${-w / 2 + 2} ${-h / 2 + 1} Q 0 ${-h / 2 - 1} ${w / 2 - 2} ${-h / 2 + 1}`}
        stroke="rgb(var(--accent))"
        strokeWidth="1"
        fill="none"
        opacity="0.55"
      />
      {/* Highlight */}
      <ellipse
        cx={-w / 5}
        cy={-h / 4}
        rx={w / 8}
        ry="1.5"
        fill="white"
        opacity="0.35"
      />
      {/* Sine wave print — single visible cycle across the front */}
      <path
        d={`M ${-w / 2 + 5} 1 Q ${-w / 4} -3 0 1 Q ${w / 4} 5 ${w / 2 - 5} 1`}
        stroke="rgb(var(--accent))"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  )
}
