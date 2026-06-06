'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * FT §2.1 (coda) — two Slide-33-style cases, sharing one "offset" slider.
 *
 * Case 1: ONE rect (FT = X₀). Make it periodic, period T₀ + offset. Its FS
 *         coefficients are samples of X₀ at k/(T₀+offset), height X₀/(T₀+offset).
 * Case 2: TWO copies of the same rect (centres T₀ apart, FT = X₂). Make them
 *         periodic, period 2T₀ + offset (extra space added outside the pair, the
 *         inner T₀ gap fixed). Coefficients are samples of X₂ at k/(2T₀+offset),
 *         height X₂/(2T₀+offset).
 *
 * At offset = 0 the two periodic signals are the SAME rect-train, so:
 *      X₂(m/T₀)/(2T₀) = X₀(m/T₀)/T₀ = aₘ.
 * X₂ is twice X₀ at the harmonics (the copies add) but we divide by twice the
 * period — the 2's cancel. Slide offset up and the two become different signals.
 *
 * One knob: offset (extra empty space). Rect width and the inner gap are fixed.
 * Magnitudes |X| are plotted (placement only affects phase).
 */

const TAU = 0.8 // rect width (fixed)
const T0 = 2 // base period of the single rect (fixed)
const OFFSET_MAX = 6

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}
function X0mag(f: number) {
  return Math.abs(TAU * sinc(f * TAU)) // FT of one rect
}
function X2mag(f: number) {
  return Math.abs(2 * TAU * sinc(f * TAU) * Math.cos(Math.PI * f * T0)) // two copies, gap T₀
}

export function TwoPulsesToCoefficients() {
  const [offset, setOffset] = useState(0)
  const t1 = useRef<HTMLCanvasElement | null>(null)
  const f1 = useRef<HTMLCanvasElement | null>(null)
  const t2 = useRef<HTMLCanvasElement | null>(null)
  const f2 = useRef<HTMLCanvasElement | null>(null)

  const T1 = T0 + offset
  const T2 = 2 * T0 + offset

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (t1.current) drawTime(t1.current, colors, 'one', T1)
    if (f1.current) drawFreq(f1.current, colors, X0mag, T1, 'X₀(f)', 'X₀/T₀')
    if (t2.current) drawTime(t2.current, colors, 'two', T2)
    if (f2.current) drawFreq(f2.current, colors, X2mag, T2, 'X(f)', 'X/2T₀')
  }, [T1, T2])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Ένας παλμός (÷T₀) και δύο αντίγραφα (÷2T₀) → οι ίδιοι συντελεστές
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Δύο περιπτώσεις, ίδιο μοτίβο με πριν: πάνω το κομμάτι (με FT{' '}
        <span className="font-mono">X₀</span> ή <span className="font-mono">X₂</span>), κάτω το ίδιο
        κομμάτι periodic, και δεξιά οι συντελεστές ως δείγματα της περιβάλλουσας ÷ περίοδο. Σύρε το{' '}
        <strong>offset</strong> (επιπλέον κενό): η περίοδος μεγαλώνει, τα δείγματα πυκνώνουν, οι{' '}
        <span className="font-mono">aₖ</span> χαμηλώνουν.
      </p>

      <div className="mb-1 mt-1 text-xs font-semibold text-fg">Περίπτωση 1 — ένας παλμός, περίοδος T₀</div>
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="πάνω: ο παλμός · κάτω: periodic">
          <canvas ref={t1} style={{ height: 150 }} className="block h-[150px] w-full" aria-label="One rect and its periodic train" />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="aₖ = X₀ / περίοδο">
          <canvas ref={f1} style={{ height: 150 }} className="block h-[150px] w-full" aria-label="Envelope X0 sampled and divided by the period" />
        </Panel>
      </div>

      <div className="mb-1 mt-3 text-xs font-semibold text-fg">Περίπτωση 2 — δύο αντίγραφα (απόσταση T₀), περίοδος 2T₀</div>
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="πάνω: τα δύο αντίγραφα · κάτω: periodic">
          <canvas ref={t2} style={{ height: 150 }} className="block h-[150px] w-full" aria-label="Two rects and their periodic train" />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="aₖ = X / περίοδο">
          <canvas ref={f2} style={{ height: 150 }} className="block h-[150px] w-full" aria-label="Envelope X2 sampled and divided by the period" />
        </Panel>
      </div>

      <div className="mt-3 rounded-md border border-border bg-bg p-3">
        <label className="block text-xs text-fg-muted">
          offset (επιπλέον κενό) ={' '}
          <span className="font-mono text-fg tabular-nums">{offset.toFixed(1)}</span>
          <span className="ml-3 text-fg-subtle">
            περίοδοι: ένας → <span className="font-mono">T₀+offset = {T1.toFixed(1)}</span> · δύο →{' '}
            <span className="font-mono">2T₀+offset = {T2.toFixed(1)}</span>
          </span>
        </label>
        <input type="range" min={0} max={OFFSET_MAX} step={0.1} value={offset} onChange={(e) => setOffset(parseFloat(e.target.value))} className="mt-2 w-full accent-[rgb(var(--accent))]" aria-label="Extra empty space (offset)" />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Στο <span className="font-mono">offset = 0</span> τα δύο periodic σήματα (κάτω) είναι{' '}
        <strong>ολόιδια</strong>, και οι συντελεστές <strong>ταυτίζονται</strong>:{' '}
        <span className="font-mono">aₖ = X / 2T₀ = X₀ / T₀</span>. Η <span className="font-mono">X</span>{' '}
        είναι <strong>διπλάσια</strong> της <span className="font-mono">X₀</span> (δύο αντίγραφα
        προστίθενται), αλλά διαιρείς με <strong>διπλάσια</strong> περίοδο — το ×2 και το ÷2 φεύγουν.
        Πρόσθεσε offset και τα δύο σήματα πλέον διαφέρουν.
      </div>
      <p className="mt-1 text-[10px] text-fg-subtle">σταθερά: πλάτος rect, εσωτερική απόσταση T₀ · εμφανίζεται το |X|</p>
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

const PAD_X = 28
const PAD_Y = 13

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}

function drawTime(canvas: HTMLCanvasElement, colors: ThemeColors, kind: 'one' | 'two', period: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const tDom = 9
  const bandH = (h - 3 * PAD_Y) / 2
  const top = { t: PAD_Y, b: PAD_Y + bandH }
  const bot = { t: 2 * PAD_Y + bandH, b: 2 * PAD_Y + 2 * bandH }

  // unit (fixed)
  const unit = kind === 'one' ? [0] : [0, T0]
  drawRectRow(ctx, colors, w, top, tDom, unit, kind === 'one' ? 'ο παλμός' : 'δύο αντίγραφα')

  // periodic train (period = period)
  const per: number[] = []
  for (let k = -6; k <= 6; k++) {
    if (kind === 'one') per.push(k * period)
    else {
      per.push(k * period)
      per.push(k * period + T0)
    }
  }
  drawRectRow(ctx, colors, w, bot, tDom, per, `periodic · περίοδος ${period.toFixed(1)}`)
}

function drawRectRow(
  ctx: CanvasRenderingContext2D,
  colors: ThemeColors,
  w: number,
  band: { t: number; b: number },
  tDom: number,
  centers: number[],
  label: string,
) {
  const xt = (t: number) => lerp(t, -tDom, tDom, PAD_X, w - PAD_X)
  const yBase = band.b - 3
  const yTopR = band.t + 14
  const accentRgb = getRGB(colors.accent)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yBase)
  ctx.lineTo(w - PAD_X + 4, yBase)
  ctx.stroke()

  ctx.fillStyle = `rgba(${accentRgb}, 0.22)`
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.5
  for (const c of centers) {
    const a = c - TAU / 2
    const b = c + TAU / 2
    if (b < -tDom || a > tDom) continue
    const xL = xt(Math.max(a, -tDom))
    const xR = xt(Math.min(b, tDom))
    ctx.fillRect(xL, yTopR, xR - xL, yBase - yTopR)
    ctx.strokeRect(xL, yTopR, xR - xL, yBase - yTopR)
  }

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(label, PAD_X + 2, band.t + 9)
}

function drawFreq(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  envFn: (f: number) => number,
  period: number,
  envLabel: string,
  coeffLabel: string,
) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const fDom = 3
  const yMax = 2 * TAU * 1.18 // fits the taller (two-copy) envelope; shared by both freq plots
  const xt = (f: number) => lerp(f, -fDom, fDom, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.1 * yMax, PAD_Y + 4, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  // envelope |X| (gray dashed) — the "total" / shape
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1.2
  ctx.globalAlpha = 0.55
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  const STEPS = 600
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -fDom, fDom)
    const y = yv(envFn(f))
    if (i === 0) ctx.moveTo(xt(f), y)
    else ctx.lineTo(xt(f), y)
  }
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1

  // envelope / period (accent faint) — where the aₖ sit
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.3
  ctx.globalAlpha = 0.4
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -fDom, fDom)
    const y = yv(envFn(f) / period)
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
    const v = envFn(f) / period
    const x = xt(f)
    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 1.6
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, yv(v))
    ctx.stroke()
    ctx.fillStyle = colors.accent
    ctx.beginPath()
    ctx.arc(x, yv(v), 2.3, 0, Math.PI * 2)
    ctx.fill()
  }

  // labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(envLabel, PAD_X + 2, PAD_Y + 6)
  ctx.fillStyle = colors.accent
  ctx.fillText(coeffLabel, PAD_X + 2, PAD_Y + 18)
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'center'
  ctx.fillText('f', w - PAD_X + 2, yZero - 4)
}
