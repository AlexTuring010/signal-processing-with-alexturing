'use client'

import { useEffect, useMemo, useState } from 'react'
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
  X,
  Tag,
} from 'lucide-react'

/**
 * localStorage-only comments + replies + section context + review/points.
 *
 * Storage shape:
 *   spwa:comments:{slug} → Comment[]
 *
 * Section-aware: a comment can be attached to a specific section heading
 * via {sectionTitle, sectionAnchor}. Set when the user clicks the
 * `<SectionCommentButton>` next to a heading.
 *
 * Gamification rules:
 *   - Posting a comment awards NO points by default.
 *   - Points are awarded only after review. The reviewer (AlexTuring or
 *     Claude via the comments-loop) classifies the comment with a
 *     `category` and the resulting `pointsAwarded` + `pointsReason` are
 *     stored. The Leaderboard reads these to rank contributors.
 *
 * See plans/COMMENTS_LOOP.md for the full review workflow.
 */

import { useCommentTarget } from './comment-target-store'

const STORAGE_PREFIX = 'spwa:comments:'
const PROFILE_KEY = 'spwa:profile-name'
const CLAUDE_AUTHOR = 'Claude'

export type CommentStatus = 'pending' | 'resolved'

export type CommentCategory =
  | 'valid-correction'
  | 'useful-clarification'
  | 'helpful-suggestion'
  | 'common-misconception'
  | 'wrong-but-helpful'
  | 'duplicate'
  | 'unclear'
  | 'low-effort'
  | 'spam'

export const CATEGORY_LABELS: Record<CommentCategory, string> = {
  'valid-correction': 'Έγκυρη διόρθωση',
  'useful-clarification': 'Ζητάει χρήσιμη διευκρίνηση',
  'helpful-suggestion': 'Καλή πρόταση',
  'common-misconception': 'Συχνή παρανόηση',
  'wrong-but-helpful': 'Λάθος αλλά αποκαλυπτικό',
  duplicate: 'Διπλό',
  unclear: 'Ασαφές',
  'low-effort': 'Χωρίς ουσία',
  spam: 'Spam',
}

export const CATEGORY_DEFAULT_POINTS: Record<CommentCategory, number> = {
  'valid-correction': 8,
  'useful-clarification': 5,
  'helpful-suggestion': 5,
  'common-misconception': 3,
  'wrong-but-helpful': 1,
  duplicate: 1,
  unclear: 0,
  'low-effort': 0,
  spam: 0,
}

export type Reply = {
  id: string
  text: string
  author: string
  createdAt: number
  isClaudeReply?: boolean
}

export type Comment = {
  id: string
  text: string
  author: string
  createdAt: number
  status: CommentStatus
  // section context (when commented via SectionCommentButton)
  sectionTitle?: string
  sectionAnchor?: string
  // review fields
  reviewedAt?: number
  category?: CommentCategory
  pointsAwarded?: number
  pointsReason?: string
  // threaded replies
  replies: Reply[]
}

function getKey(slug: string) {
  return STORAGE_PREFIX + slug
}

function readComments(slug: string): Comment[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(getKey(slug))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((c) => ({ ...c, replies: c.replies ?? [] })) as Comment[]
  } catch {
    return []
  }
}

function writeComments(slug: string, comments: Comment[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(getKey(slug), JSON.stringify(comments))
  } catch {
    // ignore
  }
}

type Props = {
  slug: string
  /** Page title saved with each comment (helps when reviewing later). */
  pageTitle?: string
  title?: string
}

export function Comments({ slug, pageTitle, title = 'Σχόλια' }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')
  const [moderate, setModerate] = useState(false)
  const target = useCommentTarget((s) => s.target)
  const clearTarget = useCommentTarget((s) => s.clear)

  useEffect(() => {
    setComments(readComments(slug))
    try {
      const a = window.localStorage.getItem(PROFILE_KEY)
      if (a) setAuthor(a)
    } catch {
      // ignore
    }
  }, [slug])

  const persist = (next: Comment[]) => {
    setComments(next)
    writeComments(slug, next)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    const trimmedAuthor = author.trim() || 'Ανώνυμος'
    const c: Comment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text: text.trim(),
      author: trimmedAuthor,
      createdAt: Date.now(),
      status: 'pending',
      sectionTitle: target?.sectionTitle,
      sectionAnchor: target?.sectionAnchor,
      replies: [],
    }
    persist([c, ...comments])
    setText('')
    clearTarget()
    try {
      window.localStorage.setItem(PROFILE_KEY, trimmedAuthor)
    } catch {
      // ignore
    }
  }

  const toggleStatus = (id: string) =>
    persist(
      comments.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'pending' ? 'resolved' : 'pending' }
          : c,
      ) as Comment[],
    )

  const removeComment = (id: string) => {
    if (!window.confirm('Διαγραφή σχολίου;')) return
    persist(comments.filter((c) => c.id !== id))
  }

  const reviewComment = (
    id: string,
    category: CommentCategory,
    points: number,
    reason: string,
  ) =>
    persist(
      comments.map((c) =>
        c.id === id
          ? {
              ...c,
              category,
              pointsAwarded: points,
              pointsReason: reason,
              reviewedAt: Date.now(),
            }
          : c,
      ),
    )

  const addReply = (
    commentId: string,
    replyText: string,
    replyAuthor: string,
    isClaudeReply: boolean,
  ) => {
    const r: Reply = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text: replyText.trim(),
      author: isClaudeReply ? CLAUDE_AUTHOR : replyAuthor.trim() || 'Ανώνυμος',
      createdAt: Date.now(),
      isClaudeReply,
    }
    persist(
      comments.map((c) =>
        c.id === commentId ? { ...c, replies: [...c.replies, r] } : c,
      ),
    )
  }

  const removeReply = (commentId: string, replyId: string) => {
    if (!window.confirm('Διαγραφή απάντησης;')) return
    persist(
      comments.map((c) =>
        c.id === commentId
          ? { ...c, replies: c.replies.filter((r) => r.id !== replyId) }
          : c,
      ),
    )
  }

  const pendingCount = comments.filter((c) => c.status === 'pending').length

  return (
    <section className="mt-12 rounded-xl border border-border bg-bg-elevated p-5">
      <header className="mb-3 flex flex-wrap items-center gap-2">
        <MessageSquare className="h-5 w-5 text-accent" aria-hidden />
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {pendingCount > 0 && (
          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
            {pendingCount} εκκρεμές{pendingCount === 1 ? '' : 'α'}
          </span>
        )}
        <button
          type="button"
          onClick={() => setModerate((v) => !v)}
          className="ml-auto inline-flex items-center gap-1 rounded-md border border-border bg-bg-soft px-2 py-1 text-[11px] text-fg-muted transition hover:border-accent/40 hover:text-accent"
          title="Toggle review/moderation tools (για AlexTuring/Claude)"
        >
          <Award className="h-3 w-3" aria-hidden />
          {moderate ? 'Κρύψε review' : 'Review mode'}
        </button>
      </header>

      <div className="mb-4 rounded-lg border border-accent/30 bg-accent-soft/20 p-3 text-xs leading-relaxed text-fg-muted">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
          <div>
            <p>
              <strong className="text-fg">Πώς λειτουργεί.</strong> Άσε σχόλιο
              όπου κάτι είναι ασαφές ή λάθος. Οι περισσότερες σελίδες έχουν
              κουμπί <em>Σχόλιο</em> δίπλα στις ενότητες — έτσι το σχόλιο
              αποθηκεύεται μαζί με τη συγκεκριμένη ενότητα.{' '}
              <strong className="text-accent">AlexTuring</strong> και ο{' '}
              <strong>Claude</strong> κάνουν review και απαντούν εδώ· οι
              απαντήσεις του Claude εμφανίζονται με το avatar του.
            </p>
            <p className="mt-1.5">
              <strong className="text-fg">Πόντοι:</strong> δεν δίνονται
              αυτόματα. Δίνονται μόνο μετά από review και ανάλογα με την
              ποιότητα του σχολίου (έγκυρη διόρθωση 8, χρήσιμη διευκρίνηση
              5, καλή πρόταση 5, ...). Δεν παίρνεις πόντους για spam ή «lol
              idk».
            </p>
          </div>
        </div>
      </div>

      <form
        id="comments-form"
        onSubmit={handleSubmit}
        className="mb-4 space-y-2"
      >
        {target && (
          <div className="flex items-center justify-between rounded-md border border-accent/40 bg-accent/10 px-3 py-2 text-xs">
            <span className="text-fg-muted">
              Σχολιάζεις:{' '}
              <strong className="text-fg">{target.sectionTitle}</strong>
            </span>
            <button
              type="button"
              onClick={clearTarget}
              className="rounded p-0.5 text-fg-subtle transition hover:bg-accent/10 hover:text-accent"
              aria-label="Καθάρισε ενότητα"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        )}
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Ψευδώνυμο (χρειάζεται για leaderboard)"
          className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          maxLength={40}
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Γράψε εδώ το σχόλιό σου…"
          rows={3}
          className="w-full resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
          maxLength={1000}
        />
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-fg-subtle">
            {text.length}/1000 χαρακτήρες
          </span>
          <button
            type="submit"
            disabled={!text.trim()}
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" aria-hidden />
            Υπόβαλε
          </button>
        </div>
      </form>

      {comments.length === 0 ? (
        <p className="text-sm italic text-fg-subtle">Κανένα σχόλιο ακόμα.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              onToggleStatus={() => toggleStatus(c.id)}
              onRemove={() => removeComment(c.id)}
              onReply={(t, a, isClaude) => addReply(c.id, t, a, isClaude)}
              onRemoveReply={(rid) => removeReply(c.id, rid)}
              onReview={(cat, pts, reason) => reviewComment(c.id, cat, pts, reason)}
              defaultAuthor={author}
              moderate={moderate}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

function CommentItem({
  comment,
  onToggleStatus,
  onRemove,
  onReply,
  onRemoveReply,
  onReview,
  defaultAuthor,
  moderate,
}: {
  comment: Comment
  onToggleStatus: () => void
  onRemove: () => void
  onReply: (text: string, author: string, isClaude: boolean) => void
  onRemoveReply: (replyId: string) => void
  onReview: (cat: CommentCategory, points: number, reason: string) => void
  defaultAuthor: string
  moderate: boolean
}) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replyAuthor, setReplyAuthor] = useState(defaultAuthor)
  const [replyAsClaude, setReplyAsClaude] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [cat, setCat] = useState<CommentCategory>(
    comment.category ?? 'useful-clarification',
  )
  const [pts, setPts] = useState<number>(
    comment.pointsAwarded ?? CATEGORY_DEFAULT_POINTS[cat],
  )
  const [reviewReason, setReviewReason] = useState(comment.pointsReason ?? '')

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return
    onReply(replyText, replyAuthor, replyAsClaude)
    setReplyText('')
    setReplyOpen(false)
    setReplyAsClaude(false)
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onReview(cat, pts, reviewReason.trim())
    setReviewOpen(false)
  }

  return (
    <li
      className={`rounded-lg border p-3 transition ${
        comment.status === 'resolved'
          ? 'border-emerald-500/40 bg-emerald-500/5'
          : 'border-amber-500/40 bg-amber-500/5'
      }`}
    >
      <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-fg">{comment.author}</span>
        {comment.sectionTitle && (
          <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/40 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300">
            ⛬ {comment.sectionTitle}
          </span>
        )}
        <span className="text-fg-subtle">
          {new Date(comment.createdAt).toLocaleDateString('el-GR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
        {comment.pointsAwarded != null && comment.pointsAwarded > 0 && (
          <span
            className="inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/10 px-2 py-0.5 text-[11px] font-semibold text-purple-700 dark:text-purple-300"
            title={comment.pointsReason}
          >
            <Award className="h-3 w-3" aria-hidden />+{comment.pointsAwarded}
          </span>
        )}
        {comment.category && (
          <span
            className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-soft px-2 py-0.5 text-[10px] text-fg-muted"
            title={comment.pointsReason}
          >
            <Tag className="h-2.5 w-2.5" aria-hidden />
            {CATEGORY_LABELS[comment.category]}
          </span>
        )}
        <button
          type="button"
          onClick={onToggleStatus}
          className={`ml-auto inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold transition ${
            comment.status === 'resolved'
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
              : 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300'
          }`}
        >
          {comment.status === 'resolved' ? (
            <>
              <CheckCircle2 className="h-3 w-3" aria-hidden />
              Resolved
            </>
          ) : (
            <>
              <Clock className="h-3 w-3" aria-hidden />
              Προς review
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="rounded p-1 text-fg-subtle transition hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-300"
          aria-label="Διαγραφή"
        >
          <Trash2 className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg">
        {comment.text}
      </p>
      {comment.sectionAnchor && (
        <a
          href={`#${comment.sectionAnchor}`}
          className="mt-1 inline-block text-[11px] text-fg-subtle hover:text-accent"
        >
          → πήγαινε στην ενότητα
        </a>
      )}

      {/* Replies */}
      {comment.replies.length > 0 && (
        <ul className="mt-3 space-y-2 border-l-2 border-border/60 pl-3">
          {comment.replies.map((r) => (
            <ReplyItem
              key={r.id}
              reply={r}
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
            {comment.reviewedAt ? 'Επανέλεγχος' : 'Review & δώσε πόντους'}
            <ChevronDown
              className={`h-3.5 w-3.5 transition ${reviewOpen ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>

      {replyOpen && (
        <form onSubmit={handleReplySubmit} className="mt-2 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={replyAuthor}
              onChange={(e) => setReplyAuthor(e.target.value)}
              placeholder="Ψευδώνυμο"
              disabled={replyAsClaude}
              className="flex-1 rounded-md border border-border bg-bg px-2 py-1 text-xs outline-none focus:border-accent disabled:opacity-50"
              maxLength={40}
            />
            <label className="inline-flex items-center gap-1.5 rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-1 text-[11px] font-semibold text-purple-700 dark:text-purple-300">
              <input
                type="checkbox"
                checked={replyAsClaude}
                onChange={(e) => setReplyAsClaude(e.target.checked)}
                className="h-3 w-3"
              />
              <Sparkles className="h-3 w-3" aria-hidden />
              Reply ως Claude
            </label>
          </div>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Γράψε την απάντηση…"
            rows={2}
            className="w-full resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
            maxLength={500}
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
              max={20}
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

function ReplyItem({ reply, onRemove }: { reply: Reply; onRemove: () => void }) {
  const isClaude = reply.isClaudeReply
  return (
    <li
      className={`rounded-md p-2 ${
        isClaude
          ? 'border border-purple-500/30 bg-purple-500/5'
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
        ) : (
          <span className="font-semibold text-fg">{reply.author}</span>
        )}
        <span className="text-fg-subtle">
          {new Date(reply.createdAt).toLocaleDateString('el-GR', {
            day: '2-digit',
            month: 'short',
          })}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="ml-auto rounded p-0.5 text-fg-subtle transition hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-300"
          aria-label="Διαγραφή"
        >
          <Trash2 className="h-3 w-3" aria-hidden />
        </button>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-fg">
        {reply.text}
      </p>
    </li>
  )
}

/**
 * Tries to render `/claude.png` if it exists, otherwise falls back to a
 * stylized inline avatar — so the comments system works even before the
 * static asset is dropped into `public/`.
 */
function ClaudeAvatar() {
  return (
    <span
      className="inline-flex h-4 w-4 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-[10px] font-bold text-white"
      aria-hidden
    >
      C
    </span>
  )
}

/** Read every comment from every page in localStorage. Used by Leaderboard. */
export function readAllComments(): Array<Comment & { slug: string }> {
  if (typeof window === 'undefined') return []
  const out: Array<Comment & { slug: string }> = []
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (!key || !key.startsWith(STORAGE_PREFIX)) continue
      const slug = key.slice(STORAGE_PREFIX.length)
      const raw = window.localStorage.getItem(key)
      if (!raw) continue
      try {
        const arr = JSON.parse(raw)
        if (!Array.isArray(arr)) continue
        for (const c of arr) {
          out.push({ ...(c as Comment), replies: c.replies ?? [], slug })
        }
      } catch {
        // skip
      }
    }
  } catch {
    // ignore
  }
  return out
}
