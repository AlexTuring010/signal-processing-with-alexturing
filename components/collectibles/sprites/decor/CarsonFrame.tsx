/**
 * Carson κορνίζα — small framed wall decoration with a stylized
 * FM spectrum + a labeled width bracket "B = 2(Δf + fm)" beneath.
 */
export function CarsonFrame() {
  return (
    <svg viewBox="0 0 60 40" width="100%" height="100%" aria-hidden="true">
      {/* Frame */}
      <rect x="2" y="2" width="56" height="36" rx="2" fill="#4d3f2a" />
      <rect
        x="4"
        y="4"
        width="52"
        height="32"
        rx="1"
        fill="none"
        stroke="#2a2014"
        strokeWidth="0.6"
      />
      {/* Canvas */}
      <rect x="6" y="6" width="48" height="28" fill="#f5ecdb" />
      {/* Center carrier line */}
      <line x1="30" y1="22" x2="30" y2="28" stroke="#7a4d20" strokeWidth="1.2" />
      {/* Sidebands — diminishing height pairs around the carrier */}
      <line x1="26" y1="24" x2="26" y2="28" stroke="#7a4d20" strokeWidth="0.9" />
      <line x1="34" y1="24" x2="34" y2="28" stroke="#7a4d20" strokeWidth="0.9" />
      <line x1="22" y1="25" x2="22" y2="28" stroke="#7a4d20" strokeWidth="0.7" />
      <line x1="38" y1="25" x2="38" y2="28" stroke="#7a4d20" strokeWidth="0.7" />
      <line x1="18" y1="26" x2="18" y2="28" stroke="#7a4d20" strokeWidth="0.5" />
      <line x1="42" y1="26" x2="42" y2="28" stroke="#7a4d20" strokeWidth="0.5" />
      {/* Frequency axis */}
      <line x1="10" y1="28" x2="50" y2="28" stroke="#7a4d20" strokeWidth="0.4" />
      {/* Bandwidth bracket below */}
      <line x1="14" y1="31" x2="46" y2="31" stroke="#a14d2c" strokeWidth="0.7" />
      <line x1="14" y1="30" x2="14" y2="32" stroke="#a14d2c" strokeWidth="0.7" />
      <line x1="46" y1="30" x2="46" y2="32" stroke="#a14d2c" strokeWidth="0.7" />
      <text x="22" y="11" fontSize="3.5" fill="#7a4d20" fontFamily="serif" fontStyle="italic">
        B = 2(Δf + fm)
      </text>
    </svg>
  )
}
