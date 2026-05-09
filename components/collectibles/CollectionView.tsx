'use client'

import { useEffect } from 'react'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCollectiblesStore } from '@/lib/collectibles/store'
import {
  COLLECTIBLES,
  isWearable,
  isDecoration,
} from '@/lib/collectibles/registry'
import type { Collectible } from '@/lib/collectibles/types'
import { ItemPreview } from './ItemPreview'

type Chapter =
  | 'Intro'
  | 'Foundations'
  | 'Modulation'
  | 'AM'
  | 'FM'
  | 'Randomness'
  | 'Noise'
  | 'Reference'
  | 'Special'

const CHAPTER_ORDER: Chapter[] = [
  'Intro',
  'Foundations',
  'Reference',
  'Modulation',
  'AM',
  'FM',
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
  if (slug.startsWith('am/')) return 'AM'
  if (slug.startsWith('fm/')) return 'FM'
  if (slug.startsWith('randomness/')) return 'Randomness'
  if (slug.startsWith('noise/')) return 'Noise'
  if (slug.startsWith('modulation/')) return 'Modulation'
  return 'Special'
}

/**
 * In-panel Collection view — purely the chapter-grouped catalog grid.
 * The pet stage above (rendered by PetPanel itself) is the room: any
 * decoration the player toggles on shows up there, persistent across
 * panel modes.
 *
 * Tapping a found wearable equips/unequips it; tapping a found
 * decoration toggles it on the pet stage. Unfound items are
 * silhouettes and don't respond to taps.
 */
export function CollectionView() {
  const found = useCollectiblesStore((s) => s.state.found)
  const equipped = useCollectiblesStore((s) => s.state.equipped)
  const placed = useCollectiblesStore((s) => s.state.placed)
  const setEquipped = useCollectiblesStore((s) => s.setEquipped)
  const togglePlaced = useCollectiblesStore((s) => s.togglePlaced)
  const hydrated = useCollectiblesStore((s) => s.hydrated)
  const markAllSeen = useCollectiblesStore((s) => s.markAllSeen)

  useEffect(() => {
    if (hydrated) markAllSeen()
  }, [hydrated, markAllSeen])

  function handleItemTap(item: Collectible) {
    if (!found[item.id]) return
    if (isWearable(item)) {
      const isEquipped = equipped[item.slot] === item.id
      setEquipped(item.slot, isEquipped ? null : item.id)
      return
    }
    togglePlaced(item.id)
  }

  // Drop the `_test-*` debug placeholders.
  const items = COLLECTIBLES.filter((c) => !c.id.startsWith('_'))
  const groups = new Map<Chapter, Collectible[]>()
  for (const it of items) {
    const ch = chapterFor(it)
    if (!groups.has(ch)) groups.set(ch, [])
    groups.get(ch)!.push(it)
  }
  const totalFound = items.filter((c) => found[c.id]).length

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between px-1 text-[10px] uppercase tracking-wider text-fg-subtle">
        <span>Συλλογή</span>
        <span className="tabular-nums">
          {totalFound} / {items.length}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {CHAPTER_ORDER.filter((ch) => groups.has(ch)).map((ch) => (
          <ChapterGroup
            key={ch}
            title={ch}
            items={groups.get(ch)!}
            found={found}
            equipped={equipped}
            placed={placed}
            onTap={handleItemTap}
          />
        ))}
      </div>
    </div>
  )
}

function ChapterGroup({
  title,
  items,
  found,
  equipped,
  placed,
  onTap,
}: {
  title: Chapter
  items: Collectible[]
  found: Record<string, number>
  equipped: ReturnType<typeof useCollectiblesStore.getState>['state']['equipped']
  placed: string[]
  onTap: (item: Collectible) => void
}) {
  const placedSet = new Set(placed)
  const got = items.filter((c) => found[c.id]).length
  return (
    <section className="rounded-lg border border-border bg-bg-soft/40 p-2">
      <header className="mb-1.5 flex items-baseline justify-between px-0.5">
        <h3 className="text-[11px] font-semibold">{title}</h3>
        <span className="text-[9px] text-fg-subtle tabular-nums">
          {got}/{items.length}
        </span>
      </header>
      <div className="grid grid-cols-4 gap-1.5">
        {items.map((item) => {
          const isFound = Boolean(found[item.id])
          const isSelected =
            isWearable(item)
              ? equipped[item.slot] === item.id
              : isDecoration(item) && placedSet.has(item.id)
          return (
            <ItemCard
              key={item.id}
              item={item}
              found={isFound}
              selected={isSelected}
              onTap={() => onTap(item)}
            />
          )
        })}
      </div>
    </section>
  )
}

function ItemCard({
  item,
  found,
  selected,
  onTap,
}: {
  item: Collectible
  found: boolean
  selected: boolean
  onTap: () => void
}) {
  return (
    <button
      type="button"
      onClick={onTap}
      disabled={!found}
      title={found ? item.name : '???'}
      aria-pressed={selected}
      className={cn(
        'group relative flex aspect-square items-center justify-center rounded-md border bg-bg-elevated transition-colors',
        !found && 'cursor-not-allowed opacity-70',
        found && !selected && 'border-border hover:border-accent/60',
        selected && 'border-success ring-2 ring-success/40',
      )}
    >
      <div className="h-full w-full p-1">
        <ItemPreview item={item} silhouette={!found} size={48} />
      </div>
      {!found && (
        <span className="absolute right-0.5 top-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-bg-elevated text-fg-subtle">
          <Lock className="h-2 w-2" aria-hidden="true" />
        </span>
      )}
      {selected && (
        <span className="absolute right-0.5 top-0.5 rounded-full bg-success px-1 py-0.5 text-[7px] font-bold leading-none text-white">
          ✓
        </span>
      )}
    </button>
  )
}
