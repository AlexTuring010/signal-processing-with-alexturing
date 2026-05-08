/**
 * Tiny localStorage wrapper that fails silently in environments where it's
 * unavailable (SSR, private mode, etc).
 */

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

export function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (!isBrowser) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota or serialization error — silently ignore */
  }
}

export function readString(key: string, fallback = ''): string {
  if (!isBrowser) return fallback
  try {
    return window.localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

export function writeString(key: string, value: string): void {
  if (!isBrowser) return
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* ignore */
  }
}

export const STORAGE_KEYS = {
  theme: 'spwa:theme',
  completed: 'spwa:completed',
  bookmarks: 'spwa:bookmarks',
  solvedExercises: 'spwa:solvedExercises',
  pet: 'spwa:pet',
  petSound: 'spwa:pet-sound',
  petGameHigh: 'spwa:pet-game-high',
  orchard: 'spwa:orchard',
  collectibles: 'spwa:collectibles',
} as const
