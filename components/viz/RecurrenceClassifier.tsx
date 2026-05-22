'use client'

/**
 * RecurrenceClassifier — an interactive Master Theorem explorer for L03.
 *
 * Set a, b, d for T(n) = a·T(n/b) + O(nᵈ). The component computes logᵦa,
 * picks the Master Theorem case, and — crucially — shows *why* via a
 * work-per-level bar strip driven by the ratio r = a/bᵈ: root-heavy when
 * r < 1, balanced when r = 1, leaf-heavy when r > 1.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'

type Preset = { id: string; label: string; a: number; b: number; d: number }

const PRESETS: Preset[] = [
  { id: 'merge', label: 'Mergesort', a: 2, b: 2, d: 1 },
  { id: 'bsearch', label: 'Δυαδική αναζήτηση', a: 1, b: 2, d: 0 },
  { id: 'karatsuba', label: 'Karatsuba', a: 3, b: 2, d: 1 },
  { id: 'select', label: 'Γραμμική επιλογή', a: 1, b: 2, d: 1 },
  { id: 'strassen', label: 'Strassen', a: 7, b: 2, d: 2 },
]

const EPS = 1e-9
const LEVELS = [0, 1, 2, 3, 4, 5]

/** Trim to ≤3 decimals, drop trailing zeros. */
function fmt(x: number): string {
  return Number(x.toFixed(3)).toString()
}

/** Render nˣ readably: n⁰ → "1", n¹ → "n", else n with a superscript. */
function Pow({ exp }: { exp: number }) {
  const e = Number(exp.toFixed(3))
  if (e === 0) return <>1</>
  if (e === 1) return <>n</>
  return (
    <>
      n<sup>{e}</sup>
    </>
  )
}

export function RecurrenceClassifier() {
  const [a, setA] = useState(2)
  const [b, setB] = useState(2)
  const [d, setD] = useState(1)

  const logba = Math.log(a) / Math.log(b)
  const caseNo: 1 | 2 | 3 = d > logba + EPS ? 1 : d < logba - EPS ? 3 : 2
  const r = a / b ** d

  const activePreset = PRESETS.find((p) => p.a === a && p.b === b && p.d === d)

  const apply = (p: Preset) => {
    setA(p.a)
    setB(p.b)
    setD(p.d)
  }

  // work per level k ∝ rᵏ, normalised so the tallest bar fills the strip
  const works = LEVELS.map((k) => r ** k)
  const maxW = Math.max(...works)

  const cmp = caseNo === 1 ? '>' : caseNo === 3 ? '<' : '='
  const cmpColor =
    caseNo === 1 ? 'text-accent' : caseNo === 3 ? 'text-success' : 'text-warn'

  const caseTitle =
    caseNo === 1
      ? 'Περίπτωση 1 — η ρίζα κυριαρχεί'
      : caseNo === 2
        ? 'Περίπτωση 2 — ισορροπία'
        : 'Περίπτωση 3 — τα φύλλα κυριαρχούν'

  const caseWhy =
    caseNo === 1
      ? 'Το συνδυαστικό βήμα είναι «ακριβό»: η δουλειά φθίνει από επίπεδο σε επίπεδο, οπότε το πρώτο επίπεδο (η ρίζα) μαζεύει το μεγαλύτερο μέρος του κόστους.'
      : caseNo === 2
        ? 'Κάθε επίπεδο του δέντρου αναδρομής κοστίζει το ίδιο, και υπάρχουν περίπου logᵦn επίπεδα — γι’ αυτό εμφανίζεται ο παράγοντας log n.'
        : 'Τα υποπροβλήματα πληθαίνουν πιο γρήγορα απ’ ό,τι μικραίνουν: η δουλειά αυξάνει προς τα κάτω, και τα φύλλα του δέντρου κυριαρχούν.'

  const resultNode =
    caseNo === 1 ? (
      <>
        O(
        <Pow exp={d} />)
      </>
    ) : caseNo === 2 ? (
      d <= EPS ? (
        <>O(log n)</>
      ) : (
        <>
          O(
          <Pow exp={d} /> · log n)
        </>
      )
    ) : (
      <>
        O(
        <Pow exp={logba} />)
      </>
    )

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-3 text-sm font-semibold tracking-tight text-fg">
        Master Theorem — διάλεξε a, b, d και δες την περίπτωση
      </div>

      {/* presets */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => apply(p)}
            className={cn(
              'rounded-md border px-2 py-0.5 text-sm transition-colors',
              activePreset?.id === p.id
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-fg-muted hover:text-fg',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* sliders */}
      <div className="grid gap-2.5 sm:grid-cols-3">
        <Slider label="a — πλήθος υποπροβλημάτων" value={a} min={1} max={8} step={1} onChange={setA} />
        <Slider label="b — παράγοντας σμίκρυνσης" value={b} min={2} max={6} step={1} onChange={setB} />
        <Slider
          label="d — εκθέτης συνδυασμού"
          value={d}
          min={0}
          max={3}
          step={0.25}
          onChange={setD}
          display={fmt(d)}
        />
      </div>

      {/* the recurrence */}
      <div className="mt-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-center font-mono text-[0.95rem] text-fg">
        T(n) = {a === 1 ? '' : `${a} · `}T(n/{b}) + O(<Pow exp={d} />)
      </div>

      {/* the comparison */}
      <div className="mt-3 flex items-center justify-center gap-3 text-sm">
        <span className="font-mono text-fg">
          d = <span className="font-semibold">{fmt(d)}</span>
        </span>
        <span className={cn('text-xl font-bold', cmpColor)}>{cmp}</span>
        <span className="font-mono text-fg">
          log<sub>{b}</sub>
          {a} = <span className="font-semibold">{fmt(logba)}</span>
        </span>
      </div>

      {/* verdict */}
      <div
        className={cn(
          'mt-3 rounded-lg border px-3 py-2.5',
          caseNo === 1 && 'border-accent/40 bg-accent/5',
          caseNo === 2 && 'border-warn/40 bg-warn/5',
          caseNo === 3 && 'border-success/40 bg-success/5',
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-bold text-fg">{caseTitle}</span>
          <span className="rounded-md border border-border bg-bg-elevated px-2 py-0.5 font-mono text-sm font-semibold text-fg">
            T(n) = {resultNode}
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{caseWhy}</p>
      </div>

      {/* work-per-level bars */}
      <div className="mt-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          <span>Δουλειά ανά επίπεδο του δέντρου</span>
          <span className="font-mono normal-case text-fg-muted">r = a/bᵈ = {fmt(r)}</span>
        </div>
        <div className="flex h-24 items-end gap-1.5">
          {works.map((w, k) => {
            const h = Math.max(w / maxW, 0.04)
            const dominates =
              (caseNo === 1 && k === 0) || (caseNo === 3 && k === LEVELS.length - 1)
            return (
              <div key={k} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className={cn(
                      'w-full rounded-t transition-all',
                      caseNo === 2
                        ? 'bg-accent/60'
                        : dominates
                          ? 'bg-accent'
                          : 'bg-accent/25',
                    )}
                    style={{ height: `${h * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-fg-subtle">{k}</span>
              </div>
            )
          })}
        </div>
        <div className="mt-1 text-center text-[11px] text-fg-subtle">
          επίπεδο δέντρου αναδρομής (0 = ρίζα · κάθε επίπεδο είναι r× του προηγουμένου)
        </div>
      </div>
    </section>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  display?: string
}) {
  return (
    <div className="rounded-lg border border-border bg-bg-soft/40 px-2.5 py-2">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-xs text-fg-muted">{label}</span>
        <span className="font-mono text-sm font-bold text-fg">{display ?? value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="h-1.5 w-full cursor-pointer accent-accent"
      />
    </div>
  )
}
