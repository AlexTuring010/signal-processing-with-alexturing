import {
  ANON_DISPLAY_NAME,
  type CommentWithAuthor,
  type ReplyWithAuthor,
} from './types'

type Viewer = { id: string; isModerator: boolean } | null

const ANON_AUTHOR = {
  id: null as unknown as string, // intentional null; consumers check author_id for self-recognition
  display_name: ANON_DISPLAY_NAME,
  avatar_url: null,
  role: 'user' as const,
}

function shouldReveal(
  authorId: string | null,
  viewer: Viewer,
): boolean {
  if (!viewer) return false
  if (authorId === null) return true // guest comments aren't anonymized
  return viewer.isModerator || viewer.id === authorId
}

export function anonymizeReply(
  reply: ReplyWithAuthor,
  viewer: Viewer,
): ReplyWithAuthor {
  if (!reply.is_anonymous) return reply
  if (shouldReveal(reply.author_id, viewer)) return reply
  return { ...reply, author: { ...ANON_AUTHOR } }
}

export function anonymizeComment(
  comment: CommentWithAuthor,
  viewer: Viewer,
): CommentWithAuthor {
  const replies = comment.replies.map((r) => anonymizeReply(r, viewer))
  if (!comment.is_anonymous) return { ...comment, replies }
  if (shouldReveal(comment.author_id, viewer))
    return { ...comment, replies }
  return { ...comment, replies, author: { ...ANON_AUTHOR } }
}

export function anonymizeComments(
  comments: CommentWithAuthor[],
  viewer: Viewer,
): CommentWithAuthor[] {
  return comments.map((c) => anonymizeComment(c, viewer))
}
