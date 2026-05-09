/**
 * Πόστερ PSD — framed wall poster with a stylized power-spectral-
 * density bar chart inside. Wall slot, 60×40 viewBox.
 */
export function PsdPoster() {
  return (
    <svg viewBox="0 0 60 40" width="100%" height="100%" aria-hidden="true">
      {/* Frame */}
      <rect x="2" y="2" width="56" height="36" rx="2" fill="#2d4763" />
      <rect
        x="4"
        y="4"
        width="52"
        height="32"
        rx="1"
        fill="none"
        stroke="#162a52"
        strokeWidth="0.6"
      />
      {/* Canvas */}
      <rect x="6" y="6" width="48" height="28" fill="#eef3f8" />
      {/* Axes */}
      <line x1="9" y1="30" x2="51" y2="30" stroke="#5a6d82" strokeWidth="0.6" />
      <line x1="9" y1="9" x2="9" y2="30" stroke="#5a6d82" strokeWidth="0.6" />
      {/* PSD bars — uneven heights suggesting a real spectrum. */}
      <rect x="12" y="22" width="3" height="8" fill="#3a5e96" />
      <rect x="16" y="14" width="3" height="16" fill="#3a5e96" />
      <rect x="20" y="10" width="3" height="20" fill="#3a5e96" />
      <rect x="24" y="13" width="3" height="17" fill="#3a5e96" />
      <rect x="28" y="20" width="3" height="10" fill="#3a5e96" />
      <rect x="32" y="24" width="3" height="6" fill="#3a5e96" />
      <rect x="36" y="22" width="3" height="8" fill="#3a5e96" />
      <rect x="40" y="26" width="3" height="4" fill="#3a5e96" />
      <rect x="44" y="27" width="3" height="3" fill="#3a5e96" />
      <rect x="48" y="28" width="3" height="2" fill="#3a5e96" />
      {/* "S(f)" label */}
      <text x="11" y="13" fontSize="3.5" fill="#5a6d82" fontFamily="serif" fontStyle="italic">
        S(f)
      </text>
    </svg>
  )
}
