/**
 * Μιγαδικός πίνακας — small framed wall decoration showing the
 * complex plane with Real/Imaginary axes, the unit circle, and a
 * phasor pointing into Q1. Wall slot, 60×40 viewBox.
 */
export function ComplexFrame() {
  return (
    <svg viewBox="0 0 60 40" width="100%" height="100%" aria-hidden="true">
      {/* Frame */}
      <rect x="2" y="2" width="56" height="36" rx="2" fill="#3a3550" />
      <rect
        x="4"
        y="4"
        width="52"
        height="32"
        rx="1"
        fill="none"
        stroke="#1c1830"
        strokeWidth="0.6"
      />
      {/* Canvas */}
      <rect x="6" y="6" width="48" height="28" fill="#f0eaf5" />
      {/* Axes */}
      <line x1="10" y1="20" x2="50" y2="20" stroke="#5a4f7a" strokeWidth="0.6" />
      <line x1="30" y1="9" x2="30" y2="32" stroke="#5a4f7a" strokeWidth="0.6" />
      {/* Unit circle */}
      <circle cx="30" cy="20" r="9" fill="none" stroke="#5a4f7a" strokeWidth="0.7" />
      {/* Phasor arrow at ≈ 35° into Q1 */}
      <line
        x1="30"
        y1="20"
        x2={30 + 9 * Math.cos((35 * Math.PI) / 180)}
        y2={20 - 9 * Math.sin((35 * Math.PI) / 180)}
        stroke="#a14d6e"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Arrowhead */}
      <circle
        cx={30 + 9 * Math.cos((35 * Math.PI) / 180)}
        cy={20 - 9 * Math.sin((35 * Math.PI) / 180)}
        r="1.2"
        fill="#a14d6e"
      />
      {/* Re / Im labels */}
      <text x="48" y="24" fontSize="3.5" fill="#5a4f7a" fontFamily="serif" fontStyle="italic">
        Re
      </text>
      <text x="32" y="11" fontSize="3.5" fill="#5a4f7a" fontFamily="serif" fontStyle="italic">
        Im
      </text>
    </svg>
  )
}
