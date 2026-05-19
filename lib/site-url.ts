/**
 * Resolve the canonical site origin used for OAuth `redirectTo` and any
 * other URL we hand to an external service (Supabase, Google, magic-link
 * emails).
 *
 * Priority — first non-empty wins:
 *
 *   1. NEXT_PUBLIC_SITE_URL
 *      Explicit override. Set this in Vercel → Project → Environment
 *      Variables (Production & Preview both) to the canonical site URL,
 *      e.g. `https://algorithms-class-hub.vercel.app`. Authoritative.
 *
 *   2. NEXT_PUBLIC_VERCEL_URL
 *      Vercel auto-exposes this on every deployment (no leading scheme).
 *      We prefix `https://`. Good fallback for preview deployments where
 *      a static SITE_URL would be wrong.
 *
 *   3. window.location.origin
 *      Client-only last resort — only ever reached in the browser. In
 *      production browsers this resolves to the visible host, which is
 *      correct, but it doesn't work on the server, so we keep it last.
 *
 *   4. 'http://localhost:3000'
 *      Final dev fallback if absolutely nothing is set.
 *
 * Returned value has no trailing slash so callers can do
 * `${getSiteUrl()}/auth/callback` without doubling up.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit && explicit.length > 0) return stripTrailingSlash(explicit)

  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL
  if (vercel && vercel.length > 0) {
    const withScheme = vercel.startsWith('http') ? vercel : `https://${vercel}`
    return stripTrailingSlash(withScheme)
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return stripTrailingSlash(window.location.origin)
  }

  return 'http://localhost:3000'
}

/**
 * `${getSiteUrl()}/auth/callback` — convenience for the Supabase OAuth
 * `redirectTo` option, used by both the magic-link and Google flows.
 */
export function getAuthCallbackUrl(): string {
  return `${getSiteUrl()}/auth/callback`
}

function stripTrailingSlash(s: string): string {
  return s.endsWith('/') ? s.slice(0, -1) : s
}
