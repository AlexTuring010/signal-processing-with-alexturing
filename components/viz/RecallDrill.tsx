'use client'

/**
 * RecallDrill — active-recall practice. Two modes:
 *  - cloze   — fill the load-bearing blanks in a statement / snippet.
 *  - reorder — put the scrambled steps back in the right order.
 *
 * Both force the student to *produce* the algorithm rather than re-read it
 * (the testing effect). `ClozeDrill` and `ReorderDrill` are thin wrappers
 * with `mode` pre-bound; `RecallDrill` is the dispatcher.
 *
 * No persistence — these are formative. `onComplete` is the seam for later.
 */

import { useState, type ReactNode } from 'react'
import {
  PencilLine,
  ArrowUpDown,
  Check,
  RotateCcw,
  Eye,
  ChevronUp,
  ChevronDown,
  GripVertical,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------- types

export type ClozeSegment = { text: string } | { blank: string; hint?: string }
export type ReorderStep = { id: string; text: ReactNode }

type ClozeProps = {
  mode?: 'cloze'
  prompt?: ReactNode
  title?: string
  segments: ClozeSegment[]
  /** Exact match required. Default false → accent- + case-insensitive. */
  caseSensitive?: boolean
  onComplete?: () => void
}

type ReorderProps = {
  mode?: 'reorder'
  prompt?: ReactNode
  title?: string
  /** Authored in the CORRECT order; shown shuffled. */
  steps: ReorderStep[]
  onComplete?: () => void
}

type RecallDrillProps =
  | ({ mode: 'cloze' } & ClozeProps)
  | ({ mode: 'reorder' } & ReorderProps)

const isBlank = (s: ClozeSegment): s is { blank: string; hint?: string } => 'blank' in s

/** Forgiving comparison: trim, and (unless caseSensitive) drop case + accents. */
function matches(input: string, answer: string, caseSensitive?: boolean): boolean {
  const norm = (s: string) => {
    const t = s.trim()
    return caseSensitive
      ? t
      : t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  }
  return input.trim().length > 0 && norm(input) === norm(answer)
}

// ---------------------------------------------------------- shared frame

function DrillFrame({
  icon,
  title,
  prompt,
  children,
  footer,
}: {
  icon: ReactNode
  title: string
  prompt?: ReactNode
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-accent">{icon}</span>
        <span className="text-sm font-semibold tracking-tight text-fg">{title}</span>
      </div>
      {prompt && <div className="mb-3 text-sm text-fg-muted">{prompt}</div>}
      {children}
      <div className="mt-3 flex flex-wrap items-center gap-2">{footer}</div>
    </section>
  )
}

const btnPrimary =
  'inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40'
const btnGhost =
  'inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40'

// ------------------------------------------------------------- cloze

export function ClozeDrill({
  prompt,
  title = 'Συμπλήρωσε τα κενά',
  segments,
  caseSensitive,
  onComplete,
}: ClozeProps) {
  const blanks = segments.filter(isBlank)
  const [values, setValues] = useState<string[]>(() => blanks.map(() => ''))
  const [checked, setChecked] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const results = blanks.map((b, i) => matches(values[i] ?? '', b.blank, caseSensitive))
  const correctCount = results.filter(Boolean).length

  const setValue = (i: number, v: string) => {
    setValues((prev) => {
      const next = [...prev]
      next[i] = v
      return next
    })
    setChecked(false)
  }

  const check = () => {
    setChecked(true)
    if (results.every(Boolean)) onComplete?.()
  }
  const reveal = () => {
    setValues(blanks.map((b) => b.blank))
    setRevealed(true)
    setChecked(true)
  }
  const reset = () => {
    setValues(blanks.map(() => ''))
    setChecked(false)
    setRevealed(false)
  }

  let blankIndex = -1

  return (
    <DrillFrame
      icon={<PencilLine className="h-4 w-4" aria-hidden="true" />}
      title={title}
      prompt={prompt}
      footer={
        <>
          <button type="button" onClick={check} className={btnPrimary} disabled={revealed}>
            <Check className="h-4 w-4" aria-hidden="true" />
            Έλεγχος
          </button>
          <button type="button" onClick={reveal} className={btnGhost} disabled={revealed}>
            <Eye className="h-4 w-4" aria-hidden="true" />
            Δες την απάντηση
          </button>
          <button type="button" onClick={reset} className={btnGhost}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Καθάρισε
          </button>
          {checked && !revealed && (
            <span
              className={cn(
                'text-sm font-semibold',
                correctCount === blanks.length ? 'text-success' : 'text-fg-muted',
              )}
            >
              {correctCount} / {blanks.length} σωστά
            </span>
          )}
          {revealed && (
            <span className="text-sm text-fg-muted">Η σωστή απάντηση φαίνεται πάνω.</span>
          )}
        </>
      }
    >
      <div className="whitespace-pre-wrap rounded-lg border border-border bg-bg-soft/50 px-3 py-3 text-[0.95rem] leading-loose text-fg">
        {segments.map((seg, i) => {
          if (!isBlank(seg)) return <span key={i}>{seg.text}</span>
          blankIndex += 1
          const idx = blankIndex
          const ok = checked && results[idx]
          const bad = checked && !results[idx]
          const answer = seg.blank
          return (
            <input
              key={i}
              type="text"
              aria-label={`Κενό ${idx + 1}`}
              value={values[idx] ?? ''}
              placeholder={seg.hint}
              disabled={revealed}
              onChange={(e) => setValue(idx, e.target.value)}
              spellCheck={false}
              autoComplete="off"
              style={{ width: `${Math.max(answer.length, seg.hint?.length ?? 0, 5) + 2}ch` }}
              className={cn(
                'mx-0.5 inline-block rounded border-b-2 bg-bg-elevated px-1 text-center font-mono text-[0.9rem] text-fg focus:outline-none focus:ring-2 focus:ring-accent/40',
                ok && 'border-success text-success',
                bad && 'border-danger text-danger',
                !checked && 'border-border-strong',
              )}
            />
          )
        })}
      </div>
    </DrillFrame>
  )
}

// ----------------------------------------------------------- reorder

function hashStr(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Deterministic shuffle — SSR and client agree, so no hydration flash. */
function shuffleIds(ids: string[]): string[] {
  const rng = mulberry32(hashStr(ids.join('|')))
  const a = [...ids]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  // guard against the shuffle landing back on the original order
  if (a.length > 1 && a.join() === ids.join()) a.push(a.shift() as string)
  return a
}

export function ReorderDrill({
  prompt,
  title = 'Βάλε τα βήματα στη σειρά',
  steps,
  onComplete,
}: ReorderProps) {
  const correctIds = steps.map((s) => s.id)
  const stepById = new Map(steps.map((s) => [s.id, s]))
  const [order, setOrder] = useState<string[]>(() => shuffleIds(correctIds))
  const [checked, setChecked] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  const correctCount = order.filter((id, i) => id === correctIds[i]).length
  const allCorrect = correctCount === steps.length

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= order.length) return
    setOrder((prev) => {
      const next = [...prev]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
    setChecked(false)
  }

  /** Move an item to an arbitrary index — used by drag-and-drop. */
  const moveTo = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= order.length || to >= order.length) {
      return
    }
    setOrder((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
    setChecked(false)
  }

  /** Live reorder while dragging: the dragged row follows the cursor. */
  const onDragEnterRow = (j: number) => {
    if (dragIndex === null || dragIndex === j) return
    moveTo(dragIndex, j)
    setDragIndex(j)
  }

  const check = () => {
    setChecked(true)
    if (allCorrect) onComplete?.()
  }
  const reveal = () => {
    setOrder([...correctIds])
    setChecked(true)
  }
  const reset = () => {
    setOrder(shuffleIds(correctIds))
    setChecked(false)
  }

  return (
    <DrillFrame
      icon={<ArrowUpDown className="h-4 w-4" aria-hidden="true" />}
      title={title}
      prompt={prompt}
      footer={
        <>
          <button type="button" onClick={check} className={btnPrimary}>
            <Check className="h-4 w-4" aria-hidden="true" />
            Έλεγχος
          </button>
          <button type="button" onClick={reveal} className={btnGhost}>
            <Eye className="h-4 w-4" aria-hidden="true" />
            Δες τη σειρά
          </button>
          <button type="button" onClick={reset} className={btnGhost}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Ανακάτεψε ξανά
          </button>
          {checked && (
            <span
              className={cn(
                'text-sm font-semibold',
                allCorrect ? 'text-success' : 'text-fg-muted',
              )}
            >
              {allCorrect
                ? 'Τέλεια — σωστή σειρά!'
                : `${correctCount} / ${steps.length} στη σωστή θέση`}
            </span>
          )}
        </>
      }
    >
      <div className="mb-2 text-xs text-fg-subtle">
        Σύρε τις γραμμές για αναδιάταξη — ή χρησιμοποίησε τα βελάκια.
      </div>
      <div className="space-y-1.5">
        {order.map((id, i) => {
          const step = stepById.get(id)
          if (!step) return null
          const ok = checked && id === correctIds[i]
          const bad = checked && id !== correctIds[i]
          return (
            <div
              key={id}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragEnter={() => onDragEnterRow(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => e.preventDefault()}
              onDragEnd={() => setDragIndex(null)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-2.5 py-2 text-sm',
                'cursor-grab active:cursor-grabbing',
                ok && 'border-success/50 bg-success/5',
                bad && 'border-danger/50 bg-danger/5',
                !checked && 'border-border bg-bg-soft/50',
                dragIndex === i && 'opacity-60 ring-2 ring-accent/40',
              )}
            >
              <GripVertical
                className="h-4 w-4 shrink-0 text-fg-subtle"
                aria-hidden="true"
              />
              <span className="font-mono text-xs font-semibold text-fg-subtle">{i + 1}.</span>
              <span className="flex-1 leading-relaxed text-fg">{step.text}</span>
              <div className="flex shrink-0 flex-col">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label={`Μετακίνησε το βήμα ${i + 1} πάνω`}
                  className="rounded p-0.5 text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg disabled:opacity-25"
                >
                  <ChevronUp className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === order.length - 1}
                  aria-label={`Μετακίνησε το βήμα ${i + 1} κάτω`}
                  className="rounded p-0.5 text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg disabled:opacity-25"
                >
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </DrillFrame>
  )
}

// ---------------------------------------------------------- dispatcher

export function RecallDrill(props: RecallDrillProps) {
  if (props.mode === 'reorder') return <ReorderDrill {...props} />
  return <ClozeDrill {...props} />
}
