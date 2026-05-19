/**
 * Static side-by-side: same cosine, two display conventions.
 *
 *   Left  — two-sided spectrum: impulses of height A/2 at +f₀ and −f₀.
 *   Right — one-sided spectrum: single impulse of height A at +f₀, only the
 *           non-negative axis shown.
 *
 * Same total energy, different packaging. Used in the spectrum-conventions
 * reference page to make the conversion concrete.
 *
 * Pure SVG — no canvas, no DPR juggling, crisp at any zoom level.
 */

export function TwoSidedVsOneSidedCosine() {
  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        cos(2π f₀ t) — δύο συμβάσεις, ένα σήμα
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Ίδιο σήμα, δύο διαφορετικές παρουσιάσεις στο φάσμα. Παρατήρησε ότι το
        ύψος της κρούσης διπλασιάζεται όταν περνάμε από two-sided σε one-sided —
        η αρνητική πλευρά «τυλίγεται» στη θετική.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Panel title="Two-sided spectrum" subtitle="δύο peaks, A/2 το καθένα">
          <SpectrumSVG variant="two-sided" />
        </Panel>
        <Panel title="One-sided spectrum" subtitle="ένα peak, ύψους A">
          <SpectrumSVG variant="one-sided" />
        </Panel>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Η <strong>two-sided</strong> είναι μαθηματικά πιο φυσική (ο τύπος{' '}
        <span className="font-mono">X(f) = ∫ x(t) e^(−j2πft) dt</span> τη δίνει
        αυτόματα). Η <strong>one-sided</strong> είναι πιο διαβαστή για να
        διαβάζεις άμεσα το πλάτος του σήματος, αλλά πρέπει να θυμάσαι ότι τα
        μη-DC πλάτη είναι <strong>διπλάσια</strong>.
      </div>
    </figure>
  )
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-3 py-1">
        <span className="text-[11px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

function SpectrumSVG({ variant }: { variant: 'two-sided' | 'one-sided' }) {
  const width = 360
  const height = 160
  const padX = 36
  const padY = 22
  const baseY = height - padY
  const peakY = padY + 18 // top of "tall" impulse (height A in one-sided)
  const halfPeakY = baseY - (baseY - peakY) / 2 // half height (A/2 in two-sided)

  // Coordinate map: x range goes from fMin to fMax horizontally.
  const fMin = variant === 'two-sided' ? -2 : 0
  const fMax = 2
  const xOf = (f: number) =>
    padX + ((f - fMin) / (fMax - fMin)) * (width - 2 * padX)

  // f₀ position (always at +1 on our normalised axis)
  const xPlus = xOf(1)
  const xMinus = xOf(-1)
  const xZero = xOf(0)

  // Tick positions
  const ticks =
    variant === 'two-sided'
      ? [
          { f: -1, label: '−f₀' },
          { f: 0, label: '0' },
          { f: 1, label: '+f₀' },
        ]
      : [
          { f: 0, label: '0' },
          { f: 1, label: 'f₀' },
        ]

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="block w-full text-fg"
      role="img"
      aria-label={
        variant === 'two-sided'
          ? 'Two-sided spectrum of cos(2π f₀ t): impulses of height A/2 at ±f₀'
          : 'One-sided spectrum of cos(2π f₀ t): single impulse of height A at f₀'
      }
    >
      {/* x axis */}
      <line
        x1={padX}
        y1={baseY}
        x2={width - padX}
        y2={baseY}
        stroke="currentColor"
        strokeOpacity="0.35"
      />
      {/* y axis at f = 0 */}
      <line
        x1={xZero}
        y1={padY - 6}
        x2={xZero}
        y2={baseY + 4}
        stroke="currentColor"
        strokeOpacity="0.35"
      />

      {/* ticks */}
      {ticks.map((t) => (
        <g key={t.label}>
          <line
            x1={xOf(t.f)}
            y1={baseY}
            x2={xOf(t.f)}
            y2={baseY + 4}
            stroke="currentColor"
            strokeOpacity="0.4"
          />
          <text
            x={xOf(t.f)}
            y={baseY + 14}
            textAnchor="middle"
            fontSize="10"
            fill="currentColor"
            fillOpacity="0.7"
          >
            {t.label}
          </text>
        </g>
      ))}

      {/* arrow tip on +x axis */}
      <polygon
        points={`${width - padX + 6},${baseY} ${width - padX - 4},${baseY - 4} ${width - padX - 4},${baseY + 4}`}
        fill="currentColor"
        fillOpacity="0.5"
      />
      <text
        x={width - padX + 12}
        y={baseY + 4}
        fontSize="10"
        fill="currentColor"
        fillOpacity="0.7"
        fontStyle="italic"
      >
        f
      </text>

      {/* axis label |X(f)| */}
      <text
        x={xZero + 6}
        y={padY}
        fontSize="10"
        fill="currentColor"
        fillOpacity="0.7"
        fontStyle="italic"
      >
        |X(f)|
      </text>

      {variant === 'two-sided' ? (
        <>
          <Impulse x={xPlus} yBase={baseY} yTop={halfPeakY} label="A/2" />
          <Impulse x={xMinus} yBase={baseY} yTop={halfPeakY} label="A/2" />
        </>
      ) : (
        <>
          <Impulse x={xPlus} yBase={baseY} yTop={peakY} label="A" />
          {/* show the level "A" on the y axis */}
          <line
            x1={padX}
            y1={peakY}
            x2={padX + 4}
            y2={peakY}
            stroke="currentColor"
            strokeOpacity="0.4"
          />
          <text
            x={padX - 3}
            y={peakY + 3}
            textAnchor="end"
            fontSize="10"
            fill="currentColor"
            fillOpacity="0.7"
          >
            A
          </text>
        </>
      )}

      {/* on two-sided show the level "A/2" on y axis */}
      {variant === 'two-sided' && (
        <>
          <line
            x1={padX}
            y1={halfPeakY}
            x2={padX + 4}
            y2={halfPeakY}
            stroke="currentColor"
            strokeOpacity="0.4"
          />
          <text
            x={padX - 3}
            y={halfPeakY + 3}
            textAnchor="end"
            fontSize="10"
            fill="currentColor"
            fillOpacity="0.7"
          >
            A/2
          </text>
        </>
      )}
    </svg>
  )
}

function Impulse({
  x,
  yBase,
  yTop,
  label,
}: {
  x: number
  yBase: number
  yTop: number
  label: string
}) {
  return (
    <g>
      {/* shaft */}
      <line
        x1={x}
        y1={yBase}
        x2={x}
        y2={yTop}
        stroke="rgb(29, 78, 216)"
        strokeWidth="2.5"
      />
      {/* arrow head */}
      <polygon
        points={`${x},${yTop - 6} ${x - 5},${yTop + 2} ${x + 5},${yTop + 2}`}
        fill="rgb(29, 78, 216)"
      />
      {/* amplitude label next to the arrow */}
      <text
        x={x + 8}
        y={yTop + 4}
        fontSize="11"
        fontWeight="600"
        fill="rgb(29, 78, 216)"
      >
        {label}
      </text>
    </g>
  )
}
