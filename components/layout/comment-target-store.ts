'use client'

import { create } from 'zustand'

/**
 * Pending comment target: which section the user clicked
 * "Comment on this section" on. Read by `<Comments>` to pre-fill the
 * section context, then cleared after submit.
 */

export type CommentTarget = {
  sectionTitle: string
  sectionAnchor: string
} | null

type State = {
  target: CommentTarget
  setTarget: (t: CommentTarget) => void
  clear: () => void
}

export const useCommentTarget = create<State>((set) => ({
  target: null,
  setTarget: (t) => set({ target: t }),
  clear: () => set({ target: null }),
}))
