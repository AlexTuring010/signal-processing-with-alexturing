'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Exercise, ExerciseCoaching, Topic } from '@/content/practice/types'
import { useAppStore } from '@/lib/store'
import { readJSON, writeJSON, STORAGE_KEYS } from '@/lib/storage'
import { SoseLanding } from './SoseLanding'
import { SoseToolbelt } from './SoseToolbelt'
import { SoseProblemCard } from './SoseProblemCard'
import { SoseNav } from './SoseNav'

export type RelatedRef = {
  id: string
  title: string
  position: number
  topic: Topic
  difficulty: 'easy' | 'medium' | 'hard'
}

export type ProblemPayload = {
  position: number
  exercise: Exercise
  coaching: ExerciseCoaching
  related: RelatedRef[]
}

type Props = {
  problems: ProblemPayload[]
  totalExamWeight: number
  topicTotals: Record<Topic, number>
}

const SOLVED_PREFIX = 'practice'

/**
 * Crunch flow controller. URL `?n=N` (1-indexed) is the source of truth
 * for which problem is shown; absence of `n` shows the landing pitch.
 *
 * Position autosaves to `STORAGE_KEYS.sosePosition` so a returning student
 * can resume from the landing page.
 */
export function SoseClient({ problems, totalExamWeight, topicTotals }: Props) {
  const router = useRouter()
  const params = useSearchParams()
  const total = problems.length

  const rawN = params.get('n')
  const parsedN = rawN === null ? null : Number(rawN)
  const validN =
    parsedN !== null && Number.isFinite(parsedN)
      ? Math.min(Math.max(Math.floor(parsedN), 1), total)
      : null

  const hydrated = useAppStore((s) => s.hydrated)
  const hydrate = useAppStore((s) => s.hydrate)
  const solvedSet = useAppStore((s) => s.solvedExercises)
  const toggleSolved = useAppStore((s) => s.toggleSolvedExercise)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const isSolved = useCallback(
    (id: string) => hydrated && solvedSet.has(`${SOLVED_PREFIX}:${id}`),
    [hydrated, solvedSet],
  )

  // Persist position whenever URL n changes
  useEffect(() => {
    if (validN !== null) {
      writeJSON(STORAGE_KEYS.sosePosition, validN)
    }
  }, [validN])

  // If URL has malformed n (e.g. ?n=abc or ?n=999), normalize without
  // adding a history entry.
  useEffect(() => {
    if (rawN !== null && validN !== null && String(validN) !== rawN) {
      router.replace(`/practice/sose-to-eksamino?n=${validN}`)
    }
  }, [rawN, validN, router])

  const goTo = useCallback(
    (n: number) => {
      const clamped = Math.min(Math.max(n, 1), total)
      router.push(`/practice/sose-to-eksamino?n=${clamped}`)
    },
    [router, total],
  )

  const goLanding = useCallback(() => {
    router.push('/practice/sose-to-eksamino')
  }, [router])

  // Keyboard shortcuts (only when on a problem page, not the landing)
  useEffect(() => {
    if (validN === null) return
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key === 'ArrowLeft' && validN > 1) {
        e.preventDefault()
        goTo(validN - 1)
      } else if (e.key === 'ArrowRight' && validN < total) {
        e.preventDefault()
        goTo(validN + 1)
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault()
        const ex = problems[validN - 1]?.exercise
        if (ex) toggleSolved(`${SOLVED_PREFIX}:${ex.id}`)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [validN, total, goTo, problems, toggleSolved])

  // Compute coverage stats live from solved set
  const stats = useMemo(() => {
    const perTopic: Record<Topic, number> = {
      foundations: 0,
      modulation: 0,
      am: 0,
      fm: 0,
      random: 0,
      noise: 0,
    }
    let solvedCount = 0
    let weightCovered = 0
    if (hydrated) {
      for (const p of problems) {
        if (solvedSet.has(`${SOLVED_PREFIX}:${p.exercise.id}`)) {
          solvedCount++
          weightCovered += p.exercise.weight ?? 0
          perTopic[p.exercise.topic]++
        }
      }
    }
    return {
      solvedCount,
      totalCount: total,
      weightCovered,
      totalWeight: totalExamWeight,
      weightFraction:
        totalExamWeight === 0 ? 0 : weightCovered / totalExamWeight,
      perTopic,
    }
  }, [hydrated, solvedSet, problems, total, totalExamWeight])

  // Landing view
  if (validN === null) {
    return (
      <SoseLanding
        total={total}
        stats={stats}
        savedPosition={readSavedPosition(total)}
        onStart={() => goTo(1)}
        onResume={(n) => goTo(n)}
      />
    )
  }

  const current = problems[validN - 1]
  if (!current) return null

  return (
    <div className="mx-auto max-w-4xl px-4 pb-32 pt-4 sm:px-6">
      <SoseToolbelt
        position={validN}
        total={total}
        stats={stats}
        topicTotals={topicTotals}
        onBackToLanding={goLanding}
      />

      <div className="mt-6">
        <SoseProblemCard
          payload={current}
          solved={isSolved(current.exercise.id)}
          onToggleSolved={() =>
            toggleSolved(`${SOLVED_PREFIX}:${current.exercise.id}`)
          }
          onJumpTo={(n) => goTo(n)}
        />
      </div>

      <SoseNav
        position={validN}
        total={total}
        solved={isSolved(current.exercise.id)}
        onPrev={() => goTo(validN - 1)}
        onNext={() => goTo(validN + 1)}
        onMarkSolved={() =>
          toggleSolved(`${SOLVED_PREFIX}:${current.exercise.id}`)
        }
      />
    </div>
  )
}

/** Read the saved position safely on the client. Returns null if absent or invalid. */
function readSavedPosition(total: number): number | null {
  const raw = readJSON<number | null>(STORAGE_KEYS.sosePosition, null)
  if (raw === null) return null
  if (!Number.isFinite(raw)) return null
  const n = Math.floor(raw)
  if (n < 1 || n > total) return null
  return n
}
