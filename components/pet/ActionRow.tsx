'use client'

import { Apple, Gamepad2, Moon, Sun, Heart, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePetStore } from '@/lib/pet/store'
import type { ActionKind } from '@/lib/pet/types'

type ButtonSpec = {
  kind: ActionKind
  label: string
  icon: React.ReactNode
}

export function ActionRow() {
  const dispatch = usePetStore((s) => s.dispatch)
  const canDo = usePetStore((s) => s.canDo)
  const state = usePetStore((s) => s.state)

  // The 4th slot is Heal when sick, otherwise Pet (a free always-available action).
  const fourth: ButtonSpec =
    state.sickSince !== null
      ? { kind: 'heal', label: 'Γιατρειά', icon: <Sparkles className="h-4 w-4" /> }
      : { kind: 'pet', label: 'Χάιδεψε', icon: <Heart className="h-4 w-4" /> }

  const sleepBtn: ButtonSpec = state.sleeping
    ? { kind: 'sleep', label: 'Ξύπνα', icon: <Sun className="h-4 w-4" /> }
    : { kind: 'sleep', label: 'Ύπνος', icon: <Moon className="h-4 w-4" /> }

  const buttons: ButtonSpec[] = [
    { kind: 'feed', label: 'Τάισε', icon: <Apple className="h-4 w-4" /> },
    { kind: 'play', label: 'Παίξε', icon: <Gamepad2 className="h-4 w-4" /> },
    sleepBtn,
    fourth,
  ]

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {buttons.map((b) => {
        const status = canDo(b.kind)
        return (
          <button
            key={b.label}
            type="button"
            disabled={!status.ok}
            onClick={() => dispatch(b.kind)}
            title={status.ok ? b.label : (status.reason ?? '')}
            className={cn(
              'flex flex-col items-center justify-center gap-1 rounded-lg border px-1.5 py-2 text-[11px] font-medium transition-all',
              status.ok
                ? 'border-border bg-bg-elevated text-fg hover:border-accent/60 hover:bg-accent-soft/40 active:scale-[0.97]'
                : 'cursor-not-allowed border-border/60 bg-bg-soft/60 text-fg-subtle opacity-60',
            )}
          >
            <span aria-hidden="true">{b.icon}</span>
            <span>{b.label}</span>
          </button>
        )
      })}
    </div>
  )
}
