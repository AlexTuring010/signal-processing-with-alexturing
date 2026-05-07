'use client'

import { useEffect, useState } from 'react'
import { Apple, Coins } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  selectHasHarvestable,
  useOrchardStore,
  selectStoredApples,
  selectAnyTreeFull,
} from '@/lib/orchard/store'
import { priceForState } from '@/lib/orchard/effects'

/**
 * Bottom action strip. Two compact buttons + tiny status. Sized for the
 * 280-px panel: short labels, small icons, badge counts only when non-zero.
 * Uses the live price walk for the apple-sale preview, refreshed once a
 * second so the preview tracks the current market.
 */
export function ActionBar() {
  const state = useOrchardStore((s) => s.state)
  const apples = state.resources.apples
  const startedAt = state.startedAt
  const stored = useOrchardStore((s) => selectStoredApples(s.state))
  const hasHarvestable = useOrchardStore((s) => selectHasHarvestable(s.state))
  const anyFull = useOrchardStore((s) => selectAnyTreeFull(s.state))
  const harvestAll = useOrchardStore((s) => s.harvestAll)
  const sellAll = useOrchardStore((s) => s.sellAll)

  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const proceeds =
    Math.floor(apples) * priceForState('apples', startedAt, now, state)

  return (
    <footer className="flex shrink-0 items-center gap-1.5 border-t border-border bg-bg-elevated px-2 py-1.5">
      <button
        type="button"
        onClick={() => harvestAll()}
        disabled={!hasHarvestable}
        className={cn(
          'inline-flex flex-1 items-center justify-center gap-1 rounded-full px-2 py-1.5 text-xs font-medium transition-transform',
          hasHarvestable
            ? 'bg-success text-white shadow-sm hover:scale-[1.01] active:scale-95'
            : 'cursor-not-allowed bg-bg-soft text-fg-subtle',
          anyFull && hasHarvestable && 'orchard-grow-pulse',
        )}
      >
        <Apple className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Μάζεψε</span>
        {stored > 0 && (
          <span className="rounded-full bg-white/25 px-1 py-0.5 text-[10px] tabular-nums">
            {Math.floor(stored)}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={() => sellAll()}
        disabled={apples <= 0}
        className={cn(
          'inline-flex flex-1 items-center justify-center gap-1 rounded-full px-2 py-1.5 text-xs font-medium transition-transform',
          apples > 0
            ? 'bg-accent text-accent-fg shadow-sm hover:scale-[1.01] active:scale-95'
            : 'cursor-not-allowed bg-bg-soft text-fg-subtle',
        )}
      >
        <Coins className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Πούλα</span>
        {apples > 0 && (
          <span className="rounded-full bg-white/25 px-1 py-0.5 text-[10px] tabular-nums">
            {formatCoins(proceeds)}🪙
          </span>
        )}
      </button>
    </footer>
  )
}

function formatCoins(n: number): string {
  if (n >= 100) return Math.round(n).toString()
  if (n >= 10) return n.toFixed(1)
  return n.toFixed(2)
}
