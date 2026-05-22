'use client'

/**
 * TwoPointerMerge — step through the merge of two sorted arrays.
 *
 * MergeSortAnimator shows the *shape* of merge sort — divide phase, merge
 * phase, log n levels of Θ(n) work. It deliberately skips the inner mechanic:
 * what does the comparison v ≤ b[j] actually *do* to the pointers i, j, k?
 *
 * This viz fills that gap. Two sorted arrays sit on top; a third (the output)
 * builds up below. Pointers i and j hover over the next unread element of
 * each input; pointer k marks the next write position. Every step the
 * student picks (or watches) the smaller of a[i] and b[j], pulls it down to
 * c[k], and advances exactly one input pointer. When one input runs dry, the
 * remaining tail is copied in bulk.
 *
 * Two modes:
 *   • «Παρακολούθηση»  — auto-step.
 *   • «Δοκίμασε εσύ»   — guess which side to pull next; wrong picks are
 *     called out (the merge property is broken).
 *
 * Built for L03.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Mode = 'watch' | 'guess'

type Action = { side: 'a' | 'b'; value: number; i: number; j: number; k: number }
type Frame = {
  /** values copied to c so far */
  c: number[]
  /** next unread index of a */
  i: number
  /** next unread index of b */
  j: number
  /** next write position of c */
  k: number
  /** which side we just pulled from, or null at the very start */
  lastSide: 'a' | 'b' | null
}

const A = [2, 4, 6, 9]
const B = [1, 3, 5, 7, 8]

/** Compute every intermediate frame of merge(a, b). */
function buildTrace(a: number[], b: number[]): { actions: Action[]; frames: Frame[] } {
  const actions: Action[] = []
  const frames: Frame[] = [{ c: [], i: 0, j: 0, k: 0, lastSide: null }]
  let i = 0
  let j = 0
  let k = 0
  const c: number[] = []
  while (i < a.length || j < b.length) {
    const pullA = j >= b.length || (i < a.length && a[i] <= b[j])
    if (pullA) {
      actions.push({ side: 'a', value: a[i], i, j, k })
      c.push(a[i])
      i++
    } else {
      actions.push({ side: 'b', value: b[j], i, j, k })
      c.push(b[j])
      j++
    }
    k++
    frames.push({ c: [...c], i, j, k, lastSide: pullA ? 'a' : 'b' })
  }
  return { actions, frames }
}

export function TwoPointerMerge() {
  const { actions, frames } = useMemo(() => buildTrace(A, B), [])
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState<Mode>('watch')
  const [playing, setPlaying] = useState(false)
  const [feedback, setFeedback] = useState<'ok' | 'bad' | null>(null)
  const lastTickRef = useRef(0)

  const lastStep = frames.length - 1
  const frame = frames[step]
  const nextAction = step < actions.length ? actions[step] : null
  const done = step === lastStep

  // Auto-play in watch mode.
  useEffect(() => {
    if (!playing || mode !== 'watch') return
    let raf = 0
    function tick(now: number) {
      if (now - lastTickRef.current > 720) {
        lastTickRef.current = now
        setStep((s) => {
          if (s >= lastStep) {
            setPlaying(false)
            return lastStep
          }
          return s + 1
        })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, lastStep, mode])

  // Stop play if mode switches.
  useEffect(() => {
    setPlaying(false)
    setFeedback(null)
  }, [mode])

  const reset = () => {
    setStep(0)
    setPlaying(false)
    setFeedback(null)
  }

  const pull = (side: 'a' | 'b') => {
    if (!nextAction) return
    if (nextAction.side === side) {
      setFeedback('ok')
      setStep((s) => s + 1)
      setTimeout(() => setFeedback(null), 500)
    } else {
      setFeedback('bad')
      setTimeout(() => setFeedback(null), 900)
    }
  }

  const canPullA = nextAction !== null && frame.i < A.length
  const canPullB = nextAction !== null && frame.j < B.length

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Συγχώνευση δύο ταξινομημένων πινάκων — δείκτες i, j, k βήμα-βήμα
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMode('watch')}
            className={cn(
              'rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
              mode === 'watch'
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-fg-muted hover:text-fg',
            )}
          >
            Παρακολούθηση
          </button>
          <button
            type="button"
            onClick={() => setMode('guess')}
            className={cn(
              'rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
              mode === 'guess'
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-fg-muted hover:text-fg',
            )}
          >
            Δοκίμασε εσύ
          </button>
        </div>
      </div>

      {/* Inputs */}
      <ArrayRow label="a[ ]" cells={A} pointer={frame.i} pointerLabel="i" pulledThrough={frame.i} highlight={mode === 'guess' && nextAction?.side === 'a'} />
      <ArrayRow label="b[ ]" cells={B} pointer={frame.j} pointerLabel="j" pulledThrough={frame.j} highlight={mode === 'guess' && nextAction?.side === 'b'} />

      {/* Comparison hint */}
      <div className="my-3 rounded-lg border border-border bg-bg-soft/60 px-3 py-2 text-center font-mono text-sm text-fg">
        {done ? (
          <span className="text-success">όλα τα {A.length + B.length} στοιχεία πέρασαν στο c</span>
        ) : frame.i >= A.length ? (
          <span>a εξαντλήθηκε → αντίγραψε ό,τι μένει από το b: <b>b[{frame.j}] = {B[frame.j]}</b></span>
        ) : frame.j >= B.length ? (
          <span>b εξαντλήθηκε → αντίγραψε ό,τι μένει από το a: <b>a[{frame.i}] = {A[frame.i]}</b></span>
        ) : (
          <span>
            σύγκριση: <b>a[{frame.i}] = {A[frame.i]}</b> {A[frame.i] <= B[frame.j] ? '≤' : '>'}{' '}
            <b>b[{frame.j}] = {B[frame.j]}</b> → τράβα από{' '}
            <span className="rounded bg-accent/15 px-1.5 py-0.5 text-accent">
              {A[frame.i] <= B[frame.j] ? 'a' : 'b'}
            </span>
          </span>
        )}
      </div>

      {/* Output */}
      <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2.5">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-semibold text-fg-muted">c[ ] (αποτέλεσμα)</span>
          <span className="font-mono text-fg-subtle">k = {frame.k}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: A.length + B.length }).map((_, idx) => {
            const filled = idx < frame.c.length
            const justWritten = idx === frame.c.length - 1 && frame.lastSide !== null
            const tone =
              frame.lastSide === 'a' && justWritten
                ? 'border-accent bg-accent/15 text-fg'
                : frame.lastSide === 'b' && justWritten
                  ? 'border-success bg-success/15 text-fg'
                  : filled
                    ? 'border-border bg-bg-elevated text-fg'
                    : 'border-dashed border-border text-fg-subtle'
            return (
              <div
                key={idx}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-md border font-mono text-sm font-semibold transition-colors',
                  tone,
                )}
              >
                {filled ? frame.c[idx] : ''}
              </div>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-3">
        {mode === 'watch' ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0 || playing}
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Πίσω
            </button>
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(lastStep, s + 1))}
              disabled={step === lastStep || playing}
              className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Επόμενο
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              disabled={done}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {playing ? 'Παύση' : 'Παίξε'}
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
              βήμα {step} / {lastStep}
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => pull('a')}
              disabled={!canPullA || done}
              className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent/5 px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-accent/10 disabled:opacity-40"
            >
              ↓ τράβα a[{frame.i}]{canPullA && ` = ${A[frame.i]}`}
            </button>
            <button
              type="button"
              onClick={() => pull('b')}
              disabled={!canPullB || done}
              className="inline-flex items-center gap-1.5 rounded-md border border-success/40 bg-success/5 px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-success/10 disabled:opacity-40"
            >
              ↓ τράβα b[{frame.j}]{canPullB && ` = ${B[frame.j]}`}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
            >
              <RotateCcw className="h-4 w-4" />
              Από την αρχή
            </button>
            {feedback === 'ok' && (
              <span className="inline-flex items-center gap-1 rounded-md bg-success/15 px-2 py-1 text-xs font-semibold text-success">
                <Check className="h-3.5 w-3.5" /> σωστά
              </span>
            )}
            {feedback === 'bad' && (
              <span className="inline-flex items-center gap-1 rounded-md bg-warn/15 px-2 py-1 text-xs font-semibold text-warn">
                <X className="h-3.5 w-3.5" /> όχι: η άλλη μεριά έχει μικρότερο
              </span>
            )}
            <span className="ml-auto font-mono text-xs text-fg-subtle">
              βήμα {step} / {lastStep}
            </span>
          </div>
        )}
      </div>

      {done && (
        <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2.5 text-sm leading-relaxed text-fg">
          <span className="font-semibold">Παρατήρηση κόστους.</span> Το c[] συμπληρώθηκε σε{' '}
          <b className="font-mono">{A.length + B.length}</b> βήματα — ακριβώς τόσα όσα τα στοιχεία.
          Κάθε βήμα: <b>μία σύγκριση</b> κι ένας δείκτης που προχωρά. Άρα η συγχώνευση κάνει{' '}
          <b className="font-mono">O(m + n)</b> δουλειά — <b>γραμμικά</b> στο σύνολο.
        </div>
      )}
    </section>
  )
}

function ArrayRow({
  label,
  cells,
  pointer,
  pointerLabel,
  pulledThrough,
  highlight,
}: {
  label: string
  cells: number[]
  pointer: number
  pointerLabel: string
  pulledThrough: number
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        'mb-2 rounded-lg border bg-bg-soft/40 px-3 py-2 transition-colors',
        highlight ? 'border-accent/50' : 'border-border',
      )}
    >
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-semibold text-fg-muted">{label}</span>
        <span className="font-mono text-fg-subtle">
          {pointerLabel} = {pointer < cells.length ? pointer : 'τέλος'}
        </span>
      </div>
      <div className="flex flex-wrap items-end gap-1">
        {cells.map((v, i) => {
          const consumed = i < pulledThrough
          const atPointer = i === pointer
          return (
            <div key={i} className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-md border font-mono text-sm font-semibold transition-colors',
                  consumed
                    ? 'border-border bg-bg-soft/40 text-fg-subtle line-through'
                    : atPointer
                      ? 'border-accent bg-accent/15 text-fg'
                      : 'border-border bg-bg-elevated text-fg',
                )}
              >
                {v}
              </div>
              <span
                className={cn(
                  'mt-0.5 font-mono text-[10px] transition-opacity',
                  atPointer ? 'text-accent' : 'text-transparent',
                )}
              >
                ▲ {pointerLabel}
              </span>
            </div>
          )
        })}
        {pointer >= cells.length && (
          <span className="ml-1 text-xs text-fg-subtle">— εξαντλήθηκε</span>
        )}
      </div>
    </div>
  )
}
