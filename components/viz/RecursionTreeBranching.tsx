'use client'

/**
 * RecursionTreeBranching — why «1 fewer recursive call» moves the exponent.
 *
 * The L04 page argues twice that Karatsuba is faster than the obvious
 * D&C split because it makes 3 recursive calls instead of 4 — and that
 * this lowers the exponent from n² to n^log₂3. Read as algebra
 * («Master Theorem case 3 with a=4 vs a=3»), this is a routine
 * substitution. Read as a tree, it is dramatic: at level k there are
 * 4ᵏ vs 3ᵏ subproblems, and that 4ᵏ vs 3ᵏ blow-up is the WHOLE story.
 *
 * The viz puts the two trees side by side, level-by-level, and stacks
 * per-level cost bars (cost = nodes-at-level × work-per-node = (a/b^d)ᵏ
 * relative to the root). With n at 16 the 4-branching total is ~5×
 * the 3-branching total at the leaves alone — and the gap widens with
 * n. A play button grows them in sync so the divergence is felt. Built
 * for L04.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Branching = 3 | 4

const N_OPTIONS = [2, 4, 8, 16, 32] as const
type NVal = (typeof N_OPTIONS)[number]

/** A per-level row: cost at that level + running cumulative. */
type Row = { level: number; nodes: number; perNode: number; total: number; cumul: number }

function rows(n: number, a: Branching): Row[] {
  const out: Row[] = []
  const depth = Math.log2(n)
  let cumul = 0
  for (let k = 0; k <= depth; k++) {
    const nodes = a ** k
    const perNode = n / 2 ** k
    const total = nodes * perNode
    cumul += total
    out.push({ level: k, nodes, perNode, total, cumul })
  }
  return out
}

function formatNum(x: number): string {
  if (!Number.isFinite(x)) return '∞'
  if (x >= 1000) return Math.round(x).toLocaleString('en-US').replace(/,/g, ' ')
  if (x % 1 === 0) return String(x)
  return x.toFixed(2)
}

/** Asymptotic predicate label per Master Theorem case 3 (here d = 1 always). */
function asymp(a: Branching): { fmla: string; approx: number; expLabel: string } {
  // T(n) = a T(n/2) + Θ(n), d = 1, log_2 a
  if (a === 4) return { fmla: 'O(n^log₂4) = O(n²)', approx: 2, expLabel: '2' }
  return { fmla: 'O(n^log₂3) ≈ O(n^1.585)', approx: Math.log2(3), expLabel: 'log₂ 3 ≈ 1.585' }
}

function TreePanel({
  a,
  n,
  upToLevel,
  maxCost,
}: {
  a: Branching
  n: number
  upToLevel: number
  maxCost: number
}) {
  const all = rows(n, a)
  const visible = all.slice(0, upToLevel + 1)
  const final = visible[visible.length - 1]
  const stripe = a === 4 ? 'bg-rose-500/70' : 'bg-emerald-500/70'
  const stripeDim = a === 4 ? 'bg-rose-500/20' : 'bg-emerald-500/20'
  const ringTone = a === 4 ? 'ring-rose-500/40' : 'ring-emerald-500/40'
  const headTone = a === 4 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
  const { fmla, expLabel } = asymp(a)
  const exponent = Math.log2(a).toFixed(3)

  return (
    <div className={cn('rounded-xl border bg-bg/40 p-3', ringTone, 'ring-1')}>
      <div className="flex items-center justify-between">
        <div className={cn('text-sm font-bold', headTone)}>T(n) = {a} T(n/2) + cn</div>
        <div className="text-[11px] font-mono text-fg-muted">
          log₂ {a} = {exponent}
        </div>
      </div>
      <div className="mt-2 space-y-1">
        {all.map((r) => {
          const isVisible = r.level <= upToLevel
          const pct = (r.total / maxCost) * 100
          return (
            <div key={r.level} className={cn('flex items-center gap-2', !isVisible && 'opacity-30')}>
              <div className="w-10 shrink-0 font-mono text-[11px] text-fg-muted">k={r.level}</div>
              <div className="flex-1">
                <div className="relative h-5 overflow-hidden rounded bg-bg-elevated/60">
                  <div
                    className={cn(
                      'absolute inset-y-0 left-0 transition-[width] duration-300',
                      isVisible ? stripe : stripeDim,
                    )}
                    style={{ width: `${pct}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-end px-1.5 font-mono text-[10.5px] font-semibold text-fg/90">
                    {a}ᵏ · n/2ᵏ = {formatNum(r.nodes)} · {formatNum(r.perNode)} ={' '}
                    <span className="ml-1">{formatNum(r.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-2 border-t border-border pt-2 text-xs">
        <div className="flex items-baseline justify-between">
          <span className="text-fg-muted">Σύνολο (μέχρι τα φύλλα κ = {Math.log2(n)})</span>
          <span className="font-mono font-bold">{formatNum(final.cumul)}</span>
        </div>
        <div className="mt-0.5 flex items-baseline justify-between">
          <span className="text-fg-muted">Φύλλα: {a}^log₂n = </span>
          <span className="font-mono">{formatNum(a ** Math.log2(n))} = n^{exponent}</span>
        </div>
        <div className={cn('mt-1 rounded px-2 py-1 font-semibold', headTone)}>
          T(n) = {fmla}{' '}
          <span className="text-fg-muted">(εκθέτης: {expLabel})</span>
        </div>
      </div>
    </div>
  )
}

export function RecursionTreeBranching() {
  const [n, setN] = useState<NVal>(16)
  const [upToLevel, setUpToLevel] = useState<number>(Math.log2(16))
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<number | null>(null)

  const depth = Math.log2(n)
  // re-clamp on n changes
  useEffect(() => {
    setUpToLevel((u) => Math.min(u, depth))
  }, [depth])

  // play: advance level once per 700ms until reaching depth
  useEffect(() => {
    if (!playing) {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
      return
    }
    if (upToLevel >= depth) {
      setPlaying(false)
      return
    }
    timerRef.current = window.setTimeout(() => {
      setUpToLevel((u) => Math.min(depth, u + 1))
    }, 700)
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [playing, upToLevel, depth])

  const maxCost = useMemo(() => {
    // Largest per-level cost across both trees, current n.
    const r4 = rows(n, 4)
    const r3 = rows(n, 3)
    return Math.max(...r4.map((r) => r.total), ...r3.map((r) => r.total))
  }, [n])

  const r4 = useMemo(() => rows(n, 4), [n])
  const r3 = useMemo(() => rows(n, 3), [n])

  return (
    <div className="my-6 rounded-2xl border border-border bg-bg-elevated p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
          Δέντρο
        </span>
        <span className="text-sm font-semibold">4 αναδρομικές κλήσεις vs 3 — γιατί αλλάζει ο εκθέτης</span>
      </div>

      {/* n picker */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold">n =</span>
        {N_OPTIONS.map((v) => (
          <button
            key={v}
            onClick={() => {
              setN(v)
              setUpToLevel(Math.log2(v))
              setPlaying(false)
            }}
            className={cn(
              'rounded-md border px-2 py-1 text-xs font-mono font-semibold',
              n === v ? 'border-accent bg-accent/15 text-accent' : 'border-border bg-bg-elevated hover:bg-bg',
            )}
          >
            {v}
          </button>
        ))}
        <span className="ml-2 text-[11px] text-fg-muted">βάθος δέντρου: log₂{n} = {depth}</span>
      </div>

      {/* trees */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <TreePanel a={4} n={n} upToLevel={upToLevel} maxCost={maxCost} />
        <TreePanel a={3} n={n} upToLevel={upToLevel} maxCost={maxCost} />
      </div>

      {/* head-to-head ratio */}
      <div className="mt-3 rounded-xl border border-border bg-bg/40 p-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs text-fg-muted">Στο τρέχον επίπεδο k = {upToLevel}:</span>
          <span className="font-mono">
            <span className="font-semibold text-rose-500">{formatNum(r4[upToLevel].cumul)}</span>{' '}
            <span className="text-fg-muted">vs</span>{' '}
            <span className="font-semibold text-emerald-500">{formatNum(r3[upToLevel].cumul)}</span>
          </span>
          <span className="text-xs text-fg-muted">·</span>
          <span className="font-mono text-xs">
            λόγος ≈ {(r4[upToLevel].cumul / Math.max(1, r3[upToLevel].cumul)).toFixed(2)}×
          </span>
        </div>
        {upToLevel === depth && (
          <div className="mt-1.5 text-xs text-fg">
            Στα φύλλα η διαφορά έχει εκραγεί:{' '}
            <span className="font-mono">{formatNum(4 ** depth)}</span> φύλλα στο 4-tree έναντι{' '}
            <span className="font-mono">{formatNum(3 ** depth)}</span> στο 3-tree — δηλαδή{' '}
            <span className="font-mono">n^{Math.log2(4).toFixed(2)}</span> έναντι{' '}
            <span className="font-mono">n^{Math.log2(3).toFixed(2)}</span>. Με{' '}
            <em>μία</em> λιγότερη αναδρομική κλήση σε κάθε κόμβο, ο εκθέτης πέφτει από 2 σε ≈ 1.585.
          </div>
        )}
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            setUpToLevel(0)
            setPlaying(false)
          }}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-bg-elevated px-3 py-1.5 text-xs font-semibold hover:bg-bg"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Από την αρχή
        </button>
        <button
          onClick={() => {
            if (upToLevel >= depth) {
              setUpToLevel(0)
              setPlaying(true)
            } else {
              setPlaying((p) => !p)
            }
          }}
          className={cn(
            'inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold',
            playing
              ? 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
              : 'border-accent/40 bg-accent/15 text-accent hover:bg-accent/25',
          )}
        >
          {playing ? (
            <>
              <Pause className="h-3.5 w-3.5" />
              Παύση
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" />
              {upToLevel >= depth ? 'Ξανά' : 'Παίξε'}
            </>
          )}
        </button>
        <button
          onClick={() => setUpToLevel((u) => Math.min(depth, u + 1))}
          disabled={upToLevel >= depth}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-bg-elevated px-3 py-1.5 text-xs font-semibold hover:bg-bg disabled:opacity-50"
        >
          Επόμενο επίπεδο
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
        <span className="ml-auto font-mono text-[11px] text-fg-muted">
          Επίπεδο {upToLevel} / {depth}
        </span>
      </div>
    </div>
  )
}
