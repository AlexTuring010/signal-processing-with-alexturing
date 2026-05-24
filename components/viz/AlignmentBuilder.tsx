'use client'

/**
 * AlignmentBuilder — build an alignment of two strings, one move at a time,
 * and watch its cost form.
 *
 * An «alignment» is the abstract object the whole lecture optimises, and it
 * does NOT click from a formal definition («ordered pairs that do not
 * cross»). So here the student operates it: at every step there is a next
 * character in each string, and exactly three things you can do with them —
 *
 *   · ζευγάρωσε xᵢ με yⱼ   → pay 0 if they are equal, α if they differ
 *   · άσε το xᵢ αταίριαστο → pay a gap δ
 *   · άσε το yⱼ αταίριαστο → pay a gap δ
 *
 * Those are exactly the three cases of the recurrence — felt before they are
 * written down. Because you always consume the NEXT character and never go
 * back, the alignment you build can never cross itself: that is the whole
 * «non-crossing» rule, demonstrated rather than asserted. A footer contrasts
 * a legal matching with a forbidden crossing one. Built for L16 on the shared
 * GCTA / CTAG instance, where the optimum (2) beats all-diagonal (4).
 */

import { useMemo, useState } from 'react'
import { RotateCcw, Undo2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  EDIT_X,
  EDIT_Y,
  GAP,
  mismatch,
  optimalSteps,
  editDistance,
  type AlignStep,
} from './alignment-instance'

const X = EDIT_X
const Y = EDIT_Y
const M = X.length
const N = Y.length
const OPT = editDistance(X, Y)
const OPT_STEPS = optimalSteps(X, Y)

/** how many X / Y characters a list of moves has consumed */
function consumed(steps: AlignStep[]) {
  let i = 0
  let j = 0
  for (const s of steps) {
    if (s.kind !== 'gapY') i += 1
    if (s.kind !== 'gapX') j += 1
  }
  return { i, j }
}

/** one column of the alignment tape */
function TapeColumn({ step }: { step: AlignStep }) {
  const isMatch = step.kind === 'match'
  const isEqual = isMatch && step.cost === 0
  const tone = isEqual
    ? 'border-emerald-500/70 bg-emerald-500/15'
    : isMatch
      ? 'border-amber-500/70 bg-amber-500/15'
      : 'border-sky-400/70 bg-sky-400/10'
  const costLabel = isEqual ? '0' : isMatch ? 'α' : 'δ'
  const costTone = isEqual
    ? 'text-emerald-500'
    : isMatch
      ? 'text-amber-500'
      : 'text-sky-500'
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={cn(
          'flex w-9 flex-col overflow-hidden rounded-md border font-mono',
          tone,
        )}
      >
        <div className="flex h-8 items-center justify-center border-b border-border/50 text-base font-bold text-fg">
          {step.xi ?? '–'}
        </div>
        <div className="flex h-8 items-center justify-center text-base font-bold text-fg">
          {step.yj ?? '–'}
        </div>
      </div>
      <span className={cn('font-mono text-xs font-bold', costTone)}>
        {costLabel}
      </span>
    </div>
  )
}

/** the tile rows for the two source strings, with a moving cursor */
function SourceRow({
  label,
  str,
  cursor,
}: {
  label: string
  str: string
  cursor: number
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-5 shrink-0 font-mono text-sm font-bold text-fg-subtle">
        {label}
      </span>
      <div className="flex gap-1">
        {str.split('').map((ch, k) => {
          const isDone = k < cursor
          const isNext = k === cursor
          return (
            <div
              key={k}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-md border font-mono text-base font-bold transition-colors',
                isDone && 'border-border bg-bg-soft/40 text-fg-subtle',
                isNext && 'border-accent bg-accent/15 text-fg ring-2 ring-accent/40',
                !isDone && !isNext && 'border-border bg-bg-elevated text-fg',
              )}
            >
              {ch}
            </div>
          )
        })}
        {cursor >= str.length && (
          <div className="flex h-8 items-center px-1 text-xs font-semibold text-success">
            ✓ τέλος
          </div>
        )}
      </div>
    </div>
  )
}

/** small valid-vs-crossing illustration for the «non-crossing» rule */
function CrossingDiagram({ crossing }: { crossing: boolean }) {
  // top dots at y=20, bottom dots at y=72; x = 34 and 96
  const links = crossing
    ? [
        [34, 96],
        [96, 34],
      ]
    : [
        [34, 34],
        [96, 96],
      ]
  return (
    <svg viewBox="0 0 130 92" className="w-full max-w-[150px]">
      {links.map(([x1, x2], idx) => (
        <line
          key={idx}
          x1={x1}
          y1={26}
          x2={x2}
          y2={66}
          stroke={crossing ? 'rgb(244 63 94)' : 'rgb(16 185 129)'}
          strokeWidth={2.4}
        />
      ))}
      {[34, 96].map((x) => (
        <g key={`t${x}`}>
          <circle cx={x} cy={20} r={11} fill="rgb(var(--bg-elevated))" stroke="rgb(var(--border-strong))" strokeWidth={1.5} />
          <text x={x} y={24} textAnchor="middle" fill="rgb(var(--fg))" className="font-mono text-[11px] font-bold">
            {x === 34 ? 'x₁' : 'x₂'}
          </text>
        </g>
      ))}
      {[34, 96].map((x) => (
        <g key={`b${x}`}>
          <circle cx={x} cy={72} r={11} fill="rgb(var(--bg-elevated))" stroke="rgb(var(--border-strong))" strokeWidth={1.5} />
          <text x={x} y={76} textAnchor="middle" fill="rgb(var(--fg))" className="font-mono text-[11px] font-bold">
            {x === 34 ? 'y₁' : 'y₂'}
          </text>
        </g>
      ))}
    </svg>
  )
}

export function AlignmentBuilder() {
  const [steps, setSteps] = useState<AlignStep[]>([])

  const { i, j } = useMemo(() => consumed(steps), [steps])
  const done = i === M && j === N

  const total = steps.reduce((a, s) => a + s.cost, 0)
  const matches = steps.filter((s) => s.kind === 'match' && s.cost === 0).length
  const mismatches = steps.filter((s) => s.kind === 'match' && s.cost > 0).length
  const gaps = steps.filter((s) => s.kind !== 'match').length

  const canMatch = i < M && j < N
  const canGapX = i < M
  const canGapY = j < N

  function pushMatch() {
    if (!canMatch) return
    setSteps((s) => [
      ...s,
      {
        kind: 'match',
        i0: i,
        j0: j,
        i1: i + 1,
        j1: j + 1,
        xi: X[i],
        yj: Y[j],
        cost: mismatch(X[i], Y[j]),
      },
    ])
  }
  function pushGapX() {
    if (!canGapX) return
    setSteps((s) => [
      ...s,
      { kind: 'gapX', i0: i, j0: j, i1: i + 1, j1: j, xi: X[i], yj: null, cost: GAP },
    ])
  }
  function pushGapY() {
    if (!canGapY) return
    setSteps((s) => [
      ...s,
      { kind: 'gapY', i0: i, j0: j, i1: i, j1: j + 1, xi: null, yj: Y[j], cost: GAP },
    ])
  }

  let note: string
  const last = steps[steps.length - 1]
  if (steps.length === 0) {
    note =
      'Η ευθυγράμμιση είναι άδεια. Κοίτα τον επόμενο χαρακτήρα κάθε λέξης (με πορτοκαλί πλαίσιο) και διάλεξε μία από τις τρεις κινήσεις.'
  } else if (done) {
    note =
      total === OPT
        ? `Έτοιμη — και είναι βέλτιστη! Κόστος ${total}, όσο και η απόσταση επεξεργασίας. Πρόσεξε: έχτισες πάντα τον επόμενο χαρακτήρα, ποτέ δεν γύρισες πίσω — γι' αυτό κανένα ζεύγος δεν διασταυρώνεται.`
        : `Έτοιμη ευθυγράμμιση, κόστος ${total}. Είναι έγκυρη — αλλά όχι η φθηνότερη: η βέλτιστη κοστίζει ${OPT}. Πάτα «Αναίρεση» ή «Βέλτιστη» και δες πού γλιτώνεις.`
  } else if (last?.kind === 'match') {
    note =
      last.cost === 0
        ? `Ζευγάρωσες «${last.xi}» με «${last.yj}» — ίδιοι χαρακτήρες, κόστος 0. Δωρεάν κίνηση.`
        : `Ζευγάρωσες «${last.xi}» με «${last.yj}» — διαφορετικοί, σύγκρουση: +α = +${last.cost}.`
  } else if (last?.kind === 'gapX') {
    note = `Άφησες το «${last.xi}» της X αταίριαστο — ένα κενό: +δ = +${GAP}. Ο δείκτης της X προχώρησε, της Y έμεινε.`
  } else {
    note = `Άφησες το «${last?.yj}» της Y αταίριαστο — ένα κενό: +δ = +${GAP}. Ο δείκτης της Y προχώρησε, της X έμεινε.`
  }

  const verdict = !done
    ? null
    : total === OPT
      ? 'optimal'
      : 'suboptimal'

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Χτίσε μια ευθυγράμμιση, κίνηση-κίνηση
        </div>
        <span
          className={cn(
            'shrink-0 rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider',
            verdict === 'optimal'
              ? 'bg-success/15 text-success'
              : verdict === 'suboptimal'
                ? 'bg-amber-500/15 text-amber-600'
                : 'bg-accent/10 text-accent',
          )}
        >
          {done ? `Κόστος ${total}` : `X=${X} · Y=${Y}`}
        </span>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-fg-subtle">
        Κόστος κενού δ = {GAP}, κόστος σύγκρουσης α = 1. Στόχος: ευθυγράμμιση{' '}
        <strong>ελάχιστου κόστους</strong>.
      </p>

      {/* the two source strings */}
      <div className="mb-3 space-y-2 rounded-lg border border-border bg-bg-soft/30 p-3">
        <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
          Οι δύο συμβολοσειρές — ο επόμενος χαρακτήρας κάθε μιας
        </div>
        <SourceRow label="X" str={X} cursor={i} />
        <SourceRow label="Y" str={Y} cursor={j} />
      </div>

      {/* the alignment tape */}
      <div className="mb-3 rounded-lg border border-border bg-bg-soft/30 p-3">
        <div className="mb-2 text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
          Η ευθυγράμμιση — μία στήλη ανά κίνηση
        </div>
        <div className="flex min-h-[5.25rem] flex-wrap items-start gap-1.5">
          {steps.length === 0 && (
            <span className="self-center text-sm text-fg-subtle">
              (καμία κίνηση ακόμα)
            </span>
          )}
          {steps.map((s, k) => (
            <TapeColumn key={k} step={s} />
          ))}
          {!done && steps.length > 0 && (
            <div className="flex h-[4.25rem] w-9 items-center justify-center self-start rounded-md border border-dashed border-border text-lg text-fg-subtle">
              ?
            </div>
          )}
        </div>
      </div>

      {/* cost breakdown */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: 'Ζευγαρώματα', val: matches, sub: 'κόστος 0', tone: 'emerald' },
          { label: 'Συγκρούσεις', val: mismatches, sub: `× α = ${mismatches}`, tone: 'amber' },
          { label: 'Κενά', val: gaps, sub: `× δ = ${gaps * GAP}`, tone: 'sky' },
          { label: 'Σύνολο', val: total, sub: `βέλτιστο: ${OPT}`, tone: 'accent' },
        ].map((c) => (
          <div
            key={c.label}
            className={cn(
              'rounded-lg border px-3 py-2',
              c.tone === 'accent'
                ? done && verdict === 'optimal'
                  ? 'border-success/50 bg-success/10'
                  : 'border-accent/40 bg-accent/5'
                : 'border-border bg-bg-soft/40',
            )}
          >
            <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
              {c.label}
            </div>
            <div className="font-mono text-xl font-bold tabular-nums text-fg">
              {c.val}
            </div>
            <div className="font-mono text-[0.65rem] text-fg-subtle">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className={cn(
          'mt-3 min-h-[3.75rem] rounded-lg border px-3 py-2 text-sm leading-relaxed',
          verdict === 'optimal'
            ? 'border-success/50 bg-success/10 text-fg'
            : verdict === 'suboptimal'
              ? 'border-amber-500/50 bg-amber-500/10 text-fg'
              : 'border-border bg-bg-soft/50 text-fg-muted',
        )}
      >
        {note}
      </div>

      {/* move controls */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={pushMatch}
          disabled={!canMatch}
          className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Ζευγάρωσε {canMatch ? `${X[i]}–${Y[j]}` : 'xᵢ–yⱼ'}
        </button>
        <button
          type="button"
          onClick={pushGapX}
          disabled={!canGapX}
          className="inline-flex items-center gap-1.5 rounded-md border border-sky-400/60 bg-sky-400/10 px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-sky-400/20 disabled:opacity-40"
        >
          Άσε το {canGapX ? `«${X[i]}»` : 'xᵢ'} αταίριαστο
        </button>
        <button
          type="button"
          onClick={pushGapY}
          disabled={!canGapY}
          className="inline-flex items-center gap-1.5 rounded-md border border-sky-400/60 bg-sky-400/10 px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-sky-400/20 disabled:opacity-40"
        >
          Άσε το {canGapY ? `«${Y[j]}»` : 'yⱼ'} αταίριαστο
        </button>
      </div>

      {/* meta controls */}
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSteps((s) => s.slice(0, -1))}
          disabled={steps.length === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <Undo2 className="h-4 w-4" aria-hidden="true" />
          Αναίρεση
        </button>
        <button
          type="button"
          onClick={() => setSteps([])}
          disabled={steps.length === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Καθάρισε
        </button>
        <button
          type="button"
          onClick={() => setSteps([...OPT_STEPS])}
          className="inline-flex items-center gap-1.5 rounded-md border border-success/50 bg-success/10 px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-success/20"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Δες τη βέλτιστη
        </button>
      </div>

      {/* non-crossing rule */}
      <div className="mt-4 rounded-lg border border-border bg-bg-soft/30 p-3">
        <div className="mb-2 text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
          Ο κανόνας «δεν διασταυρώνονται»
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/5 p-2">
            <CrossingDiagram crossing={false} />
            <span className="text-xs font-semibold text-emerald-600">
              ✓ Έγκυρη — η σειρά διατηρείται
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-md border border-rose-500/40 bg-rose-500/5 p-2">
            <CrossingDiagram crossing={true} />
            <span className="text-xs font-semibold text-rose-600">
              ✗ Διασταύρωση — απαγορεύεται
            </span>
          </div>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-fg-muted">
          Δύο ζεύγη <span className="font-mono">xᵢ–yⱼ</span> και{' '}
          <span className="font-mono">xᵢ′–yⱼ′</span> διασταυρώνονται όταν{' '}
          <span className="font-mono">i &lt; i′</span> αλλά{' '}
          <span className="font-mono">j &gt; j′</span> — η σειρά αναποδογυρίζει.
          Χτίζοντας πάντα τον <em>επόμενο</em> χαρακτήρα, αυτό δεν μπορεί ποτέ να
          συμβεί.
        </p>
      </div>
    </section>
  )
}
