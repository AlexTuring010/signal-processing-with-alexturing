'use client'

/**
 * MinMaxFlipExplainer — the headline conceptual moment of front-set-8-ask2.
 *
 * The lecture taught alignment as «ελαχιστοποίησε το κόστος» — every penalty
 * is a POSITIVE cost, the right operator is MIN. The problem flips both:
 * matches are REWARDS (+1), mismatches and gaps are PENALTIES (−1, −2), and
 * the right operator becomes MAX. Three tabs:
 *
 *   1. Διάλεξη   — min over positive costs (δ = +1, α = +1)
 *   2. Άσκηση    — max over signed score (match +1, mismatch −1, gap −2)
 *   3. Σύγκριση  — both side-by-side: same recurrence skeleton, signs flipped
 *
 * Each tab uses the SAME cell-context numbers as a worked example so the
 * student can compare arithmetic apples-to-apples. The headline: it is the
 * same DP machine — change the sign of «καλό» and you change the operator.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'

type World = 'min' | 'max' | 'side'

const TAB_LABEL: Record<World, string> = {
  min: 'Διάλεξη · min/κόστος',
  max: 'Άσκηση · max/σκορ',
  side: 'Σύγκριση · παράλληλα',
}

// Shared numeric context — the three "neighbour cell" values, in BOTH worlds.
// The lecture neighbours start with positive cost; the problem neighbours
// start with NEGATIVE score because matches further back paid in penalty.
// Concretely we picked a (3, 4) cell where x_i and y_j HAPPEN to be equal so
// the diagonal pays α=0 (lecture) / σ=+1 (problem) — the "match wins" case.
const LEC = {
  diagNeighbour: 4, // OPT(i-1, j-1) in the lecture world (a small positive cost)
  upNeighbour: 5, // OPT(i-1, j)
  leftNeighbour: 6, // OPT(i, j-1)
  gap: 1, // δ
  alphaMatch: 0,
  alphaMismatch: 1,
}

const SCR = {
  diagNeighbour: -2, // M(i-1, j-1) in the problem world
  upNeighbour: -4, // M(i-1, j)
  leftNeighbour: -5, // M(i, j-1)
  gap: -2, // every gap pays −2
  sigmaMatch: +1,
  sigmaMismatch: -1,
}

function lecCandidates(matched: boolean) {
  const a = matched ? LEC.alphaMatch : LEC.alphaMismatch
  return {
    diag: { label: 'ταίριασμα', term: `α + diag = ${a} + ${LEC.diagNeighbour}`, value: a + LEC.diagNeighbour },
    up: { label: 'κενό X', term: `δ + up = ${LEC.gap} + ${LEC.upNeighbour}`, value: LEC.gap + LEC.upNeighbour },
    left: { label: 'κενό Y', term: `δ + left = ${LEC.gap} + ${LEC.leftNeighbour}`, value: LEC.gap + LEC.leftNeighbour },
  }
}

function scrCandidates(matched: boolean) {
  const s = matched ? SCR.sigmaMatch : SCR.sigmaMismatch
  return {
    diag: {
      label: 'ταίριασμα',
      term: `σ + diag = (${s}) + (${SCR.diagNeighbour})`,
      value: s + SCR.diagNeighbour,
    },
    up: {
      label: 'κενό X',
      term: `gap + up = (${SCR.gap}) + (${SCR.upNeighbour})`,
      value: SCR.gap + SCR.upNeighbour,
    },
    left: {
      label: 'κενό Y',
      term: `gap + left = (${SCR.gap}) + (${SCR.leftNeighbour})`,
      value: SCR.gap + SCR.leftNeighbour,
    },
  }
}

function fmt(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`
}

function CellRow({
  label,
  term,
  value,
  picked,
  tone,
}: {
  label: string
  term: string
  value: number
  picked: boolean
  tone: 'min' | 'max'
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-md border px-3 py-2',
        picked
          ? tone === 'min'
            ? 'border-success/50 bg-success/10'
            : 'border-success/50 bg-success/10'
          : 'border-border bg-bg-soft/40',
      )}
    >
      <div className="min-w-0">
        <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
          {label}
        </div>
        <div className="truncate font-mono text-xs text-fg-muted">{term}</div>
      </div>
      <div
        className={cn(
          'shrink-0 rounded-md px-2 py-1 font-mono text-base font-bold tabular-nums',
          picked
            ? 'bg-success/20 text-success'
            : value < 0
              ? 'bg-rose-500/15 text-rose-500'
              : 'bg-bg-elevated text-fg',
        )}
      >
        {fmt(value)}
      </div>
    </div>
  )
}

function WorldCard({ world, matched }: { world: 'min' | 'max'; matched: boolean }) {
  const isMin = world === 'min'
  const candidates = isMin ? lecCandidates(matched) : scrCandidates(matched)
  const pickedValue = isMin
    ? Math.min(candidates.diag.value, candidates.up.value, candidates.left.value)
    : Math.max(candidates.diag.value, candidates.up.value, candidates.left.value)
  const wrongValue = isMin
    ? Math.max(candidates.diag.value, candidates.up.value, candidates.left.value)
    : Math.min(candidates.diag.value, candidates.up.value, candidates.left.value)
  const operator = isMin ? 'min' : 'max'
  const wrongOperator = isMin ? 'max' : 'min'
  const headerTone = isMin ? 'border-sky-400/50 bg-sky-400/5' : 'border-violet-400/50 bg-violet-400/5'
  const accentText = isMin ? 'text-sky-500' : 'text-violet-500'

  return (
    <div className={cn('overflow-hidden rounded-xl border', headerTone)}>
      <div className="border-b border-border px-3 py-2">
        <div className={cn('text-xs font-bold uppercase tracking-wider', accentText)}>
          {isMin ? 'Κόσμος της διάλεξης' : 'Κόσμος της άσκησης'}
        </div>
        <div className="font-mono text-sm font-semibold text-fg">
          {isMin ? 'OPT(i, j) = MIN κόστος' : 'M(i, j) = MAX σκορ'}
        </div>
      </div>
      <div className="space-y-2 p-3">
        <div className="rounded-md bg-bg-elevated px-3 py-2 text-xs leading-relaxed text-fg-muted">
          {isMin ? (
            <>
              <strong>Σταθερές:</strong> κενό{' '}
              <span className="font-mono">δ = {fmt(LEC.gap)}</span>· σύγκρουση{' '}
              <span className="font-mono">α = {fmt(LEC.alphaMismatch)}</span>· ίδιοι{' '}
              <span className="font-mono">{fmt(LEC.alphaMatch)}</span>.{' '}
              <em>Όσο μικρότερο, τόσο καλύτερα.</em>
            </>
          ) : (
            <>
              <strong>Σταθερές:</strong> κενό{' '}
              <span className="font-mono">gap = {fmt(SCR.gap)}</span>· σύγκρουση{' '}
              <span className="font-mono">σ = {fmt(SCR.sigmaMismatch)}</span>· ίδιοι{' '}
              <span className="font-mono">{fmt(SCR.sigmaMatch)}</span>.{' '}
              <em>Όσο μεγαλύτερο, τόσο καλύτερα.</em>
            </>
          )}
        </div>

        <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
          Οι τρεις υποψήφιοι για το (i, j)
        </div>
        <CellRow
          label={candidates.diag.label}
          term={candidates.diag.term}
          value={candidates.diag.value}
          picked={candidates.diag.value === pickedValue}
          tone={world}
        />
        <CellRow
          label={candidates.up.label}
          term={candidates.up.term}
          value={candidates.up.value}
          picked={candidates.up.value === pickedValue}
          tone={world}
        />
        <CellRow
          label={candidates.left.label}
          term={candidates.left.term}
          value={candidates.left.value}
          picked={candidates.left.value === pickedValue}
          tone={world}
        />

        <div className="mt-1 rounded-md border border-success/50 bg-success/10 px-3 py-2">
          <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-success">
            {operator} ⇒ {isMin ? 'OPT' : 'M'}(i, j)
          </div>
          <div className="font-mono text-xl font-bold tabular-nums text-success">
            {fmt(pickedValue)}
          </div>
        </div>

        <div className="rounded-md border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-xs leading-relaxed">
          <strong className="text-rose-500">Αν χρησιμοποιούσες {wrongOperator} εδώ:</strong>{' '}
          θα έπαιρνες <span className="font-mono font-bold">{fmt(wrongValue)}</span> — δηλαδή{' '}
          {isMin ? 'το ακριβότερο κελί. Λάθος, ζητάμε το φτηνότερο.' : 'το χειρότερο σκορ. Λάθος, ζητάμε το υψηλότερο.'}
        </div>
      </div>
    </div>
  )
}

export function MinMaxFlipExplainer() {
  const [tab, setTab] = useState<World>('side')
  const [matched, setMatched] = useState(true)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Το ίδιο DP, διαφορετικός κόσμος αρίθμησης — min ↔ max
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          Σκελετός ίδιος · πρόσημα + τελεστής αλλάζουν
        </span>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-fg-subtle">
        Η διάλεξη όρισε την ευθυγράμμιση σαν «ελάχιστο κόστος» — όλα τα ποσά
        θετικά. Η άσκηση τα ίδια τρία γεγονότα (ταίριασμα, κενό-X, κενό-Y) τα
        αμείβει με <em>σκορ</em>: ταύτιση <span className="font-mono">+1</span>,
        σύγκρουση <span className="font-mono">−1</span>, κενό{' '}
        <span className="font-mono">−2</span>· νικητής το <strong>μέγιστο</strong>.
      </p>

      {/* tab buttons */}
      <div role="tablist" className="mb-3 flex flex-wrap gap-1">
        {(['min', 'max', 'side'] as const).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={cn(
              'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
              tab === k
                ? 'border-accent bg-accent text-accent-fg'
                : 'border-border bg-bg-soft/30 text-fg hover:bg-bg-soft',
            )}
          >
            {TAB_LABEL[k]}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setMatched((v) => !v)}
          className={cn(
            'ml-auto rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
            matched
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600'
              : 'border-amber-500/50 bg-amber-500/10 text-amber-600',
          )}
        >
          x<sub>j</sub> {matched ? '=' : '≠'} y<sub>i</sub>
        </button>
      </div>

      {/* content */}
      {tab === 'min' && <WorldCard world="min" matched={matched} />}
      {tab === 'max' && <WorldCard world="max" matched={matched} />}
      {tab === 'side' && (
        <div className="grid gap-3 lg:grid-cols-2">
          <WorldCard world="min" matched={matched} />
          <WorldCard world="max" matched={matched} />
        </div>
      )}

      {/* the rule */}
      <div className="mt-3 rounded-lg border border-accent/40 bg-accent/5 px-3 py-2">
        <div className="mb-1 text-[0.7rem] font-semibold uppercase tracking-wider text-accent">
          Ο κανόνας του αναποδογυρίσματος
        </div>
        <p className="text-sm leading-relaxed text-fg">
          Όταν αλλάζει το πρόσημο του «καλού», αλλάζει και ο τελεστής. Στη
          διάλεξη το «καλό» είναι το <em>μικρό</em> (όλα θετικά κόστη, ζητάμε{' '}
          <span className="font-mono">min</span>). Εδώ το «καλό» είναι το{' '}
          <em>μεγάλο</em> (αμοιβή <span className="font-mono">+1</span>,
          ποινές <span className="font-mono">−1, −2</span>, ζητάμε{' '}
          <span className="font-mono">max</span>). Ο σκελετός — τρεις
          υποψήφιοι, μία επιλογή — μένει αυτούσιος.
        </p>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-fg-subtle">
        Άλλαξε το κουμπί επάνω δεξιά για να δεις πώς κινούνται οι τρεις
        υποψήφιοι στην περίπτωση <strong>ταυτότητας</strong> έναντι{' '}
        <strong>σύγκρουσης</strong> — η διαγώνια αλλάζει πιο πολύ από όλες,
        γιατί <em>μόνο εκείνη</em> εξαρτάται από το αν τα γράμματα ταιριάζουν.
      </p>
    </section>
  )
}
