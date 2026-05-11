/**
 * «Σώσε το εξάμηνο» — per-exercise coaching content.
 *
 * Each entry attaches two pieces of meta-commentary to an exercise:
 *
 *   - `takeaway` — «Τι κρατάς από αυτή την άσκηση»: the durable pattern,
 *     not the solution. What can the student carry to the next problem?
 *   - `examRadar` — «Πώς θα το αναγνωρίσεις στην εξέταση»: surface signals
 *     in a problem statement that should trigger «αυτό είναι από εκείνα».
 *
 * Authoring rules (must be followed for new entries):
 *
 *   1. NEVER invent theory. The takeaway distills what the existing
 *      solution already shows. The radar names patterns visible in the
 *      problem statement.
 *   2. 2–3 sentences each. Tight. The student is on a deadline.
 *   3. Greek voice, English technical terms (matches site convention).
 *   4. Be specific to THIS problem. Generic advice is noise.
 *
 * Authored entries: see SOSE_COACHING below. Un-authored exercises just
 * skip the takeaway/radar sections — the auto-derived «Παρόμοιες» list
 * still renders, so every problem in crunch mode has at least one extra.
 */

import type { ExerciseCoaching } from './types'

export const SOSE_COACHING: Record<string, ExerciseCoaching> = {
  // Filled in by authoring task. Empty entries are fine — UI degrades gracefully.
}
