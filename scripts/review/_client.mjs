// Service-role Supabase client for the review CLI.
//
// IMPORTANT: this script bypasses RLS. Never import it from any code that
// runs in the browser or in a Next.js Server Component / Route Handler.
// It's CLI-only, invoked via the npm scripts in package.json.
//
// Required env (loaded by `node --env-file=.env.local`):
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY    (Project Settings → API → service_role)

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL. Did you forget --env-file=.env.local?',
  )
  process.exit(1)
}
if (!key) {
  console.error(
    'Missing SUPABASE_SERVICE_ROLE_KEY in .env.local. Grab it from Supabase dashboard → Project Settings → API.',
  )
  process.exit(1)
}

export const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})

let cachedModeratorId = null

/**
 * Returns the profile id of a moderator. Picks the first profile with
 * role='moderator' — fine while there's only one mod (the site owner).
 * Replies inserted via the CLI use this id as `author_id`; the UI shows
 * the Claude avatar instead because we set `is_claude_reply=true`.
 */
export async function getModeratorId() {
  if (cachedModeratorId) return cachedModeratorId
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name')
    .eq('role', 'moderator')
    .limit(1)
    .maybeSingle()
  if (error) {
    throw new Error(`Could not query profiles: ${error.message}`)
  }
  if (!data) {
    throw new Error(
      "No moderator profile found. Promote yourself first via the SQL in plans/COMMENTS_LOOP.md.",
    )
  }
  cachedModeratorId = data.id
  return cachedModeratorId
}
