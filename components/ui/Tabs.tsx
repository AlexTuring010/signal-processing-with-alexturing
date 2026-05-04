'use client'

import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Tab = {
  id: string
  label: string
  content: ReactNode
  /** Optional icon shown next to the label. */
  icon?: ReactNode
}

type Props = {
  tabs: Tab[]
  defaultTabId?: string
  className?: string
  /** Called whenever the active tab changes — useful when the parent wants to mirror state. */
  onChange?: (id: string) => void
  /** Optional aria-label describing what these tabs select. */
  ariaLabel?: string
}

export function Tabs({ tabs, defaultTabId, className, onChange, ariaLabel }: Props) {
  const [active, setActive] = useState(defaultTabId ?? tabs[0]?.id)

  const select = (id: string) => {
    setActive(id)
    onChange?.(id)
  }

  return (
    <div className={cn('my-5', className)}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="flex flex-wrap gap-1 rounded-lg border border-border bg-bg-soft/60 p-1"
      >
        {tabs.map((t) => {
          const isActive = active === t.id
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`tabpanel-${t.id}`}
              id={`tab-${t.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(t.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-bg-elevated text-fg shadow-sm'
                  : 'text-fg-muted hover:text-fg',
              )}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          )
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`tabpanel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={active !== t.id}
          className="mt-3 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
        >
          {t.content}
        </div>
      ))}
    </div>
  )
}
