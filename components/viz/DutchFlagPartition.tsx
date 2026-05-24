'use client'

/**
 * DutchFlagPartition — three-pointer in-place sort over {0,1,2}.
 *
 * For front-set-4-ask6 (the «σημαία της Ολλανδίας» and its quicksort
 * tie-in). Two tabs:
 *  1. «3 χρώματα» — the canonical in-place pass on a fixed instance of
 *     12 balls. low/mid/high pointers move per the rule (0 → swap with
 *     low, 1 → step mid, 2 → swap with high). Invariants live in the
 *     header bar:
 *        A[0 .. low−1] = 0   (κόκκινες, αμετάβλητες)
 *        A[low .. mid−1] = 1 (μπλε)
 *        A[mid .. high]  = ; (ανεξέταστα — η ζώνη μειώνεται)
 *        A[high+1 .. n−1] = 2 (πράσινες)
 *  2. «3-way quicksort» — same partition driven by a pivot value;
 *     items less / equal / greater than pivot stake out the three
 *     regions; the «equal» middle stays put and DOES NOT recurse, the
 *     win over classic 2-way partition.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type Mode = 'flag' | 'quicksort'

const FLAG_INPUT = [2, 0, 1, 2, 1, 0, 0, 2, 1, 0, 2, 1] // 12 balls, mixed
const QS_INPUT = [4, 7, 4, 2, 4, 9, 1, 4, 8, 4, 3, 5] // pivot will be 4
const QS_PIVOT = 4

const COLOUR_FLAG = (v: number) =>
  v === 0
    ? 'bg-rose-500 text-white border-rose-700'
    : v === 1
      ? 'bg-sky-500 text-white border-sky-700'
      : 'bg-emerald-500 text-white border-emerald-700'

const COLOUR_QS = (v: number, pivot: number) =>
  v < pivot
    ? 'bg-rose-500/80 text-white border-rose-700'
    : v === pivot
      ? 'bg-sky-500 text-white border-sky-700'
      : 'bg-emerald-500/80 text-white border-emerald-700'

type Step = {
  arr: number[]
  low: number
  mid: number
  high: number
  action: string
}

function traceFlag(input: number[]): Step[] {
  const a = input.slice()
  const steps: Step[] = []
  let low = 0
  let mid = 0
  let high = a.length - 1
  steps.push({ arr: a.slice(), low, mid, high, action: 'Αρχικοποίηση: low = mid = 0, high = n−1.' })
  while (mid <= high) {
    if (a[mid] === 0) {
      ;[a[mid], a[low]] = [a[low], a[mid]]
      steps.push({
        arr: a.slice(),
        low,
        mid,
        high,
        action: `A[mid]=0 → αντάλλαξε mid↔low, αύξησε και τα δύο.`,
      })
      low++
      mid++
    } else if (a[mid] === 1) {
      steps.push({
        arr: a.slice(),
        low,
        mid,
        high,
        action: 'A[mid]=1 → άφησέ το στη θέση, αύξησε μόνο mid.',
      })
      mid++
    } else {
      ;[a[mid], a[high]] = [a[high], a[mid]]
      steps.push({
        arr: a.slice(),
        low,
        mid,
        high,
        action: `A[mid]=2 → αντάλλαξε mid↔high, μείωσε high. ΤΟ mid ΔΕΝ προχωρά (το νέο A[mid] δεν έχει εξεταστεί).`,
      })
      high--
    }
  }
  steps.push({ arr: a.slice(), low, mid, high, action: 'Τερματισμός: mid > high — η μεσαία ζώνη άδειασε.' })
  return steps
}

function traceQs(input: number[], pivot: number): Step[] {
  const a = input.slice()
  const steps: Step[] = []
  let low = 0
  let mid = 0
  let high = a.length - 1
  steps.push({ arr: a.slice(), low, mid, high, action: `Pivot = ${pivot}. Στόχος: <p | =p | >p.` })
  while (mid <= high) {
    if (a[mid] < pivot) {
      ;[a[mid], a[low]] = [a[low], a[mid]]
      steps.push({
        arr: a.slice(),
        low,
        mid,
        high,
        action: `A[mid]=${a[low]} < ${pivot} → αντάλλαξε με low.`,
      })
      low++
      mid++
    } else if (a[mid] === pivot) {
      steps.push({
        arr: a.slice(),
        low,
        mid,
        high,
        action: `A[mid]=${pivot} = pivot → προχώρα mid.`,
      })
      mid++
    } else {
      ;[a[mid], a[high]] = [a[high], a[mid]]
      steps.push({
        arr: a.slice(),
        low,
        mid,
        high,
        action: `A[mid]=${a[high]} > ${pivot} → αντάλλαξε με high.`,
      })
      high--
    }
  }
  steps.push({
    arr: a.slice(),
    low,
    mid,
    high,
    action: 'Τα ίσα μένουν στη θέση τους — ΔΕΝ μπαίνουν σε αναδρομή.',
  })
  return steps
}

export function DutchFlagPartition() {
  const [mode, setMode] = useState<Mode>('flag')
  const traceA = useMemo(() => traceFlag(FLAG_INPUT), [])
  const traceB = useMemo(() => traceQs(QS_INPUT, QS_PIVOT), [])
  const trace = mode === 'flag' ? traceA : traceB
  const [step, setStep] = useState(0)
  const cur = trace[Math.min(step, trace.length - 1)]
  const finished = step >= trace.length - 1

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Διαμέριση 3 ζωνών με 3 δείκτες — O(n), επιτόπια
        </div>
        <div className="flex gap-1">
          {(['flag', 'quicksort'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m)
                setStep(0)
              }}
              className={cn(
                'rounded-md px-2 py-1 text-xs font-medium',
                mode === m
                  ? 'border border-accent/50 bg-accent/15 text-accent'
                  : 'border border-border bg-bg-soft text-fg-muted hover:bg-bg-soft/80',
              )}
            >
              {m === 'flag' ? '3 χρώματα (0/1/2)' : `3-way quicksort (pivot=${QS_PIVOT})`}
            </button>
          ))}
        </div>
      </div>

      {/* Header bar — invariants */}
      <div className="mb-2 grid grid-cols-4 gap-1 text-[10px] uppercase tracking-wider text-fg-subtle">
        <div className="rounded border border-rose-500/40 bg-rose-500/10 px-2 py-1 text-center">
          A[0..low−1] = {mode === 'flag' ? '0' : `< ${QS_PIVOT}`}
        </div>
        <div className="rounded border border-sky-500/40 bg-sky-500/10 px-2 py-1 text-center">
          A[low..mid−1] = {mode === 'flag' ? '1' : `= ${QS_PIVOT}`}
        </div>
        <div className="rounded border border-border bg-bg-soft px-2 py-1 text-center">
          A[mid..high] = ?
        </div>
        <div className="rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-center">
          A[high+1..n−1] = {mode === 'flag' ? '2' : `> ${QS_PIVOT}`}
        </div>
      </div>

      {/* Array strip */}
      <div className="mb-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-3">
        <div className="flex justify-center gap-1">
          {cur.arr.map((v, i) => {
            const inLow = i < cur.low
            const inMid = i >= cur.low && i < cur.mid
            const inUnknown = i >= cur.mid && i <= cur.high
            const inHigh = i > cur.high
            let tint = ''
            if (mode === 'flag') {
              tint = inLow || inMid || inHigh ? COLOUR_FLAG(v) : 'bg-bg-elevated border-border text-fg-subtle'
            } else {
              tint =
                inLow || inMid || inHigh
                  ? COLOUR_QS(v, QS_PIVOT)
                  : 'bg-bg-elevated border-border text-fg-subtle'
            }
            void inUnknown
            const isMid = i === cur.mid && cur.mid <= cur.high
            const isLow = i === cur.low
            const isHigh = i === cur.high && cur.high >= cur.low
            return (
              <div key={i} className="relative flex flex-col items-center">
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded border-2 font-mono text-base font-bold transition-all',
                    tint,
                    isMid && 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-bg-elevated',
                  )}
                >
                  {v}
                </span>
                <div className="mt-1 text-[10px] leading-tight">
                  {isLow && <div className="text-rose-400">low</div>}
                  {isMid && <div className="text-yellow-400">mid</div>}
                  {isHigh && <div className="text-emerald-400">high</div>}
                </div>
              </div>
            )
          })}
        </div>
        <p className="mt-2 text-center text-xs text-fg-muted">{cur.action}</p>
      </div>

      {/* Pointer ledger */}
      <div className="mb-3 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-md border border-rose-500/40 bg-rose-500/5 px-2 py-1">
          <span className="text-fg-subtle">low</span>{' '}
          <span className="font-mono text-rose-400">{cur.low}</span>
        </div>
        <div className="rounded-md border border-yellow-500/40 bg-yellow-500/5 px-2 py-1">
          <span className="text-fg-subtle">mid</span>{' '}
          <span className="font-mono text-yellow-400">{cur.mid}</span>
        </div>
        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/5 px-2 py-1">
          <span className="text-fg-subtle">high</span>{' '}
          <span className="font-mono text-emerald-400">{cur.high}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStep(0)}
            disabled={step === 0}
            className="rounded-md border border-border bg-bg-soft px-3 py-1 text-xs font-medium text-fg hover:bg-bg-soft/80 disabled:opacity-40"
          >
            ⟲ Αρχή
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-md border border-border bg-bg-soft px-3 py-1 text-xs font-medium text-fg hover:bg-bg-soft/80 disabled:opacity-40"
          >
            ← Πίσω
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(trace.length - 1, s + 1))}
            disabled={finished}
            className="rounded-md border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent hover:bg-accent/20 disabled:opacity-40"
          >
            Επόμενο →
          </button>
        </div>
        <span className="text-xs text-fg-subtle">
          βήμα {step + 1} / {trace.length}
        </span>
      </div>

      {finished && (
        <div className="mt-3 rounded-lg border border-success/50 bg-success/10 px-3 py-2 text-xs text-fg">
          {mode === 'flag' ? (
            <>
              <strong>Τέρμα.</strong> Πέρασμα <span className="font-mono">{trace.length - 1}</span>{' '}
              βημάτων ≤ n. Κάθε στοιχείο εξετάστηκε <em>μία</em> φορά → O(n), χωρίς
              βοηθητικό πίνακα.
            </>
          ) : (
            <>
              <strong>Σύνδεση με quicksort.</strong> Η μεσαία ζώνη (όσα είναι ίσα με
              το pivot) είναι ήδη στη σωστή θέση και ΔΕΝ μπαίνει σε αναδρομή.
              Για πίνακες με πολλά διπλότυπα, το 3-way partition αποφεύγει
              ολόκληρες υπο-κλήσεις πάνω σε ίσα στοιχεία.
            </>
          )}
        </div>
      )}
    </section>
  )
}
