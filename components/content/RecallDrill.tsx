'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import {
  Brain,
  ChevronDown,
  ThumbsUp,
  Smile,
  Frown,
  type LucideIcon,
} from 'lucide-react'
import { readJSON, writeJSON } from '@/lib/storage'
import { cn } from '@/lib/utils'

type Rating = 'got-it' | 'almost' | 'not-yet'

type Props = {
  /** Stable per-page identifier. Used as part of the localStorage key. */
  id: string
  prompt: ReactNode
  answer: ReactNode
  title?: string
}

const STORAGE_PREFIX = 'spwa:recall'

const RATINGS: Array<{ value: Rating; label: string; Icon: LucideIcon; classes: string }> = [
  {
    value: 'got-it',
    label: 'Το είχα',
    Icon: ThumbsUp,
    classes: 'border-success/50 bg-success/10 text-success',
  },
  {
    value: 'almost',
    label: 'Σχεδόν',
    Icon: Smile,
    classes:
      'border-amber-400/50 bg-amber-400/10 text-amber-700 dark:text-amber-300',
  },
  {
    value: 'not-yet',
    label: 'Όχι ακόμα',
    Icon: Frown,
    classes:
      'border-rose-400/50 bg-rose-400/10 text-rose-700 dark:text-rose-300',
  },
]

/**
 * Ανακάλεσε — "reproduce-from-memory" drill. The student sees the prompt,
 * tries to answer mentally (or on scratch paper), then reveals the model
 * answer and self-rates. The rating persists per-page-per-id in localStorage
 * so the student can see at a glance which prompts still need work.
 */
export function RecallDrill({
  id,
  prompt,
  answer,
  title = 'Ανακάλεσε από μνήμη',
}: Props) {
  const pathname = usePathname() ?? ''
  const slug = pathname.replace(/^\//, '')
  const storageKey = `${STORAGE_PREFIX}:${slug}:${id}`

  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState<Rating | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setRating(readJSON<Rating | null>(storageKey, null))
    setHydrated(true)
  }, [storageKey])

  function setAndSave(next: Rating | null) {
    setRating(next)
    writeJSON(storageKey, next)
  }

  const activeRating = hydrated && rating ? RATINGS.find((r) => r.value === rating) : null
  const ActiveIcon = activeRating?.Icon

  return (
    <section className="not-prose my-6 overflow-hidden rounded-lg border border-accent/40 bg-accent-soft/15">
      <div className="flex items-center gap-2 border-b border-accent/30 px-4 py-2.5">
        <Brain className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
        <span className="flex-1 text-sm font-semibold tracking-tight">{title}</span>
        {activeRating && ActiveIcon && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold',
              activeRating.classes,
            )}
          >
            <ActiveIcon className="h-3 w-3" aria-hidden="true" />
            {activeRating.label}
          </span>
        )}
      </div>

      <div className="px-4 pt-3 text-[0.95rem] leading-relaxed">{prompt}</div>

      <div className="px-4 pb-4 pt-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-elevated px-3 py-1.5 text-sm font-medium transition hover:border-accent/50 hover:bg-accent-soft/30"
          aria-expanded={open}
        >
          <ChevronDown
            className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')}
            aria-hidden="true"
          />
          {open ? 'Κρύψε απάντηση' : 'Δες απάντηση'}
        </button>

        {open && (
          <>
            <div className="mt-3 rounded-md border border-border bg-bg px-3 py-3 text-[0.95rem] leading-relaxed">
              {answer}
            </div>

            <div className="mt-3">
              <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
                Πώς τα πήγες;
              </div>
              <div
                className="flex flex-wrap gap-1.5"
                role="radiogroup"
                aria-label="Αυτο-αξιολόγηση"
              >
                {RATINGS.map(({ value, label, Icon, classes }) => {
                  const selected = rating === value
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setAndSave(selected ? null : value)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition',
                        selected
                          ? classes
                          : 'border-border bg-bg-elevated text-fg-muted hover:border-accent/40 hover:text-fg',
                      )}
                    >
                      <Icon className="h-3 w-3" aria-hidden="true" />
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
