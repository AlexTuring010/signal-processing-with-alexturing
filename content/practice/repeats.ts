/**
 * Repeat detection for the practice library.
 *
 * Some past-exam questions are asked again, near-verbatim, on later exams.
 * Showing the same problem on two cards looks like an editorial mistake — so
 * each exercise that recurs is tagged with a shared `repeatGroup` key (see
 * `exercises.tsx`), and the card renders an "Επαναλαμβανόμενο θέμα" marker.
 * This module turns those tags into per-exercise occurrence lists.
 */

import type { Exercise, ExamSource } from './types'

/** One other exam where the same question appeared. */
export type RepeatOccurrence = {
  id: string
  source: ExamSource
  problemNumber?: string
  /** Page of that exam's scan, so the name can link to the right page. */
  paperPage?: number
}

/**
 * Maps each exercise id to the OTHER exercises sharing its `repeatGroup`.
 * Exercises with no `repeatGroup` — or a group of one — are omitted.
 *
 * Returns a plain object (not a Map) so it serialises cleanly across the
 * Server → Client component boundary.
 */
export function computeRepeats(
  exercises: Exercise[],
): Record<string, RepeatOccurrence[]> {
  const groups = new Map<string, Exercise[]>()
  for (const ex of exercises) {
    if (!ex.repeatGroup) continue
    const members = groups.get(ex.repeatGroup) ?? []
    members.push(ex)
    groups.set(ex.repeatGroup, members)
  }

  const byId: Record<string, RepeatOccurrence[]> = {}
  for (const members of groups.values()) {
    if (members.length < 2) continue
    for (const ex of members) {
      byId[ex.id] = members
        .filter(
          (other): other is Exercise & { source: ExamSource } =>
            other.id !== ex.id && other.source != null,
        )
        .map((other) => ({
          id: other.id,
          source: other.source,
          problemNumber: other.problemNumber,
          paperPage: other.paperPage,
        }))
    }
  }
  return byId
}
