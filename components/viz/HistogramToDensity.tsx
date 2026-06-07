'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * The everyday rehearsal for "amount-per-line vanishes, density survives", FT §1.
 *
 * A plain histogram of some data. The slider is the NUMBER OF BINS, and dragging
 * RIGHT = more bins = narrower bins — deliberately the SAME direction as the aₖ
 * vizzes (drag right = bigger T₀ = finer Δf = approach the limit):
 *   - TOP — count PER BIN. As bins get finer each bar shrinks toward 0 (the same
 *     fixed data split into ever finer boxes). Nothing is lost — it's diluted.
 *   - BOTTOM — count per UNIT WIDTH = density (= count / bin width). As bins get
 *     finer the bars lock onto a fixed smooth curve.
 *
 * Maps 1:1 onto the spectrum: more/narrower bins ↔ bigger T₀ (denser lines);
 * count-per-bin ↔ aₖ (falls); count-per-width ↔ T₀·aₖ = X(f) (stays).
 *
 * Idealised (noiseless) histogram: count(bin) = SCALE · d(center) · Δ, so
 * count/Δ = SCALE · d(center) lands exactly on the curve.
 */

const NBINS_MIN = 5
const NBINS_MAX = 40
const SCALE = 100 // turns the density into believable "counts"
const X_MAX = 3
const BW_MAX = (2 * X_MAX) / NBINS_MIN // widest bin (fewest bins) → fixes the top-panel scale

// Shape of the data: a bell curve d(x) = e^{-x²/2} (peak 1 at 0).
function d(x: number) {
  return Math.exp(-0.5 * x * x)
}

export function HistogramToDensity() {
  const [nBins, setNBins] = useState(9)
  const topRef = useRef<HTMLCanvasElement | null>(null)
  const botRef = useRef<HTMLCanvasElement | null>(null)
  const bw = (2 * X_MAX) / nBins
  const peakCount = SCALE * d(0) * bw // tallest bar (center)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (topRef.current) drawTop(topRef.current, colors, bw)
    if (botRef.current) drawBottom(botRef.current, colors, bw)
  }, [bw])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Ιστόγραμμα: πιο πολλά (στενότερα) bins — το «ανά bin» σβήνει, η πυκνότητα μένει
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Ένα <strong>ιστόγραμμα</strong> κάποιων δεδομένων: χωρίζουμε τον άξονα σε{' '}
        <strong>bins</strong> (κουτάκια) και μετράμε πόσα δεδομένα πέφτουν σε καθένα — αυτό
        είναι το ύψος της μπάρας. Σύρε <strong>δεξιά για πιο πολλά (άρα πιο στενά) bins</strong>{' '}
        — ίδια φορά με το <span className="font-mono">T₀</span> παραπάνω.{' '}
        <strong>Πάνω</strong>: το <em>πλήθος ανά bin</em> πέφτει προς το 0 (τα ίδια δεδομένα
        σε λεπτότερα κουτάκια). <strong>Κάτω</strong>: το <em>πλήθος ανά πλάτος bin</em> — η{' '}
        <strong>πυκνότητα</strong> — κλειδώνει σε μια σταθερή καμπύλη.
      </p>

      <div className="grid gap-3">
        <Panel title="πλήθος ανά bin" subtitle="σαν το aₖ — πέφτει">
          <canvas
            ref={topRef}
            style={{ height: 140 }}
            className="block h-[140px] w-full"
            aria-label="Histogram counts per bin shrinking as bins get finer"
          />
        </Panel>
        <Panel title="πλήθος ανά πλάτος bin = πυκνότητα" subtitle="σαν το X(f) — κλειδώνει στην καμπύλη">
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
          αριθμός bins ={' '}
          <span className="font-mono text-fg tabular-nums">{nBins}</span>
          {' · '}πλάτος bin Δ ={' '}
          <span className="font-mono text-fg tabular-nums">{bw.toFixed(2)}</span>
          <span className="ml-3 text-fg-subtle">
            μεγαλύτερη μπάρα: πλήθος ={' '}
            <span className="font-mono text-fg tabular-nums">{peakCount.toFixed(0)}</span>{' '}
            → πυκνότητα = πλήθος/Δ ={' '}
            <span className="font-mono text-fg tabular-nums">{(peakCount / bw).toFixed(0)}</span>{' '}
            (σταθερή)
          </span>
        </label>
        <input
          type="range"
          min={NBINS_MIN}
          max={NBINS_MAX}
          step={1}
          value={nBins}
          onChange={(e) => setNBins(parseInt(e.target.value, 10))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Number of bins (more = narrower)"
        />
        <div className="mt-1 flex justify-between text-[10px] text-fg-subtle">
          <span>λίγα, φαρδιά bins</span>
          <span>πολλά, στενά bins →</span>
        </div>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <p className="mb-1">
          Ακριβώς η ιστορία του φάσματος, με τα <strong>bins</strong> στη θέση των{' '}
          <strong>αρμονικών γραμμών</strong>:
        </p>
        <ul className="ml-4 list-disc space-y-0.5">
          <li>
            πιο πολλά / στενότερα bins ↔ μεγαλύτερο <span className="font-mono">T₀</span> (πιο
            πυκνές γραμμές, <span className="font-mono">Δf = 1/T₀ → 0</span>)
          </li>
          <li>
            «πλήθος ανά bin» ↔ <span className="font-mono">aₖ</span> (πέφτει)
          </li>
          <li>
            «ανά πλάτος bin» = πυκνότητα ↔ <span className="font-mono">T₀·aₖ = X(f)</span> (μένει)
          </li>
        </ul>
        <p className="mt-1">
          Και στις δύο: σύρε <strong>δεξιά → πλησιάζεις το όριο</strong>, και η πυκνότητα
          κλειδώνει.
        </p>
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
  const yMax = SCALE * d(0) * BW_MAX // tallest possible center bar (fewest bins)
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
