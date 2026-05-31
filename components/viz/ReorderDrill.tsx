'use client'

import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type ReorderItem = {
  /** Stable id used to check the order. */
  id: string
  /** What the student sees on the row. */
  label: ReactNode
  /** Optional extra info revealed after a correct/checked attempt (e.g. the
   *  frequency band that justifies the position). */
  detail?: ReactNode
}

/**
 * A self-contained "put these in the right order" drill.
 *
 * `items` are passed in the CORRECT order; the component scrambles them for
 * display (deterministically, so server and client render the same thing and
 * hydration stays happy) and lets the student rearrange with the up/down
 * buttons or by dragging. «Έλεγχος» checks the arrangement and marks each row
 * — it never reveals the answer prose, so it works *before* the student opens
 * the solution.
 */
export function ReorderDrill({
  items,
  prompt,
}: {
  items: ReorderItem[]
  prompt?: ReactNode
}) {
  const correctOrder = items.map((it) => it.id)
  const byId = (id: string) => items.find((it) => it.id === id)!

  // Deterministic initial scramble: reverse of the correct order. For ≥2 items
  // this guarantees it doesn't start solved, and — unlike Math.random() — it
  // produces identical markup on the server and the client.
  const [order, setOrder] = useState<string[]>(() =>
    [...correctOrder].reverse(),
  )
  const [checked, setChecked] = useState(false)
  const [dragId, setDragId] = useState<string | null>(null)

  // Any rearrangement invalidates a previous check.
  const rearrange = (next: string[]) => {
    setOrder(next)
    setChecked(false)
  }

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= order.length) return
    const next = [...order]
    ;[next[index], next[target]] = [next[target], next[index]]
    rearrange(next)
  }

  const moveTo = (fromId: string, toId: string) => {
    if (fromId === toId) return
    const next = [...order]
    const from = next.indexOf(fromId)
    const to = next.indexOf(toId)
    next.splice(from, 1)
    next.splice(to, 0, fromId)
    rearrange(next)
  }

  const shuffle = () => {
    // Fisher–Yates — only ever runs from a click (post-mount), so no
    // hydration concern. Re-rolls until it isn't already solved.
    let next = [...order]
    do {
      next = [...order]
      for (let i = next.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[next[i], next[j]] = [next[j], next[i]]
      }
    } while (next.length > 1 && next.every((id, i) => id === correctOrder[i]))
    rearrange(next)
  }

  const correctCount = order.filter((id, i) => id === correctOrder[i]).length
  const allCorrect = correctCount === correctOrder.length

  return (
    <div className="my-4 rounded-lg border border-border bg-bg-elevated p-4">
      {prompt && <p className="mb-3 text-sm text-fg-muted">{prompt}</p>}

      <ol className="space-y-2">
        {order.map((id, index) => {
          const item = byId(id)
          const rowState = checked
            ? id === correctOrder[index]
              ? 'correct'
              : 'wrong'
            : 'idle'
          return (
            <li
              key={id}
              draggable
              onDragStart={() => setDragId(id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragId) moveTo(dragId, id)
                setDragId(null)
              }}
              onDragEnd={() => setDragId(null)}
              className={cn(
                'flex items-center gap-3 rounded-md border px-3 py-2 transition-colors',
                rowState === 'correct' &&
                  'border-emerald-500/50 bg-emerald-500/10',
                rowState === 'wrong' && 'border-rose-500/50 bg-rose-500/10',
                rowState === 'idle' && 'border-border bg-bg',
                dragId === id && 'opacity-50',
              )}
            >
              <span
                aria-hidden="true"
                className="cursor-grab select-none text-fg-subtle"
                title="Σύρε για αναδιάταξη"
              >
                ⠿
              </span>
              <span className="w-5 shrink-0 text-center text-xs font-semibold text-fg-subtle">
                {index + 1}
              </span>
              <span className="flex-1 text-sm text-fg">
                {item.label}
                {checked && item.detail && (
                  <span className="mt-0.5 block text-xs text-fg-subtle">
                    {item.detail}
                  </span>
                )}
              </span>
              {checked && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'shrink-0 text-sm',
                    rowState === 'correct'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400',
                  )}
                >
                  {rowState === 'correct' ? '✓' : '✗'}
                </span>
              )}
              <span className="flex shrink-0 flex-col">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Μετακίνηση πάνω"
                  className="px-1 text-fg-muted hover:text-fg disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === order.length - 1}
                  aria-label="Μετακίνηση κάτω"
                  className="px-1 text-fg-muted hover:text-fg disabled:opacity-30"
                >
                  ▼
                </button>
              </span>
            </li>
          )
        })}
      </ol>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setChecked(true)}
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
        >
          Έλεγχος
        </button>
        <button
          type="button"
          onClick={shuffle}
          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
        >
          Ανακάτεψε
        </button>
        {checked && (
          <span
            className={cn(
              'text-sm font-medium',
              allCorrect
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-fg-muted',
            )}
          >
            {allCorrect
              ? 'Σωστά! ✓'
              : `${correctCount} από ${correctOrder.length} στη σωστή θέση — δοκίμασε ξανά.`}
          </span>
        )}
      </div>
    </div>
  )
}
