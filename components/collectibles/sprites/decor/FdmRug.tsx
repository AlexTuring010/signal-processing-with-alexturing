/**
 * FDM Ταπέτο — wide rug with parallel frequency-channel bands and
 * tassels at the ends. Floor slot. Renders inside its own viewBox.
 */
export function FdmRug() {
  return (
    <svg
      viewBox="0 0 240 28"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Tassels left */}
      <line x1="6" y1="6" x2="6" y2="22" stroke="#7e6747" strokeWidth="1" />
      <line x1="3" y1="8" x2="3" y2="20" stroke="#7e6747" strokeWidth="1" />
      <line x1="9" y1="8" x2="9" y2="20" stroke="#7e6747" strokeWidth="1" />
      {/* Tassels right */}
      <line x1="234" y1="6" x2="234" y2="22" stroke="#7e6747" strokeWidth="1" />
      <line x1="231" y1="8" x2="231" y2="20" stroke="#7e6747" strokeWidth="1" />
      <line x1="237" y1="8" x2="237" y2="20" stroke="#7e6747" strokeWidth="1" />
      {/* Rug body — rounded rectangle */}
      <rect x="12" y="4" width="216" height="20" rx="2" fill="#a17b5e" />
      {/* Border accent */}
      <rect
        x="14"
        y="6"
        width="212"
        height="16"
        rx="1.5"
        fill="none"
        stroke="#5d4633"
        strokeWidth="0.6"
        opacity="0.7"
      />
      {/* Frequency-channel bands — five horizontal stripes of varying
          shades suggesting separate FDM channels stacked in frequency. */}
      <rect x="16" y="8" width="208" height="2.2" fill="#cda07f" opacity="0.85" />
      <rect x="16" y="11" width="208" height="2.2" fill="#b78b65" opacity="0.85" />
      <rect x="16" y="14" width="208" height="2.2" fill="#cda07f" opacity="0.85" />
      <rect x="16" y="17" width="208" height="2.2" fill="#b78b65" opacity="0.85" />
      <rect x="16" y="20" width="208" height="1.8" fill="#cda07f" opacity="0.7" />
    </svg>
  )
}
