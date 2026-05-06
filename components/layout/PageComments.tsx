import { headers } from 'next/headers'
import { Comments } from './Comments'
import { findSection } from '@/lib/content-index'

/**
 * Bottom-of-page comments block, auto-mounted on every content page via
 * the (content) layout. Reads the request pathname from the `x-pathname`
 * header set by middleware; derives the slug + page title without needing
 * each MDX page to wire it up explicitly.
 */
export async function PageComments() {
  const h = await headers()
  const pathname = h.get('x-pathname') ?? '/'
  const slug = pathname.replace(/^\/+/, '').replace(/\/$/, '')
  if (!slug) return null
  const section = findSection(slug)
  return (
    <Comments
      slug={slug}
      pageTitle={section?.title}
      title="Σχόλια για αυτή τη σελίδα"
    />
  )
}
