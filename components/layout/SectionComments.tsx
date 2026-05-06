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
  Reply,
  Sparkles,
  Trash2,
  MessageCircleOff,
  EyeOff,
  VenetianMask,
  User as UserIcon,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { useSectionCommentsCtx } from './section-comments-context'
import { UserAvatar } from './UserAvatar'
import { ClaudeAvatar } from './ClaudeAvatar'
import { ANON_DISPLAY_NAME } from '@/lib/supabase/types'

const DELETE_WINDOW_MS = 10 * 60 * 1000

type Author = {
  id: string
  display_name: string
  avatar_url: string | null
  role: 'user' | 'moderator'
}

type ReplyRow = {
  id: string
  body: string
  created_at: string
  author_id: string
  is_claude_reply: boolean
  is_anonymous: boolean
  author: Author | Author[] | null
}

type SectionCommentRow = {
  id: string
  body: string
  created_at: string
  author_id: string
  status: 'pending' | 'resolved' | 'general'
  visibility: 'public' | 'mod_only'
  is_anonymous: boolean
  author: Author | Author[] | null
  replies: ReplyRow[]
}

type Me = {
  id: string
  displayName: string
  avatarUrl: string | null
  isModerator: boolean
}

const COMMENT_SELECT =
  'id, body, created_at, author_id, status, visibility, is_anonymous, author:profiles!comments_author_id_fkey(id, display_name, avatar_url, role), replies(id, body, created_at, author_id, is_claude_reply, is_anonymous, author:profiles!replies_author_id_fkey(id, display_name, avatar_url, role))'

const REPLY_SELECT =
  'id, body, created_at, author_id, is_claude_reply, is_anonymous, author:profiles!replies_author_id_fkey(id, display_name, avatar_url, role)'

const ANON_AUTHOR: Author = {
  id: '',
  display_name: ANON_DISPLAY_NAME,
  avatar_url: null,
  role: 'user',
}

function stripAuthor<T extends { author: Author | Author[] | null }>(
  row: T,
  isAnonymous: boolean,
  authorId: string,
  viewer: Me | null,
): T {
  if (!isAnonymous) return row
  if (viewer && (viewer.isModerator || viewer.id === authorId)) return row
  return { ...row, author: ANON_AUTHOR }
}

function anonymize(rows: SectionCommentRow[], viewer: Me | null): SectionCommentRow[] {
  return rows.map((c) => {
    const replies = c.replies.map((r) =>
      stripAuthor(r, r.is_anonymous, r.author_id, viewer),
    )
    const stripped = stripAuthor(c, c.is_anonymous, c.author_id, viewer)
    return { ...stripped, replies }
  })
}

type Props = {
  /** Heading anchor (id) — used as `comments.section_anchor`. */
  anchor: string
  /** Heading text — saved as `comments.section_title`. */
  sectionTitle: string
  /** Outer wrapper class. Defaults to MDX-heading-aware spacing. */
  className?: string
  /** Label override for the toggle button when no comments exist. */
  emptyLabel?: string
}

/**
 * Collapsible inline comment thread tied to a single anchor (heading or
 * exercise id). Lazy-loads its slice from Supabase the first time the
 * user expands it. Supports posting top-level comments and replies; full
 * moderation (status, points, reviews) still happens at the bottom-of-
 * page <Comments> view.
 */
export function SectionComments({
  anchor,
  sectionTitle,
  className,
  emptyLabel,
}: Props) {
  const ctx = useSectionCommentsCtx()
  const supabase = useMemo(() => createClient(), [])
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [comments, setComments] = useState<SectionCommentRow[]>([])
  const [me, setMe] = useState<Me | null | undefined>(undefined)
  const [text, setText] = useState('')
  const [noReview, setNoReview] = useState(false)
  const [modOnly, setModOnly] = useState(false)
  const [anonymous, setAnonymous] = useState(false)
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
        .select(COMMENT_SELECT)
        .eq('slug', slug)
        .eq('section_anchor', anchor)
        .order('created_at', { ascending: false })
        .order('created_at', { foreignTable: 'replies', ascending: true }),
      supabase.auth.getUser(),
    ])
    let viewer: Me | null = null
    if (userRes.data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, role')
        .eq('id', userRes.data.user.id)
        .maybeSingle()
      if (profile) {
        viewer = {
          id: profile.id,
          displayName: profile.display_name,
          avatarUrl: profile.avatar_url,
          isModerator: profile.role === 'moderator',
        }
      }
    }
    setMe(viewer)
    setComments(
      anonymize((rows ?? []) as unknown as SectionCommentRow[], viewer),
    )
    setLoaded(true)
  }, [loaded, supabase, slug, anchor])

  if (!ctx) return null

  const toggle = () => {
    if (!open) void ensureLoaded()
    setOpen((v) => !v)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = text.trim()
    if (!body) return
    setSubmitting(true)
    setError(null)
    const payload = {
      slug,
      page_title: pageTitle,
      section_title: sectionTitle,
      section_anchor: anchor,
      body,
      author_id: (me?.id ?? null) as string | null,
      status: (noReview ? 'general' : 'pending') as 'general' | 'pending',
      visibility: (modOnly ? 'mod_only' : 'public') as 'mod_only' | 'public',
      // Guests can't be anonymous (RLS forbids; no name to hide anyway).
      is_anonymous: !!me && anonymous,
    }
    const { data, error: insertError } = await supabase
      .from('comments')
      .insert(payload as never)
      .select(COMMENT_SELECT)
      .single()
    setSubmitting(false)
    if (insertError || !data) {
      setError(insertError?.message ?? 'Δεν μπόρεσε να αποθηκευτεί το σχόλιο.')
      return
    }
    // Author is either `me` (no anonymization for self) or null (guest;
    // not anonymizable). Either way, insert the row as returned.
    setComments((prev) => [data as unknown as SectionCommentRow, ...prev])
    setText('')
    setNoReview(false)
    setModOnly(false)
    setAnonymous(false)
  }

  const addReply = async (
    commentId: string,
    replyText: string,
    asClaude: boolean,
    asAnonymous: boolean,
  ): Promise<boolean> => {
    const trimmed = replyText.trim()
    if (!trimmed) return false
    const isClaude = !!me && asClaude && me.isModerator
    const payload = {
      comment_id: commentId,
      body: trimmed,
      author_id: (me?.id ?? null) as string | null,
      is_claude_reply: isClaude,
      is_anonymous: !!me && asAnonymous && !isClaude,
    }
    const { data, error: insertError } = await supabase
      .from('replies')
      .insert(payload as never)
      .select(REPLY_SELECT)
      .single()
    if (insertError || !data) {
      setError(insertError?.message ?? 'Δεν μπόρεσε να αποθηκευτεί η απάντηση.')
      return false
    }
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [...(c.replies ?? []), data as unknown as ReplyRow],
            }
          : c,
      ),
    )
    return true
  }

  const removeComment = async (commentId: string) => {
    if (!window.confirm('Διαγραφή σχολίου;')) return
    const { error: delError } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
    if (delError) {
      setError(delError.message)
      return
    }
    setComments((prev) => prev.filter((c) => c.id !== commentId))
  }

  const removeReply = async (commentId: string, replyId: string) => {
    if (!window.confirm('Διαγραφή απάντησης;')) return
    const { error: delError } = await supabase
      .from('replies')
      .delete()
      .eq('id', replyId)
    if (delError) {
      setError(delError.message)
      return
    }
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: (c.replies ?? []).filter((r) => r.id !== replyId),
            }
          : c,
      ),
    )
  }

  const wrapperClass = className ?? '-mt-2 mb-6'

  return (
    <div className={wrapperClass}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-soft px-2 py-1 text-[11px] font-semibold text-fg-subtle transition hover:border-accent/40 hover:text-accent"
      >
        <MessageSquarePlus className="h-3 w-3" aria-hidden />
        {displayCount > 0
          ? `${displayCount} σχόλι${displayCount === 1 ? 'ο' : 'α'}`
          : (emptyLabel ?? 'Σχόλιο')}
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
                  {comments.map((c) => (
                    <SectionCommentItem
                      key={c.id}
                      comment={c}
                      me={me ?? null}
                      onReply={(t, asClaude, asAnon) =>
                        addReply(c.id, t, asClaude, asAnon)
                      }
                      onRemoveReply={(rid) => removeReply(c.id, rid)}
                      onRemove={() => removeComment(c.id)}
                    />
                  ))}
                </ul>
              )}

              {error && (
                <div className="mt-2 flex items-start gap-1.5 text-[11px] text-rose-700 dark:text-rose-300">
                  <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
                  <span>{error}</span>
                </div>
              )}

              {me === undefined ? null : (
                <form onSubmit={handleSubmit} className="mt-3 space-y-2">
                  {me ? (
                    <div className="flex items-center gap-1.5 text-[11px] text-fg-muted">
                      <UserAvatar
                        url={me.avatarUrl}
                        name={me.displayName}
                        size="xs"
                      />
                      <strong className="text-fg">{me.displayName}</strong>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-fg-subtle/40 bg-bg-soft px-2 py-0.5 text-[10px] font-medium text-fg-muted">
                        Posting ως Επισκέπτης
                      </span>
                      <Link
                        href="/sign-in"
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent hover:underline"
                      >
                        <LogIn className="h-2.5 w-2.5" aria-hidden />
                        Συνδέσου
                      </Link>
                    </div>
                  )}
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={`Σχολίασε για «${sectionTitle}» — διόρθωση, διευκρίνηση, tip ή απλά μια παρατήρηση…`}
                    rows={2}
                    className="w-full resize-none rounded-md border border-border bg-bg px-2.5 py-1.5 text-sm outline-none focus:border-accent"
                    maxLength={2000}
                  />
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-fg-muted">
                    <label
                      className="inline-flex items-center gap-1.5"
                      title="Markαρε αν είναι απλά μια παρατήρηση/συζήτηση και δε χρειάζεται να μπει στην ουρά review."
                    >
                      <input
                        type="checkbox"
                        checked={noReview}
                        onChange={(e) => {
                          setNoReview(e.target.checked)
                          if (e.target.checked) setModOnly(false)
                        }}
                        disabled={modOnly}
                        className="h-3 w-3 disabled:opacity-50"
                      />
                      <MessageCircleOff className="h-3 w-3" aria-hidden />
                      Γενικό
                    </label>
                    <label
                      className="inline-flex items-center gap-1.5"
                      title={
                        me
                          ? 'Μόνο εσύ + οι moderators θα δείτε αυτό το σχόλιο.'
                          : 'Μόνο οι moderators θα δουν αυτό το σχόλιο. Δεν θα φαίνεται ούτε σε εσένα μετά (δεν υπάρχει σύνδεση).'
                      }
                    >
                      <input
                        type="checkbox"
                        checked={modOnly}
                        onChange={(e) => {
                          setModOnly(e.target.checked)
                          if (e.target.checked) setNoReview(false)
                        }}
                        disabled={noReview}
                        className="h-3 w-3 disabled:opacity-50"
                      />
                      <EyeOff className="h-3 w-3" aria-hidden />
                      Mod-only
                    </label>
                    {me && (
                      <label
                        className="inline-flex items-center gap-1.5"
                        title="Το όνομά σου θα είναι κρυμμένο για τους υπόλοιπους."
                      >
                        <input
                          type="checkbox"
                          checked={anonymous}
                          onChange={(e) => setAnonymous(e.target.checked)}
                          className="h-3 w-3"
                        />
                        <VenetianMask className="h-3 w-3" aria-hidden />
                        Ανώνυμα
                      </label>
                    )}
                    <button
                      type="submit"
                      disabled={!text.trim() || submitting}
                      className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-accent px-2.5 py-1 text-[11px] font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
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

function SectionCommentItem({
  comment,
  me,
  onReply,
  onRemoveReply,
  onRemove,
}: {
  comment: SectionCommentRow
  me: Me | null
  onReply: (
    text: string,
    asClaude: boolean,
    asAnonymous: boolean,
  ) => Promise<boolean>
  onRemoveReply: (replyId: string) => void
  onRemove: () => void
}) {
  const author = Array.isArray(comment.author) ? comment.author[0] : comment.author
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replyAsClaude, setReplyAsClaude] = useState(false)
  const [replyAsAnonymous, setReplyAsAnonymous] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const isMod = me?.isModerator ?? false
  const isGuest = comment.author_id === null
  const isAuthor = !isGuest && me?.id === comment.author_id
  const createdMs = new Date(comment.created_at).getTime()
  const canDelete = isMod || (isAuthor && Date.now() - createdMs < DELETE_WINDOW_MS)
  const anonShown = comment.is_anonymous
  const nameSuffix =
    (isAuthor && anonShown ? ' (εσύ)' : '') +
    (anonShown && (isMod || isAuthor) ? ' (ανώνυμα)' : '')

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return
    setSubmitting(true)
    const ok = await onReply(replyText, replyAsClaude, replyAsAnonymous)
    setSubmitting(false)
    if (ok) {
      setReplyText('')
      setReplyOpen(false)
      setReplyAsClaude(false)
      setReplyAsAnonymous(false)
    }
  }

  return (
    <li
      className={`rounded-md p-2.5 ${
        isGuest
          ? 'border border-dashed border-fg-subtle/40 bg-bg-soft/30'
          : 'border border-border/60 bg-bg'
      }`}
    >
      <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px]">
        {isGuest ? (
          <span
            aria-hidden
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-dashed border-fg-subtle/50 bg-bg-soft text-fg-subtle"
          >
            <UserIcon className="h-2.5 w-2.5" aria-hidden />
          </span>
        ) : (
          <UserAvatar
            url={author?.avatar_url}
            name={author?.display_name}
            size="xs"
          />
        )}
        <span
          className={
            isGuest ? 'font-medium text-fg-muted' : 'font-semibold text-fg'
          }
        >
          {isGuest ? 'Επισκέπτης' : (author?.display_name ?? '—') + nameSuffix}
        </span>
        {author?.role === 'moderator' && (
          <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 dark:text-purple-300">
            <ShieldCheck className="h-2.5 w-2.5" aria-hidden />
            mod
          </span>
        )}
        {comment.visibility === 'mod_only' && (
          <span
            className="inline-flex items-center gap-1 rounded-full border border-blue-500/40 bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300"
            title="Ορατό μόνο σε εσένα + στους moderators."
          >
            <EyeOff className="h-2.5 w-2.5" aria-hidden />
            mod-only
          </span>
        )}
        <span className="ml-auto text-fg-subtle">
          {new Date(comment.created_at).toLocaleDateString('el-GR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
        {comment.status === 'resolved' ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-2.5 w-2.5" aria-hidden />
            Resolved
          </span>
        ) : isMod && comment.status === 'general' ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-soft px-1.5 py-0.5 text-[10px] font-semibold text-fg-muted">
            <MessageCircleOff className="h-2.5 w-2.5" aria-hidden />
            Γενικό
          </span>
        ) : isMod ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/50 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
            <Clock className="h-2.5 w-2.5" aria-hidden />
            Προς review
          </span>
        ) : null}
        {canDelete && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded p-0.5 text-fg-subtle transition hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-300"
            aria-label="Διαγραφή σχολίου"
            title="Διαγραφή σχολίου"
          >
            <Trash2 className="h-3 w-3" aria-hidden />
          </button>
        )}
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg">
        {comment.body}
      </p>

      {comment.replies && comment.replies.length > 0 && (
        <ul className="mt-2 space-y-1.5 border-l-2 border-border/60 pl-2.5">
          {comment.replies.map((r) => (
            <SectionReplyItem
              key={r.id}
              reply={r}
              me={me}
              onRemove={() => onRemoveReply(r.id)}
            />
          ))}
        </ul>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setReplyOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-fg-muted hover:text-accent"
        >
          <Reply className="h-3 w-3" aria-hidden />
          Απάντηση
          <ChevronDown
            className={`h-3 w-3 transition ${replyOpen ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
      </div>

      {replyOpen && (
        <form onSubmit={handleReplySubmit} className="mt-2 space-y-1.5">
          {me ? (
            <div className="flex flex-wrap gap-2">
              {isMod && (
                <label className="inline-flex items-center gap-1.5 rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-1 text-[10px] font-semibold text-purple-700 dark:text-purple-300">
                  <input
                    type="checkbox"
                    checked={replyAsClaude}
                    onChange={(e) => {
                      setReplyAsClaude(e.target.checked)
                      if (e.target.checked) setReplyAsAnonymous(false)
                    }}
                    className="h-3 w-3"
                  />
                  <Sparkles className="h-3 w-3" aria-hidden />
                  Reply ως Claude
                </label>
              )}
              <label
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-soft px-2 py-1 text-[10px] font-medium text-fg-muted"
                title="Το όνομά σου θα είναι κρυμμένο για τους υπόλοιπους."
              >
                <input
                  type="checkbox"
                  checked={replyAsAnonymous}
                  onChange={(e) => setReplyAsAnonymous(e.target.checked)}
                  disabled={replyAsClaude}
                  className="h-3 w-3 disabled:opacity-50"
                />
                <VenetianMask className="h-3 w-3" aria-hidden />
                Ανώνυμα
              </label>
            </div>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-fg-subtle/40 bg-bg-soft px-2 py-0.5 text-[10px] font-medium text-fg-muted">
              Reply ως Επισκέπτης
            </span>
          )}
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Γράψε την απάντηση…"
            rows={2}
            className="w-full resize-none rounded-md border border-border bg-bg px-2 py-1.5 text-sm outline-none focus:border-accent"
            maxLength={1000}
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setReplyOpen(false)}
              className="text-[11px] text-fg-subtle hover:text-fg"
            >
              Άκυρο
            </button>
            <button
              type="submit"
              disabled={!replyText.trim() || submitting}
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-2.5 py-1 text-[11px] font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              <Send className="h-3 w-3" aria-hidden />
              {submitting ? 'Αποθήκευση…' : 'Στείλε'}
            </button>
          </div>
        </form>
      )}
    </li>
  )
}

function SectionReplyItem({
  reply,
  me,
  onRemove,
}: {
  reply: ReplyRow
  me: Me | null
  onRemove: () => void
}) {
  const author = Array.isArray(reply.author) ? reply.author[0] : reply.author
  const isClaude = reply.is_claude_reply
  const isGuest = !isClaude && reply.author_id === null
  const isAuthor = me?.id !== undefined && me?.id === reply.author_id
  const isMod = me?.isModerator ?? false
  const createdMs = new Date(reply.created_at).getTime()
  const canDelete = isMod || (isAuthor && Date.now() - createdMs < DELETE_WINDOW_MS)
  const anonShown = reply.is_anonymous
  const replySuffix =
    (isAuthor && anonShown ? ' (εσύ)' : '') +
    (anonShown && (isMod || isAuthor) ? ' (ανώνυμα)' : '')

  return (
    <li
      className={`rounded-md p-2 ${
        isClaude
          ? 'border border-purple-500/30 bg-purple-500/5'
          : isGuest
            ? 'border border-dashed border-fg-subtle/40 bg-bg-soft/40'
            : 'bg-bg-soft/60'
      }`}
    >
      <div className="mb-1 flex items-center gap-1.5 text-[11px]">
        {isClaude ? (
          <span className="inline-flex items-center gap-1.5 font-semibold text-purple-700 dark:text-purple-300">
            <ClaudeAvatar size="xs" />
            Claude
            <span className="rounded-full border border-purple-500/40 bg-purple-500/10 px-1.5 py-0 text-[9px] font-mono text-purple-700 dark:text-purple-300">
              AI
            </span>
          </span>
        ) : isGuest ? (
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-dashed border-fg-subtle/50 bg-bg-soft text-fg-subtle"
            >
              <UserIcon className="h-2.5 w-2.5" aria-hidden />
            </span>
            <span className="font-medium text-fg-muted">Επισκέπτης</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5">
            <UserAvatar
              url={author?.avatar_url}
              name={author?.display_name}
              size="xs"
            />
            <span className="font-semibold text-fg">
              {(author?.display_name ?? '—') + replySuffix}
            </span>
          </span>
        )}
        {!isClaude && author?.role === 'moderator' && (
          <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-purple-700 dark:text-purple-300">
            <ShieldCheck className="h-2.5 w-2.5" aria-hidden />
            mod
          </span>
        )}
        <span className="text-fg-subtle">
          {new Date(reply.created_at).toLocaleDateString('el-GR', {
            day: '2-digit',
            month: 'short',
          })}
        </span>
        {canDelete && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-auto rounded p-0.5 text-fg-subtle transition hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-300"
            aria-label="Διαγραφή"
          >
            <Trash2 className="h-3 w-3" aria-hidden />
          </button>
        )}
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg">
        {reply.body}
      </p>
    </li>
  )
}
