'use client'

/**
 * OneZeroBinarySearch — binary search on a 1^m 0^n string.
 *
 * For pt4-th3. The string is already "sorted" (all 1s before any 0).
 * The exam asks for an O(log k) algorithm; the student needs to SEE
 * the binary search collapsing the interval, and watch the comparison
 * count match the ⌈log₂ k⌉ bound.
 *
 * Controls: sliders for m and n. The strip renders as colored cells
 * (1=teal, 0=amber). A Next button advances one bisection step; the
 * mid cell glows, the interval shrinks, and the comparison counter
 * ticks. When the boundary is found, a verdict bar shows m, n and
 * #comparisons next to ⌈log₂(m+n+1)⌉.
 */

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { InlineMath } from '@/components/math'

type Step = {
  l: number
  r: number
  mid: number
  bit: 0 | 1
  /** New interval after this step. */
  next: { l: number; r: number } | null
  done: boolean
}

function buildTrace(m: number, n: number): Step[] {
  const k = m + n
  const bit = (i: number): 0 | 1 => (i < m ? 1 : 0)
  const steps: Step[] = []
  let l = 0
  let r = k - 1
  while (l < r) {
    const mid = Math.floor((l + r) / 2)
    const b = bit(mid)
    const nxt = b === 1 ? { l: mid + 1, r } : { l, r: mid }
    const done = nxt.l >= nxt.r
    steps.push({ l, r, mid, bit: b, next: nxt, done })
    if (done) break
    l = nxt.l
    r = nxt.r
  }
  return steps
}

type Props = {
  initialM?: number
  initialN?: number
}

export function OneZeroBinarySearch({ initialM = 5, initialN = 11 }: Props = {}) {
  const [m, setM] = useState(initialM)
  const [n, setN] = useState(initialN)
  const [step, setStep] = useState(0)

  const trace = useMemo(() => buildTrace(m, n), [m, n])
  const k = m + n
  const lowerBound = Math.ceil(Math.log2(k))

  useEffect(() => setStep(0), [m, n])

  const current = trace[Math.min(step, trace.length - 1)]
  const finished = step >= trace.length

  // Active interval for the next step (or the final pointer pos at finish)
  const active = finished
    ? { l: trace[trace.length - 1].next?.l ?? trace[trace.length - 1].mid, r: trace[trace.length - 1].next?.r ?? trace[trace.length - 1].mid }
    : { l: current.l, r: current.r }

  const bit = (i: number): 0 | 1 => (i < m ? 1 : 0)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Δυαδική αναζήτηση στο <InlineMath>{'1^{m}0^{n}'}</InlineMath> — βρες το σύνορο
        </div>
        <div className="text-xs text-fg-subtle">
          k = m + n = <span className="font-mono text-fg">{k}</span>
        </div>
      </div>

      {/* Sliders */}
      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        <label className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2 text-xs text-fg-muted">
          <div className="mb-1 flex justify-between">
            <span>m (πλήθος 1)</span>
            <span className="font-mono text-sm text-fg">{m}</span>
          </div>
          <input
            type="range"
            min={1}
            max={32}
            step={1}
            value={m}
            onChange={(e) => setM(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-accent"
          />
        </label>
        <label className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2 text-xs text-fg-muted">
          <div className="mb-1 flex justify-between">
            <span>n (πλήθος 0)</span>
            <span className="font-mono text-sm text-fg">{n}</span>
          </div>
          <input
            type="range"
            min={1}
            max={32}
            step={1}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-accent"
          />
        </label>
      </div>

      {/* Strip */}
      <div className="mb-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-3">
        <div className="mb-2 flex items-center justify-between text-[11px] text-fg-subtle">
          <span>θέση 1 ← → k</span>
          <span>
            ενεργό διάστημα: [<span className="font-mono text-fg">{active.l + 1}</span>,{' '}
            <span className="font-mono text-fg">{active.r + 1}</span>]
          </span>
        </div>
        <div className="flex flex-wrap gap-0.5">
          {Array.from({ length: k }).map((_, i) => {
            const b = bit(i)
            const inActive = i >= active.l && i <= active.r
            const isMid = !finished && i === current.mid
            const isBoundary = i === m - 1 || i === m
            return (
              <span
                key={i}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded font-mono text-xs font-semibold transition-colors',
                  isMid
                    ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-elevated'
                    : '',
                  inActive
                    ? b === 1
                      ? 'bg-teal-500/30 text-teal-300'
                      : 'bg-amber-500/30 text-amber-300'
                    : b === 1
                      ? 'bg-teal-500/10 text-teal-500/40'
                      : 'bg-amber-500/10 text-amber-500/40',
                  finished && isBoundary ? 'ring-2 ring-success ring-offset-1 ring-offset-bg-elevated' : '',
                )}
              >
                {b}
              </span>
            )
          })}
        </div>
      </div>

      {/* Comparison ledger */}
      <div className="mb-3 rounded-lg border border-border bg-bg-soft/30 px-3 py-2 text-sm">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          <span>Ιστορικό συγκρίσεων</span>
          <span>
            #συγκρίσεις = <span className="font-mono text-fg">{Math.min(step, trace.length)}</span>{' '}
            / ⌈log₂ {k}⌉ ={' '}
            <span className="font-mono text-fg">{lowerBound}</span>
          </span>
        </div>
        <ol className="space-y-1">
          {trace.slice(0, step).map((s, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-md border border-border bg-bg-elevated px-2 py-1 text-xs"
            >
              <span className="font-mono">
                [{s.l + 1}, {s.r + 1}] mid = {s.mid + 1}
              </span>
              <span className="font-mono">
                S[{s.mid + 1}] = {s.bit} →{' '}
                {s.bit === 1 ? 'πάμε δεξιά' : 'πάμε αριστερά'}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {finished && (
        <div className="mb-3 rounded-md border border-accent/40 bg-accent/5 px-3 py-2 text-sm text-fg">
          <strong>Βρήκαμε το σύνορο.</strong> m = <span className="font-mono">{m}</span>, n
          = <span className="font-mono">{n}</span>. Συνολικά{' '}
          <span className="font-mono">{trace.length}</span> συγκρίσεις — όχι
          περισσότερες από <InlineMath>{`\\lceil\\log_2 k\\rceil = ${lowerBound}`}</InlineMath>.
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep(0)}
          className="rounded-md border border-border px-3 py-1 text-sm text-fg-muted hover:text-fg"
        >
          ⟲ Reset
        </button>
        <span className="text-xs text-fg-subtle">
          βήμα {Math.min(step, trace.length)} / {trace.length}
        </span>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(s + 1, trace.length))}
          disabled={finished}
          className="rounded-md border border-accent bg-accent/10 px-3 py-1 text-sm font-semibold text-accent hover:bg-accent/20 disabled:opacity-40"
        >
          Επόμενο βήμα →
        </button>
      </div>
    </section>
  )
}
