'use client'

import { useState } from 'react'
import { ChevronDown, GraduationCap } from 'lucide-react'
import {
  TOPIC_COLORS,
  TOPIC_LABELS,
  DIFFICULTY_LABELS,
  SOURCE_LABELS,
} from '@/content/practice/types'
import type { Exercise } from '@/content/practice/types'
import { PrereqChips } from './PrereqChips'

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

  return (
    <article className="rounded-xl border border-border bg-bg-elevated p-5 shadow-sm transition hover:border-border/80">
      {/* Header row: badges */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5">
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
        {exercise.source && (
          <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/10 px-2 py-0.5 text-[11px] font-semibold text-purple-700 dark:text-purple-300">
            <GraduationCap className="h-3 w-3" aria-hidden />
            {SOURCE_LABELS[exercise.source]}
          </span>
        )}
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

      {/* Solution toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-soft px-3 py-1.5 text-sm font-medium text-fg-muted transition hover:border-accent/50 hover:text-fg"
        aria-expanded={open}
      >
        <ChevronDown
          className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
        {open ? 'Απόκρυψη λύσης' : 'Δες τη λύση'}
      </button>

      {open && (
        <div className="prose-content mt-4 max-w-none border-t border-border pt-4 text-[15px] leading-relaxed text-fg">
          {exercise.solution}
        </div>
      )}
    </article>
  )
}
