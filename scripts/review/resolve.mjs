// Mark a comment resolved + record the review category and points.
//
// Usage:
//   npm run comments:resolve -- <commentId> <category> <points> [reason]
//
// Examples:
//   npm run comments:resolve -- 4f3a… valid-correction 8 "Διόρθωσε λάθος στο step 4 της απόδειξης"
//   npm run comments:resolve -- 4f3a… duplicate 1 "Ήδη απαντημένο στην ενότητα X"
//   npm run comments:resolve -- 4f3a… appreciation 0
//
// Valid categories (see lib/supabase/types.ts):
//   valid-correction (8), useful-clarification (5), helpful-suggestion (5),
//   tip (5), appreciation (0), common-misconception (3),
//   wrong-but-helpful (1), duplicate (1), unclear (0), low-effort (0), spam (0)

import { supabase, getModeratorId } from './_client.mjs'

const VALID_CATEGORIES = new Set([
  'valid-correction',
  'useful-clarification',
  'helpful-suggestion',
  'tip',
  'appreciation',
  'common-misconception',
  'wrong-but-helpful',
  'duplicate',
  'unclear',
  'low-effort',
  'spam',
])

const [, , commentId, category, pointsStr, reason] = process.argv

if (!commentId || !category || pointsStr === undefined) {
  console.error(
    'Usage: npm run comments:resolve -- <commentId> <category> <points> [reason]',
  )
  process.exit(1)
}

if (!VALID_CATEGORIES.has(category)) {
  console.error(
    `Unknown category "${category}". Valid: ${[...VALID_CATEGORIES].join(', ')}`,
  )
  process.exit(1)
}

const points = parseInt(pointsStr, 10)
if (Number.isNaN(points) || points < 0 || points > 50) {
  console.error('Points must be an integer in [0, 50].')
  process.exit(1)
}

const moderatorId = await getModeratorId()

const { data, error } = await supabase
  .from('comments')
  .update({
    status: 'resolved',
    category,
    points_awarded: points,
    points_reason: reason ?? null,
    reviewed_at: new Date().toISOString(),
    reviewed_by: moderatorId,
  })
  .eq('id', commentId)
  .select('id, status, category, points_awarded, points_reason')
  .single()

if (error) {
  console.error('Error resolving comment:', error.message)
  process.exit(1)
}

console.log(JSON.stringify({ ok: true, comment: data }, null, 2))
