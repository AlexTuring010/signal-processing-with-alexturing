import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { SECTION_TITLES } from '@/content/practice/types'

type Props = {
  prerequisites: string[]
}

/**
 * Renders a row of small chips, one per required section. Each chip is a
 * link to that section so the reader can jump to the relevant theory.
 */
export function PrereqChips({ prerequisites }: Props) {
  if (prerequisites.length === 0) return null
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="inline-flex items-center gap-1 text-xs text-fg-subtle">
        <BookOpen className="h-3 w-3" aria-hidden />
        Απαιτεί:
      </span>
      {prerequisites.map((slug) => (
        <Link
          key={slug}
          href={`/${slug}`}
          className="rounded-full border border-border bg-bg-soft px-2 py-0.5 text-[11px] text-fg-muted hover:border-accent/40 hover:text-accent"
        >
          {SECTION_TITLES[slug] ?? slug}
        </Link>
      ))}
    </div>
  )
}
