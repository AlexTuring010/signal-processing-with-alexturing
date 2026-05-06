'use client'

import { useState } from 'react'
import { ChevronDown, GraduationCap, Sparkles, BookOpen } from 'lucide-react'
import {
  TOPIC_COLORS,
  TOPIC_LABELS,
  DIFFICULTY_LABELS,
  SOURCE_LABELS,
  ORIGIN_LABELS,
  ORIGIN_COLORS,
} from '@/content/practice/types'
import type { Exercise } from '@/content/practice/types'
import { PrereqChips } from './PrereqChips'
import { useFormulaSheet } from './formula-sheet-store'

type Props = {
  exercise: Exercise
}

const DIFFICULTY_COLORS = {
  easy: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  medium: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  hard: 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300',
}

export function ExerciseCard({ exercise }: Props) {
  const [open, setOpen] = useState(false)
  const { openWithAssist } = useFormulaSheet()

  const hasFormulaIds = (exercise.formulaIds?.length ?? 0) > 0

  const handleAssist = () => {
    openWithAssist(exercise.formulaIds ?? [], exercise.memorizationNote)
  }

  return (
    <article className="rounded-xl border border-border bg-bg-elevated p-5 shadow-sm transition hover:border-border/80">
      {/* Header row: badges */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span
          className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${ORIGIN_COLORS[exercise.origin]}`}
        >
          {exercise.origin === 'past-exam' && (
            <GraduationCap className="mr-1 inline-block h-3 w-3" aria-hidden />
          )}
          {exercise.origin === 'ai-generated' && (
            <Sparkles className="mr-1 inline-block h-3 w-3" aria-hidden />
          )}
          {ORIGIN_LABELS[exercise.origin]}
        </span>
        {exercise.source && (
          <span className="rounded-full border border-purple-500/40 bg-purple-500/10 px-2 py-0.5 text-[11px] font-semibold text-purple-700 dark:text-purple-300">
            {SOURCE_LABELS[exercise.source]}
          </span>
        )}
        {exercise.problemNumber && (
          <span className="rounded-full border border-border bg-bg-soft px-2 py-0.5 text-[11px] font-mono font-semibold text-fg-muted">
            {exercise.problemNumber}
          </span>
        )}
        {exercise.weight != null && (
          <span className="rounded-full border border-rose-500/40 bg-rose-500/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-rose-700 dark:text-rose-300">
            {exercise.weight}%
          </span>
        )}
        <span
          className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${TOPIC_COLORS[exercise.topic]}`}
        >
          {TOPIC_LABELS[exercise.topic]}
        </span>
        <span
          className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${DIFFICULTY_COLORS[exercise.difficulty]}`}
        >
          {DIFFICULTY_LABELS[exercise.difficulty]}
        </span>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-base font-semibold tracking-tight">{exercise.title}</h3>

      {/* Statement */}
      <div className="prose-content max-w-none text-[15px] leading-relaxed text-fg">
        {exercise.statement}
      </div>

      {/* Prerequisite chips */}
      <div className="mt-3">
        <PrereqChips prerequisites={exercise.prerequisites} />
      </div>

      {/* Action row */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-soft px-3 py-1.5 text-sm font-medium text-fg-muted transition hover:border-accent/50 hover:text-fg"
          aria-expanded={open}
        >
          <ChevronDown
            className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`}
            aria-hidden
          />
          {open ? 'Απόκρυψη λύσης' : 'Δες τη λύση'}
        </button>
        {hasFormulaIds && (
          <button
            type="button"
            onClick={handleAssist}
            className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-700 transition hover:border-amber-500 hover:bg-amber-500/20 dark:text-amber-300"
            title="Άνοιξε τυπολόγιο με τονισμένους τους τύπους που χρειάζεσαι"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Assist με τυπολόγιο
          </button>
        )}
        {exercise.origin === 'ai-generated' && (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-yellow-500/40 bg-yellow-500/10 px-3 py-1.5 text-xs text-yellow-800 dark:text-yellow-200">
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            Παραλλαγή — όχι πραγματική εξέταση
          </span>
        )}
      </div>

      {open && (
        <div className="prose-content mt-4 max-w-none border-t border-border pt-4 text-[15px] leading-relaxed text-fg">
          {exercise.solution}
        </div>
      )}
    </article>
  )
}
