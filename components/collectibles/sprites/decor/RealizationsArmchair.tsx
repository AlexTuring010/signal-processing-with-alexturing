/**
 * Πολυθρόνα Realizations — soft armchair with three sketched
 * "realizations" (sample paths) on the back. Chair slot, 50×60.
 */
export function RealizationsArmchair() {
  return (
    <svg viewBox="0 0 50 60" width="100%" height="100%" aria-hidden="true">
      {/* Backrest */}
      <rect x="9" y="6" width="32" height="32" rx="6" fill="#a87f9c" />
      {/* Seat cushion */}
      <rect x="6" y="32" width="38" height="14" rx="3" fill="#8e6783" />
      {/* Armrests */}
      <rect x="3" y="26" width="6" height="20" rx="2" fill="#8e6783" />
      <rect x="41" y="26" width="6" height="20" rx="2" fill="#8e6783" />
      {/* Legs */}
      <rect x="6" y="46" width="4" height="6" fill="#5a3f51" />
      <rect x="40" y="46" width="4" height="6" fill="#5a3f51" />
      {/* Backrest cushion line */}
      <path
        d="M 12 20 Q 25 22 38 20"
        stroke="#5a3f51"
        strokeWidth="0.7"
        fill="none"
        opacity="0.6"
      />
      {/* Three "realization" sample paths on the backrest */}
      <path
        d="M 12 14 Q 17 11 22 14 Q 27 17 32 14 Q 37 11 38 13"
        stroke="#dac2d0"
        strokeWidth="0.7"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 12 24 Q 18 27 24 24 Q 30 21 38 26"
        stroke="#dac2d0"
        strokeWidth="0.7"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M 12 30 Q 19 28 26 31 Q 33 34 38 30"
        stroke="#dac2d0"
        strokeWidth="0.7"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Subtle highlight on the backrest */}
      <ellipse cx="16" cy="14" rx="6" ry="3" fill="white" opacity="0.18" />
    </svg>
  )
}
