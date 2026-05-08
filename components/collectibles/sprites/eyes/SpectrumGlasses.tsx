import type { ItemRenderProps } from '@/lib/collectibles/types'
import { EYES_ANCHOR } from '@/lib/collectibles/anchors'

/**
 * Φάσμα-Γυαλιά — round-frame glasses whose lenses are tinted with a
 * soft prism gradient (red → green → blue). A nod to the spectrum
 * idea on the Fourier-transform page.
 */
export function SpectrumGlasses(_: ItemRenderProps) {
  const { x, y } = EYES_ANCHOR
  return (
    <g aria-hidden="true">
      <defs>
        <linearGradient
          id="spectrum-glasses-fill"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="rgb(var(--danger))" stopOpacity="0.55" />
          <stop offset="50%" stopColor="rgb(var(--success))" stopOpacity="0.55" />
          <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {/* Lens fills first, frames over them */}
      <circle cx={x - 10} cy={y} r="5.5" fill="url(#spectrum-glasses-fill)" />
      <circle cx={x + 10} cy={y} r="5.5" fill="url(#spectrum-glasses-fill)" />
      {/* Frames */}
      <circle
        cx={x - 10}
        cy={y}
        r="5.5"
        fill="none"
        stroke="rgb(var(--fg))"
        strokeWidth="1.5"
      />
      <circle
        cx={x + 10}
        cy={y}
        r="5.5"
        fill="none"
        stroke="rgb(var(--fg))"
        strokeWidth="1.5"
      />
      {/* Bridge */}
      <line
        x1={x - 4.5}
        y1={y}
        x2={x + 4.5}
        y2={y}
        stroke="rgb(var(--fg))"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Glints */}
      <circle cx={x - 12} cy={y - 2} r="1.1" fill="white" opacity="0.75" />
      <circle cx={x + 8} cy={y - 2} r="1.1" fill="white" opacity="0.75" />
    </g>
  )
}
