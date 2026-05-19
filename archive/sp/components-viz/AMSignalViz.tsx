'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Conventional AM in the time domain. Visualizes:
 *
 *   x(t) = [A_c + A_m cos(2π f_m t)] · cos(2π f_c t)
 *
 * Three traces stacked:
 *   - message m(t) = A_m cos(2π f_m t)
 *   - envelope ±|A_c + m(t)| as a faded dashed pair
 *   - the AM signal x(t) (carrier filled with envelope)
 *
 * Slider for modulation index μ = A_m / A_c (with A_c held at 1).
 *   μ < 1   → undermodulated, envelope is positive everywhere
 *   μ = 1   → critical, envelope just touches zero
 *   μ > 1   → overmodulated, envelope goes negative → distortion when
 *             demodulated by an envelope detector (which outputs |·|).
 *
 * Critical visual: at μ > 1, mark the regions where the envelope dips
 * below 0 in red, since that's where envelope detection would fail.
 */

const FC = 8 // carrier visual cycles per unit time
const FM = 0.5 // message visual cycles per unit time (slow vs carrier)
const A_C = 1 // carrier amplitude (held constant)

export function AMSignalViz() {
  const [mu, setMu] = useState(0.6)
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
      if (canvas && colors) drawScene(canvas, colors, mu, tRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, mu])

  const isOver = mu > 1
  const isCritical = Math.abs(mu - 1) < 0.02

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Conventional AM στον χρόνο — μ slider
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
        <span className="font-mono">x(t) = [A_c + A_m cos(2π f_m t)] cos(2π f_c t)</span>
        {' · '}
        Πάνω: message + envelope. Κάτω: το διαμορφωμένο σήμα{' '}
        <span className="font-mono">x(t)</span> με carrier «γεμισμένο» με το envelope.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 280 }}
        className="block h-[280px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="AM time-domain visualization with envelope and overmodulation indication"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Modulation index μ = A_m / A_c ={' '}
          <span className="font-mono text-fg tabular-nums">{mu.toFixed(2)}</span>
          {' · '}
          {isOver ? (
            <span className="font-semibold text-red-600 dark:text-red-400">
              ⚠ Overmodulation (μ &gt; 1)
            </span>
          ) : isCritical ? (
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              Critical modulation (μ = 1)
            </span>
          ) : (
            <span className="text-fg-muted">Undermodulated (μ &lt; 1)</span>
          )}
        </label>
        <input
          type="range"
          min={0}
          max={1.6}
          step={0.02}
          value={mu}
          onChange={(e) => setMu(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Modulation index mu"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Όταν <span className="font-mono">μ &gt; 1</span>, το envelope «πέφτει
        κάτω από το 0» σε κάποια χρονικά διαστήματα (κόκκινες ζώνες). Ένας
        envelope detector βγάζει <span className="font-mono">|envelope|</span>{' '}
        — αναποδογυρίζει τα αρνητικά σημεία και **παραμορφώνει** το ανακτημένο
        message. Γι' αυτό κρατάμε <span className="font-mono">μ ≤ 1</span> πάντα.
      </div>
    </figure>
  )
}

const MSG_C = 'rgb(217, 119, 6)' // amber for message
const ENV_C = 'rgb(168, 85, 247)' // violet for envelope
const SIG_C = 'rgb(29, 78, 216)' // accent blue for AM signal
const ERR_C = 'rgb(220, 38, 38)' // red for overmod regions

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  mu: number,
  tNow: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const topH = h * 0.4
  const botH = h - topH
  drawMessageAndEnvelope(ctx, colors, 0, 0, w, topH, mu, tNow)
  drawAMSignal(ctx, colors, 0, topH, w, botH, mu, tNow)
}

function drawMessageAndEnvelope(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  mu: number,
  tNow: number,
) {
  if (!colors) return
  const PAD_X = 16
  const PAD_Y = 14
  const tWindow = 8
  const tStart = tNow - tWindow * 0.7
  const tEnd = tNow + tWindow * 0.3
  const yLim = 2.2

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 8, y0 + ph - PAD_Y)
  const yZero = yv(0)

  // header
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('m(t) (amber) και envelope ±|A_c + m(t)| (violet)', x0 + PAD_X, y0 + 12)

  // baseline
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()
  // playhead
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(xt(tNow), y0 + PAD_Y + 8)
  ctx.lineTo(xt(tNow), y0 + ph - PAD_Y)
  ctx.stroke()
  ctx.setLineDash([])

  // shade overmodulated regions (where A_c + m(t) < 0)
  if (mu > 1) {
    ctx.fillStyle = `rgba(${getRGB(ERR_C)}, 0.12)`
    const STEPS = 600
    let inOver = false
    let segStart = 0
    for (let i = 0; i <= STEPS; i++) {
      const t = lerp(i, 0, STEPS, tStart, tEnd)
      const env = A_C + mu * Math.cos(2 * Math.PI * FM * t)
      if (env < 0 && !inOver) {
        inOver = true
        segStart = xt(t)
      } else if (env >= 0 && inOver) {
        inOver = false
        ctx.fillRect(segStart, y0 + PAD_Y + 8, xt(t) - segStart, ph - 2 * PAD_Y - 8)
      }
    }
    if (inOver) {
      ctx.fillRect(segStart, y0 + PAD_Y + 8, xt(tEnd) - segStart, ph - 2 * PAD_Y - 8)
    }
  }

  // message (amber)
  ctx.strokeStyle = MSG_C
  ctx.lineWidth = 1.4
  ctx.beginPath()
  const STEPS = 360
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const m = mu * Math.cos(2 * Math.PI * FM * t)
    const px = xt(t)
    const py = yv(m)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // envelope ±|A_c + m(t)|
  ctx.strokeStyle = ENV_C
  ctx.lineWidth = 1.6
  ctx.setLineDash([4, 4])
  for (const sign of [1, -1]) {
    ctx.beginPath()
    for (let i = 0; i <= STEPS; i++) {
      const t = lerp(i, 0, STEPS, tStart, tEnd)
      const envSigned = A_C + mu * Math.cos(2 * Math.PI * FM * t)
      const env = sign * Math.abs(envSigned)
      const px = xt(t)
      const py = yv(env)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }
  ctx.setLineDash([])

  // y ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('+A_c', x0 + PAD_X - 2, yv(1) + 3)
  ctx.fillText('0', x0 + PAD_X - 2, yZero + 3)
  ctx.fillText('−A_c', x0 + PAD_X - 2, yv(-1) + 3)
}

function drawAMSignal(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  mu: number,
  tNow: number,
) {
  if (!colors) return
  const PAD_X = 16
  const PAD_Y = 14
  const tWindow = 8
  const tStart = tNow - tWindow * 0.7
  const tEnd = tNow + tWindow * 0.3
  const yLim = 2.2

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 8, y0 + ph - PAD_Y)
  const yZero = yv(0)

  // header
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('x(t) — AM σήμα (carrier × [A_c + m(t)])', x0 + PAD_X, y0 + 12)

  // baseline
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  // envelope (faint dashed) shown again on this plot for reference
  ctx.strokeStyle = ENV_C
  ctx.lineWidth = 1.2
  ctx.setLineDash([3, 4])
  for (const sign of [1, -1]) {
    ctx.beginPath()
    const ESTEPS = 360
    for (let i = 0; i <= ESTEPS; i++) {
      const t = lerp(i, 0, ESTEPS, tStart, tEnd)
      const envSigned = A_C + mu * Math.cos(2 * Math.PI * FM * t)
      const env = sign * Math.abs(envSigned)
      const px = xt(t)
      const py = yv(env)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }
  ctx.setLineDash([])

  // shade overmodulated regions on the AM signal too
  if (mu > 1) {
    ctx.fillStyle = `rgba(${getRGB(ERR_C)}, 0.12)`
    const STEPS = 600
    let inOver = false
    let segStart = 0
    for (let i = 0; i <= STEPS; i++) {
      const t = lerp(i, 0, STEPS, tStart, tEnd)
      const env = A_C + mu * Math.cos(2 * Math.PI * FM * t)
      if (env < 0 && !inOver) {
        inOver = true
        segStart = xt(t)
      } else if (env >= 0 && inOver) {
        inOver = false
        ctx.fillRect(segStart, y0 + PAD_Y + 8, xt(t) - segStart, ph - 2 * PAD_Y - 8)
      }
    }
    if (inOver) {
      ctx.fillRect(segStart, y0 + PAD_Y + 8, xt(tEnd) - segStart, ph - 2 * PAD_Y - 8)
    }
  }

  // playhead
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(xt(tNow), y0 + PAD_Y + 8)
  ctx.lineTo(xt(tNow), y0 + ph - PAD_Y)
  ctx.stroke()
  ctx.setLineDash([])

  // AM signal
  ctx.strokeStyle = SIG_C
  ctx.lineWidth = 1.3
  ctx.beginPath()
  const STEPS = 1200
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const env = A_C + mu * Math.cos(2 * Math.PI * FM * t)
    const v = env * Math.cos(2 * Math.PI * FC * t)
    const px = xt(t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
}

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '220, 38, 38'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}
