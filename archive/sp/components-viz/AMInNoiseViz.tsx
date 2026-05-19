'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * AM in noise — envelope detector behavior under additive bandpass noise.
 *
 * Simulation:
 *   x(t) = [A_c + m(t)] cos(2π f_c t) + n(t)
 *   where n(t) is bandlimited Gaussian noise centered at f_c.
 *
 * The envelope detector outputs |x(t) + n(t)|. For high SNR, this is close
 * to A_c + m(t) + (in-phase noise). Below ~10 dB SNR, the noise envelope
 * starts dominating and the recovered message becomes garbled — the
 * "threshold effect" of envelope detection in noise.
 *
 * Stacked panels:
 *   Top:    clean AM signal (no noise) for reference
 *   Mid:    noisy AM signal at chosen SNR
 *   Bottom: envelope detector output vs true message
 *
 * Slider: SNR in dB.
 */

const FC = 8
const FM = 0.5
const MU = 0.7
const A_C = 1

export function AMInNoiseViz() {
  const [snrDb, setSnrDb] = useState(20)
  const [running, setRunning] = useState(true)
  const tRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  // Pre-computed noise samples — regenerated on snr change
  const noiseRef = useRef<number[]>([])
  const noiseStartT = useRef(0)

  useEffect(() => {
    // Regenerate noise samples
    const N = 4000
    noiseRef.current = new Array(N).fill(0).map(() => boxMullerNoise())
    noiseStartT.current = 0
  }, [snrDb])

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (running) tRef.current += dt
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) drawScene(canvas, colors, snrDb, tRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, snrDb])

  const isThreshold = snrDb < 10
  const isVeryLow = snrDb < 5

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          AM σε θόρυβο — threshold effect του envelope detector
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
        Πάνω: AM signal καθαρό. Μέσο: + bandpass θόρυβος. Κάτω: η έξοδος του
        envelope detector — όσο πέφτει το SNR, η ανάκτηση χειροτερεύει
        γρήγορα. Στο ~10 dB SNR αρχίζει το <strong>threshold effect</strong>.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="AM signal in noise with envelope detector output"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          SNR ={' '}
          <span className="font-mono text-fg tabular-nums">{snrDb.toFixed(0)} dB</span>
          {' · '}
          {isVeryLow ? (
            <span className="text-red-600 dark:text-red-400">
              Πολύ χαμηλό SNR — total breakdown
            </span>
          ) : isThreshold ? (
            <span className="text-amber-600 dark:text-amber-400">
              Threshold region — η ποιότητα πέφτει γρήγορα
            </span>
          ) : (
            <span className="text-green-700 dark:text-green-400">
              Linear region — καλή ανάκτηση
            </span>
          )}
        </label>
        <input
          type="range"
          min={-5}
          max={30}
          step={1}
          value={snrDb}
          onChange={(e) => setSnrDb(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="SNR in dB"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Threshold effect:</strong> για SNR &gt; ~10 dB ο envelope
        detector είναι σχεδόν γραμμικός — output SNR ≈ input SNR (με κάποια
        απώλεια από τον carrier). Κάτω από 10 dB ο envelope του θορύβου αρχίζει
        να κυριαρχεί και η output SNR <strong>καταρρέει γρήγορα</strong>.
        Αυτή είναι η βασική αδυναμία της AM σε σύγκριση με το coherent receiver
        ή την FM (που έχουν διαφορετικά threshold characteristics).
      </div>
    </figure>
  )
}

function boxMullerNoise(): number {
  // Standard Gaussian noise sample
  const u1 = Math.random() || 1e-9
  const u2 = Math.random()
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

const SIG_C = 'rgb(29, 78, 216)'
const NOISE_C = 'rgba(220, 38, 38, 0.6)'
const ENV_C = 'rgb(168, 85, 247)'
const OUT_C = 'rgb(217, 119, 6)'

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  snrDb: number,
  tNow: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const rowH = h / 3
  // Convert SNR (dB) to noise standard deviation (assuming signal power ~ 0.5*A_c² for cos)
  const signalPower = (A_C * A_C) / 2 + (MU * MU * A_C * A_C) / 4
  const snrLinear = Math.pow(10, snrDb / 10)
  const noiseStd = Math.sqrt(signalPower / snrLinear)

  drawCleanAM(ctx, colors, 0, 0, w, rowH, tNow)
  drawNoisyAM(ctx, colors, 0, rowH, w, rowH, tNow, noiseStd)
  drawEnvelopeOutput(ctx, colors, 0, 2 * rowH, w, rowH, tNow, noiseStd)
}

function drawCleanAM(
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
  const tWindow = 6
  const tStart = tNow - tWindow * 0.7
  const tEnd = tNow + tWindow * 0.3
  const yLim = 2.4

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('AM σήμα καθαρό (αναφορά)', x0 + PAD_X, y0 + 10)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  ctx.strokeStyle = SIG_C
  ctx.lineWidth = 1
  ctx.beginPath()
  const STEPS = 600
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const v = (A_C + MU * Math.cos(2 * Math.PI * FM * t)) * Math.cos(2 * Math.PI * FC * t)
    const px = xt(t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
}

function drawNoisyAM(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  tNow: number,
  noiseStd: number,
) {
  if (!colors) return
  const PAD_X = 16
  const PAD_Y = 12
  const tWindow = 6
  const tStart = tNow - tWindow * 0.7
  const tEnd = tNow + tWindow * 0.3
  const yLim = 3.5

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('AM + θόρυβος (μπλε σήμα + κόκκινος θόρυβος)', x0 + PAD_X, y0 + 10)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  // Noisy AM signal (combined)
  ctx.strokeStyle = SIG_C
  ctx.lineWidth = 1
  ctx.beginPath()
  const STEPS = 1200
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const sig =
      (A_C + MU * Math.cos(2 * Math.PI * FM * t)) * Math.cos(2 * Math.PI * FC * t)
    // bandpass noise: cos(2π f_c t) modulated with random walk slow envelope
    const phase = 2 * Math.PI * t * 0.3 // slow noise envelope frequency
    const n = noiseStd * Math.cos(2 * Math.PI * FC * t + 5 * Math.sin(phase) + i * 0.13)
    const v = sig + n
    const px = xt(t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
}

function drawEnvelopeOutput(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  tNow: number,
  noiseStd: number,
) {
  if (!colors) return
  const PAD_X = 16
  const PAD_Y = 12
  const tWindow = 6
  const tStart = tNow - tWindow * 0.7
  const tEnd = tNow + tWindow * 0.3
  const yLim = 3.5

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim * 0.3, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(
    'Envelope detector output (πορτοκαλί) vs true envelope (violet dashed)',
    x0 + PAD_X,
    y0 + 10,
  )

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  // True envelope
  ctx.strokeStyle = ENV_C
  ctx.lineWidth = 1.5
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  const STEPS = 600
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const env = A_C + MU * Math.cos(2 * Math.PI * FM * t)
    const px = xt(t)
    const py = yv(env)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // Envelope detector output: |x_clean + n|, then RC-smoothed
  // For visualization we just show |x_clean + n_envelope| where n_envelope is a slow noise term
  let vCap = A_C
  ctx.strokeStyle = OUT_C
  ctx.lineWidth = 1.6
  ctx.beginPath()
  let firstPoint = true
  const SIM_STEPS = 1500
  const RC = 0.15 // good envelope detector
  for (let i = 0; i <= SIM_STEPS; i++) {
    const t = lerp(i, 0, SIM_STEPS, tStart, tEnd)
    const env = A_C + MU * Math.cos(2 * Math.PI * FM * t)
    const sigPlusNoise = env * Math.cos(2 * Math.PI * FC * t) + noiseStd * Math.cos(2 * Math.PI * FC * t + 7 * Math.sin(t * 1.2 + i * 0.07))
    const vIn = Math.max(0, sigPlusNoise)
    const dt = (tEnd - tStart) / SIM_STEPS
    if (vIn > vCap) {
      vCap += (vIn - vCap) * (dt / Math.max(RC * 0.01, 0.0001))
      if (vCap > vIn) vCap = vIn
    } else {
      vCap += -vCap * (dt / RC)
      if (vCap < 0) vCap = 0
    }
    if (i % 3 === 0) {
      const px = xt(t)
      const py = yv(vCap)
      if (firstPoint) {
        ctx.moveTo(px, py)
        firstPoint = false
      } else {
        ctx.lineTo(px, py)
      }
    }
  }
  ctx.stroke()
}
