'use client'

import { useEffect } from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useAppStore, type Theme } from '@/lib/store'
import { cn } from '@/lib/utils'

const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
]

export function ThemeToggle() {
  const { theme, setTheme, hydrated, hydrate } = useAppStore()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  // Re-apply theme to DOM if user changes their system preference (only when set to 'system').
  useEffect(() => {
    if (!hydrated) return
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme, hydrated])

  return (
    <div
      role="radiogroup"
      aria-label="Επιλογή θέματος"
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-bg-elevated p-0.5',
      )}
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = hydrated && theme === value
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full transition-colors',
              active
                ? 'bg-accent text-accent-fg'
                : 'text-fg-muted hover:text-fg hover:bg-bg-soft',
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        )
      })}
    </div>
  )
}
