'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { besselJ } from '@/lib/bessel'

/**
 * Η εξαφάνιση του carrier στις ρίζες του J_0 — η κλασική εξεταστική παρατήρηση
 * (slide 37 του SE_session15_16_16_FM.pdf δίνει το J_0(β_f) plot).
 *
 * Το carrier impulse έχει ύψος A_c |J_0(β)| / 2 στο φάσμα FM. Όταν το β πέφτει
 * πάνω σε μια ρίζα του J_0, ο carrier ΕΞΑΦΑΝΙΖΕΤΑΙ — όλη η ισχύς του πάει
 * στις sidebands. Πειραματικός τρόπος μέτρησης του β: σαρώνεις το β και
 * παρατηρείς πότε «πέφτει» ο carrier.
 *
 *   Ρίζες J_0: β ≈ 2.4048, 5.5201, 8.6537, 11.7915, …
 *
 * Δύο synchronized panels:
 *   Πάνω: η συνάρτηση J_0(β_f) για β = 0..12 — με marker στο τρέχον β και
 *         οπτικά οι 3 πρώτες ρίζες
 *   Κάτω: το FM φάσμα στο τρέχον β — βλέπεις τον carrier (μπλε) και τις
 *         sidebands. Σύρε β και ο carrier «πέφτει» σε εικονικό μηδέν στις ρίζες.
 *
 * Snap-to-root buttons: jump στο β ≈ 2.405, 5.520, 8.654.
 *
 * Επίσης: μετράμε την «carrier power fraction» |J_0|² και το ποσοστό «sideband
 * power fraction» 1 − |J_0|², ως ποσοτική εκδοχή της «πού πάει η ενέργεια».
 */

const J0_ROOTS = [2.4048, 5.5201, 8.6537]
const PRESETS = [
  { label: 'β = 0', beta: 0 },
  { label: 'β = 1', beta: 1.0 },
  { label: '⚠ β ≈ 2.405', beta: 2.4048 },
  { label: 'β = 4', beta: 4.0 },
  { label: '⚠ β ≈ 5.520', beta: 5.5201 },
  { label: '⚠ β ≈ 8.654', beta: 8.6537 },
]

export function CarrierVanishViz() {
  const [beta, setBeta] = useState(2.4048)
  const curveCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const specCanvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (curveCanvasRef.current && colors) drawCurve(curveCanvasRef.current, colors, beta)
    if (specCanvasRef.current && colors) drawSpec(specCanvasRef.current, colors, beta)

    const onResize = () => {
      const c = getThemeColors()
      if (curveCanvasRef.current && c) drawCurve(curveCanvasRef.current, c, beta)
      if (specCanvasRef.current && c) drawSpec(specCanvasRef.current, c, beta)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [beta])

  const j0 = besselJ(0, beta)
  const carrierPower = j0 * j0
  const sidebandPower = 1 - carrierPower
  const vanished = Math.abs(j0) < 0.03
  const nearestRoot = J0_ROOTS.reduce((acc, r) =>
    Math.abs(r - beta) < Math.abs(acc - beta) ? r : acc,
  )
  const closeToRoot = Math.abs(beta - nearestRoot) < 0.3

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Carrier εξαφάνιση — οι ρίζες του J_0(β)
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setBeta(p.beta)}
              className={`rounded-full border px-2.5 py-0.5 text-xs ${
                Math.abs(beta - p.beta) < 0.005
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-3 text-xs text-fg-muted">
        Πάνω: η συνάρτηση <span className="font-mono">J_0(β)</span> με τις ρίζες
        της σημειωμένες. Κάτω: το FM φάσμα στο ίδιο β — βλέπεις τον carrier (μωβ
        γραμμή στη μέση) να «πέφτει» στο μηδέν όταν περνάς πάνω σε μία ρίζα.
        Αυτή είναι η εξεταστική παρατήρηση: <em>πότε χάνεται ο carrier;</em> —{' '}
        <strong>όταν β = ρίζα του J_0</strong>.
      </p>

      <canvas
        ref={curveCanvasRef}
        style={{ height: 200 }}
        className="block h-[200px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="J0(beta) curve with current beta marker"
      />

      <canvas
        ref={specCanvasRef}
        style={{ height: 230 }}
        className="mt-3 block h-[230px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="FM spectrum at current beta showing carrier height"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          β = <span className="font-mono text-fg tabular-nums">{beta.toFixed(4)}</span>
        </label>
        <input
          type="range"
          min={0}
          max={10}
          step={0.001}
          value={beta}
          onChange={(e) => setBeta(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Modulation index beta"
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <Stat
          label="J₀(β)"
          value={j0.toFixed(4)}
          highlight={vanished}
        />
        <Stat
          label="Carrier power |J₀|²"
          value={`${(carrierPower * 100).toFixed(1)}%`}
          highlight={vanished}
        />
        <Stat
          label="Sideband power 1−|J₀|²"
          value={`${(sidebandPower * 100).toFixed(1)}%`}
        />
        <Stat
          label="Πλησιέστερη ρίζα"
          value={`${nearestRoot.toFixed(4)} (Δβ=${(beta - nearestRoot).toFixed(3)})`}
        />
      </div>

      {vanished && (
        <div className="mt-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs">
          <strong>⚠️ Ο carrier εξαφανίστηκε.</strong> Στο β ={' '}
          <span className="font-mono">{beta.toFixed(4)}</span> έχουμε{' '}
          <span className="font-mono">J_0(β) ≈ 0</span> — δηλαδή ΟΛΗ η ισχύς (
          <span className="font-mono">A_c²/2</span>) έχει μεταφερθεί στις sidebands.
          Πειραματικός τρόπος μέτρησης του β: σαρώνεις το β και παρατηρείς πότε
          ο carrier «πέφτει» — η τιμή του β στην οποία συμβαίνει είναι η ρίζα του J_0.
        </div>
      )}
      {!vanished && closeToRoot && (
        <div className="mt-3 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs">
          Πλησιάζεις τη ρίζα{' '}
          <span className="font-mono">β ≈ {nearestRoot.toFixed(4)}</span> — πάτα το
          αντίστοιχο preset (⚠) για να δεις την εξαφάνιση ακριβώς πάνω.
        </div>
      )}
    </figure>
  )
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-md border px-2 py-1 ${
        highlight ? 'border-amber-500/40 bg-amber-500/10' : 'border-border bg-bg-soft'
      }`}
    >
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="font-mono text-fg tabular-nums">{value}</div>
    </div>
  )
}

const CARRIER_C = 'rgb(168, 85, 247)'
const POS_C = 'rgb(29, 78, 216)'
const NEG_C = 'rgb(217, 119, 6)'
const J0_CURVE_C = 'rgb(29, 78, 216)'
const MARKER_C = 'rgb(220, 38, 38)'

function drawCurve(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  beta: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const PAD_L = 40
  const PAD_R = 24
  const PAD_TOP = 22
  const PAD_BOTTOM = 30

  const xBeta = (b: number) => lerp(b, 0, 12, PAD_L, w - PAD_R)
  const yPlot = (v: number) => lerp(v, -0.5, 1.1, h - PAD_BOTTOM, PAD_TOP)
  const yZero = yPlot(0)

  // Y gridlines at -0.4, 0, 0.4, 0.8
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.setLineDash([2, 4])
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'right'
  for (const yv of [-0.4, 0, 0.4, 0.8, 1.0]) {
    const y = yPlot(yv)
    ctx.beginPath()
    ctx.moveTo(PAD_L, y)
    ctx.lineTo(w - PAD_R, y)
    ctx.stroke()
    ctx.fillText(yv.toFixed(1), PAD_L - 4, y + 3)
  }
  ctx.setLineDash([])

  // X-axis ticks
  ctx.strokeStyle = colors.border
  ctx.beginPath()
  ctx.moveTo(PAD_L, yZero)
  ctx.lineTo(w - PAD_R, yZero)
  ctx.stroke()
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'center'
  for (let b = 0; b <= 12; b += 2) {
    const x = xBeta(b)
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, yZero + 3)
    ctx.stroke()
    ctx.fillText(b.toString(), x, h - PAD_BOTTOM + 12)
  }
  ctx.textAlign = 'right'
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('β →', w - PAD_R, h - PAD_BOTTOM + 22)

  // Mark J0 roots
  for (const root of J0_ROOTS) {
    const x = xBeta(root)
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)'
    ctx.setLineDash([3, 3])
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x, PAD_TOP)
    ctx.lineTo(x, yZero)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = 'rgb(168, 85, 247)'
    ctx.beginPath()
    ctx.arc(x, yZero, 3, 0, 2 * Math.PI)
    ctx.fill()
    ctx.font = '8px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgb(168, 85, 247)'
    ctx.fillText(`β=${root.toFixed(2)}`, x, PAD_TOP - 4)
  }

  // J_0(β) curve
  ctx.strokeStyle = J0_CURVE_C
  ctx.lineWidth = 2.2
  ctx.beginPath()
  const N = 400
  for (let i = 0; i <= N; i++) {
    const b = (i / N) * 12
    const j = besselJ(0, b)
    const x = xBeta(b)
    const y = yPlot(j)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // Current-β marker
  const xCur = xBeta(beta)
  const j0Cur = besselJ(0, beta)
  const yCur = yPlot(j0Cur)
  ctx.strokeStyle = MARKER_C
  ctx.lineWidth = 1.4
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(xCur, PAD_TOP)
  ctx.lineTo(xCur, h - PAD_BOTTOM)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = MARKER_C
  ctx.beginPath()
  ctx.arc(xCur, yCur, 4, 0, 2 * Math.PI)
  ctx.fill()

  // Title
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('J_0(β) — ύψος carrier ÷ (A_c/2)', PAD_L, PAD_TOP - 6)
  ctx.textAlign = 'right'
  ctx.fillText(
    `J_0(${beta.toFixed(3)}) = ${j0Cur.toFixed(4)}`,
    w - PAD_R,
    PAD_TOP - 6,
  )
}

function drawSpec(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  beta: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const PAD_L = 40
  const PAD_R = 24
  const PAD_TOP = 22
  const PAD_BOTTOM = 36

  const N_MAX = 12
  const xn = (n: number) => lerp(n, -N_MAX, N_MAX, PAD_L, w - PAD_R)
  const yMax = 0.55
  const yPlot = (m: number) => lerp(m, 0, yMax, h - PAD_BOTTOM, PAD_TOP)
  const yAxis = h - PAD_BOTTOM

  // X-axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_L, yAxis)
  ctx.lineTo(w - PAD_R, yAxis)
  ctx.stroke()

  // X-tick labels (n = -10, -5, 0, 5, 10)
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let n = -N_MAX; n <= N_MAX; n++) {
    const x = xn(n)
    ctx.beginPath()
    ctx.moveTo(x, yAxis)
    ctx.lineTo(x, yAxis + 3)
    ctx.stroke()
    if (n === 0) {
      ctx.fillStyle = colors.fg
      ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
      ctx.fillText('f_c', x, yAxis + 14)
      ctx.fillStyle = colors.fgSubtle
      ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    } else if (n % 5 === 0) {
      const sign = n > 0 ? '+' : '−'
      ctx.fillText(`f_c${sign}${Math.abs(n)}f_m`, x, yAxis + 14)
    }
  }
  ctx.textAlign = 'right'
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('f →', w - PAD_R, yAxis + 26)

  // Sidebands
  for (let n = -N_MAX; n <= N_MAX; n++) {
    const J = besselJ(n, beta)
    const mag = Math.abs(J) / 2 // A_c = 1
    if (mag < 0.001 && n !== 0) continue
    const x = xn(n)
    const yEnd = yPlot(mag)
    const isCarrier = n === 0
    ctx.strokeStyle = isCarrier ? CARRIER_C : J < 0 ? NEG_C : POS_C
    ctx.fillStyle = ctx.strokeStyle
    ctx.lineWidth = isCarrier ? 2.5 : 1.6

    ctx.beginPath()
    ctx.moveTo(x, yAxis)
    ctx.lineTo(x, yEnd)
    ctx.stroke()

    if (mag > 0.001) {
      ctx.beginPath()
      ctx.moveTo(x - 3, yEnd + 4)
      ctx.lineTo(x, yEnd)
      ctx.lineTo(x + 3, yEnd + 4)
      ctx.closePath()
      ctx.fill()
    } else if (isCarrier) {
      // Draw a tiny "×" marker to indicate the vanished carrier
      ctx.fillStyle = CARRIER_C
      ctx.font = 'bold 14px ui-sans-serif, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('×', x, yAxis - 4)
    }
  }

  // Title
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(
    `FM φάσμα στο β = ${beta.toFixed(3)} — ύψη A_c|J_n(β)|/2`,
    PAD_L,
    PAD_TOP - 6,
  )
  ctx.textAlign = 'right'
  ctx.fillStyle = CARRIER_C
  ctx.fillText('carrier (n=0)', w - PAD_R, PAD_TOP - 6)
}
