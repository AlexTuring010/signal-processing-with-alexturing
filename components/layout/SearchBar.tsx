'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Placeholder search UI. The input opens a modal that says "search coming
 * soon" — full indexing will be added in a follow-up task.
 *
 * Keyboard: Cmd/Ctrl+K focuses the bar.
 */
export function SearchBar() {
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'flex items-center gap-2 rounded-full border border-border bg-bg-soft px-3 py-1.5 text-sm text-fg-muted transition-colors hover:border-accent/50 hover:text-fg',
          'min-w-0 sm:min-w-[16rem]',
        )}
        aria-label="Αναζήτηση"
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
          aria-modal="true"
          aria-label="Αναζήτηση"
          className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[15vh]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
          <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 text-fg-muted" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Αναζήτηση..."
                className="flex-1 bg-transparent text-base outline-none placeholder:text-fg-subtle"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-fg-muted hover:bg-bg-soft hover:text-fg"
                aria-label="Κλείσιμο"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-4 py-6 text-center text-sm text-fg-muted">
              <p>Η αναζήτηση έρχεται σύντομα.</p>
              <p className="mt-1 text-xs text-fg-subtle">
                Στο μεταξύ, χρησιμοποίησε το sidebar για να πλοηγηθείς.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
