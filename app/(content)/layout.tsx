import { headers } from 'next/headers'
import { Sidebar } from '@/components/layout/Sidebar'
import { TableOfContents } from '@/components/layout/TableOfContents'
import { PageComments } from '@/components/layout/PageComments'
import { SectionCommentsProvider } from '@/components/layout/section-comments-context'
import { createClient } from '@/lib/supabase/server'
import { findSection } from '@/lib/content-index'

/**
 * Layout for all educational content pages.
 *
 * Three-column on desktop:
 *   [ sidebar | article | TOC ]
 *
 * Below `lg`, the sidebar collapses into the mobile drawer (in `Header`),
 * and the right TOC is hidden in favor of the in-page anchors.
 *
 * The bottom-of-page comments thread and the per-section inline threads
 * are auto-mounted here so each MDX file stays focused on content.
 * One DB query per page render aggregates the per-section comment counts
 * so badges like "💬 3 σχόλια" render server-side without N round-trips.
 */
export default async function ContentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const h = await headers()
  const pathname = h.get('x-pathname') ?? '/'
  const slug = pathname.replace(/^\/+/, '').replace(/\/$/, '')
  const section = slug ? findSection(slug) : undefined

  const counts: Record<string, number> = {}
  if (slug) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('comments')
      .select('section_anchor')
      .eq('slug', slug)
      .not('section_anchor', 'is', null)
    for (const row of (data ?? []) as Array<{ section_anchor: string | null }>) {
      if (row.section_anchor) {
        counts[row.section_anchor] = (counts[row.section_anchor] ?? 0) + 1
      }
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[16rem_minmax(0,1fr)_14rem] lg:gap-8 lg:px-6 lg:py-10">
      <aside className="hidden lg:block">
        <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pr-2">
          <Sidebar />
        </div>
      </aside>

      <article className="prose-content min-w-0 max-w-prose">
        <SectionCommentsProvider
          slug={slug}
          pageTitle={section?.title}
          counts={counts}
        >
          {children}
        </SectionCommentsProvider>
        <PageComments />
      </article>

      <aside className="hidden lg:block">
        <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pl-2">
          <TableOfContents />
        </div>
      </aside>
    </div>
  )
}
