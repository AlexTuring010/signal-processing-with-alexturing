'use client'

import { useEffect, useRef } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * FT §2.1 (coda) — two Slide-33-style cases (static).
 *
 * Case 1: one rect (FT = X₀, a smooth sinc) → periodic, period T₀.
 *         aₖ = |X₀|/T₀, samples of X₀ at k/T₀.
 * Case 2: two copies (FT = X₂, a RIPPLED sinc — a different envelope) → periodic,
 *         period 2T₀, shown grouped in PAIRS. aₖ = |X₂|/2T₀, samples at k/2T₀.
 *
 * The two envelopes differ (X₂ = 2X₀ at the harmonics, and rippled), yet the
 * coefficients come out equal: dividing X₂ by the doubled period 2T₀ cancels the
 * factor 2. Both freq plots share the y-scale, so the aₖ stems sit at the same
 * heights in both. Magnitudes |X| are plotted; τ = 1, T₀ = 2 (as in Slide 33).
 */

const TAU = 1
const T0 = 2
const C2 = '#7c3aed' // two-copy accent (purple)

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
  const t1 = useRef<HTMLCanvasElement | null>(null)
  const f1 = useRef<HTMLCanvasElement | null>(null)
  const t2 = useRef<HTMLCanvasElement | null>(null)
  const f2 = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const draw = () => {
      const colors = getThemeColors()
      if (!colors) return
      if (t1.current) drawTimeCase(t1.current, colors, 'one')
      if (f1.current) drawFreqCase(f1.current, colors, X0, T0, '|X₀|', '|X₀|/T₀')
      if (t2.current) drawTimeCase(t2.current, colors, 'two')
      if (f2.current) drawFreqCase(f2.current, colors, X2, 2 * T0, '|X₂|', '|X₂|/2T₀')
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
        Διαφορετική περιβάλλουσα, ίδιοι συντελεστές
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Κάθε περίπτωση όπως στη Slide 33: το κομμάτι, από κάτω το periodic, και δεξιά η περιβάλλουσά
        του δειγματισμένη ÷ περίοδο. Οι δύο περιβάλλουσες είναι <strong>διαφορετικές</strong> —{' '}
        <span className="font-mono">X₂</span> είναι διπλάσια κι έχει κυματισμό — όμως οι{' '}
        <span className="font-mono">aₖ</span> βγαίνουν στο <strong>ίδιο ύψος</strong> (ίδιος κάθετος
        άξονας στα δύο φάσματα).
      </p>

      <div className="mb-1 text-xs font-semibold text-fg">Περίπτωση 1 — ένας παλμός (περίοδος T₀)</div>
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="η μονάδα / periodic ανά T₀">
          <canvas ref={t1} style={{ height: 168 }} className="block h-[168px] w-full" aria-label="One rect and its periodic train" />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="X₀ (λείο sinc) · aₖ = X₀/T₀">
          <canvas ref={f1} style={{ height: 168 }} className="block h-[168px] w-full" aria-label="Envelope X0 and its samples" />
        </Panel>
      </div>

      <div className="mb-1 mt-3 text-xs font-semibold text-fg">Περίπτωση 2 — δύο αντίγραφα (περίοδος 2T₀)</div>
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="η μονάδα (2) / periodic σε ζευγάρια ανά 2T₀">
          <canvas ref={t2} style={{ height: 168 }} className="block h-[168px] w-full" aria-label="Two rects and their periodic train, grouped in pairs" />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="X₂ (διπλάσια, με κυματισμό) · aₖ = X₂/2T₀">
          <canvas ref={f2} style={{ height: 168 }} className="block h-[168px] w-full" aria-label="Envelope X2 (rippled) and its samples" />
        </Panel>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Πρόσεξε: η περιβάλλουσα <span className="font-mono">X₂</span> είναι <strong>διπλάσια</strong> της{' '}
        <span className="font-mono">X₀</span> στις αρμονικές (τα δύο αντίγραφα προστίθενται) — αλλά
        διαιρείται με <strong>διπλάσια</strong> περίοδο. Το <span className="font-mono">×2</span> και το{' '}
        <span className="font-mono">÷2</span> αναιρούνται, κι έτσι τα <span className="font-mono">aₖ</span>{' '}
        πέφτουν στο ίδιο ύψος και στα δύο. (Ανάμεσα, η <span className="font-mono">X₂</span> μηδενίζεται →
        τα ενδιάμεσα δείγματα είναι μηδέν.)
      </div>
      <p className="mt-1 text-[10px] text-fg-subtle">σταθερά: πλάτος rect, εσωτερική απόσταση T₀ · τα φάσματα δείχνουν το μέτρο |X|</p>
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
const PAD_Y = 13

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}

function drawRectsAt(
  ctx: CanvasRenderingContext2D,
  colors: ThemeColors,
  xt: (t: number) => number,
  centers: number[],
  yTopR: number,
  yBase: number,
  tDom: number,
) {
  ctx.fillStyle = `rgba(${getRGB(colors.accent)}, 0.32)`
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
}

function drawTimeCase(canvas: HTMLCanvasElement, colors: ThemeColors, kind: 'one' | 'two') {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const tDom = 5.5
  const xt = (t: number) => lerp(t, -tDom, tDom, PAD_X, w - PAD_X)
  const cellPeriod = kind === 'one' ? T0 : 2 * T0
  const boxRgb = kind === 'one' ? getRGB(colors.accent) : getRGB(C2)
  const bandH = (h - 3 * PAD_Y) / 2
  const top = { t: PAD_Y, b: PAD_Y + bandH }
  const bot = { t: 2 * PAD_Y + bandH, b: 2 * PAD_Y + 2 * bandH }

  // --- top sub-axis: the unit, boxed ---
  {
    const yBase = top.b - 11
    const yTopR = top.t + 21
    const yBoxTop = top.t + 15
    const cl = -T0 / 2
    const cr = cl + cellPeriod
    ctx.fillStyle = `rgba(${boxRgb}, 0.10)`
    ctx.fillRect(xt(cl), yBoxTop, xt(cr) - xt(cl), yBase - yBoxTop)
    ctx.strokeStyle = `rgba(${boxRgb}, 0.65)`
    ctx.lineWidth = 1.2
    ctx.strokeRect(xt(cl), yBoxTop, xt(cr) - xt(cl), yBase - yBoxTop)

    ctx.strokeStyle = colors.border
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(PAD_X - 4, yBase)
    ctx.lineTo(w - PAD_X + 4, yBase)
    ctx.stroke()

    drawRectsAt(ctx, colors, xt, kind === 'one' ? [0] : [0, T0], yTopR, yBase, tDom)

    ctx.fillStyle = colors.fgMuted
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(kind === 'one' ? 'η μονάδα: 1 παλμός  (FT = X₀)' : 'η μονάδα: 2 αντίγραφα  (FT = X₂)', PAD_X + 2, top.t + 9)
  }

  // --- bottom sub-axis: periodic, grouped into cells of width cellPeriod ---
  {
    const yBase = bot.b - 11
    const yTopR = bot.t + 21
    const yBoxTop = bot.t + 15
    const jMax = Math.ceil((tDom + T0) / cellPeriod) + 1
    for (let j = -jMax; j <= jMax; j++) {
      const cl = j * cellPeriod - T0 / 2
      const cr = cl + cellPeriod
      if (cr < -tDom || cl > tDom) continue
      const bx = xt(Math.max(cl, -tDom))
      const bxR = xt(Math.min(cr, tDom))
      ctx.fillStyle = `rgba(${boxRgb}, 0.10)`
      ctx.fillRect(bx, yBoxTop, bxR - bx, yBase - yBoxTop)
      ctx.strokeStyle = `rgba(${boxRgb}, 0.6)`
      ctx.lineWidth = 1.2
      ctx.strokeRect(bx, yBoxTop, bxR - bx, yBase - yBoxTop)
    }

    ctx.strokeStyle = colors.border
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(PAD_X - 4, yBase)
    ctx.lineTo(w - PAD_X + 4, yBase)
    ctx.stroke()

    const centers: number[] = []
    for (let c = -6; c <= 6; c += T0) centers.push(c)
    drawRectsAt(ctx, colors, xt, centers, yTopR, yBase, tDom)

    ctx.fillStyle = colors.fgMuted
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(kind === 'one' ? 'periodic — επανάληψη ανά T₀' : 'periodic — επανάληψη του ζεύγους ανά 2T₀', PAD_X + 2, bot.t + 9)
  }
}

function drawFreqCase(
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
  const yMax = 2 * TAU * 1.15 // shared by both freq plots; fits the taller X₂ envelope
  const xt = (f: number) => lerp(f, -fDom, fDom, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.1 * yMax, PAD_Y + 22, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  // envelope |X| (gray dashed) — the total / shape
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1.2
  ctx.globalAlpha = 0.6
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

  // |X|/period curve (accent faint) — where the aₖ sit
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
    ctx.lineWidth = 1.7
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, yv(v))
    ctx.stroke()
    ctx.fillStyle = colors.accent
    ctx.beginPath()
    ctx.arc(x, yv(v), 2.4, 0, Math.PI * 2)
    ctx.fill()
  }

  // labels
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText(`περιβάλλουσα ${envLabel}`, PAD_X + 2, PAD_Y + 8)
  ctx.fillStyle = colors.accent
  ctx.fillText(`στήλες aₖ = ${coeffLabel}`, PAD_X + 2, PAD_Y + 19)
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'center'
  ctx.fillText('f', w - PAD_X + 2, yZero - 4)
}
