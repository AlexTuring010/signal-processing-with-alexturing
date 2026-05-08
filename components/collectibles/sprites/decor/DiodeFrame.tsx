/**
 * Διοδική Κορνίζα — small framed diagram with the diode triangle/bar
 * symbol. Wall slot, 60×40 viewBox.
 */
export function DiodeFrame() {
  return (
    <svg viewBox="0 0 60 40" width="100%" height="100%" aria-hidden="true">
      {/* Frame */}
      <rect x="2" y="2" width="56" height="36" rx="2" fill="#3d3a36" />
      <rect
        x="4"
        y="4"
        width="52"
        height="32"
        rx="1"
        fill="none"
        stroke="#1f1d1a"
        strokeWidth="0.6"
      />
      {/* Canvas — slight blueprint feel */}
      <rect x="6" y="6" width="48" height="28" fill="#dde6e7" />
      {/* Wire on the left */}
      <line x1="10" y1="20" x2="22" y2="20" stroke="#2a3540" strokeWidth="1" strokeLinecap="round" />
      {/* Diode triangle */}
      <path d="M 22 14 L 22 26 L 32 20 Z" fill="#2a3540" />
      {/* Diode bar */}
      <line x1="32" y1="14" x2="32" y2="26" stroke="#2a3540" strokeWidth="1.4" strokeLinecap="round" />
      {/* Wire on the right */}
      <line x1="32" y1="20" x2="50" y2="20" stroke="#2a3540" strokeWidth="1" strokeLinecap="round" />
      {/* Tiny "+" on the left wire */}
      <text x="14" y="14" fontSize="5" fill="#2a3540" fontFamily="serif">+</text>
      <text x="44" y="14" fontSize="5" fill="#2a3540" fontFamily="serif">−</text>
    </svg>
  )
}
