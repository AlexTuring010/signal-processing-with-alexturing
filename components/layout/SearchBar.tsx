'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, CornerDownLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SearchEntry } from '@/lib/search/build-index'

const MAX_RESULTS = 8

// Strip combining diacritical marks (U+0300–U+036F) for accent-insensitive search.
const COMBINING_MARKS = new RegExp('[\\u0300-\\u036f]', 'g')

function normalize(s: string) {
  return s.toLocaleLowerCase('el').normalize('NFD').replace(COMBINING_MARKS, '')
}

function score(entry: SearchEntry, tokens: string[]): number {
  if (tokens.length === 0) return 0
  const title = normalize(entry.title)
  const chapter = normalize(entry.chapter)
  const excerpt = normalize(entry.excerpt)
  let total = 0
  for (const tok of tokens) {
    if (!tok) continue
    let hit = 0
    if (title.startsWith(tok)) hit = 30
    else if (title.includes(' ' + tok)) hit = 22
    else if (title.includes(tok)) hit = 14
    else if (chapter.includes(tok)) hit = 6
    else if (excerpt.includes(tok)) hit = 3
    if (hit === 0) return 0 // every token must match somewhere
    total += hit
  }
  return total
}

function highlight(text: string, tokens: string[]): React.ReactNode {
  if (tokens.length === 0 || !text) return text
  const norm = normalize(text)
  const ranges: Array<[number, number]> = []
  for (const tok of tokens) {
    if (!tok) continue
    let from = 0
    while (true) {
      const idx = norm.indexOf(tok, from)
      if (idx === -1) break
      ranges.push([idx, idx + tok.length])
      from = idx + tok.length
    }
  }
  if (ranges.length === 0) return text
  ranges.sort((a, b) => a[0] - b[0])
  const merged: Array<[number, number]> = []
  for (const r of ranges) {
    const last = merged[merged.length - 1]
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1])
    else merged.push([r[0], r[1]])
  }
  const out: React.ReactNode[] = []
  let cursor = 0
  merged.forEach(([start, end], i) => {
    if (cursor < start) out.push(text.slice(cursor, start))
    out.push(
      <mark key={i} className="rounded bg-accent-soft px-0.5 text-fg">
        {text.slice(start, end)}
      </mark>,
    )
    cursor = end
  })
  if (cursor < text.length) out.push(text.slice(cursor))
  return <>{out}</>
}

export function SearchBar({ index }: { index: SearchEntry[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const tokens = useMemo(() => {
    const q = normalize(query.trim())
    return q ? q.split(/\s+/).filter(Boolean) : []
  }, [query])

  const results = useMemo(() => {
    if (tokens.length === 0) return [] as SearchEntry[]
    return index
      .map((e) => ({ e, s: score(e, tokens) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, MAX_RESULTS)
      .map(({ e }) => e)
  }, [tokens, index])

  useEffect(() => {
    setActive(0)
  }, [query])

  // ⌘K to open, Esc to close.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(true)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Close when a press starts outside the search container. Only listens while open.
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', handler)
    return () => window.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    } else {
      setQuery('')
      setActive(0)
    }
  }, [open])

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLLIElement>(`[data-idx="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  function go(entry: SearchEntry) {
    setOpen(false)
    router.push(entry.url)
    triggerRef.current?.blur()
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const r = results[active]
      if (r) go(r)
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Αναζήτηση"
        className={cn(
          'flex items-center gap-2 rounded-full border bg-bg-soft px-3 py-1.5 text-sm transition-colors',
          'min-w-0 sm:min-w-[16rem]',
          open
            ? 'border-accent text-fg'
            : 'border-border text-fg-muted hover:border-accent/50 hover:text-fg',
        )}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="hidden flex-1 text-left sm:inline">Αναζήτηση...</span>
        <kbd className="hidden shrink-0 rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle sm:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Αναζήτηση"
          className="search-dropdown absolute left-1/2 top-full z-50 mt-2 w-[36rem] max-w-[calc(100vw-1.5rem)]"
        >
          <div className="flex max-h-[70vh] flex-col overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-xl ring-1 ring-black/5">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-fg-muted" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Αναζήτηση κεφαλαίων, εννοιών..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKey}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-fg-subtle"
                aria-controls="search-results"
                aria-activedescendant={results[active] ? `search-result-${active}` : undefined}
                role="combobox"
                aria-expanded={results.length > 0}
                aria-autocomplete="list"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-fg-muted transition-colors hover:bg-bg-soft hover:text-fg"
                aria-label="Κλείσιμο"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {tokens.length === 0 ? (
              <div className="px-4 py-5 text-sm text-fg-muted">
                <p>Γράψε για να ψάξεις σε όλα τα κεφάλαια.</p>
                <p className="mt-2 text-xs text-fg-subtle">
                  Tip: δοκίμασε{' '}
                  <kbd className="rounded border border-border bg-bg px-1 font-mono">fourier</kbd>,{' '}
                  <kbd className="rounded border border-border bg-bg px-1 font-mono">am</kbd>, ή{' '}
                  <kbd className="rounded border border-border bg-bg px-1 font-mono">θόρυβος</kbd>.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="px-4 py-5 text-center text-sm text-fg-muted">
                Δεν βρέθηκαν αποτελέσματα για «{query}».
              </div>
            ) : (
              <ul
                ref={listRef}
                id="search-results"
                role="listbox"
                className="flex-1 overflow-y-auto py-1"
              >
                {results.map((r, i) => (
                  <li
                    key={r.slug}
                    data-idx={i}
                    id={`search-result-${i}`}
                    role="option"
                    aria-selected={i === active}
                  >
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(r)}
                      className={cn(
                        'flex w-full flex-col gap-0.5 px-4 py-2 text-left transition-colors',
                        i === active ? 'bg-accent-soft' : 'hover:bg-bg-soft',
                      )}
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-fg">
                          {highlight(r.title, tokens)}
                        </span>
                        {r.chapter && (
                          <span className="text-[11px] uppercase tracking-wide text-fg-subtle">
                            {r.chapter}
                          </span>
                        )}
                      </div>
                      {r.excerpt && (
                        <span className="line-clamp-2 text-xs text-fg-muted">
                          {highlight(r.excerpt, tokens)}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {results.length > 0 && (
              <div className="flex items-center justify-between gap-3 border-t border-border bg-bg-soft px-3 py-1.5 text-[11px] text-fg-subtle">
                <span className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-border bg-bg px-1 font-mono">↑</kbd>
                    <kbd className="rounded border border-border bg-bg px-1 font-mono">↓</kbd>
                    πλοήγηση
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="flex items-center rounded border border-border bg-bg px-1 font-mono">
                      <CornerDownLeft className="h-3 w-3" />
                    </kbd>
                    άνοιγμα
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded border border-border bg-bg px-1 font-mono">esc</kbd>
                    κλείσιμο
                  </span>
                </span>
                <span>{results.length} αποτελ.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
