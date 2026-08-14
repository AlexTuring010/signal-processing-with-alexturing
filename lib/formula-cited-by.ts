/**
 * For each formula ID, the list of exercises that reference it via
 * `formulaIds: [...]`. Powers the "παρόμοια παλιά θέματα" chips inside
 * each /formulas entry expansion.
 *
 * Precomputed once at module load — `EXERCISES` is static and the
 * lookup is read-only.
 */

import { EXERCISES } from '@/content/practice/exercises'
import { SOURCE_RECENCY, type ExamSource } from '@/content/practice/types'

export type CitedExercise = {
  id: string
  title: string
  problemNumber?: string
  source?: ExamSource
  /** Page of the scanned paper, so the source chip can deep-link to it. */
  paperPage?: number
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
      paperPage: ex.paperPage,
    }
    for (const fid of ex.formulaIds) {
      ;(out[fid] ??= []).push(cite)
    }
  }
  return out
})()

function recencyOf(ex: CitedExercise): number {
  return ex.source ? (SOURCE_RECENCY[ex.source] ?? 0) : 0
}

export function getCitedExercises(formulaId: string): CitedExercise[] {
  const list = CITED_BY[formulaId]
  if (!list) return []
  return [...list].sort((a, b) => recencyOf(b) - recencyOf(a))
}
