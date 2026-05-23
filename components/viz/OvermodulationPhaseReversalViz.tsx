'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Overmodulation & phase reversal — the envelope detector's failure mode.
 *
 * The page already has AMSignalViz showing m(t), envelope, and x(t). What it
 * does NOT show is the actual *output* of the envelope detector: the
 * rectified `|A_c + m(t)|` curve, which is what an envelope-detector receiver
 * literally hands the user. Past μ=1, that output stops being a faithful
 * shifted copy of m(t) — it "folds over" the negative excursions, and the
 * recovered message develops cusps and harmonics.
 *
 * Stacked panels:
 *   - Top: x(t) (transmitted), with phase-reversal markers where A_c+m(t)
 *     crosses zero.
 *   - Middle: A_c + m(t) signed (violet) vs |A_c + m(t)| output (blue/red).
 *     The fold-over zones are shaded.
 *   - Bottom: recovered message m̂(t) = |A_c+m(t)| − A_c overlaid against
 *     the true m(t). Where they differ → red fill = distortion energy.
 *
 * Right column: μ slider 0..2 with preset chips, a distortion-% readout
 * computed numerically over a single message period, and a verdict line.
 */

const FC = 9 // carrier visual cycles per unit time
const FM = 0.4 // message visual cycles per unit time
const A_C = 1 // carrier amplitude (held constant)

const COLOR_MSG = 'rgb(217, 119, 6)' // amber
const COLOR_SIGNED = 'rgb(168, 85, 247)' // violet
const COLOR_RECOVERED = 'rgb(29, 78, 216)' // accent blue
const COLOR_ERROR = 'rgb(220, 38, 38)' // red
const COLOR_DC = 'rgb(100, 116, 139)' // slate

const PRESETS = [
  { mu: 0.5, label: 'μ = 0.5', tone: 'ok' as const, hint: 'καθαρή ανάκτηση' },
  { mu: 1.0, label: 'μ = 1.0', tone: 'edge' as const, hint: 'οριακή — αγγίζει το 0' },
  { mu: 1.5, label: 'μ = 1.5', tone: 'bad' as const, hint: 'σπασμένη — fold-over' },
]

export function OvermodulationPhaseReversalViz() {
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
      if (running) tRef.current += dt * 0.6
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) drawScene(canvas, colors, mu, tRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, mu])

  const distortion = computeDistortionPct(mu)
  const verdict = mu < 0.98 ? 'ok' : mu < 1.02 ? 'edge' : 'bad'

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Υπερδιαμόρφωση — τι ακριβώς βγάζει ο envelope detector
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
        Σύρε το <span className="font-mono">μ</span> από{' '}
        <span className="font-mono">0.5</span> προς το{' '}
        <span className="font-mono">1.5</span>. Παρατήρησε τι κάνει το{' '}
        <span className="font-mono">|A_c + m(t)|</span> (κάτω από{' '}
        <span className="font-mono">A_c</span>): όσο{' '}
        <span className="font-mono">μ &gt; 1</span>, οι κάτω μισές «αναποδογυρίζουν»
        και η ανακτημένη <span className="font-mono">m̂(t)</span> αποκτά αιχμές
        όπου το αρχικό σήμα πήγαινε αρνητικό.
      </p>

      <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
        <canvas
          ref={canvasRef}
          style={{ height: 360 }}
          className="block h-[360px] w-full rounded-md border border-border bg-bg-soft/30"
          aria-label="Envelope detector output vs true message under varying modulation index"
        />

        <div className="flex flex-col gap-3">
          <div className="rounded-md border border-border bg-bg-soft/40 p-3">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              Modulation index μ
            </label>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-xl text-fg tabular-nums">
                {mu.toFixed(2)}
              </span>
              <span className="text-[11px] text-fg-subtle">
                = A_m / A_c
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={2}
              step={0.02}
              value={mu}
              onChange={(e) => setMu(parseFloat(e.target.value))}
              className="mt-2 w-full accent-[rgb(var(--accent))]"
              aria-label="Modulation index mu"
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setMu(p.mu)}
                  className="rounded-full border border-border bg-bg px-2 py-0.5 text-[10px] font-medium text-fg-muted hover:border-accent/50 hover:text-fg"
                  title={p.hint}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-border bg-bg-soft/40 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              Παραμόρφωση ανακτημένης m̂(t)
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span
                className={`font-mono text-xl tabular-nums ${
                  verdict === 'ok'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : verdict === 'edge'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-red-600 dark:text-red-400'
                }`}
              >
                {(distortion * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] text-fg-subtle">RMS error / RMS m</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-bg">
              <div
                className={`h-full rounded-full transition-[width] ${
                  verdict === 'ok'
                    ? 'bg-emerald-500'
                    : verdict === 'edge'
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(100, distortion * 100)}%` }}
              />
            </div>
          </div>

          <div
            className={`rounded-md border px-3 py-2 text-[12px] leading-snug ${
              verdict === 'ok'
                ? 'border-emerald-400/50 bg-emerald-50/70 text-emerald-900 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-100'
                : verdict === 'edge'
                  ? 'border-amber-400/50 bg-amber-50/70 text-amber-900 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-100'
                  : 'border-red-400/60 bg-red-50/70 text-red-900 dark:border-red-400/40 dark:bg-red-400/10 dark:text-red-100'
            }`}
          >
            {verdict === 'ok' && (
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>
                  Καθαρή ανάκτηση. <span className="font-mono">m̂(t) = m(t)</span>{' '}
                  ακριβώς — ο envelope detector βλέπει θετικό envelope παντού.
                </span>
              </span>
            )}
            {verdict === 'edge' && (
              <span className="inline-flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>
                  Οριακή λειτουργία — το <span className="font-mono">A_c + m(t)</span>{' '}
                  αγγίζει το 0. Στην πράξη αφήνεις ένα margin (~10%).
                </span>
              </span>
            )}
            {verdict === 'bad' && (
              <span className="inline-flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>
                  Σπασμένη ανάκτηση. Ο detector «αναποδογυρίζει» τα αρνητικά
                  διαστήματα ⇒ αιχμές + αρμονικές στην έξοδο. Αυτή είναι η
                  παραμόρφωση που <strong>δεν φεύγει</strong> με LPF.
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </figure>
  )
}

function computeDistortionPct(mu: number): number {
  // Numerical RMS(m̂ - m) / RMS(m) over one message period.
  if (mu < 1e-3) return 0
  const N = 600
  let errSq = 0
  let mSq = 0
  for (let i = 0; i < N; i++) {
    const phase = (i / N) * 2 * Math.PI
    const m = mu * Math.cos(phase) // message normalised so A_m = mu·A_c, A_c=1
    const env = Math.abs(A_C + m) // envelope detector output
    const mHat = env - A_C // DC-blocked recovered
    errSq += (mHat - m) ** 2
    mSq += m * m
  }
  if (mSq < 1e-9) return 0
  return Math.sqrt(errSq / mSq)
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  mu: number,
  tNow: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // 3 stacked panels
  const PAD = 8
  const topH = (h - 3 * PAD) * 0.32
  const midH = (h - 3 * PAD) * 0.34
  const botH = (h - 3 * PAD) * 0.34
  drawTransmitted(ctx, colors, 0, 0, w, topH, mu, tNow)
  drawEnvelopeComparison(ctx, colors, 0, topH + PAD, w, midH, mu, tNow)
  drawRecoveredVsTrue(ctx, colors, 0, topH + midH + 2 * PAD, w, botH, mu, tNow)
}

function tBounds(tNow: number) {
  const tWindow = 8
  return { tStart: tNow - tWindow * 0.7, tEnd: tNow + tWindow * 0.3 }
}

function drawTransmitted(
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
  const PAD_X = 56
  const PAD_Y = 10
  const yLim = 2.4
  const { tStart, tEnd } = tBounds(tNow)
  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('① x(t) — εκπεμπόμενο AM σήμα', x0 + PAD_X, y0 + 12)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  // Shade phase-reversal regions (where A_c + m(t) < 0)
  if (mu > 1) {
    ctx.fillStyle = 'rgba(220, 38, 38, 0.10)'
    const STEPS = 600
    let inFlip = false
    let segStart = 0
    for (let i = 0; i <= STEPS; i++) {
      const t = lerp(i, 0, STEPS, tStart, tEnd)
      const env = A_C + mu * Math.cos(2 * Math.PI * FM * t)
      if (env < 0 && !inFlip) {
        inFlip = true
        segStart = xt(t)
      } else if (env >= 0 && inFlip) {
        inFlip = false
        ctx.fillRect(segStart, y0 + PAD_Y + 6, xt(t) - segStart, ph - PAD_Y * 2 - 6)
      }
    }
    if (inFlip) ctx.fillRect(segStart, y0 + PAD_Y + 6, xt(tEnd) - segStart, ph - PAD_Y * 2 - 6)
  }

  // Signed envelope (faint dashed)
  ctx.strokeStyle = COLOR_SIGNED
  ctx.lineWidth = 1.1
  ctx.setLineDash([3, 4])
  for (const sign of [1, -1]) {
    ctx.beginPath()
    const STEPS = 300
    for (let i = 0; i <= STEPS; i++) {
      const t = lerp(i, 0, STEPS, tStart, tEnd)
      const signedEnv = sign * (A_C + mu * Math.cos(2 * Math.PI * FM * t))
      const px = xt(t)
      const py = yv(signedEnv)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }
  ctx.setLineDash([])

  // x(t) itself
  ctx.strokeStyle = COLOR_RECOVERED
  ctx.lineWidth = 1.3
  ctx.beginPath()
  const STEPS = 1400
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

  // Phase-reversal markers — small ⤴ wherever A_c + m(t) crosses 0
  if (mu > 1) {
    ctx.fillStyle = COLOR_ERROR
    ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    const STEPS = 800
    let prevEnv = A_C + mu * Math.cos(2 * Math.PI * FM * tStart)
    for (let i = 1; i <= STEPS; i++) {
      const t = lerp(i, 0, STEPS, tStart, tEnd)
      const env = A_C + mu * Math.cos(2 * Math.PI * FM * t)
      if (Math.sign(env) !== Math.sign(prevEnv)) {
        ctx.fillText('↺', xt(t), y0 + PAD_Y + 10)
      }
      prevEnv = env
    }
  }

  drawYLabel(ctx, colors, x0, yv(1.5), 'x(t)')
}

function drawEnvelopeComparison(
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
  const PAD_X = 56
  const PAD_Y = 10
  const yLim = 2.4
  const { tStart, tEnd } = tBounds(tNow)
  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('② A_c + m(t) (violet) vs |A_c + m(t)| (μπλε) — η αναδίπλωση', x0 + PAD_X, y0 + 12)

  // baseline at 0
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  // A_c DC line
  ctx.strokeStyle = COLOR_DC
  ctx.setLineDash([2, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yv(A_C))
  ctx.lineTo(x0 + pw - PAD_X, yv(A_C))
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = COLOR_DC
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('A_c', x0 + PAD_X - 4, yv(A_C) + 3)

  const STEPS = 600

  // Shade fold-over zones: where signed < 0 and |.| ≠ signed
  if (mu > 1) {
    ctx.fillStyle = 'rgba(220, 38, 38, 0.10)'
    let inFlip = false
    let segStart = 0
    for (let i = 0; i <= STEPS; i++) {
      const t = lerp(i, 0, STEPS, tStart, tEnd)
      const signed = A_C + mu * Math.cos(2 * Math.PI * FM * t)
      if (signed < 0 && !inFlip) {
        inFlip = true
        segStart = xt(t)
      } else if (signed >= 0 && inFlip) {
        inFlip = false
        ctx.fillRect(segStart, y0 + PAD_Y + 6, xt(t) - segStart, ph - PAD_Y * 2 - 6)
      }
    }
    if (inFlip) ctx.fillRect(segStart, y0 + PAD_Y + 6, xt(tEnd) - segStart, ph - PAD_Y * 2 - 6)
  }

  // signed A_c + m(t)
  ctx.strokeStyle = COLOR_SIGNED
  ctx.lineWidth = 1.6
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const signed = A_C + mu * Math.cos(2 * Math.PI * FM * t)
    const px = xt(t)
    const py = yv(signed)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // |A_c + m(t)| output
  ctx.strokeStyle = COLOR_RECOVERED
  ctx.lineWidth = 1.8
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const env = Math.abs(A_C + mu * Math.cos(2 * Math.PI * FM * t))
    const px = xt(t)
    const py = yv(env)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  drawYLabel(ctx, colors, x0, y0 + ph / 2, 'env')
}

function drawRecoveredVsTrue(
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
  const PAD_X = 56
  const PAD_Y = 10
  const yLim = 2.4
  const { tStart, tEnd } = tBounds(tNow)
  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('③ m̂(t) = |A_c + m(t)| − A_c  (μπλε) vs αληθινό m(t) (πορτοκαλί)', x0 + PAD_X, y0 + 12)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  const STEPS = 600

  // Fill the error band between true m and recovered m̂
  ctx.fillStyle = 'rgba(220, 38, 38, 0.20)'
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const mHat = Math.abs(A_C + mu * Math.cos(2 * Math.PI * FM * t)) - A_C
    const px = xt(t)
    const py = yv(mHat)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  for (let i = STEPS; i >= 0; i--) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const m = mu * Math.cos(2 * Math.PI * FM * t)
    ctx.lineTo(xt(t), yv(m))
  }
  ctx.closePath()
  ctx.fill()

  // Recovered m̂(t)
  ctx.strokeStyle = COLOR_RECOVERED
  ctx.lineWidth = 1.7
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const mHat = Math.abs(A_C + mu * Math.cos(2 * Math.PI * FM * t)) - A_C
    const px = xt(t)
    const py = yv(mHat)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // True m(t)
  ctx.strokeStyle = COLOR_MSG
  ctx.lineWidth = 1.4
  ctx.setLineDash([4, 3])
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const m = mu * Math.cos(2 * Math.PI * FM * t)
    const px = xt(t)
    const py = yv(m)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.setLineDash([])

  drawYLabel(ctx, colors, x0, y0 + ph / 2, 'm̂ vs m')
}

function drawYLabel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y: number,
  label: string,
) {
  if (!colors) return
  ctx.save()
  ctx.translate(x0 + 14, y)
  ctx.rotate(-Math.PI / 2)
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(label, 0, 0)
  ctx.restore()
}
