/**
 * «Σώσε το εξάμηνο» — exam-survival flow logic.
 *
 * Powers `/practice/sose-to-eksamino`. The flow walks a student through the
 * 75-problem exercise bank in **theory-progression order**: easiest theory
 * first, hardest last. Each problem is a "tool" the student earns; coverage
 * of the exam weight is the real-data progress metric.
 *
 * Design notes:
 *   - `THEORY_ORDER` is the linear walk through the syllabus. Reference
 *     pages and the exam-prep chapter are excluded — they're not "new
 *     theory" you have to study to solve a problem.
 *   - Empty `prerequisites: []` problems (warm-up tier) get depth `-1` so
 *     they sort before everything else.
 *   - Sort tie-breakers: difficulty (easy → hard), then origin
 *     (past-exam → lecture → ai-generated). This is intentional and
 *     different from `/practice` which prioritises exam recency.
 */

import { CHAPTERS } from '@/content/sections'
import { EXERCISES } from '@/content/practice/exercises'
import { SOSE_COACHING } from '@/content/practice/sose-coaching'
import type {
  Difficulty,
  Exercise,
  ExerciseCoaching,
  Origin,
  Topic,
} from '@/content/practice/types'

/**
 * Linear walk through theory in the order students should learn it.
 * Built from `CHAPTERS`, excluding reference pages and the exam-prep
 * chapter (which doesn't introduce new theory).
 */
export const THEORY_ORDER: string[] = CHAPTERS.filter((c) => c.id !== 'exam')
  .flatMap((c) => c.sections)
  .filter((s) => s.group !== 'reference')
  .map((s) => s.slug)

const THEORY_INDEX: Record<string, number> = Object.fromEntries(
  THEORY_ORDER.map((slug, i) => [slug, i] as const),
)

/**
 * Max position in `THEORY_ORDER` of any of the given prereq slugs.
 * Returns `-1` when there are no prereqs (warm-up problems sort first).
 * Slugs not in `THEORY_INDEX` (e.g. unknown or reference pages) are
 * ignored — they don't push the depth up artificially.
 */
export function theoryDepth(prereqs: string[]): number {
  if (prereqs.length === 0) return -1
  let max = -1
  for (const slug of prereqs) {
    const idx = THEORY_INDEX[slug]
    if (idx !== undefined && idx > max) max = idx
  }
  return max
}

const DIFFICULTY_RANK: Record<Difficulty, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
}

const ORIGIN_RANK: Record<Origin, number> = {
  'past-exam': 0,
  lecture: 1,
  'ai-generated': 2,
}

/**
 * The full crunch path: 75 exercises sorted by theory progression.
 * Position is 1-indexed in the URL (`?n=1` is the first); array indexing
 * stays 0-based here.
 */
export const SOSE_PATH: Exercise[] = [...EXERCISES].sort((a, b) => {
  const da = theoryDepth(a.prerequisites)
  const db = theoryDepth(b.prerequisites)
  if (da !== db) return da - db
  const dfa = DIFFICULTY_RANK[a.difficulty]
  const dfb = DIFFICULTY_RANK[b.difficulty]
  if (dfa !== dfb) return dfa - dfb
  const oa = ORIGIN_RANK[a.origin]
  const ob = ORIGIN_RANK[b.origin]
  if (oa !== ob) return oa - ob
  return a.id.localeCompare(b.id)
})

/**
 * Find the position (1-indexed) of an exercise in the sose path.
 * Returns `null` if the id isn't in the path.
 */
export function positionOf(id: string): number | null {
  const i = SOSE_PATH.findIndex((e) => e.id === id)
  return i === -1 ? null : i + 1
}

/**
 * Get the coaching content (takeaway + exam radar + related override) for
 * an exercise. Returns an empty object if nothing is authored — the UI
 * degrades gracefully by hiding the corresponding sections.
 */
export function coachingFor(id: string): ExerciseCoaching {
  return SOSE_COACHING[id] ?? {}
}

/**
 * Auto-derive «Παρόμοιες» — exercises in the same topic with overlapping
 * prereqs. Score = prereq overlap count + 0.5 if same difficulty.
 * Excludes the exercise itself.
 *
 * Returns at most `k` exercises. If a coaching entry has an explicit
 * `relatedIds` override, that wins (resolved upstream in the component).
 */
export function findRelated(ex: Exercise, k = 3): Exercise[] {
  const prereqSet = new Set(ex.prerequisites)
  const scored: { ex: Exercise; score: number }[] = []
  for (const other of SOSE_PATH) {
    if (other.id === ex.id) continue
    if (other.topic !== ex.topic) continue
    let overlap = 0
    for (const p of other.prerequisites) if (prereqSet.has(p)) overlap++
    if (overlap === 0 && ex.prerequisites.length > 0) continue
    const score = overlap + (other.difficulty === ex.difficulty ? 0.5 : 0)
    scored.push({ ex: other, score })
  }
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    // Stable tiebreak: keep path order
    return SOSE_PATH.indexOf(a.ex) - SOSE_PATH.indexOf(b.ex)
  })
  return scored.slice(0, k).map((s) => s.ex)
}

/**
 * Resolve the "related" list for a problem: explicit override (from
 * coaching) wins, otherwise auto-derive.
 */
export function relatedFor(ex: Exercise, k = 3): Exercise[] {
  const coaching = coachingFor(ex.id)
  if (coaching.relatedIds && coaching.relatedIds.length > 0) {
    const byId = new Map(SOSE_PATH.map((e) => [e.id, e] as const))
    return coaching.relatedIds
      .map((id) => byId.get(id))
      .filter((e): e is Exercise => e !== undefined)
      .slice(0, k)
  }
  return findRelated(ex, k)
}

/**
 * Per-topic exercise totals (denominators for the toolbelt breakdown).
 */
export const TOPIC_TOTALS: Record<Topic, number> = (() => {
  const t: Record<Topic, number> = {
    foundations: 0,
    modulation: 0,
    am: 0,
    fm: 0,
    random: 0,
    noise: 0,
  }
  for (const ex of SOSE_PATH) t[ex.topic]++
  return t
})()

/**
 * Total exam weight in the bank (denominator for "% of exam covered").
 * Some exercises have no `weight` (lecture/ai-generated); they contribute 0.
 */
export const TOTAL_EXAM_WEIGHT: number = SOSE_PATH.reduce(
  (acc, ex) => acc + (ex.weight ?? 0),
  0,
)

export type CoverageStats = {
  /** Number of solved problems in the path. */
  solvedCount: number
  /** Total problems in the path. */
  totalCount: number
  /** Sum of `weight` of solved problems. */
  weightCovered: number
  /** Total `weight` available across the bank. */
  totalWeight: number
  /** `weightCovered / totalWeight`, or 0 when there's no weighted data. */
  weightFraction: number
  /** Per-topic solved counts. */
  perTopic: Record<Topic, number>
}

/**
 * Compute coverage from the set of solved exercise keys
 * (format: `practice:<exerciseId>` — same prefix the library uses).
 */
export function coverageStats(solvedKeys: Set<string>): CoverageStats {
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
  for (const ex of SOSE_PATH) {
    if (!solvedKeys.has(`practice:${ex.id}`)) continue
    solvedCount++
    weightCovered += ex.weight ?? 0
    perTopic[ex.topic]++
  }
  return {
    solvedCount,
    totalCount: SOSE_PATH.length,
    weightCovered,
    totalWeight: TOTAL_EXAM_WEIGHT,
    weightFraction:
      TOTAL_EXAM_WEIGHT === 0 ? 0 : weightCovered / TOTAL_EXAM_WEIGHT,
    perTopic,
  }
}

/**
 * Clamp a 1-indexed position into `[1, SOSE_PATH.length]`. Returns `1`
 * for any non-finite/garbage input.
 */
export function clampPosition(n: number): number {
  if (!Number.isFinite(n)) return 1
  const i = Math.floor(n)
  if (i < 1) return 1
  if (i > SOSE_PATH.length) return SOSE_PATH.length
  return i
}
