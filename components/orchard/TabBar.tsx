'use client'

import { Trees, Store, Hammer, FlaskConical, Recycle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { playOrchardSound } from '@/lib/orchard/audio'
import { useOrchardStore } from '@/lib/orchard/store'
import { compostUnlocked } from '@/lib/orchard/prestige'

export type OrchardTab =
  | 'trees'
  | 'market'
  | 'buildings'
  | 'research'
  | 'compost'

type TabSpec = {
  id: OrchardTab | string
  label: string
  icon: React.ReactNode
  /** When true, the tab is shown but disabled — a visible promise of more to come. */
  comingSoon?: boolean
}

const STATIC_TABS: TabSpec[] = [
  { id: 'trees', label: 'Δέντρα', icon: <Trees className="h-3.5 w-3.5" /> },
  { id: 'buildings', label: 'Κτίρια', icon: <Hammer className="h-3.5 w-3.5" /> },
  { id: 'research', label: 'Έρευνα', icon: <FlaskConical className="h-3.5 w-3.5" /> },
  { id: 'market', label: 'Αγορά', icon: <Store className="h-3.5 w-3.5" /> },
]

type Props = {
  active: OrchardTab
  onChange: (tab: OrchardTab) => void
}

export function TabBar({ active, onChange }: Props) {
  const showCompost = useOrchardStore((s) => compostUnlocked(s.state))
  const tabs: TabSpec[] = showCompost
    ? [
        ...STATIC_TABS,
        {
          id: 'compost',
          label: 'Compost',
          icon: <Recycle className="h-3.5 w-3.5" />,
        },
      ]
    : STATIC_TABS

  return (
    <nav
      aria-label="Καρτέλες μποστανιού"
      className="flex shrink-0 gap-1 overflow-x-auto border-b border-border bg-bg-elevated px-3 py-1.5"
    >
      {tabs.map((t) => {
        const isActive = !t.comingSoon && active === (t.id as OrchardTab)
        return (
          <button
            key={t.id}
            type="button"
            disabled={t.comingSoon}
            onClick={() => {
              if (t.comingSoon) return
              const next = t.id as OrchardTab
              if (next !== active) playOrchardSound('click')
              onChange(next)
            }}
            title={t.comingSoon ? 'Έρχεται' : t.label}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors',
              isActive
                ? 'bg-accent text-accent-fg shadow-sm'
                : t.comingSoon
                  ? 'cursor-not-allowed text-fg-subtle/70'
                  : 'text-fg-muted hover:bg-bg-soft hover:text-fg',
            )}
          >
            {t.icon}
            <span>{t.label}</span>
            {t.comingSoon && (
              <span className="rounded-full bg-bg-soft px-1.5 text-[9px] uppercase tracking-wider text-fg-subtle">
                soon
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
