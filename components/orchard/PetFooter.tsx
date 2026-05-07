'use client'

import { useEffect, useState } from 'react'
import { Apple, Heart, Moon, Sparkles, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePetStore } from '@/lib/pet/store'
import { useOrchardStore } from '@/lib/orchard/store'
import { PetSprite } from '@/components/pet/PetSprite'
import { isSick } from '@/lib/pet/decay'

/**
 * Slim "manager" footer for the orchard panel. Shows the pet sprite,
 * current mood multiplier (with a heart badge when the petting buff is
 * active), and four quick-care action buttons that delegate to the pet
 * store (Τάισε / Ύπνος-Ξύπνα / Γιατρειά when sick or Χάιδεψε otherwise).
 */
export function PetFooter() {
  const petState = usePetStore((s) => s.state)
  const petMood = usePetStore((s) => s.mood())
  const petCanDo = usePetStore((s) => s.canDo)
  const petDispatch = usePetStore((s) => s.dispatch)

  const moodMult = useOrchardStore((s) => s.currentMoodMult())
  const petBuffUntil = useOrchardStore((s) => s.state.petBuffUntil)
  const petPet = useOrchardStore((s) => s.petPet)

  // 1-second heartbeat so the buff countdown ticks visibly.
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const sick = isSick(petState, now)
  const buffActive = petBuffUntil !== null && petBuffUntil > now
  const buffRemaining = buffActive ? petBuffUntil! - now : 0

  const sleeping = petState.sleeping

  return (
    <footer className="flex shrink-0 items-center gap-1.5 border-t border-border bg-bg-soft/50 px-2 py-1.5">
      {/* Sprite + mood */}
      <div className="flex shrink-0 items-center gap-1.5">
        <span aria-hidden="true">
          <PetSprite
            stage={petState.stage}
            mood={petMood}
            size={28}
            still
          />
        </span>
        <div className="flex flex-col leading-tight">
          <span className="max-w-[80px] truncate text-[11px] font-semibold">
            {petState.name}
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-[10px] tabular-nums',
              buffActive ? 'text-success' : 'text-fg-subtle',
            )}
            title={
              buffActive
                ? `Καλή διάθεση: ${Math.ceil(buffRemaining / 1000)}s`
                : 'Πολλαπλασιαστής παραγωγής'
            }
          >
            ×{moodMult.toFixed(2)}
            {buffActive && <Heart className="h-2.5 w-2.5 fill-current" />}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="ml-auto flex items-center gap-1">
        <Btn
          label="Τάισε"
          icon={<Apple className="h-3.5 w-3.5" />}
          status={petCanDo('feed')}
          onClick={() => petDispatch('feed')}
        />
        <Btn
          label={sleeping ? 'Ξύπνα' : 'Ύπνος'}
          icon={
            sleeping ? (
              <Sun className="h-3.5 w-3.5" />
            ) : (
              <Moon className="h-3.5 w-3.5" />
            )
          }
          status={petCanDo('sleep')}
          onClick={() => petDispatch('sleep')}
        />
        {sick ? (
          <Btn
            label="Γιατρειά"
            icon={<Sparkles className="h-3.5 w-3.5" />}
            status={petCanDo('heal')}
            tone="warn"
            onClick={() => petDispatch('heal')}
          />
        ) : (
          <Btn
            label="Χάιδεψε"
            icon={<Heart className="h-3.5 w-3.5" />}
            status={petCanDo('pet')}
            tone={buffActive ? 'good' : undefined}
            onClick={() => petPet()}
          />
        )}
      </div>
    </footer>
  )
}

function Btn({
  label,
  icon,
  status,
  onClick,
  tone,
}: {
  label: string
  icon: React.ReactNode
  status: { ok: boolean; reason?: string }
  onClick: () => void
  tone?: 'good' | 'warn'
}) {
  return (
    <button
      type="button"
      disabled={!status.ok}
      onClick={onClick}
      title={status.ok ? label : (status.reason ?? '')}
      aria-label={label}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-full transition-transform',
        status.ok
          ? tone === 'good'
            ? 'bg-success/20 text-success hover:scale-105 active:scale-95'
            : tone === 'warn'
              ? 'bg-warn/20 text-warn hover:scale-105 active:scale-95'
              : 'bg-bg-elevated text-fg-muted hover:scale-105 hover:text-fg active:scale-95'
          : 'cursor-not-allowed bg-bg-elevated/50 text-fg-subtle/60',
      )}
    >
      {icon}
    </button>
  )
}
