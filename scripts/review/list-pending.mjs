// Print the pending-comment queue as JSON.
//
// Usage:  npm run comments:list
//
// Output is a JSON array of comments, oldest first, each with author,
// page/section context, current status, and any existing replies.
// Comments with status='general' are excluded — those are explicit
// opt-outs by the author.

import { supabase } from './_client.mjs'

const { data, error } = await supabase
  .from('comments')
  .select(
    `id, slug, page_title, section_title, section_anchor,
     body, status, visibility, is_anonymous, created_at,
     author:profiles!comments_author_id_fkey(id, display_name),
     replies(id, body, is_claude_reply, is_anonymous, created_at,
             author:profiles!replies_author_id_fkey(display_name))`,
  )
  .eq('status', 'pending')
  .order('created_at', { ascending: true })

if (error) {
  console.error('Error fetching pending comments:', error.message)
  process.exit(1)
}

console.log(JSON.stringify(data ?? [], null, 2))
console.error(`\n${(data ?? []).length} pending comment(s).`)
