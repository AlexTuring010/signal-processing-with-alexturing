/**
 * Φωτιστικό SNR — modern desk-style lamp with an "S/N" label etched
 * on the shade. Lamp slot, 50×60.
 */
export function SnrLamp() {
  return (
    <svg viewBox="0 0 50 60" width="100%" height="100%" aria-hidden="true">
      {/* Glow */}
      <ellipse cx="20" cy="22" rx="16" ry="9" fill="#cfe6f5" opacity="0.32" />
      {/* Shade — angled cylinder, opening toward lower-left */}
      <path
        d="M 8 14 L 32 8 L 34 18 L 10 24 Z"
        fill="#3a5e96"
      />
      <path
        d="M 10 15 L 30 10 L 31 13 L 11 18 Z"
        fill="white"
        opacity="0.22"
      />
      {/* Shade rim */}
      <line x1="8" y1="14" x2="10" y2="24" stroke="#162a52" strokeWidth="0.8" />
      {/* "S/N" label etched on the shade */}
      <text x="14" y="20" fontSize="6" fill="white" fontFamily="sans-serif" fontWeight="700" opacity="0.85">
        S/N
      </text>
      {/* Bent arm */}
      <line x1="33" y1="13" x2="38" y2="30" stroke="#5d6f8a" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="38" y1="30" x2="32" y2="48" stroke="#5d6f8a" strokeWidth="1.4" strokeLinecap="round" />
      {/* Base */}
      <ellipse cx="32" cy="50" rx="9" ry="2.6" fill="#162a52" />
      <ellipse cx="32" cy="50" rx="6" ry="1.4" fill="#3a5e96" />
      {/* Pivot at arm-shade joint */}
      <circle cx="33" cy="13" r="1.2" fill="#162a52" />
      {/* Pivot at arm-base joint */}
      <circle cx="32" cy="48" r="1.4" fill="#162a52" />
    </svg>
  )
}
