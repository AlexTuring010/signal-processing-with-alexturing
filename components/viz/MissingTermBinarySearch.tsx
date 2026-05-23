'use client'

/**
 * MissingTermBinarySearch — find the gap in an arithmetic progression.
 *
 * For front-set-4-ask7. The student should SEE *why* binary search
 * works on an AP-with-one-missing-term: at every position i, the
 * expected value is a₀ + (i-1)d; before the gap A[i] matches, after
 * the gap A[i] is shifted up by exactly d. So a single comparison at
 * mid tells you which half the gap lives in.
 *
 * The viz shows the array as a bar chart with two overlays: actual
 * height (filled bar) vs expected height (dashed line). The gap is
 * visible at a glance as the place where the bars detach from the
 * dashed line.
 */

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { InlineMath } from '@/components/math'

type Step = {
  l: number
  r: number
  mid: number
  /** Expected vs actual at mid. */
  expected: number
  actual: number
  /** Direction taken. */
  dir: 'left' | 'right' | 'found'
  next: { l: number; r: number } | null
}

function buildArray(a0: number, d: number, n: number, gapAt: number): number[] {
  // n is the length AFTER removing the missing term: real ap has n+1 entries,
  // we drop position `gapAt` (0-indexed in the original).
  const full = Array.from({ length: n + 1 }, (_, i) => a0 + i * d)
  full.splice(gapAt, 1)
  return full
}

function buildTrace(a0: number, d: number, arr: number[]): Step[] {
  const out: Step[] = []
  let l = 0
  let r = arr.length - 1
  while (l <= r) {
    const mid = Math.floor((l + r) / 2)
    const expected = a0 + mid * d
    const actual = arr[mid]
    if (actual !== expected) {
      // The gap is at or before mid → search left
      const nxt = { l, r: mid - 1 }
      out.push({ l, r, mid, expected, actual, dir: 'left', next: nxt })
      if (nxt.l > nxt.r) break
      l = nxt.l
      r = nxt.r
    } else {
      // Everything matches up to mid → gap is to the right
      const nxt = { l: mid + 1, r }
      out.push({ l, r, mid, expected, actual, dir: 'right', next: nxt })
      if (nxt.l > nxt.r) break
      l = nxt.l
      r = nxt.r
    }
  }
  return out
}

type Props = {
  initialN?: number
  initialD?: number
  initialGap?: number
  initialA0?: number
}

export function MissingTermBinarySearch({
  initialN = 12,
  initialD = 3,
  initialGap = 7,
  initialA0 = 4,
}: Props = {}) {
  const [n, setN] = useState(initialN)
  const [d, setD] = useState(initialD)
  const [gap, setGap] = useState(initialGap)
  const a0 = initialA0
  const [step, setStep] = useState(0)

  const arr = useMemo(() => buildArray(a0, d, n, gap), [a0, d, n, gap])
  const trace = useMemo(() => buildTrace(a0, d, arr), [a0, d, arr])

  useEffect(() => setStep(0), [n, d, gap])

  const current = trace[Math.min(step, trace.length - 1)]
  const finished = step >= trace.length
  const missingValue = a0 + gap * d

  const maxVal = Math.max(...arr, missingValue)

  const active = finished
    ? null
    : { l: current.l, r: current.r, mid: current.mid }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Δυαδική αναζήτηση του χαμένου όρου σε αριθμητική πρόοδο
        </div>
        <div className="text-xs text-fg-subtle">
          d = <span className="font-mono text-fg">{d}</span>
        </div>
      </div>

      {/* Sliders */}
      <div className="mb-3 grid gap-2 sm:grid-cols-3">
        <label className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2 text-xs text-fg-muted">
          <div className="mb-1 flex justify-between">
            <span>n (μήκος μετά τη διαγραφή)</span>
            <span className="font-mono text-sm text-fg">{n}</span>
          </div>
          <input
            type="range"
            min={6}
            max={24}
            step={1}
            value={n}
            onChange={(e) => {
              const nv = Number(e.target.value)
              setN(nv)
              if (gap > nv) setGap(Math.floor(nv / 2))
            }}
            className="h-1.5 w-full cursor-pointer accent-accent"
          />
        </label>
        <label className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2 text-xs text-fg-muted">
          <div className="mb-1 flex justify-between">
            <span>d (κοινή διαφορά)</span>
            <span className="font-mono text-sm text-fg">{d}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={d}
            onChange={(e) => setD(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-accent"
          />
        </label>
        <label className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2 text-xs text-fg-muted">
          <div className="mb-1 flex justify-between">
            <span>θέση κενού (0-indexed)</span>
            <span className="font-mono text-sm text-fg">{gap}</span>
          </div>
          <input
            type="range"
            min={1}
            max={n - 1}
            step={1}
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-accent"
          />
        </label>
      </div>

      {/* Bar chart */}
      <div className="mb-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-3">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Τιμές vs αναμενόμενες (διακεκομμένη)
        </div>
        <div className="flex items-end gap-1 overflow-x-auto" style={{ minHeight: '160px' }}>
          {arr.map((v, i) => {
            const expected = a0 + i * d
            const matches = v === expected
            const isMid = active && i === active.mid
            const inActive = active && i >= active.l && i <= active.r
            const heightActual = (v / maxVal) * 140
            const heightExpected = (expected / maxVal) * 140
            return (
              <div key={i} className="flex w-6 shrink-0 flex-col items-center gap-0.5">
                <div className="relative flex h-[140px] w-full items-end justify-center">
                  <div
                    className={cn(
                      'w-full rounded-t transition-all',
                      isMid ? 'bg-accent' : matches ? 'bg-emerald-500/70' : 'bg-amber-500/80',
                      !inActive && !finished ? 'opacity-30' : '',
                    )}
                    style={{ height: `${heightActual}px` }}
                  />
                  <div
                    className="absolute left-0 right-0 h-px border-t border-dashed border-fg-muted"
                    style={{ bottom: `${heightExpected}px` }}
                  />
                </div>
                <span
                  className={cn(
                    'font-mono text-[10px]',
                    isMid ? 'font-bold text-accent' : 'text-fg-subtle',
                  )}
                >
                  {v}
                </span>
              </div>
            )
          })}
        </div>
        <div className="mt-2 flex items-center justify-end gap-3 text-[11px] text-fg-subtle">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded bg-emerald-500/70" />
            ταιριάζει με αναμενόμενο
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded bg-amber-500/80" />
            μετατοπισμένο (μετά το κενό)
          </span>
        </div>
      </div>

      {/* Ledger */}
      <div className="mb-3 rounded-lg border border-border bg-bg-soft/30 px-3 py-2 text-sm">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          <span>Συγκρίσεις mid</span>
          <span>
            #συγκρίσεις = <span className="font-mono text-fg">{Math.min(step, trace.length)}</span>{' '}
            / ⌈log₂ {arr.length}⌉ ={' '}
            <span className="font-mono text-fg">{Math.ceil(Math.log2(arr.length))}</span>
          </span>
        </div>
        <ol className="space-y-1">
          {trace.slice(0, step).map((s, i) => (
            <li
              key={i}
              className="flex items-center justify-between rounded-md border border-border bg-bg-elevated px-2 py-1 text-xs"
            >
              <span className="font-mono">
                [{s.l}, {s.r}] mid = {s.mid}
              </span>
              <span className="font-mono">
                A[{s.mid}] = {s.actual} vs αναμ. {s.expected} →{' '}
                {s.dir === 'left' ? 'αριστερά' : s.dir === 'right' ? 'δεξιά' : 'βρέθηκε'}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {finished && (
        <div className="mb-3 rounded-md border border-accent/40 bg-accent/5 px-3 py-2 text-sm text-fg">
          <strong>Χαμένος όρος:</strong>{' '}
          <span className="font-mono">{missingValue}</span> (θέση{' '}
          <span className="font-mono">{gap}</span>). Συνολικά{' '}
          <span className="font-mono">{trace.length}</span> συγκρίσεις στη χειρότερη
          περίπτωση — <InlineMath>{`O(\\log n)`}</InlineMath>.
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
