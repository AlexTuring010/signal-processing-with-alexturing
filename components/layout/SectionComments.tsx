'use client'

import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import {
  MessageSquarePlus,
  ChevronDown,
  Send,
  LogIn,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { useSectionCommentsCtx } from './section-comments-context'
import { UserAvatar } from './UserAvatar'

type Author = {
  id: string
  display_name: string
  avatar_url: string | null
  role: 'user' | 'moderator'
}

type SectionCommentRow = {
  id: string
  body: string
  created_at: string
  author_id: string
  status: 'pending' | 'resolved'
  author: Author | Author[] | null
}

type Me = {
  id: string
  displayName: string
  avatarUrl: string | null
  isModerator: boolean
}

type Props = {
  /** Heading anchor (id) — used as `comments.section_anchor`. */
  anchor: string
  /** Heading text — saved as `comments.section_title`. */
  sectionTitle: string
}

/**
 * Collapsible inline comment thread tied to a single heading. Lazy-loads
 * its slice from Supabase the first time the user expands it. Renders a
 * compact view (no replies, no moderation actions) — for the full
 * threaded view, scroll to the bottom-of-page <Comments>.
 */
export function SectionComments({ anchor, sectionTitle }: Props) {
  const ctx = useSectionCommentsCtx()
  const supabase = useMemo(() => createClient(), [])
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [comments, setComments] = useState<SectionCommentRow[]>([])
  const [me, setMe] = useState<Me | null | undefined>(undefined)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const slug = ctx?.slug ?? ''
  const pageTitle = ctx?.pageTitle ?? null
  const initialCount = ctx?.counts[anchor] ?? 0
  const displayCount = loaded ? comments.length : initialCount

  const ensureLoaded = useCallback(async () => {
    if (loaded || !slug) return
    const [{ data: rows }, userRes] = await Promise.all([
      supabase
        .from('comments')
        .select(
          'id, body, created_at, author_id, status, author:profiles!comments_author_id_fkey(id, display_name, avatar_url, role)',
        )
        .eq('slug', slug)
        .eq('section_anchor', anchor)
        .order('created_at', { ascending: false }),
      supabase.auth.getUser(),
    ])
    setComments((rows ?? []) as unknown as SectionCommentRow[])
    if (userRes.data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, role')
        .eq('id', userRes.data.user.id)
        .maybeSingle()
      if (profile) {
        setMe({
          id: profile.id,
          displayName: profile.display_name,
          avatarUrl: profile.avatar_url,
          isModerator: profile.role === 'moderator',
        })
      } else {
        setMe(null)
      }
    } else {
      setMe(null)
    }
    setLoaded(true)
  }, [loaded, supabase, slug, anchor])

  if (!ctx) return null

  const toggle = () => {
    if (!open) void ensureLoaded()
    setOpen((v) => !v)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!me) return
    const body = text.trim()
    if (!body) return
    setSubmitting(true)
    setError(null)
    const { data, error: insertError } = await supabase
      .from('comments')
      .insert({
        slug,
        page_title: pageTitle,
        section_title: sectionTitle,
        section_anchor: anchor,
        body,
        author_id: me.id,
      })
      .select(
        'id, body, created_at, author_id, status, author:profiles!comments_author_id_fkey(id, display_name, avatar_url, role)',
      )
      .single()
    setSubmitting(false)
    if (insertError || !data) {
      setError(insertError?.message ?? 'Δεν μπόρεσε να αποθηκευτεί το σχόλιο.')
      return
    }
    setComments((prev) => [data as unknown as SectionCommentRow, ...prev])
    setText('')
  }

  return (
    <div className="-mt-2 mb-6">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-soft px-2 py-1 text-[11px] font-semibold text-fg-subtle transition hover:border-accent/40 hover:text-accent"
      >
        <MessageSquarePlus className="h-3 w-3" aria-hidden />
        {displayCount > 0
          ? `${displayCount} σχόλι${displayCount === 1 ? 'ο' : 'α'}`
          : 'Σχόλιο'}
        <ChevronDown
          className={`h-3 w-3 transition ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <div className="mt-2 rounded-lg border border-border bg-bg-soft/40 p-3">
          {!loaded ? (
            <p className="text-xs italic text-fg-subtle">Φόρτωση…</p>
          ) : (
            <>
              {comments.length === 0 ? (
                <p className="text-xs italic text-fg-subtle">
                  Κανένα σχόλιο σε αυτή την ενότητα ακόμα. Άσε το πρώτο ✨
                </p>
              ) : (
                <ul className="space-y-2">
                  {comments.map((c) => {
                    const author = Array.isArray(c.author) ? c.author[0] : c.author
                    return (
                      <li
                        key={c.id}
                        className="rounded-md border border-border/60 bg-bg p-2.5"
                      >
                        <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px]">
                          <UserAvatar
                            url={author?.avatar_url}
                            name={author?.display_name}
                            size="xs"
                          />
                          <span className="font-semibold text-fg">
                            {author?.display_name ?? '—'}
                          </span>
                          {author?.role === 'moderator' && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 dark:text-purple-300">
                              <ShieldCheck className="h-2.5 w-2.5" aria-hidden />
                              mod
                            </span>
                          )}
                          <span className="ml-auto text-fg-subtle">
                            {new Date(c.created_at).toLocaleDateString(
                              'el-GR',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              },
                            )}
                          </span>
                          {c.status === 'resolved' ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                              <CheckCircle2 className="h-2.5 w-2.5" aria-hidden />
                              Resolved
                            </span>
                          ) : me?.isModerator ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/50 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                              <Clock className="h-2.5 w-2.5" aria-hidden />
                              Προς review
                            </span>
                          ) : null}
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg">
                          {c.body}
                        </p>
                      </li>
                    )
                  })}
                </ul>
              )}

              {me === undefined ? null : me === null ? (
                <Link
                  href="/sign-in"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
                >
                  <LogIn className="h-3 w-3" aria-hidden />
                  Συνδέσου για να σχολιάσεις
                </Link>
              ) : (
                <form onSubmit={handleSubmit} className="mt-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-fg-muted">
                    <UserAvatar
                      url={me.avatarUrl}
                      name={me.displayName}
                      size="xs"
                    />
                    <strong className="text-fg">{me.displayName}</strong>
                  </div>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={`Σχολίασε για «${sectionTitle}» — διόρθωση, διευκρίνηση, tip ή απλά μια παρατήρηση…`}
                    rows={2}
                    className="w-full resize-none rounded-md border border-border bg-bg px-2.5 py-1.5 text-sm outline-none focus:border-accent"
                    maxLength={2000}
                  />
                  {error && (
                    <div className="flex items-start gap-1.5 text-[11px] text-rose-700 dark:text-rose-300">
                      <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
                      <span>{error}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={!text.trim() || submitting}
                      className="inline-flex items-center gap-1.5 rounded-md bg-accent px-2.5 py-1 text-[11px] font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                    >
                      <Send className="h-3 w-3" aria-hidden />
                      {submitting ? 'Αποθήκευση…' : 'Στείλε'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
