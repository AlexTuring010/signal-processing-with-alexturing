'use client'

import { useMemo, useState } from 'react'
import { ArrowDownUp, ListFilter } from 'lucide-react'

import { FORMULA_SHEET, type FormulaEntry } from '@/content/practice/formulas'
import { TOPIC_COLORS } from '@/content/practice/types'
import { FormulaEntryCard } from './FormulaEntryCard'
import { getCitedExercises } from '@/lib/formula-cited-by'
import { cn } from '@/lib/utils'

type SortMode = 'default' | 'weight'
type FilterKey = 'typology' | 'must-refs' | 'must-no-refs' | 'trig' | 'theory'

export function FormulasInteractive() {
  const [sortMode, setSortMode] = useState<SortMode>('default')
  const [activeFilters, setActiveFilters] = useState<Set<FilterKey>>(new Set())

  // Pre-compute cited counts once (static data, O(1) lookups from formula-cited-by)
  const citedCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const s of FORMULA_SHEET)
      for (const e of s.entries)
        counts[e.id] = getCitedExercises(e.id).length
    return counts
  }, [])

  // Global 3-bucket breakdown
  const stats = useMemo(() => {
    let n1 = 0, n2 = 0, n3 = 0
    for (const s of FORMULA_SHEET) {
      for (const e of s.entries) {
        if (e.inTypology) n1++
        else if ((citedCounts[e.id] ?? 0) > 0) n2++
        else n3++
      }
    }
    return { n1, n2, n3, total: n1 + n2 + n3 }
  }, [citedCounts])

  function toggleFilter(key: FilterKey) {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  // Clicking a stat tile sets ONLY that filter (or clears if already sole active)
  function handleTileClick(key: FilterKey) {
    if (activeFilters.size === 1 && activeFilters.has(key))
      setActiveFilters(new Set())
    else
      setActiveFilters(new Set([key]))
  }

  // Compute filtered + sorted display data
  const { weightedEntries, sectionGroups } = useMemo(() => {
    function passes(e: FormulaEntry): boolean {
      if (activeFilters.size === 0) return true
      for (const f of activeFilters) {
        if (f === 'typology' && !e.inTypology) return false
        if (f === 'must-refs' && (e.inTypology || (citedCounts[e.id] ?? 0) === 0)) return false
        if (f === 'must-no-refs' && (e.inTypology || (citedCounts[e.id] ?? 0) > 0)) return false
        if (f === 'trig' && e.kind !== 'trig-identity') return false
        // 'theory' = exclude trig-identity, integral, bessel-table; keep everything else (incl. fourier-pair, hilbert)
        if (f === 'theory' && (e.kind === 'trig-identity' || e.kind === 'integral' || e.kind === 'bessel-table')) return false
      }
      return true
    }

    // Weighted flat list (sorted by cited count desc, ties by title)
    const flat = FORMULA_SHEET.flatMap((s) => s.entries).filter(passes)
    const weighted = [...flat].sort((a, b) => {
      const diff = (citedCounts[b.id] ?? 0) - (citedCounts[a.id] ?? 0)
      return diff !== 0 ? diff : a.title.localeCompare(b.title, 'el')
    })

    // Section-grouped list (typology-first within each section)
    const groups = FORMULA_SHEET.map((section) => {
      const filtered = section.entries.filter(passes)
      const inOrder = [...filtered].sort((a, b) => {
        if (a.inTypology === b.inTypology) return 0
        return a.inTypology ? -1 : 1
      })
      return { ...section, entries: inOrder }
    }).filter((s) => s.entries.length > 0)

    return { weightedEntries: weighted, sectionGroups: groups }
  }, [activeFilters, citedCounts])

  const isEmpty = sortMode === 'weight'
    ? weightedEntries.length === 0
    : sectionGroups.length === 0

  return (
    <>
      {/* ── Global 3-tile stats breakdown (replaces ambiguous single counter) ── */}
      <div className="not-prose mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatTile
          emoji="🟢"
          n={stats.n1}
          label="Στο τυπολόγιο"
          active={activeFilters.size === 1 && activeFilters.has('typology')}
          onClick={() => handleTileClick('typology')}
        />
        <StatTile
          emoji="🔥"
          n={stats.n2}
          label="Πρέπει να θυμάσαι, σε παλιά θέματα"
          active={activeFilters.size === 1 && activeFilters.has('must-refs')}
          onClick={() => handleTileClick('must-refs')}
        />
        <StatTile
          emoji="⏳"
          n={stats.n3}
          label="Πρέπει να θυμάσαι, δεν έχει εμφανιστεί ακόμα"
          active={activeFilters.size === 1 && activeFilters.has('must-no-refs')}
          onClick={() => handleTileClick('must-no-refs')}
        />
      </div>

      {/* ── Sort radio ── */}
      <div className="not-prose mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-bg-elevated px-4 py-3">
        <div className="flex items-center gap-1.5 text-sm text-fg-muted">
          <ArrowDownUp className="h-4 w-4" aria-hidden />
          <span>Σειρά:</span>
        </div>
        <div
          className="inline-flex rounded-md border border-border bg-bg p-0.5"
          role="radiogroup"
          aria-label="Σειρά εμφάνισης τύπων"
        >
          <ToggleButton
            active={sortMode === 'default'}
            onClick={() => setSortMode('default')}
            label="Εμφάνισης"
          />
          <ToggleButton
            active={sortMode === 'weight'}
            onClick={() => setSortMode('weight')}
            label="Βάρος ↓"
          />
        </div>
        {sortMode === 'weight' && (
          <p className="ml-auto hidden text-xs text-fg-muted sm:block">
            Ταξινόμηση κατά αριθμό παλιών θεμάτων (φθίνων)
          </p>
        )}
      </div>

      {/* ── Filter chips (multi-select, AND composition) ── */}
      <div className="not-prose mb-8 flex flex-wrap gap-2">
        <FilterChip
          label="Όλα"
          active={activeFilters.size === 0}
          onClick={() => setActiveFilters(new Set())}
        />
        <FilterChip
          label="Στο τυπολόγιο"
          active={activeFilters.has('typology')}
          onClick={() => toggleFilter('typology')}
        />
        <FilterChip
          label="🔥 Πρέπει να θυμάσαι — έχει εμφανιστεί σε εξετάσεις"
          active={activeFilters.has('must-refs')}
          onClick={() => toggleFilter('must-refs')}
        />
        <FilterChip
          label="⏳ Πρέπει να θυμάσαι — δεν έχει εμφανιστεί ακόμα"
          active={activeFilters.has('must-no-refs')}
          onClick={() => toggleFilter('must-no-refs')}
        />
        <FilterChip
          label="Τριγωνομετρία"
          active={activeFilters.has('trig')}
          onClick={() => toggleFilter('trig')}
        />
        <FilterChip
          label="Θεωρία"
          active={activeFilters.has('theory')}
          onClick={() => toggleFilter('theory')}
        />
      </div>

      {isEmpty && (
        <p className="not-prose text-sm text-fg-muted">
          Δεν υπάρχουν τύποι για αυτόν τον συνδυασμό φίλτρων.
        </p>
      )}

      {/* ── Weighted flat list ── */}
      {sortMode === 'weight' && !isEmpty && (
        <section className="not-prose mb-10">
          <div className="space-y-3">
            {weightedEntries.map((entry) => (
              <FormulaEntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      )}

      {/* ── Section-grouped list ── */}
      {sortMode === 'default' &&
        sectionGroups.map((section) => (
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
                {section.entries.length}{' '}
                {section.entries.length === 1 ? 'τύπος' : 'τύποι'}
              </span>
              <SectionMix entries={section.entries} />
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

function StatTile({
  emoji,
  n,
  label,
  active,
  onClick,
}: {
  emoji: string
  n: number
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-left transition hover:border-accent/40',
        active ? 'border-accent bg-accent-soft/20' : 'border-border bg-bg-elevated',
      )}
    >
      <span className="shrink-0 text-xl" aria-hidden>
        {emoji}
      </span>
      <div className="min-w-0">
        <div className="text-xl font-bold text-fg">{n}</div>
        <div className="mt-0.5 text-[11px] leading-tight text-fg-muted">{label}</div>
      </div>
    </button>
  )
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition',
        active
          ? 'border-accent bg-accent text-white'
          : 'border-border bg-bg text-fg-muted hover:border-accent/40 hover:text-fg',
      )}
    >
      {label}
    </button>
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
    <span className="inline-flex items-center gap-1 rounded border border-border bg-bg-soft px-1.5 py-0.5 text-[10px] text-fg-muted">
      <ListFilter className="h-2.5 w-2.5" aria-hidden />
      κεφ. {t} ✓ · {m} ⚠️
    </span>
  )
}
