'use client'

import Link from 'next/link'
import { useEffect, useMemo } from 'react'
import {
  ChevronRight,
  CheckCircle2,
  Circle,
  CircleDashed,
  Trophy,
} from 'lucide-react'
import { CHAPTERS, ALL_SECTIONS, AVAILABLE_COUNT } from '@/lib/content-index'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

/**
 * The "Όλη η ύλη" block on the homepage. It renders the full syllabus AND
 * overlays the reader's personal progress (sections marked complete, stored
 * in localStorage via the app store) — a green check on every finished
 * section, a per-chapter bar, and one headline bar for the whole site.
 *
 * Client component: progress lives in localStorage, so it can only be read
 * after hydration. Until then everything renders at "0 done" (matching SSR),
 * then fills in — the bars animate from empty to their real width.
 */
export function SyllabusProgress() {
  const completed = useAppStore((s) => s.completed)
  const hydrated = useAppStore((s) => s.hydrated)
  const hydrate = useAppStore((s) => s.hydrate)

  // Idempotent — the store guards against re-hydrating. We call it here too
  // (not only from the header's ThemeToggle) so this block is self-sufficient.
  useEffect(() => {
    hydrate()
  }, [hydrate])

  const completedCount = useMemo(() => {
    if (!hydrated) return 0
    let n = 0
    for (const s of ALL_SECTIONS) if (s.available && completed.has(s.slug)) n++
    return n
  }, [completed, hydrated])

  const pct =
    AVAILABLE_COUNT > 0 ? Math.round((completedCount / AVAILABLE_COUNT) * 100) : 0
  const availablePct = Math.round((AVAILABLE_COUNT / ALL_SECTIONS.length) * 100)
  const allDone =
    hydrated && AVAILABLE_COUNT > 0 && completedCount === AVAILABLE_COUNT

  return (
    <section className="mx-auto mt-14 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-2xl font-bold tracking-tight">Όλη η ύλη</h2>
          <span className="text-sm text-fg-muted">
            <span className="font-mono tabular-nums text-fg">
              {AVAILABLE_COUNT}/{ALL_SECTIONS.length}
            </span>{' '}
            διαθέσιμες ({availablePct}%)
          </span>
        </div>

        {/* Your progress — the encouraging headline bar */}
        <div className="mt-4 rounded-xl border border-border bg-bg-elevated p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
              {allDone ? (
                <Trophy className="h-4 w-4 text-amber-500" aria-hidden />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-success" aria-hidden />
              )}
              {allDone ? 'Τα διάβασες όλα! 🎉' : 'Η πρόοδός σου'}
            </span>
            <span className="text-sm text-fg-muted">
              <span className="font-mono tabular-nums text-fg">
                {hydrated ? completedCount : '—'}/{AVAILABLE_COUNT}
              </span>{' '}
              ολοκληρωμένες
              {hydrated && (
                <span className="ml-1 text-fg-subtle">· {pct}%</span>
              )}
            </span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-bg-soft"
            role="progressbar"
            aria-valuenow={hydrated ? pct : 0}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Πρόοδος ολοκλήρωσης ενοτήτων"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-success to-emerald-400 transition-[width] duration-700 ease-out"
              style={{ width: hydrated ? `${pct}%` : '0%' }}
            />
          </div>
          {hydrated && completedCount === 0 && (
            <p className="mt-2 text-xs text-fg-subtle">
              Καθώς διαβάζεις, σήμανε κάθε ενότητα ως «ολοκληρωμένη» — θα τη
              βλέπεις να γεμίζει εδώ.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHAPTERS.map((c) => {
          const availableSecs = c.sections.filter((s) => s.available)
          const availableCount = availableSecs.length
          const doneCount = hydrated
            ? availableSecs.filter((s) => completed.has(s.slug)).length
            : 0
          const chapterPct =
            availableCount > 0
              ? Math.round((doneCount / availableCount) * 100)
              : 0
          const chapterAllDone =
            hydrated && availableCount > 0 && doneCount === availableCount
          return (
            <article
              key={c.id}
              className="flex flex-col rounded-xl border border-border bg-bg-elevated p-4 transition hover:border-border/80"
            >
              <header className="mb-3 flex items-baseline justify-between gap-3">
                <h3 className="font-semibold tracking-tight">{c.title}</h3>
                {availableCount === 0 ? (
                  <span className="shrink-0 rounded-full bg-bg-soft px-2 py-0.5 text-[11px] uppercase tracking-wider text-fg-subtle">
                    σύντομα
                  </span>
                ) : (
                  <span
                    className={cn(
                      'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-mono tabular-nums',
                      chapterAllDone
                        ? 'bg-success/15 text-success'
                        : doneCount === 0
                          ? 'bg-bg-soft text-fg-subtle'
                          : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
                    )}
                  >
                    {chapterAllDone && (
                      <CheckCircle2 className="h-3 w-3" aria-hidden />
                    )}
                    {doneCount}/{availableCount}
                  </span>
                )}
              </header>
              {c.blurb && <p className="mb-3 text-xs text-fg-muted">{c.blurb}</p>}
              <ul className="space-y-1">
                {c.sections.map((s) => {
                  const done = hydrated && s.available && completed.has(s.slug)
                  return (
                    <li key={s.slug}>
                      {s.available ? (
                        <Link
                          href={`/${s.slug}`}
                          className={cn(
                            'group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition hover:bg-accent/5',
                            done && 'bg-success/5',
                          )}
                        >
                          {done ? (
                            <CheckCircle2
                              className="h-3.5 w-3.5 shrink-0 text-success"
                              aria-label="Ολοκληρωμένο"
                            />
                          ) : (
                            <Circle
                              className="h-3.5 w-3.5 shrink-0 text-fg-subtle/40"
                              aria-hidden
                            />
                          )}
                          <span
                            className={cn(
                              'flex-1 truncate',
                              done
                                ? 'text-fg'
                                : 'text-fg-muted group-hover:text-accent',
                            )}
                          >
                            {s.title}
                          </span>
                          <ChevronRight
                            className="h-3.5 w-3.5 shrink-0 text-fg-subtle opacity-0 transition group-hover:translate-x-0.5 group-hover:text-accent group-hover:opacity-100"
                            aria-hidden
                          />
                        </Link>
                      ) : (
                        <div className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm">
                          <CircleDashed
                            className="h-3.5 w-3.5 shrink-0 text-fg-subtle/40"
                            aria-hidden
                          />
                          <span className="flex-1 truncate text-fg-subtle/60">
                            {s.title}
                          </span>
                          <span className="shrink-0 rounded-full bg-bg-soft px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-fg-subtle">
                            σύντομα
                          </span>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
              {availableCount > 0 && (
                <div className="mt-auto pt-3">
                  <div className="h-1.5 overflow-hidden rounded-full bg-bg-soft">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-success to-emerald-400 transition-[width] duration-700 ease-out"
                      style={{ width: `${chapterPct}%` }}
                    />
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
