'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Four ideal filter types — pick LP/HP/BP/BS, see |H(f)| as a brick-wall
 * shape, and Y(f) = X(f)·H(f) for a fixed multi-tone test input.
 *
 * Three stacked panels:
 *   Top:    test signal |X(f)| (impulses at three frequencies, both signs)
 *   Mid:    |H(f)| of the chosen filter
 *   Bottom: |Y(f)| = |X(f)|·|H(f)| — surviving impulses are highlighted,
 *           blocked tones get a faint dashed stub so the reader can see what
 *           was killed.
 */

type FilterId = 'lp' | 'hp' | 'bp' | 'bs'

const FC1 = 1.2 // first cutoff (used by all filter types)
const FC2 = 2.6 // second cutoff (used by BP/BS)

type FilterType = {
  id: FilterId
  label: string
  description: string
  /** Returns 1 inside passband, 0 inside stopband, ideal brick wall. */
  H: (f: number) => number
}

const FILTERS: FilterType[] = [
  {
    id: 'lp',
    label: 'Lowpass',
    description: '|H(f)| = 1 για |f| < f_c, 0 αλλιώς. Περνάει χαμηλές, κόβει υψηλές.',
    H: (f) => (Math.abs(f) < FC1 ? 1 : 0),
  },
  {
    id: 'hp',
    label: 'Highpass',
    description: '|H(f)| = 0 για |f| < f_c, 1 αλλιώς. Κόβει χαμηλές, περνάει υψηλές.',
    H: (f) => (Math.abs(f) < FC1 ? 0 : 1),
  },
  {
    id: 'bp',
    label: 'Bandpass',
    description: '|H(f)| = 1 για f_1 < |f| < f_2, 0 αλλιώς. Περνάει μια ζώνη.',
    H: (f) => {
      const a = Math.abs(f)
      return a > FC1 && a < FC2 ? 1 : 0
    },
  },
  {
    id: 'bs',
    label: 'Bandstop',
    description: '|H(f)| = 0 για f_1 < |f| < f_2, 1 αλλιώς. Κόβει μια ζώνη (notch).',
    H: (f) => {
      const a = Math.abs(f)
      return a > FC1 && a < FC2 ? 0 : 1
    },
  },
]

// Test signal: impulses at ±0.5, ±1.7, ±3.0 with given heights.
const TEST_TONES: { f: number; h: number }[] = [
  { f: 0.5, h: 0.7 },
  { f: 1.7, h: 0.5 },
  { f: 3.0, h: 0.4 },
]

const TONE_C = 'rgb(29, 78, 216)' // accent
const FILTER_C = 'rgb(217, 119, 6)' // amber
const OUT_C = 'rgb(22, 163, 74)' // green

const PAD = 18

export function FilterTypeViewer() {
  const [filterId, setFilterId] = useState<FilterId>('lp')
  const filter = FILTERS.find((f) => f.id === filterId)!
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, filter)
  }, [filter])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Τα τέσσερα ιδανικά φίλτρα — δες ποιοι τόνοι επιβιώνουν
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Διάλεξε τύπο φίλτρου. Πάνω: φάσμα τεστ-σήματος με τρεις τόνους (συν τα
        αντικατοπτρικά τους στις αρνητικές συχνότητες). Μέσο:{' '}
        <span className="font-mono">|H(f)|</span> — brick wall. Κάτω: η έξοδος{' '}
        <span className="font-mono">|Y(f)| = |X(f)|·|H(f)|</span> — μόνο οι
        τόνοι εντός passband επιβιώνουν.
      </p>

      <div
        role="radiogroup"
        aria-label="Filter type"
        className="mb-3 inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
      >
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="radio"
            aria-checked={filterId === f.id}
            onClick={() => setFilterId(f.id)}
            className={cn(
              'rounded-full px-2.5 py-0.5 transition-colors',
              filterId === f.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 280 }}
        className="block h-[280px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Test spectrum, filter response, and output spectrum stacked"
      />

      <p className="mt-2 text-[11px] text-fg-subtle">{filter.description}</p>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  filter: FilterType,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const rowH = h / 3
  drawTestSpectrum(ctx, colors, 0, 0, w, rowH)
  drawFilterResponse(ctx, colors, 0, rowH, w, rowH, filter)
  drawOutputSpectrum(ctx, colors, 0, 2 * rowH, w, rowH, filter)
}

function drawTestSpectrum(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
) {
  if (!colors) return
  const fMax = 4
  const fMin = -fMax
  const yMax = 1.0

  const xt = (f: number) => lerp(f, fMin, fMax, x0 + PAD, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, yMax, -yMax * 0.3, y0 + PAD + 4, y0 + ph - PAD)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('|X(f)| — input (3 τόνοι)', x0 + PAD, y0 + 12)

  drawAxes(ctx, colors, xt, yv, x0, pw, y0, ph, yZero)

  for (const tone of TEST_TONES) {
    for (const sign of [1, -1]) {
      drawImpulse(ctx, xt(sign * tone.f), yZero, yv(tone.h), TONE_C)
    }
  }
}

function drawFilterResponse(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  filter: FilterType,
) {
  if (!colors) return
  const fMax = 4
  const fMin = -fMax
  const yMax = 1.3

  const xt = (f: number) => lerp(f, fMin, fMax, x0 + PAD, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, yMax, -0.2, y0 + PAD + 4, y0 + ph - PAD)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`|H(f)| — ${filter.label}`, x0 + PAD, y0 + 12)

  drawAxes(ctx, colors, xt, yv, x0, pw, y0, ph, yZero)

  // Brick wall — fine-grain sample of H(f)
  const STEPS = 600
  ctx.strokeStyle = FILTER_C
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const v = filter.H(f)
    const px = xt(f)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Faint fill of passband
  ctx.fillStyle = `rgba(${getRGB(FILTER_C)}, 0.18)`
  ctx.beginPath()
  ctx.moveTo(xt(fMin), yZero)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const v = filter.H(f)
    ctx.lineTo(xt(f), yv(v))
  }
  ctx.lineTo(xt(fMax), yZero)
  ctx.closePath()
  ctx.fill()

  // tick labels for cutoffs
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  if (filter.id === 'lp' || filter.id === 'hp') {
    ctx.fillText('+f_c', xt(FC1), yZero + 12)
    ctx.fillText('−f_c', xt(-FC1), yZero + 12)
  } else {
    ctx.fillText('+f₁', xt(FC1), yZero + 12)
    ctx.fillText('−f₁', xt(-FC1), yZero + 12)
    ctx.fillText('+f₂', xt(FC2), yZero + 12)
    ctx.fillText('−f₂', xt(-FC2), yZero + 12)
  }

  ctx.textAlign = 'right'
  ctx.fillText('1', x0 + PAD - 3, yv(1) + 3)
  ctx.fillText('0', x0 + PAD - 3, yZero + 3)
}

function drawOutputSpectrum(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  filter: FilterType,
) {
  if (!colors) return
  const fMax = 4
  const fMin = -fMax
  const yMax = 1.0

  const xt = (f: number) => lerp(f, fMin, fMax, x0 + PAD, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, yMax, -yMax * 0.3, y0 + PAD + 4, y0 + ph - PAD)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('|Y(f)| = |X(f)|·|H(f)|', x0 + PAD, y0 + 12)

  drawAxes(ctx, colors, xt, yv, x0, pw, y0, ph, yZero)

  for (const tone of TEST_TONES) {
    for (const sign of [1, -1]) {
      const f = sign * tone.f
      const passed = filter.H(f) > 0.5
      const x = xt(f)
      if (passed) {
        drawImpulse(ctx, x, yZero, yv(tone.h), OUT_C)
      } else {
        // faint dashed stub showing the tone was blocked
        ctx.strokeStyle = colors.fgMuted
        ctx.setLineDash([2, 3])
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, yZero)
        ctx.lineTo(x, yv(tone.h * 0.4))
        ctx.stroke()
        ctx.setLineDash([])
      }
    }
  }

  // tick labels for tone frequencies
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const tone of TEST_TONES) {
    ctx.fillText(`±${tone.f}`, xt(tone.f), yZero + 12)
  }
}

function drawAxes(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  xt: (f: number) => number,
  yv: (v: number) => number,
  x0: number,
  pw: number,
  y0: number,
  ph: number,
  yZero: number,
) {
  if (!colors) return
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD, yZero)
  ctx.lineTo(x0 + pw - PAD, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), y0 + PAD + 4)
  ctx.lineTo(xt(0), y0 + ph - PAD)
  ctx.stroke()
}

function drawImpulse(
  ctx: CanvasRenderingContext2D,
  x: number,
  yBase: number,
  yTop: number,
  color: string,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x, yBase)
  ctx.lineTo(x, yTop)
  ctx.stroke()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, yTop - 5)
  ctx.lineTo(x - 4, yTop + 2)
  ctx.lineTo(x + 4, yTop + 2)
  ctx.closePath()
  ctx.fill()
}

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}
