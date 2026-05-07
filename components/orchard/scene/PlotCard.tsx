'use client'

import { useEffect, useState } from 'react'
import { Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { OrchardState, Plot } from '@/lib/orchard/types'
import { useOrchardStore } from '@/lib/orchard/store'
import {
  intervalS,
  stageLabel,
  yieldPerCycle,
} from '@/lib/orchard/trees'
import {
  effectiveTreeStorage,
  msToNextStageForState,
  stageAtForState,
} from '@/lib/orchard/effects'
import { TreeSprite } from './TreeSprite'

type Props = {
  plot: Plot
  selected: boolean
  /** Live ticking timestamp, refreshed by the parent so we don't subscribe here. */
  now: number
  onClick: () => void
}

/**
 * A single plot in the 4×3 grid. Empty plots render a dashed outline + sprout
 * icon. Planted plots render the tree, a thin progress ring under it for
 * stored fruit, and a small stage label on hover.
 */
export function PlotCard({ plot, selected, now, onClick }: Props) {
  const harvest = useOrchardStore((s) => s.harvest)
  const lastShake = useOrchardStore((s) => s.lastShakeAt[plot.id])
  const state = useOrchardStore((s) => s.state)
  const [shakeNonce, setShakeNonce] = useState(0)

  // Whenever the store records a new shake on this plot, bump the nonce so
  // React replays the keyframe (animation only fires once per remount).
  useEffect(() => {
    if (lastShake) setShakeNonce((n) => n + 1)
  }, [lastShake])

  const tree = plot.tree
  const stage = tree ? stageAtForState(tree, now, state) : 0
  const stored = tree?.storedApples ?? 0
  const cap = tree ? effectiveTreeStorage(tree, state) : 0
  const fillFrac = cap > 0 ? Math.min(1, stored / cap) : 0
  const full = cap > 0 && stored >= cap

  function onTap(e: React.MouseEvent) {
    e.stopPropagation()
    if (tree && stored > 0) {
      harvest(plot.id)
    } else {
      onClick()
    }
  }

  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={
        tree
          ? `${stageLabel(stage)} · ${Math.floor(stored)} από ${cap} μήλα`
          : 'Άδειο οικόπεδο'
      }
      className={cn(
        'group relative flex h-full w-full min-w-0 items-center justify-center rounded-xl border-2 transition-all',
        tree
          ? 'border-transparent bg-gradient-to-b from-emerald-100/30 via-emerald-50/10 to-amber-100/20 dark:from-emerald-900/20 dark:via-bg-soft dark:to-amber-900/10'
          : 'border-dashed border-border bg-bg-soft/40 hover:border-accent/60 hover:bg-accent-soft/30',
        selected && 'ring-2 ring-accent ring-offset-1 ring-offset-bg',
        full && 'orchard-grow-pulse',
      )}
    >
      {/* Empty: sprout hint */}
      {!tree && (
        <div className="flex flex-col items-center gap-0.5 text-fg-subtle">
          <Sprout className="h-5 w-5 opacity-50 transition-opacity group-hover:opacity-90" />
        </div>
      )}

      {/* Tree */}
      {tree && (
        <div
          // Re-mount on shake to replay the keyframe
          key={`${plot.id}:shake:${shakeNonce}`}
          className={cn(shakeNonce > 0 && 'orchard-tree-shake')}
        >
          <TreeSprite tree={{ ...tree, growthStage: stage }} size={56} full={full} />
        </div>
      )}

      {/* Storage progress bar */}
      {tree && (
        <div
          className="absolute inset-x-1.5 bottom-1 h-0.5 overflow-hidden rounded-full bg-bg-soft/80"
          aria-hidden="true"
        >
          <div
            className={cn(
              'h-full rounded-full transition-[width] duration-300',
              full ? 'bg-warn' : 'bg-success',
            )}
            style={{ width: `${fillFrac * 100}%` }}
          />
        </div>
      )}

      {/* Growth-time chip (only while sapling/small) */}
      {tree && stage < 2 && (
        <span className="absolute right-1 top-1 rounded-full bg-bg-elevated/90 px-1 py-0.5 text-[8px] font-medium text-fg-subtle shadow-sm">
          {formatMs(msToNextStageForState(tree, now, state) ?? 0)}
        </span>
      )}
    </button>
  )
}

function formatMs(ms: number): string {
  if (ms <= 0) return '—'
  const s = Math.ceil(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.ceil(s / 60)
  if (m < 60) return `${m}λ`
  const h = Math.ceil(m / 60)
  return `${h}ω`
}

/** Stat read used by the detail popup. State-aware so research effects show. */
export function plotStats(plot: Plot, now: number, state: OrchardState) {
  if (!plot.tree) return null
  const t = plot.tree
  const stage = stageAtForState(t, now, state)
  return {
    stage,
    label: stageLabel(stage),
    interval: intervalS(t),
    yieldPer: yieldPerCycle(t),
    storage: effectiveTreeStorage(t, state),
    stored: t.storedApples,
    msToNext: msToNextStageForState(t, now, state),
  }
}
