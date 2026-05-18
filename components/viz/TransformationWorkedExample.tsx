/**
 * Static three-panel SVG for the worked example x(−t + 3) in
 * /foundations/signals §4.5e: original triangle (peak t=1, base [0,2])
 * → flipped (peak t=−1, base [−2,0]) → flipped + shifted right by 3
 * (peak t=2, base [1,3]).
 *
 * Drives home the order: factor a out → flip first → shift second.
 */

const VW = 220
const VH = 130
const X_MIN = -3.5
const X_MAX = 3.5
const PAD_X = 16
const PAD_TOP = 18
const PAD_BOTTOM = 22

const xPx = (t: number) =>
  PAD_X + ((t - X_MIN) / (X_MAX - X_MIN)) * (VW - 2 * PAD_X)
const yPx = (v: number) =>
  PAD_TOP + (1 - v / 1.2) * (VH - PAD_TOP - PAD_BOTTOM)
const yBaseline = yPx(0)

type TriangleProps = {
  /** peak position on the x-axis */
  peak: number
  /** half-width of the triangle's base */
  halfBase: number
  /** peak value (height) */
  height?: number
  color: string
}

function Triangle({ peak, halfBase, height = 1, color }: TriangleProps) {
  const left = peak - halfBase
  const right = peak + halfBase
  const points = [
    `${xPx(left)},${yBaseline}`,
    `${xPx(peak)},${yPx(height)}`,
    `${xPx(right)},${yBaseline}`,
  ].join(' ')
  return (
    <>
      <polygon
        points={points}
        fill={color}
        fillOpacity="0.18"
        stroke={color}
        strokeWidth="2"
      />
      {/* peak marker */}
      <circle cx={xPx(peak)} cy={yPx(height)} r="3" fill={color} />
      <text
        x={xPx(peak)}
        y={yPx(height) - 6}
        fontSize="10"
        textAnchor="middle"
        fill={color}
      >
        t = {peak}
      </text>
    </>
  )
}

type PanelProps = {
  label: string
  expr: string
  peak: number
  halfBase: number
  color?: string
  baseLabel: string
}

function Panel({ label, expr, peak, halfBase, color = 'rgb(37 99 235)', baseLabel }: PanelProps) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="border-b border-border bg-bg-soft px-2.5 py-1.5">
        <div className="text-[10px] uppercase tracking-wider text-fg-muted">{label}</div>
        <div className="font-mono text-[12px] font-semibold tracking-tight">{expr}</div>
      </div>
      <svg viewBox={`0 0 ${VW} ${VH}`} className="block w-full" role="img" aria-label={`${label} ${expr}`}>
        {/* x axis */}
        <line
          x1={PAD_X}
          y1={yBaseline}
          x2={VW - PAD_X}
          y2={yBaseline}
          stroke="rgb(var(--border))"
          strokeWidth="1"
        />
        {/* y axis at t = 0 */}
        <line
          x1={xPx(0)}
          y1={PAD_TOP}
          x2={xPx(0)}
          y2={yBaseline}
          stroke="rgb(var(--border))"
          strokeWidth="1"
        />
        {/* y tick at value = 1 */}
        <line
          x1={xPx(0) - 2}
          y1={yPx(1)}
          x2={xPx(0) + 2}
          y2={yPx(1)}
          stroke="rgb(var(--fg-subtle))"
          strokeWidth="1"
        />
        <text
          x={xPx(0) - 4}
          y={yPx(1) + 3}
          fontSize="9"
          textAnchor="end"
          fill="rgb(var(--fg-subtle))"
        >
          1
        </text>
        {/* tick marks at integers */}
        {[-3, -2, -1, 0, 1, 2, 3].map((t) => (
          <g key={t}>
            <line
              x1={xPx(t)}
              y1={yBaseline - 2}
              x2={xPx(t)}
              y2={yBaseline + 2}
              stroke="rgb(var(--fg-subtle))"
              strokeWidth="1"
            />
            <text
              x={xPx(t)}
              y={yBaseline + 13}
              fontSize="9"
              textAnchor="middle"
              fill="rgb(var(--fg-subtle))"
            >
              {t}
            </text>
          </g>
        ))}
        <Triangle peak={peak} halfBase={halfBase} color={color} />
      </svg>
      <div className="px-2.5 py-1 text-center text-[10px] text-fg-muted">{baseLabel}</div>
    </div>
  )
}

export function TransformationWorkedExample() {
  return (
    <figure className="my-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Panel
          label="Αρχικό"
          expr="x(t)"
          peak={1}
          halfBase={1}
          baseLabel="βάση [0, 2], κορυφή στο 1"
        />
        <Panel
          label="Βήμα 1: Flip"
          expr="x(−t)"
          peak={-1}
          halfBase={1}
          color="rgb(217 119 6)"
          baseLabel="βάση [−2, 0], κορυφή στο −1"
        />
        <Panel
          label="Βήμα 2: Shift δεξιά κατά 3"
          expr="x(−(t − 3))"
          peak={2}
          halfBase={1}
          color="rgb(5 150 105)"
          baseLabel="βάση [1, 3], κορυφή στο 2"
        />
      </div>
      <figcaption className="mt-2 text-center text-xs text-fg-muted">
        x(−t + 3) = x(−(t − 3)). Πρώτα flip (πρόσημο μέσα στην παρένθεση), μετά shift κατά 3 δεξιά.
      </figcaption>
    </figure>
  )
}
