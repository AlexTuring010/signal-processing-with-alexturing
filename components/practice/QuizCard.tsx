'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import {
  TOPIC_COLORS,
  TOPIC_LABELS,
  DIFFICULTY_LABELS,
} from '@/content/practice/types'
import type { QuizQuestion } from '@/content/practice/types'
import { PrereqChips } from './PrereqChips'

type Props = {
  question: QuizQuestion
  /** Index in the session (1-based, displayed as "1/20"). */
  index?: number
  total?: number
  /**
   * Controlled mode: if `selected` is provided, the card displays the
   * selection without owning state. Used by the "static" mode where the
   * parent tracks all answers.
   */
  selected?: boolean | number | null
  onSelect?: (answer: boolean | number) => void
  /** When true, show the correct answer + explanation regardless of selection. */
  reveal?: boolean
}

const DIFFICULTY_COLORS = {
  easy: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  medium: 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  hard: 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300',
}

export function QuizCard({
  question,
  index,
  total,
  selected: controlledSelected,
  onSelect,
  reveal = false,
}: Props) {
  const [internalSelected, setInternalSelected] = useState<boolean | number | null>(null)
  const isControlled = controlledSelected !== undefined
  const selected = isControlled ? controlledSelected : internalSelected
  const answered = selected !== null && selected !== undefined

  const handleSelect = (answer: boolean | number) => {
    if (answered && !reveal) return
    if (isControlled) {
      onSelect?.(answer)
    } else {
      setInternalSelected(answer)
      onSelect?.(answer)
    }
  }

  const showFeedback = answered || reveal

  return (
    <article className="rounded-xl border border-border bg-bg-elevated p-5 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {index != null && total != null && (
            <span className="rounded-full border border-border bg-bg-soft px-2 py-0.5 text-[11px] font-mono tabular-nums text-fg-muted">
              {index}/{total}
            </span>
          )}
          <span
            className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${TOPIC_COLORS[question.topic]}`}
          >
            {TOPIC_LABELS[question.topic]}
          </span>
          <span
            className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${DIFFICULTY_COLORS[question.difficulty]}`}
          >
            {DIFFICULTY_LABELS[question.difficulty]}
          </span>
          <span className="rounded-full border border-border bg-bg-soft px-2 py-0.5 text-[11px] font-semibold text-fg-subtle">
            {question.type === 'true-false' ? 'Σωστό/Λάθος' : 'Πολλαπλή Επιλογή'}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="prose-content mb-4 max-w-none text-[15px] leading-relaxed text-fg">
        {question.question}
      </div>

      {/* Answer choices */}
      {question.type === 'true-false' ? (
        <div className="grid grid-cols-2 gap-2">
          {[true, false].map((value) => {
            const isSelected = selected === value
            const isCorrect = question.correctAnswer === value
            const showCorrect = showFeedback && isCorrect
            const showIncorrect = showFeedback && isSelected && !isCorrect

            const cls = showCorrect
              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
              : showIncorrect
                ? 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                : isSelected
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg'

            return (
              <button
                key={String(value)}
                type="button"
                onClick={() => handleSelect(value)}
                disabled={answered && !reveal}
                className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold transition ${cls} disabled:cursor-default`}
              >
                {showCorrect && <Check className="h-4 w-4" aria-hidden />}
                {showIncorrect && <X className="h-4 w-4" aria-hidden />}
                {value ? 'Σωστό' : 'Λάθος'}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {question.choices.map((choice, i) => {
            const isSelected = selected === i
            const isCorrect = question.correctAnswer === i
            const showCorrect = showFeedback && isCorrect
            const showIncorrect = showFeedback && isSelected && !isCorrect

            const cls = showCorrect
              ? 'border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200'
              : showIncorrect
                ? 'border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-200'
                : isSelected
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg'

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(i)}
                disabled={answered && !reveal}
                className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition ${cls} disabled:cursor-default`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current font-mono text-xs">
                  {showCorrect ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : showIncorrect ? (
                    <X className="h-3.5 w-3.5" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span className="prose-content flex-1 max-w-none">{choice}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Explanation */}
      {showFeedback && (
        <div className="mt-4 rounded-lg border border-accent/40 bg-accent-soft/30 p-3 text-sm leading-relaxed">
          <div className="prose-content max-w-none">{question.explanation}</div>
          <div className="mt-3">
            <PrereqChips prerequisites={question.prerequisites} />
          </div>
        </div>
      )}
    </article>
  )
}
