'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * §2.1 → §2.2 bridge: N copies of a rect → the spectrum collapses to a comb.
 *
 * The REAL spectrum of N rects (width τ, spacing T₀) is the single-pulse FT
 * times a Dirichlet kernel:
 *     X_N(f) = X₀(f) · Σ_{n} e^{-j2πf nT₀} = X₀(f) · sin(πN fT₀)/sin(πfT₀).
 * Its magnitude rises to N·|X₀(m/T₀)| at each harmonic m/T₀ (width ∝ 1/N) and
 * has shrinking side ripples between. As N→∞ those peaks become impulses → the
 * comb, with delta strengths shaped by the envelope X₀.
 *
 * We plot |X_N|/N (scaled to fit; the real peaks grow ∝N). At N=1 it is exactly
 * the smooth sinc envelope X₀; add copies and it pinches onto the harmonics,
 * touching X₀ at each one and vanishing between — the comb forming. τ=1, T₀=2
 * (the 50% square wave of §4a, so even harmonics land on sinc zeros).
 */

const N_MIN = 1
const N_MAX = 16
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
// |X_N(f)| / N  — the real spectrum shape, scaled by 1/N so it fits.
function XnOverN(f: number, N: number) {
  const s = Math.sin(Math.PI * f * T0)
  const dOverN = Math.abs(s) < 1e-7 ? 1 : Math.sin(Math.PI * N * f * T0) / (N * s)
  return Math.abs(X0(f) * dOverN)
}

export function CopiesToImpulseComb() {
  const [N, setN] = useState(3)
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, N)
    if (freqRef.current) drawFreq(freqRef.current, colors, N)
  }, [N])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Πιο πολλά αντίγραφα → η περιβάλλουσα μαζεύεται σε κρούσεις
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Αριστερά: <span className="font-mono">N</span> αντίγραφα του παλμού στη σειρά. Δεξιά:
        το <strong>πραγματικό</strong> φάσμα τους <span className="font-mono">|X_N|</span>. Στο{' '}
        <span className="font-mono">N = 1</span> είναι η λεία περιβάλλουσα{' '}
        <span className="font-mono">X₀</span> (sinc)· πρόσθεσε αντίγραφα και το φάσμα{' '}
        <strong>πινίζεται πάνω στις αρμονικές</strong> <span className="font-mono">k/T₀</span> —
        αιχμές που αγγίζουν την <span className="font-mono">X₀</span> και μηδενίζονται ανάμεσα.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="N αντίγραφα του παλμού">
          <canvas
            ref={timeRef}
            style={{ height: 160 }}
            className="block h-[160px] w-full"
            aria-label="A burst of N rectangular pulses"
          />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="|X_N| κάτω από την περιβάλλουσα X₀">
          <canvas
            ref={freqRef}
            style={{ height: 160 }}
            className="block h-[160px] w-full"
            aria-label="The real spectrum of N rectangles sharpening into a comb of impulses under the sinc envelope"
          />
        </Panel>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          αριθμός αντιγράφων N ={' '}
          <span className="font-mono text-fg tabular-nums">{N}</span>
          {N >= N_MAX && <span className="ml-2 text-fg-subtle">— σχεδόν κρούσεις (χτένι)</span>}
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
        Στο όριο <span className="font-mono">N → ∞</span> (γνήσιο periodic σήμα) οι αιχμές
        γίνονται <strong>κρούσεις</strong> στις αρμονικές, με ύψη που ακολουθούν την{' '}
        <span className="font-mono">X₀</span> — ένα «χτένι» κρούσεων με βάρη τους συντελεστές{' '}
        <span className="font-mono">aₖ</span>. Αυτό χτίζει η §2.2.
        <span className="mt-1 block text-[10px] text-fg-subtle">
          (Σχεδιάζουμε <span className="font-mono">|X_N|/N</span> για να χωράει· οι πραγματικές
          κορυφές μεγαλώνουν <span className="font-mono">∝N</span> — αυτό ακριβώς είναι η κρούση
          που σχηματίζεται: ύψος → ∞, πλάτος → 0.)
        </span>
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
        <span className="text-[10px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

const PAD_X = 28
const PAD_Y = 16

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}

function drawTime(canvas: HTMLCanvasElement, colors: ThemeColors, N: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const tDom = Math.max(5, (N * T0) / 2 + 1)
  const xt = (t: number) => lerp(t, -tDom, tDom, PAD_X, w - PAD_X)
  const yBase = h - PAD_Y
  const yTopR = PAD_Y + 14
  const accentRgb = getRGB(colors.accent)

  // axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yBase)
  ctx.lineTo(w - PAD_X + 4, yBase)
  ctx.stroke()

  // N rects, centred burst
  ctx.fillStyle = `rgba(${accentRgb}, 0.3)`
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.4
  for (let n = 0; n < N; n++) {
    const c = (n - (N - 1) / 2) * T0
    const xL = xt(c - TAU / 2)
    const xR = xt(c + TAU / 2)
    ctx.fillRect(xL, yTopR, xR - xL, yBase - yTopR)
    ctx.strokeRect(xL, yTopR, xR - xL, yBase - yTopR)
  }

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`${N} ${N === 1 ? 'παλμός' : 'αντίγραφα'} · απόσταση T₀`, PAD_X + 2, PAD_Y + 6)
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'right'
  ctx.fillText('t', w - PAD_X + 2, yBase - 4)
}

function drawFreq(canvas: HTMLCanvasElement, colors: ThemeColors, N: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const yMax = TAU * 1.15
  const xt = (f: number) => lerp(f, -F_DOM, F_DOM, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.08 * yMax, PAD_Y + 14, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)
  const STEPS = 700

  // harmonic guide lines at m/T₀
  ctx.strokeStyle = `rgba(${getRGB(colors.fgSubtle)}, 0.35)`
  ctx.lineWidth = 1
  ctx.setLineDash([1, 3])
  const mMax = Math.ceil(F_DOM * T0)
  for (let m = -mMax; m <= mMax; m++) {
    const f = m / T0
    if (Math.abs(f) > F_DOM) continue
    ctx.beginPath()
    ctx.moveTo(xt(f), yZero)
    ctx.lineTo(xt(f), yv(yMax))
    ctx.stroke()
  }
  ctx.setLineDash([])

  // axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  // envelope |X₀| (dashed gray) — the curve the comb lives under
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1.2
  ctx.globalAlpha = 0.65
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_DOM, F_DOM)
    const y = yv(Math.abs(X0(f)))
    if (i === 0) ctx.moveTo(xt(f), y)
    else ctx.lineTo(xt(f), y)
  }
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1

  // the real spectrum |X_N|/N (solid) — sharpens into a comb
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.8
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_DOM, F_DOM)
    const y = yv(XnOverN(f, N))
    if (i === 0) ctx.moveTo(xt(f), y)
    else ctx.lineTo(xt(f), y)
  }
  ctx.stroke()

  // labels
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('περιβάλλουσα X₀', PAD_X + 2, PAD_Y + 6)
  ctx.fillStyle = colors.accent
  ctx.fillText('φάσμα |X_N|', PAD_X + 2, PAD_Y + 17)
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), yZero + 12)
  ctx.textAlign = 'right'
  ctx.fillText('f', w - PAD_X + 2, yZero - 4)
}
