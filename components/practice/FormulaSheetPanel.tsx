'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Sigma,
  X,
  BookOpen,
  Sparkles,
  ChevronDown,
  Check,
  AlertTriangle,
  Lightbulb,
  Printer,
} from 'lucide-react'
import { FORMULA_SHEET, type FormulaEntry } from '@/content/practice/formulas'
import { FORMULA_META } from '@/content/practice/formula-meta'
import { TOPIC_COLORS, SECTION_TITLES } from '@/content/practice/types'
import {
  hasFormulaViz,
  renderFormulaViz,
} from './formula-viz-registry'
import { useFormulaSheet } from './formula-sheet-store'
import { cn } from '@/lib/utils'

/**
 * Slide-in formula sheet that opens from the left edge. Used in practice
 * mode so students can keep formulas open while solving.
 *
 * When `highlighted` is non-empty (assist mode), those entries get a
 * golden accent and the rest dim — like exam practice with the typology
 * lit up only on what you need. Highlighted entries auto-expand to
 * surface the mini-viz + intuition for the formulas the problem actually
 * needs.
 */
export function FormulaSheetPanel() {
  const { open, closeSheet, highlighted, memorizationNote, clearAssist } =
    useFormulaSheet()

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
      <button
        type="button"
        aria-label="Close formula sheet"
        onClick={closeSheet}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        role="dialog"
        aria-label="Τυπολόγιο"
        className={`fixed left-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-r border-border bg-bg shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <header className="flex shrink-0 flex-col gap-2 border-b border-border bg-bg-elevated px-4 py-3">
          <div className="flex items-center justify-between">
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
          </div>
          <Link
            href="/cheatsheet"
            onClick={closeSheet}
            className="inline-flex items-center gap-1.5 self-start rounded-md border border-accent/40 bg-accent-soft/40 px-2.5 py-1 text-[11px] font-semibold text-accent transition hover:bg-accent-soft/70"
            title="Print-ready πινακίδα μελέτης πριν την εξέταση (μόνο το επίσημο τυπολόγιο επιτρέπεται στο γραπτό)"
          >
            <Printer className="h-3 w-3" aria-hidden />
            Συνιστώμενη πινακίδα μελέτης (print-ready)
          </Link>
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
                {section.entries.map((entry) => (
                  <PanelEntryCard
                    key={entry.id}
                    entry={entry}
                    lit={highlightSet.has(entry.id)}
                    inAssist={inAssist}
                    onNavigate={closeSheet}
                  />
                ))}
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

type CardProps = {
  entry: FormulaEntry
  lit: boolean
  inAssist: boolean
  onNavigate: () => void
}

function PanelEntryCard({ entry, lit, inAssist, onNavigate }: CardProps) {
  const meta = FORMULA_META[entry.id]
  const hasViz = hasFormulaViz(entry.id)
  const hasIntuition = Boolean(meta?.intuition)
  const hasExpansion = hasViz || hasIntuition

  // Solving-mode default: cards collapsed. When assist mode highlights
  // this entry, auto-expand so the mini-viz/intuition surface without
  // an extra tap. User can still close manually.
  const [openCard, setOpenCard] = useState(lit && inAssist && hasExpansion)
  useEffect(() => {
    if (lit && inAssist && hasExpansion) setOpenCard(true)
  }, [lit, inAssist, hasExpansion])

  return (
    <article
      className={cn(
        'rounded-lg border p-3 transition',
        lit
          ? 'border-amber-500/60 bg-amber-500/10 ring-2 ring-amber-500/20'
          : inAssist
            ? 'border-border/60 bg-bg-soft/40 opacity-50'
            : 'border-border bg-bg-elevated',
      )}
    >
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
        <div className="flex min-w-0 flex-wrap items-baseline gap-2">
          <h3 className="text-sm font-semibold tracking-tight">{entry.title}</h3>
          <TypologyBadge inTypology={entry.inTypology} />
        </div>
        {entry.derivedIn && (
          <Link
            href={`/${entry.derivedIn}`}
            onClick={onNavigate}
            className="inline-flex shrink-0 items-center gap-1 text-[11px] text-fg-muted hover:text-accent"
            title={`Παραγωγή στο ${SECTION_TITLES[entry.derivedIn] ?? entry.derivedIn}`}
          >
            <BookOpen className="h-3 w-3" aria-hidden />
            {SECTION_TITLES[entry.derivedIn] ?? 'Δες παραγωγή'}
          </Link>
        )}
      </div>

      <div className="text-sm">{entry.content}</div>

      {hasExpansion && (
        <>
          <button
            type="button"
            onClick={() => setOpenCard((o) => !o)}
            className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-soft px-2 py-0.5 text-[11px] font-medium text-fg-muted transition hover:border-accent/40 hover:text-accent"
            aria-expanded={openCard}
          >
            <ChevronDown
              className={cn(
                'h-3 w-3 transition-transform',
                openCard ? 'rotate-180' : '',
              )}
              aria-hidden
            />
            {openCard
              ? 'Σύμπτυξη'
              : hasViz
                ? 'Δες viz + διαίσθηση'
                : 'Δες διαίσθηση'}
          </button>

          {openCard && (
            <div className="mt-3 space-y-3 border-t border-border/60 pt-3">
              {hasViz && (
                <CardSection
                  icon={<Sparkles className="h-3 w-3" aria-hidden />}
                  label="Mini-viz"
                >
                  <div className="rounded-md border border-border/60 bg-bg p-2">
                    {renderFormulaViz(entry.id)}
                  </div>
                </CardSection>
              )}
              {hasIntuition && (
                <CardSection
                  icon={<Lightbulb className="h-3 w-3" aria-hidden />}
                  label="Διαίσθηση"
                >
                  <div className="text-[13px] leading-relaxed text-fg">
                    {meta?.intuition}
                  </div>
                </CardSection>
              )}
            </div>
          )}
        </>
      )}
    </article>
  )
}

function TypologyBadge({ inTypology }: { inTypology: boolean }) {
  if (inTypology) {
    return (
      <span
        title="Στο επίσημο τυπολόγιο — δίνεται στην εξέταση"
        className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300"
      >
        <Check className="h-2.5 w-2.5" aria-hidden />
        Τυπολόγιο
      </span>
    )
  }
  return (
    <span
      title="Δεν είναι στο τυπολόγιο — πρέπει να θυμάσαι τον τύπο"
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300"
    >
      <AlertTriangle className="h-2.5 w-2.5" aria-hidden />
      Μνήμη
    </span>
  )
}

function CardSection({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <section>
      <header className="mb-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-fg-muted">
        {icon}
        {label}
      </header>
      {children}
    </section>
  )
}
