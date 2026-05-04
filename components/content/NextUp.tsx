import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { findSection } from '@/lib/content-index'

type Props = {
  slug: string
}

export function NextUp({ slug }: Props) {
  const section = findSection(slug)
  const title = section?.title ?? slug
  const available = section?.available ?? false
  const href = `/${slug}`

  if (!available) {
    return (
      <div className="mt-8 flex items-center justify-between rounded-lg border border-dashed border-border bg-bg-soft px-5 py-4 text-sm text-fg-muted">
        <span>
          <span className="text-fg-subtle">Επόμενο: </span>
          <span className="font-medium">{title}</span>
        </span>
        <span className="rounded-full bg-bg-elevated px-2 py-0.5 text-xs">
          coming soon
        </span>
      </div>
    )
  }

  return (
    <Link
      href={href}
      className="group mt-8 flex items-center justify-between rounded-lg border border-border bg-bg-elevated px-5 py-4 transition-colors hover:border-accent/50 hover:bg-accent-soft/30"
    >
      <span>
        <span className="text-sm text-fg-subtle">Επόμενο</span>
        <div className="text-base font-semibold tracking-tight">{title}</div>
      </span>
      <ArrowRight className="h-5 w-5 text-fg-muted transition-transform group-hover:translate-x-1 group-hover:text-accent" />
    </Link>
  )
}
