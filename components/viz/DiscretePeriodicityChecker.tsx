'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2, AlertTriangle, Sigma } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Slide 11-12 walker: is x[n] = cos(ω n) periodic?
 *
 * The discrete-time test is stricter than the continuous-time one. For a
 * continuous-time cosine cos(ω t) any positive ω gives period 2π/ω. For
 * a DISCRETE-time cosine cos(ω n) periodicity requires the period N to be a
 * POSITIVE INTEGER number of samples — that is, ω N = 2π m with m ∈ ℤ⁺,
 * or equivalently `2π / ω = N / m` must be rational.
 *
 * Presets cover the two canonical slide examples:
 *   - ω = 4π/13 (slide 11) → N = 13 ✓
 *   - ω = 1/4 (slide 12) → 2π/ω = 8π, irrational → NOT periodic ✗
 *
 * Plus a few in-between cases so the student feels the boundary.
 */

const N_MIN = -8
const N_MAX = 32
const MAX_DENOM = 200
// A discrete cosine is periodic only when 2π/ω is *exactly* rational. We can't
// prove irrationality numerically, but a loose tolerance is worse than useless:
// every irrational has excellent rational approximations, so TOL = 1e-3 falsely
// flagged cos(n/4) as periodic (377/15 ≈ 8π to 6e-4) and ω=1 too (710/113 ≈ 2π
// to 5e-7). A genuine rational ratio from a π-multiple lands within ~1e-15 of
// its value, so a tight tolerance cleanly separates the two. See node check in
// the PR that added the continuous overlay.
const TOL = 1e-7

type Preset = {
  id: string
  label: string
  omegaLabel: string
  omega: number
}

const PRESETS: Preset[] = [
  { id: 'pi3', label: 'ω = π/3', omegaLabel: 'π/3', omega: Math.PI / 3 },
  { id: 'slide11', label: 'ω = 4π/13 (slide 11)', omegaLabel: '4π/13', omega: (4 * Math.PI) / 13 },
  { id: 'pi-half', label: 'ω = π/2', omegaLabel: 'π/2', omega: Math.PI / 2 },
  { id: 'slide12', label: 'ω = 1/4 (slide 12)', omegaLabel: '1/4', omega: 0.25 },
  { id: 'one', label: 'ω = 1', omegaLabel: '1', omega: 1 },
]

function rationalApprox(x: number): { p: number; q: number } | null {
  for (let q = 1; q <= MAX_DENOM; q++) {
    const p = Math.round(x * q)
    if (p === 0) continue
    if (Math.abs(x - p / q) < TOL) return { p, q }
  }
  return null
}

type Result =
  | { periodic: true; N: number; m: number; ratioText: string }
  | { periodic: false; ratioApprox: number; reason: string }

function analyse(omega: number): Result {
  if (omega === 0) {
    return { periodic: true, N: 1, m: 0, ratioText: '∞' }
  }
  const ratio = (2 * Math.PI) / omega // = N/m
  const r = rationalApprox(ratio)
  if (!r) {
    return {
      periodic: false,
      ratioApprox: ratio,
      reason:
        '2π/ω είναι άρρητο — δεν υπάρχουν θετικοί ακέραιοι N, m με ωN = 2π m. Στο διακριτό χρόνο το «κλείσιμο» μετά ολόκληρο αριθμό δειγμάτων είναι μαθηματικά αδύνατο.',
    }
  }
  return {
    periodic: true,
    N: r.p,
    m: r.q,
    ratioText: `${r.p}/${r.q}`,
  }
}

export function DiscretePeriodicityChecker() {
  const [omega, setOmega] = useState((4 * Math.PI) / 13)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const result = useMemo(() => analyse(omega), [omega])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = getThemeColors()
    if (!colors) return
    draw(canvas, colors, omega, result)
  }, [omega, result])

  const activePreset = PRESETS.find((p) => Math.abs(p.omega - omega) < 1e-6)
  const ratio = (2 * Math.PI) / omega

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Είναι περιοδικό το διακριτό x[n] = cos(ω n);
        </h4>
        {result.periodic ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" /> Περιοδικό · N = {result.N}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
            <AlertTriangle className="h-3.5 w-3.5" /> ΟΧΙ περιοδικό
          </span>
        )}
      </div>

      <p className="mb-3 text-xs text-fg-muted">
        Στο διακριτό χρόνο, η συνθήκη <code className="font-mono">cos(ω(n + N)) = cos(ω n)</code> απαιτεί{' '}
        <code className="font-mono">ω N = 2π m</code> με <strong>m ∈ ℤ⁺</strong>, δηλαδή ο λόγος{' '}
        <code className="font-mono">2π / ω = N / m</code> πρέπει να είναι <strong>ρητός</strong>. Όχι «κάποιο» N — <em>ακέραιο</em> N.
      </p>

      <p className="mb-3 text-xs text-fg-muted">
        Στο διάγραμμα: ο αχνός γκρι κυματισμός είναι το <strong>συνεχές</strong>{' '}
        <code className="font-mono">cos(ωt)</code>, και τα stems είναι τα δείγματά του στους
        ακεραίους <code className="font-mono">n</code>. <span className="text-amber-600 dark:text-amber-400">Πορτοκαλί</span> =
        πού συμπληρώνει <strong>έναν</strong> κύκλο το συνεχές κύμα·{' '}
        <span className="text-emerald-600 dark:text-emerald-400">πράσινο</span> = πού (αν) ξανακλείνει το διακριτό.
        Όταν το πορτοκαλί πέφτει <em>ανάμεσα</em> σε δείγματα, το διακριτό δεν ξανακλείνει ποτέ εκεί.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 180 }}
        className="block h-[180px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Discrete cosine stem plot"
      />

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            ω = <span className="font-mono text-fg tabular-nums">{omega.toFixed(4)}</span> rad
          </label>
          <input
            type="range"
            min={0.05}
            max={Math.PI}
            step={0.005}
            value={omega}
            onChange={(e) => setOmega(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Angular frequency ω"
          />
        </div>
        <div>
          <div className="mb-1 text-xs text-fg-muted">Presets</div>
          <div className="flex flex-wrap gap-1">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setOmega(p.omega)}
                className={cn(
                  'rounded-full border px-2 py-0.5 text-[11px] transition-colors',
                  activePreset?.id === p.id
                    ? 'border-accent bg-accent text-accent-fg'
                    : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg',
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-md border border-border bg-bg-soft/40 px-3 py-2 text-[0.9rem] leading-relaxed">
        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          <Sigma className="h-3 w-3" />
          Έλεγχος βήμα-βήμα
        </div>
        <div className="space-y-1">
          <div>
            <strong>(1)</strong> Συνθήκη: ω N = 2π m, m ∈ ℤ⁺ → ζητάμε{' '}
            <code className="font-mono">2π / ω = N / m</code>.
          </div>
          <div>
            <strong>(2)</strong>{' '}
            <code className="font-mono">
              2π / ω = 2π / ({activePreset?.omegaLabel ?? omega.toFixed(3)}) ={' '}
              {result.periodic ? result.ratioText : `≈ ${ratio.toFixed(4)} (άρρητο)`}
            </code>
          </div>
          <div>
            <strong>(3)</strong>{' '}
            {result.periodic ? (
              <>
                Με <code className="font-mono">N = {result.N}</code>,{' '}
                <code className="font-mono">m = {result.m}</code> ικανοποιείται η συνθήκη.{' '}
                Θεμελιώδης περίοδος{' '}
                <code className="font-mono">N = {result.N}</code> δείγματα.
              </>
            ) : (
              <>
                {result.reason}{' '}
                <span className="text-fg-muted">
                  Ένας πλήρης κύκλος του συνεχούς κύματος = 2π/ω ≈{' '}
                  <code className="font-mono">{ratio.toFixed(2)}</code> δείγματα — μη ακέραιος, οπότε
                  κανένα δείγμα δεν πέφτει εκεί που το κύμα ξανακλείνει.
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-fg-muted">
        <strong>Διαίσθηση — γιατί είναι αυστηρότερο από το συνεχές:</strong> στο συνεχές μπορείς να
        ολισθήσεις κατά <em>οποιονδήποτε</em> πραγματικό χρόνο, άρα το{' '}
        <code className="font-mono">cos(ωt)</code> ξανακλείνει πάντα μετά από 2π/ω. Στο διακριτό
        ολισθαίνεις μόνο κατά <strong>ακέραια</strong> δείγματα, οπότε ξανακλείνει μόνο αν ένας
        ακέραιος αριθμός δειγμάτων χωρά ακριβώς ακέραιο αριθμό κύκλων. Γι' αυτό η κλασική παγίδα του{' '}
        <strong>slide 12</strong>, <code className="font-mono">x[n] = cos(n/4)</code>: ένας κύκλος ={' '}
        8π ≈ 25.13 δείγματα — ποτέ στρογγυλός αριθμός, άρα <strong>όχι</strong> περιοδικό, παρόλο που
        το συνεχές <code className="font-mono">cos(t/4)</code> είναι (περίοδος 8π s).
      </p>
    </figure>
  )
}

function draw(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  omega: number,
  result: Result,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const padding = { top: 8, right: 8, bottom: 22, left: 24 }
  const plotX = padding.left
  const plotY = padding.top
  const plotW = w - padding.left - padding.right
  const plotH = h - padding.top - padding.bottom

  // Border + mid-line
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.strokeRect(plotX + 0.5, plotY + 0.5, plotW - 1, plotH - 1)

  const yZero = plotY + plotH / 2
  ctx.strokeStyle = colors.fgSubtle
  ctx.setLineDash([2, 4])
  ctx.beginPath()
  ctx.moveTo(plotX, yZero)
  ctx.lineTo(plotX + plotW, yZero)
  ctx.stroke()
  ctx.setLineDash([])

  // n = 0 line
  const xZero = lerp(0, N_MIN, N_MAX, plotX, plotX + plotW)
  ctx.beginPath()
  ctx.moveTo(xZero, plotY)
  ctx.lineTo(xZero, plotY + plotH)
  ctx.stroke()

  // axis ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let n = N_MIN; n <= N_MAX; n += 4) {
    const xx = lerp(n, N_MIN, N_MAX, plotX, plotX + plotW)
    ctx.fillText(String(n), xx, plotY + plotH + 14)
  }
  ctx.textAlign = 'right'
  ctx.fillText('1', plotX - 4, plotY + 10)
  ctx.fillText('−1', plotX - 4, plotY + plotH - 2)

  // Faint continuous sibling cos(ω t) — the wave the integer stems are read off
  // of. Seeing it is the whole point: the discrete signal is just samples of
  // this curve, and periodicity is about whether a *whole* number of samples
  // ever lands back where the curve repeats.
  ctx.strokeStyle = colors.fgSubtle
  ctx.globalAlpha = 0.5
  ctx.lineWidth = 1.25
  ctx.beginPath()
  const CSTEPS = 600
  for (let i = 0; i <= CSTEPS; i++) {
    const t = lerp(i, 0, CSTEPS, N_MIN, N_MAX)
    const xx = lerp(t, N_MIN, N_MAX, plotX, plotX + plotW)
    const yy = lerp(Math.cos(omega * t), 1, -1, plotY + 6, plotY + plotH - 6)
    if (i === 0) ctx.moveTo(xx, yy)
    else ctx.lineTo(xx, yy)
  }
  ctx.stroke()
  ctx.globalAlpha = 1

  // One full cycle of the continuous wave spans `ratio = 2π/ω` samples.
  const ratio = omega !== 0 ? (2 * Math.PI) / omega : Infinity

  // GREEN: where the *discrete* signal actually realigns — samples land back
  // exactly every N. Only happens at integer sample positions.
  if (result.periodic) {
    for (let k = 1; k * result.N <= N_MAX; k++) {
      const nMark = k * result.N
      const xx = lerp(nMark, N_MIN, N_MAX, plotX, plotX + plotW)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)' // emerald
      ctx.lineWidth = 1
      ctx.setLineDash([4, 3])
      ctx.beginPath()
      ctx.moveTo(xx, plotY + 2)
      ctx.lineTo(xx, plotY + plotH - 2)
      ctx.stroke()
      ctx.setLineDash([])
      if (k === 1) {
        ctx.fillStyle = '#10b981'
        ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(`ξανακλείνει: n=${result.N}`, xx, plotY + 10)
      }
    }
  }

  // ORANGE: where the *continuous* wave first completes one full cycle (back to
  // its t=0 value). If this falls between integer samples — as it does for
  // cos(n/4), at 8π ≈ 25.13 — the discrete signal never closes there. Drawn only
  // when it doesn't coincide with a realignment (otherwise it'd overlap green).
  const coincides = result.periodic && Math.abs(ratio - result.N) < 0.02
  if (Number.isFinite(ratio) && ratio <= N_MAX && !coincides) {
    const xx = lerp(ratio, N_MIN, N_MAX, plotX, plotX + plotW)
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.75)' // amber
    ctx.lineWidth = 1
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(xx, plotY + 2)
    ctx.lineTo(xx, plotY + plotH - 2)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = '#d97706' // amber-600
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    const lx = Math.min(Math.max(xx, plotX + 40), plotX + plotW - 40)
    ctx.fillText(`1 κύκλος ≈ ${ratio.toFixed(1)} δείγματα`, lx, plotY + plotH - 4)
  }

  // Stems
  for (let n = N_MIN; n <= N_MAX; n++) {
    const v = Math.cos(omega * n)
    const xx = lerp(n, N_MIN, N_MAX, plotX, plotX + plotW)
    const yy = lerp(v, 1, -1, plotY + 6, plotY + plotH - 6)
    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(xx, yZero)
    ctx.lineTo(xx, yy)
    ctx.stroke()
    ctx.fillStyle = colors.accent
    ctx.beginPath()
    ctx.arc(xx, yy, 3, 0, Math.PI * 2)
    ctx.fill()
  }
}
