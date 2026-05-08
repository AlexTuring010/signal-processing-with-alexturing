'use client'

import { Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOrchardStore } from '@/lib/orchard/store'
import type { OrchardTab } from './TabBar'

type Props = {
  /** The currently active tab; lets the banner gate steps to where they apply. */
  currentTab: OrchardTab
  /** Switch tabs from inside the banner (used by the "go to market" CTA). */
  onChangeTab: (tab: OrchardTab) => void
}

/**
 * 4-step inline onboarding tutorial. Auto-advances based on game state
 * (no internal step counter — derived purely from flags + plot count) so
 * the player never sees a stale step. The whole component vanishes once
 * `flags.seenIntro` is true.
 *
 * Steps:
 *   1. Empty orchard → "tap a plot to plant".
 *   2. Tree planted but never harvested → "wait or shake the tree".
 *   3. First harvest done, no sale yet → "open the market and sell".
 *   4. First sale done → final dismiss with the local-only-data note.
 */
export function TutorialBanner({ currentTab, onChangeTab }: Props) {
  const flags = useOrchardStore((s) => s.state.flags)
  const treeCount = useOrchardStore(
    (s) => s.state.plots.filter((p) => p.tree !== null).length,
  )
  const dismiss = useOrchardStore((s) => s.dismissIntro)

  if (flags.seenIntro) return null

  let step: 1 | 2 | 3 | 4
  if (treeCount === 0) step = 1
  else if (!flags.seenFirstHarvest) step = 2
  else if (!flags.seenFirstSale) step = 3
  else step = 4

  // Step 2's hint ("tap the tree") is only useful on the trees tab.
  // Hide it on other tabs to avoid nagging while the player is exploring.
  if (step === 2 && currentTab !== 'trees') return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'orchard-toast-in flex shrink-0 items-start gap-2 border-b border-accent/30 bg-accent-soft/50 px-2.5 py-1.5 text-[11px] text-accent',
      )}
    >
      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1 leading-snug">
        <div className="text-[9px] font-bold uppercase tracking-wider opacity-70">
          Βήμα {step}/4
        </div>
        <div className="mt-0.5 text-[11px] leading-snug">
          {STEP_TEXT[step]}
        </div>
      </div>
      {step === 1 && (
        <button
          type="button"
          onClick={dismiss}
          title="Άσε με να εξερευνήσω"
          className="inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium text-accent/80 hover:bg-accent/15"
        >
          Άσε με
        </button>
      )}
      {step === 3 && currentTab !== 'market' && (
        <button
          type="button"
          onClick={() => onChangeTab('market')}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent px-2 py-1 text-[10px] font-semibold text-accent-fg shadow-sm transition-transform hover:scale-105 active:scale-95"
        >
          Στην Αγορά
        </button>
      )}
      {step === 4 && (
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent px-2 py-1 text-[10px] font-semibold text-accent-fg shadow-sm transition-transform hover:scale-105 active:scale-95"
        >
          Ξεκίνα
        </button>
      )}
      {(step === 2 || (step === 3 && currentTab === 'market')) && (
        <button
          type="button"
          onClick={dismiss}
          aria-label="Παράκαμψη οδηγού"
          title="Παράκαμψη οδηγού"
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-accent/70 hover:bg-accent/15"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

const STEP_TEXT: Record<1 | 2 | 3 | 4, string> = {
  1: 'Πάτα ένα κενό οικόπεδο για να φυτέψεις το πρώτο σου δέντρο.',
  2: 'Περίμενε λίγο για να μεγαλώσει. Πάτα το δέντρο για να ταρακουνηθεί όταν έχει μήλα.',
  3: 'Άνοιξε την Αγορά και πούλα μερικά μήλα για κέρματα.',
  4: 'Όλα μένουν μόνο στον browser σου — κανένας server. Καλή σοδειά.',
}
