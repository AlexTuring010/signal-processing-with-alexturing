'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * FM signal in time. Three stacked panels:
 *   1. message m(t) (cosine for clarity)
 *   2. instantaneous frequency f_inst(t) = f_c + k_f m(t) — the carrier
 *      frequency moves around f_c following the message
 *   3. FM signal x(t) = A_c cos(2π f_c t + 2π k_f ∫m(τ)dτ) — visibly
 *      "compressed" where f_inst is high, "stretched" where it's low
 *
 * Slider: β = k_f A_m / f_m. For sinusoidal m, β controls how much the
 * frequency wobbles around f_c. β = 0 → pure carrier, no information.
 * β = 1 → moderate wobble (NBFM ↔ WBFM boundary). β = 5 → wide deviation.
 *
 * Key visual: the FM signal envelope stays CONSTANT. Unlike AM where
 * envelope carries info, in FM all info is in the phase/frequency.
 */

const FC = 6 // visual carrier cycles per unit time
const FM = 0.6 // message frequency

export function FMSignalViz() {
  const [beta, setBeta] = useState(2.0)
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
      if (canvas && colors) drawScene(canvas, colors, beta, tRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, beta])

  const fDeviation = beta * FM // Δf = β · f_m
  const isNB = beta < 0.3
  const isWB = beta > 1

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          FM σήμα στον χρόνο — η συχνότητα κουνιέται ακολουθώντας το m(t)
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
        Πάνω: message <span className="font-mono">m(t)</span>. Μέσο: η{' '}
        <strong>στιγμιαία συχνότητα</strong>{' '}
        <span className="font-mono">f(t) = f_c + k_f · m(t)</span> — αυξάνεται
        όπου το m είναι θετικό, πέφτει όπου είναι αρνητικό. Κάτω: το FM
        σήμα <span className="font-mono">x(t)</span> — δες πώς οι κορυφές
        «συμπιέζονται» όπου f είναι ψηλή και «απλώνονται» όπου είναι χαμηλή.
        <strong> Το envelope μένει σταθερό</strong> — όλη η πληροφορία στη φάση.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 360 }}
        className="block h-[360px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="FM signal in time domain with instantaneous frequency"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          β = Δf / f_m ={' '}
          <span className="font-mono text-fg tabular-nums">{beta.toFixed(2)}</span>
          {' · '}
          frequency deviation Δf ={' '}
          <span className="font-mono text-fg tabular-nums">
            {fDeviation.toFixed(2)} · f_m
          </span>
          {' · '}
          {isNB ? (
            <span className="text-green-700 dark:text-green-400">NBFM (β &lt; 0.3)</span>
          ) : isWB ? (
            <span className="text-amber-600 dark:text-amber-400">WBFM (β &gt; 1)</span>
          ) : (
            <span className="text-fg-muted">Intermediate</span>
          )}
        </label>
        <input
          type="range"
          min={0}
          max={5}
          step={0.05}
          value={beta}
          onChange={(e) => setBeta(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Modulation index beta"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Η <strong>στιγμιαία συχνότητα</strong> είναι κρίσιμη έννοια στο FM:{' '}
        <span className="font-mono">f(t) = f_c + Δf · m(t)/max(m)</span>. Όταν
        το message αυξάνει, η συχνότητα του carrier ανεβαίνει — όχι το πλάτος.
        Γι' αυτό η FM είναι <strong>ανοσοποιημένη στο amplitude noise</strong>:
        τα peaks του θορύβου επηρεάζουν το envelope, όχι τη συχνότητα.
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
  tNow: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const rowH = h / 3
  drawMessage(ctx, colors, 0, 0, w, rowH, tNow)
  drawInstFreq(ctx, colors, 0, rowH, w, rowH, beta, tNow)
  drawFMSignal(ctx, colors, 0, 2 * rowH, w, rowH, beta, tNow)
}

function drawMessage(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  tNow: number,
) {
  if (!colors) return
  const PAD_X = 16
  const PAD_Y = 12
  const tWindow = 8
  const tStart = tNow - tWindow * 0.7
  const tEnd = tNow + tWindow * 0.3
  const yLim = 1.4

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Message m(t) = A_m cos(2π f_m t)', x0 + PAD_X, y0 + 10)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  ctx.strokeStyle = MSG_C
  ctx.lineWidth = 1.6
  ctx.beginPath()
  const STEPS = 240
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const m = Math.cos(2 * Math.PI * FM * t)
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
  tNow: number,
) {
  if (!colors) return
  const PAD_X = 16
  const PAD_Y = 12
  const tWindow = 8
  const tStart = tNow - tWindow * 0.7
  const tEnd = tNow + tWindow * 0.3

  // For the visualization, plot f_inst as a normalized ratio to f_c
  // f_inst = f_c (1 + (β/(2π)) · cos(2π f_m t)) — but more simply:
  // For y = f_c + Δf · cos(...), normalize by f_c so we see it relative
  const Δf = beta * FM // visual frequency deviation (in same units as f_c)
  const yMax = (FC + Δf) * 1.15
  const yMin = Math.max(0, FC - Δf - 0.5)

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yMax, yMin, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yFc = yv(FC)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`Στιγμιαία συχνότητα f(t) = f_c + Δf · m(t)/A_m  (Δf = β·f_m)`, x0 + PAD_X, y0 + 10)

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
  ctx.fillText(`f_c + Δf`, x0 + PAD_X - 3, yv(FC + Δf) + 3)
  if (FC - Δf > 0) {
    ctx.fillText(`f_c − Δf`, x0 + PAD_X - 3, yv(FC - Δf) + 3)
  }

  // f_inst trace
  ctx.strokeStyle = FREQ_C
  ctx.lineWidth = 1.8
  ctx.beginPath()
  const STEPS = 240
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const f_inst = FC + Δf * Math.cos(2 * Math.PI * FM * t)
    const px = xt(t)
    const py = yv(f_inst)
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
  tNow: number,
) {
  if (!colors) return
  const PAD_X = 16
  const PAD_Y = 12
  const tWindow = 8
  const tStart = tNow - tWindow * 0.7
  const tEnd = tNow + tWindow * 0.3
  const yLim = 1.4

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('FM σήμα x(t) = A_c cos(2π f_c t + β sin(2π f_m t))', x0 + PAD_X, y0 + 10)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  // FM signal: phase = 2π f_c t + β sin(2π f_m t)
  ctx.strokeStyle = SIG_C
  ctx.lineWidth = 1.3
  ctx.beginPath()
  const STEPS = 1500
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const phase = 2 * Math.PI * FC * t + beta * Math.sin(2 * Math.PI * FM * t)
    const v = Math.cos(phase)
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
