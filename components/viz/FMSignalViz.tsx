'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * FM signal in time. Three stacked panels:
 *   1. message m(t)
 *   2. instantaneous frequency f_i(t) = f_c + K_f m(t) — the carrier
 *      frequency moves around f_c following the message (the f_i subscript
 *      means «instantaneous», analogous to instantaneous velocity in
 *      Mechanics)
 *   3. FM signal x(t) — visibly "compressed" where f_i is high, "stretched"
 *      where it's low. The envelope stays CONSTANT — all info is in the
 *      phase/frequency.
 *
 * Two message shapes:
 *   - cosine: smooth glide (ties to the single-tone β sin(2π f_m t) math)
 *   - square: a two-level on/off message → the frequency snaps between two
 *     clear values (slow zone / fast zone). This is the easiest way to SEE
 *     the frequency follow the message — and it is literally how digital FSK
 *     works.
 *
 * Slider: β_f = Δf / W. Bigger β → bigger frequency swing → more visible.
 * β_f ≪ 1 → NBFM (looks almost like a plain carrier); β_f ≫ 1 → WBFM.
 */

const FC = 4 // visual carrier cycles per unit time (kept low so cycles are readable)
const FM = 0.5 // message frequency (period = 2 units)
const T_WINDOW = 6 // units of signal shown across the panel

type Shape = 'cos' | 'square'

function messageAt(t: number, shape: Shape): number {
  if (shape === 'cos') return Math.cos(2 * Math.PI * FM * t)
  const P = 1 / FM
  const u = ((t % P) + P) % P
  return u < P / 2 ? 1 : -1
}

// f_i(t) = f_c + Δf · m(t), with Δf = β · f_m
function instFreqAt(t: number, beta: number, shape: Shape): number {
  return FC + beta * FM * messageAt(t, shape)
}

// Absolute phase 2π ∫ f_i dτ as a closed-form function of t, so the scrolling
// window stays glitch-free frame to frame.
function phaseAt(t: number, beta: number, shape: Shape): number {
  if (shape === 'cos') {
    // ∫ cos(2π f_m τ) dτ = sin(2π f_m t)/(2π f_m) ⇒ phase = 2π f_c t + β sin(2π f_m t)
    return 2 * Math.PI * FC * t + beta * Math.sin(2 * Math.PI * FM * t)
  }
  // square: ∫ of the ±1 square is a triangle I(t) ∈ [0, P/2], periodic
  const P = 1 / FM
  const u = ((t % P) + P) % P
  const I = u < P / 2 ? u : P - u
  return 2 * Math.PI * (FC * t + beta * FM * I)
}

export function FMSignalViz() {
  const [beta, setBeta] = useState(4.0)
  const [shape, setShape] = useState<Shape>('cos')
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
      if (canvas && colors) drawScene(canvas, colors, beta, shape, tRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, beta, shape])

  const fDeviation = beta * FM // Δf = β_f · f_m (single-tone)
  const isNB = beta < 0.3
  const isWB = beta > 1

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          FM σήμα στον χρόνο — η συχνότητα κουνιέται ακολουθώντας το m(t)
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
        Πάνω: message <span className="font-mono">m(t)</span>. Μέσο: η{' '}
        <strong>στιγμιαία συχνότητα</strong>{' '}
        <span className="font-mono">f_i(t) = f_c + K_f · m(t)</span> — ανεβαίνει
        όπου το m είναι ψηλά, πέφτει όπου είναι χαμηλά (η αναλογία της
        στιγμιαίας ταχύτητας στη Μηχανική). Κάτω: το FM σήμα{' '}
        <span className="font-mono">x(t)</span> — δες πώς οι κορυφές{' '}
        <strong>πυκνώνουν</strong> όπου f_i είναι ψηλή και{' '}
        <strong>αραιώνουν</strong> όπου είναι χαμηλή, ενώ το{' '}
        <strong>ύψος μένει σταθερό</strong>. Δοκίμασε το{' '}
        <strong>Τετραγωνικό</strong> message: η συχνότητα «κλειδώνει» σε δύο
        καθαρές τιμές — αργή ζώνη / γρήγορη ζώνη (έτσι ακριβώς δουλεύει το
        ψηφιακό FSK).
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 360 }}
        className="block h-[360px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="FM signal in time domain with instantaneous frequency"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          β_f = Δf / W ={' '}
          <span className="font-mono text-fg tabular-nums">{beta.toFixed(2)}</span>
          {' · '}
          frequency deviation Δf ={' '}
          <span className="font-mono text-fg tabular-nums">
            {fDeviation.toFixed(2)} · f_m
          </span>
          {' · '}
          {isNB ? (
            <span className="text-green-700 dark:text-green-400">NBFM (β_f ≪ 1)</span>
          ) : isWB ? (
            <span className="text-amber-600 dark:text-amber-400">WBFM (β_f ≫ 1)</span>
          ) : (
            <span className="text-fg-muted">Ενδιάμεση περιοχή</span>
          )}
        </label>
        <input
          type="range"
          min={0}
          max={6}
          step={0.05}
          value={beta}
          onChange={(e) => setBeta(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Modulation index beta"
        />
        <p className="mt-1 text-[11px] text-fg-subtle">
          Σύρε το β <strong>ψηλά</strong> για μεγάλη μετατόπιση συχνότητας (WBFM —
          εκεί η διαφορά φαίνεται έντονα). Κοντά στο <strong>0</strong> (NBFM) η
          συχνότητα μετακινείται ελάχιστα και το σήμα μοιάζει σχεδόν με σταθερό
          carrier — γι' αυτό η αλλαγή «δεν φαινόταν» στις χαμηλές τιμές.
        </p>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Η <strong>στιγμιαία συχνότητα</strong> είναι κρίσιμη έννοια στο FM:{' '}
        <span className="font-mono">f_i(t) = f_c + K_f · m(t)</span>. Όταν το
        message αυξάνει, η συχνότητα του carrier ανεβαίνει — όχι το πλάτος.
        Γι' αυτό η FM είναι <strong>ανοσοποιημένη στο amplitude noise</strong>:
        τα peaks του θορύβου επηρεάζουν το envelope, όχι τη συχνότητα. Αυτή
        η σταθερότητα του envelope είναι και ο λόγος που η ισχύς της FM
        παραμένει <span className="font-mono">A_c²/2</span> ανεξάρτητα του β.
      </div>
    </figure>
  )
}

const MSG_C = 'rgb(217, 119, 6)' // amber
const FREQ_C = 'rgb(168, 85, 247)' // violet
const SIG_C = 'rgb(29, 78, 216)' // accent

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  beta: number,
  shape: Shape,
  tNow: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const rowH = h / 3
  drawMessage(ctx, colors, 0, 0, w, rowH, shape, tNow)
  drawInstFreq(ctx, colors, 0, rowH, w, rowH, beta, shape, tNow)
  drawFMSignal(ctx, colors, 0, 2 * rowH, w, rowH, beta, shape, tNow)
}

function windowBounds(tNow: number) {
  const tStart = tNow - T_WINDOW * 0.7
  const tEnd = tNow + T_WINDOW * 0.3
  return { tStart, tEnd }
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
  const yLim = 1.4

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(
    shape === 'cos'
      ? 'Message m(t) = A_m cos(2π f_m t)'
      : 'Message m(t) — τετραγωνικό on/off (±A_m)',
    x0 + PAD_X,
    y0 + 10,
  )

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  ctx.strokeStyle = MSG_C
  ctx.lineWidth = 1.6
  ctx.beginPath()
  const STEPS = 600
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const m = messageAt(t, shape)
    const px = xt(t)
    const py = yv(m)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
}

function drawInstFreq(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  beta: number,
  shape: Shape,
  tNow: number,
) {
  if (!colors) return
  const PAD_X = 16
  const PAD_Y = 12
  const { tStart, tEnd } = windowBounds(tNow)

  const Δf = beta * FM // visual frequency deviation (same units as f_c)
  const yMax = (FC + Δf) * 1.15
  const yMin = Math.max(0, FC - Δf - 0.5)

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yMax, yMin, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yFc = yv(FC)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Στιγμιαία συχνότητα f_i(t) = f_c + K_f · m(t)', x0 + PAD_X, y0 + 10)

  // f_c reference line (dashed)
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yFc)
  ctx.lineTo(x0 + pw - PAD_X, yFc)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('f_c', x0 + PAD_X - 3, yFc + 3)
  ctx.fillText('f_c + Δf', x0 + PAD_X - 3, yv(FC + Δf) + 3)
  if (FC - Δf > 0) {
    ctx.fillText('f_c − Δf', x0 + PAD_X - 3, yv(FC - Δf) + 3)
  }

  // f_inst trace
  ctx.strokeStyle = FREQ_C
  ctx.lineWidth = 1.8
  ctx.beginPath()
  const STEPS = 600
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const fInst = instFreqAt(t, beta, shape)
    const px = xt(t)
    const py = yv(fInst)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
}

function drawFMSignal(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  beta: number,
  shape: Shape,
  tNow: number,
) {
  if (!colors) return
  const PAD_X = 16
  const PAD_Y = 12
  const { tStart, tEnd } = windowBounds(tNow)
  const yLim = 1.4

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('FM σήμα x(t) = A_c cos(2π f_c t + φ(t))', x0 + PAD_X, y0 + 10)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  // FM signal: phase = 2π ∫ f_i dτ
  ctx.strokeStyle = SIG_C
  ctx.lineWidth = 1.3
  ctx.beginPath()
  const STEPS = 1600
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const v = Math.cos(phaseAt(t, beta, shape))
    const px = xt(t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Constant envelope hint (faint dashed at ±1)
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 4])
  ctx.lineWidth = 1
  for (const sign of [1, -1]) {
    ctx.beginPath()
    ctx.moveTo(x0 + PAD_X, yv(sign))
    ctx.lineTo(x0 + pw - PAD_X, yv(sign))
    ctx.stroke()
  }
  ctx.setLineDash([])
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('+A_c', x0 + PAD_X - 3, yv(1) + 3)
  ctx.fillText('−A_c', x0 + PAD_X - 3, yv(-1) + 3)
}
