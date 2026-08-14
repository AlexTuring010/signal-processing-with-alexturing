import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SoseClient } from '@/components/sose/SoseClient'
import {
  FormulaSheetPanel,
  FormulaSheetButton,
} from '@/components/practice/FormulaSheetPanel'
import {
  SOSE_PATH,
  TOTAL_EXAM_WEIGHT,
  TOPIC_TOTALS,
  EXAM_SESSIONS,
} from '@/lib/sose'
import { coachingFor, relatedFor, positionOf } from '@/lib/sose'

export const metadata: Metadata = {
  title: 'Σώσε το εξάμηνο — last-minute exam survival',
  description: `Just-in-time learning. Ξεκίνα από την πιο εύκολη άσκηση και διάβασε μόνο τη θεωρία που χρειάζεσαι όταν τη χρειάζεσαι. ${SOSE_PATH.length} ασκήσεις σε σειρά από εύκολη θεωρία προς δύσκολη.`,
}

/**
 * The «Σώσε το εξάμηνο» (crunch / exam-survival) flow.
 *
 * Server component — pre-computes the whole path payload so the client
 * doesn't have to re-derive ordering / related lists / coaching on every
 * render. The client then handles position state, keyboard nav, and the
 * solved-state subscription.
 */
export default function SoseToEksaminoPage() {
  // Pre-compute the per-problem payload once at build/request time so the
  // client doesn't need to import the whole SOSE_PATH machinery.
  const problems = SOSE_PATH.map((ex, i) => ({
    position: i + 1,
    exercise: ex,
    coaching: coachingFor(ex.id),
    related: relatedFor(ex).map((r) => ({
      id: r.id,
      title: r.title,
      position: positionOf(r.id) ?? 0,
      topic: r.topic,
      difficulty: r.difficulty,
    })),
  }))

  return (
    <>
      <FormulaSheetPanel />
      <FormulaSheetButton />
      <Suspense fallback={null}>
        <SoseClient
          problems={problems}
          totalExamWeight={TOTAL_EXAM_WEIGHT}
          topicTotals={TOPIC_TOTALS}
          sessions={EXAM_SESSIONS}
        />
      </Suspense>
    </>
  )
}
