import { Sidebar } from '@/components/layout/Sidebar'
import { TableOfContents } from '@/components/layout/TableOfContents'

/**
 * Layout for all educational content pages.
 *
 * Three-column on desktop:
 *   [ sidebar | article | TOC ]
 *
 * Below `lg`, the sidebar collapses into the mobile drawer (in `Header`),
 * and the right TOC is hidden in favor of the in-page anchors.
 */
export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[16rem_minmax(0,1fr)_14rem] lg:gap-8 lg:px-6 lg:py-10">
      <aside className="hidden lg:block">
        <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pr-2">
          <Sidebar />
        </div>
      </aside>

      <article className="prose-content min-w-0 max-w-prose">{children}</article>

      <aside className="hidden lg:block">
        <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pl-2">
          <TableOfContents />
        </div>
      </aside>
    </div>
  )
}
