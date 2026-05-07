'use client'

import { Sparkles, Stethoscope } from 'lucide-react'
import { usePetStore } from '@/lib/pet/store'
import { isSick } from '@/lib/pet/decay'

/**
 * Warn-colored banner that appears at the top of the orchard panel content
 * whenever the pet is sick. One-tap "Γιατρειά" button calls into the pet
 * store's heal action — same dispatcher used by the pet panel.
 *
 * Renders nothing when the pet is healthy. Mood multiplier is 0.5 while
 * sick, so missing this is genuinely costly to the player.
 */
export function SickBanner() {
  const state = usePetStore((s) => s.state)
  const dispatch = usePetStore((s) => s.dispatch)
  const canDo = usePetStore((s) => s.canDo)

  if (!isSick(state)) return null
  const healStatus = canDo('heal')

  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-warn/30 bg-warn/15 px-2.5 py-1.5 text-[11px] text-warn">
      <Stethoscope className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="min-w-0 flex-1 leading-snug">
        Το <strong>{state.name}</strong> είναι άρρωστο. Η παραγωγή έπεσε στο
        50%.
      </span>
      <button
        type="button"
        disabled={!healStatus.ok}
        onClick={() => dispatch('heal')}
        title={healStatus.ok ? 'Γιατρειά' : (healStatus.reason ?? '')}
        className={
          healStatus.ok
            ? 'inline-flex shrink-0 items-center gap-1 rounded-full bg-warn px-2 py-1 text-[10px] font-semibold text-white shadow-sm transition-transform hover:scale-105 active:scale-95'
            : 'inline-flex shrink-0 cursor-not-allowed items-center gap-1 rounded-full bg-warn/40 px-2 py-1 text-[10px] font-semibold text-white/70'
        }
      >
        <Sparkles className="h-3 w-3" aria-hidden="true" />
        Γιατρειά
      </button>
    </div>
  )
}
