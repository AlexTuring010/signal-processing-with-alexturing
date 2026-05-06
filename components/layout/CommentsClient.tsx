'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  MessageSquare,
  CheckCircle2,
  Clock,
  Trash2,
  Send,
  AlertCircle,
  Reply,
  Sparkles,
  ChevronDown,
  Award,
  Tag,
  LogIn,
  ShieldCheck,
  MessageCircleOff,
  EyeOff,
  VenetianMask,
  User as UserIcon,
} from 'lucide-react'

import { UserAvatar } from './UserAvatar'
import { ClaudeAvatar } from './ClaudeAvatar'
import { createClient } from '@/lib/supabase/client'
import {
  ANON_DISPLAY_NAME,
  CATEGORY_DEFAULT_POINTS,
  CATEGORY_LABELS,
  type CommentCategory,
  type CommentWithAuthor,
  type ReplyWithAuthor,
} from '@/lib/supabase/types'
import { anonymizeComments } from '@/lib/supabase/anonymize'

const DELETE_WINDOW_MS = 10 * 60 * 1000

export type Me = {
  id: string
  displayName: string
  avatarUrl: string | null
  isModerator: boolean
}

type Props = {
  slug: string
  pageTitle?: string
  title: string
  initialComments: CommentWithAuthor[]
  me: Me | null
}

export function CommentsClient({
  slug,
  pageTitle,
  title,
  initialComments,
  me,
}: Props) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [comments, setComments] = useState<CommentWithAuthor[]>(initialComments)
  const [text, setText] = useState('')
  const [noReview, setNoReview] = useState(false)
  const [modOnly, setModOnly] = useState(false)
  const [anonymous, setAnonymous] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [moderate, setModerate] = useState(false)

  const viewer = useMemo(
    () => (me ? { id: me.id, isModerator: me.isModerator } : null),
    [me?.id, me?.isModerator],
  )

  // Re-sync if the server-rendered list changes (e.g. after navigation).
  useEffect(() => {
    setComments(initialComments)
  }, [initialComments])

  const refresh = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select(
        `*,
         author:profiles!comments_author_id_fkey(id, display_name, avatar_url, role),
         replies(*, author:profiles!replies_author_id_fkey(id, display_name, avatar_url, role))`,
      )
      .eq('slug', slug)
      .order('created_at', { ascending: false })
      .order('created_at', { foreignTable: 'replies', ascending: true })
    if (data)
      setComments(
        anonymizeComments(data as unknown as CommentWithAuthor[], viewer),
      )
  }, [slug, supabase, viewer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = text.trim()
    if (!body) return
    setSubmitting(true)
    setError(null)
    const payload = {
      slug,
      page_title: pageTitle ?? null,
      section_title: null as string | null,
      section_anchor: null as string | null,
      body,
      author_id: (me?.id ?? null) as string | null,
      status: (noReview ? 'general' : 'pending') as 'general' | 'pending',
      visibility: (modOnly ? 'mod_only' : 'public') as 'mod_only' | 'public',
      // Guests can't be anonymous (no name to hide; RLS forbids it too).
      is_anonymous: !!me && anonymous,
    }
    const { data, error: insertError } = await supabase
      .from('comments')
      .insert(payload as never)
      .select('*')
      .single()
    setSubmitting(false)
    if (insertError || !data) {
      setError(insertError?.message ?? 'Δεν μπόρεσε να αποθηκευτεί το σχόλιο.')
      return
    }
    const optimistic: CommentWithAuthor = {
      ...(data as unknown as CommentWithAuthor),
      author: me
        ? {
            id: me.id,
            display_name: me.displayName,
            avatar_url: me.avatarUrl,
            role: me.isModerator ? 'moderator' : 'user',
          }
        : null,
      replies: [],
    }
    setComments((prev) => [optimistic, ...prev])
    setText('')
    setNoReview(false)
    setModOnly(false)
    setAnonymous(false)
    router.refresh()
  }

  const removeComment = async (id: string) => {
    if (!window.confirm('Διαγραφή σχολίου;')) return
    const { error: delError } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)
    if (delError) {
      setError(delError.message)
      return
    }
    setComments((prev) => prev.filter((c) => c.id !== id))
    router.refresh()
  }

  const toggleStatus = async (c: CommentWithAuthor) => {
    if (!me?.isModerator) return
    const next: 'pending' | 'resolved' =
      c.status === 'resolved' ? 'pending' : 'resolved'
    const { error: updError } = await supabase
      .from('comments')
      .update({ status: next })
      .eq('id', c.id)
    if (updError) {
      setError(updError.message)
      return
    }
    setComments((prev) =>
      prev.map((x) => (x.id === c.id ? { ...x, status: next } : x)),
    )
  }

  const reviewComment = async (
    c: CommentWithAuthor,
    category: CommentCategory,
    points: number,
    reason: string,
  ) => {
    if (!me?.isModerator) return
    const { error: updError } = await supabase
      .from('comments')
      .update({
        category,
        points_awarded: points,
        points_reason: reason || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: me.id,
      })
      .eq('id', c.id)
    if (updError) {
      setError(updError.message)
      return
    }
    await refresh()
  }

  const addReply = async (
    commentId: string,
    replyText: string,
    asClaude: boolean,
    asAnonymous: boolean,
  ) => {
    const trimmed = replyText.trim()
    if (!trimmed) return
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
      .select('*')
      .single()
    if (insertError || !data) {
      setError(insertError?.message ?? 'Δεν μπόρεσε να αποθηκευτεί η απάντηση.')
      return
    }
    const optimistic: ReplyWithAuthor = {
      ...(data as unknown as ReplyWithAuthor),
      author: me
        ? {
            id: me.id,
            display_name: me.displayName,
            avatar_url: me.avatarUrl,
            role: me.isModerator ? 'moderator' : 'user',
          }
        : null,
    }
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, replies: [...c.replies, optimistic] } : c,
      ),
    )
    router.refresh()
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
          ? { ...c, replies: c.replies.filter((r) => r.id !== replyId) }
          : c,
      ),
    )
    router.refresh()
  }

  const pendingCount = comments.filter((c) => c.status === 'pending').length

  return (
    <section className="mt-12 rounded-xl border border-border bg-bg-elevated p-5">
      <header className="mb-3 flex flex-wrap items-center gap-2">
        <MessageSquare className="h-5 w-5 text-accent" aria-hidden />
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {me?.isModerator && pendingCount > 0 && (
          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
            {pendingCount} εκκρεμές{pendingCount === 1 ? '' : 'α'}
          </span>
        )}
        {me?.isModerator && (
          <button
            type="button"
            onClick={() => setModerate((v) => !v)}
            className="ml-auto inline-flex items-center gap-1 rounded-md border border-border bg-bg-soft px-2 py-1 text-[11px] text-fg-muted transition hover:border-accent/40 hover:text-accent"
            title="Toggle review/moderation tools (moderator only)"
          >
            <ShieldCheck className="h-3 w-3" aria-hidden />
            {moderate ? 'Κρύψε review' : 'Review mode'}
          </button>
        )}
      </header>

      <div className="mb-4 rounded-lg border border-accent/30 bg-accent-soft/20 p-3 text-xs leading-relaxed text-fg-muted">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
          <p>
            <strong className="text-fg">Άσε σχόλιο.</strong> Ιδιαίτερα
            χρήσιμα είναι σχόλια που επισημαίνουν λάθη, σημεία που ήταν
            δύσκολα στην κατανόηση, ή προτάσεις για βελτίωση.
          </p>
        </div>
      </div>

      <form id="comments-form" onSubmit={handleSubmit} className="mb-4 space-y-2">
        {me ? (
          <div className="flex items-center gap-2 text-xs text-fg-muted">
            <span>Ως:</span>
            <UserAvatar url={me.avatarUrl} name={me.displayName} size="xs" />
            <strong className="text-fg">{me.displayName}</strong>
            {me.isModerator && (
              <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 dark:text-purple-300">
                <ShieldCheck className="h-2.5 w-2.5" aria-hidden />
                moderator
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-fg-subtle/40 bg-bg-soft px-2 py-0.5 text-[11px] font-medium text-fg-muted">
              Posting ως Επισκέπτης — χωρίς πόντους
            </span>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline"
            >
              <LogIn className="h-3 w-3" aria-hidden />
              Συνδέσου
            </Link>
          </div>
        )}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Γενικό σχόλιο για όλη τη σελίδα — διόρθωση, tip, αναλογία, ή απλά κάτι που σκέφτηκες…"
          rows={3}
          className="w-full resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          maxLength={2000}
        />
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-fg-muted">
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
            Γενικό — χωρίς review
          </label>
          <label
            className="inline-flex items-center gap-1.5"
            title={
              me
                ? 'Μόνο εσύ + οι moderators θα δείτε αυτό το σχόλιο.'
                : 'Μόνο οι moderators θα δουν αυτό το σχόλιο. Μετά την υποβολή δεν θα φαίνεται ούτε σε εσένα (δεν υπάρχει σύνδεση).'
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
            Μόνο για moderators
          </label>
          {me && (
            <label
              className="inline-flex items-center gap-1.5"
              title="Το όνομά σου θα είναι κρυμμένο για τους υπόλοιπους — οι moderators ξέρουν ποιος έγραψε."
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
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-fg-subtle">
            {text.length}/2000 χαρακτήρες
          </span>
          <button
            type="submit"
            disabled={!text.trim() || submitting}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" aria-hidden />
            {submitting ? 'Αποθήκευση…' : 'Υπόβαλε'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-3 flex items-start gap-2 rounded-md border border-rose-500/40 bg-rose-500/5 p-3 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>{error}</span>
        </div>
      )}

      {comments.length === 0 ? (
        <p className="text-sm italic text-fg-subtle">Κανένα σχόλιο ακόμα.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              me={me}
              moderate={moderate && (me?.isModerator ?? false)}
              onToggleStatus={() => toggleStatus(c)}
              onRemove={() => removeComment(c.id)}
              onReply={(t, asClaude, asAnon) =>
                addReply(c.id, t, asClaude, asAnon)
              }
              onRemoveReply={(rid) => removeReply(c.id, rid)}
              onReview={(cat, pts, reason) => reviewComment(c, cat, pts, reason)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

function CommentItem({
  comment,
  me,
  moderate,
  onToggleStatus,
  onRemove,
  onReply,
  onRemoveReply,
  onReview,
}: {
  comment: CommentWithAuthor
  me: Me | null
  moderate: boolean
  onToggleStatus: () => void
  onRemove: () => void
  onReply: (text: string, asClaude: boolean, asAnonymous: boolean) => void
  onRemoveReply: (replyId: string) => void
  onReview: (cat: CommentCategory, points: number, reason: string) => void
}) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replyAsClaude, setReplyAsClaude] = useState(false)
  const [replyAsAnonymous, setReplyAsAnonymous] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [cat, setCat] = useState<CommentCategory>(
    comment.category ?? 'useful-clarification',
  )
  const [pts, setPts] = useState<number>(
    comment.points_awarded || CATEGORY_DEFAULT_POINTS[cat],
  )
  const [reviewReason, setReviewReason] = useState(comment.points_reason ?? '')

  const isAuthor = me?.id === comment.author_id
  const isMod = me?.isModerator ?? false
  const createdMs = new Date(comment.created_at).getTime()
  const canDelete = isMod || (isAuthor && Date.now() - createdMs < DELETE_WINDOW_MS)

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return
    onReply(replyText, replyAsClaude, replyAsAnonymous)
    setReplyText('')
    setReplyOpen(false)
    setReplyAsClaude(false)
    setReplyAsAnonymous(false)
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onReview(cat, pts, reviewReason.trim())
    setReviewOpen(false)
  }

  const isGuest = comment.author_id === null
  const tint =
    comment.status === 'resolved'
      ? 'border-emerald-500/40 bg-emerald-500/5'
      : isGuest
        ? 'border-dashed border-fg-subtle/40 bg-bg-soft/30'
        : isMod
          ? 'border-amber-500/40 bg-amber-500/5'
          : 'border-border bg-bg-soft/40'

  // For anonymous comments shown to mod/author, the joined `author` is the
  // real profile. The flag `comment.is_anonymous` tells us how the public
  // sees it; we still render the real name (so mods know who) but tag it.
  const anonShown = comment.is_anonymous
  const youSuffix = isAuthor && anonShown ? ' (εσύ)' : ''
  const anonSuffix = anonShown && (isMod || isAuthor) ? ' (ανώνυμα)' : ''

  return (
    <li className={`rounded-lg border p-3 transition ${tint}`}>
      <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs">
        {isGuest ? (
          <span
            aria-hidden
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-dashed border-fg-subtle/50 bg-bg-soft text-fg-subtle"
          >
            <UserIcon className="h-3 w-3" aria-hidden />
          </span>
        ) : (
          <UserAvatar
            url={comment.author?.avatar_url}
            name={comment.author?.display_name}
            size="sm"
          />
        )}
        <span className={isGuest ? 'font-medium text-fg-muted' : 'font-semibold text-fg'}>
          {isGuest
            ? 'Επισκέπτης'
            : (comment.author?.display_name ?? '—') + youSuffix + anonSuffix}
        </span>
        {comment.author?.role === 'moderator' && (
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
        {comment.section_title && (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/40 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300">
            ⛬ {comment.section_title}
          </span>
        )}
        <span className="text-fg-subtle">
          {new Date(comment.created_at).toLocaleDateString('el-GR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
        {comment.points_awarded > 0 && (
          <span
            className="inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/10 px-2 py-0.5 text-[11px] font-semibold text-purple-700 dark:text-purple-300"
            title={comment.points_reason ?? undefined}
          >
            <Award className="h-3 w-3" aria-hidden />+{comment.points_awarded}
          </span>
        )}
        {comment.category && (
          <span
            className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-soft px-2 py-0.5 text-[10px] text-fg-muted"
            title={comment.points_reason ?? undefined}
          >
            <Tag className="h-2.5 w-2.5" aria-hidden />
            {CATEGORY_LABELS[comment.category]}
          </span>
        )}
        {isMod ? (
          <button
            type="button"
            onClick={onToggleStatus}
            className={`ml-auto inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold transition ${
              comment.status === 'resolved'
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                : comment.status === 'general'
                  ? 'border-border bg-bg-soft text-fg-muted'
                  : 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300'
            }`}
            title={
              comment.status === 'general'
                ? 'Σημειωμένο ως γενικό σχόλιο. Πάτα για να το κλείσεις ως resolved.'
                : undefined
            }
          >
            {comment.status === 'resolved' ? (
              <>
                <CheckCircle2 className="h-3 w-3" aria-hidden />
                Resolved
              </>
            ) : comment.status === 'general' ? (
              <>
                <MessageCircleOff className="h-3 w-3" aria-hidden />
                Γενικό
              </>
            ) : (
              <>
                <Clock className="h-3 w-3" aria-hidden />
                Προς review
              </>
            )}
          </button>
        ) : comment.status === 'resolved' ? (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-3 w-3" aria-hidden />
            Resolved
          </span>
        ) : null}
        {canDelete && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded p-1 text-fg-subtle transition hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-300"
            aria-label="Διαγραφή"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
          </button>
        )}
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg">
        {comment.body}
      </p>
      {comment.section_anchor && (
        <a
          href={`#${comment.section_anchor}`}
          className="mt-1 inline-block text-[11px] text-fg-subtle hover:text-accent"
        >
          → πήγαινε στην ενότητα
        </a>
      )}

      {comment.replies.length > 0 && (
        <ul className="mt-3 space-y-2 border-l-2 border-border/60 pl-3">
          {comment.replies.map((r) => (
            <ReplyItem
              key={r.id}
              reply={r}
              me={me}
              onRemove={() => onRemoveReply(r.id)}
            />
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setReplyOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-fg-muted hover:text-accent"
        >
          <Reply className="h-3.5 w-3.5" aria-hidden />
          Απάντηση
          <ChevronDown
            className={`h-3.5 w-3.5 transition ${replyOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {moderate && (
          <button
            type="button"
            onClick={() => setReviewOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-purple-700 hover:text-purple-500 dark:text-purple-300"
          >
            <Award className="h-3.5 w-3.5" aria-hidden />
            {comment.reviewed_at ? 'Επανέλεγχος' : 'Review & δώσε πόντους'}
            <ChevronDown
              className={`h-3.5 w-3.5 transition ${reviewOpen ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>

      {replyOpen && (
        <form onSubmit={handleReplySubmit} className="mt-2 space-y-2">
          {me ? (
            <div className="flex flex-wrap gap-2">
              {isMod && (
                <label className="inline-flex items-center gap-1.5 rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-1 text-[11px] font-semibold text-purple-700 dark:text-purple-300">
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
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-soft px-2 py-1 text-[11px] font-medium text-fg-muted"
                title="Το όνομά σου θα είναι κρυμμένο — οι moderators ξέρουν ποιος έγραψε."
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
            <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-fg-subtle/40 bg-bg-soft px-2 py-0.5 text-[11px] font-medium text-fg-muted">
              Reply ως Επισκέπτης
            </span>
          )}
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Γράψε την απάντηση…"
            rows={2}
            className="w-full resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            maxLength={1000}
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setReplyOpen(false)}
              className="text-[12px] text-fg-subtle hover:text-fg"
            >
              Άκυρο
            </button>
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              <Send className="h-3 w-3" aria-hidden />
              Στείλε
            </button>
          </div>
        </form>
      )}

      {reviewOpen && moderate && (
        <form
          onSubmit={handleReviewSubmit}
          className="mt-2 space-y-2 rounded-md border border-purple-500/30 bg-purple-500/5 p-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={cat}
              onChange={(e) => {
                const c = e.target.value as CommentCategory
                setCat(c)
                setPts(CATEGORY_DEFAULT_POINTS[c])
              }}
              className="rounded-md border border-border bg-bg px-2 py-1 text-xs"
            >
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v} (+{CATEGORY_DEFAULT_POINTS[k as CommentCategory]})
                </option>
              ))}
            </select>
            <input
              type="number"
              value={pts}
              onChange={(e) => setPts(parseInt(e.target.value, 10) || 0)}
              className="w-16 rounded-md border border-border bg-bg px-2 py-1 text-xs"
              min={0}
              max={50}
            />
            <span className="text-[11px] text-fg-muted">πόντοι</span>
          </div>
          <input
            type="text"
            value={reviewReason}
            onChange={(e) => setReviewReason(e.target.value)}
            placeholder="Αιτιολογία (π.χ. «Βελτίωσε επεξήγηση time shifting»)"
            className="w-full rounded-md border border-border bg-bg px-2 py-1 text-xs outline-none focus:border-accent"
            maxLength={200}
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setReviewOpen(false)}
              className="text-[11px] text-fg-subtle hover:text-fg"
            >
              Άκυρο
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-md bg-purple-600 px-3 py-1 text-xs font-semibold text-white transition hover:opacity-90"
            >
              <Award className="h-3 w-3" aria-hidden />
              Καταχώρισε review
            </button>
          </div>
        </form>
      )}
    </li>
  )
}

function ReplyItem({
  reply,
  me,
  onRemove,
}: {
  reply: ReplyWithAuthor
  me: Me | null
  onRemove: () => void
}) {
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
      <div className="mb-1 flex items-center gap-2 text-xs">
        {isClaude ? (
          <span className="inline-flex items-center gap-1.5 font-semibold text-purple-700 dark:text-purple-300">
            <ClaudeAvatar />
            Claude
            <span className="rounded-full border border-purple-500/40 bg-purple-500/10 px-1.5 py-0 text-[10px] font-mono text-purple-700 dark:text-purple-300">
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
              url={reply.author?.avatar_url}
              name={reply.author?.display_name}
              size="xs"
            />
            <span className="font-semibold text-fg">
              {(reply.author?.display_name ?? '—') + replySuffix}
            </span>
          </span>
        )}
        {!isClaude && reply.author?.role === 'moderator' && (
          <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 dark:text-purple-300">
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

