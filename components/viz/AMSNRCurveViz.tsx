'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Output-SNR vs input-SNR — quantitative threshold effect for Conventional
 * AM with an envelope detector vs coherent demodulation.
 *
 * Single-tone efficiency:
 *   η(μ) = μ² / (2 + μ²)
 *
 * Envelope detector (piecewise model):
 *   SNR_in > THR:    SNR_out = η · SNR_in           (linear, slope 1 in dB)
 *   SNR_in ≤ THR:    SNR_out continues with slope 2 in dB  (quadratic in linear)
 *
 * Coherent demod on Conventional AM:
 *   SNR_out = η · SNR_in for all SNR_in              (linear ALL THE WAY DOWN)
 *
 * Coherent demod on DSB-SC / SSB:
 *   SNR_out = SNR_in                                 (no carrier waste)
 *
 * Sliders:
 *   - μ ∈ [0.1, 1] adjusts the envelope-AM and coherent-AM curves
 *   - SNR_in operating point — a vertical guide line on the plot
 *
 * The knee at THR = 10 dB on the envelope curve is the visible "threshold
 * effect" — drop below, the envelope output falls 2× as fast as coherent.
 */

const THR_DB = 10 // threshold SNR (dB)
const X_MIN = -10
const X_MAX = 30
const Y_MIN = -30
const Y_MAX = 30

const COLOR_ENV = 'rgb(220, 38, 38)' // red — envelope (has threshold)
const COLOR_COH_AM = 'rgb(217, 119, 6)' // amber — coherent on AM
const COLOR_COH_DSB = 'rgb(22, 163, 74)' // green — coherent on DSB-SC
const COLOR_THRESHOLD = 'rgba(168, 85, 247, 0.5)' // violet
const COLOR_OP = 'rgb(29, 78, 216)' // blue — operating point

const PAD_LEFT = 56
const PAD_RIGHT = 22
const PAD_TOP = 28
const PAD_BOTTOM = 36

export function AMSNRCurveViz() {
  const [mu, setMu] = useState(0.7)
  const [snrInDb, setSnrInDb] = useState(15)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) draw(canvas, colors, mu, snrInDb)
  }, [mu, snrInDb])

  const eta = (mu * mu) / (2 + mu * mu)
  const etaDb = 10 * Math.log10(Math.max(eta, 1e-9))
  const aboveThreshold = snrInDb > THR_DB

  // Output SNR readouts
  const envOutDb = aboveThreshold
    ? snrInDb + etaDb
    : 2 * snrInDb - THR_DB + etaDb
  const cohAmOutDb = snrInDb + etaDb
  const dsbOutDb = snrInDb

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        SNR_out vs SNR_in — όπου σπάει ο envelope detector
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Πάνω από <span className="font-mono">SNR_in ≈ 10 dB</span> και ο envelope
        και ο coherent demod ακολουθούν την ίδια ευθεία{' '}
        <span className="font-mono">η · SNR_in</span>. Κάτω από εκεί, ο
        envelope πέφτει με <strong>διπλάσια κλίση</strong> (κάθε −1 dB στο
        input κοστίζει −2 dB στο output) — το «threshold effect». Ο coherent{' '}
        <strong>δεν έχει knee</strong> — γραμμικός μέχρι κάτω.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 280 }}
        className="block h-[280px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Output SNR vs input SNR for envelope detector and coherent demod"
      />

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            Modulation index{' '}
            <span className="font-mono">μ</span> ={' '}
            <span className="font-mono tabular-nums text-fg">{mu.toFixed(2)}</span>
            {' · '}
            <span className="font-mono">η</span> ={' '}
            <span className="font-mono tabular-nums text-fg">
              {eta.toFixed(3)}
            </span>
            {' ('}
            <span className="font-mono tabular-nums">{etaDb.toFixed(1)} dB</span>
            {')'}
          </label>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.01}
            value={mu}
            onChange={(e) => setMu(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Modulation index"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            <span className="font-mono">SNR_in</span> ={' '}
            <span className="font-mono tabular-nums text-fg">
              {snrInDb.toFixed(0)} dB
            </span>
            {' · '}
            {aboveThreshold ? (
              <span className="text-green-700 dark:text-green-400">
                πάνω από threshold
              </span>
            ) : (
              <span className="text-red-600 dark:text-red-400">
                στην threshold ζώνη
              </span>
            )}
          </label>
          <input
            type="range"
            min={X_MIN}
            max={X_MAX}
            step={0.5}
            value={snrInDb}
            onChange={(e) => setSnrInDb(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Operating-point input SNR"
          />
        </div>
      </div>

      <div
        className={cn(
          'mt-3 rounded-md border px-3 py-2 text-xs',
          aboveThreshold
            ? 'border-green-500/40 bg-green-500/10 text-green-800 dark:text-green-200'
            : 'border-red-500/40 bg-red-500/10 text-red-800 dark:text-red-200',
        )}
      >
        Στο <span className="font-mono">SNR_in = {snrInDb.toFixed(0)} dB</span>{' '}
        έχουμε{' '}
        <strong>
          envelope:{' '}
          <span className="font-mono tabular-nums">
            {envOutDb.toFixed(1)} dB
          </span>
        </strong>{' '}
        · coherent AM:{' '}
        <span className="font-mono tabular-nums">{cohAmOutDb.toFixed(1)} dB</span>{' '}
        · coherent DSB-SC:{' '}
        <span className="font-mono tabular-nums">{dsbOutDb.toFixed(1)} dB</span>
        {!aboveThreshold && (
          <>
            {' '}
            ({(cohAmOutDb - envOutDb).toFixed(1)} dB απώλεια vs coherent —
            όλο threshold-driven)
          </>
        )}
      </div>
    </figure>
  )
}

function draw(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  mu: number,
  snrInDb: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const eta = (mu * mu) / (2 + mu * mu)
  const etaDb = 10 * Math.log10(Math.max(eta, 1e-9))

  const xMap = (x: number) => lerp(x, X_MIN, X_MAX, PAD_LEFT, w - PAD_RIGHT)
  const yMap = (y: number) => lerp(y, Y_MIN, Y_MAX, h - PAD_BOTTOM, PAD_TOP)

  // Grid
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let x = X_MIN; x <= X_MAX; x += 10) {
    ctx.moveTo(xMap(x), PAD_TOP)
    ctx.lineTo(xMap(x), h - PAD_BOTTOM)
  }
  for (let y = Y_MIN; y <= Y_MAX; y += 10) {
    ctx.moveTo(PAD_LEFT, yMap(y))
    ctx.lineTo(w - PAD_RIGHT, yMap(y))
  }
  ctx.stroke()

  // Axes
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(PAD_LEFT, PAD_TOP)
  ctx.lineTo(PAD_LEFT, h - PAD_BOTTOM)
  ctx.lineTo(w - PAD_RIGHT, h - PAD_BOTTOM)
  ctx.stroke()

  // Tick labels
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let x = X_MIN; x <= X_MAX; x += 10) {
    ctx.fillText(`${x}`, xMap(x), h - PAD_BOTTOM + 14)
  }
  ctx.textAlign = 'right'
  for (let y = Y_MIN; y <= Y_MAX; y += 10) {
    ctx.fillText(`${y}`, PAD_LEFT - 5, yMap(y) + 4)
  }

  // Axis labels
  ctx.textAlign = 'center'
  ctx.fillText('SNR_in (dB)', (PAD_LEFT + w - PAD_RIGHT) / 2, h - 8)
  ctx.save()
  ctx.translate(12, (PAD_TOP + h - PAD_BOTTOM) / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('SNR_out (dB)', 0, 0)
  ctx.restore()

  // Threshold marker (vertical violet dashed at 10 dB)
  ctx.strokeStyle = COLOR_THRESHOLD
  ctx.setLineDash([5, 4])
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(xMap(THR_DB), PAD_TOP)
  ctx.lineTo(xMap(THR_DB), h - PAD_BOTTOM)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = COLOR_THRESHOLD
  ctx.textAlign = 'left'
  ctx.fillText('threshold ≈ 10 dB', xMap(THR_DB) + 4, PAD_TOP + 12)

  // Curve 1 — coherent DSB-SC: y = x (green)
  drawCurve(ctx, xMap, yMap, X_MIN, X_MAX, (x) => x, COLOR_COH_DSB, 1.8)
  labelCurve(ctx, xMap, yMap, X_MAX, X_MAX - 1, COLOR_COH_DSB, 'DSB-SC / coherent  (η = 1)')

  // Curve 2 — coherent AM: y = x + 10 log10(η)
  drawCurve(ctx, xMap, yMap, X_MIN, X_MAX, (x) => x + etaDb, COLOR_COH_AM, 1.8)
  labelCurve(ctx, xMap, yMap, X_MAX, X_MAX + etaDb - 1, COLOR_COH_AM, 'AM coherent  (slope 1, με η loss)')

  // Curve 3 — envelope AM: piecewise
  ctx.strokeStyle = COLOR_ENV
  ctx.lineWidth = 2
  ctx.beginPath()
  let first = true
  for (let x = X_MIN; x <= X_MAX; x += 0.5) {
    const y = x > THR_DB ? x + etaDb : 2 * x - THR_DB + etaDb
    const px = xMap(x)
    const py = yMap(y)
    if (first) {
      ctx.moveTo(px, py)
      first = false
    } else {
      ctx.lineTo(px, py)
    }
  }
  ctx.stroke()
  labelCurve(
    ctx,
    xMap,
    yMap,
    X_MIN + 4,
    2 * (X_MIN + 4) - THR_DB + etaDb + 2,
    COLOR_ENV,
    'Envelope detector  (knee στο 10 dB)',
  )

  // Operating point — vertical guide + markers on each curve
  const opX = xMap(snrInDb)
  ctx.strokeStyle = COLOR_OP
  ctx.setLineDash([2, 3])
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(opX, PAD_TOP)
  ctx.lineTo(opX, h - PAD_BOTTOM)
  ctx.stroke()
  ctx.setLineDash([])

  // Operating-point markers
  const opEnvOut = snrInDb > THR_DB ? snrInDb + etaDb : 2 * snrInDb - THR_DB + etaDb
  const opCohAmOut = snrInDb + etaDb
  const opDsbOut = snrInDb
  drawDot(ctx, opX, yMap(opEnvOut), COLOR_ENV)
  drawDot(ctx, opX, yMap(opCohAmOut), COLOR_COH_AM)
  drawDot(ctx, opX, yMap(opDsbOut), COLOR_COH_DSB)
}

function drawCurve(
  ctx: CanvasRenderingContext2D,
  xMap: (x: number) => number,
  yMap: (y: number) => number,
  xMin: number,
  xMax: number,
  fn: (x: number) => number,
  color: string,
  width: number,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  let first = true
  for (let x = xMin; x <= xMax; x += 0.5) {
    const y = fn(x)
    const px = xMap(x)
    const py = yMap(y)
    if (first) {
      ctx.moveTo(px, py)
      first = false
    } else {
      ctx.lineTo(px, py)
    }
  }
  ctx.stroke()
}

function labelCurve(
  ctx: CanvasRenderingContext2D,
  xMap: (x: number) => number,
  yMap: (y: number) => number,
  xAt: number,
  yAt: number,
  color: string,
  text: string,
) {
  ctx.fillStyle = color
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  // Right-align so labels sit close to the curve end on the right side
  ctx.textAlign = 'right'
  ctx.fillText(text, xMap(xAt) - 4, yMap(yAt) - 4)
}

function drawDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, 3.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.9)'
  ctx.lineWidth = 1.2
  ctx.stroke()
}
