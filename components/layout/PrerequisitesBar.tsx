import Link from 'next/link'
import { findSection } from '@/lib/content-index'

type Props = {
  prerequisites: string[]
}

export function PrerequisitesBar({ prerequisites }: Props) {
  if (!prerequisites.length) return null
  return (
    <div className="-mx-1 mt-3 flex flex-wrap items-center gap-2 text-sm">
      <span className="text-xs uppercase tracking-wider text-fg-subtle">
        Χρειάζεσαι:
      </span>
      {prerequisites.map((slug) => {
        const s = findSection(slug)
        const title = s?.title ?? slug
        const href = `/${slug}`
        if (!s?.available) {
          return (
            <span
              key={slug}
              className="rounded-full border border-dashed border-border bg-bg-soft px-2.5 py-0.5 text-xs text-fg-muted"
            >
              {title}
            </span>
          )
        }
        return (
          <Link
            key={slug}
            href={href}
            className="rounded-full border border-border bg-bg-elevated px-2.5 py-0.5 text-xs text-fg-muted transition-colors hover:border-accent/50 hover:text-fg"
          >
            {title}
          </Link>
        )
      })}
    </div>
  )
}
