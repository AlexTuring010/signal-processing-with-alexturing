'use client'

import { CheckCircle2 } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

type Props = {
  /** Page slug this exercise set belongs to (e.g. "foundations/signals"). */
  slug: string
  /** Total number of <ExamProblem> items in the Εξάσκηση section. */
  total: number
  className?: string
}

/**
 * Small chip that shows "X / Y λυμένα" for the Εξάσκηση block on the current
 * page. Reads from the same `solvedExercises` set that drives each
 * ExamProblem's "Λυμένο" toggle.
 */
export function ExerciseProgress({ slug, total, className }: Props) {
  const hydrated = useAppStore((s) => s.hydrated)
  const count = useAppStore((s) => s.countSolvedInSlug)
  const solved = hydrated ? count(slug) : 0
  const allDone = solved === total && total > 0

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs',
        allDone
          ? 'border-success/50 bg-success/10 text-success'
          : 'border-border bg-bg-elevated text-fg-muted',
        className,
      )}
      aria-live="polite"
    >
      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
      <span>
        <strong>{solved}</strong> / {total} λυμένα
      </span>
    </div>
  )
}
