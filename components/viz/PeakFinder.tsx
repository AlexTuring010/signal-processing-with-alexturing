'use client'

/**
 * PeakFinder — binary search on a monotopic array (the closing exercise).
 *
 * 15-element rises-then-falls bar chart. Each click of «Επόμενο» picks
 * mid = ⌊(lo+hi)/2⌋, compares A[mid] vs A[mid+1] and discards the half
 * that the slope rules out:
 *
 *   A[mid] < A[mid+1] → ανηφόρα → lo ← mid+1
 *   A[mid] > A[mid+1] → κατηφόρα → hi ← mid
 *
 * The [lo, hi] window narrows visibly, the discarded halves grey out,
 * and the step counter lands at ⌈log₂ n⌉ exactly. Four presets shift
 * the peak (left / middle / right / just-left-of-middle) so the user
 * sees the algorithm hit any peak, not memorize the path.
 *
 * Built for L05.
 */

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from 'lucide-react'

type StepResult = 'uphill' | 'downhill' | 'found'
type Step = { lo: number; hi: number; mid: number; result: StepResult }

/** Four hand-built monotopic arrays of length 15. */
const PRESETS: number[][] = [
  [3, 6, 11, 16, 21, 25, 28, 30, 32, 30, 27, 22, 15, 8, 3], // peak idx 8
  [4, 9, 16, 22, 27, 23, 18, 14, 11, 9, 7, 5, 4, 3, 2], // peak idx 4
  [2, 4, 6, 9, 13, 18, 22, 25, 28, 30, 33, 35, 31, 24, 14], // peak idx 11
  [5, 11, 17, 22, 25, 27, 28, 29, 26, 22, 17, 13, 10, 7, 5], // peak idx 7
]

function buildSteps(arr: number[]): Step[] {
  const steps: Step[] = []
  let lo = 0
  let hi = arr.length - 1
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2)
    if (arr[mid] < arr[mid + 1]) {
      steps.push({ lo, hi, mid, result: 'uphill' })
      lo = mid + 1
    } else {
      steps.push({ lo, hi, mid, result: 'downhill' })
      hi = mid
    }
  }
  steps.push({ lo, hi, mid: lo, result: 'found' })
  return steps
}

const BAR_W = 26
const BAR_GAP = 4
const CHART_PAD = 20
const CHART_TOP = 16
const CHART_H = 180

export function PeakFinder() {
  const [preset, setPreset] = useState(0)
  const arr = PRESETS[preset]
  const n = arr.length
  const steps = useMemo(() => buildSteps(arr), [arr])
  const [progress, setProgress] = useState(0)

  const cur = steps[Math.min(progress, steps.length - 1)]
  const done = cur.result === 'found'

  const maxVal = Math.max(...arr)
  const W = CHART_PAD * 2 + n * (BAR_W + BAR_GAP) - BAR_GAP
  const H = CHART_TOP + CHART_H + 56

  const inWindow = (i: number) => i >= cur.lo && i <= cur.hi

  let note: string
  if (cur.result === 'uphill') {
    note = `Βήμα ${progress + 1}: m = ${cur.mid}, A[${cur.mid}] = ${arr[cur.mid]}, A[${cur.mid + 1}] = ${arr[cur.mid + 1]}. ${arr[cur.mid]} < ${arr[cur.mid + 1]} → ανηφόρα. Η κορυφή είναι δεξιά: πέτα όλο το αριστερό μισό, lo ← ${cur.mid + 1}.`
  } else if (cur.result === 'downhill') {
    note = `Βήμα ${progress + 1}: m = ${cur.mid}, A[${cur.mid}] = ${arr[cur.mid]}, A[${cur.mid + 1}] = ${arr[cur.mid + 1]}. ${arr[cur.mid]} > ${arr[cur.mid + 1]} → κατηφόρα. Η κορυφή είναι το m ή στα αριστερά: hi ← ${cur.mid}.`
  } else {
    note = `Βρέθηκε. Η κορυφή είναι στη θέση ${cur.mid} με τιμή ${arr[cur.mid]}, σε ${steps.length - 1} συγκρίσεις — ακριβώς ⌈log₂ ${n}⌉ = ${Math.ceil(Math.log2(n))}.`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Εύρεση κορυφής σε μονότροπο πίνακα — δυαδική αναζήτηση στην κλίση
        </div>
        <span
          className={
            'shrink-0 rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider ' +
            (done
              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
              : cur.result === 'uphill'
                ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300'
                : 'bg-amber-500/15 text-amber-700 dark:text-amber-300')
          }
        >
          {done ? 'Βρέθηκε' : cur.result === 'uphill' ? 'Ανηφόρα →' : '← Κατηφόρα'}
        </span>
      </div>

      <div className="graph-canvas overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full max-w-3xl" xmlns="http://www.w3.org/2000/svg">
          <style>{`
            .pk-bar { fill: rgb(var(--accent) / 0.18); }
            .pk-bar-window { fill: rgb(var(--accent) / 0.55); }
            .pk-bar-mid { fill: rgb(var(--accent)); }
            .pk-bar-mid1 { fill: rgb(56 189 248); }
            .pk-bar-peak { fill: rgb(34 197 94); }
            .pk-axis { stroke: rgb(var(--border-strong)); stroke-width: 1.5; }
            .pk-idx { font: 500 11px ui-sans-serif, system-ui; fill: rgb(var(--fg-muted)); text-anchor: middle; }
            .pk-val { font: 600 10px ui-sans-serif, system-ui; fill: rgb(var(--fg)); text-anchor: middle; }
            .pk-window { fill: rgb(var(--fg) / 0.04); stroke: rgb(var(--fg) / 0.3); stroke-dasharray: 4 3; stroke-width: 1.5; }
            .pk-lbl { font: 700 11px ui-sans-serif, system-ui; text-anchor: middle; }
          `}</style>
          {!done && (
            <rect
              x={CHART_PAD + cur.lo * (BAR_W + BAR_GAP) - BAR_GAP / 2}
              y={CHART_TOP - 6}
              width={(cur.hi - cur.lo + 1) * (BAR_W + BAR_GAP)}
              height={CHART_H + 12}
              className="pk-window"
            />
          )}
          <line
            x1={CHART_PAD}
            y1={CHART_TOP + CHART_H + 2}
            x2={W - CHART_PAD}
            y2={CHART_TOP + CHART_H + 2}
            className="pk-axis"
          />
          {arr.map((v, i) => {
            const h = (v / maxVal) * CHART_H
            const isPeak = done && i === cur.mid
            const isMid = !done && i === cur.mid
            const isMidPlus = !done && i === cur.mid + 1
            const cls = isPeak
              ? 'pk-bar-peak'
              : isMid
                ? 'pk-bar-mid'
                : isMidPlus
                  ? 'pk-bar-mid1'
                  : inWindow(i)
                    ? 'pk-bar-window'
                    : 'pk-bar'
            return (
              <g key={i}>
                <rect
                  x={CHART_PAD + i * (BAR_W + BAR_GAP)}
                  y={CHART_TOP + CHART_H - h}
                  width={BAR_W}
                  height={h}
                  className={cls}
                />
                <text
                  x={CHART_PAD + i * (BAR_W + BAR_GAP) + BAR_W / 2}
                  y={CHART_TOP + CHART_H - h - 4}
                  className="pk-val"
                >
                  {v}
                </text>
                <text
                  x={CHART_PAD + i * (BAR_W + BAR_GAP) + BAR_W / 2}
                  y={CHART_TOP + CHART_H + 18}
                  className="pk-idx"
                >
                  {i}
                </text>
              </g>
            )
          })}
          {!done && (
            <>
              <text
                x={CHART_PAD + cur.lo * (BAR_W + BAR_GAP) + BAR_W / 2}
                y={CHART_TOP + CHART_H + 36}
                className="pk-lbl"
                fill="rgb(var(--fg-muted))"
              >
                lo
              </text>
              <text
                x={CHART_PAD + cur.hi * (BAR_W + BAR_GAP) + BAR_W / 2}
                y={CHART_TOP + CHART_H + 36}
                className="pk-lbl"
                fill="rgb(var(--fg-muted))"
              >
                hi
              </text>
              <text
                x={CHART_PAD + cur.mid * (BAR_W + BAR_GAP) + BAR_W / 2}
                y={CHART_TOP + CHART_H + 50}
                className="pk-lbl"
                fill="rgb(var(--accent))"
              >
                m
              </text>
              {cur.mid + 1 <= cur.hi && (
                <text
                  x={CHART_PAD + (cur.mid + 1) * (BAR_W + BAR_GAP) + BAR_W / 2}
                  y={CHART_TOP + CHART_H + 50}
                  className="pk-lbl"
                  fill="rgb(56 189 248)"
                >
                  m+1
                </text>
              )}
            </>
          )}
          {done && (
            <text
              x={CHART_PAD + cur.mid * (BAR_W + BAR_GAP) + BAR_W / 2}
              y={CHART_TOP + CHART_H + 36}
              className="pk-lbl"
              fill="rgb(34 197 94)"
            >
              κορυφή
            </text>
          )}
        </svg>
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-3 min-h-[4.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>

      {/* counter */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-xs">
        <span className="font-semibold uppercase tracking-wider text-fg-subtle">
          Συγκρίσεις
        </span>
        <span className="font-mono text-lg font-bold tabular-nums text-fg">
          {done ? steps.length - 1 : progress} / {steps.length - 1}
        </span>
        <span className="ml-auto text-fg-muted">
          ⌈log₂ {n}⌉ = {Math.ceil(Math.log2(n))}
        </span>
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setProgress((p) => Math.max(0, p - 1))}
          disabled={progress === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Πίσω
        </button>
        <button
          type="button"
          onClick={() => setProgress((p) => Math.min(steps.length - 1, p + 1))}
          disabled={progress >= steps.length - 1}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Επόμενο
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => {
            setPreset((p) => (p + 1) % PRESETS.length)
            setProgress(0)
          }}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <Shuffle className="h-4 w-4" aria-hidden="true" />
          Άλλος πίνακας
        </button>
        <button
          type="button"
          onClick={() => setProgress(0)}
          disabled={progress === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Από την αρχή
        </button>
      </div>
    </section>
  )
}
