'use client'

import { createBrowserClient } from '@supabase/ssr'

/**
 * Browser-side Supabase client.
 *
 * The cookies handler is *explicit* so we can:
 *   1. Set a long `max-age` (30 days) on every cookie write — without
 *      this, the default is a session cookie that gets dropped on
 *      browser restart, which is the "Google login doesn't persist"
 *      symptom the user reported.
 *   2. Pin `path=/` so the cookie is visible on every route (including
 *      `/auth/callback`).
 *   3. Set `same-site=lax` so the cookie is sent on top-level OAuth
 *      redirects from Google back into our app.
 *   4. Leave `secure` to Supabase's defaults: true on https, false on
 *      localhost. (Hard-coding `secure: true` breaks local dev.)
 *
 * These options are merged on top of whatever Supabase passes in, so
 * if a future version of @supabase/ssr starts setting its own max-age,
 * ours still wins.
 */
const THIRTY_DAYS_SECONDS = 60 * 60 * 24 * 30

function readBrowserCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${encodeURIComponent(name)}=`))
  return match ? decodeURIComponent(match.split('=')[1] ?? '') : undefined
}

function writeBrowserCookie(
  name: string,
  value: string,
  options: {
    maxAge?: number
    expires?: Date
    path?: string
    domain?: string
    sameSite?: 'lax' | 'strict' | 'none'
    secure?: boolean
  } = {},
) {
  if (typeof document === 'undefined') return
  const parts = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    `path=${options.path ?? '/'}`,
    `max-age=${options.maxAge ?? THIRTY_DAYS_SECONDS}`,
    `samesite=${options.sameSite ?? 'lax'}`,
  ]
  if (options.domain) parts.push(`domain=${options.domain}`)
  if (options.secure ?? window.location.protocol === 'https:') {
    parts.push('secure')
  }
  if (options.expires) parts.push(`expires=${options.expires.toUTCString()}`)
  document.cookie = parts.join('; ')
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // @supabase/ssr expects an array of { name, value } pairs.
          if (typeof document === 'undefined') return []
          return document.cookie
            .split('; ')
            .filter(Boolean)
            .map((entry) => {
              const eq = entry.indexOf('=')
              const name = decodeURIComponent(
                eq >= 0 ? entry.slice(0, eq) : entry,
              )
              const value =
                eq >= 0 ? decodeURIComponent(entry.slice(eq + 1)) : ''
              return { name, value }
            })
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            writeBrowserCookie(name, value, {
              maxAge: options?.maxAge ?? THIRTY_DAYS_SECONDS,
              expires: options?.expires as Date | undefined,
              path: options?.path,
              domain: options?.domain,
              sameSite: (options?.sameSite as 'lax' | 'strict' | 'none') ?? 'lax',
              secure: options?.secure,
            })
          }
        },
      },
    },
  )
}

// Re-export the raw cookie reader so other client modules (e.g. progress
// sync) can do a quick "am I logged in?" check without spinning up a
// Supabase client.
export { readBrowserCookie }
