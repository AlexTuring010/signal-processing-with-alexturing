// Post a Claude-authored reply to a comment.
//
// Usage:  npm run comments:reply -- <commentId> "<reply body>"
//
// Inserts into public.replies with:
//   author_id        = the moderator profile id
//   is_claude_reply  = true   (so the UI shows the Claude avatar)
//
// Service role bypasses RLS, so the moderator-only Claude-reply policy
// is satisfied implicitly.

import { supabase, getModeratorId } from './_client.mjs'

const [, , commentId, body] = process.argv

if (!commentId || !body) {
  console.error('Usage: npm run comments:reply -- <commentId> "<reply body>"')
  process.exit(1)
}

const trimmed = body.trim()
if (!trimmed) {
  console.error('Reply body is empty.')
  process.exit(1)
}
if (trimmed.length > 1000) {
  console.error(`Reply body is ${trimmed.length} chars; max is 1000.`)
  process.exit(1)
}

const moderatorId = await getModeratorId()

const { data, error } = await supabase
  .from('replies')
  .insert({
    comment_id: commentId,
    body: trimmed,
    author_id: moderatorId,
    is_claude_reply: true,
  })
  .select('id, comment_id, created_at')
  .single()

if (error) {
  console.error('Error posting reply:', error.message)
  process.exit(1)
}

console.log(JSON.stringify({ ok: true, reply: data }, null, 2))
