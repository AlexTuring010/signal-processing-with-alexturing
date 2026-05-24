'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { getThemeColors, setupCanvas } from '@/lib/canvas'
import { cn } from '@/lib/utils'
import { InlineMath } from '@/components/math'

type Colors = NonNullable<ReturnType<typeof getThemeColors>>

/**
 * Άσκηση 4 (slides 8-10): η συνέλιξη του prof's canonical exercise.
 *
 *   x₁(τ) = 1  στο [0, 1]
 *   x₂(τ) = +1 στο [0, 1], −1 στο [1, 2]
 *
 *   y(t) = ∫ x₁(τ) · x₂(t − τ) dτ
 *
 *        ⎧ t            t ∈ [0, 1]
 *        ⎪ 3 − 2t       t ∈ [1, 2]
 *   = ⎨
 *        ⎪ t − 3        t ∈ [2, 3]
 *        ⎩ 0            αλλιώς
 *
 * Why a bespoke viz for this one exercise: the generic flip-and-slide
 * viz shows the geometry, but doesn't *annotate the four phases* — and
 * the prof's pedagogical value is exactly in seeing how the integral
 * limits split into four cases. Here every panel gets a phase-coloured
 * background, the current phase formula is rendered above the scrub
 * bar, and the output panel shows the three line-segments stitched
 * together with the breakpoints marked.
 */

const RANGE: [number, number] = [-1.0, 4.0]
const N = 600

function x1(tau: number): number {
  return tau >= 0 && tau <= 1 ? 1 : 0
}

function x2(tau: number): number {
  if (tau >= 0 && tau <= 1) return 1
  if (tau >= 1 && tau <= 2) return -1
  return 0
}

type Phase = {
  id: 'pre' | 'a' | 'b' | 'c' | 'post'
  label: string
  range: [number, number]
  formula: string
  color: string // hue suffix
  blurb: string
}

const PHASES: Phase[] = [
  {
    id: 'pre',
    label: 'Πριν',
    range: [-Infinity, 0],
    formula: 'y(t) = 0',
    color: 'fg-subtle',
    blurb: 'Δεν υπάρχει επικάλυψη — το x₂(t−τ) είναι εντελώς αριστερά του x₁(τ).',
  },
  {
    id: 'a',
    label: 'Φάση Α',
    range: [0, 1],
    formula: 'y(t) = \\int_{0}^{t} 1\\,d\\kappa = t',
    color: 'emerald',
    blurb:
      'Μόνο το θετικό μισό του x₂ μπαίνει στο παράθυρο [0, 1] του x₁. Το γινόμενο είναι +1 πάνω σε διάστημα μήκους t.',
  },
  {
    id: 'b',
    label: 'Φάση Β',
    range: [1, 2],
    formula: 'y(t) = \\int_{t-1}^{1} 1\\,d\\kappa + \\int_{1}^{t}(-1)\\,d\\kappa = 3 - 2t',
    color: 'amber',
    blurb:
      'Τώρα και τα δύο μισά του x₂ (θετικό + αρνητικό) επικαλύπτονται με το x₁. Οι συνεισφορές αλληλοαναιρούνται μερικώς — η y(t) κατεβαίνει γρήγορα.',
  },
  {
    id: 'c',
    label: 'Φάση Γ',
    range: [2, 3],
    formula: 'y(t) = \\int_{t-1}^{2}(-1)\\,d\\kappa = t - 3',
    color: 'rose',
    blurb:
      'Έχει βγει εντελώς το θετικό μισό· μόνο το αρνητικό μισό του x₂ τέμνει το x₁. y(t) είναι αρνητικό και ανεβαίνει γραμμικά πίσω στο μηδέν.',
  },
  {
    id: 'post',
    label: 'Μετά',
    range: [3, Infinity],
    formula: 'y(t) = 0',
    color: 'fg-subtle',
    blurb: 'Τα δύο σήματα δεν τέμνονται πια — y(t) ξανά μηδέν.',
  },
]

function currentPhase(t: number): Phase {
  for (const p of PHASES) {
    if (t >= p.range[0] && t < p.range[1]) return p
  }
  return PHASES[PHASES.length - 1]
}

function yAnalytic(t: number): number {
  if (t < 0) return 0
  if (t < 1) return t
  if (t < 2) return 3 - 2 * t
  if (t < 3) return t - 3
  return 0
}

const PLAY_DURATION_S = 10

export function AskisiFourConvolutionViz() {
  const [t, setT] = useState(0.5)
  const [playing, setPlaying] = useState(false)

  const x1Canvas = useRef<HTMLCanvasElement | null>(null)
  const x2Canvas = useRef<HTMLCanvasElement | null>(null)
  const prodCanvas = useRef<HTMLCanvasElement | null>(null)
  const yCanvas = useRef<HTMLCanvasElement | null>(null)

  const data = useMemo(() => {
    const tau = new Float32Array(N)
    const x1s = new Float32Array(N)
    const x2s = new Float32Array(N)
    const dtau = (RANGE[1] - RANGE[0]) / (N - 1)
    for (let i = 0; i < N; i++) {
      const v = RANGE[0] + i * dtau
      tau[i] = v
      x1s[i] = x1(v)
      x2s[i] = x2(v)
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
    return { tau, x1s, x2s, tArr, yArr, dtau }
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
    if (x1Canvas.current) drawX1(x1Canvas.current, colors, data.tau, data.x1s, t)
    if (x2Canvas.current) drawX2Flipped(x2Canvas.current, colors, data.tau, t)
    if (prodCanvas.current) drawProduct(prodCanvas.current, colors, data.tau, data.x1s, t)
    if (yCanvas.current) drawY(yCanvas.current, colors, data.tArr, data.yArr, t)
  }, [data, t])

  const phase = currentPhase(t)

  const stepT = (dir: 1 | -1) => {
    const step = 0.1
    setT((cur) => {
      const next = cur + dir * step
      if (next < RANGE[0]) return RANGE[0]
      if (next > RANGE[1]) return RANGE[1]
      return next
    })
  }

  const jumpTo = (target: number) => setT(target)

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-semibold tracking-tight">
            Άσκηση 4 (slide 8) · y(t) = x₁(t) ∗ x₂(t)
          </h4>
          <p className="text-xs text-fg-muted">
            Σύρε το <InlineMath>t</InlineMath>. Παρατήρησε τις τέσσερις φάσεις: μηδέν → t → 3−2t → t−3 → μηδέν.
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
                if (p.id === 'pre') jumpTo(-0.3)
                else if (p.id === 'a') jumpTo(0.5)
                else if (p.id === 'b') jumpTo(1.5)
                else if (p.id === 'c') jumpTo(2.5)
                else jumpTo(3.3)
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
        <Panel title="x₁(τ)" subtitle="Στατικό — ορθογώνιο στο [0, 1]">
          <canvas
            ref={x1Canvas}
            style={{ height: 80 }}
            className="block h-[80px] w-full"
            aria-label="x1 of tau"
          />
        </Panel>
        <Panel
          title="x₂(t − τ)"
          subtitle="Αναποδογυρισμένο και ολισθαίνον · αριστερά −1, δεξιά +1"
        >
          <canvas
            ref={x2Canvas}
            style={{ height: 100 }}
            className="block h-[100px] w-full"
            aria-label="x2 flipped and shifted"
          />
        </Panel>
        <Panel
          title="x₁(τ) · x₂(t − τ)"
          subtitle="Γινόμενο — εμβαδό = y(t) στο τρέχον t"
        >
          <canvas
            ref={prodCanvas}
            style={{ height: 100 }}
            className="block h-[100px] w-full"
            aria-label="Product"
          />
        </Panel>
        <Panel title="y(t)" subtitle="Συσσωρεύεται · κάθε φάση δίνει διαφορετικό γραμμικό κομμάτι">
          <canvas
            ref={yCanvas}
            style={{ height: 130 }}
            className="block h-[130px] w-full"
            aria-label="y of t"
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

      <div
        className={cn(
          'mt-4 rounded-md border-l-4 bg-bg-soft p-3 text-xs',
          phase.id === 'a' && 'border-emerald-500',
          phase.id === 'b' && 'border-amber-500',
          phase.id === 'c' && 'border-rose-500',
          (phase.id === 'pre' || phase.id === 'post') && 'border-fg-subtle/40',
        )}
      >
        <div className="flex items-baseline gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
            {phase.label}{phase.range[0] !== -Infinity && phase.range[1] !== Infinity ? ` · t ∈ [${phase.range[0]}, ${phase.range[1]}]` : ''}
          </span>
        </div>
        <div className="mt-1.5 overflow-x-auto">
          <InlineMath>{phase.formula}</InlineMath>
        </div>
        <p className="mt-1.5 text-fg-muted">{phase.blurb}</p>
      </div>

      <figcaption className="mt-3 text-[11px] text-fg-subtle">
        Αυτή είναι η Άσκηση 4 από το slide 8 του deck — λύθηκε αναλυτικά στα slides 9-10 με αλλαγή
        μεταβλητής κ = t − τ. Πειραματίσου με τις 5 φάσεις και επιβεβαίωσε ότι κάθε γραμμικό κομμάτι
        της y(t) προκύπτει από την αντίστοιχη γεωμετρία επικάλυψης παραπάνω.
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
        {subtitle && <span className="text-[10px] text-fg-muted">{subtitle}</span>}
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
  showTicks = true,
) {
  const y0 = valToPx(height, 0, vMin, vMax)
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, y0)
  ctx.lineTo(width - PAD_X, y0)
  ctx.stroke()

  if (showTicks) {
    ctx.strokeStyle = colors.fgSubtle + '55'
    ctx.fillStyle = colors.fgSubtle
    ctx.font = '9px ui-sans-serif, system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    for (let k = 0; k <= 3; k++) {
      const px = xToPx(width, k)
      ctx.beginPath()
      ctx.moveTo(px, y0 - 3)
      ctx.lineTo(px, y0 + 3)
      ctx.stroke()
      ctx.fillText(String(k), px, y0 + 5)
    }
  }
}

function drawX1(
  canvas: HTMLCanvasElement,
  colors: Colors,
  tau: Float32Array,
  xs: Float32Array,
  t: number,
) {
  const { ctx, w: width, h: height } = setupCanvas(canvas)
  ctx.clearRect(0, 0, width, height)
  drawAxis(ctx, width, height, colors, -0.4, 1.4)

  // Fill under
  ctx.fillStyle = colors.accent + '33'
  ctx.beginPath()
  ctx.moveTo(xToPx(width, RANGE[0]), valToPx(height, 0, -0.4, 1.4))
  for (let i = 0; i < tau.length; i++) {
    ctx.lineTo(xToPx(width, tau[i]), valToPx(height, xs[i], -0.4, 1.4))
  }
  ctx.lineTo(xToPx(width, RANGE[1]), valToPx(height, 0, -0.4, 1.4))
  ctx.closePath()
  ctx.fill()

  // Line
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.8
  ctx.beginPath()
  for (let i = 0; i < tau.length; i++) {
    const px = xToPx(width, tau[i])
    const py = valToPx(height, xs[i], -0.4, 1.4)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Vertical line at τ = t (where the integration "lives")
  if (t >= RANGE[0] && t <= RANGE[1]) {
    const tx = xToPx(width, t)
    ctx.strokeStyle = colors.fgMuted + '88'
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(tx, PAD_Y)
    ctx.lineTo(tx, height - PAD_Y)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = colors.fgMuted
    ctx.font = '10px ui-sans-serif, system-ui'
    ctx.textAlign = 'center'
    ctx.fillText(`τ = t = ${t.toFixed(2)}`, tx, PAD_Y - 1)
  }

  // Label
  ctx.fillStyle = colors.fg
  ctx.font = '10px ui-sans-serif, system-ui'
  ctx.textAlign = 'left'
  ctx.fillText('1', xToPx(width, 0) + 2, valToPx(height, 1, -0.4, 1.4) - 2)
}

function drawX2Flipped(
  canvas: HTMLCanvasElement,
  colors: Colors,
  tau: Float32Array,
  t: number,
) {
  const { ctx, w: width, h: height } = setupCanvas(canvas)
  ctx.clearRect(0, 0, width, height)
  drawAxis(ctx, width, height, colors, -1.4, 1.4)

  // x₂(t - τ): for τ ∈ [t-2, t-1] value -1, for τ ∈ [t-1, t] value +1
  const positivePart = { from: t - 1, to: t }
  const negativePart = { from: t - 2, to: t - 1 }

  const draw = (from: number, to: number, value: number, fillColor: string, strokeColor: string) => {
    if (from >= RANGE[1] || to <= RANGE[0]) return
    const fa = Math.max(from, RANGE[0])
    const ta = Math.min(to, RANGE[1])
    const x0 = xToPx(width, fa)
    const x1px = xToPx(width, ta)
    const y0 = valToPx(height, 0, -1.4, 1.4)
    const yv = valToPx(height, value, -1.4, 1.4)
    ctx.fillStyle = fillColor
    ctx.fillRect(x0, Math.min(y0, yv), x1px - x0, Math.abs(yv - y0))
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = 1.8
    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x0, yv)
    ctx.lineTo(x1px, yv)
    ctx.lineTo(x1px, y0)
    ctx.stroke()
  }

  draw(negativePart.from, negativePart.to, -1, '#f4365022', '#f43650')
  draw(positivePart.from, positivePart.to, +1, '#10b98122', '#10b981')

  // Highlight the integration region intersection with x₁ support [0,1]
  const ovStart = Math.max(0, t - 2)
  const ovEnd = Math.min(1, t)
  if (ovEnd > ovStart) {
    ctx.fillStyle = colors.accent + '11'
    const x0 = xToPx(width, ovStart)
    const x1px = xToPx(width, ovEnd)
    ctx.fillRect(x0, PAD_Y, x1px - x0, height - 2 * PAD_Y)
  }

  // Vertical line at τ = t
  const tx = xToPx(width, t)
  ctx.strokeStyle = colors.fgMuted + '88'
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(tx, PAD_Y)
  ctx.lineTo(tx, height - PAD_Y)
  ctx.stroke()
  ctx.setLineDash([])

  // Labels
  ctx.fillStyle = '#10b981'
  ctx.font = '10px ui-sans-serif, system-ui'
  ctx.textAlign = 'left'
  if (t - 1 < RANGE[1] && t > RANGE[0]) {
    const cx = xToPx(width, (Math.max(t - 1, RANGE[0]) + Math.min(t, RANGE[1])) / 2)
    ctx.textAlign = 'center'
    ctx.fillText('+1', cx, valToPx(height, 1, -1.4, 1.4) - 3)
  }
  ctx.fillStyle = '#f43650'
  if (t - 2 < RANGE[1] && t - 1 > RANGE[0]) {
    const cx = xToPx(width, (Math.max(t - 2, RANGE[0]) + Math.min(t - 1, RANGE[1])) / 2)
    ctx.textAlign = 'center'
    ctx.fillText('−1', cx, valToPx(height, -1, -1.4, 1.4) + 11)
  }
}

function drawProduct(
  canvas: HTMLCanvasElement,
  colors: Colors,
  tau: Float32Array,
  x1s: Float32Array,
  t: number,
) {
  const { ctx, w: width, h: height } = setupCanvas(canvas)
  ctx.clearRect(0, 0, width, height)
  drawAxis(ctx, width, height, colors, -1.4, 1.4)

  // Compute product samples and integrate
  let area = 0
  for (let i = 0; i < tau.length - 1; i++) {
    const v = tau[i]
    const prodVal = x1s[i] * x2(t - v)
    if (prodVal !== 0) {
      const px0 = xToPx(width, v)
      const px1 = xToPx(width, tau[i + 1])
      const y0 = valToPx(height, 0, -1.4, 1.4)
      const yv = valToPx(height, prodVal, -1.4, 1.4)
      ctx.fillStyle = prodVal > 0 ? '#10b98166' : '#f4365066'
      ctx.fillRect(px0, Math.min(y0, yv), px1 - px0, Math.abs(yv - y0))
      area += prodVal * (tau[i + 1] - tau[i])
    }
  }

  // Outline of x₁ for reference
  ctx.strokeStyle = colors.accent + '66'
  ctx.lineWidth = 1
  ctx.setLineDash([2, 2])
  ctx.beginPath()
  for (let i = 0; i < tau.length; i++) {
    const px = xToPx(width, tau[i])
    const py = valToPx(height, x1s[i], -1.4, 1.4)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // Area text
  ctx.fillStyle = colors.fg
  ctx.font = '11px ui-sans-serif, system-ui'
  ctx.textAlign = 'right'
  ctx.fillText(`εμβαδό = ${area.toFixed(2)}`, width - PAD_X - 2, PAD_Y + 2)
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
  drawAxis(ctx, width, height, colors, -1.4, 1.4)

  // Phase backgrounds
  const phases: { from: number; to: number; color: string }[] = [
    { from: 0, to: 1, color: '#10b98114' },
    { from: 1, to: 2, color: '#f59e0b14' },
    { from: 2, to: 3, color: '#f4365014' },
  ]
  for (const p of phases) {
    const x0 = xToPx(width, p.from)
    const x1px = xToPx(width, p.to)
    ctx.fillStyle = p.color
    ctx.fillRect(x0, PAD_Y, x1px - x0, height - 2 * PAD_Y)
  }

  // y(t) full curve
  ctx.strokeStyle = colors.fgMuted + 'aa'
  ctx.lineWidth = 1.4
  ctx.beginPath()
  for (let i = 0; i < tArr.length; i++) {
    const px = xToPx(width, tArr[i])
    const py = valToPx(height, yArr[i], -1.4, 1.4)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Curve up to tNow (highlighted)
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  let started = false
  for (let i = 0; i < tArr.length; i++) {
    if (tArr[i] > tNow) break
    const px = xToPx(width, tArr[i])
    const py = valToPx(height, yArr[i], -1.4, 1.4)
    if (!started) {
      ctx.moveTo(px, py)
      started = true
    } else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Current dot
  if (tNow >= RANGE[0] && tNow <= RANGE[1]) {
    const yv = yAnalytic(tNow)
    const px = xToPx(width, tNow)
    const py = valToPx(height, yv, -1.4, 1.4)
    ctx.fillStyle = colors.accent
    ctx.beginPath()
    ctx.arc(px, py, 3.5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = colors.fg
    ctx.font = '10px ui-sans-serif, system-ui'
    ctx.textAlign = 'left'
    ctx.fillText(`y(${tNow.toFixed(2)}) = ${yv.toFixed(2)}`, px + 6, py - 4)
  }

  // Breakpoint markers
  ctx.strokeStyle = colors.fgSubtle + '55'
  ctx.setLineDash([2, 2])
  for (const tx of [0, 1, 2, 3]) {
    const px = xToPx(width, tx)
    ctx.beginPath()
    ctx.moveTo(px, PAD_Y)
    ctx.lineTo(px, height - PAD_Y)
    ctx.stroke()
  }
  ctx.setLineDash([])

  // Labels for each phase formula
  ctx.font = '9px ui-sans-serif, system-ui'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#10b981'
  ctx.fillText('y = t', xToPx(width, 0.5), valToPx(height, 0.5, -1.4, 1.4) - 5)
  ctx.fillStyle = '#f59e0b'
  ctx.fillText('y = 3 − 2t', xToPx(width, 1.5), valToPx(height, -0.05, -1.4, 1.4) + 12)
  ctx.fillStyle = '#f43650'
  ctx.fillText('y = t − 3', xToPx(width, 2.5), valToPx(height, -0.5, -1.4, 1.4) - 5)
}
