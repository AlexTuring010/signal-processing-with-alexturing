'use client'

/**
 * LimitRatioPlot — see the limit f(n)/g(n) decide the symbol.
 *
 * The lecture's "limit shortcut" — compute lim f/g and read off Θ / o / ω —
 * stays a rule on paper until the student watches the ratio actually
 * settle (or fail to). This viz turns a handful of canonical pairs into
 * a single plot of f(n)/g(n) on log-log axes, with the asymptote drawn
 * in and the verdict spelled out:
 *
 *   • f = n², g = n → ratio = n → ∞    ⇒ f ∈ ω(g)
 *   • f = 3n² + 5, g = n² → ratio → 3   ⇒ f ∈ Θ(g)
 *   • f = n⁴, g = 2ⁿ → ratio peaks then crashes → 0  ⇒ f ∈ o(g)
 *     (the «εκθετικό κυριαρχεί στο πολυωνυμικό» theorem made visible)
 *   • f = (log n)², g = √n → same shape, just way further out  ⇒ f ∈ o(g)
 *     (the «πολυωνυμικό κυριαρχεί στο πολυλογαριθμικό» theorem)
 *   • f = n^{1+sin n}, g = n → ratio = n^{sin n} bounces forever
 *     ⇒ f, g ασύγκριτα — no limit exists
 *
 * The fourth and fifth presets are the punchline: the ratio is HUGE for a
 * long stretch, and a student who only sampled small n would wrongly
 * conclude the polynomial / polylog wins. The plot makes the eventual
 * collapse visible.
 *
 * Built for L02.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type Verdict = 'theta' | 'o' | 'omega' | 'incomparable'

type Preset = {
  id: string
  fLabel: string
  gLabel: string
  f: (n: number) => number
  g: (n: number) => number
  nMin: number
  nMax: number
  // Drawn as a horizontal dashed line on the ratio plot (Θ case only).
  asymptote?: number
  verdict: Verdict
  verdictDetail: string
  blurb: string
}

const PRESETS: Preset[] = [
  {
    id: 'omega',
    fLabel: 'n²',
    gLabel: 'n',
    f: (n) => n * n,
    g: (n) => n,
    nMin: 1,
    nMax: 1000,
    verdict: 'omega',
    verdictDetail: 'lim (n²/n) = lim n = +∞',
    blurb:
      'Ο λόγος ΑΝΕΒΑΙΝΕΙ ευθεία — δεν φράσσεται από καμία σταθερά. Άρα η n² αυξάνεται «αυστηρά γρηγορότερα» από τη n.',
  },
  {
    id: 'theta',
    fLabel: '3n² + 5',
    gLabel: 'n²',
    f: (n) => 3 * n * n + 5,
    g: (n) => n * n,
    nMin: 1,
    nMax: 1000,
    asymptote: 3,
    verdict: 'theta',
    verdictDetail: 'lim ((3n² + 5)/n²) = 3 (πεπερασμένο, μη μηδενικό)',
    blurb:
      'Ο λόγος ισιώνει σε σταθερά (=3). Όταν το όριο είναι θετική σταθερά, οι δύο συναρτήσεις είναι ίδιας τάξης μεγέθους.',
  },
  {
    id: 'exp-beats-poly',
    fLabel: 'n⁴',
    gLabel: '2ⁿ',
    f: (n) => n ** 4,
    g: (n) => 2 ** n,
    nMin: 1,
    nMax: 40,
    verdict: 'o',
    verdictDetail: 'lim (n⁴/2ⁿ) = 0   (L\'Hôpital ×4 φορές)',
    blurb:
      'Ως n=16 το ν⁴ προηγείται — όποιος έβλεπε μόνο μικρά δείγματα θα στοιχημάτιζε σε αυτό. Από n≈16 και πέρα όμως, το 2ⁿ συντρίβει το ν⁴ και ο λόγος καταρρέει.',
  },
  {
    id: 'poly-beats-polylog',
    fLabel: '(log₂ n)²',
    gLabel: '√n',
    f: (n) => Math.log2(n) ** 2,
    g: (n) => Math.sqrt(n),
    nMin: 4,
    nMax: 1e8,
    verdict: 'o',
    verdictDetail: 'lim ((log n)²/√n) = 0 (L\'Hôpital, βλ. απόδειξη)',
    blurb:
      'Ίδιο μοτίβο, αλλά σε διαφορετική κλίμακα: ο λόγος κορυφώνεται γύρω στο n≈100 — και χρειάζεται n στα εκατομμύρια για να καταρρεύσει. Αυτή είναι η εικόνα του «πολυωνυμικό κυριαρχεί πολυλογαριθμικού».',
  },
  {
    id: 'incomparable',
    fLabel: 'n^{1+sin n}',
    gLabel: 'n',
    f: (n) => n ** (1 + Math.sin(n)),
    g: (n) => n,
    nMin: 1,
    nMax: 100,
    verdict: 'incomparable',
    verdictDetail: 'το όριο ΔΕΝ υπάρχει — ο λόγος ταλαντώνεται για πάντα',
    blurb:
      'Ο εκθέτης 1+sin n ταλαντώνεται μεταξύ 0 και 2, οπότε ο λόγος n^{sin n} άλλοτε εκτοξεύεται, άλλοτε σβήνει. Χωρίς όριο, δεν έχει νόημα κανένα από τα σύμβολα O, Ω, Θ, o, ω: οι δύο συναρτήσεις είναι ΑΣΥΓΚΡΙΤΕΣ.',
  },
]

const PLOT = { x0: 60, x1: 720, yTop: 28, yBot: 268 }
const SAMPLES = 220

function fmt(v: number): string {
  if (!Number.isFinite(v)) return '∞'
  if (Math.abs(v) >= 1e6) return v.toExponential(2)
  if (Math.abs(v) >= 100) return Math.round(v).toString()
  if (Math.abs(v) >= 1) return v.toFixed(2).replace(/\.?0+$/, '')
  if (Math.abs(v) >= 0.01) return v.toFixed(3)
  return v.toExponential(2)
}

export function LimitRatioPlot() {
  const [presetId, setPresetId] = useState(PRESETS[0].id)
  const preset = PRESETS.find((p) => p.id === presetId)!

  // Sample n on a log scale across the preset's range.
  const data = useMemo(() => {
    const out: { n: number; r: number; logN: number; logR: number }[] = []
    const lo = Math.log(preset.nMin)
    const hi = Math.log(preset.nMax)
    for (let i = 0; i < SAMPLES; i++) {
      const t = i / (SAMPLES - 1)
      const n = Math.exp(lo + (hi - lo) * t)
      const fv = preset.f(n)
      const gv = preset.g(n)
      const r = fv / gv
      if (Number.isFinite(r) && r > 0) {
        out.push({ n, r, logN: Math.log10(n), logR: Math.log10(r) })
      }
    }
    return out
  }, [preset])

  const xMinLog = Math.log10(preset.nMin)
  const xMaxLog = Math.log10(preset.nMax)
  const rMin = Math.min(...data.map((d) => d.r))
  const rMax = Math.max(...data.map((d) => d.r))
  // Pad the y-range a bit so the curve doesn't touch the borders.
  const yMinLog = Math.log10(Math.max(rMin * 0.5, 1e-12))
  const yMaxLog = Math.log10(rMax * 2)

  const xFor = (logN: number) =>
    PLOT.x0 + ((logN - xMinLog) / (xMaxLog - xMinLog)) * (PLOT.x1 - PLOT.x0)
  const yFor = (logR: number) =>
    PLOT.yBot - ((logR - yMinLog) / (yMaxLog - yMinLog)) * (PLOT.yBot - PLOT.yTop)

  const line = data
    .map((d) => `${xFor(d.logN).toFixed(1)},${yFor(d.logR).toFixed(1)}`)
    .join(' ')

  // Decade gridlines.
  const xTicks: number[] = []
  for (let e = Math.ceil(xMinLog); e <= Math.floor(xMaxLog); e++) xTicks.push(e)
  const yTicks: number[] = []
  for (let e = Math.ceil(yMinLog); e <= Math.floor(yMaxLog); e++) yTicks.push(e)

  // Numeric readout for the largest sampled n.
  const tail = data[data.length - 1]
  const verdictTone =
    preset.verdict === 'theta'
      ? 'theta'
      : preset.verdict === 'incomparable'
      ? 'warn'
      : 'change'

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Όριο f(n)/g(n) — διάλεξε ζευγάρι και δες τι αποφασίζει
        </div>
        <span className="font-mono text-[11px] text-fg-subtle">log-log κλίμακα</span>
      </div>

      {/* preset chips */}
      <div className="mb-3 flex flex-wrap gap-1">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPresetId(p.id)}
            className={cn(
              'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
              p.id === presetId
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-fg-muted hover:bg-bg-soft hover:text-fg',
            )}
          >
            <span className="font-mono">{p.fLabel}</span>
            <span className="mx-1 text-fg-subtle">/</span>
            <span className="font-mono">{p.gLabel}</span>
          </button>
        ))}
      </div>

      {/* chart */}
      <svg
        viewBox="0 0 760 320"
        className="w-full"
        role="img"
        aria-label={`Λόγος ${preset.fLabel} / ${preset.gLabel}`}
      >
        <style>{`
          .lr-grid { stroke: rgb(var(--border)); stroke-width: 0.5; stroke-dasharray: 2 3; }
          .lr-axis { stroke: rgb(var(--border-strong)); stroke-width: 1; }
          .lr-tick { font: 10px ui-sans-serif, system-ui; fill: rgb(var(--fg-subtle)); }
          .lr-axislabel { font: 11px ui-sans-serif, system-ui; fill: rgb(var(--fg-muted)); }
          .lr-one { stroke: rgb(var(--border-strong)); stroke-width: 0.75; stroke-dasharray: 1 2; }
        `}</style>

        {/* y grid (decades of ratio) */}
        {yTicks.map((e) => (
          <g key={`y-${e}`}>
            <line x1={PLOT.x0} x2={PLOT.x1} y1={yFor(e)} y2={yFor(e)} className="lr-grid" />
            <text x={PLOT.x0 - 6} y={yFor(e) + 3} textAnchor="end" className="lr-tick">
              10^{e}
            </text>
          </g>
        ))}
        {/* x grid (decades of n) */}
        {xTicks.map((e) => (
          <g key={`x-${e}`}>
            <line x1={xFor(e)} x2={xFor(e)} y1={PLOT.yTop} y2={PLOT.yBot} className="lr-grid" />
            <text x={xFor(e)} y={PLOT.yBot + 14} textAnchor="middle" className="lr-tick">
              10^{e}
            </text>
          </g>
        ))}

        {/* ratio = 1 reference line */}
        {0 >= yMinLog && 0 <= yMaxLog ? (
          <g>
            <line x1={PLOT.x0} x2={PLOT.x1} y1={yFor(0)} y2={yFor(0)} className="lr-one" />
            <text x={PLOT.x1 - 4} y={yFor(0) - 4} textAnchor="end" className="lr-tick">
              ratio = 1
            </text>
          </g>
        ) : null}

        {/* asymptote (Θ case) */}
        {preset.asymptote ? (
          <g>
            <line
              x1={PLOT.x0}
              x2={PLOT.x1}
              y1={yFor(Math.log10(preset.asymptote))}
              y2={yFor(Math.log10(preset.asymptote))}
              stroke="rgb(34 197 94)"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
            <text
              x={PLOT.x1 - 4}
              y={yFor(Math.log10(preset.asymptote)) - 4}
              textAnchor="end"
              className="lr-tick"
              fill="rgb(34 197 94)"
              fontWeight={700}
            >
              όριο = {preset.asymptote}
            </text>
          </g>
        ) : null}

        {/* axes */}
        <line x1={PLOT.x0} x2={PLOT.x1} y1={PLOT.yBot} y2={PLOT.yBot} className="lr-axis" />
        <line x1={PLOT.x0} x2={PLOT.x0} y1={PLOT.yTop} y2={PLOT.yBot} className="lr-axis" />
        <text
          x={(PLOT.x0 + PLOT.x1) / 2}
          y={PLOT.yBot + 28}
          textAnchor="middle"
          className="lr-axislabel"
        >
          n (λογαριθμική κλίμακα)
        </text>
        <text
          x={16}
          y={(PLOT.yTop + PLOT.yBot) / 2}
          textAnchor="middle"
          className="lr-axislabel"
          transform={`rotate(-90, 16, ${(PLOT.yTop + PLOT.yBot) / 2})`}
        >
          f(n) / g(n)
        </text>

        {/* the ratio curve */}
        <polyline
          points={line}
          fill="none"
          stroke="rgb(37 99 235)"
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </svg>

      {/* verdict block */}
      <div className="mt-3 grid gap-2 sm:grid-cols-[auto_1fr]">
        <div
          className={cn(
            'flex flex-col items-center justify-center rounded-lg border px-3 py-2 text-center',
            verdictTone === 'theta' && 'border-emerald-500/50 bg-emerald-500/10',
            verdictTone === 'change' && 'border-sky-500/50 bg-sky-500/10',
            verdictTone === 'warn' && 'border-amber-500/50 bg-amber-500/10',
          )}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
            συμπέρασμα
          </span>
          <span className="font-mono text-lg font-bold">
            {preset.verdict === 'theta' && (
              <>
                <span className="font-mono">{preset.fLabel}</span> ∈ Θ(
                <span className="font-mono">{preset.gLabel}</span>)
              </>
            )}
            {preset.verdict === 'o' && (
              <>
                <span className="font-mono">{preset.fLabel}</span> ∈ o(
                <span className="font-mono">{preset.gLabel}</span>)
              </>
            )}
            {preset.verdict === 'omega' && (
              <>
                <span className="font-mono">{preset.fLabel}</span> ∈ ω(
                <span className="font-mono">{preset.gLabel}</span>)
              </>
            )}
            {preset.verdict === 'incomparable' && (
              <span className="text-amber-700 dark:text-amber-300">ασύγκριτα</span>
            )}
          </span>
          <span className="mt-1 font-mono text-[11px] text-fg-subtle">
            στο n ≈ {fmt(tail.n)}: λόγος ≈ {fmt(tail.r)}
          </span>
        </div>

        <div className="rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted">
          <div className="mb-1 font-mono text-xs text-fg">{preset.verdictDetail}</div>
          {preset.blurb}
        </div>
      </div>
    </section>
  )
}
