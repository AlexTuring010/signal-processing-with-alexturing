'use client'

/**
 * FasterComputerLab — «θα μας σώσει ο γρηγορότερος υπολογιστής;».
 *
 * The page asks: if your machine becomes k× faster, how much bigger an
 * input can you handle in the same wall-clock? The PDF answers it as a
 * static table; the student copies it and moves on without ever feeling
 * the asymmetry.
 *
 * The viz uses concrete starting points — each row's «τώρα» is roughly
 * what one second of a modern CPU buys you for that complexity class —
 * then lets the student slide a k from 1× to 10⁹×. The bar for polynomial
 * classes stretches dramatically; the bar for 2ⁿ creeps right by a few
 * units; n! barely moves. The teaching beat that the lecture spells out
 * («σχεδόν τίποτα για το n!») becomes a visual fact you can play with.
 *
 * Built for L02.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'

type Klass = {
  id: string
  label: string
  family: 'poly' | 'exp' | 'fact'
  oldN: number
  // n_new given a k× speedup, assuming the budget scales by exactly k.
  next: (k: number) => number
}

// Each class's «τώρα» n is the largest n that fits roughly in 10⁸ ops
// (≈ 1 second on a modern CPU). Concrete grounding so the gains feel real.
const KLASSES: Klass[] = [
  {
    id: 'n',
    label: 'O(n)',
    family: 'poly',
    oldN: 1e8,
    next: (k) => k * 1e8,
  },
  {
    id: 'nlogn',
    label: 'O(n·log n)',
    family: 'poly',
    oldN: 4e6,
    // n·log n is invertible only numerically; do a tiny bisection.
    next: (k) => invertNLogN(k * 4e6 * Math.log2(4e6)),
  },
  {
    id: 'n2',
    label: 'O(n²)',
    family: 'poly',
    oldN: 1e4,
    next: (k) => Math.sqrt(k) * 1e4,
  },
  {
    id: 'n3',
    label: 'O(n³)',
    family: 'poly',
    oldN: 450,
    next: (k) => Math.cbrt(k) * 450,
  },
  {
    id: 'exp2',
    label: 'O(2ⁿ)',
    family: 'exp',
    oldN: 27,
    next: (k) => 27 + Math.log2(k),
  },
  {
    id: 'exp3',
    label: 'O(3ⁿ)',
    family: 'exp',
    oldN: 17,
    next: (k) => 17 + Math.log(k) / Math.log(3),
  },
  {
    id: 'fact',
    label: 'O(n!)',
    family: 'fact',
    oldN: 11,
    next: (k) => factorialNewN(11, k),
  },
]

function invertNLogN(target: number): number {
  // Find n with n·log₂(n) ≈ target by bisection.
  let lo = 2,
    hi = 1e15
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    if (mid * Math.log2(mid) < target) lo = mid
    else hi = mid
  }
  return Math.round(lo)
}

function factorialNewN(oldN: number, k: number): number {
  // Largest m with m! ≤ k · oldN!. Walk up multiplicatively; bail at 25!.
  const budget = k * fact(oldN)
  let m = oldN
  let f = fact(oldN)
  while (m < 25 && f * (m + 1) <= budget) {
    m += 1
    f *= m
  }
  return m
}

function fact(n: number): number {
  let p = 1
  for (let k = 2; k <= n; k++) p *= k
  return p
}

const PRESETS = [
  { exp: 0, label: '1×' },
  { exp: 1, label: '10×' },
  { exp: 2, label: '100×' },
  { exp: 3, label: '1.000×' },
  { exp: 6, label: '10⁶×' },
  { exp: 9, label: '10⁹×' },
]

function fmtN(v: number): string {
  if (!Number.isFinite(v)) return '∞'
  if (v >= 1e9) return v.toExponential(2)
  if (v >= 1000) return Math.round(v).toLocaleString('el-GR')
  if (v >= 1) return Math.round(v).toString()
  return v.toFixed(2)
}

function fmtGain(kl: Klass, k: number): { tag: string; tone: 'big' | 'mid' | 'tiny' } {
  if (kl.family === 'poly') {
    const ratio = kl.next(k) / kl.oldN
    if (ratio >= 100) return { tag: `×${fmtN(ratio)}`, tone: 'big' }
    if (ratio >= 5) return { tag: `×${ratio.toFixed(1)}`, tone: 'mid' }
    return { tag: `×${ratio.toFixed(2)}`, tone: 'tiny' }
  }
  // exp / fact: report additive bump.
  const delta = kl.next(k) - kl.oldN
  const rounded = Math.max(0, Math.round(delta * 10) / 10)
  return { tag: `+${rounded}`, tone: rounded >= 8 ? 'mid' : 'tiny' }
}

export function FasterComputerLab() {
  const [exp, setExp] = useState(3)
  const k = 10 ** exp

  // Bar widths use log scaling so we can see both ×10⁹ (polynomial) and
  // +2 (factorial) on the same chart without one collapsing the other.
  const maxLogRatio = Math.max(
    ...KLASSES.map((kl) => Math.log10(Math.max(kl.next(k) / kl.oldN, 1.01))),
  )

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          1.000× πιο γρήγορο μηχάνημα — πόσο πιο μεγάλο πρόβλημα λύνει;
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-accent">
          k = {k.toLocaleString('el-GR')}×
        </span>
      </div>

      {/* k slider + presets */}
      <div className="mb-2 flex items-center gap-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-2">
        <label
          htmlFor="fc-k"
          className="shrink-0 text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle"
        >
          ταχύτητα
        </label>
        <input
          id="fc-k"
          type="range"
          min={0}
          max={9}
          step={1}
          value={exp}
          onChange={(e) => setExp(Number(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer accent-accent"
        />
        <div className="shrink-0 rounded-md border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-sm font-bold text-accent">
          ×10^{exp}
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
          προεπιλογές
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.exp}
            type="button"
            onClick={() => setExp(p.exp)}
            className={cn(
              'rounded-md border px-2 py-0.5 font-mono text-[11px] transition-colors',
              p.exp === exp
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-fg-muted hover:text-fg',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* header strip */}
      <div className="mb-1 grid grid-cols-[5.5rem_5.5rem_5.5rem_1fr_3.5rem] gap-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
        <span>κλάση</span>
        <span className="text-right">τώρα</span>
        <span className="text-right">μετά</span>
        <span>κέρδος</span>
        <span className="text-right">ποσ.</span>
      </div>

      {/* rows */}
      <div className="space-y-1">
        {KLASSES.map((kl) => {
          const newN = kl.next(k)
          const ratio = newN / kl.oldN
          // Each row's bar is the log of its growth ratio, normalised against
          // the strongest row's growth. Bars for exp/fact stay visibly short.
          const w = Math.max(
            2,
            (Math.log10(Math.max(ratio, 1.01)) / Math.max(maxLogRatio, 0.5)) * 100,
          )
          const gain = fmtGain(kl, k)
          return (
            <div
              key={kl.id}
              className={cn(
                'grid grid-cols-[5.5rem_5.5rem_5.5rem_1fr_3.5rem] items-center gap-2 rounded-md border px-2 py-1.5',
                kl.family === 'poly' && 'border-emerald-500/30 bg-emerald-500/5',
                kl.family === 'exp' && 'border-orange-500/30 bg-orange-500/5',
                kl.family === 'fact' && 'border-red-500/30 bg-red-500/5',
              )}
            >
              <span className="font-mono text-sm font-bold text-fg">{kl.label}</span>
              <span className="text-right font-mono text-xs tabular-nums text-fg-muted">
                {fmtN(kl.oldN)}
              </span>
              <span className="text-right font-mono text-xs font-bold tabular-nums text-fg">
                {fmtN(newN)}
              </span>
              <div className="relative h-3 overflow-hidden rounded bg-bg-soft">
                <div
                  className={cn(
                    'h-full rounded transition-all',
                    kl.family === 'poly' && 'bg-emerald-500/75',
                    kl.family === 'exp' && 'bg-orange-500/75',
                    kl.family === 'fact' && 'bg-red-500/75',
                  )}
                  style={{ width: `${w}%` }}
                />
              </div>
              <span
                className={cn(
                  'text-right font-mono text-xs font-bold tabular-nums',
                  gain.tone === 'big' && 'text-emerald-700 dark:text-emerald-300',
                  gain.tone === 'mid' && 'text-fg',
                  gain.tone === 'tiny' && 'text-red-600 dark:text-red-300',
                )}
              >
                {gain.tag}
              </span>
            </div>
          )
        })}
      </div>

      {/* verdict */}
      <div className="mt-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted">
        <strong className="text-fg">Με {k.toLocaleString('el-GR')}× ταχύτερο μηχάνημα:</strong>{' '}
        ο γραμμικός αλγόριθμος <em>πολλαπλασιάζει</em> την είσοδό του επί{' '}
        <span className="font-mono">{k.toLocaleString('el-GR')}</span>. Ο{' '}
        <span className="font-mono">O(2ⁿ)</span> κερδίζει{' '}
        <span className="font-mono">+{Math.round(Math.log2(k))}</span> στοιχεία. Ο{' '}
        <span className="font-mono">O(n!)</span> κερδίζει{' '}
        <span className="font-mono">+{Math.round(KLASSES[6].next(k) - 11)}</span>. Όση
        τεχνολογία κι αν σου δώσει το μέλλον, εκθετική πολυπλοκότητα δεν σώζεται με
        υλικό — μόνο με <strong>καλύτερο αλγόριθμο</strong>.
      </div>
    </section>
  )
}
