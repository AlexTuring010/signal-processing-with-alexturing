'use client'

import { useMemo, useState } from 'react'
import { Filter, ListFilter } from 'lucide-react'

import { FORMULA_SHEET } from '@/content/practice/formulas'
import { TOPIC_COLORS } from '@/content/practice/types'
import { FormulaEntryCard } from './FormulaEntryCard'
import { cn } from '@/lib/utils'

type ViewMode = 'all' | 'typology-only'

export function FormulasInteractive() {
  const [view, setView] = useState<ViewMode>('all')

  const sections = useMemo(() => {
    return FORMULA_SHEET.map((section) => {
      const filtered =
        view === 'typology-only'
          ? section.entries.filter((e) => e.inTypology)
          : section.entries
      const sorted = [...filtered].sort((a, b) => {
        if (a.inTypology === b.inTypology) return 0
        return a.inTypology ? -1 : 1
      })
      return { ...section, entries: sorted }
    }).filter((s) => s.entries.length > 0)
  }, [view])

  const totals = useMemo(() => {
    let typology = 0
    let memorize = 0
    for (const s of FORMULA_SHEET) {
      for (const e of s.entries) {
        if (e.inTypology) typology += 1
        else memorize += 1
      }
    }
    return { typology, memorize, total: typology + memorize }
  }, [])

  return (
    <>
      <div className="not-prose mb-8 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-bg-elevated px-4 py-3">
        <div className="flex items-center gap-1.5 text-sm text-fg-muted">
          <Filter className="h-4 w-4" aria-hidden />
          <span>Προβολή:</span>
        </div>
        <div
          className="inline-flex rounded-md border border-border bg-bg p-0.5"
          role="radiogroup"
          aria-label="Προβολή τύπων"
        >
          <ToggleButton
            active={view === 'all'}
            onClick={() => setView('all')}
            label={`Όλα (${totals.total})`}
          />
          <ToggleButton
            active={view === 'typology-only'}
            onClick={() => setView('typology-only')}
            label={`Μόνο τυπολόγιο (${totals.typology})`}
          />
        </div>
        <p className="ml-auto hidden text-xs text-fg-muted sm:block">
          {view === 'typology-only'
            ? 'Καθαρό mirror του PDF τυπολογίου.'
            : `${totals.typology} στο τυπολόγιο · ${totals.memorize} προς απομνημόνευση`}
        </p>
      </div>

      {sections.map((section) => (
        <section key={section.topic} className="not-prose mb-10">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2
              id={`topic:${section.topic}`}
              className="scroll-mt-20 text-xl font-bold tracking-tight"
            >
              {section.label}
            </h2>
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${TOPIC_COLORS[section.topic]}`}
            >
              {section.entries.length} {section.entries.length === 1 ? 'τύπος' : 'τύποι'}
            </span>
            {view === 'all' && (
              <SectionMix entries={section.entries} />
            )}
          </div>
          <div className="space-y-3">
            {section.entries.map((entry) => (
              <FormulaEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      ))}
    </>
  )
}

function ToggleButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        'rounded px-2.5 py-1 text-xs font-medium transition',
        active
          ? 'bg-accent text-white shadow-sm'
          : 'text-fg-muted hover:text-fg',
      )}
    >
      {label}
    </button>
  )
}

function SectionMix({
  entries,
}: {
  entries: ReadonlyArray<{ inTypology: boolean }>
}) {
  const t = entries.filter((e) => e.inTypology).length
  const m = entries.length - t
  if (t === 0 || m === 0) return null
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-fg-muted">
      <ListFilter className="h-3 w-3" aria-hidden />
      {t} στο τυπολόγιο · {m} προς απομνημόνευση
    </span>
  )
}
