/**
 * Πορτρέτο Modulation — framed picture with an AM waveform.
 * Wall slot, 60×40 viewBox.
 */
export function ModulationPortrait() {
  return (
    <svg viewBox="0 0 60 40" width="100%" height="100%" aria-hidden="true">
      {/* Outer ornate frame */}
      <rect x="2" y="2" width="56" height="36" rx="2" fill="#8a6f3a" />
      {/* Inner frame edge */}
      <rect
        x="4"
        y="4"
        width="52"
        height="32"
        rx="1"
        fill="none"
        stroke="#5a4720"
        strokeWidth="0.6"
      />
      {/* Canvas */}
      <rect x="6" y="6" width="48" height="28" fill="#dde9f0" />
      {/* AM waveform: a high-frequency carrier modulated by a low-freq
          envelope, sketched as paths. */}
      <path
        d="M 8 20
           Q 10 14 12 20 Q 14 26 16 20
           Q 18 13 20 20 Q 22 27 24 20
           Q 26 12 28 20 Q 30 28 32 20
           Q 34 13 36 20 Q 38 27 40 20
           Q 42 14 44 20 Q 46 26 48 20
           Q 50 16 52 20"
        stroke="#3a5e96"
        strokeWidth="0.9"
        fill="none"
        strokeLinecap="round"
      />
      {/* Envelope outline */}
      <path
        d="M 8 12 Q 30 6 52 12"
        stroke="#162a52"
        strokeWidth="0.7"
        fill="none"
        strokeDasharray="1.2 1.4"
        opacity="0.7"
      />
      <path
        d="M 8 28 Q 30 34 52 28"
        stroke="#162a52"
        strokeWidth="0.7"
        fill="none"
        strokeDasharray="1.2 1.4"
        opacity="0.7"
      />
      {/* Frame highlight */}
      <line x1="4" y1="4" x2="4" y2="36" stroke="#c5a36a" strokeWidth="0.6" opacity="0.6" />
    </svg>
  )
}
