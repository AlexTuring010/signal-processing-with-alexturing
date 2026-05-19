/**
 * AM family spectrum gallery — schematic comparison of Conventional AM,
 * DSB-SC, SSB (USB), and VSB spectra side by side. Lets the student see
 * the structural differences before diving into the math of any one variant.
 *
 * Pure SVG. Each panel shows |X(f)| with:
 *   - Carrier impulse at +f_c (and −f_c) where present
 *   - Upper sideband (USB) and Lower sideband (LSB) shown as triangular
 *     "lumps" indicating the message spectrum shifted
 *   - Cleanly-labelled differences highlighted per variant
 *
 * The goal is "see the family tree" — not "understand the math". Each
 * variant chapter dives into the math separately.
 */

type VariantId = 'am' | 'dsb-sc' | 'ssb-usb' | 'vsb'

type Variant = {
  id: VariantId
  label: string
  shortLabel: string
  hasCarrier: boolean
  carrierFraction: number // 1.0 for full, 0.3 for VSB vestige
  hasUSB: boolean
  hasLSB: boolean
  lsbFraction: number // 1.0 for full, 0.25 for VSB vestige
  caption: string
}

const VARIANTS: Variant[] = [
  {
    id: 'am',
    label: 'Conventional AM (DSB-AM-TC)',
    shortLabel: 'AM',
    hasCarrier: true,
    carrierFraction: 1,
    hasUSB: true,
    hasLSB: true,
    lsbFraction: 1,
    caption:
      'Carrier + δύο πλήρεις πλευρικές. Εύκολη demodulation με envelope detector. Σπαταλά ισχύ στον carrier (≥ 67%).',
  },
  {
    id: 'dsb-sc',
    label: 'DSB-SC',
    shortLabel: 'DSB-SC',
    hasCarrier: false,
    carrierFraction: 0,
    hasUSB: true,
    hasLSB: true,
    lsbFraction: 1,
    caption:
      'Δύο πλευρικές, χωρίς carrier. 100% της ισχύος στην πληροφορία. Χρειάζεται coherent demodulator.',
  },
  {
    id: 'ssb-usb',
    label: 'SSB (USB)',
    shortLabel: 'SSB',
    hasCarrier: false,
    carrierFraction: 0,
    hasUSB: true,
    hasLSB: false,
    lsbFraction: 0,
    caption:
      'Μία πλευρική (Upper). Μισό bandwidth από AM/DSB-SC. Coherent demodulator + Hilbert για κατασκευή.',
  },
  {
    id: 'vsb',
    label: 'VSB',
    shortLabel: 'VSB',
    hasCarrier: true,
    carrierFraction: 0.3,
    hasUSB: true,
    hasLSB: true,
    lsbFraction: 0.25,
    caption:
      'Μία πλήρης πλευρική + κατάλοιπο της άλλης + μειωμένος carrier. Συμβιβασμός μεταξύ AM (απλή demod) και SSB (BW efficiency). Χρήση: NTSC TV.',
  },
]

export function AMFamilySpectra() {
  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Η οικογένεια AM — τέσσερις παραλλαγές, ένα κοινό σχέδιο
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Ίδιο message <span className="font-mono">m(t)</span>, ίδιο carrier{' '}
        <span className="font-mono">f_c</span>. Διαφέρουν στο τι κρατάει το
        καθένα στο φάσμα — ολόκληρες πλευρικές, μία πλευρά, με ή χωρίς
        carrier component. Τα τετράγωνα στο φάσμα είναι σχηματικά (κάθε
        message έχει το δικό του σχήμα — εδώ απλά ζωγραφίζουμε «πού ζει η
        ενέργεια»).
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {VARIANTS.map((v) => (
          <Panel key={v.id} variant={v} />
        ))}
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Όλες οι παραλλαγές <strong>μεταφέρουν την ίδια πληροφορία</strong>{' '}
        <span className="font-mono">m(t)</span>. Διαφέρουν σε{' '}
        <strong>bandwidth</strong>, σε <strong>power efficiency</strong>, και
        σε <strong>πολυπλοκότητα demodulation</strong>. Κάθε επόμενο κεφάλαιο
        της AM ομάδας πιάνει μία από τις τέσσερις και την αναλύει σε βάθος.
      </div>
    </figure>
  )
}

function Panel({ variant }: { variant: Variant }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="border-b border-border bg-bg-soft px-3 py-1.5">
        <span className="text-[11px] font-semibold tracking-tight">{variant.label}</span>
      </div>
      <div className="p-2">
        <SpectrumSVG variant={variant} />
        <p className="mt-2 text-[11px] text-fg-muted leading-relaxed">{variant.caption}</p>
      </div>
    </div>
  )
}

function SpectrumSVG({ variant }: { variant: Variant }) {
  const width = 360
  const height = 120
  const padX = 36
  const padY = 16
  const baseY = height - padY
  const fullCarrierY = padY + 6
  const fullSidebandTopY = padY + 30

  // x-axis maps f from −f_max to +f_max (use −2 to +2 in normalised f_c units)
  const fcUnit = 1 // x position unit per f_c
  const fMax = 2.2
  const xOf = (f: number) => padX + ((f + fMax) / (2 * fMax)) * (width - 2 * padX)

  // Sideband geometry: triangular "bumps" representing the message spectrum
  // shifted to ±f_c. Bump width = bandwidth W (visual).
  const W = 0.4 // sideband half-width in normalised units
  const renderBump = (
    centerF: number,
    side: 'upper' | 'lower' | 'both' | 'none',
    heightFraction: number,
  ) => {
    if (side === 'none') return null
    const top = lerp(heightFraction, 0, 1, baseY, fullSidebandTopY)
    const lower = centerF - W // LSB peak (closer to 0)
    const upper = centerF + W // USB peak (further from 0)
    const cFx = xOf(centerF)

    // For positive carrier: USB extends to right, LSB to left.
    // Upper sideband triangle (right of center)
    const upperPath = `M ${cFx} ${baseY} L ${cFx} ${top} L ${xOf(upper)} ${baseY} Z`
    const lowerPath = `M ${cFx} ${baseY} L ${cFx} ${top} L ${xOf(lower)} ${baseY} Z`

    return (
      <g>
        {(side === 'lower' || side === 'both') && (
          <path
            d={lowerPath}
            fill="rgba(29, 78, 216, 0.35)"
            stroke="rgb(29, 78, 216)"
            strokeWidth="1"
          />
        )}
        {(side === 'upper' || side === 'both') && (
          <path
            d={upperPath}
            fill="rgba(29, 78, 216, 0.35)"
            stroke="rgb(29, 78, 216)"
            strokeWidth="1"
          />
        )}
      </g>
    )
  }

  // Determine sides per variant. For SSB-USB: positive carrier gets USB (upper),
  // negative carrier gets LSB (lower) — so the spectrum stays conjugate-symmetric.
  // For VSB: same idea but the LSB is partial (vestige).
  const positiveSide = (() => {
    if (variant.id === 'ssb-usb') return 'upper' as const
    return variant.hasUSB && variant.hasLSB ? ('both' as const) : 'none'
  })()
  const negativeSide = (() => {
    if (variant.id === 'ssb-usb') return 'lower' as const
    return variant.hasUSB && variant.hasLSB ? ('both' as const) : 'none'
  })()

  // Carrier impulse height
  const carrierHeight = lerp(variant.carrierFraction, 0, 1, baseY, fullCarrierY)

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="block w-full text-fg"
      role="img"
      aria-label={`Spectrum sketch of ${variant.label}`}
    >
      {/* x axis */}
      <line x1={padX} y1={baseY} x2={width - padX} y2={baseY} stroke="currentColor" strokeOpacity="0.4" />
      <polygon
        points={`${width - padX + 6},${baseY} ${width - padX - 4},${baseY - 4} ${width - padX - 4},${baseY + 4}`}
        fill="currentColor"
        fillOpacity="0.5"
      />
      <text
        x={width - padX + 10}
        y={baseY + 4}
        fontSize="10"
        fill="currentColor"
        fillOpacity="0.7"
        fontStyle="italic"
      >
        f
      </text>

      {/* y axis at f = 0 */}
      <line
        x1={xOf(0)}
        y1={padY}
        x2={xOf(0)}
        y2={baseY + 4}
        stroke="currentColor"
        strokeOpacity="0.3"
      />

      {/* carrier impulse markers */}
      {variant.hasCarrier && (
        <>
          <line
            x1={xOf(fcUnit)}
            y1={baseY}
            x2={xOf(fcUnit)}
            y2={carrierHeight}
            stroke="rgb(217, 119, 6)"
            strokeWidth="2.5"
          />
          <polygon
            points={`${xOf(fcUnit)},${carrierHeight - 6} ${xOf(fcUnit) - 4},${carrierHeight + 2} ${xOf(fcUnit) + 4},${carrierHeight + 2}`}
            fill="rgb(217, 119, 6)"
          />
          <line
            x1={xOf(-fcUnit)}
            y1={baseY}
            x2={xOf(-fcUnit)}
            y2={carrierHeight}
            stroke="rgb(217, 119, 6)"
            strokeWidth="2.5"
          />
          <polygon
            points={`${xOf(-fcUnit)},${carrierHeight - 6} ${xOf(-fcUnit) - 4},${carrierHeight + 2} ${xOf(-fcUnit) + 4},${carrierHeight + 2}`}
            fill="rgb(217, 119, 6)"
          />
        </>
      )}

      {/* sidebands at +f_c */}
      {renderBump(fcUnit, positiveSide, 1)}
      {/* sidebands at −f_c */}
      {renderBump(-fcUnit, negativeSide, 1)}

      {/* For VSB: show the partial vestigial LSB at +f_c (and partial USB at -f_c) */}
      {variant.id === 'vsb' && (
        <>
          {/* vestige at +f_c on the LSB side */}
          <path
            d={`M ${xOf(fcUnit)} ${baseY} L ${xOf(fcUnit)} ${lerp(variant.lsbFraction, 0, 1, baseY, fullSidebandTopY)} L ${xOf(fcUnit - W * 0.5)} ${baseY} Z`}
            fill="rgba(29, 78, 216, 0.18)"
            stroke="rgb(29, 78, 216)"
            strokeOpacity="0.5"
            strokeDasharray="2 2"
            strokeWidth="1"
          />
          {/* vestige at -f_c on the USB side (mirror) */}
          <path
            d={`M ${xOf(-fcUnit)} ${baseY} L ${xOf(-fcUnit)} ${lerp(variant.lsbFraction, 0, 1, baseY, fullSidebandTopY)} L ${xOf(-fcUnit + W * 0.5)} ${baseY} Z`}
            fill="rgba(29, 78, 216, 0.18)"
            stroke="rgb(29, 78, 216)"
            strokeOpacity="0.5"
            strokeDasharray="2 2"
            strokeWidth="1"
          />
        </>
      )}

      {/* tick labels for ±f_c and 0 */}
      <text x={xOf(fcUnit)} y={baseY + 14} textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity="0.7">
        +f_c
      </text>
      <text x={xOf(-fcUnit)} y={baseY + 14} textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity="0.7">
        −f_c
      </text>
      <text x={xOf(0)} y={baseY + 14} textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity="0.7">
        0
      </text>

      {/* axis label |X(f)| in top-left */}
      <text x={xOf(0) + 6} y={padY + 6} fontSize="10" fill="currentColor" fillOpacity="0.7" fontStyle="italic">
        |X(f)|
      </text>
    </svg>
  )
}

function lerp(value: number, a0: number, a1: number, b0: number, b1: number) {
  if (a1 === a0) return b0
  return b0 + ((value - a0) * (b1 - b0)) / (a1 - a0)
}
