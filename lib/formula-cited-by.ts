/**
 * For each formula ID, the list of exercises that reference it via
 * `formulaIds: [...]`. Powers the "παρόμοια παλιά θέματα" chips inside
 * each /formulas entry expansion.
 *
 * Precomputed once at module load — `EXERCISES` is static and the
 * lookup is read-only.
 */

import { EXERCISES } from '@/content/practice/exercises'
import type { ExamSource } from '@/content/practice/types'

export type CitedExercise = {
  id: string
  title: string
  problemNumber?: string
  source?: ExamSource
}

const CITED_BY: Record<string, CitedExercise[]> = (() => {
  const out: Record<string, CitedExercise[]> = {}
  for (const ex of EXERCISES) {
    if (!ex.formulaIds) continue
    const cite: CitedExercise = {
      id: ex.id,
      title: ex.title,
      problemNumber: ex.problemNumber,
      source: ex.source,
    }
    for (const fid of ex.formulaIds) {
      ;(out[fid] ??= []).push(cite)
    }
  }
  return out
})()

const SOURCE_RECENCY: Record<ExamSource, number> = {
  'proodos-april-2026': 6,
  'jan-2026': 5,
  'sept-2025': 4,
  'june-2025': 3,
  'proodos-b-2025': 2,
  'proodos-a-2025': 1,
}

function recencyOf(ex: CitedExercise): number {
  return ex.source ? (SOURCE_RECENCY[ex.source] ?? 0) : 0
}

export function getCitedExercises(formulaId: string): CitedExercise[] {
  const list = CITED_BY[formulaId]
  if (!list) return []
  return [...list].sort((a, b) => recencyOf(b) - recencyOf(a))
}
