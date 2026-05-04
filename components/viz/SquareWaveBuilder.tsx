'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Flagship viz of the Fourier-series chapter.
 *
 * Builds a 50%-duty square pulse from its Fourier series, harmonic by
 * harmonic, in three synced views:
 *
 *   1. Time-domain partial sum (the result we're constructing).
 *   2. Discrete amplitude spectrum — bars for active harmonics highlighted,
 *      inactive ones greyed.
 *   3. Stacked harmonic waveforms — each individual cosine that's being
 *      added in, drawn in its own row. Sums visually toward the partial
 *      sum in panel 1.
 *
 * Interaction:
 *   - Slider for N (number of harmonics included, 0–50).
 *   - Play button animates from N=0 to N=50.
 *   - Gibbs phenomenon flagged when N is high enough.
 *
 * Coefficients: a_k = ½·sinc(k/2). Even non-zero k all vanish, so only odd
 * harmonics contribute. The plan calls for "1, 3, 5, 7, ..." harmonics —
 * we include all integer N up to 50, but in practice even k contribute 0.
 */

const T0 = 1.0
const F0 = 1 / T0
const OMEGA0 = 2 * Math.PI * F0
const N_MAX = 50

function ak(k: number) {
  if (k === 0) return 0.5
  const x = k / 2
  if (Math.abs(x - Math.round(x)) < 1e-9) return 0
  return 0.5 * (Math.sin(Math.PI * x) / (Math.PI * x))
}

function activeKs(N: number): number[] {
  const ks: number[] = [0]
  for (let k = 1; k <= N; k++) ks.push(k, -k)
  return ks
}

// For the stacked view: only show non-zero harmonics, +k pairs (k ≥ 0).
function nonzeroPositiveKs(N: number): number[] {
  const ks: number[] = []
  for (let k = 0; k <= N; k++) {
    if (Math.abs(ak(k)) > 1e-9) ks.push(k)
  }
  return ks
}

export function SquareWaveBuilder() {
  const [N, setN] = useState(7)
  const [playing, setPlaying] = useState(false)
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const specRef = useRef<HTMLCanvasElement | null>(null)
  const stackRef = useRef<HTMLCanvasElement | null>(null)
  const animRef = useRef<number | null>(null)

  const ks = useMemo(() => activeKs(N), [N])
  const stackKs = useMemo(() => nonzeroPositiveKs(Math.max(N, 1)), [N])

  // Animation: tick N up to N_MAX.
  useEffect(() => {
    if (!playing) return
    let lastTime = performance.now()
    const tick = (now: number) => {
      const dt = now - lastTime
      if (dt > 220) {
        // ~4-5 harmonics per second
        lastTime = now
        setN((cur) => {
          if (cur >= N_MAX) {
            setPlaying(false)
            return cur
          }
          return cur + 1
        })
      }
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [playing])

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawPartialSum(timeRef.current, colors, ks, N)
    if (specRef.current) drawSpectrum(specRef.current, colors, N)
    if (stackRef.current) drawStack(stackRef.current, colors, stackKs)
  }, [ks, stackKs, N])

  const gibbsActive = N >= 11

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold tracking-tight">
            Τετραγωνικός παλμός χτίζεται από αρμονικές
          </h4>
          <p className="text-xs text-fg-muted">
            Πρόσθεσε αρμονικές μία-μία και δες πώς το άθροισμα συγκλίνει στον παλμό.
            Τρεις συγχρονισμένες όψεις: μερικό άθροισμα στον χρόνο, διακριτό
            φάσμα, και κάθε αρμονική ξεχωριστά στοιβαγμένη.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              playing
                ? 'border-accent bg-accent text-accent-fg'
                : 'border-border bg-bg-soft text-fg hover:border-accent/50',
            )}
            aria-pressed={playing}
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? 'Παύση' : 'Play'}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false)
              setN(0)
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-soft px-3 py-1 text-xs font-medium text-fg hover:border-accent/50"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
        <Panel title="Στον χρόνο — μερικό άθροισμα" subtitle={`N = ${N} αρμονικές · στόχος: τετράγωνο`}>
          <canvas
            ref={timeRef}
            style={{ height: 220 }}
            className="block h-[220px] w-full"
            aria-label="Partial sum approaching square wave"
          />
        </Panel>
        <Panel title="|aₖ| φάσμα" subtitle="ενεργές αρμονικές = έγχρωμες">
          <canvas
            ref={specRef}
            style={{ height: 220 }}
            className="block h-[220px] w-full"
            aria-label="Discrete amplitude spectrum"
          />
        </Panel>
      </div>

      <div className="mt-3" />

      <Panel title="Κάθε αρμονική ξεχωριστά" subtitle="το άθροισμά τους χτίζει το πάνω panel">
        <canvas
          ref={stackRef}
          style={{ height: 320 }}
          className="block h-[320px] w-full"
          aria-label="Stacked harmonic waveforms"
        />
      </Panel>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          N ={' '}
          <span className="font-mono text-fg tabular-nums">{N}</span>
          <span className="ml-2 text-fg-subtle">(αρμονικές μέχρι ±N)</span>
        </label>
        <input
          type="range"
          min={0}
          max={N_MAX}
          step={1}
          value={N}
          onChange={(e) => {
            setPlaying(false)
            setN(parseInt(e.target.value))
          }}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Number of harmonics N"
        />
      </div>

      {gibbsActive && (
        <div className="mt-3 rounded-md border border-warn/50 bg-warn/10 px-3 py-2 text-xs text-warn">
          <strong>Gibbs phenomenon:</strong> πρόσεξε τα μικρά «αυτάκια»
          overshoot/undershoot στις άκρες του τετραγώνου. <strong>Δεν φεύγουν
          ποτέ</strong> όσο κι αν αυξήσεις το N — απλώς γίνονται πιο στενά.
          Έχουν σταθερό ύψος ≈ 9% του βήματος.
        </div>
      )}
    </figure>
  )
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-3 py-1.5">
        <span className="text-[11px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

const PAD_X = 28
const PAD_Y = 14

function pulseValue(t: number) {
  const tw = ((t + T0 / 2) % T0 + T0) % T0 - T0 / 2
  return Math.abs(tw) < T0 / 4 ? 1 : 0
}

function drawPartialSum(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  ks: number[],
  N: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const tStart = -1.5 * T0
  const tEnd = 1.5 * T0
  const yLim = 1.4

  const xt = (t: number) => lerp(t, tStart, tEnd, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -0.3, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()

  // Target pulse (faint).
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1.2
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  let prevY = yv(pulseValue(tStart))
  ctx.moveTo(PAD_X, prevY)
  const stepsP = 600
  for (let i = 1; i <= stepsP; i++) {
    const t = lerp(i, 0, stepsP, tStart, tEnd)
    const v = pulseValue(t)
    const x = xt(t)
    const y = yv(v)
    if (Math.abs(y - prevY) > 0.5) ctx.lineTo(x, prevY)
    ctx.lineTo(x, y)
    prevY = y
  }
  ctx.stroke()
  ctx.setLineDash([])

  // Partial sum (highlighted).
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2.5
  ctx.beginPath()
  const stepsS = 720
  for (let i = 0; i <= stepsS; i++) {
    const t = lerp(i, 0, stepsS, tStart, tEnd)
    let s = 0
    for (const k of ks) s += ak(k) * Math.cos(k * OMEGA0 * t)
    const x = xt(t)
    const y = yv(s)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // Ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('1', PAD_X - 3, yv(1) + 3)
  ctx.fillText('0', PAD_X - 3, yZero + 3)
  ctx.textAlign = 'center'
  ctx.fillText('−T₀', xt(-T0), h - 1)
  ctx.fillText('0', xt(0), h - 1)
  ctx.fillText('+T₀', xt(T0), h - 1)

  // Title overlay.
  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'left'
  ctx.fillText(`N = ${N}`, PAD_X + 6, PAD_Y + 12)
}

function drawSpectrum(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  N: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const K_DRAW = Math.max(11, N)
  const fMax = (K_DRAW + 1) * F0
  const fMin = -fMax
  const yMax = 0.6

  const xt = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.05, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()

  // sinc envelope.
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  const STEPS = 300
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const x = f / (2 * F0)
    const env = Math.abs(0.5 * (x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x)))
    const xPx = xt(f)
    const yPx = yv(env)
    if (i === 0) ctx.moveTo(xPx, yPx)
    else ctx.lineTo(xPx, yPx)
  }
  ctx.stroke()
  ctx.setLineDash([])

  for (let k = -K_DRAW; k <= K_DRAW; k++) {
    const a = Math.abs(ak(k))
    if (a < 1e-9) continue
    const f = k * F0
    const x = xt(f)
    const y = yv(a)
    const active = Math.abs(k) <= N
    ctx.strokeStyle = active ? colors.accent : colors.border
    ctx.lineWidth = active ? 2 : 1.2
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.fillStyle = active ? colors.accent : colors.fgMuted
    ctx.beginPath()
    ctx.arc(x, y, active ? 3 : 2, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const kf of [-9, -5, -1, 1, 5, 9]) {
    const x = xt(kf * F0)
    if (Math.abs(kf) <= K_DRAW) ctx.fillText(`${kf}f₀`, x, h - 1)
  }
  ctx.textAlign = 'right'
  ctx.fillText('0.5', PAD_X - 3, yv(0.5) + 3)
}

function drawStack(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  ks: number[],
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  if (ks.length === 0) return

  const tStart = -1.5 * T0
  const tEnd = 1.5 * T0
  const xt = (t: number) => lerp(t, tStart, tEnd, PAD_X + 32, w - PAD_X)

  // Decide how many rows to show. Up to 9 row "slices".
  const visible = ks.slice(0, 9)
  const rowH = (h - 2 * PAD_Y) / Math.max(visible.length, 1)
  const half = rowH * 0.4

  for (let row = 0; row < visible.length; row++) {
    const k = visible[row]
    const yMid = PAD_Y + row * rowH + rowH / 2

    // Row baseline
    ctx.strokeStyle = colors.border
    ctx.setLineDash([1, 3])
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(PAD_X + 32, yMid)
    ctx.lineTo(w - PAD_X, yMid)
    ctx.stroke()
    ctx.setLineDash([])

    // Label on the left
    ctx.fillStyle = colors.fgMuted
    ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'right'
    if (k === 0) ctx.fillText('DC', PAD_X + 26, yMid + 4)
    else ctx.fillText(`k=${k}`, PAD_X + 26, yMid + 4)

    // Scale: max visible amplitude is the largest |a_k| among shown rows
    const ampScale = 0.5 // use a fixed reference (largest is a_0 = 0.5 or 2·a_1 = 2/π)
    const a = ak(k)
    // Synthesis contribution if k=0: just a_0 (a constant). If k>0: a_k cos(kω₀t) + a_{-k} cos(-kω₀t) = 2 a_k cos(kω₀t).
    const amp = k === 0 ? a : 2 * a

    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 1.6
    ctx.beginPath()
    const N = 200
    for (let i = 0; i <= N; i++) {
      const t = lerp(i, 0, N, tStart, tEnd)
      const v = amp * (k === 0 ? 1 : Math.cos(k * OMEGA0 * t))
      const x = xt(t)
      const y = yMid - (v / ampScale) * half
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Amplitude readout
    ctx.fillStyle = colors.fgSubtle
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`amp ≈ ${amp.toFixed(3)}`, w - PAD_X - 90, yMid - half - 2)
  }

  // Tip if we've truncated.
  if (ks.length > visible.length) {
    ctx.fillStyle = colors.fgMuted
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(
      `…και ${ks.length - visible.length} ακόμα μη-μηδενικές αρμονικές (κάθε μία πιο μικρή)`,
      w / 2,
      h - 2,
    )
  }
}
