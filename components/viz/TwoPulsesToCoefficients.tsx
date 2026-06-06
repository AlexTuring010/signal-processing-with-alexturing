'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * FT §2.1 (coda) — "two copies, period 2T₀, give the SAME coefficients".
 *
 * The same rect-train, described two ways:
 *   • one rect, period T₀   → aₖ = X(k/T₀)/T₀      (samples every 1/T₀)
 *   • two copies, period 2T₀ → aₖ = X₂(k/2T₀)/(2T₀) (samples every 1/2T₀)
 *
 * They are equal: at the harmonics f = m/T₀ the two copies add in phase, so
 * X₂ = 2X there; dividing by the doubled period 2T₀ cancels that 2, giving
 * X₂/(2T₀) = X/T₀. Between the harmonics the copies cancel (X₂ = 0), so the
 * extra (odd) samples are zero. The viz puts the two coefficient grids on a
 * shared axis with guide lines at the harmonics, so the nonzero bottom stems
 * land exactly on the top stems.
 *
 * One knob: τ (rect width) — to show the match holds for any rect. T₀ = 2 fixed.
 * Magnitudes are plotted (the placement only affects phase, not |aₖ|).
 */

const T0 = 2
const TAU_MIN = 0.3
const TAU_MAX = 1.6

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}

function X(f: number, tau: number) {
  return Math.abs(tau * sinc(f * tau)) // FT of one rect
}
function X2(f: number, tau: number) {
  return Math.abs(2 * tau * sinc(f * tau) * Math.cos(Math.PI * f * T0)) // two copies spaced T₀
}

export function TwoPulsesToCoefficients() {
  const [tau, setTau] = useState(0.7)
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, tau)
    if (freqRef.current) drawFreq(freqRef.current, colors, tau)
  }, [tau])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Δύο αντίγραφα (÷2T₀) δίνουν τους ίδιους συντελεστές με έναν (÷T₀)
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Το <strong>ίδιο</strong> rect-train, δύο περιγραφές. Δεξιά, πάνω:{' '}
        <span className="font-mono">aₖ = X/T₀</span> (δείγματα ανά <span className="font-mono">1/T₀</span>).
        Κάτω: <span className="font-mono">aₖ = X₂/2T₀</span> (δείγματα ανά{' '}
        <span className="font-mono">1/2T₀</span>). Οι <strong>κατακόρυφες γραμμές</strong> δείχνουν ότι οι
        μη-μηδενικές στήλες κάτω πέφτουν <strong>ακριβώς</strong> πάνω στις στήλες πάνω — ίδιοι
        συντελεστές. Οι ενδιάμεσες (κόκκινες) είναι <strong>μηδέν</strong>.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="ένα rect-train, δύο επιλογές περιόδου">
          <canvas ref={timeRef} style={{ height: 150 }} className="block h-[150px] w-full" aria-label="One rect train, with a T0 cell and a 2T0 cell marked" />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="aₖ = X/T₀ (πάνω) vs aₖ = X₂/2T₀ (κάτω)">
          <canvas ref={freqRef} style={{ height: 230 }} className="block h-[230px] w-full" aria-label="Two coefficient grids on a shared axis, coinciding at the harmonics" />
        </Panel>
      </div>

      <div className="mt-3 rounded-md border border-border bg-bg p-3">
        <label className="block text-xs text-fg-muted">
          πλάτος rect τ = <span className="font-mono text-fg tabular-nums">{tau.toFixed(2)}</span>{' '}
          <span className="text-fg-subtle">(η ισότητα ισχύει για κάθε τ)</span>
        </label>
        <input type="range" min={TAU_MIN} max={TAU_MAX} step={0.05} value={tau} onChange={(e) => setTau(parseFloat(e.target.value))} className="mt-2 w-full accent-[rgb(var(--accent))]" aria-label="Rect width tau" />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Γιατί ίσοι; Στις αρμονικές τα δύο αντίγραφα <strong>προστίθενται</strong>, άρα{' '}
        <span className="font-mono">X₂ = 2X</span> εκεί· διαιρείς όμως με <strong>διπλάσια</strong>{' '}
        περίοδο, <span className="font-mono">2T₀</span> — το <span className="font-mono">×2</span> και το{' '}
        <span className="font-mono">÷2</span> φεύγουν, και μένει <span className="font-mono">X/T₀</span>.
        Ανάμεσα, τα αντίγραφα <strong>αλληλοαναιρούνται</strong> (<span className="font-mono">X₂ = 0</span>).
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
const PAD_Y = 14

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}

function drawTime(canvas: HTMLCanvasElement, colors: ThemeColors, tau: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const tDom = 5.5
  const xt = (t: number) => lerp(t, -tDom, tDom, PAD_X, w - PAD_X)
  const yBase = h - 34
  const yTopRect = 26
  const accentRgb = getRGB(colors.accent)

  // two period-cells: a T₀ cell [-1,1] (one rect) and a 2T₀ cell [1,5] (two rects)
  ctx.fillStyle = `rgba(${accentRgb}, 0.07)`
  ctx.fillRect(xt(-1), yTopRect - 8, xt(1) - xt(-1), yBase - yTopRect + 8)
  ctx.fillRect(xt(1), yTopRect - 8, xt(5) - xt(1), yBase - yTopRect + 8)
  ctx.strokeStyle = `rgba(${accentRgb}, 0.4)`
  ctx.setLineDash([2, 2])
  ctx.lineWidth = 1
  for (const x of [-1, 1, 5]) {
    ctx.beginPath()
    ctx.moveTo(xt(x), yTopRect - 8)
    ctx.lineTo(xt(x), yBase)
    ctx.stroke()
  }
  ctx.setLineDash([])

  // axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yBase)
  ctx.lineTo(w - PAD_X + 4, yBase)
  ctx.stroke()

  // rect train, rects at 0, ±2, ±4
  ctx.fillStyle = `rgba(${accentRgb}, 0.22)`
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.6
  for (let c = -4; c <= 4; c += 2) {
    const a = c - tau / 2
    const b = c + tau / 2
    if (b < -tDom || a > tDom) continue
    const xL = xt(Math.max(a, -tDom))
    const xR = xt(Math.min(b, tDom))
    ctx.fillRect(xL, yTopRect, xR - xL, yBase - yTopRect)
    ctx.strokeRect(xL, yTopRect, xR - xL, yBase - yTopRect)
  }

  // cell labels
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('1 αντίγραφο = T₀', (xt(-1) + xt(1)) / 2, h - 18)
  ctx.fillText('2 αντίγραφα = 2T₀', (xt(1) + xt(5)) / 2, h - 18)
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('ίδιο σήμα — δύο επιλογές περιόδου', w / 2, h - 5)
}

function drawFreq(canvas: HTMLCanvasElement, colors: ThemeColors, tau: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const fDom = 3
  const yMax = (tau / T0) * 1.3
  const bandH = (h - 3 * PAD_Y) / 2
  const topB = { t: PAD_Y, b: PAD_Y + bandH }
  const botB = { t: 2 * PAD_Y + bandH, b: 2 * PAD_Y + 2 * bandH }
  const xt = (f: number) => lerp(f, -fDom, fDom, PAD_X, w - PAD_X)

  // vertical guides at the harmonics f = m/T₀, spanning both bands
  ctx.strokeStyle = `rgba(${getRGB(colors.accent)}, 0.35)`
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  const mMax = Math.floor(fDom * T0)
  for (let m = -mMax; m <= mMax; m++) {
    const x = xt(m / T0)
    ctx.beginPath()
    ctx.moveTo(x, topB.t + 8)
    ctx.lineTo(x, botB.b)
    ctx.stroke()
  }
  ctx.setLineDash([])

  drawCoeffBand(ctx, colors, w, topB.t, topB.b, (f) => X(f, tau) / T0, T0, yMax, 'ένας παλμός:  aₖ = X / T₀', false)
  drawCoeffBand(ctx, colors, w, botB.t, botB.b, (f) => X2(f, tau) / (2 * T0), 2 * T0, yMax, 'δύο αντίγραφα:  aₖ = X₂ / 2T₀', true)
}

function drawCoeffBand(
  ctx: CanvasRenderingContext2D,
  colors: ThemeColors,
  w: number,
  bandTop: number,
  bandBot: number,
  curve: (f: number) => number,
  period: number,
  yMax: number,
  label: string,
  markZeros: boolean,
) {
  const fDom = 3
  const xt = (f: number) => lerp(f, -fDom, fDom, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.08 * yMax, bandTop + 12, bandBot)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  // axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  // coefficient curve X/period (faint) — where the stems sit
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1.1
  ctx.globalAlpha = 0.5
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  const STEPS = 600
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -fDom, fDom)
    const y = yv(curve(f))
    if (i === 0) ctx.moveTo(xt(f), y)
    else ctx.lineTo(xt(f), y)
  }
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1

  // stems at f = k/period
  const kMax = Math.ceil(fDom * period) + 1
  for (let k = -kMax; k <= kMax; k++) {
    const f = k / period
    if (Math.abs(f) > fDom) continue
    const v = curve(f)
    const x = xt(f)
    const isZero = v < 1e-4
    if (isZero && markZeros) {
      // a sample that lands on zero (copies cancel)
      ctx.strokeStyle = colors.danger
      ctx.lineWidth = 1.3
      ctx.beginPath()
      ctx.arc(x, yZero, 3, 0, Math.PI * 2)
      ctx.stroke()
    } else if (!isZero) {
      ctx.strokeStyle = colors.accent
      ctx.lineWidth = 1.8
      ctx.beginPath()
      ctx.moveTo(x, yZero)
      ctx.lineTo(x, yv(v))
      ctx.stroke()
      ctx.fillStyle = colors.accent
      ctx.beginPath()
      ctx.arc(x, yv(v), 2.6, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // label
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(label, PAD_X + 2, bandTop + 9)
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'center'
  ctx.fillText('f', w - PAD_X + 2, yZero - 4)
}
