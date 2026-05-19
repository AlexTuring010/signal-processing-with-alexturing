'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Flagship convolution viz.
 *
 *   Top:    x(τ)                                — static, the input signal
 *   Mid:    h(t − τ)                            — flipped+shifted impulse response, slides as t advances
 *   Mid':   x(τ) · h(t − τ)                     — the integrand, with the area under it = y(t)
 *   Bottom: y(t) being painted in as t sweeps
 *
 * All four panels share the same horizontal axis (range over τ for the top
 * three; same range remapped to t for the bottom). A scrub bar binds them all
 * together. A small set of presets lets the reader switch between the
 * canonical signal pairs.
 */

type FnSpec = { fn: (t: number) => number; label: string }

type Preset = {
  id: string
  label: string
  blurb: string
  x: FnSpec
  h: FnSpec
}

const PRESETS: Preset[] = [
  {
    id: 'rect-rect',
    label: 'Δύο ορθογώνια',
    blurb: 'Π(τ − 0.5) ⊛ Π(τ − 0.5) → τρίγωνο πλάτους 2.',
    x: { fn: (t) => (t >= 0 && t <= 1 ? 1 : 0), label: 'Π(τ − 0.5)' },
    h: { fn: (t) => (t >= 0 && t <= 1 ? 1 : 0), label: 'Π(τ − 0.5)' },
  },
  {
    id: 'rect-tri',
    label: 'Ορθογώνιο ⊛ τρίγωνο',
    blurb: 'Το παράδειγμα της διάλεξης.',
    x: { fn: (t) => (t >= 0 && t <= 1 ? 1 : 0), label: 'Π(τ − 0.5)' },
    h: { fn: (t) => (t >= 0 && t <= 1 ? 1 - Math.abs(2 * (t - 0.5)) : 0), label: 'Λ(τ − 0.5)' },
  },
  {
    id: 'rect-exp',
    label: 'Ορθογώνιο ⊛ RC',
    blurb: 'Σήμα τετραγωνικό μέσα από φίλτρο RC — βλέπεις το charge & discharge.',
    x: { fn: (t) => (t >= 0 && t <= 1 ? 1 : 0), label: 'Π(τ − 0.5)' },
    h: { fn: (t) => (t >= 0 ? Math.exp(-t / 0.4) : 0), label: 'e^(−τ/0.4) u(τ)' },
  },
  {
    id: 'tri-tri',
    label: 'Δύο τρίγωνα',
    blurb: 'Πιο ομαλή έξοδος — αρχίζει να μοιάζει «καμπανάκι».',
    x: { fn: (t) => (t >= 0 && t <= 1 ? 1 - Math.abs(2 * (t - 0.5)) : 0), label: 'Λ(τ − 0.5)' },
    h: { fn: (t) => (t >= 0 && t <= 1 ? 1 - Math.abs(2 * (t - 0.5)) : 0), label: 'Λ(τ − 0.5)' },
  },
]

/**
 * One horizontal coordinate system for ALL FOUR panels. The top three plot
 * functions of τ; the bottom plots y as a function of t. Either way, a
 * vertical line at any value v should hit the same x-pixel in every panel —
 * that's how the viewer mentally connects "shaded area in the product panel
 * at τ-axis position t" with "the dot on y(t)". So we lock to a single
 * range covering the full action across every preset, with a small margin.
 */
const SHARED_RANGE: [number, number] = [-1.0, 3.0]
const N = 480 // resolution along the τ axis
const PLAY_DURATION_S = 8

export function ConvolutionFlipAndSlide() {
  const [presetId, setPresetId] = useState<string>('rect-tri')
  const [t, setT] = useState(0.7)
  const [playing, setPlaying] = useState(false)
  const preset = PRESETS.find((p) => p.id === presetId)!

  const xCanvas = useRef<HTMLCanvasElement | null>(null)
  const hCanvas = useRef<HTMLCanvasElement | null>(null)
  const prodCanvas = useRef<HTMLCanvasElement | null>(null)
  const yCanvas = useRef<HTMLCanvasElement | null>(null)

  // Pre-compute samples of x(τ), h(τ), and the full y(t) curve for this preset.
  const data = useMemo(() => {
    const xs = new Float32Array(N) // x(τ) samples
    const hs = new Float32Array(N) // h(τ) samples
    const tau = new Float32Array(N)
    const dtau = (SHARED_RANGE[1] - SHARED_RANGE[0]) / (N - 1)
    for (let i = 0; i < N; i++) {
      const v = SHARED_RANGE[0] + i * dtau
      tau[i] = v
      xs[i] = preset.x.fn(v)
      hs[i] = preset.h.fn(v)
    }
    // Compute y(t) at a dense grid in SHARED_RANGE via numerical convolution.
    const M = 240
    const tArr = new Float32Array(M)
    const yArr = new Float32Array(M)
    const dtT = (SHARED_RANGE[1] - SHARED_RANGE[0]) / (M - 1)
    for (let m = 0; m < M; m++) {
      const tm = SHARED_RANGE[0] + m * dtT
      tArr[m] = tm
      let sum = 0
      for (let i = 0; i < N; i++) {
        const tauVal = tau[i]
        // h(t - τ) — sample by direct evaluation (fn is cheap)
        const hVal = preset.h.fn(tm - tauVal)
        sum += xs[i] * hVal
      }
      yArr[m] = sum * dtau
    }
    return { xs, hs, tau, dtau, tArr, yArr }
  }, [preset])

  // Animation
  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const speed = (SHARED_RANGE[1] - SHARED_RANGE[0]) / PLAY_DURATION_S
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      setT((cur) => {
        let next = cur + dt * speed
        if (next > SHARED_RANGE[1]) next = SHARED_RANGE[0]
        return next
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  // Draw all four panels whenever t or preset changes.
  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (xCanvas.current) drawX(xCanvas.current, colors, data.tau, data.xs, t)
    if (hCanvas.current) drawHFlipped(hCanvas.current, colors, data.tau, preset.h.fn, t)
    if (prodCanvas.current)
      drawProduct(prodCanvas.current, colors, data.tau, data.xs, preset.h.fn, t)
    if (yCanvas.current) drawY(yCanvas.current, colors, data.tArr, data.yArr, t)
  }, [data, preset, t])

  const stepT = (dir: 1 | -1) => {
    const step = 0.05
    setT((cur) => {
      const next = cur + dir * step
      if (next < SHARED_RANGE[0]) return SHARED_RANGE[0]
      if (next > SHARED_RANGE[1]) return SHARED_RANGE[1]
      return next
    })
  }

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold tracking-tight">
            Flip-and-slide · y(t) = ∫ x(τ) · h(t − τ) dτ
          </h4>
          <p className="text-xs text-fg-muted">{preset.blurb}</p>
        </div>
        <div
          role="radiogroup"
          aria-label="Επιλογή ζεύγους σημάτων"
          className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
        >
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={presetId === p.id}
              onClick={() => {
                setPresetId(p.id)
                setT(0.7)
              }}
              className={cn(
                'rounded-full px-2 py-0.5 transition-colors',
                presetId === p.id
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:text-fg',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Panel title="x(τ)" subtitle="Είσοδος, στατική">
          <canvas
            ref={xCanvas}
            style={{ height: 90 }}
            className="block h-[90px] w-full"
            aria-label="Input signal x of tau"
          />
        </Panel>
        <Panel title="h(t − τ)" subtitle="Η h αναποδογυρισμένη και ολισθαίνουσα κατά t">
          <canvas
            ref={hCanvas}
            style={{ height: 90 }}
            className="block h-[90px] w-full"
            aria-label="Flipped and shifted impulse response"
          />
        </Panel>
        <Panel title="x(τ) · h(t − τ)" subtitle="Το γινόμενο · η σκιά είναι το τρέχον y(t)">
          <canvas
            ref={prodCanvas}
            style={{ height: 100 }}
            className="block h-[100px] w-full"
            aria-label="Product of x and shifted h, integrand"
          />
        </Panel>
        <Panel title="y(t)" subtitle="Συσσωρεύεται καθώς προχωράει το t">
          <canvas
            ref={yCanvas}
            style={{ height: 110 }}
            className="block h-[110px] w-full"
            aria-label="Output y of t built up by sweeping"
          />
        </Panel>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {playing ? 'Παύση' : 'Παίξε'}
        </button>
        <button
          type="button"
          onClick={() => stepT(-1)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-bg-soft hover:border-accent/50"
          aria-label="Πίσω"
          title="Πίσω"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => stepT(1)}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-bg-soft hover:border-accent/50"
          aria-label="Μπροστά"
          title="Μπροστά"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setT(SHARED_RANGE[0])}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-bg-soft hover:border-accent/50"
          aria-label="Επανεκκίνηση"
          title="Επανεκκίνηση"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
        <span className="ml-2 text-xs text-fg-muted">
          t = <span className="font-mono text-fg tabular-nums">{t.toFixed(2)}</span>
        </span>
      </div>
      <input
        type="range"
        min={SHARED_RANGE[0]}
        max={SHARED_RANGE[1]}
        step={0.01}
        value={t}
        onChange={(e) => setT(parseFloat(e.target.value))}
        className="mt-2 w-full accent-[rgb(var(--accent))]"
        aria-label="Scrub for t"
      />
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
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-3 py-1">
        <span className="text-[11px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

/* ---------------- Drawing helpers ---------------- */

const PAD_X = 18
const PAD_Y = 8

function drawAxes(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  w: number,
  h: number,
  axisRange: [number, number],
) {
  if (!colors) return
  const padX = PAD_X
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padX, h - PAD_Y)
  ctx.lineTo(w - padX, h - PAD_Y)
  ctx.stroke()
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  // Tick marks at integer τ.
  for (let v = Math.ceil(axisRange[0]); v <= Math.floor(axisRange[1]); v++) {
    const x = lerp(v, axisRange[0], axisRange[1], padX, w - padX)
    ctx.fillText(String(v), x, h - 1)
    ctx.strokeStyle = colors.border
    ctx.beginPath()
    ctx.moveTo(x, h - PAD_Y - 2)
    ctx.lineTo(x, h - PAD_Y + 2)
    ctx.stroke()
  }
}

function tToX(tau: number, w: number) {
  return lerp(tau, SHARED_RANGE[0], SHARED_RANGE[1], PAD_X, w - PAD_X)
}

function drawX(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  tau: Float32Array,
  xs: Float32Array,
  t: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  drawAxes(ctx, colors, w, h, SHARED_RANGE)

  let yMax = 0
  for (let i = 0; i < xs.length; i++) if (xs[i] > yMax) yMax = xs[i]
  if (yMax < 1e-6) yMax = 1
  const py = (y: number) => lerp(y, yMax * 1.15, -0.1 * yMax, PAD_Y, h - PAD_Y)

  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i < xs.length; i++) {
    const x = tToX(tau[i], w)
    const y = py(xs[i])
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // Marker for current t.
  const xCur = tToX(t, w)
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(xCur, PAD_Y)
  ctx.lineTo(xCur, h - PAD_Y)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('t', xCur, PAD_Y + 9)
}

function drawHFlipped(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  tau: Float32Array,
  hFn: (t: number) => number,
  t: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  drawAxes(ctx, colors, w, h, SHARED_RANGE)

  // h(t - τ) for each τ
  const ys = new Float32Array(tau.length)
  let yMax = 0
  for (let i = 0; i < tau.length; i++) {
    const v = hFn(t - tau[i])
    ys[i] = v
    if (v > yMax) yMax = v
  }
  if (yMax < 1e-6) yMax = 1

  const py = (y: number) => lerp(y, yMax * 1.15, -0.1 * yMax, PAD_Y, h - PAD_Y)

  ctx.strokeStyle = colors.warn
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i < ys.length; i++) {
    const x = tToX(tau[i], w)
    const y = py(ys[i])
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  const xCur = tToX(t, w)
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(xCur, PAD_Y)
  ctx.lineTo(xCur, h - PAD_Y)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('t', xCur, PAD_Y + 9)
}

function drawProduct(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  tau: Float32Array,
  xs: Float32Array,
  hFn: (t: number) => number,
  t: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  drawAxes(ctx, colors, w, h, SHARED_RANGE)

  const prod = new Float32Array(tau.length)
  let yMax = 0
  for (let i = 0; i < tau.length; i++) {
    const v = xs[i] * hFn(t - tau[i])
    prod[i] = v
    if (Math.abs(v) > yMax) yMax = Math.abs(v)
  }
  if (yMax < 1e-6) yMax = 1
  const py = (y: number) => lerp(y, yMax * 1.15, -0.1 * yMax, PAD_Y, h - PAD_Y)

  // Filled area under the curve.
  const yBaseline = py(0)
  ctx.fillStyle = colors.success
  ctx.globalAlpha = 0.25
  ctx.beginPath()
  ctx.moveTo(tToX(tau[0], w), yBaseline)
  for (let i = 0; i < prod.length; i++) {
    ctx.lineTo(tToX(tau[i], w), py(prod[i]))
  }
  ctx.lineTo(tToX(tau[tau.length - 1], w), yBaseline)
  ctx.closePath()
  ctx.fill()
  ctx.globalAlpha = 1

  // Outline.
  ctx.strokeStyle = colors.success
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i < prod.length; i++) {
    const x = tToX(tau[i], w)
    const y = py(prod[i])
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // "Area = y(t)" label
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('εμβαδό = y(t)', PAD_X + 4, PAD_Y + 9)
}

function drawY(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  tArr: Float32Array,
  yArr: Float32Array,
  t: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  // Use a different axis range — t, not τ.
  const padX = PAD_X
  const padY = PAD_Y
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padX, h - padY)
  ctx.lineTo(w - padX, h - padY)
  ctx.stroke()
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let v = Math.ceil(SHARED_RANGE[0]); v <= Math.floor(SHARED_RANGE[1]); v++) {
    const x = lerp(v, SHARED_RANGE[0], SHARED_RANGE[1], padX, w - padX)
    ctx.fillText(String(v), x, h - 1)
  }

  let yMax = 0
  for (let i = 0; i < yArr.length; i++) if (Math.abs(yArr[i]) > yMax) yMax = Math.abs(yArr[i])
  if (yMax < 1e-6) yMax = 1

  const px = (tt: number) => lerp(tt, SHARED_RANGE[0], SHARED_RANGE[1], padX, w - padX)
  const py = (y: number) => lerp(y, yMax * 1.15, -0.1 * yMax, padY, h - padY)

  // Faint full curve in the background — what y(t) will be.
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  for (let i = 0; i < yArr.length; i++) {
    const x = px(tArr[i])
    const y = py(yArr[i])
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // Solid curve up to current t.
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2.5
  ctx.beginPath()
  let started = false
  for (let i = 0; i < yArr.length; i++) {
    if (tArr[i] > t) break
    const x = px(tArr[i])
    const y = py(yArr[i])
    if (!started) {
      ctx.moveTo(x, y)
      started = true
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()

  // Dot marker at current t.
  // Find nearest precomputed sample.
  let idx = 0
  let bestDiff = Infinity
  for (let i = 0; i < tArr.length; i++) {
    const d = Math.abs(tArr[i] - t)
    if (d < bestDiff) {
      bestDiff = d
      idx = i
    }
  }
  if (started) {
    const x = px(tArr[idx])
    const y = py(yArr[idx])
    ctx.fillStyle = colors.accent
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('y(t)', padX + 4, padY + 9)
}
