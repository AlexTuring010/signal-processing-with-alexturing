'use client'

import { createContext, useContext } from 'react'

type Ctx = {
  /** Slug of the page the children belong to (e.g. "foundations/fourier-transform"). */
  slug: string
  /** Reader-friendly page title; passed through to new comments. */
  pageTitle?: string
  /** Pre-fetched count of comments per section anchor (server-side). */
  counts: Record<string, number>
}

const SectionCommentsContext = createContext<Ctx | null>(null)

export function SectionCommentsProvider({
  slug,
  pageTitle,
  counts,
  children,
}: Ctx & { children: React.ReactNode }) {
  return (
    <SectionCommentsContext.Provider value={{ slug, pageTitle, counts }}>
      {children}
    </SectionCommentsContext.Provider>
  )
}

export function useSectionCommentsCtx() {
  return useContext(SectionCommentsContext)
}
