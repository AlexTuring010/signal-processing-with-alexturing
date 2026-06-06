'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * FT §2.1 (coda) — one rect (÷T₀) vs two rects (÷T), stacked for comparison.
 *
 * Top row: a single rect, period T₀ (fixed). aₖ = X(k/T₀)/T₀.
 * Bottom row: TWO copies of the same rect (spaced T₀) as one repeated unit. That
 * unit has its OWN period T, with minimum T = 2T₀ (the copies packed, which
 * rebuilds the original train) and growing by adding empty space. aₖ = X(k/T)/T.
 *
 * Same rule in both: aₖ = (total) X / (period) — because aₖ is the MEAN. Bigger
 * period → finer sample step 1/T and smaller aₖ. The envelopes are magnitudes
 * (the two-copy envelope is the rect's, doubled and rippled by interference).
 *
 * One knob: T (the two-copy period), from 2T₀ up. T₀ is the fixed reference.
 */

const TAU = 0.7 // rect width
const T0 = 2 // single-rect period (fixed reference)
const T_MIN = 2 * T0 // = 4
const T_MAX = 12

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}

// magnitude envelopes
function X1(f: number) {
  return Math.abs(TAU * sinc(f * TAU)) // one rect
}
function X2(f: number) {
  return Math.abs(2 * TAU * sinc(f * TAU) * Math.cos(Math.PI * f * T0)) // two copies, spaced T₀
}

export function TwoPulsesToCoefficients() {
  const [T, setT] = useState(6)
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, T)
    if (freqRef.current) drawFreq(freqRef.current, colors, T)
  }, [T])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Ένα rect (÷T₀) έναντι δύο rect (÷T): η ίδια συνταγή, νέα περίοδος
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Πάνω: ένας rect ανά <span className="font-mono">T₀</span>. Κάτω: <strong>δύο αντίγραφα</strong>{' '}
        του ως μία μονάδα, με δική της περίοδο <span className="font-mono">T</span> (ελάχιστο{' '}
        <span className="font-mono">2T₀</span>). Σε κάθε φάσμα: η <strong>γκρι διακεκομμένη</strong>{' '}
        είναι το <span className="font-mono">|X|</span> (το <strong>σύνολο</strong>)· οι{' '}
        <strong>στήλες</strong> <span className="font-mono">aₖ</span> κάθονται στη χαμηλότερη καμπύλη{' '}
        <span className="font-mono">|X|/περίοδο</span> (ο <strong>μέσος όρος</strong>).
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="πάνω: 1 rect ανά T₀ · κάτω: 2 rect ανά T">
          <canvas ref={timeRef} style={{ height: 210 }} className="block h-[210px] w-full" aria-label="Time domain: one-rect train and two-copy train" />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="aₖ = |X| / περίοδο (δείγματα ανά 1/περίοδο)">
          <canvas ref={freqRef} style={{ height: 210 }} className="block h-[210px] w-full" aria-label="Spectra: envelope sampled and divided by the period, one rect vs two" />
        </Panel>
      </div>

      <div className="mt-3 rounded-md border border-border bg-bg p-3">
        <label className="block text-xs text-fg-muted">
          περίοδος των δύο αντιγράφων T ={' '}
          <span className="font-mono text-fg tabular-nums">{T.toFixed(1)}</span>{' '}
          <span className="text-fg-subtle">
            (= {(T / T0).toFixed(1)}·T₀ · βήμα δειγμάτων 1/T = {(1 / T).toFixed(2)})
          </span>
        </label>
        <input type="range" min={T_MIN} max={T_MAX} step={0.1} value={T} onChange={(e) => setT(parseFloat(e.target.value))} className="mt-2 w-full accent-[rgb(var(--accent))]" aria-label="Two-copy period T" />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Πάνω διαιρείς με <span className="font-mono">T₀</span>, κάτω με <span className="font-mono">T</span>{' '}
        (στο ελάχιστο, <span className="font-mono">2T₀</span>). Ο κανόνας είναι ο ίδιος —{' '}
        <span className="font-mono">aₖ = |X| / περίοδο</span> — επειδή το <span className="font-mono">aₖ</span>{' '}
        είναι ο <strong>μέσος όρος</strong>: ο ίδιος παλμός σε μεγαλύτερη περίοδο δίνει μικρότερο μέσο
        όρο. Μεγάλωσε το <span className="font-mono">T</span> και δες τα δείγματα να{' '}
        <strong>πυκνώνουν</strong> και τις στήλες να <strong>χαμηλώνουν</strong>.
      </div>
    </figure>
  )
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
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

const PAD_X = 30
const PAD_Y = 16

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}

function bands(h: number) {
  const bandH = (h - 3 * PAD_Y) / 2
  return {
    top: { t: PAD_Y, b: PAD_Y + bandH },
    bot: { t: 2 * PAD_Y + bandH, b: 2 * PAD_Y + 2 * bandH },
  }
}

function drawTime(canvas: HTMLCanvasElement, colors: ThemeColors, T: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const { top, bot } = bands(h)
  const tDom = 9

  // band 1: one rect every T₀
  const c1: number[] = []
  for (let k = -6; k <= 6; k++) c1.push(k * T0)
  drawTrainBand(ctx, colors, w, top.t, top.b, tDom, c1, 'ένας rect ανά T₀ = 2')

  // band 2: two copies (±T₀/2) repeated every T
  const c2: number[] = []
  for (let k = -4; k <= 4; k++) {
    c2.push(-T0 / 2 + k * T)
    c2.push(T0 / 2 + k * T)
  }
  drawTrainBand(ctx, colors, w, bot.t, bot.b, tDom, c2, `δύο αντίγραφα, περίοδος T = ${T.toFixed(1)}`)
}

function drawTrainBand(
  ctx: CanvasRenderingContext2D,
  colors: ThemeColors,
  w: number,
  bandTop: number,
  bandBot: number,
  tDom: number,
  centers: number[],
  label: string,
) {
  const xt = (t: number) => lerp(t, -tDom, tDom, PAD_X, w - PAD_X)
  const yBase = bandBot - 4
  const yTopRect = bandTop + 16
  const accentRgb = getRGB(colors.accent)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yBase)
  ctx.lineTo(w - PAD_X + 4, yBase)
  ctx.stroke()

  ctx.fillStyle = `rgba(${accentRgb}, 0.22)`
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.6
  for (const c of centers) {
    const a = c - TAU / 2
    const b = c + TAU / 2
    if (b < -tDom || a > tDom) continue
    const xL = xt(Math.max(a, -tDom))
    const xR = xt(Math.min(b, tDom))
    ctx.fillRect(xL, yTopRect, xR - xL, yBase - yTopRect)
    ctx.strokeRect(xL, yTopRect, xR - xL, yBase - yTopRect)
  }

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(label, PAD_X + 2, bandTop + 10)
}

function drawFreq(canvas: HTMLCanvasElement, colors: ThemeColors, T: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const { top, bot } = bands(h)
  drawSpecBand(ctx, colors, w, top.t, top.b, X1, T0, 'ένας rect: aₖ = |X| ÷ T₀')
  drawSpecBand(ctx, colors, w, bot.t, bot.b, X2, T, 'δύο rect: aₖ = |X| ÷ T')
}

function drawSpecBand(
  ctx: CanvasRenderingContext2D,
  colors: ThemeColors,
  w: number,
  bandTop: number,
  bandBot: number,
  Xf: (f: number) => number,
  period: number,
  label: string,
) {
  const fDom = 3
  const yMax = 1.55
  const xt = (f: number) => lerp(f, -fDom, fDom, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.12 * yMax, bandTop + 12, bandBot)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  // axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  // envelope |X| — the "total" (gray dashed, shape only)
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1.2
  ctx.globalAlpha = 0.6
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  const STEPS = 600
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -fDom, fDom)
    const y = yv(Xf(f))
    if (i === 0) ctx.moveTo(xt(f), y)
    else ctx.lineTo(xt(f), y)
  }
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1

  // |X|/period curve — where the aₖ sit (the "mean")
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.4
  ctx.globalAlpha = 0.45
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -fDom, fDom)
    const y = yv(Xf(f) / period)
    if (i === 0) ctx.moveTo(xt(f), y)
    else ctx.lineTo(xt(f), y)
  }
  ctx.stroke()
  ctx.globalAlpha = 1

  // aₖ stems at f = k/period
  const kMax = Math.ceil(fDom * period) + 1
  for (let k = -kMax; k <= kMax; k++) {
    const f = k / period
    if (Math.abs(f) > fDom) continue
    const ak = Xf(f) / period
    const x = xt(f)
    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 1.6
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, yv(ak))
    ctx.stroke()
    ctx.fillStyle = colors.accent
    ctx.beginPath()
    ctx.arc(x, yv(ak), 2.2, 0, Math.PI * 2)
    ctx.fill()
  }

  // labels
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(label, PAD_X + 2, bandTop + 9)
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'center'
  ctx.fillText('f', w - PAD_X + 2, yZero - 4)
}
