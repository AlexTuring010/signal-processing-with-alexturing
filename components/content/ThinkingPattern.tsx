import type { ReactNode } from 'react'
import { Radar, Quote } from 'lucide-react'

type Props = {
  title?: string
  /** Phrases / wordings in an exam statement that should trigger this technique. */
  signals: ReactNode[]
  /** Prose explanation — what the student does once they recognise the pattern. */
  children: ReactNode
}

/**
 * Αναγνώρισε — explicit "if you see X in the wording, you reach for Y" card.
 * The signals chips render the trigger phrases; the prose explains why they
 * point to the technique on this page.
 */
export function ThinkingPattern({
  title = 'Πώς θα το αναγνωρίσεις',
  signals,
  children,
}: Props) {
  return (
    <section className="not-prose my-6 rounded-lg border border-teal-400/50 bg-teal-50/50 px-5 py-4 dark:border-teal-400/40 dark:bg-teal-400/10">
      <header className="mb-3 flex items-center gap-2">
        <Radar
          className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-300"
          aria-hidden="true"
        />
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      </header>

      {signals.length > 0 && (
        <div className="mb-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            <Quote className="h-3 w-3" aria-hidden="true" />
            Αν δεις στην εκφώνηση
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {signals.map((s, i) => (
              <li
                key={i}
                className="rounded-full border border-teal-500/40 bg-bg-elevated px-2.5 py-0.5 text-[0.85rem] font-medium text-teal-800 dark:text-teal-200"
              >
                «{s}»
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-[0.95rem] leading-relaxed">{children}</div>
    </section>
  )
}
