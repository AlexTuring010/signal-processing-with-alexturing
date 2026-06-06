'use client'

import { useEffect, useRef } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * FT §2.1 (coda) — confirm X₂/(2T₀) = X₀/T₀ by OVERLAYING the two coefficient
 * sets on one frequency axis (static — no slider; the point is the equality).
 *
 * Time: one rect-train, shown with a T₀ cell (one rect) and a 2T₀ cell (two
 * rects) — the same signal, two ways to choose the period.
 *
 * Frequency (overlaid):
 *   - one-copy coefficients |X₀(k/T₀)|/T₀ at k/T₀  → hollow accent RINGS
 *   - two-copy coefficients |X₂(k/2T₀)|/2T₀ at k/2T₀ → filled purple DOTS
 * Each purple dot sits exactly inside an accent ring (equal); the extra (odd)
 * purple dots are on the axis (zeros — the two copies cancel there).
 *
 * Magnitudes |X| are plotted (placement only affects phase). Width matches the
 * single-rect "Slide 33" viz (τ = 1, T₀ = 2).
 */

const TAU = 1
const T0 = 2
const C2 = '#7c3aed' // two-copy colour (purple)

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}
function X0(f: number) {
  return Math.abs(TAU * sinc(f * TAU))
}
function X2(f: number) {
  return Math.abs(2 * TAU * sinc(f * TAU) * Math.cos(Math.PI * f * T0))
}

export function TwoPulsesToCoefficients() {
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const draw = () => {
      const colors = getThemeColors()
      if (!colors) return
      if (timeRef.current) drawTime(timeRef.current, colors)
      if (freqRef.current) drawFreq(freqRef.current, colors)
    }
    draw()
    const obs = new MutationObserver(draw)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'style'] })
    window.addEventListener('resize', draw)
    return () => {
      obs.disconnect()
      window.removeEventListener('resize', draw)
    }
  }, [])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Δύο αντίγραφα (÷2T₀) δίνουν τους ίδιους συντελεστές με έναν (÷T₀)
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Το <strong>ίδιο</strong> rect-train, δύο επιλογές περιόδου. Στο φάσμα, οι συντελεστές των δύο
        περιγραφών μπαίνουν στον <strong>ίδιο άξονα</strong>:{' '}
        <span style={{ color: 'rgb(var(--accent))' }}>κύκλοι</span> για τον έναν (
        <span className="font-mono">÷T₀</span>),{' '}
        <span style={{ color: C2 }} className="font-semibold">μωβ τελείες</span> για τους δύο (
        <span className="font-mono">÷2T₀</span>). Κάθε μωβ τελεία κάθεται <strong>μέσα</strong> σε έναν
        κύκλο — ίδιοι συντελεστές.
      </p>

      <Panel title="Στον χρόνο — το ίδιο σήμα, ομαδοποιημένο δύο τρόπους" subtitle="πάνω: μονάδα 1 παλμός (T₀) · κάτω: μονάδα 2 αντίγραφα (2T₀)">
        <canvas ref={timeRef} style={{ height: 152 }} className="block h-[152px] w-full" aria-label="The same rect train grouped into single rects (period T0) and into pairs (period 2T0)" />
      </Panel>
      <div className="mt-3">
        <Panel title="Στη συχνότητα — οι δύο σειρές συντελεστών μαζί" subtitle="μωβ τελείες μέσα στους κύκλους = ίσοι (άξονας: |X|)">
          <canvas ref={freqRef} style={{ height: 200 }} className="block h-[200px] w-full" aria-label="Both coefficient sets overlaid; purple dots inside the rings" />
        </Panel>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Γιατί ίσοι;</strong> Στις αρμονικές τα δύο αντίγραφα <strong>προστίθενται</strong>, άρα{' '}
        <span className="font-mono">X₂ = 2X₀</span> εκεί· διαιρείς όμως με <strong>διπλάσια</strong>{' '}
        περίοδο, <span className="font-mono">2T₀</span> — το <span className="font-mono">×2</span> και το{' '}
        <span className="font-mono">÷2</span> φεύγουν, και μένει <span className="font-mono">X₀/T₀</span>.
        Ανάμεσα, τα αντίγραφα <strong>αλληλοαναιρούνται</strong> (<span className="font-mono">X₂ = 0</span>):
        οι ενδιάμεσες μωβ τελείες είναι μηδέν.
      </div>
      <p className="mt-1 text-[10px] text-fg-subtle">σταθερά: πλάτος rect, εσωτερική απόσταση T₀ · το γράφημα δείχνει το μέτρο |X|</p>
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

const PAD_X = 32
const PAD_Y = 14

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}

function drawTime(canvas: HTMLCanvasElement, colors: ThemeColors) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const tDom = 5.5
  const bandH = (h - 3 * PAD_Y) / 2
  const top = { t: PAD_Y, b: PAD_Y + bandH }
  const bot = { t: 2 * PAD_Y + bandH, b: 2 * PAD_Y + 2 * bandH }
  drawGroupedTrain(ctx, colors, w, top, tDom, T0, getRGB(colors.accent), 'μονάδα: 1 παλμός — επανάληψη ανά T₀')
  drawGroupedTrain(ctx, colors, w, bot, tDom, 2 * T0, getRGB(C2), 'μονάδα: 2 αντίγραφα — επανάληψη ανά 2T₀')
}

// the same rect-train, with tiling "unit" boxes of width cellPeriod (each box
// holds 1 rect when cellPeriod = T₀, a PAIR when cellPeriod = 2T₀)
function drawGroupedTrain(
  ctx: CanvasRenderingContext2D,
  colors: ThemeColors,
  w: number,
  band: { t: number; b: number },
  tDom: number,
  cellPeriod: number,
  boxRgb: string,
  label: string,
) {
  const xt = (t: number) => lerp(t, -tDom, tDom, PAD_X, w - PAD_X)
  const yBase = band.b - 14
  const yTopR = band.t + 14
  const yBoxTop = band.t + 6
  const accentRgb = getRGB(colors.accent)

  // grouping boxes: cell j = [j·cellPeriod − T₀/2 , +cellPeriod]
  const jMax = Math.ceil((tDom + T0) / cellPeriod) + 1
  for (let j = -jMax; j <= jMax; j++) {
    const cl = j * cellPeriod - T0 / 2
    const cr = cl + cellPeriod
    if (cr < -tDom || cl > tDom) continue
    const bx = xt(Math.max(cl, -tDom))
    const bxR = xt(Math.min(cr, tDom))
    ctx.fillStyle = `rgba(${boxRgb}, 0.10)`
    ctx.fillRect(bx, yBoxTop, bxR - bx, yBase - yBoxTop)
    ctx.strokeStyle = `rgba(${boxRgb}, 0.65)`
    ctx.lineWidth = 1.2
    ctx.strokeRect(bx, yBoxTop, bxR - bx, yBase - yBoxTop)
  }

  // axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yBase)
  ctx.lineTo(w - PAD_X + 4, yBase)
  ctx.stroke()

  // train rects at multiples of T₀
  ctx.fillStyle = `rgba(${accentRgb}, 0.32)`
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.5
  for (let c = -4; c <= 4; c += T0) {
    const a = c - TAU / 2
    const b = c + TAU / 2
    const xL = xt(Math.max(a, -tDom))
    const xR = xt(Math.min(b, tDom))
    ctx.fillRect(xL, yTopR, xR - xL, yBase - yTopR)
    ctx.strokeRect(xL, yTopR, xR - xL, yBase - yTopR)
  }

  // label
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(label, PAD_X + 2, band.b - 2)
}

function drawFreq(canvas: HTMLCanvasElement, colors: ThemeColors) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const fDom = 3
  const yMax = (1 / T0) * 1.3 // a₀ = 1/T₀ = 0.5
  const xt = (f: number) => lerp(f, -fDom, fDom, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.16 * yMax, PAD_Y + 6, h - PAD_Y - 8)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  // axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  // faint reference: the one-copy coefficient envelope |X₀|/T₀
  ctx.strokeStyle = colors.accent
  ctx.globalAlpha = 0.3
  ctx.lineWidth = 1.2
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  const STEPS = 600
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -fDom, fDom)
    const y = yv(X0(f) / T0)
    if (i === 0) ctx.moveTo(xt(f), y)
    else ctx.lineTo(xt(f), y)
  }
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1

  // two-copy dots at k/2T₀ (purple), under the rings
  const k2 = Math.ceil(fDom * 2 * T0) + 1
  for (let k = -k2; k <= k2; k++) {
    const f = k / (2 * T0)
    if (Math.abs(f) > fDom) continue
    const v = X2(f) / (2 * T0)
    const x = xt(f)
    ctx.strokeStyle = C2
    ctx.globalAlpha = 0.5
    ctx.lineWidth = 1.4
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, yv(v))
    ctx.stroke()
    ctx.globalAlpha = 1
    ctx.fillStyle = C2
    ctx.beginPath()
    ctx.arc(x, yv(v), 2.8, 0, Math.PI * 2)
    ctx.fill()
  }

  // one-copy rings at k/T₀ (accent), on top
  const k1 = Math.ceil(fDom * T0) + 1
  for (let k = -k1; k <= k1; k++) {
    const f = k / T0
    if (Math.abs(f) > fDom) continue
    const v = X0(f) / T0
    const x = xt(f)
    ctx.strokeStyle = colors.accent
    ctx.globalAlpha = 0.4
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, yv(v))
    ctx.stroke()
    ctx.globalAlpha = 1
    ctx.lineWidth = 1.6
    ctx.beginPath()
    ctx.arc(x, yv(v), 4.6, 0, Math.PI * 2)
    ctx.stroke()
  }

  // legend (magnitudes plotted)
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.arc(PAD_X + 6, PAD_Y + 6, 4.2, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('ένας παλμός:  |X₀| / T₀', PAD_X + 16, PAD_Y + 9)
  ctx.fillStyle = C2
  ctx.beginPath()
  ctx.arc(PAD_X + 6, PAD_Y + 20, 2.8, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillText('δύο αντίγραφα:  |X₂| / 2T₀', PAD_X + 16, PAD_Y + 23)

  // y-axis quantity + f label
  ctx.save()
  ctx.translate(PAD_X - 20, (PAD_Y + yZero) / 2 + 6)
  ctx.rotate(-Math.PI / 2)
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'center'
  ctx.fillText('|X| / περίοδο', 0, 0)
  ctx.restore()
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'center'
  ctx.fillText('f', w - PAD_X + 2, yZero - 4)
}
