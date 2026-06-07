'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * §2.1 → §2.2 bridge: N copies of a rect → the spectrum becomes a comb, while
 * the coefficients stay put. Shows the ×N / ÷NT₀ cancellation directly.
 *
 * Real spectrum of N rects (width τ, spacing T₀):
 *     X_N(f) = X₀(f) · sin(πN fT₀)/sin(πfT₀),   |peak| = N·|X₀(m/T₀)| at f = m/T₀.
 * Treat the N-rect block as the repeating unit (period NT₀); its FS coefficients
 * are X_N sampled at k/(NT₀) and divided by NT₀:
 *     a_k = X_N(k/NT₀)/(NT₀);   at f = m/T₀ (k = Nm) this is X₀(m/T₀)/T₀ — the
 *     SAME value as one rect, for every N — and zero at the in-between grid points.
 *
 * Panels: (1) the N rects, (2) |X_N| with peaks GROWING ∝N and narrowing → impulse
 * arrows (the comb), (3) the coefficients a_k: tall stems on the single-rect grid
 * m/T₀ (fixed height, same for all N) plus the extra grid points that are zero.
 * τ=1, T₀=2 (the §4a square wave: even harmonics sit on sinc zeros).
 */

const N_MIN = 1
const N_MAX = 12
const TAU = 1
const T0 = 2
const F_DOM = 3
const Y_SPEC = 5 // fixed scale for |X_N| so the growth ∝N is visible (then it clips → arrow)

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}
function X0(f: number) {
  return TAU * sinc(f * TAU)
}
// real |X_N(f)| (peaks reach N·|X₀| at the harmonics)
function XN(f: number, N: number) {
  const s = Math.sin(Math.PI * f * T0)
  const d = Math.abs(s) < 1e-7 ? N : Math.sin(Math.PI * N * f * T0) / s
  return Math.abs(X0(f) * d)
}

export function CopiesToImpulseComb() {
  const [N, setN] = useState(3)
  const tRef = useRef<HTMLCanvasElement | null>(null)
  const sRef = useRef<HTMLCanvasElement | null>(null)
  const cRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (tRef.current) drawTime(tRef.current, colors, N)
    if (sRef.current) drawSpectrum(sRef.current, colors, N)
    if (cRef.current) drawCoeffs(cRef.current, colors, N)
  }, [N])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Πιο πολλά αντίγραφα → κρούσεις, αλλά ίδιοι συντελεστές
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Σύρε τα αντίγραφα <span className="font-mono">N</span>. Το{' '}
        <strong>φάσμα τους</strong> <span className="font-mono">|X_N|</span> βγάζει κορυφές όλο
        και πιο <strong>ψηλές και στενές</strong> στις αρμονικές <span className="font-mono">m/T₀</span>{' '}
        — ώσπου γίνονται <strong>κρούσεις</strong>. Οι <strong>συντελεστές</strong>{' '}
        <span className="font-mono">a_k = |X_N| ÷ (N·T₀)</span> όμως <strong>δεν αλλάζουν</strong>:
        το <span className="font-mono">×N</span> των κορυφών το τρώει το{' '}
        <span className="font-mono">÷N·T₀</span> της περιόδου.
      </p>

      <div className="space-y-2">
        <Panel title="1 · Χρόνος" subtitle="N αντίγραφα του παλμού">
          <canvas ref={tRef} style={{ height: 96 }} className="block h-[96px] w-full" aria-label="Burst of N rectangles" />
        </Panel>
        <Panel title="2 · Φάσμα |X_N|" subtitle="κορυφές ∝N: ψηλώνουν + στενεύουν → κρούσεις">
          <canvas ref={sRef} style={{ height: 140 }} className="block h-[140px] w-full" aria-label="Spectrum of N rectangles, peaks growing into impulses" />
        </Panel>
        <Panel title="3 · Συντελεστές a_k = |X_N| ÷ (N·T₀)" subtitle="σταθεροί: ίδιο πλέγμα m/T₀ + έξτρα μηδενικά">
          <canvas ref={cRef} style={{ height: 126 }} className="block h-[126px] w-full" aria-label="Coefficients: fixed stems on the single-rect grid plus extra zeros" />
        </Panel>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          αριθμός αντιγράφων N ={' '}
          <span className="font-mono text-fg tabular-nums">{N}</span>
          <span className="ml-3 text-fg-subtle">
            κορυφή στο 0: <span className="font-mono">|X_N(0)| = N·X₀(0) = {N}</span> · συντελεστής{' '}
            <span className="font-mono">a₀ = {(X0(0) / T0).toFixed(2)}</span> (σταθερός)
          </span>
        </label>
        <input
          type="range"
          min={N_MIN}
          max={N_MAX}
          step={1}
          value={N}
          onChange={(e) => setN(parseInt(e.target.value, 10))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Number of copies N"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Στο όριο <span className="font-mono">N → ∞</span>: στο πλαίσιο 2 οι κορυφές του{' '}
        <span className="font-mono">|X_N|</span> γίνονται <strong>κρούσεις</strong> (ένα «χτένι» —
        αυτό χτίζει η §2.2). Στο πλαίσιο 3 η ίδια περιβάλλουσα, διαιρεμένη με{' '}
        <span className="font-mono">N·T₀</span>, <strong>μαζεύεται πάνω στα <span className="font-mono">a_k</span></strong>:
        οι κρούσεις πέφτουν ακριβώς στα μη-μηδενικά δείγματα, <strong>με το ίδιο ύψος</strong> —
        γιατί το <span className="font-mono">×N</span> των κορυφών το αναιρεί το{' '}
        <span className="font-mono">÷N·T₀</span>. Όσο κι αν μεγαλώσει το{' '}
        <span className="font-mono">N</span>, τα <span className="font-mono">a_k</span> μένουν στις
        ίδιες θέσεις <span className="font-mono">m/T₀</span> με το ίδιο ύψος· το πυκνότερο πλέγμα
        προσθέτει μόνο <strong>μηδενικά</strong>. Ίδιο σήμα → ίδια{' '}
        <span className="font-mono">a_k</span>.
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

const PAD_X = 28
const PAD_Y = 14

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}

function drawTime(canvas: HTMLCanvasElement, colors: ThemeColors, N: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const tDom = Math.max(4.5, (N * T0) / 2 + 1)
  const xt = (t: number) => lerp(t, -tDom, tDom, PAD_X, w - PAD_X)
  const yBase = h - PAD_Y + 2
  const yTopR = PAD_Y + 2
  const accentRgb = getRGB(colors.accent)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yBase)
  ctx.lineTo(w - PAD_X + 4, yBase)
  ctx.stroke()

  ctx.fillStyle = `rgba(${accentRgb}, 0.3)`
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.3
  for (let n = 0; n < N; n++) {
    const c = (n - (N - 1) / 2) * T0
    const xL = xt(c - TAU / 2)
    const xR = xt(c + TAU / 2)
    ctx.fillRect(xL, yTopR, xR - xL, yBase - yTopR)
    ctx.strokeRect(xL, yTopR, xR - xL, yBase - yTopR)
  }
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('t', w - PAD_X + 2, yBase - 3)
}

function drawSpectrum(canvas: HTMLCanvasElement, colors: ThemeColors, N: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const xt = (f: number) => lerp(f, -F_DOM, F_DOM, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, Y_SPEC, -0.08 * Y_SPEC, PAD_Y + 12, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  // axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  // faint single-pulse envelope |X₀| (peaks grow up from here)
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1
  ctx.globalAlpha = 0.5
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  const STEPS = 700
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_DOM, F_DOM)
    const y = yv(Math.min(Math.abs(X0(f)), Y_SPEC))
    if (i === 0) ctx.moveTo(xt(f), y)
    else ctx.lineTo(xt(f), y)
  }
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1

  // |X_N| (clamped at Y_SPEC), peaks grow ∝N and narrow
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.8
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_DOM, F_DOM)
    const y = yv(Math.min(XN(f, N), Y_SPEC))
    if (i === 0) ctx.moveTo(xt(f), y)
    else ctx.lineTo(xt(f), y)
  }
  ctx.stroke()

  // impulse arrowheads at harmonics whose true peak overshoots the frame
  ctx.fillStyle = colors.accent
  const mMax = Math.ceil(F_DOM * T0)
  for (let m = -mMax; m <= mMax; m++) {
    const f = m / T0
    if (Math.abs(f) > F_DOM) continue
    const peak = N * Math.abs(X0(f))
    if (peak > Y_SPEC + 1e-6) {
      const x = xt(f)
      const yT = yv(Y_SPEC)
      ctx.beginPath()
      ctx.moveTo(x, yT - 1)
      ctx.lineTo(x - 4, yT + 7)
      ctx.lineTo(x + 4, yT + 7)
      ctx.closePath()
      ctx.fill()
    }
  }

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('|X₀| (περιβάλλουσα)', PAD_X + 2, PAD_Y + 6)
  ctx.textAlign = 'right'
  ctx.fillText('f', w - PAD_X + 2, yZero - 4)
}

function drawCoeffs(canvas: HTMLCanvasElement, colors: ThemeColors, N: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const yMax = (X0(0) / T0) * 1.25 // a₀ = 0.5; fixed scale
  const xt = (f: number) => lerp(f, -F_DOM, F_DOM, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.12 * yMax, PAD_Y + 12, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  // axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  // the ÷N·T₀ envelope — same shape as |X_N| but scaled by the period, so it
  // sits at aₖ height. As N grows it pinches onto the aₖ stems → deltas on them.
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.3
  ctx.globalAlpha = 0.4
  ctx.beginPath()
  const STEPS = 700
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_DOM, F_DOM)
    const y = yv(XN(f, N) / (N * T0))
    if (i === 0) ctx.moveTo(xt(f), y)
    else ctx.lineTo(xt(f), y)
  }
  ctx.stroke()
  ctx.globalAlpha = 1

  // sample grid of the period-NT₀ repetition: f = k/(NT₀)
  const kMax = Math.ceil(F_DOM * N * T0)
  for (let k = -kMax; k <= kMax; k++) {
    const f = k / (N * T0)
    if (Math.abs(f) > F_DOM) continue
    if (k % N === 0) {
      // lands on the single-rect grid m/T₀ → the real coefficient a_m = X₀(m/T₀)/T₀
      const a = Math.abs(X0(f)) / T0
      const x = xt(f)
      ctx.strokeStyle = colors.accent
      ctx.lineWidth = 1.8
      ctx.beginPath()
      ctx.moveTo(x, yZero)
      ctx.lineTo(x, yv(a))
      ctx.stroke()
      ctx.fillStyle = colors.accent
      ctx.beginPath()
      ctx.arc(x, yv(a), 2.6, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // extra grid point from the denser sampling → zero
      ctx.strokeStyle = `rgba(${accentRgb}, 0.55)`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(xt(f), yZero, 1.6, 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  ctx.fillStyle = colors.accent
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('a_k στις m/T₀ (ίδια με 1 παλμό)', PAD_X + 2, PAD_Y + 6)
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'right'
  ctx.fillText('f', w - PAD_X + 2, yZero - 4)
}
