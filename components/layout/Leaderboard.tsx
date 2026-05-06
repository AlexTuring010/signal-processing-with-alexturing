'use client'

import { useEffect, useMemo, useState } from 'react'
import { Trophy, Award } from 'lucide-react'
import { readAllComments, CATEGORY_LABELS } from './Comments'

/**
 * "Top Contributors" leaderboard, computed locally from all comments
 * across all pages (localStorage). Authors get points only for reviewed
 * comments — see plans/COMMENTS_LOOP.md.
 *
 * Self-contained: reads localStorage on mount, aggregates per-author.
 * No backend, no real cross-device leaderboard yet.
 */

type Entry = {
  author: string
  totalPoints: number
  contributions: number
  byCategory: Record<string, number>
}

export function Leaderboard() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const all = readAllComments()
    const map = new Map<string, Entry>()
    for (const c of all) {
      if (c.author === 'Claude') continue // exclude AI account
      if (c.pointsAwarded == null || c.pointsAwarded <= 0) continue
      const existing = map.get(c.author) ?? {
        author: c.author,
        totalPoints: 0,
        contributions: 0,
        byCategory: {},
      }
      existing.totalPoints += c.pointsAwarded
      existing.contributions += 1
      const cat = c.category ?? 'unspecified'
      existing.byCategory[cat] = (existing.byCategory[cat] ?? 0) + 1
      map.set(c.author, existing)
    }
    const list = [...map.values()].sort((a, b) => b.totalPoints - a.totalPoints)
    setEntries(list)
    setHydrated(true)
  }, [])

  const total = useMemo(
    () => entries.reduce((s, e) => s + e.totalPoints, 0),
    [entries],
  )

  if (!hydrated) {
    return null
  }

  return (
    <section className="rounded-xl border border-border bg-bg-elevated p-5">
      <header className="mb-3 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber-500" aria-hidden />
        <h2 className="text-base font-semibold tracking-tight">
          Top Contributors
        </h2>
        <span className="ml-auto text-xs text-fg-subtle">
          {entries.length} contributors · {total} συνολικοί πόντοι
        </span>
      </header>
      <p className="mb-4 text-xs leading-relaxed text-fg-muted">
        Πόντοι δίνονται μόνο μετά από review. Οι κατηγορίες:{' '}
        <em>έγκυρη διόρθωση</em> (+8), <em>χρήσιμη διευκρίνηση</em> (+5),{' '}
        <em>καλή πρόταση</em> (+5), <em>συχνή παρανόηση</em> (+3),{' '}
        <em>λάθος αλλά αποκαλυπτικό</em> (+1). Spam, low-effort, ασαφή = 0.
      </p>
      {entries.length === 0 ? (
        <p className="text-sm italic text-fg-subtle">
          Κανένα reviewed σχόλιο ακόμα. Άσε feedback και κάνε contributor!
        </p>
      ) : (
        <ol className="space-y-2">
          {entries.slice(0, 20).map((e, i) => (
            <li
              key={e.author}
              className="flex items-center gap-3 rounded-lg border border-border bg-bg-soft/40 p-3"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold ${
                  i === 0
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300'
                    : i === 1
                      ? 'bg-zinc-400/20 text-zinc-600 dark:text-zinc-300'
                      : i === 2
                        ? 'bg-orange-700/20 text-orange-700 dark:text-orange-300'
                        : 'bg-bg-soft text-fg-subtle'
                }`}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-fg">{e.author}</div>
                <div className="text-[11px] text-fg-muted">
                  {e.contributions} reviewed contribution{e.contributions === 1 ? '' : 's'} ·{' '}
                  {Object.entries(e.byCategory)
                    .map(
                      ([k, v]) =>
                        `${v}× ${CATEGORY_LABELS[k as keyof typeof CATEGORY_LABELS] ?? k}`,
                    )
                    .join(', ')}
                </div>
              </div>
              <div className="inline-flex items-center gap-1 rounded-md border border-purple-500/40 bg-purple-500/10 px-2 py-1 text-sm font-bold text-purple-700 dark:text-purple-300">
                <Award className="h-3.5 w-3.5" aria-hidden />
                {e.totalPoints}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
