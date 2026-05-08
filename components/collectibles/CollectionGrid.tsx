'use client'

import { useEffect } from 'react'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCollectiblesStore } from '@/lib/collectibles/store'
import { COLLECTIBLES } from '@/lib/collectibles/registry'
import type { Collectible } from '@/lib/collectibles/types'
import { ItemPreview } from './ItemPreview'

type Chapter =
  | 'Intro'
  | 'Foundations'
  | 'Modulation (AM)'
  | 'Modulation (FM)'
  | 'Randomness'
  | 'Noise'
  | 'Reference'
  | 'Modulation'
  | 'Special'

const CHAPTER_ORDER: Chapter[] = [
  'Intro',
  'Foundations',
  'Reference',
  'Modulation',
  'Modulation (AM)',
  'Modulation (FM)',
  'Randomness',
  'Noise',
  'Special',
]

function chapterFor(item: Collectible): Chapter {
  if (item.source.kind !== 'page') return 'Special'
  const slug = item.source.slug
  if (slug === 'intro') return 'Intro'
  if (slug.startsWith('foundations/')) return 'Foundations'
  if (slug.startsWith('reference/')) return 'Reference'
  if (slug.startsWith('am/')) return 'Modulation (AM)'
  if (slug.startsWith('fm/')) return 'Modulation (FM)'
  if (slug.startsWith('randomness/')) return 'Randomness'
  if (slug.startsWith('noise/')) return 'Noise'
  if (slug.startsWith('modulation/')) return 'Modulation'
  return 'Special'
}

/**
 * The /collection index. Chapter-grouped catalog of every shipped
 * collectible: full sprites for items the player has found,
 * silhouettes for the rest. Visiting this page clears `newSinceSeen`
 * so the pet button's orange "new item" dot dismisses.
 */
export function CollectionGrid() {
  const found = useCollectiblesStore((s) => s.state.found)
  const hydrated = useCollectiblesStore((s) => s.hydrated)
  const markAllSeen = useCollectiblesStore((s) => s.markAllSeen)

  useEffect(() => {
    if (hydrated) markAllSeen()
  }, [hydrated, markAllSeen])

  // Drop the `_test-*` debug placeholders so they never appear in the
  // public-facing collection.
  const items = COLLECTIBLES.filter((c) => !c.id.startsWith('_'))

  // Group by chapter.
  const groups = new Map<Chapter, Collectible[]>()
  for (const item of items) {
    const ch = chapterFor(item)
    if (!groups.has(ch)) groups.set(ch, [])
    groups.get(ch)!.push(item)
  }

  const total = items.length
  const foundCount = items.filter((c) => found[c.id]).length
  const fraction = total === 0 ? 0 : foundCount / total

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="mb-6 flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Συλλογή</h1>
        <p className="text-sm text-fg-muted">
          Συλλεκτικά κρυμμένα στις σελίδες του site. Διάβασε, βρες, ντύσε
          το {`Σιγμάκι`} ή διακόσμησε το δωμάτιό του.
        </p>
        <ProgressBar found={foundCount} total={total} fraction={fraction} />
      </header>

      <div className="flex flex-col gap-6">
        {CHAPTER_ORDER.filter((ch) => groups.has(ch)).map((ch) => (
          <ChapterGroup
            key={ch}
            title={ch}
            items={groups.get(ch)!}
            found={found}
          />
        ))}
      </div>
    </div>
  )
}

function ProgressBar({
  found,
  total,
  fraction,
}: {
  found: number
  total: number
  fraction: number
}) {
  const pct = Math.round(fraction * 100)
  const milestone =
    pct >= 100 ? 'gold' : pct >= 75 ? 'high' : pct >= 50 ? 'mid' : 'low'

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold tabular-nums">
          {found} / {total}
        </span>
        <span className="text-xs text-fg-muted tabular-nums">{pct}%</span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-bg-soft">
        <div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full transition-[width,background] duration-500',
            milestone === 'gold' && 'bg-warn',
            milestone === 'high' && 'bg-success',
            milestone === 'mid' && 'bg-accent',
            milestone === 'low' && 'bg-accent/70',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function ChapterGroup({
  title,
  items,
  found,
}: {
  title: Chapter
  items: Collectible[]
  found: Record<string, number>
}) {
  const foundInGroup = items.filter((c) => found[c.id]).length
  return (
    <section className="rounded-xl border border-border bg-bg-elevated p-4">
      <header className="mb-3 flex items-baseline justify-between">
        <h2 className="text-base font-semibold">{title}</h2>
        <span className="text-xs text-fg-muted tabular-nums">
          {foundInGroup} / {items.length}
        </span>
      </header>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} found={Boolean(found[item.id])} />
        ))}
      </div>
    </section>
  )
}

function ItemCard({ item, found }: { item: Collectible; found: boolean }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-colors',
        found
          ? 'border-success/30 bg-success/5'
          : 'border-border bg-bg-soft/40',
      )}
    >
      <div className="relative h-16 w-16">
        <ItemPreview item={item} silhouette={!found} size={64} />
        {!found && (
          <span className="absolute right-0 top-0 inline-flex h-4 w-4 items-center justify-center rounded-full bg-bg-elevated text-fg-subtle">
            <Lock className="h-2.5 w-2.5" aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="flex w-full flex-col items-center text-center leading-tight">
        <span
          className={cn(
            'truncate text-[11px] font-medium',
            found ? 'text-fg' : 'text-fg-subtle',
          )}
          title={found ? item.name : '???'}
        >
          {found ? item.name : '???'}
        </span>
        <span className="text-[9px] uppercase tracking-wider text-fg-subtle">
          {sourceHint(item)}
        </span>
      </div>
    </div>
  )
}

function sourceHint(item: Collectible): string {
  switch (item.source.kind) {
    case 'page':
      return chapterFor(item)
    case 'achievement':
      return 'Επίτευγμα'
    case 'time':
      return 'Χρονικό'
    case 'event':
      return 'Συμβάν'
  }
}
