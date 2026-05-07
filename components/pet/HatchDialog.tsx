'use client'

import { useState } from 'react'
import { Egg } from 'lucide-react'
import { usePetStore } from '@/lib/pet/store'
import { DEFAULT_NAME, MAX_NAME_LENGTH } from '@/lib/pet/defaults'
import { PetSprite } from './PetSprite'

/**
 * Inline hatch flow used inside the panel while the pet is still an egg.
 * Stage 1: invitation + Hatch button (egg wobbles).
 * Stage 2: name input after the user clicks Hatch.
 */
export function HatchDialog() {
  const dispatch = usePetStore((s) => s.dispatch)
  const [phase, setPhase] = useState<'idle' | 'cracking' | 'naming'>('idle')
  const [name, setName] = useState(DEFAULT_NAME)

  function startCrack() {
    setPhase('cracking')
    window.setTimeout(() => setPhase('naming'), 1100)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    dispatch('hatch', { name })
  }

  return (
    <div className="flex flex-col items-center gap-3 px-2 py-3">
      <div className="relative flex h-[120px] w-full items-center justify-center">
        {phase === 'naming' ? (
          <PetSprite stage="baby" mood="happy" size={88} />
        ) : (
          <div className={phase === 'cracking' ? 'pet-egg-crack' : 'pet-egg-wobble'}>
            <PetSprite stage="egg" mood="neutral" size={92} />
          </div>
        )}
      </div>

      {phase === 'idle' && (
        <>
          <p className="text-center text-xs text-fg-muted">
            Ένα αυγουλάκι περιμένει να βγει.
          </p>
          <button
            type="button"
            onClick={startCrack}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-fg shadow-sm transition-transform hover:scale-105 active:scale-95"
          >
            <Egg className="h-4 w-4" aria-hidden="true" />
            Κλώσσα
          </button>
        </>
      )}

      {phase === 'cracking' && (
        <p className="text-center text-xs text-fg-muted">Κάτι κουνιέται…</p>
      )}

      {phase === 'naming' && (
        <form onSubmit={submit} className="flex w-full flex-col items-center gap-2">
          <label className="text-center text-xs text-fg-muted">
            Πώς θα το πεις;
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={MAX_NAME_LENGTH}
            className="w-44 rounded-md border border-border bg-bg px-2 py-1 text-center text-sm focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-fg shadow-sm transition-transform hover:scale-105 active:scale-95"
          >
            Καλώς ήρθες!
          </button>
        </form>
      )}
    </div>
  )
}
