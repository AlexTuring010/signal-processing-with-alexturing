'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Efficiency-vs-μ curve — feel the 33.3% wall.
 *
 * AMPowerCalculator already exists and accepts A_c / A_m sliders to compute
 * P_c, P_sb, P_total, η numerically (with a small inset η-curve). This viz
 * answers a different question: *why does the curve flatten*, *how close to
 * the wall is the operator, and how badly does AM compare to DSB-SC/SSB*.
 *
 * The η(μ) curve dominates the figure (large canvas), with:
 *   - The forbidden region μ > 1 shaded red.
 *   - The η = 1/3 horizontal at μ = 1 drawn as a hard ceiling line.
 *   - Reference horizontals at 100% labelled "DSB-SC / SSB".
 *   - A current operating point that the student drags via slider OR by
 *     tapping anywhere on the curve.
 *   - A stacked horizontal bar below showing how the total power splits into
 *     carrier vs 2× sideband at the current μ — making the "carrier hogs
 *     most of the power" intuition literal.
 *   - A live "δείκτης σπατάλης" gauge (% of power in the carrier).
 */

const MU_MIN = 0
const MU_MAX = 1.5
const ETA_MAX = 1.0
const COLOR_ETA = 'rgb(29, 78, 216)'
const COLOR_FORBIDDEN = 'rgb(220, 38, 38)'

const SNAP_PRESETS = [
  { mu: 0.3, label: '30%' },
  { mu: 0.5, label: '50%' },
  { mu: 0.7, label: '70%' },
  { mu: 1.0, label: '100% (max)' },
]

export function EfficiencyVsMuCurveViz() {
  const [mu, setMu] = useState(0.5)
  const [dragging, setDragging] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const muRef = useRef(mu)
  muRef.current = mu

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, mu)
  }, [mu])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    function getMuFromEvent(clientX: number, clientY: number): number | null {
      if (!canvas) return null
      const rect = canvas.getBoundingClientRect()
      const x = clientX - rect.left
      const y = clientY - rect.top
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) return null
      const newMu = lerp(x, 50, rect.width - 14, MU_MIN, MU_MAX)
      return Math.max(MU_MIN, Math.min(MU_MAX, newMu))
    }
    function onDown(e: PointerEvent) {
      const newMu = getMuFromEvent(e.clientX, e.clientY)
      if (newMu == null) return
      setDragging(true)
      setMu(newMu)
      canvas?.setPointerCapture(e.pointerId)
    }
    function onMove(e: PointerEvent) {
      if (!dragging) return
      const newMu = getMuFromEvent(e.clientX, e.clientY)
      if (newMu != null) setMu(newMu)
    }
    function onUp(e: PointerEvent) {
      setDragging(false)
      canvas?.releasePointerCapture(e.pointerId)
    }
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    return () => {
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
    }
  }, [dragging])

  const eta = etaOf(mu)
  const carrierFrac = 1 / (1 + (mu * mu) / 2) // P_c / P_total
  const sidebandFrac = (mu * mu) / 2 / (1 + (mu * mu) / 2) // 2P_sb / P_total
  const dsbSavings = mu > 0.001 ? `${((1 - eta) * 100).toFixed(1)}%` : '—'
  const overmod = mu > 1

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Efficiency wall — γιατί η Conventional AM δεν ξεπερνά ποτέ το 33.3%
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Σύρε το <span className="font-mono">μ</span> πάνω στην καμπύλη ή με τον
        slider. Η εξίσωση <span className="font-mono">η(μ) = (μ²/2)/(1 + μ²/2)</span>{' '}
        είναι αύξουσα αλλά <strong>φραγμένη από το 1/3</strong> στο{' '}
        <span className="font-mono">μ = 1</span> — πάνω από εκεί έχεις
        overmodulation, οπότε ποτέ δεν φτάνεις στο 50%, πόσο μάλλον στο 100%
        που έχουν τα DSB-SC και SSB.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 280, touchAction: 'none', cursor: dragging ? 'grabbing' : 'grab' }}
        className="block h-[280px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Efficiency vs modulation index curve, draggable"
      />

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-border bg-bg-soft/40 p-3">
          <label className="block text-xs text-fg-muted">
            μ ={' '}
            <span className="font-mono text-fg tabular-nums">{mu.toFixed(2)}</span>
            {' · '}
            η ={' '}
            <span
              className={`font-mono tabular-nums ${
                overmod ? 'text-red-600 dark:text-red-400' : 'text-fg'
              }`}
            >
              {(eta * 100).toFixed(1)}%
            </span>
          </label>
          <input
            type="range"
            min={MU_MIN}
            max={MU_MAX}
            step={0.01}
            value={mu}
            onChange={(e) => setMu(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Modulation index"
          />
          <div className="mt-2 flex flex-wrap gap-1">
            {SNAP_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setMu(p.mu)}
                className="rounded-full border border-border bg-bg px-2 py-0.5 text-[10px] font-medium text-fg-muted hover:border-accent/50 hover:text-fg"
              >
                μ = {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-border bg-bg-soft/40 p-3">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            Πού πάει η ισχύς (P_total = 100%)
          </div>
          <div className="mt-1 h-5 w-full overflow-hidden rounded-md border border-border bg-bg">
            <div className="flex h-full">
              <div
                className="h-full bg-slate-400 dark:bg-slate-500"
                style={{ width: `${carrierFrac * 100}%` }}
                title={`Carrier: ${(carrierFrac * 100).toFixed(1)}%`}
              />
              <div
                className="h-full bg-blue-500"
                style={{ width: `${sidebandFrac * 100}%` }}
                title={`Sidebands: ${(sidebandFrac * 100).toFixed(1)}%`}
              />
            </div>
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-fg-muted">
            <span>
              Carrier <span className="font-mono">{(carrierFrac * 100).toFixed(1)}%</span>
            </span>
            <span>
              Sidebands <span className="font-mono">{(sidebandFrac * 100).toFixed(1)}%</span>
            </span>
          </div>
          <div className="mt-2 text-[11px] text-fg-muted">
            Σπατάλη στον carrier:{' '}
            <span className="font-mono font-semibold text-fg">{dsbSavings}</span>
            {' — '}
            αυτό θα κερδιζες αν πήγαινες σε DSB-SC.
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Γεωμετρικά:</strong> η <span className="font-mono">η</span>{' '}
        ξεκινάει από <span className="font-mono">0</span> στο{' '}
        <span className="font-mono">μ = 0</span> (καθαρός carrier, καθόλου
        sidebands), ανεβαίνει <em>τετραγωνικά</em> με το{' '}
        <span className="font-mono">μ</span> (γιατί η ισχύς των sideband{' '}
        <span className="font-mono">∝ μ²</span>), αλλά ο carrier{' '}
        <strong>δεν μειώνεται</strong> — μένει στο{' '}
        <span className="font-mono">A_c²/2</span>. Στο{' '}
        <span className="font-mono">μ = 1</span> έχεις την μέγιστη χρήσιμη
        μέθοδο — και η <span className="font-mono">η = 1/3</span> είναι ο
        τοίχος.
      </div>
    </figure>
  )
}

function etaOf(mu: number): number {
  const m2 = mu * mu
  return m2 / 2 / (1 + m2 / 2)
}

const PAD_L = 50
const PAD_R = 14
const PAD_T = 18
const PAD_B = 32

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  mu: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const xt = (m: number) => lerp(m, MU_MIN, MU_MAX, PAD_L, w - PAD_R)
  const yv = (e: number) => lerp(e, ETA_MAX, 0, PAD_T, h - PAD_B)
  const yZero = yv(0)

  // Shade forbidden region μ > 1
  ctx.fillStyle = 'rgba(220, 38, 38, 0.08)'
  ctx.fillRect(xt(1), PAD_T, xt(MU_MAX) - xt(1), yZero - PAD_T)

  // Reference horizontals: 100% (DSB/SSB) and 1/3 (AM wall)
  ctx.strokeStyle = colors.border
  ctx.setLineDash([3, 4])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_L, yv(1.0))
  ctx.lineTo(w - PAD_R, yv(1.0))
  ctx.moveTo(PAD_L, yv(1 / 3))
  ctx.lineTo(w - PAD_R, yv(1 / 3))
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('DSB-SC / SSB · η = 100%', PAD_L + 4, yv(1.0) - 4)
  ctx.fillStyle = 'rgb(220, 38, 38)'
  ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('AM ceiling · η_max = 1/3 ≈ 33.3%', PAD_L + 4, yv(1 / 3) - 4)

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_L, yZero)
  ctx.lineTo(w - PAD_R, yZero)
  ctx.moveTo(PAD_L, PAD_T)
  ctx.lineTo(PAD_L, yZero)
  ctx.stroke()

  // X ticks at 0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const m of [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5]) {
    ctx.strokeStyle = colors.border
    ctx.beginPath()
    ctx.moveTo(xt(m), yZero - 2)
    ctx.lineTo(xt(m), yZero + 4)
    ctx.stroke()
    ctx.fillText(`${m}`, xt(m), yZero + 14)
  }
  ctx.fillText('μ', xt(MU_MAX) + 4, yZero + 4)
  ctx.textAlign = 'left'
  ctx.fillText('(μ > 1 απαγορεύεται)', xt(1) + 4, PAD_T + 10)

  // Y ticks at 0%, 10%, 20%, 33.3%, 50%, 100%
  ctx.textAlign = 'right'
  ctx.fillStyle = colors.fgSubtle
  for (const e of [0, 0.1, 0.2, 0.5, 1]) {
    ctx.strokeStyle = colors.border
    ctx.beginPath()
    ctx.moveTo(PAD_L - 4, yv(e))
    ctx.lineTo(PAD_L + 2, yv(e))
    ctx.stroke()
    ctx.fillText(`${(e * 100).toFixed(0)}%`, PAD_L - 6, yv(e) + 3)
  }
  ctx.fillText('η', PAD_L - 6, PAD_T - 4)

  // Curve η(μ): solid for μ ≤ 1, red dashed past 1
  ctx.strokeStyle = COLOR_ETA
  ctx.lineWidth = 2.2
  ctx.beginPath()
  const STEPS = 240
  for (let i = 0; i <= STEPS; i++) {
    const m = lerp(i, 0, STEPS, MU_MIN, 1)
    const e = etaOf(m)
    const px = xt(m)
    const py = yv(e)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  // dashed extension
  ctx.strokeStyle = COLOR_FORBIDDEN
  ctx.setLineDash([5, 4])
  ctx.lineWidth = 1.8
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const m = lerp(i, 0, STEPS, 1, MU_MAX)
    const e = etaOf(m)
    const px = xt(m)
    const py = yv(e)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // Current operating point
  const e = etaOf(mu)
  const px = xt(mu)
  const py = yv(e)
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(px, yZero)
  ctx.lineTo(px, py)
  ctx.lineTo(PAD_L, py)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = mu > 1 ? COLOR_FORBIDDEN : COLOR_ETA
  ctx.beginPath()
  ctx.arc(px, py, 6, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = colors.bg
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(px, py, 6, 0, Math.PI * 2)
  ctx.stroke()

  // Point label
  ctx.fillStyle = colors.fg
  ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = mu < 1.2 ? 'left' : 'right'
  const labelDx = mu < 1.2 ? 10 : -10
  ctx.fillText(
    `μ = ${mu.toFixed(2)}, η = ${(e * 100).toFixed(1)}%`,
    px + labelDx,
    py - 8,
  )
}
