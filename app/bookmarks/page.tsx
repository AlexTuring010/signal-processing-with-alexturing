'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { Bookmark as BookmarkIcon } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export default function BookmarksPage() {
  const bookmarks = useAppStore((s) => s.bookmarks)
  const hydrated = useAppStore((s) => s.hydrated)
  const hydrate = useAppStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  const items = Array.from(bookmarks)

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft/60 text-accent">
        <BookmarkIcon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Bookmarks</h1>
      <p className="mt-3 text-fg-muted">
        Σημεία του site που αποθήκευσες για γρήγορη πρόσβαση.
      </p>

      {!hydrated ? (
        <p className="mt-8 text-sm text-fg-subtle">Φόρτωση...</p>
      ) : items.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-border bg-bg-soft px-5 py-8 text-center text-sm text-fg-muted">
          Δεν έχεις ακόμη bookmarks. Πάτα το εικονίδιο 🔖 σε οποιοδήποτε σημείο
          για να το αποθηκεύσεις.
        </p>
      ) : (
        <ul className="mt-8 space-y-2">
          {items.map((id) => (
            <li
              key={id}
              className="rounded-lg border border-border bg-bg-elevated px-4 py-3"
            >
              <Link
                href={`/${id}`}
                className="text-sm font-medium hover:text-accent"
              >
                {id}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
