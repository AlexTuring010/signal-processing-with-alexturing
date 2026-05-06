import { createClient } from '@/lib/supabase/server'
import { CommentsClient, type Me } from './CommentsClient'
import type { CommentWithAuthor } from '@/lib/supabase/types'
import { anonymizeComments } from '@/lib/supabase/anonymize'

type Props = {
  slug: string
  /** Page title saved with each new comment (helps when reviewing later). */
  pageTitle?: string
  title?: string
}

/**
 * Section-aware comments thread, backed by Supabase.
 *
 * - Public read (visitors see all comments without signing in).
 * - Posting requires sign-in (`/sign-in`).
 * - Authors can delete their own comment within 10 min; moderators always.
 * - Moderation actions (status / category / points / Claude replies) are
 *   gated to `profiles.role = 'moderator'` both client-side and via RLS.
 *
 * See plans/COMMENTS_LOOP.md for the review workflow.
 */
export async function Comments({
  slug,
  pageTitle,
  title = 'Σχόλια',
}: Props) {
  const supabase = await createClient()

  const [{ data: comments }, { data: { user } }] = await Promise.all([
    supabase
      .from('comments')
      .select(
        `*,
         author:profiles!comments_author_id_fkey(id, display_name, avatar_url, role),
         replies(*, author:profiles!replies_author_id_fkey(id, display_name, avatar_url, role))`,
      )
      .eq('slug', slug)
      .order('created_at', { ascending: false })
      .order('created_at', { foreignTable: 'replies', ascending: true }),
    supabase.auth.getUser(),
  ])

  let me: Me | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url, role')
      .eq('id', user.id)
      .maybeSingle()
    if (profile) {
      me = {
        id: profile.id,
        displayName: profile.display_name,
        avatarUrl: profile.avatar_url,
        isModerator: profile.role === 'moderator',
      }
    }
  }

  const initialComments = anonymizeComments(
    (comments ?? []) as unknown as CommentWithAuthor[],
    me ? { id: me.id, isModerator: me.isModerator } : null,
  )

  return (
    <CommentsClient
      slug={slug}
      pageTitle={pageTitle}
      title={title}
      initialComments={initialComments}
      me={me}
    />
  )
}
