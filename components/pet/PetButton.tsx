'use client'

import { cn } from '@/lib/utils'
import { usePetStore, selectNeedsAttention } from '@/lib/pet/store'
import { useCollectiblesStore } from '@/lib/collectibles/store'
import { PetSprite } from './PetSprite'

type Props = {
  open: boolean
  onClick: () => void
}

export function PetButton({ open, onClick }: Props) {
  const state = usePetStore((s) => s.state)
  const mood = usePetStore((s) => s.mood())
  const attention = selectNeedsAttention(state)
  const newCollectibles = useCollectiblesStore(
    (s) => s.state.newSinceSeen.length > 0,
  )

  const moodEmoji = (() => {
    if (state.stage === 'egg') return '🥚'
    switch (mood) {
      case 'happy':
        return '😊'
      case 'neutral':
        return '🙂'
      case 'sad':
        return '😔'
      case 'sick':
        return '🤒'
      case 'asleep':
        return '💤'
    }
  })()

  const aria =
    state.stage === 'egg' ? 'Δες το αυγουλάκι' : `Φρόντισε το ${state.name}`

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={aria}
      aria-expanded={open}
      className={cn(
        'group relative flex h-14 w-14 items-center justify-center overflow-visible rounded-full border border-border bg-bg-elevated shadow-lg transition-transform hover:scale-105 active:scale-95',
        open && 'ring-2 ring-accent/60',
      )}
    >
      {/* Soft inner background */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-1 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 30% 25%, rgb(var(--accent-soft) / 0.7), rgb(var(--bg-soft)) 70%)',
        }}
      />
      <span className="relative">
        <PetSprite stage={state.stage} mood={mood} size={42} still />
      </span>

      {/* Mood badge */}
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-bg-elevated text-[11px] leading-none shadow-sm"
      >
        {moodEmoji}
      </span>

      {/* Attention dot — pet needs care (red) */}
      {attention && (
        <span
          aria-hidden="true"
          className="pet-attention absolute -top-0.5 right-0 h-2.5 w-2.5 rounded-full bg-danger ring-2 ring-bg"
        />
      )}
      {/* New-collectible dot — orange, slightly offset so both can show */}
      {newCollectibles && (
        <span
          aria-hidden="true"
          title="Νέο συλλεκτικό"
          className={cn(
            'absolute h-2.5 w-2.5 rounded-full bg-warn ring-2 ring-bg',
            attention ? '-top-0.5 left-0' : '-top-0.5 left-0',
          )}
        />
      )}
    </button>
  )
}
