'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { CHAPTERS } from '@/lib/content-index'
import { ProgressDot } from './ProgressDot'
import { cn } from '@/lib/utils'

type Props = {
  /** When rendered inside the mobile drawer, parent passes a callback to close it on link click. */
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: Props) {
  const pathname = usePathname()

  // Auto-expand chapter that contains the current section.
  const initial: Record<string, boolean> = {}
  CHAPTERS.forEach((c) => {
    initial[c.id] = c.sections.some((s) => `/${s.slug}` === pathname)
  })
  // Default-open the first chapter if nothing matched (landing page case).
  if (!Object.values(initial).some(Boolean) && CHAPTERS[0]) {
    initial[CHAPTERS[0].id] = true
  }
  const [open, setOpen] = useState<Record<string, boolean>>(initial)

  return (
    <nav aria-label="Πλοήγηση" className="text-sm">
      <ul className="space-y-1">
        {CHAPTERS.map((chapter) => {
          const isOpen = open[chapter.id]
          return (
            <li key={chapter.id}>
              <button
                type="button"
                onClick={() =>
                  setOpen((prev) => ({ ...prev, [chapter.id]: !prev[chapter.id] }))
                }
                className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left text-[0.78rem] font-semibold uppercase tracking-wider text-fg-muted transition-colors hover:text-fg"
                aria-expanded={isOpen}
              >
                <ChevronRight
                  className={cn(
                    'h-3 w-3 shrink-0 text-fg-subtle transition-transform',
                    isOpen && 'rotate-90',
                  )}
                  aria-hidden="true"
                />
                <span className="flex-1">{chapter.title}</span>
              </button>

              {isOpen && (
                <ul className="mb-2 ml-2 space-y-0.5 border-l border-border pl-2">
                  {chapter.sections.map((section) => {
                    const href = `/${section.slug}`
                    const active = pathname === href
                    return (
                      <li key={section.slug}>
                        {section.available ? (
                          <Link
                            href={href}
                            onClick={onNavigate}
                            className={cn(
                              'flex items-center gap-2 rounded px-2 py-1.5 text-[0.875rem] transition-colors',
                              active
                                ? 'bg-accent-soft/50 text-fg font-medium'
                                : 'text-fg-muted hover:bg-bg-soft hover:text-fg',
                            )}
                            aria-current={active ? 'page' : undefined}
                          >
                            <ProgressDot slug={section.slug} current={active} />
                            <span className="flex-1 truncate">{section.title}</span>
                          </Link>
                        ) : (
                          <span
                            className="flex items-center gap-2 rounded px-2 py-1.5 text-[0.875rem] text-fg-subtle/70"
                            title="Έρχεται σύντομα"
                          >
                            <ProgressDot slug={section.slug} />
                            <span className="flex-1 truncate">{section.title}</span>
                            <span className="text-[10px] uppercase tracking-wide text-fg-subtle/60">
                              soon
                            </span>
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
