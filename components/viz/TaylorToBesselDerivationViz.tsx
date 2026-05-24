'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { besselJ } from '@/lib/bessel'

/**
 * Taylor → Fourier-series → Bessel — η παιδαγωγική διαδρομή του καθηγητή
 * (slides 22-25 + 35-36 του SE_session15_16_16_FM.pdf).
 *
 * Στόχος: γιατί χρειαζόμαστε Bessel — τι σπάει η Taylor σειρά;
 *
 *   x(t) = A_c cos(2π f_c t + φ(t)),  φ(t) = β_f sin(2π f_m t).
 *
 *   Στο spectrum εμφανίζεται μέσα ο όρος cos(φ(t)) = cos(β sin θ),
 *   όπου θ = 2π f_m t. Taylor γύρω από φ = 0:
 *     cos(φ) = 1 − φ²/2! + φ⁴/4! − φ⁶/6! + ...
 *   και F{φⁿ(t)} = Φ * Φ * ... (n φορές) → εύρος ζώνης n·W.
 *
 *   ▸ Για β ≪ 1 (NBFM), η σειρά κόβεται γρήγορα — μόνο ο 1ος όρος έχει σημασία.
 *   ▸ Για β ≫ 1 (WBFM), η σειρά δεν συγκλίνει αρκετά γρήγορα — χρειαζόμαστε
 *     άλλο εργαλείο: αναπτύσσουμε το cos(β sin θ) σε σειρά Fourier
 *     (περιοδική συνάρτηση), με συντελεστές που είναι ακριβώς οι J_n(β).
 *
 * Πάνω panel — time: cos(β sin θ) εξακριβωμένο vs Taylor-truncated με N όρους.
 *                    Σε χαμηλά β, η Taylor δουλεύει· σε υψηλά β, σπάει βίαια.
 * Κάτω panel — frequency: stem-plot των J_n(β) — οι ΑΚΡΙΒΕΙΣ Fourier-series
 *                          συντελεστές. Όσα n_max θες, τόσα παίρνεις «δωρεάν».
 *
 * Δύο φάρμακα στο ίδιο πρόβλημα: Taylor (όρος-όρος, χάλια στο high-β) vs
 * Fourier series → Bessel (όλο μαζί, σωστό σε κάθε β). Αυτή είναι η μετάβαση
 * από slide 25 («εκτείνεται από −∞ έως +∞») στο slide 36 («J_k(β) είναι
 * οι Fourier συντελεστές»).
 */

const SAMPLES = 280
const PRESETS = [
  { label: 'NBFM β = 0.3', beta: 0.3 },
  { label: 'β = 1', beta: 1.0 },
  { label: 'β = 2.4', beta: 2.405 },
  { label: 'WBFM β = 5', beta: 5.0 },
]

export function TaylorToBesselDerivationViz() {
  const [beta, setBeta] = useState(0.3)
  const [taylorN, setTaylorN] = useState(2) // number of Taylor terms (even exponents)
  const timeCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const freqCanvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (timeCanvasRef.current && colors) drawTime(timeCanvasRef.current, colors, beta, taylorN)
    if (freqCanvasRef.current && colors) drawFreq(freqCanvasRef.current, colors, beta, taylorN)

    const onResize = () => {
      const c = getThemeColors()
      if (timeCanvasRef.current && c) drawTime(timeCanvasRef.current, c, beta, taylorN)
      if (freqCanvasRef.current && c) drawFreq(freqCanvasRef.current, c, beta, taylorN)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [beta, taylorN])

  const maxError = computeMaxError(beta, taylorN)
  const taylorBroken = maxError > 0.1
  const j0 = besselJ(0, beta)
  const j2 = besselJ(2, beta)
  const j4 = besselJ(4, beta)

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Taylor → Fourier-series → Bessel — γιατί δεν φτάνει η Taylor
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setBeta(p.beta)}
              className={`rounded-full border px-2.5 py-0.5 text-xs ${
                Math.abs(beta - p.beta) < 0.01
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-3 text-xs text-fg-muted">
        Πάνω: η συνάρτηση <span className="font-mono">cos(β sin θ)</span> που
        κρύβεται μέσα στο FM σήμα — εξακριβωμένη (μπλε) vs Taylor-truncated με{' '}
        <span className="font-mono">N</span> όρους (κόκκινη). Κάτω: οι ΑΚΡΙΒΕΙΣ
        Fourier-series συντελεστές — δηλαδή οι Bessel <span className="font-mono">J_n(β)</span>.
        Σύρε το β: για μικρό β η Taylor δουλεύει· για μεγάλο β σπάει, αλλά τα Bessel
        εξακολουθούν να δίνουν τις σωστές αρμονικές.
      </p>

      <canvas
        ref={timeCanvasRef}
        style={{ height: 200 }}
        className="block h-[200px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="cos(β sin θ) exact vs Taylor truncation in time"
      />

      <canvas
        ref={freqCanvasRef}
        style={{ height: 180 }}
        className="mt-3 block h-[180px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Bessel coefficients J_n(β) as Fourier-series stem plot"
      />

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            β ={' '}
            <span className="font-mono text-fg tabular-nums">{beta.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0}
            max={8}
            step={0.01}
            value={beta}
            onChange={(e) => setBeta(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Modulation index beta"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            Taylor όροι N ={' '}
            <span className="font-mono text-fg tabular-nums">{taylorN}</span>{' '}
            <span className="text-fg-subtle">
              (κρατάει 1, φ², φ⁴, … έως φ
              <sup>{2 * taylorN}</sup>)
            </span>
          </label>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={taylorN}
            onChange={(e) => setTaylorN(parseInt(e.target.value, 10))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Number of Taylor terms"
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <Stat
          label="Max σφάλμα Taylor"
          value={maxError.toFixed(3)}
          highlight={taylorBroken}
        />
        <Stat label="J₀(β)" value={j0.toFixed(3)} />
        <Stat label="J₂(β)" value={j2.toFixed(3)} />
        <Stat label="J₄(β)" value={j4.toFixed(3)} />
      </div>

      {taylorBroken && (
        <div className="mt-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs">
          <strong>⚠️ Taylor σπάει.</strong> Στο β ={' '}
          <span className="font-mono">{beta.toFixed(2)}</span> με N ={' '}
          <span className="font-mono">{taylorN}</span> όρους, η Taylor έχει
          σφάλμα <span className="font-mono">{maxError.toFixed(2)}</span> — η
          σειρά συγκλίνει αργά. Αυτή είναι η περίπτωση WBFM (β ≳ 1). Η σωστή
          απάντηση: αναπτύσσεις το <span className="font-mono">cos(β sin θ)</span>{' '}
          σε <em>σειρά Fourier</em> (είναι περιοδική!) — οι συντελεστές βγαίνουν
          οι Bessel <span className="font-mono">J_n(β)</span>, που φαίνονται στο
          κάτω panel και είναι σωστοί <strong>για κάθε β</strong>.
        </div>
      )}

      {!taylorBroken && beta < 1 && (
        <div className="mt-3 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs">
          <strong>✓ NBFM regime.</strong> Στο β ={' '}
          <span className="font-mono">{beta.toFixed(2)}</span>, ακόμα και ένας
          μόνο Taylor όρος (N=1) δίνει την προσέγγιση{' '}
          <span className="font-mono">cos(β sin θ) ≈ 1</span> και{' '}
          <span className="font-mono">sin(β sin θ) ≈ β sin θ</span>. Από εδώ
          βγαίνει το γνωστό NBFM φάσμα. Για WBFM σύρε το β πάνω από 1.
        </div>
      )}
    </figure>
  )
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-md border px-2 py-1 ${
        highlight ? 'border-amber-500/40 bg-amber-500/10' : 'border-border bg-bg-soft'
      }`}
    >
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="font-mono text-fg tabular-nums">{value}</div>
    </div>
  )
}

const EXACT_C = 'rgb(29, 78, 216)'
const TAYLOR_C = 'rgb(220, 38, 38)'
const POS_J = 'rgb(29, 78, 216)'
const NEG_J = 'rgb(217, 119, 6)'

function computeMaxError(beta: number, taylorN: number): number {
  let maxErr = 0
  for (let i = 0; i <= SAMPLES; i++) {
    const theta = (i / SAMPLES) * 2 * Math.PI
    const phi = beta * Math.sin(theta)
    const exact = Math.cos(phi)
    const approx = taylorCosPhi(phi, taylorN)
    const err = Math.abs(exact - approx)
    if (err > maxErr) maxErr = err
  }
  return maxErr
}

function taylorCosPhi(phi: number, N: number): number {
  // cos(φ) = Σ_{k=0..N} (-1)^k · φ^{2k} / (2k)!
  let sum = 0
  for (let k = 0; k <= N; k++) {
    const sign = k % 2 === 0 ? 1 : -1
    sum += (sign * Math.pow(phi, 2 * k)) / factorial(2 * k)
  }
  return sum
}

function factorial(n: number): number {
  let f = 1
  for (let i = 2; i <= n; i++) f *= i
  return f
}

function drawTime(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  beta: number,
  taylorN: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const PAD_L = 40
  const PAD_R = 24
  const PAD_TOP = 22
  const PAD_BOTTOM = 26

  const xt = (t: number) => lerp(t, 0, 1, PAD_L, w - PAD_R) // t ∈ [0, 1] = one period
  // Y-range: cos(β sin θ) ∈ [-1, 1], Taylor can blow up for large N → clip to [-2, 2]
  const yPlot = (y: number) => lerp(clamp(y, -2, 2), 2, -2, PAD_TOP, h - PAD_BOTTOM)

  // Y-axis gridlines at -1, 0, +1
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.setLineDash([2, 4])
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'right'
  for (const yv of [-1, 0, 1]) {
    const y = yPlot(yv)
    ctx.beginPath()
    ctx.moveTo(PAD_L, y)
    ctx.lineTo(w - PAD_R, y)
    ctx.stroke()
    ctx.fillText(yv.toFixed(0), PAD_L - 4, y + 3)
  }
  ctx.setLineDash([])

  // X-axis at y = -2 (clipped bottom)
  ctx.strokeStyle = colors.border
  ctx.beginPath()
  const yBase = yPlot(-2)
  ctx.moveTo(PAD_L, yBase)
  ctx.lineTo(w - PAD_R, yBase)
  ctx.stroke()
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'center'
  ctx.fillText('0', PAD_L, h - PAD_BOTTOM + 12)
  ctx.fillText('T/2', (PAD_L + w - PAD_R) / 2, h - PAD_BOTTOM + 12)
  ctx.fillText('T', w - PAD_R, h - PAD_BOTTOM + 12)
  ctx.textAlign = 'right'
  ctx.fillText('θ = 2π f_m t →', w - PAD_R, h - PAD_BOTTOM + 22)

  // Exact: cos(β sin θ)
  ctx.strokeStyle = EXACT_C
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES
    const theta = t * 2 * Math.PI
    const phi = beta * Math.sin(theta)
    const y = Math.cos(phi)
    const x = xt(t)
    const yy = yPlot(y)
    if (i === 0) ctx.moveTo(x, yy)
    else ctx.lineTo(x, yy)
  }
  ctx.stroke()

  // Taylor truncation
  ctx.strokeStyle = TAYLOR_C
  ctx.lineWidth = 1.5
  ctx.setLineDash([5, 3])
  ctx.beginPath()
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES
    const theta = t * 2 * Math.PI
    const phi = beta * Math.sin(theta)
    const y = taylorCosPhi(phi, taylorN)
    const x = xt(t)
    const yy = yPlot(y)
    if (i === 0) ctx.moveTo(x, yy)
    else ctx.lineTo(x, yy)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // Title
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('cos(β sin θ) στο time domain — μια περίοδος', PAD_L, PAD_TOP - 6)

  // Legend (top-right)
  let lx = w - PAD_R - 220
  const ly = PAD_TOP - 6
  ctx.fillStyle = EXACT_C
  ctx.fillRect(lx, ly - 7, 12, 2)
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('εξακριβωμένο', lx + 16, ly - 2)
  lx += 88
  ctx.strokeStyle = TAYLOR_C
  ctx.setLineDash([5, 3])
  ctx.beginPath()
  ctx.moveTo(lx, ly - 6)
  ctx.lineTo(lx + 12, ly - 6)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.fgMuted
  ctx.fillText(`Taylor N=${taylorN}`, lx + 16, ly - 2)
}

function drawFreq(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  beta: number,
  taylorN: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const PAD_L = 40
  const PAD_R = 24
  const PAD_TOP = 22
  const PAD_BOTTOM = 30

  const N_VIS = 8
  const xn = (n: number) => lerp(n, -N_VIS, N_VIS, PAD_L, w - PAD_R)
  const yMax = 1.05
  const yPlot = (m: number) => lerp(m, -yMax, yMax, h - PAD_BOTTOM, PAD_TOP)
  const yZero = yPlot(0)

  // Y gridlines
  ctx.strokeStyle = colors.border
  ctx.setLineDash([2, 4])
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'right'
  for (const yv of [-0.5, 0, 0.5, 1]) {
    const y = yPlot(yv)
    ctx.beginPath()
    ctx.moveTo(PAD_L, y)
    ctx.lineTo(w - PAD_R, y)
    ctx.stroke()
    ctx.fillText(yv.toFixed(1), PAD_L - 4, y + 3)
  }
  ctx.setLineDash([])

  // X-axis
  ctx.strokeStyle = colors.border
  ctx.beginPath()
  ctx.moveTo(PAD_L, yZero)
  ctx.lineTo(w - PAD_R, yZero)
  ctx.stroke()

  // Bessel stems J_n(β) for n = -N_VIS .. N_VIS
  for (let n = -N_VIS; n <= N_VIS; n++) {
    const J = besselJ(n, beta)
    const x = xn(n)
    const yEnd = yPlot(J)
    const isInsideTaylorBudget = Math.abs(n) <= taylorN // Taylor with N terms can reach up to ±N harmonics
    ctx.strokeStyle = J >= 0 ? POS_J : NEG_J
    ctx.lineWidth = n === 0 ? 2.5 : 1.6
    ctx.globalAlpha = isInsideTaylorBudget ? 1 : 0.35
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, yEnd)
    ctx.stroke()

    // Marker
    ctx.fillStyle = ctx.strokeStyle
    ctx.beginPath()
    ctx.arc(x, yEnd, n === 0 ? 3.5 : 2.6, 0, 2 * Math.PI)
    ctx.fill()
    ctx.globalAlpha = 1
  }

  // n labels on x-axis
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let n = -N_VIS; n <= N_VIS; n++) {
    if (n === 0) {
      ctx.fillStyle = colors.fg
      ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
      ctx.fillText('0', xn(n), h - PAD_BOTTOM + 12)
      ctx.fillStyle = colors.fgSubtle
      ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    } else if (Math.abs(n) % 2 === 0 || Math.abs(n) === 1) {
      ctx.fillText(n.toString(), xn(n), h - PAD_BOTTOM + 12)
    }
  }
  ctx.textAlign = 'right'
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('n (αρμονική) →', w - PAD_R, h - PAD_BOTTOM + 22)

  // Title
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(
    `J_n(β) — Fourier συντελεστές του cos(β sin θ)`,
    PAD_L,
    PAD_TOP - 6,
  )

  // Legend (top-right) — Taylor reach shading
  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'right'
  ctx.fillText(
    `έντονοι: |n| ≤ N=${taylorN} (Taylor reach)·· υπόλοιποι: μόνο μέσω Bessel`,
    w - PAD_R,
    PAD_TOP - 6,
  )
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v))
}
