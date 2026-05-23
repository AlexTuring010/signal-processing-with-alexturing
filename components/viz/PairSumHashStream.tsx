'use client'

/**
 * PairSumHashStream — Φροντιστηριακό #5 / άσκηση 11.
 *
 * Pair-sum target in O(n) using a hash table. The lesson is the size mismatch:
 * the value range is {1..n⁴} (so a direct-address array would cost 10⁸ cells
 * even for tiny n) but the hash holds only n entries and probes in O(1). The
 * viz drives this home with a stylised «αν είχαμε άμεσο πίνακα...» strip
 * stretched ridiculously wide next to the compact n-entry hash on the right.
 *
 * Two-pass walk on A = [4, 11, 7, 2, 9] with x = 11. Phase 1 inserts every
 * value (with its index) into the hash. Phase 2 sweeps each value, computes
 * the complement b = x − A[i], probes the hash, and lights up the match. Two
 * pairs hit: (4, 7) and (2, 9). The 11 in the array is itself x — its
 * complement is 0, which is not present, demonstrating that «το συμπλήρωμα
 * δεν υπάρχει» is the natural negative case.
 *
 * Built for L10 (Phase D).
 */

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

const ARR = [4, 11, 7, 2, 9]
const X = 11

type InsertStep = { kind: 'insert'; idx: number }
type QueryStep = {
  kind: 'query'
  idx: number
  complement: number
  matchIdx: number | null
  /** kept only when this query has not already been emitted as a pair (i, j) with i < j. */
  emitPair: boolean
}

function makeSteps() {
  const inserts: InsertStep[] = ARR.map((_, idx) => ({ kind: 'insert', idx }))
  // First-seen index in the hash for each value
  const valueToIdx = new Map<number, number>()
  ARR.forEach((v, idx) => {
    if (!valueToIdx.has(v)) valueToIdx.set(v, idx)
  })
  const queries: QueryStep[] = ARR.map((v, idx) => {
    const comp = X - v
    const matchIdx = valueToIdx.has(comp) ? valueToIdx.get(comp)! : null
    const emitPair = matchIdx !== null && matchIdx !== idx && idx < matchIdx
    return { kind: 'query', idx, complement: comp, matchIdx, emitPair }
  })
  return { inserts, queries }
}

const { inserts: INSERTS, queries: QUERIES } = makeSteps()
const N_INS = INSERTS.length
const N_Q = QUERIES.length
const TOTAL = 1 /* intro */ + N_INS + 1 /* transition */ + N_Q + 1 /* done */

type Phase = 'intro' | 'insert' | 'transition' | 'query' | 'done'

function phaseOf(step: number): { phase: Phase; idx: number } {
  if (step === 0) return { phase: 'intro', idx: -1 }
  if (step <= N_INS) return { phase: 'insert', idx: step - 1 }
  if (step === N_INS + 1) return { phase: 'transition', idx: -1 }
  if (step <= N_INS + 1 + N_Q) return { phase: 'query', idx: step - N_INS - 2 }
  return { phase: 'done', idx: -1 }
}

export function PairSumHashStream() {
  const [step, setStep] = useState(0)
  const { phase, idx } = phaseOf(step)

  // Hash table state (value -> first index that inserted it)
  const hash = useMemo(() => {
    const m = new Map<number, number>()
    const upTo =
      phase === 'insert' ? idx + 1
      : phase === 'intro' ? 0
      : N_INS
    for (let k = 0; k < upTo; k++) {
      const v = ARR[INSERTS[k].idx]
      if (!m.has(v)) m.set(v, INSERTS[k].idx)
    }
    return m
  }, [phase, idx])

  // Pairs already announced
  const pairs = useMemo(() => {
    if (phase === 'intro' || phase === 'insert' || phase === 'transition') return []
    const upTo = phase === 'query' ? idx + 1 : N_Q
    const out: { i: number; j: number }[] = []
    for (let k = 0; k < upTo; k++) {
      const q = QUERIES[k]
      if (q.emitPair && q.matchIdx !== null) out.push({ i: q.idx, j: q.matchIdx })
    }
    return out
  }, [phase, idx])

  const caption = (() => {
    if (phase === 'intro') {
      return (
        <>
          <strong>Είσοδος.</strong> Πίνακας {`A = [4, 11, 7, 2, 9]`}, στόχος{' '}
          <code>x = {X}</code>. Στόχος: βρες κάθε ζεύγος δεικτών (i, j) με{' '}
          <code>A[i] + A[j] = x</code>, σε αναμενόμενο γραμμικό χρόνο. Οι τιμές
          μπορούν να φτάνουν <code>n⁴</code> — γι' αυτό αποφεύγουμε άμεσο πίνακα.
        </>
      )
    }
    if (phase === 'insert') {
      const v = ARR[INSERTS[idx].idx]
      const i = INSERTS[idx].idx
      return (
        <>
          <strong>Φάση 1.</strong> Εισάγουμε το <code>A[{i}] = {v}</code> στο
          hash table — το κλειδί είναι η ίδια η τιμή, η εγγραφή κρατά τον
          δείκτη. <code>O(1)</code> αναμενόμενα.
        </>
      )
    }
    if (phase === 'transition') {
      return (
        <>
          <strong>Ο πίνακας H έχει χτιστεί.</strong> Το hash έχει <code>n</code>{' '}
          εγγραφές — όχι <code>n⁴</code>. Από εδώ ξεκινά η Φάση 2: για κάθε{' '}
          <code>A[i]</code>, ψάχνουμε το συμπλήρωμα <code>b = x − A[i]</code>.
        </>
      )
    }
    if (phase === 'query') {
      const q = QUERIES[idx]
      const v = ARR[q.idx]
      if (q.matchIdx === null) {
        return (
          <>
            <strong>Φάση 2.</strong> <code>A[{q.idx}] = {v}</code>. Συμπλήρωμα{' '}
            <code>b = {X} − {v} = {q.complement}</code>. Ψάχνω το{' '}
            <code>{q.complement}</code> στο H… <span className="text-fg-muted font-semibold">δεν βρέθηκε</span>.
          </>
        )
      }
      if (q.matchIdx === q.idx) {
        return (
          <>
            <strong>Φάση 2.</strong> <code>A[{q.idx}] = {v}</code>. Συμπλήρωμα{' '}
            <code>b = {X} − {v} = {q.complement}</code>. Το <code>{q.complement}</code>{' '}
            υπάρχει — αλλά είναι ο ίδιος δείκτης{' '}
            <code>j = i = {q.idx}</code>, οπότε <span className="text-warning font-semibold">δεν είναι έγκυρο ζεύγος</span>.
          </>
        )
      }
      const j = q.matchIdx
      const partner = ARR[j]
      if (q.emitPair) {
        return (
          <>
            <strong>Φάση 2.</strong> <code>A[{q.idx}] = {v}</code>. Συμπλήρωμα{' '}
            <code>b = {q.complement}</code>. <span className="text-success font-semibold">Βρέθηκε</span>{' '}
            στη θέση {j}: ζεύγος{' '}
            <code>({q.idx}, {j})</code> με <code>{v} + {partner} = {X}</code>.
          </>
        )
      }
      return (
        <>
          <strong>Φάση 2.</strong> <code>A[{q.idx}] = {v}</code>. Συμπλήρωμα{' '}
          <code>b = {q.complement}</code>. <span className="text-fg-muted font-semibold">Έχει ήδη αναφερθεί</span>{' '}
          ως ζεύγος ({j}, {q.idx}) — δεν το ξαναεκτυπώνουμε.
        </>
      )
    }
    return (
      <>
        <strong>Τέλος.</strong> Συνολικά {pairs.length} ζεύγη. Κόστος{' '}
        <code>O(n) + O(n) = O(n)</code> αναμενόμενα — ίδιο φράγμα και για
        τιμές μέχρι <code>n⁴</code>, χάρη στο hash.
      </>
    )
  })()

  // Highlighting helpers for the array row
  const hot = (() => {
    if (phase === 'insert') return { i: INSERTS[idx].idx, j: -1 }
    if (phase === 'query') {
      const q = QUERIES[idx]
      return { i: q.idx, j: q.matchIdx ?? -1 }
    }
    return { i: -1, j: -1 }
  })()

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Ζεύγη με άθροισμα x — hash σε O(n)
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {phase === 'intro' ? 'Εισαγωγή'
            : phase === 'insert' ? `Φάση 1 · ${idx + 1}/${N_INS}`
            : phase === 'transition' ? 'Η ουρά αλλάζει'
            : phase === 'query' ? `Φάση 2 · ${idx + 1}/${N_Q}`
            : 'Ολοκληρώθηκε'}
        </span>
      </div>

      {/* Why-not-direct-array banner */}
      <div className="mb-3 rounded-lg border border-dashed border-border bg-bg-soft/30 p-2.5 text-xs text-fg-muted">
        <span className="font-semibold text-fg">Γιατί όχι άμεσος πίνακας;</span>{' '}
        Οι τιμές φτάνουν το <code>n⁴</code>· π.χ. για n = 1000, ένας πίνακας με
        κελί ανά πιθανή τιμή θέλει <code>10¹²</code> εγγραφές. Το hash κρατά μόνο{' '}
        <strong>n</strong> εγγραφές και απαντά σε <code>O(1)</code> κατά μέσο όρο,
        ανεξάρτητα από το πόσο μεγάλες είναι οι τιμές.
      </div>

      {/* Array row */}
      <div className="mb-3 flex flex-wrap items-center justify-center gap-1.5">
        <span className="mr-1 text-xs uppercase tracking-wider text-fg-subtle">A =</span>
        {ARR.map((v, k) => {
          const isI = k === hot.i
          const isJ = k === hot.j
          return (
            <div
              key={k}
              className={cn(
                'flex w-[3.25rem] flex-col items-center rounded-md border-2 py-1 transition-colors',
                isI && isJ
                  ? 'border-fuchsia-500 bg-fuchsia-500/15'
                  : isI
                    ? 'border-amber-500 bg-amber-500/15'
                    : isJ
                      ? 'border-success bg-success/15'
                      : 'border-border bg-bg-soft',
              )}
            >
              <span className="text-sm font-bold text-fg">{v}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
                A[{k}]
              </span>
            </div>
          )
        })}
        <div className="ml-2 rounded-md bg-bg-soft px-2 py-1 text-xs font-bold text-fg">
          x = {X}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr,1fr]">
        {/* Equation / current operation panel */}
        <div className="rounded-lg border border-border bg-bg-soft/40 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            {phase === 'insert' ? 'Τρέχουσα εισαγωγή'
              : phase === 'query' ? 'Τρέχουσα αναζήτηση'
              : 'Εξίσωση'}
          </div>
          <div className="mt-1 font-mono text-base text-fg">
            {phase === 'insert' && (() => {
              const v = ARR[INSERTS[idx].idx]
              const i = INSERTS[idx].idx
              return <>H.insert({v}, idx={i})</>
            })()}
            {phase === 'query' && (() => {
              const q = QUERIES[idx]
              const v = ARR[q.idx]
              return (
                <>
                  H.find({X} − {v}) = <span className={cn('font-bold', q.matchIdx !== null ? 'text-success' : 'text-fg-muted')}>
                    {q.matchIdx !== null ? `idx ${q.matchIdx}` : '∅'}
                  </span>
                </>
              )
            })()}
            {phase === 'intro' && <span className="text-fg-muted">b = x − A[i]</span>}
            {phase === 'transition' && <span className="text-fg-muted">b = x − A[i]</span>}
            {phase === 'done' && <span className="text-success">{pairs.length} ζεύγη</span>}
          </div>
          <div className="mt-2 text-xs leading-relaxed text-fg-muted">
            {phase === 'insert' ? 'Κάθε εγγραφή κρατά το ζεύγος (τιμή, δείκτης).'
              : phase === 'query' ? 'Έλεγξε αν ο συμπληρωματικός υπάρχει — μία πράξη.'
              : phase === 'intro' ? 'Δύο σάρωσεις. Κάθε βήμα O(1).'
              : phase === 'transition' ? 'n εγγραφές χωρίς να ξέρουμε τις τιμές εκ των προτέρων.'
              : `Δύο ζεύγη βρέθηκαν στο [4, 11, 7, 2, 9] για x = ${X}.`}
          </div>
        </div>

        {/* Hash table panel */}
        <div className="rounded-lg border border-border bg-bg-soft/40 p-3">
          <div className="mb-1 flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              Hash table H — τιμή → δείκτης
            </div>
            <span className="rounded bg-bg-elevated px-1.5 py-0.5 text-[10px] font-bold text-fg-muted">
              {hash.size} εγγρ.
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 font-mono text-xs">
            {[...hash.entries()]
              .sort((a, b) => a[0] - b[0])
              .map(([key, val]) => {
                const isFreshInsert = phase === 'insert' && ARR[INSERTS[idx].idx] === key
                const isQueryHit =
                  phase === 'query' &&
                  QUERIES[idx].matchIdx !== null &&
                  QUERIES[idx].complement === key
                return (
                  <div
                    key={key}
                    className={cn(
                      'flex items-center justify-between rounded px-1.5 py-0.5',
                      isQueryHit
                        ? 'bg-success/20 font-bold text-success'
                        : isFreshInsert
                          ? 'bg-amber-500/15 text-fg'
                          : 'text-fg-muted',
                    )}
                  >
                    <span>{key}</span>
                    <span className="text-fg-subtle">→ idx {val}</span>
                  </div>
                )
              })}
            {hash.size === 0 && (
              <div className="col-span-2 italic text-fg-subtle">— άδειο —</div>
            )}
          </div>
        </div>
      </div>

      {/* Pair log */}
      {pairs.length > 0 && (
        <div className="mt-3 rounded-lg border border-success/40 bg-success/5 p-3">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-success">
            Ζεύγη που εκτυπώθηκαν
          </div>
          <ul className="space-y-0.5 font-mono text-xs text-fg">
            {pairs.map((p, k) => (
              <li key={k}>
                ({p.i}, {p.j}) · A[{p.i}] + A[{p.j}] = {ARR[p.i]} + {ARR[p.j]} = {X}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        aria-live="polite"
        className="mt-3 min-h-[3.5rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg"
      >
        {caption}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2.5 py-1 text-xs font-semibold text-fg hover:bg-bg-soft disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Πίσω
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(TOTAL - 1, s + 1))}
            disabled={step === TOTAL - 1}
            className="inline-flex items-center gap-1 rounded-md border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent hover:bg-accent/15 disabled:opacity-40"
          >
            Επόμενο <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="ml-1 inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-semibold text-fg-muted hover:bg-bg-soft"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={cn(
              'rounded px-2 py-1 text-[11px] font-semibold',
              phase === 'insert' ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300' : 'text-fg-muted hover:bg-bg-soft',
            )}
          >
            Φάση 1
          </button>
          <button
            type="button"
            onClick={() => setStep(N_INS + 2)}
            className={cn(
              'rounded px-2 py-1 text-[11px] font-semibold',
              phase === 'query' ? 'bg-success/15 text-success' : 'text-fg-muted hover:bg-bg-soft',
            )}
          >
            Φάση 2
          </button>
          <button
            type="button"
            onClick={() => setStep(TOTAL - 1)}
            className={cn(
              'rounded px-2 py-1 text-[11px] font-semibold',
              phase === 'done' ? 'bg-success/15 text-success' : 'text-fg-muted hover:bg-bg-soft',
            )}
          >
            Τέλος
          </button>
        </div>
      </div>
    </section>
  )
}
