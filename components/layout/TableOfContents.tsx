'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type Heading = { id: string; text: string; level: number }

/**
 * Builds an in-page TOC from h2/h3 elements in the article. Highlights the
 * heading currently in view via IntersectionObserver.
 */
export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const article = document.querySelector('article.prose-content')
    if (!article) return

    const nodes = Array.from(article.querySelectorAll('h2, h3')) as HTMLElement[]
    const items: Heading[] = nodes
      .filter((n) => n.id || n.textContent)
      .map((n) => {
        if (!n.id) {
          n.id = (n.textContent ?? '')
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9Ͱ-Ͽἀ-῿\-]/g, '')
        }
        return {
          id: n.id,
          text: n.textContent ?? '',
          level: n.tagName === 'H2' ? 2 : 3,
        }
      })
    setHeadings(items)

    if (items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: [0, 1] },
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [])

  if (headings.length === 0) return null

  return (
    <nav aria-label="Σε αυτή τη σελίδα" className="text-sm">
      <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-wider text-fg-muted">
        Σε αυτή τη σελίδα
      </p>
      <ul className="space-y-1 border-l border-border">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                '-ml-px block border-l-2 py-1 pl-3 text-[0.85rem] transition-colors',
                h.level === 3 && 'pl-6',
                activeId === h.id
                  ? 'border-accent text-fg font-medium'
                  : 'border-transparent text-fg-muted hover:border-border-strong hover:text-fg',
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
