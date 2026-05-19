import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * OAuth / magic-link callback.
 *
 * Supabase redirects here in three different shapes depending on how the
 * upstream flow went:
 *
 *   1. Happy path:   /auth/callback?code=<one-shot-code>
 *      → exchange the code for a session, redirect to `next` (default `/`).
 *
 *   2. Provider/Supabase error:
 *      /auth/callback?error=<...>&error_code=<...>&error_description=<...>
 *      → no code to exchange. Forward the user to /sign-in with a friendly
 *        Greek error message.
 *
 *   3. Stale flow state — typically `flow_state_already_used`. Happens when
 *      the same OAuth flow ID is consumed twice (React 18 Strict Mode
 *      double mount, double-click, browser back+retry, link prefetched
 *      twice, etc.). The first attempt almost always succeeded and the
 *      user is already signed in, so we treat this as soft and send them
 *      home instead of bouncing back to /sign-in.
 *
 * Hard rule: this handler MUST NOT throw. A throw here surfaces as a 500
 * on the dev server (and the server crash you reported earlier). Every
 * path returns a redirect.
 */
export async function GET(request: Request) {
  let url: URL
  try {
    url = new URL(request.url)
  } catch {
    return NextResponse.redirect('http://localhost:3000/sign-in?error=auth-bad-url')
  }
  const { searchParams, origin } = url
  const code = searchParams.get('code')
  const errorCode = searchParams.get('error_code')
  const errorParam = searchParams.get('error')
  const next = searchParams.get('next') ?? '/'
  const safeNext = next.startsWith('/') ? next : '/'

  // Case 3 — stale / already-used flow. Treat as soft success: the user is
  // almost certainly signed in from the first attempt.
  if (errorCode === 'flow_state_already_used') {
    return NextResponse.redirect(`${origin}${safeNext}`)
  }

  // Case 2 — any other reported error. Forward to /sign-in with the reason.
  if (errorCode || errorParam) {
    const reason = errorCode ?? errorParam ?? 'auth-failed'
    return NextResponse.redirect(
      `${origin}/sign-in?error=${encodeURIComponent(reason)}`,
    )
  }

  // Case 1 — happy path. Exchange the code, wrapped so any SDK throw
  // becomes a graceful redirect instead of a 500.
  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(`${origin}${safeNext}`)
      }
      // Some errors mean the code was already consumed (e.g. a Strict-Mode
      // double mount where attempt #1 already wrote the session). If the
      // user has a valid session now, send them home anyway.
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        return NextResponse.redirect(`${origin}${safeNext}`)
      }
      return NextResponse.redirect(
        `${origin}/sign-in?error=${encodeURIComponent(error.code ?? 'auth-failed')}`,
      )
    } catch {
      return NextResponse.redirect(`${origin}/sign-in?error=auth-failed`)
    }
  }

  // Nothing to do — no code, no error. Send to /sign-in.
  return NextResponse.redirect(`${origin}/sign-in?error=auth-failed`)
}
