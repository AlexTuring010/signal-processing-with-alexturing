export type CommentStatus = 'pending' | 'resolved' | 'general'

export type CommentVisibility = 'public' | 'mod_only'

export const ANON_DISPLAY_NAME = 'Ανώνυμος Φοιτητής'

export type CommentCategory =
  | 'valid-correction'
  | 'useful-clarification'
  | 'helpful-suggestion'
  | 'tip'
  | 'appreciation'
  | 'common-misconception'
  | 'wrong-but-helpful'
  | 'duplicate'
  | 'unclear'
  | 'low-effort'
  | 'spam'

export type Role = 'user' | 'moderator'

export type Profile = {
  id: string
  display_name: string
  avatar_url: string | null
  role: Role
  created_at: string
}

export type CommentRow = {
  id: string
  slug: string
  page_title: string | null
  section_title: string | null
  section_anchor: string | null
  body: string
  author_id: string | null
  status: CommentStatus
  category: CommentCategory | null
  points_awarded: number
  points_reason: string | null
  reviewed_at: string | null
  reviewed_by: string | null
  created_at: string
  visibility: CommentVisibility
  is_anonymous: boolean
}

export type ReplyRow = {
  id: string
  comment_id: string
  body: string
  author_id: string | null
  is_claude_reply: boolean
  is_anonymous: boolean
  created_at: string
}

export type CommentWithAuthor = CommentRow & {
  author: Pick<Profile, 'id' | 'display_name' | 'avatar_url' | 'role'> | null
  replies: ReplyWithAuthor[]
}

export type ReplyWithAuthor = ReplyRow & {
  author: Pick<Profile, 'id' | 'display_name' | 'avatar_url' | 'role'> | null
}

export const CATEGORY_LABELS: Record<CommentCategory, string> = {
  'valid-correction': 'Έγκυρη διόρθωση',
  'useful-clarification': 'Ζητάει χρήσιμη διευκρίνηση',
  'helpful-suggestion': 'Καλή πρόταση',
  tip: 'Χρήσιμο tip / πρόσθετη γνώση',
  appreciation: 'Θετικό σχόλιο',
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
  tip: 5,
  appreciation: 0,
  'common-misconception': 3,
  'wrong-but-helpful': 1,
  duplicate: 1,
  unclear: 0,
  'low-effort': 0,
  spam: 0,
}
