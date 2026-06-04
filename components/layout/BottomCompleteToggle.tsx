'use client'

import { usePathname } from 'next/navigation'
import { CompleteToggle } from './CompleteToggle'
import { findSection } from '@/lib/content-index'

/**
 * Registered sections that intentionally carry no completion tracking — the
 * interactive tool pages, which have no top-of-page CompleteToggle either.
 * Keeping the bottom toggle off them mirrors the top exactly.
 */
const NO_TOGGLE = new Set(['formulas', 'cheatsheet'])

/**
 * End-of-page "mark complete" toggle, auto-mounted by the (content) layout
 * just above the comments. Lets a reader mark a section done the moment they
 * finish reading, without scrolling back up to the toggle under the title.
 *
 * Client component: the (content) layout is reused across navigations, so we
 * read the pathname client-side (same derivation as PageComments) to know the
 * current slug. It writes the same store key as the top <CompleteToggle/>, so
 * the two stay perfectly in sync.
 */
export function BottomCompleteToggle() {
  const pathname = usePathname()
  const slug = pathname.replace(/^\/+/, '').replace(/\/$/, '')
  if (!slug || NO_TOGGLE.has(slug) || !findSection(slug)) return null

  return (
    <div className="mt-10 flex flex-col items-center gap-3 border-t border-border pt-8 print:hidden">
      <p className="text-sm text-fg-muted">Τελείωσες αυτή τη σελίδα;</p>
      <CompleteToggle slug={slug} />
    </div>
  )
}
