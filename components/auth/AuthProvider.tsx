'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/lib/store'

type AuthState = {
  user: User | null
  session: Session | null
  /** True after the first session lookup completes. */
  ready: boolean
  signOut: () => Promise<void>
}

const AuthCtx = createContext<AuthState>({
  user: null,
  session: null,
  ready: false,
  signOut: async () => {},
})

export function useAuth() {
  return useContext(AuthCtx)
}

/**
 * Top-level provider. Two responsibilities:
 *
 *   1. Keep a React-visible copy of the Supabase session so any child can
 *      do `const { user } = useAuth()` to know if we're signed in. The
 *      session itself still lives in cookies — this is just a mirror.
 *
 *   2. On sign-in, hydrate `useAppStore.completed` from the user's
 *      `user_progress` rows so progress survives across devices.
 *      On sign-out, fall back to the localStorage copy (already in
 *      memory) and stop mirroring writes to the DB.
 *
 * The actual "write through to DB on toggle" wiring lives in
 * `lib/progress-sync.ts` so it can be imported from CompleteToggle
 * without dragging in this React tree.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)
  const supabaseRef = useRef(createClient())
  const hydrateProgressFromDb = useAppStore(
    (s) => s.hydrateProgressFromDb,
  )
  const setOnlineUser = useAppStore((s) => s.setOnlineUser)

  useEffect(() => {
    const supabase = supabaseRef.current

    let mounted = true

    // Initial session lookup. Resolves quickly because the cookie is
    // already on disk; no network round-trip needed unless the access
    // token has expired (then Supabase auto-refreshes).
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return
        setSession(data.session)
        setReady(true)
        if (data.session?.user) {
          setOnlineUser(data.session.user.id)
          // fire-and-forget — hydrating from DB doesn't block render
          void hydrateProgressFromDb(supabase, data.session.user.id)
        }
      })
      .catch(() => {
        // Broken cookie / network error → render as anonymous.
        if (mounted) setReady(true)
      })

    // Subscribe to future changes — sign-in, sign-out, token refresh.
    const { data: sub } = supabase.auth.onAuthStateChange((event, sess) => {
      if (!mounted) return
      setSession(sess)
      if (event === 'SIGNED_IN' && sess?.user) {
        setOnlineUser(sess.user.id)
        void hydrateProgressFromDb(supabase, sess.user.id)
      } else if (event === 'SIGNED_OUT') {
        setOnlineUser(null)
      }
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [hydrateProgressFromDb, setOnlineUser])

  const value: AuthState = {
    user: session?.user ?? null,
    session,
    ready,
    signOut: async () => {
      await supabaseRef.current.auth.signOut()
      setOnlineUser(null)
    },
  }

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}
