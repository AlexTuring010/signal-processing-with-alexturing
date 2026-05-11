'use client'

import { Repeat, ArrowRight } from 'lucide-react'
import {
  TOPIC_COLORS,
  TOPIC_LABELS,
  DIFFICULTY_LABELS,
} from '@/content/practice/types'
import type { RelatedRef } from './SoseClient'

type Props = {
  related: RelatedRef[]
  /** Called when the student clicks a related problem to jump to it. */
  onJumpTo: (n: number) => void
}

const DIFFICULTY_DOT: Record<RelatedRef['difficulty'], string> = {
  easy: 'bg-emerald-500',
  medium: 'bg-amber-500',
  hard: 'bg-rose-500',
}

/**
 * «Παρόμοιες» — auto-derived list of related problems for extra practice.
 * Same topic + overlap on prereqs + tie-break by close difficulty. Always
 * present (no authoring required), so every problem in crunch mode has at
 * least one extra section beyond the solution.
 */
export function RelatedProblems({ related, onJumpTo }: Props) {
  if (related.length === 0) return null

  return (
    <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4">
      <h4 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-purple-700 dark:text-purple-300">
        <Repeat className="h-4 w-4" aria-hidden />
        Παρόμοιες — αν θες παραπάνω εξάσκηση
      </h4>
      <ul className="space-y-1.5">
        {related.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => onJumpTo(r.position)}
              className="group flex w-full items-center gap-3 rounded-lg border border-border bg-bg-elevated px-3 py-2 text-left transition hover:border-purple-500/50 hover:bg-purple-500/5"
            >
              <span className="font-mono text-xs font-semibold tabular-nums text-fg-muted">
                #{r.position}
              </span>
              <span
                className={`inline-block h-2 w-2 shrink-0 rounded-full ${DIFFICULTY_DOT[r.difficulty]}`}
                aria-hidden
                title={DIFFICULTY_LABELS[r.difficulty]}
              />
              <span className="flex-1 text-sm font-medium text-fg group-hover:text-purple-700 dark:group-hover:text-purple-300">
                {r.title}
              </span>
              <span
                className={`hidden rounded-full border px-1.5 py-0.5 text-[10px] font-semibold sm:inline ${TOPIC_COLORS[r.topic]}`}
              >
                {TOPIC_LABELS[r.topic]}
              </span>
              <ArrowRight
                className="h-3.5 w-3.5 text-fg-subtle transition group-hover:translate-x-0.5 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                aria-hidden
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
