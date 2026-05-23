'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Check,
  RotateCcw,
  ListChecks,
} from 'lucide-react'
import { readJSON, writeJSON } from '@/lib/storage'
import { cn } from '@/lib/utils'

type Props = {
  /** Stable per-page identifier. */
  id: string
  prompt: ReactNode
  /** Steps in their CORRECT order — the drill shuffles them for display. */
  steps: ReactNode[]
  title?: string
}

const STORAGE_PREFIX = 'spwa:reorder'

/** Deterministic Mulberry32-ish shuffle so the SSR/CSR boundary agrees. */
function seededShuffle(n: number, seedInput: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i)
  let seed = seedInput >>> 0 || 1
  for (let i = n - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0
    const j = seed % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  // If the shuffle happened to leave items in order, rotate once so the
  // student actually has work to do.
  if (arr.every((v, i) => v === i) && n > 1) {
    arr.push(arr.shift() as number)
  }
  return arr
}

type Saved = { order?: number[]; passed?: boolean }

/**
 * Ανακάλεσε — drag-to-order drill. Steps are presented shuffled; the student
 * uses ↑/↓ buttons to reorder (more reliable on mobile than HTML5 DnD), then
 * checks. Passed state persists per-page-per-id.
 */
export function ReorderDrill({
  id,
  prompt,
  steps,
  title = 'Βάλε τα βήματα στη σωστή σειρά',
}: Props) {
  const pathname = usePathname() ?? ''
  const slug = pathname.replace(/^\//, '')
  const storageKey = `${STORAGE_PREFIX}:${slug}:${id}`

  // Deterministic initial shuffle so first paint is stable across SSR + CSR.
  const initial = useMemo(() => {
    let seed = 0
    for (let i = 0; i < storageKey.length; i++) {
      seed = (seed * 31 + storageKey.charCodeAt(i)) >>> 0
    }
    return seededShuffle(steps.length, seed)
  }, [storageKey, steps.length])

  const [order, setOrder] = useState<number[]>(initial)
  const [checked, setChecked] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = readJSON<Saved | null>(storageKey, null)
    if (saved?.order && saved.order.length === steps.length) {
      setOrder(saved.order)
    }
    if (saved?.passed) setChecked(true)
    setHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  function move(from: number, to: number) {
    if (to < 0 || to >= order.length) return
    const next = order.slice()
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    setOrder(next)
    setChecked(false)
    writeJSON<Saved>(storageKey, { order: next, passed: false })
  }

  function check() {
    const allRight = order.every((v, i) => v === i)
    setChecked(true)
    writeJSON<Saved>(storageKey, { order, passed: allRight })
  }

  function reset() {
    setOrder(initial)
    setChecked(false)
    setRevealed(false)
    writeJSON<Saved>(storageKey, { order: initial, passed: false })
  }

  const passed = hydrated && checked && order.every((v, i) => v === i)
  // When the solution is revealed, render in the canonical correct order
  // (position == stepIdx) rather than the user's current `order`. User's
  // order is preserved in state so toggling solution off restores their attempt.
  const displayOrder = revealed
    ? Array.from({ length: steps.length }, (_, i) => i)
    : order

  return (
    <section
      className={cn(
        'not-prose my-6 overflow-hidden rounded-lg border bg-accent-soft/15',
        passed ? 'border-success/50' : 'border-accent/40',
      )}
    >
      <div className="flex items-center gap-2 border-b border-accent/30 px-4 py-2.5">
        <ListChecks className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        <span className="flex-1 text-sm font-semibold tracking-tight">{title}</span>
        {passed && (
          <span className="inline-flex items-center gap-1 rounded-full border border-success/50 bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
            <Check className="h-3 w-3" aria-hidden="true" />
            Σωστά
          </span>
        )}
      </div>

      <div className="px-4 pt-3 text-[0.95rem] leading-relaxed">{prompt}</div>

      <ol className="my-3 list-none space-y-1.5 px-4">
        {displayOrder.map((stepIdx, position) => {
          const correct = !revealed && checked ? stepIdx === position : null
          return (
            <li
              key={stepIdx}
              className={cn(
                'flex items-center gap-2 rounded-md border px-2 py-1.5 transition',
                revealed
                  ? 'border-dashed border-amber-400/70 bg-amber-400/10'
                  : correct === true
                    ? 'border-success/40 bg-success/5'
                    : correct === false
                      ? 'border-rose-400/40 bg-rose-400/5'
                      : 'border-border bg-bg-elevated',
              )}
            >
              <span className="w-5 shrink-0 text-center font-mono text-xs font-semibold tabular-nums text-fg-muted">
                {position + 1}.
              </span>
              <GripVertical
                className="h-3.5 w-3.5 shrink-0 text-fg-subtle"
                aria-hidden="true"
              />
              <div className="flex-1 text-[0.95rem] leading-snug">
                {steps[stepIdx]}
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => move(position, position - 1)}
                  disabled={position === 0 || revealed}
                  aria-label="Πάνω"
                  className="rounded p-1 text-fg-muted transition hover:bg-bg-soft hover:text-fg disabled:opacity-30"
                >
                  <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => move(position, position + 1)}
                  disabled={position === order.length - 1 || revealed}
                  aria-label="Κάτω"
                  className="rounded p-1 text-fg-muted transition hover:bg-bg-soft hover:text-fg disabled:opacity-30"
                >
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </li>
          )
        })}
      </ol>

      {revealed && (
        <p className="px-4 pb-2 text-[11px] font-medium uppercase tracking-wider text-amber-700 dark:text-amber-300">
          Λύση — η σωστή σειρά. «Κρύψε λύση» για επιστροφή στην προσπάθειά σου.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 px-4 pb-4">
        <button
          type="button"
          onClick={check}
          disabled={revealed}
          className="inline-flex items-center gap-1.5 rounded-md border border-accent/40 bg-accent-soft/40 px-3 py-1.5 text-sm font-medium transition hover:bg-accent-soft/60 disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          Έλεγξε
        </button>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-elevated px-3 py-1.5 text-sm text-fg-muted transition hover:border-fg-muted/40 hover:text-fg"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Επαναφορά
        </button>
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-elevated px-3 py-1.5 text-sm text-fg-muted transition hover:border-fg-muted/40 hover:text-fg"
          aria-expanded={revealed}
        >
          {revealed ? 'Κρύψε λύση' : 'Δες σωστή σειρά'}
        </button>
      </div>
    </section>
  )
}
