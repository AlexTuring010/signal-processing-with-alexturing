import type { ReactNode } from 'react'
import { Sparkles, ListOrdered, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

type Variant = 'concept' | 'summary'

type Props = {
  title?: string
  variant?: Variant
  /** Short identifiers/phrases the student should be able to recite. */
  keywords?: ReactNode[]
  /** Skeleton procedure — the numbered "if I were doing this from scratch" steps. */
  skeleton?: ReactNode[]
  /** The single most common mistake to watch out for. */
  trap?: ReactNode
  /** Any extra prose. Rendered after the structured sections. */
  children?: ReactNode
}

/**
 * Συμπύκνωσε — structured recall scaffold (the third stage of the SP teaching loop).
 *
 * `concept` variant is inserted mid-page where a key formula is introduced; `summary`
 * variant is the at-the-end of a chapter wrap-up. The shape is the same: keywords,
 * skeleton steps, the trap.
 */
export function RecallCard({
  title,
  variant = 'concept',
  keywords,
  skeleton,
  trap,
  children,
}: Props) {
  const defaultTitle = variant === 'summary' ? 'Συμπύκνωσε όλο το κεφάλαιο' : 'Συμπύκνωσε'
  const heading = title ?? defaultTitle

  return (
    <section
      className={cn(
        'not-prose my-6 rounded-lg border px-5 py-4',
        variant === 'summary'
          ? 'border-violet-400/50 bg-gradient-to-br from-violet-50/70 to-fuchsia-50/40 dark:border-violet-400/40 dark:from-violet-400/10 dark:to-fuchsia-400/5'
          : 'border-amber-300/60 bg-amber-50/60 dark:border-amber-400/30 dark:bg-amber-400/10',
      )}
    >
      <header className="mb-3 flex items-center gap-2">
        <Sparkles
          className={cn(
            'h-4 w-4 shrink-0',
            variant === 'summary'
              ? 'text-violet-600 dark:text-violet-300'
              : 'text-amber-600 dark:text-amber-300',
          )}
          aria-hidden="true"
        />
        <h3 className="text-sm font-semibold tracking-tight">{heading}</h3>
      </header>

      {keywords && keywords.length > 0 && (
        <div className="mb-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            Λέξεις-κλειδιά
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {keywords.map((k, i) => (
              <li
                key={i}
                className="rounded-full border border-border bg-bg-elevated px-2.5 py-0.5 text-xs font-medium text-fg"
              >
                {k}
              </li>
            ))}
          </ul>
        </div>
      )}

      {skeleton && skeleton.length > 0 && (
        <div className="mb-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            <ListOrdered className="h-3 w-3" aria-hidden="true" />
            Βήματα
          </div>
          <ol className="ml-5 list-decimal space-y-1 text-[0.95rem] leading-relaxed marker:text-fg-subtle">
            {skeleton.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      )}

      {trap && (
        <div className="rounded-md border border-red-300/50 bg-red-50/70 px-3 py-2 text-[0.92rem] leading-relaxed dark:border-red-400/40 dark:bg-red-400/10">
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-red-700 dark:text-red-300">
            <TriangleAlert className="h-3 w-3" aria-hidden="true" />
            Η συχνότερη παγίδα
          </div>
          {trap}
        </div>
      )}

      {children && (
        <div className="mt-3 text-[0.95rem] leading-relaxed">{children}</div>
      )}
    </section>
  )
}
