'use client'

/**
 * SortRace — bubble vs insertion vs mergesort, side by side on the same array.
 *
 * The L03 callout currently CLAIMS «5 orders of magnitude» between Θ(n²) and
 * Θ(n log n). For a struggling student that's just words on a page. The viz
 * runs all three sorts in lockstep on a small array (n = 10) and shows their
 * comparison counters ticking up at very different rates:
 *
 *   • Bubble sort     — n² regardless of input → 45 comparisons.
 *   • Insertion sort  — input-sensitive: ~9 on already-sorted, 45 on reversed.
 *   • Mergesort       — ~22 comparisons on any 10-element input.
 *
 * Each algorithm has a precomputed trace; the same step slider drives all
 * three. Lanes freeze when their algorithm finishes. The headline is the
 * final count gap, not the inner mechanics — those are taught in the
 * Pseudocode blocks alongside the viz.
 *
 * Three presets exercise the trio of best / average / worst cases:
 *   • «Αντίστροφος» — worst case: insertion as bad as bubble.
 *   • «Τυχαίος»     — typical case: insertion already much better than bubble.
 *   • «Σχεδόν ταξινομημένος» — best case: insertion ≈ n.
 *
 * Built for L03.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, ChevronRight, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Frame = { arr: number[]; cmps: number; cursor?: [number, number] }
type Trace = { name: string; complexity: string; frames: Frame[]; total: number }

type Preset = { id: string; label: string; arr: number[] }

const PRESETS: Preset[] = [
  { id: 'random', label: 'Τυχαίος', arr: [5, 2, 8, 1, 9, 3, 7, 4, 10, 6] },
  { id: 'reversed', label: 'Αντίστροφος', arr: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] },
  { id: 'nearly', label: 'Σχεδόν ταξινομημένος', arr: [1, 2, 3, 4, 5, 6, 8, 7, 9, 10] },
]

/** Bubble sort — pushes the largest to the back on each outer pass. */
function bubbleSortTrace(input: number[]): Trace {
  const a = [...input]
  const frames: Frame[] = [{ arr: [...a], cmps: 0 }]
  let cmps = 0
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - 1 - i; j++) {
      cmps++
      if (a[j] > a[j + 1]) {
        const tmp = a[j]
        a[j] = a[j + 1]
        a[j + 1] = tmp
      }
      frames.push({ arr: [...a], cmps, cursor: [j, j + 1] })
    }
  }
  return { name: 'Bubble sort', complexity: 'Θ(n²)', frames, total: cmps }
}

/** Insertion sort — slide each new element into the sorted prefix. */
function insertionSortTrace(input: number[]): Trace {
  const a = [...input]
  const frames: Frame[] = [{ arr: [...a], cmps: 0 }]
  let cmps = 0
  for (let i = 1; i < a.length; i++) {
    let j = i
    while (j >= 1) {
      cmps++
      if (a[j - 1] > a[j]) {
        const tmp = a[j]
        a[j] = a[j - 1]
        a[j - 1] = tmp
        frames.push({ arr: [...a], cmps, cursor: [j - 1, j] })
        j--
      } else {
        frames.push({ arr: [...a], cmps, cursor: [j - 1, j] })
        break
      }
    }
  }
  return { name: 'Insertion sort', complexity: 'O(n²), best Θ(n)', frames, total: cmps }
}

/** Mergesort — bottom-up so the trace stays clean and lockstep-comparable. */
function mergesortTrace(input: number[]): Trace {
  const a = [...input]
  const buf = new Array(a.length)
  const frames: Frame[] = [{ arr: [...a], cmps: 0 }]
  let cmps = 0
  for (let width = 1; width < a.length; width *= 2) {
    for (let lo = 0; lo < a.length; lo += 2 * width) {
      const mid = Math.min(lo + width, a.length)
      const hi = Math.min(lo + 2 * width, a.length)
      let i = lo
      let j = mid
      let k = lo
      while (i < mid && j < hi) {
        cmps++
        if (a[i] <= a[j]) buf[k++] = a[i++]
        else buf[k++] = a[j++]
        frames.push({ arr: [...a.slice(0, lo), ...buf.slice(lo, k), ...a.slice(k)], cmps, cursor: [k - 1, k - 1] })
      }
      while (i < mid) buf[k++] = a[i++]
      while (j < hi) buf[k++] = a[j++]
      for (let p = lo; p < hi; p++) a[p] = buf[p]
      frames.push({ arr: [...a], cmps })
    }
  }
  return { name: 'Mergesort', complexity: 'O(n log n)', frames, total: cmps }
}

function maxLen(traces: Trace[]): number {
  return Math.max(...traces.map((t) => t.frames.length))
}

export function SortRace() {
  const [presetId, setPresetId] = useState<string>(PRESETS[0].id)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const rafRef = useRef<number | null>(null)
  const lastTickRef = useRef<number>(0)

  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0]

  const traces = useMemo(() => {
    return [bubbleSortTrace(preset.arr), insertionSortTrace(preset.arr), mergesortTrace(preset.arr)]
  }, [preset])

  const totalSteps = maxLen(traces)

  // Reset when preset changes.
  useEffect(() => {
    setStep(0)
    setPlaying(false)
  }, [presetId])

  // Animation loop — one frame every ~70ms.
  useEffect(() => {
    if (!playing) return
    function tick(now: number) {
      if (now - lastTickRef.current > 70) {
        lastTickRef.current = now
        setStep((s) => {
          const next = s + 1
          if (next >= totalSteps - 1) {
            setPlaying(false)
            return totalSteps - 1
          }
          return next
        })
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [playing, totalSteps])

  const reset = () => {
    setStep(0)
    setPlaying(false)
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Bubble vs Insertion vs Mergesort — ο ίδιος πίνακας, τρεις αλγόριθμοι
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-accent">
          n = 10
        </span>
      </div>

      {/* preset selector */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPresetId(p.id)}
            className={cn(
              'rounded-md border px-2 py-0.5 text-sm transition-colors',
              presetId === p.id
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-fg-muted hover:text-fg',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* lanes */}
      <div className="space-y-2.5">
        {traces.map((t) => (
          <Lane key={t.name} trace={t} step={step} />
        ))}
      </div>

      {/* controls */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          disabled={step >= totalSteps - 1}
          className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? 'Παύση' : 'Παίξε'}
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(s + 1, totalSteps - 1))}
          disabled={playing || step >= totalSteps - 1}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
          Βήμα
        </button>
        <button
          type="button"
          onClick={() => setStep(totalSteps - 1)}
          disabled={step >= totalSteps - 1}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronsRight className="h-4 w-4" />
          Στο τέλος
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <RotateCcw className="h-4 w-4" />
          Από την αρχή
        </button>
        <span className="ml-auto font-mono text-xs text-fg-subtle">
          βήμα {step} / {totalSteps - 1}
        </span>
      </div>

      {/* takeaway when the race finishes */}
      {step >= totalSteps - 1 && (
        <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2.5 text-sm leading-relaxed text-fg">
          <span className="font-semibold">Διάβασε τους μετρητές.</span>{' '}
          Στον {preset.label.toLowerCase()} πίνακα, η <b>mergesort</b> έκλεισε με{' '}
          <b className="font-mono">{traces[2].total}</b> συγκρίσεις — ενώ η bubble χρειάστηκε{' '}
          <b className="font-mono">{traces[0].total}</b>{' '}
          (≈ <b>{(traces[0].total / Math.max(traces[2].total, 1)).toFixed(1)}×</b>). Σε n = 10 η
          διαφορά είναι λίγες δεκάδες· σε n = 10⁶ είναι <b>πέντε τάξεις μεγέθους</b>.
        </div>
      )}
    </section>
  )
}

function Lane({ trace, step }: { trace: Trace; step: number }) {
  const idx = Math.min(step, trace.frames.length - 1)
  const frame = trace.frames[idx]
  const done = idx >= trace.frames.length - 1
  const pct = Math.round(((idx + 1) / trace.frames.length) * 100)

  return (
    <div
      className={cn(
        'rounded-lg border p-2.5 transition-colors',
        done ? 'border-success/40 bg-success/5' : 'border-border bg-bg-soft/40',
      )}
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-fg">{trace.name}</span>
          <span className="rounded-md border border-border bg-bg-elevated px-1.5 py-0.5 font-mono text-[11px] text-fg-muted">
            {trace.complexity}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-fg-muted">συγκρίσεις:</span>
          <span
            className={cn(
              'rounded-md px-2 py-0.5 font-mono text-sm font-bold',
              done ? 'bg-success/15 text-success' : 'bg-accent/10 text-accent',
            )}
          >
            {frame.cmps}
          </span>
        </div>
      </div>
      {/* the array */}
      <div className="flex flex-wrap gap-1">
        {frame.arr.map((v, i) => {
          const active = frame.cursor && (i === frame.cursor[0] || i === frame.cursor[1])
          return (
            <div
              key={i}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-md border font-mono text-xs font-semibold transition-colors',
                done
                  ? 'border-success/40 bg-success/10 text-fg'
                  : active
                    ? 'border-accent bg-accent/15 text-fg'
                    : 'border-border bg-bg-elevated text-fg',
              )}
            >
              {v}
            </div>
          )
        })}
      </div>
      {/* progress strip */}
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border/60">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            done ? 'bg-success' : 'bg-accent',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
