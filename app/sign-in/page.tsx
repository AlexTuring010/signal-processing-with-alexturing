'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function SignInForm() {
  const params = useSearchParams()
  const initialError = params.get('error')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(
    initialError === 'auth-failed'
      ? 'Η σύνδεση απέτυχε. Δοκίμασε ξανά.'
      : null,
  )
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const redirectTo =
    typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    })
    setLoading(false)
    if (error) setError(error.message)
    else setSent(true)
  }

  const handleGoogle = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        // Explicit scopes — `openid` enables the OIDC flow Supabase prefers,
        // `email profile` populates `user_metadata.full_name` / `avatar_url`
        // so the profile auto-create trigger has values to write.
        scopes: 'openid email profile',
        // Refresh-token flow: `offline` asks Google to issue a refresh token,
        // `prompt: consent` makes Google show the consent screen every time
        // (without this, returning users skip consent and Google does NOT
        // re-issue a refresh token if one was revoked).
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    if (error) {
      setLoading(false)
      // Friendly diagnostic for the most common config mistake — Google
      // provider not enabled on the Supabase backend. Surfacing the raw
      // error message ("Unsupported provider: provider is not enabled")
      // is unhelpful for end users.
      if (/provider is not enabled/i.test(error.message)) {
        setError(
          'Η σύνδεση μέσω Google δεν είναι ενεργοποιημένη ακόμα στον server. ' +
          'Δοκίμασε προς το παρόν με magic link στο email σου.',
        )
      } else {
        setError(error.message)
      }
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-accent"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Πίσω στην αρχή
      </Link>

      <div className="rounded-2xl border border-border bg-bg-elevated p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight">Σύνδεση</h1>
        <p className="mt-2 text-sm text-fg-muted">
          Χρειάζεσαι λογαριασμό για να αφήνεις σχόλια. Κανένα password — απλά
          σου στέλνουμε link στο email σου.
        </p>

        {sent ? (
          <div className="mt-6 rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-4 text-sm">
            <div className="mb-1 flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Έλεγξε το email σου
            </div>
            <p className="text-fg-muted">
              Στείλαμε ένα link στο <strong>{email}</strong>. Πάτα το για να
              συνδεθείς.
            </p>
          </div>
        ) : (
          <>
            <form onSubmit={handleEmailSubmit} className="mt-6 space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-fg-muted">
                  Email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
                  autoComplete="email"
                />
              </label>
              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden />
                {loading ? 'Στέλνεται…' : 'Στείλε magic link'}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-wider text-fg-subtle">
              <span className="h-px flex-1 bg-border" />
              ή
              <span className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-bg px-3 py-2 text-sm font-semibold transition hover:border-accent/40 disabled:opacity-50"
            >
              <GoogleIcon />
              Συνέχεια με Google
            </button>
          </>
        )}

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-md border border-rose-500/40 bg-rose-500/5 p-3 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>{error}</span>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-fg-subtle">
        Συνδεόμενος αποδέχεσαι ότι το ψευδώνυμο και τα σχόλιά σου θα είναι
        ορατά σε όλους τους επισκέπτες.
      </p>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="px-4 py-16 text-center text-sm text-fg-muted">…</div>}>
      <SignInForm />
    </Suspense>
  )
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.5 29.3 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.5 29.3 4.5 24 4.5c-7.4 0-13.8 4.1-17.1 10.2z"
      />
      <path
        fill="#4CAF50"
        d="M24 43.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.7 39.2 16.3 43.5 24 43.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.6l6.2 5.2c-.4.4 6.7-4.9 6.7-14.8 0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  )
}
