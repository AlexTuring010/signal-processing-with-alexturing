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

  /** Per-problem solved state. Key format: "<page-slug>:<problem-id>". */
  solvedExercises: Set<string>
  toggleSolvedExercise: (key: string) => void
  isExerciseSolved: (key: string) => boolean
  /** Count solved problems whose key prefix matches "<page-slug>:". */
  countSolvedInSlug: (slug: string) => number
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

/**
 * Wrap a theme change with the `.theme-transitioning` class so the swap
 * fades. The class is added before flipping `data-theme` and removed
 * after the CSS transition completes (~240ms in globals.css, with a
 * small buffer). Caller can pass `instant: true` to skip the animation
 * — used on hydrate so initial paint never animates.
 */
let pendingThemeTransitionHandle: number | null = null
function transitionTheme(theme: Theme, opts: { instant?: boolean } = {}) {
  if (typeof document === 'undefined' || opts.instant) {
    applyThemeToDom(theme)
    return
  }
  const html = document.documentElement
  html.classList.add('theme-transitioning')
  applyThemeToDom(theme)
  if (pendingThemeTransitionHandle !== null) {
    window.clearTimeout(pendingThemeTransitionHandle)
  }
  pendingThemeTransitionHandle = window.setTimeout(() => {
    html.classList.remove('theme-transitioning')
    pendingThemeTransitionHandle = null
  }, 280)
}

export const useAppStore = create<Store>((set, get) => ({
  hydrated: false,
  theme: 'dark',
  completed: new Set<string>(),
  bookmarks: new Set<string>(),
  solvedExercises: new Set<string>(),

  hydrate: () => {
    if (get().hydrated) return
    const theme = (readJSON<Theme>(STORAGE_KEYS.theme, 'dark') ?? 'dark') as Theme
    const completedArr = readJSON<string[]>(STORAGE_KEYS.completed, [])
    const bookmarksArr = readJSON<string[]>(STORAGE_KEYS.bookmarks, [])
    const solvedArr = readJSON<string[]>(STORAGE_KEYS.solvedExercises, [])
    set({
      hydrated: true,
      theme,
      completed: new Set(completedArr),
      bookmarks: new Set(bookmarksArr),
      solvedExercises: new Set(solvedArr),
    })
    applyThemeToDom(theme)
  },

  setTheme: (theme) => {
    writeJSON(STORAGE_KEYS.theme, theme)
    transitionTheme(theme)
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

  toggleSolvedExercise: (key) => {
    const next = new Set(get().solvedExercises)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    writeJSON(STORAGE_KEYS.solvedExercises, Array.from(next))
    set({ solvedExercises: next })
  },
  isExerciseSolved: (key) => get().solvedExercises.has(key),
  countSolvedInSlug: (slug) => {
    const prefix = `${slug}:`
    let n = 0
    for (const k of get().solvedExercises) if (k.startsWith(prefix)) n++
    return n
  },
}))
