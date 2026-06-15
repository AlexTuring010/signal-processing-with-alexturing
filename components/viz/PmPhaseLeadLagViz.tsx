'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * PM shown as a TIMING shift relative to a steady reference carrier.
 *
 * Two panels share a time axis:
 *   1. message m(t)
 *   2. overlay of
 *        - the unmodulated reference carrier  cos(2π f_c t)        (dashed)
 *        - the PM signal  cos(2π f_c t + β_p · m(t))               (solid)
 *
 * The PM peaks slide EARLIER (left of the reference peak) when m is high and
 * LATER (right) when m is low — a phase φ corresponds to a time shift
 * φ/(2π f_c). At β_p = 0 the two waves coincide exactly.
 *
 * Two message shapes:
 *   - cosine: the phase drifts smoothly early↔late (subtle).
 *   - square: the phase HOLDS a constant lead for a whole stretch, then SNAPS
 *     to a constant lag — by far the easiest way to see the shift, and an
 *     honest picture (a jump in m gives a jump in the PM phase).
 *
 * Teaching point: phase is only meaningful relative to the reference, so a PM
 * receiver must HOLD that reference (PLL/pilot) — unlike FM, which reads rate.
 */

const FC = 3 // carrier cycles per unit time (low, so the shift is readable)
const FM = 0.5 // message frequency
const T_WINDOW = 6 // units of signal shown

type Shape = 'cos' | 'square'

function messageAt(t: number, shape: Shape): number {
  if (shape === 'cos') return Math.cos(2 * Math.PI * FM * t)
  const P = 1 / FM
  const u = ((t % P) + P) % P
  return u < P / 2 ? 1 : -1
}

export function PmPhaseLeadLagViz() {
  const [betaP, setBetaP] = useState(2.0)
  const [shape, setShape] = useState<Shape>('square')
  const [running, setRunning] = useState(true)
  const tRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (running) tRef.current += dt
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) drawScene(canvas, colors, betaP, shape, tRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, betaP, shape])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          PM — η φάση κουβαλάει το message: οι κορυφές γλιστρούν νωρίτερα / αργότερα
        </h4>
        <div className="flex items-center gap-2">
          <div className="inline-flex overflow-hidden rounded-full border border-border text-xs">
            <button
              type="button"
              onClick={() => setShape('cos')}
              className={
                shape === 'cos'
                  ? 'bg-accent px-3 py-1 text-white'
                  : 'bg-bg-soft px-3 py-1 text-fg-muted hover:text-fg'
              }
            >
              Ημίτονο
            </button>
            <button
              type="button"
              onClick={() => setShape('square')}
              className={
                shape === 'square'
                  ? 'bg-accent px-3 py-1 text-white'
                  : 'bg-bg-soft px-3 py-1 text-fg-muted hover:text-fg'
              }
            >
              Τετραγωνικό (on/off)
            </button>
          </div>
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
            aria-label={running ? 'Παύση' : 'Παίξε'}
          >
            {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {running ? 'Παύση' : 'Παίξε'}
          </button>
        </div>
      </div>

      <p className="mb-3 text-xs text-fg-muted">
        Πάνω: το message <span className="font-mono">m(t)</span>. Κάτω, στον ίδιο
        άξονα χρόνου: η <strong>διακεκομμένη</strong> γκρι είναι ο σταθερός{' '}
        <strong>carrier αναφοράς</strong>{' '}
        <span className="font-mono">cos(2π f_c t)</span>, η{' '}
        <strong>συμπαγής</strong> μπλε είναι το <strong>PM σήμα</strong>{' '}
        <span className="font-mono">cos(2π f_c t + β_p·m(t))</span>. Με το{' '}
        <strong>Τετραγωνικό</strong> message (προεπιλογή) είναι ευκολότερο: όσο το
        message είναι <strong>ψηλά</strong>, οι μπλε κορυφές κάθονται σταθερά{' '}
        <strong>αριστερά</strong> (νωρίτερα) από τις γκρι· μόλις το message πέσει{' '}
        <strong>χαμηλά</strong>, η φάση <strong>«σπάει»</strong> και οι μπλε
        κορυφές πάνε σταθερά <strong>δεξιά</strong> (αργότερα). Στο{' '}
        <span className="font-mono">β_p = 0</span> οι δύο καμπύλες ταυτίζονται.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 300 }}
        className="block h-[300px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="PM phase lead and lag versus a reference carrier"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          β_p (phase deviation) ={' '}
          <span className="font-mono text-fg tabular-nums">{betaP.toFixed(2)}</span>{' '}
          rad — πόσο μακριά μπροστά/πίσω σπρώχνεται η φάση
        </label>
        <input
          type="range"
          min={0}
          max={2.5}
          step={0.02}
          value={betaP}
          onChange={(e) => setBetaP(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="phase deviation beta_p"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Για να <strong>διαβάσει</strong> αυτή τη μετατόπιση, ο δέκτης χρειάζεται τη{' '}
        <strong>διακεκομμένη αναφορά</strong> — έναν δικό του carrier κλειδωμένο
        στη συχνότητα (PLL ή pilot) για να συγκρίνει «μπροστά ή πίσω;». Γι' αυτό η
        PM (όπως και η σύμφωνη AM) είναι πιο σύνθετη από την FM, που διαβάζει{' '}
        <strong>ρυθμό</strong> χωρίς καμία αναφορά.
      </div>
    </figure>
  )
}

const MSG_C = 'rgb(217, 119, 6)' // amber
const PM_C = 'rgb(29, 78, 216)' // accent blue

function windowBounds(tNow: number) {
  const tStart = tNow - T_WINDOW * 0.7
  const tEnd = tNow + T_WINDOW * 0.3
  return { tStart, tEnd }
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  betaP: number,
  shape: Shape,
  tNow: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const msgH = h * 0.36
  drawMessage(ctx, colors, 0, 0, w, msgH, shape, tNow)
  drawOverlay(ctx, colors, 0, msgH, w, h - msgH, betaP, shape, tNow)
}

function drawMessage(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  shape: Shape,
  tNow: number,
) {
  if (!colors) return
  const PAD_X = 16
  const PAD_Y = 12
  const { tStart, tEnd } = windowBounds(tNow)
  const yLim = 1.35

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Message m(t)', x0 + PAD_X, y0 + 10)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  ctx.strokeStyle = MSG_C
  ctx.lineWidth = 1.6
  ctx.beginPath()
  const STEPS = 500
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const m = messageAt(t, shape)
    if (i === 0) ctx.moveTo(xt(t), yv(m))
    else ctx.lineTo(xt(t), yv(m))
  }
  ctx.stroke()
}

function drawOverlay(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  betaP: number,
  shape: Shape,
  tNow: number,
) {
  if (!colors) return
  const PAD_X = 16
  const PAD_Y = 12
  const { tStart, tEnd } = windowBounds(tNow)
  const yLim = 1.25

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Αναφορά (διακεκομμένη)  vs  PM (συμπαγής)', x0 + PAD_X, y0 + 10)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  const STEPS = 1300

  // Reference carrier (dashed)
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1.2
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const ref = Math.cos(2 * Math.PI * FC * t)
    if (i === 0) ctx.moveTo(xt(t), yv(ref))
    else ctx.lineTo(xt(t), yv(ref))
  }
  ctx.stroke()
  ctx.setLineDash([])

  // PM signal (solid). For a square message the phase jumps, so break the path
  // at the transitions instead of drawing a spurious vertical connector.
  ctx.strokeStyle = PM_C
  ctx.lineWidth = 1.6
  ctx.beginPath()
  let prevM = messageAt(tStart, shape)
  let penDown = false
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const m = messageAt(t, shape)
    if (shape === 'square' && m !== prevM) penDown = false // phase jump → lift pen
    prevM = m
    const phi = betaP * m
    const pm = Math.cos(2 * Math.PI * FC * t + phi)
    const px = xt(t)
    const py = yv(pm)
    if (!penDown) {
      ctx.moveTo(px, py)
      penDown = true
    } else {
      ctx.lineTo(px, py)
    }
  }
  ctx.stroke()
}
