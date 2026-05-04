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

              {isOpen && (() => {
                const main = chapter.sections.filter((s) => !s.group)
                const reference = chapter.sections.filter((s) => s.group === 'reference')
                return (
                  <div className="mb-2 ml-2 border-l border-border pl-2">
                    <ul className="space-y-0.5">
                      {main.map((section) => (
                        <SectionLink
                          key={section.slug}
                          section={section}
                          pathname={pathname}
                          onNavigate={onNavigate}
                        />
                      ))}
                    </ul>
                    {reference.length > 0 && (
                      <>
                        <div
                          className="mt-2 px-2 pb-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-fg-subtle/80"
                          aria-hidden="true"
                        >
                          Reference
                        </div>
                        <ul className="space-y-0.5">
                          {reference.map((section) => (
                            <SectionLink
                              key={section.slug}
                              section={section}
                              pathname={pathname}
                              onNavigate={onNavigate}
                              reference
                            />
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )
              })()}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function SectionLink({
  section,
  pathname,
  onNavigate,
  reference,
}: {
  section: { slug: string; title: string; available: boolean }
  pathname: string
  onNavigate?: () => void
  reference?: boolean
}) {
  const href = `/${section.slug}`
  const active = pathname === href
  if (!section.available) {
    return (
      <li>
        <span
          className={cn(
            'flex items-center gap-2 rounded px-2 py-1.5 text-fg-subtle/70',
            reference ? 'text-[0.82rem] italic' : 'text-[0.875rem]',
          )}
          title="Έρχεται σύντομα"
        >
          <ProgressDot slug={section.slug} />
          <span className="flex-1 truncate">{section.title}</span>
          <span className="text-[10px] uppercase tracking-wide text-fg-subtle/60">
            soon
          </span>
        </span>
      </li>
    )
  }
  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        className={cn(
          'flex items-center gap-2 rounded px-2 py-1.5 transition-colors',
          reference ? 'text-[0.82rem] italic' : 'text-[0.875rem]',
          active
            ? 'bg-accent-soft/50 text-fg font-medium not-italic'
            : 'text-fg-muted hover:bg-bg-soft hover:text-fg',
        )}
        aria-current={active ? 'page' : undefined}
      >
        <ProgressDot slug={section.slug} current={active} />
        <span className="flex-1 truncate">{section.title}</span>
      </Link>
    </li>
  )
}
