'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  ChevronDown,
  Check,
  AlertTriangle,
  GraduationCap,
  Lightbulb,
  Sparkles,
} from 'lucide-react'

import type { FormulaEntry } from '@/content/practice/formulas'
import { FORMULA_META } from '@/content/practice/formula-meta'
import {
  SECTION_TITLES,
  SOURCE_LABELS,
  type ExamSource,
} from '@/content/practice/types'
import { SectionComments } from '@/components/layout/SectionComments'
import {
  hasFormulaViz,
  renderFormulaViz,
} from '@/components/practice/formula-viz-registry'
import { getCitedExercises, type CitedExercise } from '@/lib/formula-cited-by'
import { cn } from '@/lib/utils'

type Props = {
  entry: FormulaEntry
}

export function FormulaEntryCard({ entry }: Props) {
  const [open, setOpen] = useState(false)
  const meta = FORMULA_META[entry.id]
  const cited = getCitedExercises(entry.id)
  const hasViz = hasFormulaViz(entry.id)
  const hasExpansion =
    Boolean(meta?.intuition) ||
    Boolean(meta?.derivation) ||
    hasViz ||
    cited.length > 0

  return (
    <article
      id={`formula:${entry.id}`}
      className="scroll-mt-20 rounded-lg border border-border bg-bg-elevated p-4"
    >
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-baseline gap-2">
          <h3 className="text-sm font-semibold tracking-tight">
            {entry.title}
          </h3>
          <TypologyBadge inTypology={entry.inTypology} />
        </div>
        {entry.derivedIn && (
          <Link
            href={`/${entry.derivedIn}`}
            className="inline-flex shrink-0 items-center gap-1 text-[11px] text-fg-muted transition hover:text-accent"
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
            onClick={() => setOpen((o) => !o)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-soft px-2.5 py-1 text-[11px] font-medium text-fg-muted transition hover:border-accent/40 hover:text-accent"
            aria-expanded={open}
          >
            <ChevronDown
              className={cn(
                'h-3 w-3 transition-transform',
                open ? 'rotate-180' : '',
              )}
              aria-hidden
            />
            {open
              ? 'Σύμπτυξη'
              : 'Δες διαίσθηση, παραγωγή, παρόμοια θέματα'}
          </button>

          {open && (
            <div className="mt-3 space-y-4 border-t border-border pt-3">
              {meta?.intuition && (
                <Section icon={<Lightbulb className="h-3.5 w-3.5" aria-hidden />} label="Διαίσθηση">
                  <div className="prose-sm text-sm leading-relaxed text-fg">
                    {meta.intuition}
                  </div>
                </Section>
              )}

              {hasViz && (
                <Section
                  icon={<Sparkles className="h-3.5 w-3.5" aria-hidden />}
                  label="Mini-viz"
                >
                  <div className="rounded-md border border-border bg-bg p-2">
                    {renderFormulaViz(entry.id)}
                  </div>
                </Section>
              )}

              {meta?.derivation && (
                <Section
                  icon={<BookOpen className="h-3.5 w-3.5" aria-hidden />}
                  label="Παραγωγή σε δύο γραμμές"
                  hint={
                    entry.derivedIn ? (
                      <Link
                        href={`/${entry.derivedIn}`}
                        className="text-[11px] text-accent hover:underline"
                      >
                        Πλήρης παραγωγή →
                      </Link>
                    ) : null
                  }
                >
                  <div className="prose-sm text-sm leading-relaxed text-fg">
                    {meta.derivation}
                  </div>
                </Section>
              )}

              {cited.length > 0 && (
                <Section
                  icon={<GraduationCap className="h-3.5 w-3.5" aria-hidden />}
                  label={`Παρόμοια παλιά θέματα (${cited.length})`}
                >
                  <ul className="flex flex-wrap gap-1.5">
                    {cited.map((ex) => (
                      <li key={ex.id}>
                        <CitedChip ex={ex} />
                      </li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>
          )}
        </>
      )}

      <div className="mt-3 border-t border-border pt-2">
        <SectionComments
          anchor={`formula:${entry.id}`}
          sectionTitle={entry.title}
          className=""
          emptyLabel="Σχόλιο για τον τύπο"
        />
      </div>
    </article>
  )
}

function TypologyBadge({ inTypology }: { inTypology: boolean }) {
  if (inTypology) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
        <Check className="h-2.5 w-2.5" aria-hidden />
        Στο τυπολόγιο
      </span>
    )
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
      <AlertTriangle className="h-2.5 w-2.5" aria-hidden />
      Πρέπει να θυμάσαι
    </span>
  )
}

function Section({
  icon,
  label,
  hint,
  children,
}: {
  icon: React.ReactNode
  label: string
  hint?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section>
      <header className="mb-1.5 flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-fg-muted">
          {icon}
          {label}
        </div>
        {hint}
      </header>
      {children}
    </section>
  )
}

function CitedChip({ ex }: { ex: CitedExercise }) {
  return (
    <Link
      href={`/practice#exercise:${ex.id}`}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg px-2 py-1 text-[11px] text-fg-muted transition hover:border-accent/40 hover:bg-accent-soft/40 hover:text-fg"
      title={ex.title}
    >
      {ex.problemNumber && (
        <span className="font-mono text-fg-subtle">{ex.problemNumber}</span>
      )}
      <span className="max-w-[18ch] truncate font-medium">{ex.title}</span>
      {ex.source && <SourceTag source={ex.source} />}
    </Link>
  )
}

function SourceTag({ source }: { source: ExamSource }) {
  return (
    <span className="hidden rounded-full border border-purple-500/40 bg-purple-500/10 px-1.5 py-px text-[9px] font-semibold text-purple-700 dark:text-purple-300 sm:inline">
      {SOURCE_LABELS[source]}
    </span>
  )
}
