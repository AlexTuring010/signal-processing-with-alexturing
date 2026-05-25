/**
 * RelatedPair — exam ↔ frontistirio pattern citation.
 *
 * Renders inside a problem's `solution` JSX (in `content/practice/exercises.tsx`)
 * to say «this problem is the same pattern as that one, in different clothing».
 * The user's framing: «almost every exam has at least one problem that
 * rewrites a frontistirio problem in a different costume.» This component is
 * how the site surfaces those rewrites bidirectionally.
 *
 * Phase E.3 component. Server component, zero client JS shipped. Deep-links
 * to `/practice#exercise:<id>` for each paired entry. Each entry's header is
 * read from the EXERCISES bank (date label + problemNumber + stripped title +
 * Flame chip when the source is in 2024/2025).
 *
 * Two relationship modes:
 * - `definite` (default) — «Ίδια άσκηση, άλλο όνομα». The same algorithm under
 *   a different cover story (e.g. ύποπτη κάρτα ⇔ πλειοψηφικό στοιχείο, ad
 *   slots ⇔ 0/1 σακίδιο).
 * - `analogy` — «Ίδιο μοτίβο, άλλη γωνία». Same technique with one parameter
 *   changed (e.g. SPT for Σ wait time ⇔ LPT for makespan — same exchange
 *   argument, opposite sort key).
 *
 * Visual signal is indigo + violet gradient — distinct from the rose-tinted
 * `<ExamProblem>` citation and from every `<Callout>` tone. Students should
 * notice this block immediately.
 */

import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  Link2,
  GitCompareArrows,
  Flame,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react'
import { EXERCISES } from '@/content/practice/exercises'
import { SOURCE_LABELS, RECENT_SOURCES } from '@/content/practice/types'

type Relationship = 'definite' | 'analogy'

type Props = {
  /**
   * Short pattern name — the one-sentence label that binds the paired
   * problems together. e.g. «Πλειοψηφικό στοιχείο με D&C», «0/1 σακίδιο
   * (literal ή disguised)», «Exchange argument στον προγραμματισμό εργασιών».
   */
  patternName: string
  /**
   * Bank ids of the paired entries (NOT including the current problem the
   * `<RelatedPair>` is embedded in). Triples and larger clusters supported.
   */
  pairs: { id: string }[]
  /**
   * One-sentence recognition cue. «Αν δεις X στην εκφώνηση, σκέψου Y.»
   * Free-form ReactNode so the author can mix InlineMath / `<strong>` / lists.
   */
  cue: ReactNode
  /** Relationship strength — adjusts the banner text. Defaults to `definite`. */
  relationship?: Relationship
}

const BANNER: Record<Relationship, { label: string; icon: typeof Link2 }> = {
  definite: { label: 'Ίδια άσκηση, άλλο όνομα', icon: Link2 },
  analogy: { label: 'Ίδιο μοτίβο, άλλη γωνία', icon: GitCompareArrows },
}

/** Strip the bank-convention leading `'<Date> · Θέμα X — '` prefix.
 * The pair-row header already renders `source` + `problemNumber`; without
 * stripping, the title line would echo them. Mirrors the helper in
 * `ExamProblem.tsx`. */
function stripBankTitlePrefix(title: string): string {
  const sep = ' — '
  const idx = title.indexOf(sep)
  return idx >= 0 ? title.slice(idx + sep.length) : title
}

export function RelatedPair({
  patternName,
  pairs,
  cue,
  relationship = 'definite',
}: Props) {
  const { label: bannerLabel, icon: BannerIcon } = BANNER[relationship]

  const resolved = pairs.map((p) => {
    const ex = EXERCISES.find((e) => e.id === p.id)
    return { id: p.id, ex }
  })

  const missingIds = resolved.filter((r) => !r.ex).map((r) => r.id)
  if (missingIds.length > 0 && process.env.NODE_ENV !== 'production') {
    return (
      <aside
        className="not-prose my-5 rounded-lg border-l-4 border-l-amber-500 border-amber-300/60 bg-amber-50/70 px-4 py-3 text-sm text-amber-900 shadow-sm dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100"
        role="note"
      >
        <span className="inline-flex items-center gap-2 font-mono text-xs">
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {'<RelatedPair pairs={[…]}>'} — δεν βρέθηκαν στο practice bank:{' '}
          {missingIds.join(', ')}
        </span>
      </aside>
    )
  }

  const validPairs = resolved.filter(
    (r): r is { id: string; ex: NonNullable<typeof r.ex> } => Boolean(r.ex),
  )

  if (validPairs.length === 0) {
    return null
  }

  return (
    <aside className="not-prose my-6 overflow-hidden rounded-lg border border-l-4 border-l-indigo-500 border-indigo-300/60 bg-gradient-to-br from-indigo-50/70 to-violet-50/40 shadow-sm dark:border-indigo-400/30 dark:from-indigo-400/10 dark:to-violet-400/5">
      <div className="px-4 py-3.5">
        {/* Banner */}
        <div className="mb-1.5 flex items-center gap-2">
          <BannerIcon
            className="h-3.5 w-3.5 shrink-0 text-indigo-700 dark:text-indigo-300"
            aria-hidden="true"
          />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            {bannerLabel}
          </span>
        </div>

        {/* Pattern name */}
        <p className="mb-3 text-[1.05rem] font-semibold leading-snug text-indigo-950 dark:text-indigo-50">
          {patternName}
        </p>

        {/* List of paired problems — each row a deep-link */}
        <ul className="not-prose mb-3 space-y-1.5">
          {validPairs.map(({ ex }) => {
            const sourceLabel = ex.source ? SOURCE_LABELS[ex.source] : null
            const isRecent = ex.source ? RECENT_SOURCES.has(ex.source) : false
            const recentYear =
              ex.source && ex.source.endsWith('-2025') ? '2025' : '2024'
            const displayTitle = stripBankTitlePrefix(ex.title)

            return (
              <li key={ex.id}>
                <Link
                  href={`/practice#exercise:${ex.id}`}
                  className="group flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-md px-2 py-1.5 text-[0.95rem] leading-snug text-indigo-950 transition-colors hover:bg-indigo-100/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:text-indigo-50 dark:hover:bg-indigo-400/15"
                >
                  <ArrowRight
                    className="h-3.5 w-3.5 shrink-0 translate-y-0.5 text-indigo-500 transition-transform group-hover:translate-x-0.5 dark:text-indigo-300"
                    aria-hidden="true"
                  />
                  {sourceLabel && (
                    <span className="font-semibold">{sourceLabel}</span>
                  )}
                  {ex.problemNumber && (
                    <span className="font-mono text-[0.85rem] text-indigo-800/90 dark:text-indigo-200/90">
                      · {ex.problemNumber}
                    </span>
                  )}
                  <span className="italic">— {displayTitle}</span>
                  {isRecent && (
                    <span
                      className="inline-flex items-center gap-1 rounded-full border border-rose-500/60 bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
                      title="Πρόσφατο θέμα — υψηλή προτεραιότητα"
                    >
                      <Flame className="h-2.5 w-2.5" aria-hidden="true" />
                      {recentYear}
                    </span>
                  )}
                  {ex.weight != null && (
                    <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-indigo-700 dark:text-indigo-200">
                      {ex.weight}%
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Recognition cue */}
        <div className="rounded-md border border-indigo-300/40 bg-white/60 px-3 py-2 text-[0.9rem] leading-relaxed text-indigo-950/90 dark:border-indigo-400/20 dark:bg-indigo-950/30 dark:text-indigo-50/90 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          <span className="mr-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            Σήμα στην εκφώνηση
          </span>
          {cue}
        </div>
      </div>
    </aside>
  )
}
