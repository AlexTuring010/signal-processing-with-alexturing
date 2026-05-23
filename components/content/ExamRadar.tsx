'use client'

import { useMemo, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Radar, GraduationCap, Repeat } from 'lucide-react'
import { EXERCISES } from '@/content/practice/exercises'
import {
  SOURCE_LABELS,
  TOPIC_COLORS,
  TOPIC_LABELS,
  type Exercise,
  type ExamSource,
  type Topic,
} from '@/content/practice/types'
import { cn } from '@/lib/utils'

export type Likelihood = 'high' | 'medium' | 'low'

export type ExamRadarEntry =
  | string
  | { id: string; likelihood?: Likelihood; note?: ReactNode }

type Props = {
  /** Filter the auto-derivation to this topic. Omitted means any topic. */
  topic?: Topic
  /**
   * Page slug to match against `exercise.prerequisites`. Defaults to the
   * current pathname so the radar self-targets when dropped into an MDX page.
   */
  slug?: string
  /** Explicit problem list. When set, auto-derivation is skipped. */
  ids?: ExamRadarEntry[]
  /** Cap the rendered list. Default 6. */
  limit?: number
  title?: string
}

const LIKELIHOOD_STYLES: Record<Likelihood, { dot: string; label: string }> = {
  high: { dot: 'bg-rose-500', label: 'Ψηλή πιθανότητα' },
  medium: { dot: 'bg-amber-500', label: 'Μεσαία πιθανότητα' },
  low: { dot: 'bg-slate-400', label: 'Χαμηλή πιθανότητα' },
}

const SOURCE_RECENCY: Record<ExamSource, number> = {
  'proodos-april-2026': 6,
  'jan-2026': 5,
  'sept-2025': 4,
  'june-2025': 3,
  'proodos-b-2025': 2,
  'proodos-a-2025': 1,
}

type Row = { ex: Exercise; likelihood: Likelihood; note?: ReactNode }

function recencyOf(ex: Exercise): number {
  return ex.source ? (SOURCE_RECENCY[ex.source] ?? 0) : 0
}

function normaliseEntry(entry: ExamRadarEntry): { id: string; likelihood?: Likelihood; note?: ReactNode } {
  return typeof entry === 'string' ? { id: entry } : entry
}

/**
 * Αναγνώρισε — "where this concept actually shows up on past exams" radar.
 *
 * Two modes:
 *   - **Auto-derive** (default): filter `EXERCISES` by `topic` + prereq-includes-slug,
 *     sort by recency, assign likelihood from recency. Drop into an MDX page with
 *     just `<ExamRadar topic="am" />` and it picks up the current slug from the URL.
 *   - **Manual**: pass `ids={[...]}` to curate the list and override likelihood.
 *
 * Each row links to `/practice#exercise:<id>` (the canonical browse surface).
 */
export function ExamRadar({
  topic,
  slug: slugProp,
  ids,
  limit = 6,
  title = 'Πού εμφανίζεται στα παλιά θέματα',
}: Props) {
  const pathname = usePathname() ?? ''
  const slug = (slugProp ?? pathname).replace(/^\//, '')

  const rows: Row[] = useMemo(() => {
    if (ids && ids.length > 0) {
      const byId = new Map(EXERCISES.map((e) => [e.id, e] as const))
      const explicit: Row[] = []
      for (const entry of ids) {
        const m = normaliseEntry(entry)
        const ex = byId.get(m.id)
        if (!ex) continue
        explicit.push({
          ex,
          likelihood: m.likelihood ?? 'medium',
          note: m.note,
        })
        if (explicit.length >= limit) break
      }
      return explicit
    }

    const matched = EXERCISES.filter((ex) => {
      if (topic && ex.topic !== topic) return false
      if (slug.length > 0 && !ex.prerequisites.includes(slug)) return false
      return true
    })

    matched.sort((a, b) => {
      const diff = recencyOf(b) - recencyOf(a)
      if (diff !== 0) return diff
      return (b.weight ?? 0) - (a.weight ?? 0)
    })

    return matched.slice(0, limit).map<Row>((ex) => {
      const r = recencyOf(ex)
      const likelihood: Likelihood = r >= 5 ? 'high' : r >= 3 ? 'medium' : 'low'
      return { ex, likelihood }
    })
  }, [ids, topic, slug, limit])

  if (rows.length === 0) {
    return (
      <section className="not-prose my-6 rounded-lg border border-dashed border-border bg-bg-soft px-5 py-4 text-sm text-fg-muted">
        <header className="mb-1 flex items-center gap-2">
          <Radar className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="font-semibold tracking-tight">{title}</span>
        </header>
        Δεν εντοπίστηκαν παλιά θέματα για αυτή την ενότητα ακόμα.
      </section>
    )
  }

  return (
    <section className="not-prose my-6 rounded-lg border border-fuchsia-400/40 bg-fuchsia-50/40 px-5 py-4 dark:border-fuchsia-400/30 dark:bg-fuchsia-400/5">
      <header className="mb-3 flex items-center gap-2">
        <Radar
          className="h-4 w-4 shrink-0 text-fuchsia-600 dark:text-fuchsia-300"
          aria-hidden="true"
        />
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      </header>

      <ul className="space-y-1.5">
        {rows.map(({ ex, likelihood, note }) => {
          const style = LIKELIHOOD_STYLES[likelihood]
          return (
            <li key={ex.id}>
              <Link
                href={`/practice#exercise:${ex.id}`}
                className="group flex items-center gap-3 rounded-md border border-border bg-bg-elevated px-3 py-2 text-left transition hover:border-fuchsia-400/50 hover:bg-fuchsia-50/40 dark:hover:bg-fuchsia-400/10"
              >
                <span
                  className={cn(
                    'inline-block h-2 w-2 shrink-0 rounded-full',
                    style.dot,
                  )}
                  aria-hidden="true"
                  title={style.label}
                />
                {ex.origin === 'past-exam' && (
                  <GraduationCap
                    className="h-3.5 w-3.5 shrink-0 text-fg-subtle"
                    aria-hidden="true"
                  />
                )}
                {ex.repeatGroup && (
                  <Repeat
                    className="h-3.5 w-3.5 shrink-0 text-fuchsia-500 dark:text-fuchsia-300"
                    aria-hidden="true"
                  />
                )}
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block truncate font-medium text-fg group-hover:text-fuchsia-700 dark:group-hover:text-fuchsia-300">
                    {ex.title}
                  </span>
                  {note && (
                    <span className="mt-0.5 block text-[0.85em] text-fg-muted">
                      {note}
                    </span>
                  )}
                </span>
                {ex.source && (
                  <span className="hidden shrink-0 rounded-full border border-purple-500/40 bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:text-purple-300 sm:inline">
                    {SOURCE_LABELS[ex.source]}
                  </span>
                )}
                {ex.problemNumber && (
                  <span className="hidden shrink-0 rounded-full border border-border bg-bg-soft px-2 py-0.5 text-[10px] font-mono font-semibold text-fg-muted sm:inline">
                    {ex.problemNumber}
                  </span>
                )}
                <span
                  className={cn(
                    'hidden shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:inline',
                    TOPIC_COLORS[ex.topic],
                  )}
                >
                  {TOPIC_LABELS[ex.topic]}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
