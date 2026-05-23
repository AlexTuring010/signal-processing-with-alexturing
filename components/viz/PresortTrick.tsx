'use client'

/**
 * PresortTrick — the log factor saved by sorting once instead of in every call.
 *
 * Two recursion-tree-cost ledgers, side by side:
 *
 *   sort-inside  →  level i does n × (log n − i)        ⟶  Θ(n log² n)
 *   presort once →  level i does n;  one-off setup n log n  ⟶  Θ(n log n)
 *
 * The bars at each level make the per-level shape visible — a decreasing
 * triangle for sort-inside vs. a flat rectangle for presort — and the
 * total row at the bottom shows the gap growing as n grows. n is a
 * preset (powers of 2) so the depth comes out clean.
 *
 * Built for L05.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'

const N_OPTIONS = [4, 8, 16, 32, 64, 128] as const
type NVal = (typeof N_OPTIONS)[number]

type Row = { level: number; work: number }

function buildRecursion(n: number): {
  sortRows: Row[]
  preRows: Row[]
  preSetup: number
  sortTotal: number
  preTotal: number
} {
  const sortRows: Row[] = []
  const preRows: Row[] = []
  const depth = Math.log2(n)
  let sortTotal = 0
  let preTotal = 0
  for (let i = 0; i <= depth; i++) {
    const sortWork = n * (depth - i)
    const preWork = n
    sortRows.push({ level: i, work: sortWork })
    preRows.push({ level: i, work: preWork })
    sortTotal += sortWork
    preTotal += preWork
  }
  // presort has a one-time O(n log n) setup at the top
  const preSetup = n * depth
  preTotal += preSetup
  return { sortRows, preRows, preSetup, sortTotal, preTotal }
}

function formatNum(x: number): string {
  if (x >= 1000) return Math.round(x).toLocaleString('en-US').replace(/,/g, ' ')
  return String(Math.round(x))
}

export function PresortTrick() {
  const [n, setN] = useState<NVal>(16)
  const { sortRows, preRows, preSetup, sortTotal, preTotal } = buildRecursion(n)
  const depth = Math.log2(n)
  const maxWork = Math.max(
    ...sortRows.map((r) => r.work),
    ...preRows.map((r) => r.work),
    preSetup,
  )

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 text-sm font-semibold tracking-tight text-fg">
        Από O(n log² n) σε O(n log n) — προταξινόμηση μία φορά
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Δουλειά ανά επίπεδο της αναδρομής, για n = {n} σημεία και βάθος {depth}.
      </p>

      {/* n selector */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-fg-subtle">n =</span>
        <div className="flex overflow-hidden rounded-md border border-border text-xs font-medium">
          {N_OPTIONS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setN(v)}
              className={cn(
                'border-r border-border px-2.5 py-1 last:border-r-0 transition-colors',
                v === n
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg hover:bg-bg-soft',
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* dual panels */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Panel
          title="Σύγκρ. ταξινόμηση μέσα σε κάθε κλήση"
          subtitle="T(n) = 2T(n/2) + O(n log n)"
          formula="O(n log² n)"
          tone="bad"
          rows={sortRows}
          setup={null}
          maxWork={maxWork}
          total={sortTotal}
        />
        <Panel
          title="Προταξινόμηση μία φορά στην αρχή"
          subtitle="T(n) = 2T(n/2) + O(n) + αρχικό O(n log n)"
          formula="O(n log n)"
          tone="good"
          rows={preRows}
          setup={preSetup}
          maxWork={maxWork}
          total={preTotal}
        />
      </div>

      {/* gap callout */}
      <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-100">
        Λόγος συνολικού κόστους:{' '}
        <span className="font-mono">{formatNum(sortTotal)}</span> / <span className="font-mono">{formatNum(preTotal)}</span> ={' '}
        <strong className="font-mono">{(sortTotal / preTotal).toFixed(2)}×</strong> — και ο λόγος μεγαλώνει σαν <span className="font-mono">log n</span>. Για n = 10⁶ ο πρώτος αλγόριθμος είναι ήδη ~10× πιο αργός από τον δεύτερο.
      </div>
    </section>
  )
}

function Panel({
  title,
  subtitle,
  formula,
  tone,
  rows,
  setup,
  maxWork,
  total,
}: {
  title: string
  subtitle: string
  formula: string
  tone: 'bad' | 'good'
  rows: Row[]
  setup: number | null
  maxWork: number
  total: number
}) {
  const stripe = tone === 'bad' ? 'bg-rose-500/70' : 'bg-emerald-500/70'
  const stripeSetup = tone === 'bad' ? 'bg-rose-500/40' : 'bg-emerald-500/40'
  const ringTone = tone === 'bad' ? 'border-rose-500/30' : 'border-emerald-500/30'
  const fmlBg = tone === 'bad' ? 'bg-rose-500/15' : 'bg-emerald-500/15'
  const fmlText = tone === 'bad' ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'

  return (
    <div className={cn('rounded-lg border bg-bg-soft/40 p-2.5', ringTone)}>
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-xs font-semibold tracking-tight text-fg">
          {title}
        </span>
        <span className={cn('rounded-md px-2 py-0.5 text-xs font-mono font-bold', fmlBg, fmlText)}>
          {formula}
        </span>
      </div>
      <div className="mb-2 font-mono text-[10px] text-fg-muted">{subtitle}</div>
      <div className="space-y-1">
        {setup != null && (
          <div className="flex items-center gap-2">
            <span className="w-14 shrink-0 text-right text-[11px] text-fg-subtle">setup</span>
            <div className="relative h-5 flex-1 rounded-sm bg-bg-soft">
              <div
                className={cn('h-full rounded-sm', stripeSetup)}
                style={{ width: `${maxWork > 0 ? (setup / maxWork) * 100 : 0}%` }}
              />
            </div>
            <span className="w-14 shrink-0 text-right font-mono text-[11px] text-fg-muted">
              {formatNum(setup)}
            </span>
          </div>
        )}
        {rows.map((r) => {
          const pct = maxWork > 0 ? (r.work / maxWork) * 100 : 0
          return (
            <div key={r.level} className="flex items-center gap-2">
              <span className="w-14 shrink-0 text-right text-[11px] text-fg-subtle">
                επ. {r.level}
              </span>
              <div className="relative h-5 flex-1 rounded-sm bg-bg-soft">
                <div className={cn('h-full rounded-sm', stripe)} style={{ width: `${pct}%` }} />
              </div>
              <span className="w-14 shrink-0 text-right font-mono text-[11px] text-fg">
                {formatNum(r.work)}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-xs">
        <span className="font-semibold text-fg">Σύνολο</span>
        <span className="font-mono font-bold text-fg">{formatNum(total)}</span>
      </div>
    </div>
  )
}
