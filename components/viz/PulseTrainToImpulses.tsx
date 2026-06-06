'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * FT §2.1 (coda) — "the stems aₖ are really impulses".
 *
 * The rect twin of §2.2's CyclesToImpulse. Take the rect-train but only N whole
 * periods of it (a finite burst). Its honest FT is a SMOOTH curve, not stems:
 *      |X_N(f)| = |τ·sinc(fτ)| · |sin(NπfT₀)/sin(πfT₀)|
 * a sinc envelope modulated by the Dirichlet kernel. As N grows, sharp peaks
 * grow at the harmonics f = k/T₀ — TALLER (height ≈ N·τ at f=0) and NARROWER
 * (width ≈ 1/(NT₀)) — while each peak's AREA stays aₖ. In the limit (the full
 * periodic train) the peaks become impulses of weight aₖ. That is exactly the
 * limit §2.2 makes precise with a cosine. The freq y-axis is FIXED so the peaks
 * are seen to grow.
 *
 * Units for clean numbers: τ = 0.7, T₀ = 2 → a₀ = τ/T₀ = 0.35 (the DC / duty).
 */

const N_MIN = 1
const N_MAX = 6
const TAU = 0.7
const TRAIN_T0 = 2
const A0 = TAU / TRAIN_T0 // = 0.35

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}

// Dirichlet kernel sin(NπfT₀)/sin(πfT₀), with the value at the harmonics (= ±N).
function dirichlet(f: number, N: number) {
  const s = Math.sin(Math.PI * f * TRAIN_T0)
  if (Math.abs(s) < 1e-7) return N
  return Math.sin(N * Math.PI * f * TRAIN_T0) / s
}

// magnitude of the FT of N rects spaced T₀
function XNmag(f: number, N: number) {
  return Math.abs(TAU * sinc(f * TAU) * dirichlet(f, N))
}

export function PulseTrainToImpulses() {
  const [N, setN] = useState(3)
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, N)
    if (freqRef.current) drawFreq(freqRef.current, colors, N)
  }, [N])

  const peak = (N * TAU).toFixed(2)
  const width = (1 / (N * TRAIN_T0)).toFixed(2)
  const cyc = N === 1 ? 'αντίγραφο' : 'αντίγραφα'

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Από γραμμές σε κρούσεις: χτίζοντας το rect-train αντίγραφο-αντίγραφο
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Ας δούμε τι δίνει στ' αλήθεια ο FT — όχι λεπτές γραμμές: κράτα{' '}
        <span className="font-mono">N</span> μόνο περιόδους του rect-train (πεπερασμένο σήμα) και
        δες το φάσμα του — μια <strong>λεία</strong> καμπύλη. Σύρε το{' '}
        <span className="font-mono">N</span>: στις αρμονικές <span className="font-mono">k/T₀</span>{' '}
        φυτρώνουν κορυφές που <strong>ψηλώνουν</strong> και <strong>στενεύουν</strong>, αλλά το{' '}
        <strong>εμβαδόν</strong> κάθε κορυφής μένει <span className="font-mono">aₖ</span>. Στο όριο →{' '}
        <strong>κρούσεις βάρους aₖ</strong>.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle={`${N} ${cyc} του rect-train (ανά T₀)`}>
          <canvas ref={timeRef} style={{ height: 190 }} className="block h-[190px] w-full" aria-label="N periods of a rect train in the time domain" />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="|X_N(f)|: κορυφές στις αρμονικές k/T₀">
          <canvas ref={freqRef} style={{ height: 190 }} className="block h-[190px] w-full" aria-label="Magnitude spectrum with peaks at the harmonics sharpening as N grows" />
        </Panel>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          N = <span className="font-mono text-fg tabular-nums">{N}</span> {cyc}
        </label>
        <input type="range" min={N_MIN} max={N_MAX} step={1} value={N} onChange={(e) => setN(parseInt(e.target.value, 10))} className="mt-1 w-full accent-[rgb(var(--accent))]" aria-label="Number of periods N" />
      </div>

      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
        <div className="rounded-md border border-border bg-bg p-2">
          κορυφή στο f=0 <span className="font-mono">= N·τ = </span>
          <span className="font-mono font-semibold tabular-nums" style={{ color: 'rgb(var(--accent))' }}>{peak}</span>
        </div>
        <div className="rounded-md border border-border bg-bg p-2">
          πλάτος <span className="font-mono">≈ 1/(N·T₀) = </span>
          <span className="font-mono font-semibold tabular-nums">{width}</span>
        </div>
        <div className="rounded-md border border-border bg-bg p-2">
          εμβαδόν <span className="font-mono">= a₀ = τ/T₀ = </span>
          <span className="font-mono font-semibold tabular-nums">{A0.toFixed(2)}</span>{' '}
          <span className="text-fg-subtle">(σταθερό)</span>
        </div>
      </div>

      <div className="mt-2 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Με λίγα αντίγραφα το φάσμα είναι λείο· με περισσότερα οξύνεται σε αιχμές στις{' '}
        <span className="font-mono">k/T₀</span>. Οι λεπτές γραμμές <span className="font-mono">aₖ</span> που
        ζωγραφίζαμε ήταν αυτό το όριο: <strong>κρούσεις</strong>, με βάρος το{' '}
        <strong>εμβαδόν</strong> κάθε αιχμής. Ακριβώς αυτό το όριο χτίζει καθαρά η{' '}
        <strong>§2.2</strong> με ένα cosine.
      </div>
      <p className="mt-1 text-[10px] text-fg-subtle">μονάδες: τ = 0.7, T₀ = 2 (άρα a₀ = τ/T₀ = 0.35) · εμφανίζεται το |X(f)|</p>
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
  const tDom = 7
  const xt = (t: number) => lerp(t, -tDom, tDom, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, 1.3, -0.4, PAD_Y, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  ctx.fillStyle = `rgba(${accentRgb}, 0.22)`
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.8
  const yT = yv(1)
  // N rects spaced T₀, centred symmetrically about 0
  for (let n = 0; n < N; n++) {
    const center = (n - (N - 1) / 2) * TRAIN_T0
    const a = center - TAU / 2
    const b = center + TAU / 2
    if (b < -tDom || a > tDom) continue
    const xL = xt(Math.max(a, -tDom))
    const xR = xt(Math.min(b, tDom))
    ctx.fillRect(xL, yT, xR - xL, yZero - yT)
    ctx.strokeRect(xL, yT, xR - xL, yZero - yT)
  }

  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`${N}× (ανά T₀)`, PAD_X + 4, PAD_Y + 10)
}

function drawFreq(canvas: HTMLCanvasElement, colors: ThemeColors, N: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const fDom = 1.7
  const yMax = N_MAX * TAU * 1.15
  const xt = (f: number) => lerp(f, -fDom, fDom, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.18 * yMax, PAD_Y, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  // faint harmonic gridlines at f = k/T₀
  ctx.strokeStyle = colors.border
  ctx.setLineDash([2, 3])
  ctx.lineWidth = 1
  const kMax = Math.floor(fDom * TRAIN_T0)
  for (let k = -kMax; k <= kMax; k++) {
    if (k === 0) continue
    const x = xt(k / TRAIN_T0)
    ctx.beginPath()
    ctx.moveTo(x, PAD_Y)
    ctx.lineTo(x, yZero)
    ctx.stroke()
  }
  ctx.setLineDash([])

  // shade the central (k=0) peak's main lobe, area ≈ a₀
  const lobe = 1 / (N * TRAIN_T0)
  ctx.fillStyle = `rgba(${accentRgb}, 0.18)`
  ctx.beginPath()
  ctx.moveTo(xt(-lobe), yZero)
  const S = 120
  for (let i = 0; i <= S; i++) {
    const f = lerp(i, 0, S, -lobe, lobe)
    ctx.lineTo(xt(f), yv(XNmag(f, N)))
  }
  ctx.lineTo(xt(lobe), yZero)
  ctx.closePath()
  ctx.fill()

  // |X_N(f)| curve
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  const STEPS = 900
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -fDom, fDom)
    const x = xt(f)
    const y = yv(XNmag(f, N))
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), yZero + 12)
  ctx.fillText('f₀', xt(1 / TRAIN_T0), yZero + 12)
  ctx.fillText('2f₀', xt(2 / TRAIN_T0), yZero + 12)
  ctx.fillText('−f₀', xt(-1 / TRAIN_T0), yZero + 12)
  ctx.textAlign = 'left'
  ctx.fillText('|X(f)|', PAD_X + 2, PAD_Y + 8)
  ctx.fillText('f', w - PAD_X + 2, yZero - 4)
}
