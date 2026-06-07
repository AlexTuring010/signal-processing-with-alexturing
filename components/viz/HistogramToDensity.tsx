'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * The everyday rehearsal for "amount-per-line vanishes, density survives", FT §1.
 *
 * A plain histogram of some data. Drag the BIN WIDTH:
 *   - TOP — count PER BIN. As bins narrow, each bar shrinks toward 0 (the same
 *     fixed data is split into ever finer boxes). Nothing was lost — it's just
 *     diluted across more boxes.
 *   - BOTTOM — count per UNIT WIDTH = density (= count / bin width). As bins
 *     narrow, the bars lock onto a fixed smooth curve.
 *
 * This is the exact structure of aₖ (per line) vs T₀·aₖ = aₖ/Δf = X(f) (per unit
 * frequency) in CoefficientsToDensity — here with bins instead of harmonics.
 *
 * Idealised (noiseless) histogram: count(bin) = SCALE · d(center) · Δ, so
 * count/Δ = SCALE · d(center) lands exactly on the curve — keeps the "converges
 * to a curve" point crisp.
 */

const W_MIN = 0.15
const W_MAX = 1.2
const SCALE = 100 // turns the density into believable "counts"
const X_MAX = 3

// Shape of the data: a bell curve d(x) = e^{-x²/2} (peak 1 at 0).
function d(x: number) {
  return Math.exp(-0.5 * x * x)
}

export function HistogramToDensity() {
  const [bw, setBw] = useState(0.8)
  const topRef = useRef<HTMLCanvasElement | null>(null)
  const botRef = useRef<HTMLCanvasElement | null>(null)
  const centerCount = SCALE * d(0) * bw

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (topRef.current) drawTop(topRef.current, colors, bw)
    if (botRef.current) drawBottom(botRef.current, colors, bw)
  }, [bw])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Ιστόγραμμα: στένεψε τα bins — το «ανά bin» σβήνει, η πυκνότητα μένει
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Ένα <strong>ιστόγραμμα</strong> κάποιων δεδομένων: χωρίζουμε τον άξονα σε{' '}
        <strong>bins</strong> (κουτάκια) πλάτους <span className="font-mono">Δ</span> και
        μετράμε πόσα δεδομένα πέφτουν σε καθένα — αυτό είναι το ύψος της κάθε μπάρας. Σύρε
        το πλάτος των bins. <strong>Πάνω</strong>: το <em>πλήθος ανά bin</em> πέφτει προς το
        0 (τα ίδια δεδομένα μοιρασμένα σε πιο λεπτά κουτάκια). <strong>Κάτω</strong>: το{' '}
        <em>πλήθος ανά πλάτος bin</em> — η <strong>πυκνότητα</strong> — κλειδώνει σε μια
        σταθερή καμπύλη.
      </p>

      <div className="grid gap-3">
        <Panel title="πλήθος ανά bin" subtitle="σταθερός άξονας → δες τις μπάρες να πέφτουν">
          <canvas
            ref={topRef}
            style={{ height: 140 }}
            className="block h-[140px] w-full"
            aria-label="Histogram counts per bin shrinking as bins narrow"
          />
        </Panel>
        <Panel
          title="πλήθος ανά πλάτος bin = πυκνότητα"
          subtitle="κλειδώνει στην ίδια καμπύλη"
        >
          <canvas
            ref={botRef}
            style={{ height: 140 }}
            className="block h-[140px] w-full"
            aria-label="Histogram density (count per unit width) locking onto a fixed curve"
          />
        </Panel>
      </div>

      <div className="mt-3 rounded-md border border-border bg-bg p-3">
        <label className="block text-xs text-fg-muted">
          πλάτος bin Δ ={' '}
          <span className="font-mono text-fg tabular-nums">{bw.toFixed(2)}</span>
          <span className="ml-3 text-fg-subtle">
            κεντρικό bin: πλήθος ={' '}
            <span className="font-mono text-fg tabular-nums">{centerCount.toFixed(0)}</span>{' '}
            → πυκνότητα = πλήθος/Δ ={' '}
            <span className="font-mono text-fg tabular-nums">{(centerCount / bw).toFixed(0)}</span>{' '}
            (σταθερή)
          </span>
        </label>
        <input
          type="range"
          min={W_MIN}
          max={W_MAX}
          step={0.05}
          value={bw}
          onChange={(e) => setBw(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Bin width"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Ακριβώς η ιστορία του φάσματος: το <span className="font-mono">aₖ</span> είναι σαν
        το «πλήθος ανά bin» (πέφτει καθώς πυκνώνουν οι γραμμές), και το{' '}
        <span className="font-mono">T₀·aₖ = aₖ/Δf = X(f)</span> είναι σαν την «πυκνότητα»
        (μένει). Στένεμα bin ↔ <span className="font-mono">Δf = 1/T₀ → 0</span>.
      </div>
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
        <span className="font-mono text-[10px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

const PAD_X = 26
const PAD_Y = 12

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}

function drawBars(
  ctx: CanvasRenderingContext2D,
  colors: ThemeColors,
  bw: number,
  xt: (x: number) => number,
  yv: (v: number) => number,
  yZero: number,
  heightOf: (center: number) => number,
) {
  const accentRgb = getRGB(colors.accent)
  ctx.fillStyle = `rgba(${accentRgb}, 0.20)`
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = bw < 0.25 ? 0.5 : 0.9
  const kMax = Math.floor(X_MAX / bw)
  for (let k = -kMax; k <= kMax; k++) {
    const c = k * bw
    const xL = xt(c - bw / 2)
    const xR = xt(c + bw / 2)
    const yT = yv(heightOf(c))
    ctx.fillRect(xL, yT, xR - xL, yZero - yT)
    ctx.strokeRect(xL, yT, xR - xL, yZero - yT)
  }
}

function axis(
  ctx: CanvasRenderingContext2D,
  colors: ThemeColors,
  w: number,
  yZero: number,
) {
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()
}

// TOP: count per bin = SCALE·d(c)·Δ (∝ Δ), fixed scale.
function drawTop(canvas: HTMLCanvasElement, colors: ThemeColors, bw: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const yMax = SCALE * d(0) * W_MAX // tallest possible center bar
  const xt = (x: number) => lerp(x, -X_MAX, X_MAX, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax * 1.08, -yMax * 0.1, PAD_Y, h - PAD_Y)
  const yZero = yv(0)
  axis(ctx, colors, w, yZero)
  drawBars(ctx, colors, bw, xt, yv, yZero, (c) => SCALE * d(c) * bw)
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('πλήθος', PAD_X + 2, PAD_Y + 4)
}

// BOTTOM: density = count/Δ = SCALE·d(c), bars lock onto the fixed curve.
function drawBottom(canvas: HTMLCanvasElement, colors: ThemeColors, bw: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const yMax = SCALE * d(0)
  const xt = (x: number) => lerp(x, -X_MAX, X_MAX, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax * 1.08, -yMax * 0.1, PAD_Y, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  drawBars(ctx, colors, bw, xt, yv, yZero, (c) => SCALE * d(c))
  axis(ctx, colors, w, yZero)

  // The fixed density curve the bar-tops trace.
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.8
  ctx.beginPath()
  const STEPS = 240
  for (let i = 0; i <= STEPS; i++) {
    const x = lerp(i, 0, STEPS, -X_MAX, X_MAX)
    const y = yv(SCALE * d(x))
    if (i === 0) ctx.moveTo(xt(x), y)
    else ctx.lineTo(xt(x), y)
  }
  ctx.stroke()

  ctx.fillStyle = colors.accent
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('πυκνότητα', PAD_X + 2, PAD_Y + 4)
}
