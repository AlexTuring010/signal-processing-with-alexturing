import type { ItemRenderProps } from '@/lib/collectibles/types'

/**
 * Συνέλιξη σκιν — twin overlapping sine waves on a deep-violet body,
 * one shifted relative to the other, a visual hint at convolving an
 * input with an impulse response.
 */
export function ConvolutionSkin({ adult }: ItemRenderProps) {
  const bodyW = adult ? 78 : 70
  const bodyH = adult ? 76 : 68
  const gradId = `conv-skin-${adult ? 'a' : 'b'}`
  return (
    <g aria-hidden="true">
      <defs>
        <radialGradient id={gradId} cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#a799d4" />
          <stop offset="100%" stopColor="#2a1f5e" />
        </radialGradient>
      </defs>
      <ellipse
        cx="60"
        cy="60"
        rx={bodyW / 2}
        ry={bodyH / 2}
        fill={`url(#${gradId})`}
      />
      {/* Wave A — broader, slower */}
      <path
        d="M 28 56 Q 38 48 48 56 Q 58 64 68 56 Q 78 48 88 56"
        stroke="white"
        strokeWidth="1.1"
        fill="none"
        opacity="0.55"
        strokeLinecap="round"
      />
      {/* Wave B — tighter, phase-shifted */}
      <path
        d="M 28 76 Q 35 70 42 76 Q 49 82 56 76 Q 63 70 70 76 Q 77 82 84 76 Q 88 73 92 75"
        stroke="white"
        strokeWidth="1.1"
        fill="none"
        opacity="0.5"
        strokeLinecap="round"
      />
    </g>
  )
}
