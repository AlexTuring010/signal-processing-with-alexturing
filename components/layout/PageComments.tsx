'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CommentsClient, type Me } from './CommentsClient'
import { findSection } from '@/lib/content-index'
import type { CommentWithAuthor } from '@/lib/supabase/types'

/**
 * Bottom-of-page comments block, auto-mounted on every content page via
 * the (content) layout.
 *
 * Client component on purpose: the (content) layout is reused across
 * navigations between sibling pages, so a server-rendered version would
 * stay pinned to whichever slug was first rendered. Reading pathname
 * client-side guarantees we re-fetch on every navigation.
 */
export function PageComments() {
  const pathname = usePathname()
  const slug = pathname.replace(/^\/+/, '').replace(/\/$/, '')
  const supabase = useMemo(() => createClient(), [])
  const [data, setData] = useState<{
    comments: CommentWithAuthor[]
    me: Me | null
  } | null>(null)
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setData(null)
    setLoadedSlug(null)
    ;(async () => {
      const [{ data: comments }, userRes] = await Promise.all([
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
      if (userRes.data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, display_name, avatar_url, role')
          .eq('id', userRes.data.user.id)
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

      if (cancelled) return
      setData({
        comments: (comments ?? []) as unknown as CommentWithAuthor[],
        me,
      })
      setLoadedSlug(slug)
    })()
    return () => {
      cancelled = true
    }
  }, [slug, supabase])

  if (!slug) return null
  if (!data || loadedSlug !== slug) {
    return (
      <div className="mt-12 rounded-xl border border-border bg-bg-elevated p-5 text-center text-sm text-fg-muted">
        Φόρτωση σχολίων…
      </div>
    )
  }

  const section = findSection(slug)
  return (
    <CommentsClient
      slug={slug}
      pageTitle={section?.title}
      title="Σχόλια για αυτή τη σελίδα"
      initialComments={data.comments}
      me={data.me}
    />
  )
}
