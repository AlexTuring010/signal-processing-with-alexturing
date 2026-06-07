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
 * Panels:
 *  (1) the N rects;
 *  (2) |X_N| — peaks grow ∝N and narrow, shooting up toward grey "target" δ
 *      arrows whose weights aₖ are labelled (the bells never turn INTO arrows);
 *  (3) coefficients aₖ = |X_N|/(NT₀): the ÷NT₀ envelope collapses onto the aₖ
 *      stems, which sit on the dashed grey single-rect envelope |X₀|/T₀ — so the
 *      deltas land on the non-zero samples at the same height; extra grid points
 *      between are zero.
 * τ=1, T₀=2 (the §4a square wave: even harmonics sit on sinc zeros).
 */

const N_MIN = 1
const N_MAX = 24
const TAU = 1
const T0 = 2
const F_DOM = 3

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}
function X0(f: number) {
  return TAU * sinc(f * TAU)
}
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
        Σύρε τα αντίγραφα <span className="font-mono">N</span> ψηλά. Στο πλαίσιο 2 το{' '}
        <strong>φάσμα</strong> <span className="font-mono">|X_N|</span> βγάζει κορυφές όλο και πιο{' '}
        <strong>ψηλές και στενές</strong> που τρέχουν προς τις <strong>γκρι κρούσεις-στόχους</strong>{' '}
        (με βάρη τα <span className="font-mono">aₖ</span>). Στο πλαίσιο 3 οι{' '}
        <strong>συντελεστές</strong> <span className="font-mono">aₖ = |X_N| ÷ (N·T₀)</span> δεν
        αλλάζουν: η περιβάλλουσα μαζεύεται και οι κρούσεις πέφτουν ακριβώς πάνω στα μη-μηδενικά
        δείγματα.
      </p>

      <div className="space-y-2">
        <Panel title="1 · Χρόνος" subtitle="N αντίγραφα του παλμού">
          <canvas ref={tRef} style={{ height: 92 }} className="block h-[92px] w-full" aria-label="Burst of N rectangles" />
        </Panel>
        <Panel title="2 · Φάσμα |X_N|" subtitle="κορυφές ∝N → οι γκρι κρούσεις (βάρη aₖ)">
          <canvas ref={sRef} style={{ height: 140 }} className="block h-[140px] w-full" aria-label="Spectrum of N rectangles, peaks growing toward target impulses" />
        </Panel>
        <Panel title="3 · Συντελεστές aₖ = |X_N| ÷ (N·T₀)" subtitle="πέφτουν στα δείγματα της X₀/T₀ (ίδια με 1 παλμό)">
          <canvas ref={cRef} style={{ height: 140 }} className="block h-[140px] w-full" aria-label="Coefficients landing on the single-rect envelope plus extra zeros" />
        </Panel>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          αριθμός αντιγράφων N ={' '}
          <span className="font-mono text-fg tabular-nums">{N}</span>
          <span className="ml-3 text-fg-subtle">
            κορυφή στο 0: <span className="font-mono">|X_N(0)| = N·X₀(0) = {N}</span> · αλλά{' '}
            <span className="font-mono">a₀ = {(X0(0) / T0).toFixed(2)}</span> (σταθερό)
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
        Στο όριο <span className="font-mono">N → ∞</span> οι κορυφές του{' '}
        <span className="font-mono">|X_N|</span> γίνονται οι γκρι <strong>κρούσεις</strong> (ένα «χτένι»
        — αυτό χτίζει η §2.2). Και στο πλαίσιο 3 βλέπεις <strong>γιατί οι συντελεστές μένουν ίδιοι</strong>:
        η περιβάλλουσα ÷<span className="font-mono">N·T₀</span> μαζεύεται και οι κρούσεις κάθονται πάνω
        στα μη-μηδενικά <span className="font-mono">aₖ</span>, που με τη σειρά τους κάθονται στη{' '}
        <strong>διακεκομμένη γκρι περιβάλλουσα ενός παλμού</strong> <span className="font-mono">X₀/T₀</span> —
        με το <strong>ίδιο ύψος</strong> για κάθε <span className="font-mono">N</span>. Το πυκνότερο
        πλέγμα προσθέτει μόνο μηδενικά. Ίδιο σήμα → ίδια <span className="font-mono">aₖ</span>.
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
  const yTopR = PAD_Y - 2
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
  const yMax = (X0(0) / T0) * 1.3 // SAME scale as panel 3 → X₀/T₀ renders identically
  const xt = (f: number) => lerp(f, -F_DOM, F_DOM, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.12 * yMax, PAD_Y + 4, h - PAD_Y)
  const yZero = yv(0)
  const STEPS = 900

  // axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  // |X_N| bells (behind) — peaks ∝N shoot straight up and off the top of the panel
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.8
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_DOM, F_DOM)
    const y = Math.max(yv(XN(f, N)), -10) // clamp just above the canvas so it exits cleanly
    if (i === 0) ctx.moveTo(xt(f), y)
    else ctx.lineTo(xt(f), y)
  }
  ctx.stroke()

  // dashed grey single-rect envelope |X₀|/T₀ — the delta weights lie on it
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1.1
  ctx.globalAlpha = 0.8
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_DOM, F_DOM)
    const y = yv(Math.abs(X0(f)) / T0)
    if (i === 0) ctx.moveTo(xt(f), y)
    else ctx.lineTo(xt(f), y)
  }
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1

  // grey target δ arrows — tip apex sits EXACTLY on the X₀/T₀ envelope (height aₘ)
  const mMax = Math.ceil(F_DOM * T0)
  for (let m = -mMax; m <= mMax; m++) {
    const f = m / T0
    if (Math.abs(f) > F_DOM) continue
    const wgt = Math.abs(X0(f)) / T0
    if (wgt < 1e-3) continue
    const x = xt(f)
    const yT = yv(wgt)
    ctx.strokeStyle = colors.fgSubtle
    ctx.fillStyle = colors.fgSubtle
    ctx.lineWidth = 1.6
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, yT)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, yT) // apex on the envelope
    ctx.lineTo(x - 3.5, yT + 7)
    ctx.lineTo(x + 3.5, yT + 7)
    ctx.closePath()
    ctx.fill()
  }

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('διακεκ. γκρι: X₀/T₀ · γκρι κρούσεις στα aₖ', PAD_X + 2, h - PAD_Y - 1)
  ctx.textAlign = 'right'
  ctx.fillText('f', w - PAD_X + 2, yZero - 4)
}

function drawCoeffs(canvas: HTMLCanvasElement, colors: ThemeColors, N: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const yMax = (X0(0) / T0) * 1.3
  const xt = (f: number) => lerp(f, -F_DOM, F_DOM, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.12 * yMax, PAD_Y + 4, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)
  const STEPS = 700

  // axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  // dashed grey single-rect envelope |X₀|/T₀ — the curve the aₖ sit on
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1.1
  ctx.globalAlpha = 0.7
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_DOM, F_DOM)
    const y = yv(Math.abs(X0(f)) / T0)
    if (i === 0) ctx.moveTo(xt(f), y)
    else ctx.lineTo(xt(f), y)
  }
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1

  // the ÷N·T₀ envelope, pinching onto the aₖ as N grows (→ deltas on the samples)
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.3
  ctx.globalAlpha = 0.4
  ctx.beginPath()
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
  let lastZeroX = -1e9
  for (let k = -kMax; k <= kMax; k++) {
    const f = k / (N * T0)
    if (Math.abs(f) > F_DOM) continue
    const x = xt(f)
    if (k % N === 0) {
      // on the single-rect grid m/T₀ → the real coefficient aₘ = X₀(m/T₀)/T₀
      const a = Math.abs(X0(f)) / T0
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
    } else if (x - lastZeroX >= 6) {
      // extra grid point from the denser sampling → zero (subsampled so it never carpets)
      lastZeroX = x
      ctx.strokeStyle = `rgba(${accentRgb}, 0.5)`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(x, yZero, 1.5, 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('διακεκ. γκρι: X₀/T₀ (1 παλμός)', PAD_X + 2, PAD_Y + 6)
  ctx.fillStyle = colors.accent
  ctx.textAlign = 'left'
  ctx.fillText('aₖ', PAD_X + 2, PAD_Y + 17)
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'right'
  ctx.fillText('f', w - PAD_X + 2, yZero - 4)
}
