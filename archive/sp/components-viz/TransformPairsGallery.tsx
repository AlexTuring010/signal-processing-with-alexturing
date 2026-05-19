'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Gallery of canonical Fourier transform pairs.
 *
 * Each card shows time domain on the left, frequency domain on the right.
 * Pairs included (all in the typology):
 *   1. Rectangular pulse  ↔  sinc
 *   2. Triangular pulse   ↔  sinc²
 *   3. δ(t)               ↔  1
 *   4. 1                  ↔  δ(f)
 *   5. cos(2π f₀ t)       ↔  ½δ(f−f₀) + ½δ(f+f₀)
 *   6. e^{−a|t|} (a>0)    ↔  2a / (a² + (2π f)²)   (Lorentzian)
 *   7. Gaussian           ↔  Gaussian
 *
 * All FTs computed in closed form. Impulses drawn as upward arrows (we never
 * draw "true" deltas, just labelled spikes).
 */

type PairId = 'rect' | 'tri' | 'delta' | 'const' | 'cos' | 'expdecay' | 'gauss'

type Pair = {
  id: PairId
  label: string
  timeFormula: string
  freqFormula: string
  drawTime: (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    colors: ReturnType<typeof getThemeColors>,
  ) => void
  drawFreq: (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    colors: ReturnType<typeof getThemeColors>,
  ) => void
  note?: string
}

const PAD = 18

function plotCurve(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colors: ReturnType<typeof getThemeColors>,
  fn: (x: number) => number,
  xMin: number,
  xMax: number,
  yLim: number,
  axisLabel: string,
) {
  if (!colors) return
  ctx.clearRect(0, 0, w, h)
  const xt = (x: number) => lerp(x, xMin, xMax, PAD, w - PAD)
  const yv = (y: number) => lerp(y, yLim, -yLim * 0.35, PAD, h - PAD)
  const yZero = yv(0)

  // baseline
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD, yZero)
  ctx.lineTo(w - PAD, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD)
  ctx.lineTo(xt(0), h - PAD)
  ctx.stroke()

  // curve
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.6
  ctx.beginPath()
  const STEPS = 400
  for (let i = 0; i <= STEPS; i++) {
    const x = lerp(i, 0, STEPS, xMin, xMax)
    const y = fn(x)
    const px = xt(x)
    const py = yv(y)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(axisLabel, w - PAD, h - 1)
}

function drawImpulse(
  ctx: CanvasRenderingContext2D,
  px: number,
  yZero: number,
  yPx: number,
  color: string,
  label?: string,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(px, yZero)
  ctx.lineTo(px, yPx)
  ctx.stroke()
  // arrowhead
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(px, yPx)
  ctx.lineTo(px - 4, yPx + 6)
  ctx.lineTo(px + 4, yPx + 6)
  ctx.closePath()
  ctx.fill()
  if (label) {
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = color
    ctx.fillText(label, px, yPx - 4)
  }
}

const PAIRS: Pair[] = [
  {
    id: 'rect',
    label: 'Ορθογώνιος ↔ sinc',
    timeFormula: 'A·rect(t/T)',
    freqFormula: 'AT·sinc(fT)',
    drawTime: (ctx, w, h, colors) => {
      ctx.clearRect(0, 0, w, h)
      const xMin = -2.5
      const xMax = 2.5
      const xt = (x: number) => lerp(x, xMin, xMax, PAD, w - PAD)
      const yv = (y: number) => lerp(y, 1.4, -0.5, PAD, h - PAD)
      const yZero = yv(0)
      ctx.strokeStyle = colors!.border
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(PAD, yZero)
      ctx.lineTo(w - PAD, yZero)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(xt(0), PAD)
      ctx.lineTo(xt(0), h - PAD)
      ctx.stroke()
      ctx.fillStyle = `rgba(${getRGB(colors!.accent)}, 0.18)`
      ctx.fillRect(xt(-1), yv(1), xt(1) - xt(-1), yZero - yv(1))
      ctx.strokeStyle = colors!.accent
      ctx.lineWidth = 1.6
      ctx.beginPath()
      ctx.moveTo(PAD, yZero)
      ctx.lineTo(xt(-1), yZero)
      ctx.lineTo(xt(-1), yv(1))
      ctx.lineTo(xt(1), yv(1))
      ctx.lineTo(xt(1), yZero)
      ctx.lineTo(w - PAD, yZero)
      ctx.stroke()
      ctx.fillStyle = colors!.fgSubtle
      ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('t', w - PAD, h - 1)
    },
    drawFreq: (ctx, w, h, colors) =>
      plotCurve(
        ctx,
        w,
        h,
        colors,
        (f) => {
          const x = f
          return x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x)
        },
        -5,
        5,
        1.2,
        'f',
      ),
    note: '✓ τυπολόγιο',
  },
  {
    id: 'tri',
    label: 'Τρίγωνο ↔ sinc²',
    timeFormula: 'Λ(t/T)',
    freqFormula: 'T·sinc²(fT)',
    drawTime: (ctx, w, h, colors) =>
      plotCurve(
        ctx,
        w,
        h,
        colors,
        (t) => Math.max(0, 1 - Math.abs(t)),
        -2.5,
        2.5,
        1.2,
        't',
      ),
    drawFreq: (ctx, w, h, colors) =>
      plotCurve(
        ctx,
        w,
        h,
        colors,
        (f) => {
          const x = f
          const s = x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x)
          return s * s
        },
        -5,
        5,
        1.2,
        'f',
      ),
    note: '✓ τυπολόγιο',
  },
  {
    id: 'delta',
    label: 'δ(t) ↔ 1',
    timeFormula: 'δ(t)',
    freqFormula: '1',
    drawTime: (ctx, w, h, colors) => {
      ctx.clearRect(0, 0, w, h)
      const xMin = -2
      const xMax = 2
      const xt = (x: number) => lerp(x, xMin, xMax, PAD, w - PAD)
      const yv = (y: number) => lerp(y, 1.4, -0.5, PAD, h - PAD)
      const yZero = yv(0)
      ctx.strokeStyle = colors!.border
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(PAD, yZero)
      ctx.lineTo(w - PAD, yZero)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(xt(0), PAD)
      ctx.lineTo(xt(0), h - PAD)
      ctx.stroke()
      drawImpulse(ctx, xt(0), yZero, yv(1), colors!.accent, '1')
      ctx.fillStyle = colors!.fgSubtle
      ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('t', w - PAD, h - 1)
    },
    drawFreq: (ctx, w, h, colors) =>
      plotCurve(ctx, w, h, colors, () => 1, -5, 5, 1.4, 'f'),
    note: '✓ τυπολόγιο',
  },
  {
    id: 'const',
    label: '1 ↔ δ(f)',
    timeFormula: '1',
    freqFormula: 'δ(f)',
    drawTime: (ctx, w, h, colors) =>
      plotCurve(ctx, w, h, colors, () => 1, -2, 2, 1.4, 't'),
    drawFreq: (ctx, w, h, colors) => {
      ctx.clearRect(0, 0, w, h)
      const xMin = -5
      const xMax = 5
      const xt = (x: number) => lerp(x, xMin, xMax, PAD, w - PAD)
      const yv = (y: number) => lerp(y, 1.4, -0.5, PAD, h - PAD)
      const yZero = yv(0)
      ctx.strokeStyle = colors!.border
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(PAD, yZero)
      ctx.lineTo(w - PAD, yZero)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(xt(0), PAD)
      ctx.lineTo(xt(0), h - PAD)
      ctx.stroke()
      drawImpulse(ctx, xt(0), yZero, yv(1), colors!.accent, '1')
      ctx.fillStyle = colors!.fgSubtle
      ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('f', w - PAD, h - 1)
    },
    note: '✓ τυπολόγιο',
  },
  {
    id: 'cos',
    label: 'cos(2π f₀ t) ↔ δ(f∓f₀)/2',
    timeFormula: 'cos(2π f₀ t)',
    freqFormula: '½δ(f−f₀) + ½δ(f+f₀)',
    drawTime: (ctx, w, h, colors) =>
      plotCurve(
        ctx,
        w,
        h,
        colors,
        (t) => Math.cos(2 * Math.PI * 1 * t),
        -2,
        2,
        1.4,
        't',
      ),
    drawFreq: (ctx, w, h, colors) => {
      ctx.clearRect(0, 0, w, h)
      const xMin = -3
      const xMax = 3
      const xt = (x: number) => lerp(x, xMin, xMax, PAD, w - PAD)
      const yv = (y: number) => lerp(y, 1.4, -0.5, PAD, h - PAD)
      const yZero = yv(0)
      ctx.strokeStyle = colors!.border
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(PAD, yZero)
      ctx.lineTo(w - PAD, yZero)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(xt(0), PAD)
      ctx.lineTo(xt(0), h - PAD)
      ctx.stroke()
      drawImpulse(ctx, xt(1), yZero, yv(0.5), colors!.accent, '½')
      drawImpulse(ctx, xt(-1), yZero, yv(0.5), colors!.accent, '½')
      ctx.fillStyle = colors!.fgSubtle
      ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('+f₀', xt(1), h - 1)
      ctx.fillText('−f₀', xt(-1), h - 1)
    },
    note: '✓ τυπολόγιο',
  },
  {
    id: 'expdecay',
    label: 'e^{−a|t|} ↔ Lorentzian',
    timeFormula: 'e^{−a|t|}',
    freqFormula: '2a / (a² + (2π f)²)',
    drawTime: (ctx, w, h, colors) =>
      plotCurve(
        ctx,
        w,
        h,
        colors,
        (t) => Math.exp(-Math.abs(t)),
        -3,
        3,
        1.2,
        't',
      ),
    drawFreq: (ctx, w, h, colors) =>
      plotCurve(
        ctx,
        w,
        h,
        colors,
        (f) => 2 / (1 + (2 * Math.PI * f) ** 2),
        -2.5,
        2.5,
        2.2,
        'f',
      ),
    note: '✓ τυπολόγιο',
  },
  {
    id: 'gauss',
    label: 'Gaussian ↔ Gaussian',
    timeFormula: 'e^{−π t²}',
    freqFormula: 'e^{−π f²}',
    drawTime: (ctx, w, h, colors) =>
      plotCurve(
        ctx,
        w,
        h,
        colors,
        (t) => Math.exp(-Math.PI * t * t),
        -2.5,
        2.5,
        1.2,
        't',
      ),
    drawFreq: (ctx, w, h, colors) =>
      plotCurve(
        ctx,
        w,
        h,
        colors,
        (f) => Math.exp(-Math.PI * f * f),
        -2.5,
        2.5,
        1.2,
        'f',
      ),
    note: 'Self-dual',
  },
]

export function TransformPairsGallery() {
  const [activeId, setActiveId] = useState<PairId>('rect')
  const active = PAIRS.find((p) => p.id === activeId)!
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) {
      const { ctx, w, h } = setupCanvas(timeRef.current)
      active.drawTime(ctx, w, h, colors)
    }
    if (freqRef.current) {
      const { ctx, w, h } = setupCanvas(freqRef.current)
      active.drawFreq(ctx, w, h, colors)
    }
  }, [active])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Πινακοθήκη μετασχηματισμών — οι «πρωταγωνιστές»
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Διάλεξε ένα ζευγάρι. Όλα είναι στο τυπολόγιο εκτός αν αναφέρεται διαφορετικά.
        Οι κρούσεις εμφανίζονται σαν αρρόγραμμα-βέλη <em>(δεν δείχνεται «πραγματικό» δέλτα)</em>.
      </p>

      <div
        role="radiogroup"
        aria-label="Transform pair"
        className="mb-3 flex flex-wrap items-center gap-1 text-[11px]"
      >
        {PAIRS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={activeId === p.id}
            onClick={() => setActiveId(p.id)}
            className={cn(
              'rounded-full border px-2.5 py-0.5 transition-colors',
              activeId === p.id
                ? 'border-accent bg-accent text-accent-fg'
                : 'border-border bg-bg-soft text-fg-muted hover:border-accent/50 hover:text-fg',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle={active.timeFormula}>
          <canvas
            ref={timeRef}
            style={{ height: 130 }}
            className="block h-[130px] w-full"
            aria-label={`Time domain: ${active.timeFormula}`}
          />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle={active.freqFormula}>
          <canvas
            ref={freqRef}
            style={{ height: 130 }}
            className="block h-[130px] w-full"
            aria-label={`Frequency domain: ${active.freqFormula}`}
          />
        </Panel>
      </div>

      {active.note && (
        <p className="mt-2 text-[11px] text-fg-subtle">
          <span className="font-semibold">{active.note}</span>
        </p>
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
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-3 py-1">
        <span className="text-[10px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}
