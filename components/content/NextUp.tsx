import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { ALL_SECTIONS } from '@/lib/content-index'

type Props = {
  /**
   * The slug of the CURRENT lecture page. The component then walks the
   * lecture index (`LECTURES`) to find the next lecture in sequence.
   * Recommended way to use this component.
   */
  current?: string
  /**
   * Manual override — explicit destination + copy. Used by older pages or
   * when you want to point to a non-sequential follow-up (e.g. "go to
   * Practice hub" at the end of the last lecture).
   */
  href?: string
  title?: string
  blurb?: string
}

/**
 * Resolves the "next lecture" pointer at the bottom of each lecture page.
 *
 * Priority:
 *   1. If `href` is given → use the explicit values (legacy/manual mode).
 *   2. If `current` is given → look up its position in LECTURES and pick
 *      the next available one. If none → render a celebratory "you've
 *      reached the end" card with a link to the practice hub.
 *   3. Neither → render nothing (defensive).
 */
export function NextUp({ current, href, title, blurb }: Props) {
  // Manual mode — caller fully specifies the link.
  if (href) {
    return (
      <NextUpCard
        href={href}
        title={title ?? 'Επόμενο μάθημα'}
        blurb={blurb}
      />
    )
  }

  if (!current) return null

  // Dynamic mode — walk the lectures index.
  const idx = ALL_SECTIONS.findIndex((s) => s.slug === current)

  // Find the first AVAILABLE successor (skip any flagged unavailable).
  const next = idx >= 0
    ? ALL_SECTIONS.slice(idx + 1).find((s) => s.available)
    : undefined

  if (!next) {
    // End of the lecture sequence (or current slug wasn't found).
    return (
      <Link
        href="/practice"
        className="group mt-8 flex items-center justify-between rounded-lg border border-accent/40 bg-accent-soft/30 px-5 py-4 transition-colors hover:border-accent/70 hover:bg-accent-soft/50"
      >
        <span>
          <span className="flex items-center gap-1.5 text-sm text-fg-subtle">
            <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
            Έφτασες στο τέλος του κεφαλαίου
          </span>
          <div className="text-base font-semibold tracking-tight">
            Μετάβαση στο Practice hub
          </div>
        </span>
        <ArrowRight className="h-5 w-5 text-fg-muted transition-transform group-hover:translate-x-1 group-hover:text-accent" />
      </Link>
    )
  }

  // Strip the "LNN · " prefix from the next-lecture title for a tighter card.
  const shortTitle = next.title

  return (
    <NextUpCard
      href={`/${next.slug}`}
      title={shortTitle}
    />
  )
}

function NextUpCard({
  href,
  title,
  blurb,
}: {
  href: string
  title: string
  blurb?: string
}) {
  return (
    <Link
      href={href}
      className="group mt-8 block rounded-lg border border-border bg-bg-elevated px-5 py-4 transition-colors hover:border-accent/50 hover:bg-accent-soft/30"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <span className="text-sm text-fg-subtle">Επόμενο</span>
          <div className="truncate text-base font-semibold tracking-tight">
            {title}
          </div>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-fg-muted transition-transform group-hover:translate-x-1 group-hover:text-accent" />
      </div>
      {blurb ? (
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">{blurb}</p>
      ) : null}
    </Link>
  )
}
