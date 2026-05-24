'use client'

/**
 * MasterCase1Tree — the recursion trees of pt6-th3 parts (A) and (B-iii).
 *
 * Two recurrences with the SAME subproblem size 2n/3 but different branching
 * factors a — and the lesson is how brutally a changes the answer:
 *   • Tab A: T(n) = 3·T(2n/3) + c   →   Θ(n^{log_{3/2} 3}) ≈ Θ(n^{2.71})
 *   • Tab B: S(n) = 1·S(2n/3) + c   →   Θ(log n)
 *
 * Same depth H = ⌈log_{3/2} n⌉, but tab A has 3^k nodes at level k (an
 * explosion that swamps every previous level) while tab B has a single chain
 * of nodes (depth-only cost). The viz shows per-level node count + per-level
 * work as a horizontal bar chart, with the cumulative sum below — the gap
 * between the two cumulative numbers is the headline of the problem.
 *
 * Built for L10 (Phase D).
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type Mode = 'A' | 'B'

const N_PRESETS = [4, 8, 16, 32, 64]

const LOG_15 = Math.log(1.5)
const LOG_15_3 = Math.log(3) / LOG_15 // ≈ 2.7095

type Level = {
  k: number
  size: number
  nodes: number
  levelWork: number
}

function computeLevels(n: number, mode: Mode): Level[] {
  const H = Math.ceil(Math.log(n) / LOG_15)
  const levels: Level[] = []
  for (let k = 0; k <= H; k++) {
    const size = n * Math.pow(2 / 3, k)
    const nodes = mode === 'A' ? Math.pow(3, k) : 1
    levels.push({ k, size, nodes, levelWork: nodes })
  }
  return levels
}

function fmt(x: number): string {
  if (x >= 100000) return x.toExponential(1).replace('+', '')
  if (Number.isInteger(x) || x >= 1000) return Math.round(x).toString()
  return x.toFixed(2)
}

export function MasterCase1Tree() {
  const [mode, setMode] = useState<Mode>('A')
  const [n, setN] = useState(16)

  const levelsA = useMemo(() => computeLevels(n, 'A'), [n])
  const levelsB = useMemo(() => computeLevels(n, 'B'), [n])
  const levels = mode === 'A' ? levelsA : levelsB

  const totalWorkA = useMemo(
    () => levelsA.reduce((sum, l) => sum + l.levelWork, 0),
    [levelsA],
  )
  const totalWorkB = useMemo(
    () => levelsB.reduce((sum, l) => sum + l.levelWork, 0),
    [levelsB],
  )
  const totalWork = mode === 'A' ? totalWorkA : totalWorkB

  // Bar width: use ⁵√(nodes) so the explosion is visible but doesn't break the
  // layout for the last level.
  const maxBarPx = 240
  const maxNodes = Math.max(...levels.map((l) => l.nodes))
  const barWidth = (nodes: number) => {
    if (maxNodes <= 1) return Math.max(8, maxBarPx * 0.04)
    const r = Math.pow(nodes / maxNodes, 0.55)
    return Math.max(6, r * maxBarPx)
  }

  const closedFormA = `≈ Θ(n^${LOG_15_3.toFixed(2)})`

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Δύο αναδρομές με ίδιο μέγεθος υποπροβλήματος, διαφορετικό a
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-md bg-bg-soft p-0.5">
          <button
            type="button"
            onClick={() => setMode('A')}
            className={cn(
              'rounded px-2.5 py-1 text-[11px] font-bold tracking-wide transition-colors',
              mode === 'A'
                ? 'bg-rose-500/15 text-rose-700 dark:bg-rose-500/25 dark:text-rose-200'
                : 'text-fg-muted hover:text-fg',
            )}
          >
            (A) T = 3·T(2n/3) + c
          </button>
          <button
            type="button"
            onClick={() => setMode('B')}
            className={cn(
              'rounded px-2.5 py-1 text-[11px] font-bold tracking-wide transition-colors',
              mode === 'B'
                ? 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-200'
                : 'text-fg-muted hover:text-fg',
            )}
          >
            (B) S = 1·S(2n/3) + c
          </button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-fg-muted">
        <span className="font-semibold uppercase tracking-wider text-fg-subtle">
          n:
        </span>
        {N_PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setN(p)}
            className={cn(
              'rounded-md border px-2 py-0.5 text-xs font-semibold',
              p === n
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-fg-muted hover:bg-bg-soft',
            )}
          >
            {p}
          </button>
        ))}
        <span className="ml-auto rounded bg-bg-soft px-2 py-0.5 text-[11px] font-bold text-fg-muted">
          Βάθος H = ⌈log<sub>3/2</sub> {n}⌉ = {levels.length - 1}
        </span>
      </div>

      {/* Level bars */}
      <div className="space-y-1.5">
        {levels.map((l) => (
          <div key={l.k} className="flex items-center gap-2">
            <div className="w-24 shrink-0 text-right font-mono text-[11px] text-fg-subtle">
              level {l.k}
              <span className="ml-1 opacity-60">(size ≈ {fmt(l.size)})</span>
            </div>
            <div className="flex-1">
              <div
                className={cn(
                  'h-5 rounded-r',
                  mode === 'A' ? 'bg-rose-500/55' : 'bg-emerald-500/55',
                )}
                style={{ width: `${barWidth(l.nodes)}px` }}
              />
            </div>
            <div className="shrink-0 font-mono text-[11px] text-fg">
              <span className="font-bold">{fmt(l.nodes)}</span>{' '}
              <span className="text-fg-subtle">nodes</span>
              <span className="mx-1 text-fg-subtle">·</span>
              <span className="font-bold">{fmt(l.levelWork)}</span>{' '}
              <span className="text-fg-subtle">work</span>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div
          className={cn(
            'rounded-lg border p-3',
            mode === 'A'
              ? 'border-rose-500/40 bg-rose-500/5'
              : 'border-emerald-500/40 bg-emerald-500/5',
          )}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            Συνολική δουλειά
          </div>
          <div className="mt-0.5 font-mono text-base font-bold text-fg">
            ≈ {fmt(totalWork)}
          </div>
          <div className="text-xs leading-relaxed text-fg-muted">
            {mode === 'A'
              ? `Άθροισμα γεωμετρικής με ρυθμό 3· κυριαρχεί ο τελευταίος όρος.`
              : `Ένας κόμβος ανά επίπεδο — άθροισμα = βάθος + 1.`}
          </div>
        </div>
        <div
          className={cn(
            'rounded-lg border p-3',
            mode === 'A'
              ? 'border-rose-500/40 bg-rose-500/5'
              : 'border-emerald-500/40 bg-emerald-500/5',
          )}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            Κλειστή μορφή (Master Theorem)
          </div>
          <div className="mt-0.5 font-mono text-base font-bold text-fg">
            {mode === 'A' ? (
              <>
                Θ(n<sup>log<sub>3/2</sub> 3</sup>) {closedFormA}
              </>
            ) : (
              <>Θ(log n)</>
            )}
          </div>
          <div className="text-xs leading-relaxed text-fg-muted">
            {mode === 'A'
              ? `a = 3, b = 3/2, f = Θ(1). n^{log_b a} ≈ n^${LOG_15_3.toFixed(2)} φύλλα — περίπτωση 1.`
              : `a = 1, b = 3/2, f = Θ(1). n^{log_b a} = 1 = f — περίπτωση 2 → ×log n.`}
          </div>
        </div>
      </div>

      {/* Comparison footer */}
      <div className="mt-3 rounded-lg border border-border bg-bg-soft/40 p-3 text-xs leading-relaxed text-fg-muted">
        <span className="font-semibold text-fg">Ο λόγος:</span> για n = {n}, η
        (A) κάνει περίπου <span className="font-mono font-bold text-rose-700 dark:text-rose-300">{fmt(totalWorkA)}</span>{' '}
        μονάδες δουλειάς, η (B) κάνει{' '}
        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{fmt(totalWorkB)}</span>.
        Ίδιος ρυθμός μείωσης μεγέθους (×2/3), αλλά η (A) πληθαίνει τα
        υποπροβλήματα κάθε φορά ×3 — και αυτό κάνει όλη τη διαφορά. Για την
        επιδιόρθωση σωρού (B-iii) η μοναδική κλήση ανά επίπεδο μάς δίνει{' '}
        Θ(log n) — το ύψος του σωρού.
      </div>
    </section>
  )
}
