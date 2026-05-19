import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Supabase auth-cookie refresh + global OAuth-error catcher.
 *
 * Two responsibilities:
 *
 *   1. Refresh the Supabase auth cookie on every request — standard
 *      `@supabase/ssr` pattern.
 *
 *   2. Catch the case where Supabase bounces the user back to the *Site URL*
 *      (e.g. `/?error=invalid_request&error_code=flow_state_already_used`)
 *      instead of through `/auth/callback`. This happens when the flow
 *      state is reused (Strict-Mode double mount, retry, prefetch). Without
 *      this catch, the error params reach a Server Component that does
 *      `supabase.auth.getUser()` on a half-broken cookie, which can 500
 *      the dev server.
 *
 *      We catch the params at the edge and redirect to /sign-in, with
 *      `flow_state_already_used` treated as soft (the previous attempt
 *      probably succeeded — go home).
 *
 * Hard rule: this middleware MUST NOT throw. If anything inside fails,
 * fall through to a plain `NextResponse.next()` so the request still
 * reaches Next.js.
 */
export async function updateSession(request: NextRequest) {
  try {
    const { pathname, searchParams } = request.nextUrl
    const errorCode = searchParams.get('error_code')
    const errorParam = searchParams.get('error')

    // Edge-catch OAuth errors arriving on anywhere-but-callback.
    // `/auth/callback` and `/sign-in` handle their own error params, so we
    // skip them here to avoid redirect loops.
    if (
      (errorCode || errorParam) &&
      !pathname.startsWith('/auth/callback') &&
      !pathname.startsWith('/sign-in')
    ) {
      const dest = new URL(request.url)
      // Soft case — the prior attempt already wrote the session, so just
      // strip the params and continue to the original page.
      if (errorCode === 'flow_state_already_used') {
        dest.searchParams.delete('error')
        dest.searchParams.delete('error_code')
        dest.searchParams.delete('error_description')
        return NextResponse.redirect(dest)
      }
      // Hard case — send to /sign-in with the reason.
      const signIn = new URL('/sign-in', request.url)
      signIn.searchParams.set('error', errorCode ?? errorParam ?? 'auth-failed')
      return NextResponse.redirect(signIn)
    }

    // Standard Supabase cookie-refresh dance.
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', pathname)
    let response = NextResponse.next({ request: { headers: requestHeaders } })

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      // Missing env (e.g. someone running `next dev` without .env.local).
      // Don't crash — just skip the auth refresh.
      return response
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            for (const { name, value } of cookiesToSet) {
              request.cookies.set(name, value)
            }
            response = NextResponse.next({ request: { headers: requestHeaders } })
            for (const { name, value, options } of cookiesToSet) {
              response.cookies.set(name, value, options)
            }
          },
        },
      },
    )

    // Wrapped: a corrupted cookie can throw here. We don't want that to
    // 500 every page.
    try {
      await supabase.auth.getUser()
    } catch {
      /* swallow — broken session, downstream getUser() will return null */
    }

    return response
  } catch {
    // Belt-and-suspenders: never let middleware crash the request.
    return NextResponse.next()
  }
}
