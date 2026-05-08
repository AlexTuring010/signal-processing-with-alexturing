'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOrchardStore } from '@/lib/orchard/store'
import { getEventDef } from '@/lib/orchard/events'

/**
 * Soft banner that appears between the TabBar and panel content whenever
 * a random event is active. For buff/debuff events it shows a countdown.
 * For click events ("golden cookie" style) it shows a prominent claim
 * button. Auto-disappears when the event resolves or expires.
 */
export function EventBanner() {
  const event = useOrchardStore((s) => s.state.events.active)
  const claimEvent = useOrchardStore((s) => s.claimEvent)

  // 1-second heartbeat so the countdown ticks visibly.
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 500)
    return () => window.clearInterval(id)
  }, [])

  if (!event) return null
  const def = getEventDef(event.kind)
  if (!def) return null

  const remainingMs = Math.max(0, event.expiresAt - now)
  const remainingS = Math.ceil(remainingMs / 1000)

  // Tone the banner based on event category — buffs green, debuffs warn,
  // click events emerald glow, instants blue.
  const tone =
    def.category === 'debuff'
      ? 'border-warn/40 bg-warn/15 text-warn'
      : def.category === 'click'
        ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
        : def.category === 'buff'
          ? 'border-success/40 bg-success/15 text-success'
          : 'border-accent/40 bg-accent-soft/40 text-accent'

  return (
    <div
      className={cn(
        'orchard-toast-in flex shrink-0 items-center gap-2 border-b px-2.5 py-1.5 text-[11px]',
        tone,
        def.category === 'click' && 'orchard-grow-pulse',
      )}
    >
      <span aria-hidden="true" className="text-base leading-none">
        {def.emoji}
      </span>
      <div className="min-w-0 flex-1 leading-snug">
        <div className="font-semibold">{def.name}</div>
        <div className="text-[10px] opacity-90">{def.description}</div>
      </div>
      {def.category === 'click' ? (
        event.claimed ? (
          <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-success px-2 py-1 text-[10px] font-semibold text-white">
            ✓
          </span>
        ) : (
          <button
            type="button"
            onClick={() => claimEvent(event.id)}
            title={`Πάρε (${remainingS}s)`}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-semibold text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
          >
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Πάρε · {remainingS}s
          </button>
        )
      ) : (
        <span className="shrink-0 rounded-full bg-bg-elevated/60 px-1.5 py-0.5 text-[10px] tabular-nums">
          {formatRemaining(remainingMs)}
        </span>
      )}
    </div>
  )
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return '—'
  const s = Math.ceil(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.ceil(s / 60)
  return `${m}λ`
}
