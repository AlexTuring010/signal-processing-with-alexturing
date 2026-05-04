/**
 * Static SVG illustrating the sifting-integral intuition: a "comb" of weighted
 * impulses at evenly-spaced τ values, each scaled to x(τ), whose tops trace
 * out the smooth signal x(t). Used in /foundations/systems Step 1.
 */

const T_MIN = 0
const T_MAX = 6
const N_IMPULSES = 13

// Smooth, asymmetric-ish x(t) so impulse heights vary visibly.
function x(t: number) {
  return 0.55 + 0.32 * Math.cos((Math.PI * t) / 3) + 0.12 * Math.cos(Math.PI * t)
}

const VIEW_W = 480
const VIEW_H = 180
const PAD_X = 28
const PAD_TOP = 18
const PAD_BOTTOM = 28

const xToPx = (t: number) =>
  PAD_X + ((t - T_MIN) / (T_MAX - T_MIN)) * (VIEW_W - 2 * PAD_X)
// y is in [0, 1.1]; map so 0 → bottom, 1.1 → top.
const yToPx = (v: number) =>
  PAD_TOP + (1 - v / 1.1) * (VIEW_H - PAD_TOP - PAD_BOTTOM)

export function SiftingIntegralIntuition() {
  // Sampling positions for the impulses.
  const taus: number[] = []
  for (let i = 0; i < N_IMPULSES; i++) {
    taus.push(T_MIN + ((T_MAX - T_MIN) * (i + 0.5)) / N_IMPULSES)
  }

  // Smooth curve points.
  const curvePoints: string[] = []
  const N_CURVE = 200
  for (let i = 0; i <= N_CURVE; i++) {
    const t = T_MIN + ((T_MAX - T_MIN) * i) / N_CURVE
    curvePoints.push(`${xToPx(t).toFixed(1)},${yToPx(x(t)).toFixed(1)}`)
  }

  const baselineY = yToPx(0)

  return (
    <figure className="my-4 rounded-md border border-border bg-bg-elevated p-3">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full"
        role="img"
        aria-label="Comb of impulses scaled to x(τ) reconstructing the signal"
      >
        {/* Baseline */}
        <line
          x1={PAD_X}
          y1={baselineY}
          x2={VIEW_W - PAD_X}
          y2={baselineY}
          stroke="rgb(var(--border))"
          strokeWidth="1"
        />

        {/* Impulses (amber) — drawn first so the curve overlays them */}
        {taus.map((t, i) => {
          const xPx = xToPx(t)
          const top = yToPx(x(t))
          return (
            <g key={i}>
              <line
                x1={xPx}
                y1={baselineY}
                x2={xPx}
                y2={top + 5}
                stroke="rgb(217 119 6)"
                strokeWidth="1.7"
              />
              {/* arrowhead */}
              <polygon
                points={`${xPx},${top} ${xPx - 4},${top + 6} ${xPx + 4},${top + 6}`}
                fill="rgb(217 119 6)"
              />
              {/* small dot at the tip to emphasize "this height = x(τ)" */}
              <circle cx={xPx} cy={top} r="2.5" fill="rgb(37 99 235)" />
            </g>
          )
        })}

        {/* x(t) smooth curve (blue, dashed so the impulse tips remain visible) */}
        <polyline
          points={curvePoints.join(' ')}
          fill="none"
          stroke="rgb(37 99 235)"
          strokeWidth="2"
          strokeDasharray="4 3"
          opacity="0.85"
        />

        {/* x-axis label & ticks */}
        <text
          x={PAD_X}
          y={VIEW_H - 8}
          fill="rgb(var(--fg-subtle))"
          fontSize="10"
          textAnchor="start"
        >
          τ
        </text>
        {[0, 1, 2, 3, 4, 5, 6].map((t) => (
          <g key={t}>
            <line
              x1={xToPx(t)}
              y1={baselineY - 2}
              x2={xToPx(t)}
              y2={baselineY + 2}
              stroke="rgb(var(--fg-subtle))"
              strokeWidth="1"
            />
            <text
              x={xToPx(t)}
              y={baselineY + 14}
              fill="rgb(var(--fg-subtle))"
              fontSize="9"
              textAnchor="middle"
            >
              {t}
            </text>
          </g>
        ))}

        {/* legends */}
        <g transform={`translate(${VIEW_W - 170}, ${PAD_TOP - 6})`}>
          <line x1="0" y1="6" x2="14" y2="6" stroke="rgb(217 119 6)" strokeWidth="1.7" />
          <polygon points="14,6 10,2 10,10" fill="rgb(217 119 6)" />
          <text x="20" y="9" fontSize="10" fill="rgb(var(--fg-muted))">
            ζυγισμένη κρούση στο τ
          </text>
        </g>
        <g transform={`translate(${VIEW_W - 170}, ${PAD_TOP + 8})`}>
          <line
            x1="0"
            y1="6"
            x2="16"
            y2="6"
            stroke="rgb(37 99 235)"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          <text x="20" y="9" fontSize="10" fill="rgb(var(--fg-muted))">
            x(t) — οι κορυφές το ξαναχτίζουν
          </text>
        </g>
      </svg>
      <figcaption className="mt-1 text-center text-xs text-fg-muted">
        Κάθε κρούση «ζυγίζεται» με ύψος ίσο με x(τ). Άθροισμα όλων αυτών των ζυγισμένων κρούσεων = το αρχικό σήμα.
      </figcaption>
    </figure>
  )
}
