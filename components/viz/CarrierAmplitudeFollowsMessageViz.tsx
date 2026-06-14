'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Concept-level AM time-domain viz for /am/overview §2.
 *
 * Goal sentence: let the student SEE the carrier's oscillation amplitude stop
 * being constant and start tracing A_c + m(t). The envelope IS the message
 * lifted onto a pedestal A_c.
 *
 * Three stacked, scrolling panels build x(t) from its ingredients:
 *   1. m(t)            — the slow message (single tone or voice-like multi-tone)
 *   2. c(t) = A_c cos  — the bare carrier, CONSTANT amplitude (flat ±A_c)
 *   3. x(t) = [A_c + m(t)] cos(2π f_c t) — the SAME fast cosine, but now its
 *      peaks hug the dashed envelope ±(A_c + m(t)), which wiggles around +A_c.
 *
 * Deliberately NO μ / overmodulation / efficiency here — that is the job of
 * /am/conventional. The message strength is capped so the envelope always
 * stays positive, with a forward pointer for "what if you push it too far".
 */

const FC = 8 // carrier visual cycles per unit time
const A_C = 1 // carrier amplitude / pedestal (held constant)
const T_WINDOW = 8

type MsgKind = 'tone' | 'voice'

/** Message normalized so that |m(t)| ≤ 1, before scaling by `strength`. */
function messageNorm(t: number, kind: MsgKind): number {
  if (kind === 'voice') {
    // Amplitudes sum to 1 ⇒ |m| ≤ 1 always (envelope stays positive).
    return (
      0.6 * Math.cos(2 * Math.PI * 0.4 * t) +
      0.3 * Math.cos(2 * Math.PI * 0.7 * t) +
      0.1 * Math.cos(2 * Math.PI * 1.1 * t)
    )
  }
  return Math.cos(2 * Math.PI * 0.5 * t)
}

export function CarrierAmplitudeFollowsMessageViz() {
  const [strength, setStrength] = useState(0.7)
  const [kind, setKind] = useState<MsgKind>('tone')
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
      if (canvas && colors) drawScene(canvas, colors, strength, kind, tRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, strength, kind])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Το πλάτος του carrier «αναπνέει» με το m(t)
        </h4>
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

      <p className="mb-3 text-xs text-fg-muted">
        Πάρε το message <span className="font-mono">m(t)</span> (πάνω) και τον καθαρό
        carrier <span className="font-mono">A_c·cos(2π f_c t)</span> (μέση). Το AM σήμα
        (κάτω) είναι ο ίδιος γρήγορος carrier, αλλά το «πλάτος ταλάντωσής» του δεν είναι
        πια σταθερό — οι κορυφές του ακολουθούν την περιβάλλουσα{' '}
        <span className="font-mono">A_c + m(t)</span>.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 380 }}
        className="block h-[380px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Τρία panel: το message m(t), ο σταθερού πλάτους carrier, και το AM σήμα του οποίου η περιβάλλουσα ακολουθεί το A_c + m(t)"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-fg-muted">Message:</span>
        {(
          [
            { id: 'tone' as const, label: 'Καθαρός τόνος' },
            { id: 'voice' as const, label: 'Φωνή (πολλοί τόνοι)' },
          ]
        ).map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setKind(opt.id)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              kind === opt.id
                ? 'border-accent bg-accent-soft/40 text-fg'
                : 'border-border bg-bg-soft text-fg-muted hover:border-accent/50 hover:text-fg'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Ένταση του message (πλάτος του <span className="font-mono">m(t)</span>) ={' '}
          <span className="font-mono text-fg tabular-nums">{strength.toFixed(2)}</span>
          {' · A_c = 1'}
        </label>
        <input
          type="range"
          min={0.1}
          max={0.9}
          step={0.05}
          value={strength}
          onChange={(e) => setStrength(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Ένταση του message"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Πρόσεξε την κάτω περιβάλλουσα: ταλαντώνεται γύρω από τη σταθερή γραμμή{' '}
        <span className="font-mono">A_c</span> — και αυτή η ταλάντωση{' '}
        <strong>είναι ακριβώς το</strong> <span className="font-mono">m(t)</span>, απλώς
        σηκωμένο πάνω σε ένα βάθρο <span className="font-mono">A_c</span>. Όσο ανεβάζεις
        την ένταση, τόσο πιο έντονα «αναπνέει» το πλάτος. (Κρατάμε την ένταση χαμηλή ώστε
        η περιβάλλουσα να μένει θετική· τι γίνεται αν την σπρώξεις πολύ ψηλά, το βλέπουμε
        στο Conventional AM.)
      </div>
    </figure>
  )
}

const MSG_C = 'rgb(217, 119, 6)' // amber — message
const CAR_C = 'rgb(100, 116, 139)' // slate — bare carrier
const ENV_C = 'rgb(168, 85, 247)' // violet — envelope
const SIG_C = 'rgb(29, 78, 216)' // accent blue — AM signal

const PAD_X = 16
const TOP = 14 // header band inside each panel
const PAD_B = 10 // bottom padding inside each panel

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  strength: number,
  kind: MsgKind,
  tNow: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const tStart = tNow - T_WINDOW * 0.7
  const tEnd = tNow + T_WINDOW * 0.3

  const msgH = h * 0.26
  const carH = h * 0.37
  const sigH = h - msgH - carH

  drawMessage(ctx, colors, 0, 0, w, msgH, strength, kind, tStart, tEnd, tNow)
  drawCarrier(ctx, colors, 0, msgH, w, carH, tStart, tEnd, tNow)
  drawSignal(ctx, colors, 0, msgH + carH, w, sigH, strength, kind, tStart, tEnd, tNow)
}

/** Build x↔t and v↔y mappers + draw header label, baseline and playhead. */
function panelFrame(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  yLim: number,
  label: string,
  tStart: number,
  tEnd: number,
  tNow: number,
) {
  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + TOP, y0 + ph - PAD_B)
  const yZero = yv(0)

  // header
  ctx.fillStyle = colors!.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(label, x0 + PAD_X, y0 + 11)

  // baseline
  ctx.strokeStyle = colors!.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  // playhead
  ctx.strokeStyle = colors!.fgSubtle
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(xt(tNow), y0 + TOP)
  ctx.lineTo(xt(tNow), y0 + ph - PAD_B)
  ctx.stroke()
  ctx.setLineDash([])

  return { xt, yv, yZero }
}

function traceFn(
  ctx: CanvasRenderingContext2D,
  xt: (t: number) => number,
  yv: (v: number) => number,
  tStart: number,
  tEnd: number,
  steps: number,
  fn: (t: number) => number,
) {
  ctx.beginPath()
  for (let i = 0; i <= steps; i++) {
    const t = lerp(i, 0, steps, tStart, tEnd)
    const px = xt(t)
    const py = yv(fn(t))
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
}

function drawMessage(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  strength: number,
  kind: MsgKind,
  tStart: number,
  tEnd: number,
  tNow: number,
) {
  const yLim = 1.0
  const { xt, yv } = panelFrame(
    ctx,
    colors,
    x0,
    y0,
    pw,
    ph,
    yLim,
    '①  m(t) — το message (baseband, αργό)',
    tStart,
    tEnd,
    tNow,
  )

  ctx.strokeStyle = MSG_C
  ctx.lineWidth = 1.6
  traceFn(ctx, xt, yv, tStart, tEnd, 360, (t) => strength * messageNorm(t, kind))
}

function drawCarrier(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  tStart: number,
  tEnd: number,
  tNow: number,
) {
  const yLim = 2.1 // same scale as the signal panel for a fair comparison
  const { xt, yv } = panelFrame(
    ctx,
    colors,
    x0,
    y0,
    pw,
    ph,
    yLim,
    '②  c(t) = A_c · cos(2π f_c t) — σταθερό πλάτος ±A_c',
    tStart,
    tEnd,
    tNow,
  )

  // flat ±A_c reference lines: the carrier's envelope is constant
  ctx.strokeStyle = ENV_C
  ctx.lineWidth = 1.3
  ctx.setLineDash([4, 4])
  for (const sign of [1, -1]) {
    ctx.beginPath()
    ctx.moveTo(xt(tStart), yv(sign * A_C))
    ctx.lineTo(xt(tEnd), yv(sign * A_C))
    ctx.stroke()
  }
  ctx.setLineDash([])

  ctx.fillStyle = colors!.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('+A_c', x0 + pw - PAD_X - 2, yv(A_C) - 3)
  ctx.fillText('−A_c', x0 + pw - PAD_X - 2, yv(-A_C) + 9)

  // the bare carrier
  ctx.strokeStyle = CAR_C
  ctx.lineWidth = 1.2
  traceFn(ctx, xt, yv, tStart, tEnd, 1200, (t) => A_C * Math.cos(2 * Math.PI * FC * t))
}

function drawSignal(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  strength: number,
  kind: MsgKind,
  tStart: number,
  tEnd: number,
  tNow: number,
) {
  const yLim = 2.1
  const { xt, yv } = panelFrame(
    ctx,
    colors,
    x0,
    y0,
    pw,
    ph,
    yLim,
    '③  x(t) = [A_c + m(t)] · cos(2π f_c t) — το πλάτος «αναπνέει»',
    tStart,
    tEnd,
    tNow,
  )

  const env = (t: number) => A_C + strength * messageNorm(t, kind)

  // faint pedestal lines at ±A_c so the envelope is seen wiggling around A_c
  ctx.strokeStyle = colors!.border
  ctx.lineWidth = 1
  ctx.setLineDash([2, 4])
  for (const sign of [1, -1]) {
    ctx.beginPath()
    ctx.moveTo(xt(tStart), yv(sign * A_C))
    ctx.lineTo(xt(tEnd), yv(sign * A_C))
    ctx.stroke()
  }
  ctx.setLineDash([])
  ctx.fillStyle = colors!.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('A_c', x0 + pw - PAD_X - 2, yv(A_C) - 3)

  // envelope ±(A_c + m(t)) — the curve the carrier peaks hug
  ctx.strokeStyle = ENV_C
  ctx.lineWidth = 1.6
  ctx.setLineDash([4, 4])
  for (const sign of [1, -1]) {
    traceFn(ctx, xt, yv, tStart, tEnd, 360, (t) => sign * env(t))
  }
  ctx.setLineDash([])

  // the AM signal itself
  ctx.strokeStyle = SIG_C
  ctx.lineWidth = 1.3
  traceFn(ctx, xt, yv, tStart, tEnd, 1400, (t) => env(t) * Math.cos(2 * Math.PI * FC * t))

  // label the envelope
  ctx.fillStyle = ENV_C
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('περιβάλλουσα = A_c + m(t)', x0 + PAD_X + 2, y0 + TOP + 9)
}
