'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * FT §2.2 — the limit, made watchable. Drag N up to 40: the sinc "bump"
 * X_N(f) = (NT₀/2)[sinc((f−f₀)NT₀) + sinc((f+f₀)NT₀)] grows in height (½NT₀ → ∞)
 * and shrinks in width (~1/NT₀ → 0) while its AREA stays aₖ = ½. It converges to
 * the grey "target" impulse δ of weight ½ at ±f₀ — that convergence IS "the FT
 * of a periodic signal is a train of deltas of weight aₖ".
 *
 * Units: f₀ = 1, T₀ = 1.
 */

const N_MIN = 1
const N_MAX = 40
const Y_MAX = 2.6 // fixed: the bump clips past the top for N ≳ 6, reading as "→ ∞"
const DELTA_H = 2.15 // drawn height of the target δ arrow (its weight is ½, labelled)

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}
function XN(f: number, N: number) {
  return (N / 2) * (sinc(N * (f - 1)) + sinc(N * (f + 1)))
}

export function CyclesToImpulseLimit() {
  const [N, setN] = useState(4)
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, N)
    if (freqRef.current) drawFreq(freqRef.current, colors, N)
  }, [N])

  const height = (N / 2).toFixed(N < 10 ? 2 : 1)
  const width = (1 / N).toFixed(3)
  const status =
    N <= 3 ? 'ένα φαρδύ καμπανάκι (sinc)' : N <= 12 ? 'στενεύει και ψηλώνει…' : 'σχεδόν κρούση (δ) !'

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Στο όριο N → ∞: το καμπανάκι γίνεται κρούση (δ)
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Σύρε το <span className="font-mono">N</span> ψηλά. Το καμπανάκι{' '}
        <strong>ψηλώνει</strong> (<span className="font-mono">½·N → ∞</span>) και{' '}
        <strong>στενεύει</strong> (<span className="font-mono">1/N → 0</span>), αλλά το{' '}
        <strong>εμβαδόν</strong> του (το σκιασμένο) μένει <span className="font-mono">½</span>. Συγκλίνει
        στη <strong>γκρι «στόχο»</strong>: μια <strong>κρούση δ βάρους ½</strong> στο{' '}
        <span className="font-mono">±f₀</span>.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="N κύκλοι (όλο και μακρύτερο burst)">
          <canvas ref={timeRef} style={{ height: 180 }} className="block h-[180px] w-full" aria-label="Cosine burst of N cycles" />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="το sinc συγκλίνει στην κρούση δ">
          <canvas ref={freqRef} style={{ height: 180 }} className="block h-[180px] w-full" aria-label="The sinc bump converging to an impulse" />
        </Panel>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          N = <span className="font-mono text-fg tabular-nums">{N}</span> κύκλοι ·{' '}
          <span className="text-fg-subtle">{status}</span>
        </label>
        <input type="range" min={N_MIN} max={N_MAX} step={1} value={N} onChange={(e) => setN(parseInt(e.target.value, 10))} className="mt-1 w-full accent-[rgb(var(--accent))]" aria-label="Number of cycles N" />
      </div>

      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
        <div className="rounded-md border border-border bg-bg p-2">
          ύψος <span className="font-mono">= ½·N = </span>
          <span className="font-mono font-semibold tabular-nums" style={{ color: 'rgb(var(--accent))' }}>{height}</span>{' '}
          <span className="text-fg-subtle">→ ∞</span>
        </div>
        <div className="rounded-md border border-border bg-bg p-2">
          πλάτος <span className="font-mono">≈ 1/N = </span>
          <span className="font-mono font-semibold tabular-nums">{width}</span>{' '}
          <span className="text-fg-subtle">→ 0</span>
        </div>
        <div className="rounded-md border border-border bg-bg p-2">
          εμβαδόν <span className="font-mono">= ½</span> <span className="text-fg-subtle">(σταθερό = βάρος της δ)</span>
        </div>
      </div>
      <p className="mt-1 text-[10px] text-fg-subtle">μονάδες: f₀ = 1, T₀ = 1</p>
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

function drawTime(canvas: HTMLCanvasElement, colors: ThemeColors, N: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const tDom = 8
  const xt = (t: number) => lerp(t, -tDom, tDom, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, 1.3, -1.3, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  const half = N / 2
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.4
  ctx.beginPath()
  const STEPS = 1100
  let started = false
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, -tDom, tDom)
    if (Math.abs(t) > half) {
      started = false
      continue
    }
    const x = xt(t)
    const y = yv(Math.cos(2 * Math.PI * t))
    if (!started) {
      ctx.moveTo(x, y)
      started = true
    } else ctx.lineTo(x, y)
  }
  ctx.stroke()

  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`${N} κύκλοι`, PAD_X + 4, PAD_Y + 10)
}

function drawFreq(canvas: HTMLCanvasElement, colors: ThemeColors, N: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const fDom = 2.3
  const xt = (f: number) => lerp(f, -fDom, fDom, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, Y_MAX, -0.4, PAD_Y, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  // grey "target" impulses δ at ±f₀ (weight ½) — what the bump converges to
  for (const c of [1, -1]) {
    const x = xt(c)
    const yTop = yv(DELTA_H)
    ctx.strokeStyle = colors.fgSubtle
    ctx.fillStyle = colors.fgSubtle
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, yTop)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, yTop - 7)
    ctx.lineTo(x - 4, yTop + 1)
    ctx.lineTo(x + 4, yTop + 1)
    ctx.closePath()
    ctx.fill()
  }
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('δ, βάρος ½', xt(1) + 6, yv(DELTA_H) + 2)

  // shaded main lobe (area = ½) at ±f₀
  ctx.fillStyle = `rgba(${accentRgb}, 0.16)`
  for (const c of [1, -1]) {
    const fa = c - 1 / N
    const fb = c + 1 / N
    ctx.beginPath()
    ctx.moveTo(xt(fa), yZero)
    const S = 80
    for (let i = 0; i <= S; i++) {
      const f = lerp(i, 0, S, fa, fb)
      ctx.lineTo(xt(f), yv(Math.min(Math.max(0, XN(f, N)), Y_MAX + 0.5)))
    }
    ctx.lineTo(xt(fb), yZero)
    ctx.closePath()
    ctx.fill()
  }

  // the sinc bump X_N(f); the spike is clamped just above the top so it "shoots
  // off the panel" for large N (reads as height → ∞)
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  const STEPS = 800
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -fDom, fDom)
    const v = Math.min(XN(f, N), Y_MAX + 0.8) // clamp so the spike shoots off-panel cleanly
    const x = xt(f)
    const y = yv(v)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // f ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('f₀', xt(1), yZero + 12)
  ctx.fillText('−f₀', xt(-1), yZero + 12)
}
