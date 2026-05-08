/**
 * Στατικό Αμπαζούρ — floor lamp with a wide trapezoidal shade and
 * white-noise speckles glowing around the bulb. Lamp slot, 50×60.
 */
export function StaticLamp() {
  return (
    <svg viewBox="0 0 50 60" width="100%" height="100%" aria-hidden="true">
      {/* Glow halo behind the shade */}
      <ellipse cx="25" cy="14" rx="22" ry="10" fill="#ffe9b3" opacity="0.25" />
      {/* Lamp shade — trapezoid */}
      <path
        d="M 12 6 L 38 6 L 42 22 L 8 22 Z"
        fill="#cbb78a"
      />
      {/* Shade highlight */}
      <path
        d="M 14 8 L 36 8 L 37 12 L 13 12 Z"
        fill="white"
        opacity="0.25"
      />
      {/* Shade trim */}
      <line x1="8" y1="22" x2="42" y2="22" stroke="#7a6845" strokeWidth="0.8" />
      {/* Stand */}
      <rect x="24" y="22" width="2" height="28" fill="#8a724b" />
      {/* Base */}
      <ellipse cx="25" cy="52" rx="9" ry="3" fill="#5d4d31" />
      <ellipse cx="25" cy="52" rx="6" ry="1.6" fill="#7a6845" />
      {/* White-noise speckles around the shade */}
      <circle cx="6" cy="14" r="0.7" fill="white" opacity="0.7" />
      <circle cx="9" cy="20" r="0.5" fill="white" opacity="0.6" />
      <circle cx="44" cy="16" r="0.6" fill="white" opacity="0.7" />
      <circle cx="41" cy="22" r="0.5" fill="white" opacity="0.6" />
      <circle cx="3" cy="20" r="0.5" fill="white" opacity="0.5" />
      <circle cx="47" cy="20" r="0.5" fill="white" opacity="0.5" />
      <circle cx="20" cy="3" r="0.4" fill="white" opacity="0.5" />
      <circle cx="32" cy="2" r="0.5" fill="white" opacity="0.6" />
    </svg>
  )
}
