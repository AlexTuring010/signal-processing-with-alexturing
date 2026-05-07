'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Sigma, X, BookOpen, Sparkles } from 'lucide-react'
import { FORMULA_SHEET } from '@/content/practice/formulas'
import { TOPIC_COLORS, TOPIC_LABELS, SECTION_TITLES } from '@/content/practice/types'
import { useFormulaSheet } from './formula-sheet-store'

/**
 * Slide-in formula sheet that opens from the left edge. Used in practice
 * mode so students can keep formulas open while solving.
 *
 * When `highlighted` is non-empty (assist mode), those entries get a
 * golden accent and the rest dim — like exam practice with the typology
 * lit up only on what you need.
 */
export function FormulaSheetPanel() {
  const { open, closeSheet, highlighted, memorizationNote, clearAssist } =
    useFormulaSheet()

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSheet()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeSheet])

  const highlightSet = new Set(highlighted)
  const inAssist = highlightSet.size > 0

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close formula sheet"
        onClick={closeSheet}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Τυπολόγιο"
        className={`fixed left-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-r border-border bg-bg shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-border bg-bg-elevated px-4 py-3">
          <div className="flex items-center gap-2">
            <Sigma className="h-5 w-5 text-accent" aria-hidden />
            <h2 className="text-base font-semibold tracking-tight">Τυπολόγιο</h2>
            {inAssist && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                <Sparkles className="h-3 w-3" aria-hidden />
                Assist on
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeSheet}
            aria-label="Κλείσιμο"
            className="rounded-md p-1.5 text-fg-muted transition hover:bg-bg-soft hover:text-fg"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {inAssist && (
          <div className="shrink-0 border-b border-amber-500/30 bg-amber-500/10 px-4 py-3">
            <p className="text-xs leading-relaxed text-fg">
              <strong className="text-amber-700 dark:text-amber-300">Assist mode</strong> —{' '}
              Οι τύποι που χρειάζεσαι για το πρόβλημα είναι τονισμένοι παρακάτω.{' '}
              {memorizationNote && (
                <span className="mt-1 block text-fg-muted">{memorizationNote}</span>
              )}
            </p>
            <button
              type="button"
              onClick={clearAssist}
              className="mt-2 text-[11px] font-semibold text-amber-700 underline-offset-2 hover:underline dark:text-amber-300"
            >
              Καθάρισε assist (περιήγηση όλου του τυπολογίου)
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {FORMULA_SHEET.map((section) => (
            <section key={section.topic} className="mb-6">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${TOPIC_COLORS[section.topic]}`}
                >
                  {section.label}
                </span>
              </div>
              <div className="space-y-3">
                {section.entries.map((entry) => {
                  const lit = highlightSet.has(entry.id)
                  return (
                    <article
                      key={entry.id}
                      className={`rounded-lg border p-3 transition ${
                        lit
                          ? 'border-amber-500/60 bg-amber-500/10 ring-2 ring-amber-500/20'
                          : inAssist
                            ? 'border-border/60 bg-bg-soft/40 opacity-50'
                            : 'border-border bg-bg-elevated'
                      }`}
                    >
                      <div className="mb-1 flex items-baseline justify-between gap-2">
                        <h3 className="text-sm font-semibold tracking-tight">
                          {entry.title}
                        </h3>
                        {entry.derivedIn && (
                          <Link
                            href={`/${entry.derivedIn}`}
                            onClick={closeSheet}
                            className="inline-flex items-center gap-1 text-[11px] text-fg-muted hover:text-accent"
                            title={`Παραγωγή στο ${SECTION_TITLES[entry.derivedIn] ?? entry.derivedIn}`}
                          >
                            <BookOpen className="h-3 w-3" aria-hidden />
                            {SECTION_TITLES[entry.derivedIn] ?? 'Δες παραγωγή'}
                          </Link>
                        )}
                      </div>
                      <div className="text-sm">{entry.content}</div>
                    </article>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </aside>
    </>
  )
}

/**
 * Floating button at bottom-left that toggles the formula sheet. Visible on
 * pages that mount it (the practice routes).
 */
export function FormulaSheetButton() {
  const { open, toggleSheet } = useFormulaSheet()
  return (
    <button
      type="button"
      onClick={toggleSheet}
      aria-label={open ? 'Κλείσε τυπολόγιο' : 'Άνοιξε τυπολόγιο'}
      className="fixed bottom-[5.5rem] left-4 z-30 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent text-white px-4 py-2.5 text-sm font-semibold shadow-lg transition hover:scale-105 hover:opacity-90"
    >
      <Sigma className="h-4 w-4" aria-hidden />
      Τυπολόγιο
    </button>
  )
}
