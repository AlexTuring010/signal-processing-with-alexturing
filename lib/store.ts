'use client'

import { create } from 'zustand'
import { readJSON, writeJSON, STORAGE_KEYS } from './storage'

export type Theme = 'light' | 'dark' | 'system'

type Store = {
  /** True after the client has hydrated from localStorage. Avoid theme/state flicker by gating UI on this. */
  hydrated: boolean
  hydrate: () => void

  theme: Theme
  setTheme: (t: Theme) => void

  completed: Set<string>
  toggleComplete: (slug: string) => void
  isComplete: (slug: string) => boolean

  bookmarks: Set<string>
  toggleBookmark: (id: string) => void
  isBookmarked: (id: string) => boolean
}

function applyThemeToDom(theme: Theme) {
  if (typeof document === 'undefined') return
  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme
  document.documentElement.setAttribute('data-theme', resolved)
}

export const useAppStore = create<Store>((set, get) => ({
  hydrated: false,
  theme: 'system',
  completed: new Set<string>(),
  bookmarks: new Set<string>(),

  hydrate: () => {
    if (get().hydrated) return
    const theme = (readJSON<Theme>(STORAGE_KEYS.theme, 'system') ?? 'system') as Theme
    const completedArr = readJSON<string[]>(STORAGE_KEYS.completed, [])
    const bookmarksArr = readJSON<string[]>(STORAGE_KEYS.bookmarks, [])
    set({
      hydrated: true,
      theme,
      completed: new Set(completedArr),
      bookmarks: new Set(bookmarksArr),
    })
    applyThemeToDom(theme)
  },

  setTheme: (theme) => {
    writeJSON(STORAGE_KEYS.theme, theme)
    applyThemeToDom(theme)
    set({ theme })
  },

  toggleComplete: (slug) => {
    const next = new Set(get().completed)
    if (next.has(slug)) next.delete(slug)
    else next.add(slug)
    writeJSON(STORAGE_KEYS.completed, Array.from(next))
    set({ completed: next })
  },
  isComplete: (slug) => get().completed.has(slug),

  toggleBookmark: (id) => {
    const next = new Set(get().bookmarks)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    writeJSON(STORAGE_KEYS.bookmarks, Array.from(next))
    set({ bookmarks: next })
  },
  isBookmarked: (id) => get().bookmarks.has(id),
}))
