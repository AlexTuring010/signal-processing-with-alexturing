/**
 * «Σώσε το εξάμηνο» — per-exercise coaching content.
 *
 * Each entry attaches:
 *   - `takeaway` — «Τι κρατάς από αυτή την άσκηση»: the durable pattern.
 *   - `examRadar` — «Πώς θα το αναγνωρίσεις στην εξέταση».
 *
 * Authoring rules:
 *   1. NEVER invent theory. The takeaway distills what the existing
 *      solution already shows; the radar names patterns visible in the
 *      problem statement.
 *   2. 2–3 sentences each. Tight. The student is on a deadline.
 *   3. Greek voice, English technical terms.
 *   4. Be specific to THIS problem.
 *
 * Status: empty for now. We populate this lecture-by-lecture as we
 * transcribe problems from the original PDFs. The crunch flow still
 * works without coaching — entries are looked up by id and missing
 * ones just skip the takeaway/radar blocks.
 */

import type { ExerciseCoaching } from './types'

export const SOSE_COACHING: Record<string, ExerciseCoaching> = {
  // Empty for now. Add entries like:
  //
  // 'frontistirio-f1': {
  //   takeaway: <>...</>,
  //   examRadar: <>...</>,
  // },
}
