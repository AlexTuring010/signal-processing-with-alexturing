'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { findSection } from '@/lib/content-index'

type Ctx = {
  /** Slug of the page (e.g. "foundations/fourier-transform"). */
  slug: string
  /** Reader-friendly page title; passed through to new comments. */
  pageTitle?: string
  /** Count of comments per section anchor for the current page. */
  counts: Record<string, number>
}

const SectionCommentsContext = createContext<Ctx | null>(null)

/**
 * Provider mounted by the (content) layout. Tracks the current pathname
 * and fetches per-section comment counts client-side, so navigations
 * between sibling pages always show fresh badges (the (content) layout
 * is reused across navigations and would otherwise serve stale counts).
 *
 * `slugOverride` is used by flows that render exercises under a different
 * URL (e.g. «Σώσε το εξάμηνο» under /practice/sose-to-eksamino) but want
 * the underlying comments to share the canonical slug=practice thread
 * — so a comment left in either place is visible from both.
 */
export function SectionCommentsProvider({
  children,
  slugOverride,
  pageTitleOverride,
}: {
  children: React.ReactNode
  slugOverride?: string
  pageTitleOverride?: string
}) {
  const pathname = usePathname()
  const slug =
    slugOverride ?? pathname.replace(/^\/+/, '').replace(/\/$/, '')
  const section = slug ? findSection(slug) : undefined
  const supabase = useMemo(() => createClient(), [])
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!slug) {
      setCounts({})
      return
    }
    let cancelled = false
    supabase
      .from('comments')
      .select('section_anchor')
      .eq('slug', slug)
      .not('section_anchor', 'is', null)
      .then(({ data }) => {
        if (cancelled) return
        const next: Record<string, number> = {}
        for (const row of (data ?? []) as Array<{
          section_anchor: string | null
        }>) {
          if (row.section_anchor) {
            next[row.section_anchor] = (next[row.section_anchor] ?? 0) + 1
          }
        }
        setCounts(next)
      })
    return () => {
      cancelled = true
    }
  }, [slug, supabase])

  return (
    <SectionCommentsContext.Provider
      value={{
        slug,
        pageTitle: pageTitleOverride ?? section?.title,
        counts,
      }}
    >
      {children}
    </SectionCommentsContext.Provider>
  )
}

export function useSectionCommentsCtx() {
  return useContext(SectionCommentsContext)
}
