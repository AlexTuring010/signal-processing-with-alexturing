'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, KeyRound } from 'lucide-react'
import { getThemeColors, setupCanvas } from '@/lib/canvas'
import { cn } from '@/lib/utils'
import { InlineMath } from '@/components/math'

type Colors = NonNullable<ReturnType<typeof getThemeColors>>

/**
 * Π(τ−0.5) ⊛ Π(τ−0.5) → triangle, built as a *breakpoint-finding tutor*.
 *
 *   x(τ)      = 1 on [0, 1]                       — static
 *   h(t − τ)  = 1 on [t−1, t]                     — sliding window
 *   y(t)      = length of the overlap [0,1] ∩ [t−1, t]
 *
 * The generic flip-and-slide viz shows the mechanics for any pair. The whole
 * point HERE is different: teach the reader to spot the *critical t values*
 * (breakpoints) where the integral formula changes. Those happen exactly when
 * a MOVING edge of the window (τ = t−1 or τ = t) crosses a FIXED edge of the
 * static rect (τ = 0 or τ = 1). So every panel labels all four edges, the
 * scrub snaps to the three breakpoints t ∈ {0, 1, 2}, and the info box names
 * the edge-crossing that bounds the current phase.
 *
 * Colours: getThemeColors() returns `rgb(...)` strings, so we use ctx.globalAlpha
 * for translucency (never hex-alpha concatenation, which would be invalid here).
 */

const RANGE: [number, number] = [-1.0, 3.0]
const N = 480

/** Overlap interval of the static support [0,1] with the window [t−1, t]. */
function overlap(t: number): [number, number] | null {
  const lo = Math.max(0, t - 1)
  const hi = Math.min(1, t)
  return hi > lo ? [lo, hi] : null
}
function yAnalytic(t: number): number {
  const ov = overlap(t)
  return ov ? ov[1] - ov[0] : 0
}

type Phase = {
  id: 'pre' | 'a' | 'b' | 'post'
  label: string
  range: [number, number]
  formula: string
  blurb: string
}

const PHASES: Phase[] = [
  {
    id: 'pre',
    label: 'Πριν',
    range: [-Infinity, 0],
    formula: 'y(t) = 0',
    blurb: 'Το ολισθαίνον ορθογώνιο [t−1, t] είναι ακόμα εντελώς αριστερά του [0, 1]. Καμία επικάλυψη.',
  },
  {
    id: 'a',
    label: 'Φάση Α',
    range: [0, 1],
    formula: 'y(t) = \\int_{0}^{t} 1\\,d\\tau = t',
    blurb:
      'Η μπροστινή ακμή (τ = t) μπήκε στο [0, 1], αλλά η πίσω ακμή (τ = t−1) είναι ακόμα αριστερά του 0. Η επικάλυψη είναι το [0, t], μήκους t — μεγαλώνει.',
  },
  {
    id: 'b',
    label: 'Φάση Β',
    range: [1, 2],
    formula: 'y(t) = \\int_{t-1}^{1} 1\\,d\\tau = 2 - t',
    blurb:
      'Η μπροστινή ακμή βγήκε δεξιά του 1· τώρα η πίσω ακμή (τ = t−1) σαρώνει μέσα στο [0, 1]. Η επικάλυψη είναι το [t−1, 1], μήκους 2−t — μικραίνει.',
  },
  {
    id: 'post',
    label: 'Μετά',
    range: [2, Infinity],
    formula: 'y(t) = 0',
    blurb: 'Η πίσω ακμή πέρασε δεξιά του 1. Τα δύο ορθογώνια ξεχώρισαν — καμία επικάλυψη.',
  },
]

function currentPhase(t: number): Phase {
  for (const p of PHASES) if (t >= p.range[0] && t < p.range[1]) return p
  return PHASES[PHASES.length - 1]
}

const BREAKPOINTS: { t: number; text: string }[] = [
  {
    t: 0,
    text: 'η μπροστινή ακμή (τ = t) συναντά την αριστερή ακμή του σταθερού (τ = 0) — αρχίζει η επικάλυψη.',
  },
  {
    t: 1,
    text: 'η μπροστινή ακμή φτάνει το 1 ενώ ταυτόχρονα η πίσω ακμή (τ = t−1) φτάνει το 0 — η επικάλυψη γεμίζει πλήρως (κορυφή) κι ο τύπος αλλάζει από t σε 2−t.',
  },
  {
    t: 2,
    text: 'η πίσω ακμή (τ = t−1) συναντά τη δεξιά ακμή του σταθερού (τ = 1) — τέλος της επικάλυψης.',
  },
]

const PLAY_DURATION_S = 9

export function RectRectConvolutionViz() {
  const [t, setT] = useState(0.5)
  const [playing, setPlaying] = useState(false)

  const xCanvas = useRef<HTMLCanvasElement | null>(null)
  const hCanvas = useRef<HTMLCanvasElement | null>(null)
  const prodCanvas = useRef<HTMLCanvasElement | null>(null)
  const yCanvas = useRef<HTMLCanvasElement | null>(null)

  const data = useMemo(() => {
    const tau = new Float32Array(N)
    const xs = new Float32Array(N)
    const dtau = (RANGE[1] - RANGE[0]) / (N - 1)
    for (let i = 0; i < N; i++) {
      const v = RANGE[0] + i * dtau
      tau[i] = v
      xs[i] = v >= 0 && v <= 1 ? 1 : 0
    }
    const M = 240
    const tArr = new Float32Array(M)
    const yArr = new Float32Array(M)
    const dt = (RANGE[1] - RANGE[0]) / (M - 1)
    for (let m = 0; m < M; m++) {
      const tm = RANGE[0] + m * dt
      tArr[m] = tm
      yArr[m] = yAnalytic(tm)
    }
    return { tau, xs, tArr, yArr }
  }, [])

  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const speed = (RANGE[1] - RANGE[0]) / PLAY_DURATION_S
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      setT((cur) => {
        let next = cur + dt * speed
        if (next > RANGE[1]) next = RANGE[0]
        return next
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (xCanvas.current) drawX(xCanvas.current, colors, data.tau, data.xs)
    if (hCanvas.current) drawHWindow(hCanvas.current, colors, t)
    if (prodCanvas.current) drawProduct(prodCanvas.current, colors, t)
    if (yCanvas.current) drawY(yCanvas.current, colors, data.tArr, data.yArr, t)
  }, [data, t])

  const phase = currentPhase(t)
  const nearBreakpoint = BREAKPOINTS.find((b) => Math.abs(b.t - t) < 0.04)

  const stepT = (dir: 1 | -1) => {
    setT((cur) => {
      const next = cur + dir * 0.1
      if (next < RANGE[0]) return RANGE[0]
      if (next > RANGE[1]) return RANGE[1]
      return next
    })
  }

  const phaseColor =
    phase.id === 'a' ? 'border-emerald-500' : phase.id === 'b' ? 'border-amber-500' : 'border-fg-subtle/40'

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold tracking-tight">
            Π(τ−0.5) ∗ Π(τ−0.5) · βρες τα κρίσιμα t
          </h4>
          <p className="text-xs text-fg-muted">
            Σύρε το <InlineMath>t</InlineMath>. Το <span className="font-mono">y(t)</span> είναι απλώς το{' '}
            <strong>μήκος της επικάλυψης</strong> των δύο ορθογωνίων.
          </p>
        </div>
        <div
          role="radiogroup"
          aria-label="Άλμα σε φάση"
          className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
        >
          {PHASES.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={phase.id === p.id}
              onClick={() => {
                setPlaying(false)
                if (p.id === 'pre') setT(-0.4)
                else if (p.id === 'a') setT(0.5)
                else if (p.id === 'b') setT(1.5)
                else setT(2.4)
              }}
              className={cn(
                'rounded-full px-2 py-0.5 transition-colors',
                phase.id === p.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Panel title="x(τ)" subtitle="Στατικό — ορθογώνιο στο [0, 1]">
          <canvas ref={xCanvas} style={{ height: 80 }} className="block h-[80px] w-full" aria-label="x of tau" />
        </Panel>
        <Panel title="h(t − τ)" subtitle="Αναποδογυρισμένο + ολισθαίνον παράθυρο [t−1, t]">
          <canvas
            ref={hCanvas}
            style={{ height: 90 }}
            className="block h-[90px] w-full"
            aria-label="flipped shifted window"
          />
        </Panel>
        <Panel title="x(τ) · h(t − τ)" subtitle="Επικάλυψη — το εμβαδό της είναι το y(t)">
          <canvas ref={prodCanvas} style={{ height: 90 }} className="block h-[90px] w-full" aria-label="overlap" />
        </Panel>
        <Panel title="y(t)" subtitle="Τρίγωνο · κάθε φάση = διαφορετικό ευθύγραμμο κομμάτι">
          <canvas ref={yCanvas} style={{ height: 120 }} className="block h-[120px] w-full" aria-label="y of t" />
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
          onClick={() => {
            setT(0.5)
            setPlaying(false)
          }}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border bg-bg-soft hover:border-accent/50"
          aria-label="Επαναφορά"
          title="Επαναφορά"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
        <input
          type="range"
          min={RANGE[0]}
          max={RANGE[1]}
          step={0.02}
          value={t}
          onChange={(e) => setT(parseFloat(e.target.value))}
          className="flex-1 accent-accent"
          aria-label="t scrub"
        />
        <div className="rounded-full border border-border bg-bg-soft px-2.5 py-0.5 text-[11px] tabular-nums">
          t = {t.toFixed(2)}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="text-fg-subtle">Κρίσιμα t (breakpoints):</span>
        {BREAKPOINTS.map((b) => (
          <button
            key={b.t}
            type="button"
            onClick={() => {
              setPlaying(false)
              setT(b.t)
            }}
            className={cn(
              'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono tabular-nums transition-colors',
              Math.abs(b.t - t) < 0.04
                ? 'border-accent bg-accent/10 text-fg'
                : 'border-border bg-bg-soft text-fg-muted hover:border-accent/50 hover:text-fg',
            )}
          >
            <KeyRound className="h-3 w-3" aria-hidden="true" />t = {b.t}
          </button>
        ))}
      </div>

      <div className={cn('mt-3 rounded-md border-l-4 bg-bg-soft p-3 text-xs', phaseColor)}>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
          {phase.label}
          {phase.range[0] !== -Infinity && phase.range[1] !== Infinity
            ? ` · t ∈ [${phase.range[0]}, ${phase.range[1]}]`
            : ''}
        </span>
        <div className="mt-1.5 overflow-x-auto">
          <InlineMath>{phase.formula}</InlineMath>
        </div>
        <p className="mt-1.5 text-fg-muted">{phase.blurb}</p>
        {nearBreakpoint && (
          <p className="mt-2 flex items-start gap-1.5 rounded border border-accent/40 bg-accent/10 p-2 text-fg">
            <KeyRound className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
            <span>
              <strong>Breakpoint t = {nearBreakpoint.t}:</strong> {nearBreakpoint.text}
            </span>
          </p>
        )}
      </div>

      <figcaption className="mt-3 text-[11px] text-fg-subtle">
        Κάθε breakpoint είναι μια στιγμή που μια <em>κινούμενη</em> ακμή του παραθύρου (τ = t−1 ή τ = t) περνάει
        πάνω από μια <em>σταθερή</em> ακμή του x (τ = 0 ή τ = 1). Βρες αυτά τα t πρώτα — εκεί αλλάζει ο τύπος —
        και μετά γράψε το ολοκλήρωμα σε κάθε ενδιάμεσο διάστημα.
      </figcaption>
    </figure>
  )
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded border border-border/60 bg-bg-soft/40 p-2">
      <div className="mb-1 flex items-baseline justify-between gap-2 px-1">
        <span className="text-[11px] font-medium tracking-tight text-fg">{title}</span>
        {subtitle && <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>}
      </div>
      {children}
    </div>
  )
}

const PAD_X = 22
const PAD_Y = 12

function xToPx(width: number, tau: number): number {
  return PAD_X + ((tau - RANGE[0]) / (RANGE[1] - RANGE[0])) * (width - 2 * PAD_X)
}
function valToPx(height: number, v: number, vMin: number, vMax: number): number {
  return PAD_Y + ((vMax - v) / (vMax - vMin)) * (height - 2 * PAD_Y)
}

function drawAxis(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: Colors,
  vMin: number,
  vMax: number,
) {
  const y0 = valToPx(height, 0, vMin, vMax)
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, y0)
  ctx.lineTo(width - PAD_X, y0)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  for (let k = Math.ceil(RANGE[0]); k <= Math.floor(RANGE[1]); k++) {
    const px = xToPx(width, k)
    ctx.beginPath()
    ctx.moveTo(px, y0 - 3)
    ctx.lineTo(px, y0 + 3)
    ctx.stroke()
    ctx.fillText(String(k), px, y0 + 5)
  }
}

/** Dashed vertical guide (translucent) with an optional full-opacity label on top. */
function vGuide(
  ctx: CanvasRenderingContext2D,
  height: number,
  px: number,
  color: string,
  label?: string,
  alpha = 0.55,
) {
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.strokeStyle = color
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(px, PAD_Y)
  ctx.lineTo(px, height - PAD_Y)
  ctx.stroke()
  ctx.restore()
  if (label) {
    ctx.fillStyle = color
    ctx.font = '10px ui-sans-serif, system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(label, px, PAD_Y - 1)
  }
}

function drawX(canvas: HTMLCanvasElement, colors: Colors, tau: Float32Array, xs: Float32Array) {
  const { ctx, w: width, h: height } = setupCanvas(canvas)
  ctx.clearRect(0, 0, width, height)
  const vMin = -0.4
  const vMax = 1.4
  drawAxis(ctx, width, height, colors, vMin, vMax)

  // Fill under the static rect.
  ctx.save()
  ctx.globalAlpha = 0.18
  ctx.fillStyle = colors.accent
  ctx.beginPath()
  ctx.moveTo(xToPx(width, RANGE[0]), valToPx(height, 0, vMin, vMax))
  for (let i = 0; i < tau.length; i++) {
    ctx.lineTo(xToPx(width, tau[i]), valToPx(height, xs[i], vMin, vMax))
  }
  ctx.lineTo(xToPx(width, RANGE[1]), valToPx(height, 0, vMin, vMax))
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  // Outline.
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.8
  ctx.beginPath()
  for (let i = 0; i < tau.length; i++) {
    const px = xToPx(width, tau[i])
    const py = valToPx(height, xs[i], vMin, vMax)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // The fixed edges — the things the moving edges will cross.
  vGuide(ctx, height, xToPx(width, 0), colors.accent, '0', 0.6)
  vGuide(ctx, height, xToPx(width, 1), colors.accent, '1', 0.6)

  ctx.fillStyle = colors.fg
  ctx.font = '10px ui-sans-serif, system-ui'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('1', xToPx(width, 0) + 4, valToPx(height, 1, vMin, vMax) - 2)
}

function drawHWindow(canvas: HTMLCanvasElement, colors: Colors, t: number) {
  const { ctx, w: width, h: height } = setupCanvas(canvas)
  ctx.clearRect(0, 0, width, height)
  const vMin = -0.4
  const vMax = 1.4
  drawAxis(ctx, width, height, colors, vMin, vMax)

  // The sliding window [t−1, t] at height 1.
  const from = Math.max(t - 1, RANGE[0])
  const to = Math.min(t, RANGE[1])
  if (to > from) {
    const x0 = xToPx(width, from)
    const x1 = xToPx(width, to)
    const yb = valToPx(height, 0, vMin, vMax)
    const yv = valToPx(height, 1, vMin, vMax)
    ctx.save()
    ctx.globalAlpha = 0.16
    ctx.fillStyle = colors.warn
    ctx.fillRect(x0, yv, x1 - x0, yb - yv)
    ctx.restore()
    ctx.strokeStyle = colors.warn
    ctx.lineWidth = 1.8
    ctx.beginPath()
    ctx.moveTo(x0, yb)
    ctx.lineTo(x0, yv)
    ctx.lineTo(x1, yv)
    ctx.lineTo(x1, yb)
    ctx.stroke()
  }

  // Moving edges (warn) — the heart of the breakpoint idea — with the fixed
  // edges (accent, fainter) drawn in the same frame so crossings are visible.
  if (t - 1 > RANGE[0] && t - 1 < RANGE[1]) vGuide(ctx, height, xToPx(width, t - 1), colors.warn, 't−1', 0.8)
  if (t > RANGE[0] && t < RANGE[1]) vGuide(ctx, height, xToPx(width, t), colors.warn, 't', 0.8)
  vGuide(ctx, height, xToPx(width, 0), colors.accent, undefined, 0.3)
  vGuide(ctx, height, xToPx(width, 1), colors.accent, undefined, 0.3)
}

function drawProduct(canvas: HTMLCanvasElement, colors: Colors, t: number) {
  const { ctx, w: width, h: height } = setupCanvas(canvas)
  ctx.clearRect(0, 0, width, height)
  const vMin = -0.4
  const vMax = 1.4
  drawAxis(ctx, width, height, colors, vMin, vMax)

  const yb = valToPx(height, 0, vMin, vMax)
  const yTop = valToPx(height, 1, vMin, vMax)

  // Faint outline of the static rect for reference.
  ctx.save()
  ctx.globalAlpha = 0.4
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1
  ctx.setLineDash([2, 2])
  ctx.beginPath()
  ctx.moveTo(xToPx(width, 0), yb)
  ctx.lineTo(xToPx(width, 0), yTop)
  ctx.lineTo(xToPx(width, 1), yTop)
  ctx.lineTo(xToPx(width, 1), yb)
  ctx.stroke()
  ctx.restore()

  const ov = overlap(t)
  if (ov) {
    const [lo, hi] = ov
    const x0 = xToPx(width, lo)
    const x1 = xToPx(width, hi)
    ctx.save()
    ctx.globalAlpha = 0.4
    ctx.fillStyle = colors.success
    ctx.fillRect(x0, yTop, x1 - x0, yb - yTop)
    ctx.restore()
    ctx.strokeStyle = colors.success
    ctx.lineWidth = 1.8
    ctx.strokeRect(x0, yTop, x1 - x0, yb - yTop)

    ctx.fillStyle = colors.fg
    ctx.font = '10px ui-sans-serif, system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(`μήκος = ${(hi - lo).toFixed(2)}`, (x0 + x1) / 2, yb + 3)
  }

  ctx.fillStyle = colors.fg
  ctx.font = '11px ui-sans-serif, system-ui'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'top'
  ctx.fillText(`εμβαδό = y(t) = ${yAnalytic(t).toFixed(2)}`, width - PAD_X - 2, PAD_Y - 2)
}

function drawY(
  canvas: HTMLCanvasElement,
  colors: Colors,
  tArr: Float32Array,
  yArr: Float32Array,
  tNow: number,
) {
  const { ctx, w: width, h: height } = setupCanvas(canvas)
  ctx.clearRect(0, 0, width, height)
  const vMin = -0.25
  const vMax = 1.3
  drawAxis(ctx, width, height, colors, vMin, vMax)

  // Phase backgrounds (8-digit hex literals are valid; theme-independent tints).
  const bg: { from: number; to: number; color: string }[] = [
    { from: 0, to: 1, color: '#10b98114' },
    { from: 1, to: 2, color: '#f59e0b14' },
  ]
  for (const p of bg) {
    const x0 = xToPx(width, p.from)
    const x1 = xToPx(width, p.to)
    ctx.fillStyle = p.color
    ctx.fillRect(x0, PAD_Y, x1 - x0, height - 2 * PAD_Y)
  }

  // Breakpoint markers t ∈ {0, 1, 2}.
  ctx.save()
  ctx.globalAlpha = 0.5
  ctx.strokeStyle = colors.fgSubtle
  ctx.setLineDash([2, 2])
  for (const tx of [0, 1, 2]) {
    const px = xToPx(width, tx)
    ctx.beginPath()
    ctx.moveTo(px, PAD_Y)
    ctx.lineTo(px, height - PAD_Y)
    ctx.stroke()
  }
  ctx.restore()

  // Full triangle (faint reference).
  ctx.save()
  ctx.globalAlpha = 0.55
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1.4
  ctx.beginPath()
  for (let i = 0; i < tArr.length; i++) {
    const px = xToPx(width, tArr[i])
    const py = valToPx(height, yArr[i], vMin, vMax)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.restore()

  // Solid curve up to tNow.
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2.2
  ctx.beginPath()
  let started = false
  for (let i = 0; i < tArr.length; i++) {
    if (tArr[i] > tNow) break
    const px = xToPx(width, tArr[i])
    const py = valToPx(height, yArr[i], vMin, vMax)
    if (!started) {
      ctx.moveTo(px, py)
      started = true
    } else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Current dot + value.
  if (tNow >= RANGE[0] && tNow <= RANGE[1]) {
    const yv = yAnalytic(tNow)
    const px = xToPx(width, tNow)
    const py = valToPx(height, yv, vMin, vMax)
    ctx.fillStyle = colors.accent
    ctx.beginPath()
    ctx.arc(px, py, 3.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = colors.fg
    ctx.font = '10px ui-sans-serif, system-ui'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(`y(${tNow.toFixed(2)}) = ${yv.toFixed(2)}`, px + 6, py - 4)
  }

  // Phase formula labels.
  ctx.font = '9px ui-sans-serif, system-ui'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#10b981'
  ctx.fillText('y = t', xToPx(width, 0.5), valToPx(height, 0.5, vMin, vMax) - 6)
  ctx.fillStyle = '#f59e0b'
  ctx.fillText('y = 2 − t', xToPx(width, 1.5), valToPx(height, 0.5, vMin, vMax) - 6)
}
