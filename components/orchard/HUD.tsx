'use client'

import { ArrowLeft, X } from 'lucide-react'
import { useOrchardStore, selectBarnFraction } from '@/lib/orchard/store'
import { effectiveBarnCapacity } from '@/lib/orchard/effects'
import { usePetStore } from '@/lib/pet/store'
import type { Mood } from '@/lib/pet/types'
import { cn } from '@/lib/utils'

type Props = {
  /** Closes the orchard and reopens the pet panel in its place. */
  onBackToPet: () => void
  /** Closes the orchard entirely (returns to the bare pet button). */
  onClose: () => void
}

/**
 * Two-row HUD sized for the 280-px panel width: a navigation row
 * (back-to-pet · title · close) on top, resources on the bottom.
 */
export function HUD({ onBackToPet, onClose }: Props) {
  const apples = useOrchardStore((s) => s.state.resources.apples)
  const coins = useOrchardStore((s) => s.state.resources.coins)
  const barnCap = useOrchardStore((s) => effectiveBarnCapacity(s.state))
  const barnFrac = useOrchardStore((s) => selectBarnFraction(s.state))
  const moodMult = useOrchardStore((s) => s.currentMoodMult())
  const petName = usePetStore((s) => s.state.name)
  const petMood = usePetStore((s) => s.mood())

  return (
    <header className="flex shrink-0 flex-col gap-1 border-b border-border bg-bg-elevated px-2 py-1.5">
      {/* Row 1 — navigation */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onBackToPet}
          aria-label={`Πίσω στο ${petName}`}
          title={`Πίσω στο ${petName}`}
          className="inline-flex items-center gap-1 rounded-full bg-bg-soft px-2 py-1 text-[11px] font-medium text-fg-muted transition-colors hover:bg-accent-soft/60 hover:text-fg"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="max-w-[90px] truncate">{petName}</span>
        </button>

        <h2 className="mx-auto flex items-center gap-1 text-xs font-semibold">
          <span aria-hidden="true">🌳</span>
          Μποστάνι
        </h2>

        <button
          type="button"
          onClick={onClose}
          aria-label="Κλείσε"
          className="rounded-full p-1 text-fg-subtle transition-colors hover:bg-bg-soft hover:text-fg"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Row 2 — resources */}
      <div className="flex items-center justify-between gap-1 text-[11px]">
        <Resource
          icon="🍎"
          label="Μήλα"
          value={Math.floor(apples).toLocaleString('el-GR')}
          suffix={`/${barnCap}`}
          warn={barnFrac >= 0.95}
        />
        <Resource
          icon="🪙"
          label="Κέρματα"
          value={coins.toFixed(coins < 10 ? 2 : 1)}
        />
        <span
          aria-label={`Διάθεση ${petName}: πολλαπλασιαστής ×${moodMult.toFixed(2)}`}
          title={`${petName}: ×${moodMult.toFixed(2)}`}
          className="inline-flex items-center gap-0.5 rounded-full border border-border bg-bg-soft px-1.5 py-0.5 tabular-nums"
        >
          <span aria-hidden="true">{moodEmoji(petMood)}</span>
          <span>×{moodMult.toFixed(1)}</span>
        </span>
      </div>
    </header>
  )
}

function Resource({
  icon,
  label,
  value,
  suffix,
  warn,
}: {
  icon: string
  label: string
  value: string
  suffix?: string
  warn?: boolean
}) {
  return (
    <span
      aria-label={label}
      className={cn(
        'inline-flex items-baseline gap-0.5 rounded-full border border-border px-1.5 py-0.5 tabular-nums',
        warn ? 'bg-warn/10 text-warn' : 'bg-bg-soft',
      )}
    >
      <span aria-hidden="true">{icon}</span>
      <span className="font-semibold">{value}</span>
      {suffix && (
        <span className="text-[10px] text-fg-subtle">{suffix}</span>
      )}
    </span>
  )
}

function moodEmoji(mood: Mood) {
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
}
