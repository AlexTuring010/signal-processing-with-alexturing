'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Coherent (synchronous) demodulation of DSB-SC.
 *
 * Chain: DSB-SC signal × 2 cos(2π f_c t + φ)  →  LPF  →  recovered message.
 *
 * Math:
 *   x(t)        = m(t) cos(2π f_c t)
 *   y(t)        = x(t) · 2 cos(2π f_c t + φ)
 *               = m(t) [2 cos(2π f_c t) cos(2π f_c t + φ)]
 *               = m(t) [cos(φ) + cos(4π f_c t + φ)]   (product-to-sum)
 *   LPF{y(t)}   = m(t) cos(φ)        — recovered message scaled by cos(φ)
 *
 * For φ = 0:    perfect recovery, m(t) intact
 * For φ = π/2:  total cancellation, output is zero — the "quadrature null"
 * For 0<φ<π/2:  attenuated by cos(φ); message shape preserved but quieter
 *
 * Three stacked panels:
 *   - DSB-SC input x(t) and the local oscillator 2 cos(2π f_c t + φ)
 *   - product y(t) showing the carrier-frequency interference riding on
 *     m(t) cos(φ)
 *   - LPF output: m(t) cos(φ) (recovered message, attenuated)
 *
 * Slider: phase error φ in degrees.
 */

const FC = 8
const FM = 0.5

export function CoherentDemodulationViz() {
  const [phaseDeg, setPhaseDeg] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Static (non-animated) for clarity — frozen frame, not playing
  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, phaseDeg)
  }, [phaseDeg])

  const phi = (phaseDeg * Math.PI) / 180
  const attenuationFactor = Math.cos(phi)

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Coherent demodulation — και η ευαισθησία στη φάση
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Πολλαπλασιάζουμε το DSB-SC σήμα <span className="font-mono">x(t) = m(t) cos(2π f_c t)</span>{' '}
        με ένα τοπικό cosine <span className="font-mono">2 cos(2π f_c t + φ)</span>, μετά
        χαμηλοπερατό φίλτρο. Όταν <span className="font-mono">φ = 0</span> πετυχαίνουμε
        perfect recovery. Σύρε το <span className="font-mono">φ</span> για να δεις τι
        γίνεται με μη-ιδανική σύγχρονη φάση.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Coherent demodulation chain with phase error"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Phase error φ ={' '}
          <span className="font-mono text-fg tabular-nums">{phaseDeg.toFixed(0)}°</span>
          {' · '}
          attenuation factor = cos(φ) ={' '}
          <span className="font-mono text-fg tabular-nums">{attenuationFactor.toFixed(3)}</span>
          {' · '}
          {Math.abs(phaseDeg) >= 89 && Math.abs(phaseDeg) <= 91 ? (
            <span className="font-semibold text-red-600 dark:text-red-400">
              ⚠ Σχεδόν quadrature null
            </span>
          ) : Math.abs(attenuationFactor) >= 0.7 ? (
            <span className="text-green-700 dark:text-green-400">Καλή ανάκτηση</span>
          ) : Math.abs(attenuationFactor) >= 0.3 ? (
            <span className="text-amber-600 dark:text-amber-400">Μερική ανάκτηση</span>
          ) : (
            <span className="text-red-600 dark:text-red-400">Πολύ φτωχή ανάκτηση</span>
          )}
        </label>
        <input
          type="range"
          min={-90}
          max={90}
          step={1}
          value={phaseDeg}
          onChange={(e) => setPhaseDeg(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Phase error in degrees"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Γιατί λέγεται «coherent»:</strong> ο τοπικός ταλαντωτής πρέπει να
        είναι <strong>συγχρονισμένος</strong> με τον αρχικό carrier στη φάση —
        όχι μόνο στη συχνότητα. Ένα φ = 90° σημαίνει{' '}
        <strong>quadrature null</strong> — ο πολλαπλασιασμός με sin αντί cos
        ακυρώνει τελείως το message. Αυτή η ευαισθησία είναι η βασική δυσκολία
        του DSB-SC και ο λόγος που χρειάζεται PLL ή carrier recovery στον δέκτη.
      </div>
    </figure>
  )
}

const MSG_C = 'rgb(217, 119, 6)' // amber
const SIG_C = 'rgb(29, 78, 216)' // accent blue
const LO_C = 'rgb(22, 163, 74)' // green for local oscillator
const REC_C = 'rgb(168, 85, 247)' // violet for recovered message

const PAD_X = 18
const PAD_Y = 12

const tMin = -3
const tMax = 3

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  phaseDeg: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const phi = (phaseDeg * Math.PI) / 180
  const m = (t: number) => Math.cos(2 * Math.PI * FM * t)
  const carrier = (t: number) => Math.cos(2 * Math.PI * FC * t)
  const lo = (t: number) => 2 * Math.cos(2 * Math.PI * FC * t + phi)
  const x = (t: number) => m(t) * carrier(t)
  const y = (t: number) => x(t) * lo(t) // pre-LPF
  const recovered = (t: number) => m(t) * Math.cos(phi)

  const rowH = h / 3
  drawPanel1(ctx, colors, 0, 0, w, rowH, x, lo)
  drawPanel2(ctx, colors, 0, rowH, w, rowH, y, recovered, phaseDeg)
  drawPanel3(ctx, colors, 0, 2 * rowH, w, rowH, m, recovered, phaseDeg)
}

function drawPanel1(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  x: (t: number) => number,
  lo: (t: number) => number,
) {
  if (!colors) return
  const yLim = 2.4
  const xt = (t: number) => lerp(t, tMin, tMax, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Είσοδος x(t) (μπλε) και τοπικός ταλαντωτής 2 cos(2π f_c t + φ) (πράσινο)', x0 + PAD_X, y0 + 10)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  // local oscillator (faint, behind)
  drawTrace(ctx, xt, yv, lo, LO_C, 1.2, true)
  // x(t)
  drawTrace(ctx, xt, yv, x, SIG_C, 1.4)
}

function drawPanel2(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  y: (t: number) => number,
  recovered: (t: number) => number,
  phaseDeg: number,
) {
  if (!colors) return
  const yLim = 2.5
  const xt = (t: number) => lerp(t, tMin, tMax, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Γινόμενο y(t) = x(t) · 2 cos(2π f_c t + φ)  =  m(t) cos(φ)  +  m(t) cos(4π f_c t + φ)', x0 + PAD_X, y0 + 10)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  // recovered message (the LPF output, ridden on by the carrier-frequency component)
  drawTrace(ctx, xt, yv, recovered, REC_C, 1.6, true)

  // y(t) — fast oscillation
  drawTrace(ctx, xt, yv, y, SIG_C, 1.1)
}

function drawPanel3(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  m: (t: number) => number,
  recovered: (t: number) => number,
  phaseDeg: number,
) {
  if (!colors) return
  const yLim = 1.4
  const xt = (t: number) => lerp(t, tMin, tMax, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Έξοδος LPF: m(t) · cos(φ) — αρχικό m(t) (amber dashed) vs ανακτημένο (violet)', x0 + PAD_X, y0 + 10)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  // m(t) (true) — dashed amber
  ctx.strokeStyle = MSG_C
  ctx.lineWidth = 1.4
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  const STEPS = 240
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tMin, tMax)
    const px = xt(t)
    const py = yv(m(t))
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // recovered (violet, solid)
  drawTrace(ctx, xt, yv, recovered, REC_C, 2)
}

function drawTrace(
  ctx: CanvasRenderingContext2D,
  xt: (t: number) => number,
  yv: (v: number) => number,
  fn: (t: number) => number,
  color: string,
  width: number,
  dashed = false,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  if (dashed) ctx.setLineDash([4, 4])
  ctx.beginPath()
  const STEPS = 600
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tMin, tMax)
    const v = fn(t)
    const px = xt(t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  if (dashed) ctx.setLineDash([])
}
