'use client'

/**
 * WaitTimeShortestFirst — η απόδειξη του «μικρότερος χρόνος πρώτα» γίνεται απτή.
 *
 * Πέντε αιτήματα με χρόνους t = [4, 1, 5, 2, 3]. Ο χρήστης βλέπει:
 *  • μια Gantt-σειρά με τα αιτήματα στην εκάστοτε σειρά εκτέλεσης (πλάτος ∝ t),
 *  • τους χρόνους ολοκλήρωσης κάθε αιτήματος κάτω από κάθε μπλοκ,
 *  • τον συνολικό χρόνο αναμονής (= Σ χρόνοι ολοκλήρωσης) σε μετρητή πάνω δεξιά,
 *  • κουμπιά «SPT», «Φθίνον», «Τυχαία» που γεμίζουν μια προετοιμασμένη σειρά,
 *  • ανάμεσα σε ΚΑΘΕ ζεύγος διαδοχικών αιτημάτων, ένα κουμπί ⇄ που τα αντιμεταθέτει.
 *
 * Η μεγάλη στιγμή: σε κάθε ⇄ ζεύγους «εκτός σειράς» (t_left > t_right) η συνολική
 * αναμονή πέφτει κατά ΑΚΡΙΒΩΣ (t_left − t_right) — ο μετρητής αλλάζει χρώμα και
 * δείχνει τη διαφορά. Αν στο ζεύγος ισχύει ήδη t_left ≤ t_right, η ανταλλαγή
 * αυξάνει το άθροισμα. Έτσι η απόδειξη της λύσης γίνεται κίνηση που κάνεις,
 * όχι παράγραφος που διαβάζεις. Built for L12 — Phase D, pt2-th4.
 */

import { useMemo, useState } from 'react'
import { ArrowLeftRight, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

const BASE_TIMES = [4, 1, 5, 2, 3] as const
const JOB_LETTERS = ['A', 'B', 'C', 'D', 'E'] as const

type Job = { id: string; t: number }

const JOBS: Job[] = BASE_TIMES.map((t, i) => ({ id: JOB_LETTERS[i], t }))

type Preset = 'spt' | 'reverse' | 'mixed'

function presetOrder(p: Preset): Job[] {
  if (p === 'spt') return [...JOBS].sort((a, b) => a.t - b.t)
  if (p === 'reverse') return [...JOBS].sort((a, b) => b.t - a.t)
  // The «mixed» starting point is the natural id-order — visibly non-optimal
  return [...JOBS]
}

function totalWait(order: Job[]): number {
  let t = 0
  let sum = 0
  for (const j of order) {
    t += j.t
    sum += t
  }
  return sum
}

function inversions(order: Job[]): number {
  let n = 0
  for (let i = 0; i < order.length; i++) {
    for (let j = i + 1; j < order.length; j++) {
      if (order[i].t > order[j].t) n++
    }
  }
  return n
}

const COLOR: Record<number, string> = {
  1: '#34d399', // emerald
  2: '#60a5fa', // blue
  3: '#a78bfa', // violet
  4: '#fb923c', // orange
  5: '#f87171', // rose
}

const SPT_TOTAL = totalWait([...JOBS].sort((a, b) => a.t - b.t))
const REV_TOTAL = totalWait([...JOBS].sort((a, b) => b.t - a.t))

export function WaitTimeShortestFirst() {
  const [order, setOrder] = useState<Job[]>(() => presetOrder('mixed'))
  const [lastDelta, setLastDelta] = useState<{ k: number; diff: number } | null>(null)

  const total = useMemo(() => totalWait(order), [order])
  const inv = useMemo(() => inversions(order), [order])
  const cumulative = useMemo(() => {
    let t = 0
    return order.map((j) => {
      t += j.t
      return t
    })
  }, [order])
  const totalT = cumulative[cumulative.length - 1] ?? 0
  const isOptimal = inv === 0

  function applyPreset(p: Preset) {
    setOrder(presetOrder(p))
    setLastDelta(null)
  }

  function swapAt(k: number) {
    if (k < 0 || k >= order.length - 1) return
    const next = [...order]
    const left = next[k]
    const right = next[k + 1]
    next[k] = right
    next[k + 1] = left
    setOrder(next)
    // The total change for a single adjacent swap is exactly (right.t − left.t).
    // Worked from the formula totalWait = Σ (n−k+1)·t_(σ(k)) — swapping
    // positions k and k+1 changes the contribution by (right.t − left.t).
    setLastDelta({ k, diff: right.t - left.t })
  }

  // Pixel scale: 1 unit of t == 32px wide; keeps 5 jobs comfortable
  const UNIT = 32
  const totalWidth = totalT * UNIT

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Συνολικός χρόνος αναμονής — «μικρότερος χρόνος πρώτα»
        </div>
        <div className="flex flex-wrap gap-1 rounded-md border border-border p-0.5">
          <button
            type="button"
            onClick={() => applyPreset('spt')}
            className="rounded px-2 py-0.5 text-xs font-medium text-fg-muted hover:bg-bg-soft"
          >
            SPT (αύξον t)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('reverse')}
            className="rounded px-2 py-0.5 text-xs font-medium text-fg-muted hover:bg-bg-soft"
          >
            Φθίνον t
          </button>
          <button
            type="button"
            onClick={() => applyPreset('mixed')}
            className="rounded px-2 py-0.5 text-xs font-medium text-fg-muted hover:bg-bg-soft"
          >
            <RotateCcw size={12} className="-mt-px mr-0.5 inline" /> Αρχικό
          </button>
        </div>
      </div>

      {/* counters */}
      <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
        <Counter
          label="Σειρά"
          value={order.map((j) => j.id).join(' → ')}
          mono
        />
        <Counter
          label="Αντιστροφές (εκτός σειράς)"
          value={String(inv)}
          tone={inv === 0 ? 'ok' : 'warn'}
        />
        <Counter
          label="Συνολική αναμονή"
          value={String(total)}
          tone={isOptimal ? 'ok' : total > SPT_TOTAL ? 'warn' : undefined}
          subline={
            isOptimal
              ? `= βέλτιστο (SPT)`
              : `SPT = ${SPT_TOTAL} · διαφορά +${total - SPT_TOTAL}`
          }
        />
        <Counter
          label="Τελευταία αντιμετάθεση"
          value={
            lastDelta === null
              ? '—'
              : `${lastDelta.diff > 0 ? '+' : ''}${lastDelta.diff}`
          }
          tone={
            lastDelta === null
              ? undefined
              : lastDelta.diff < 0
                ? 'ok'
                : lastDelta.diff > 0
                  ? 'warn'
                  : undefined
          }
          subline={
            lastDelta === null
              ? 'πάτα ⇄ σε ένα ζεύγος'
              : lastDelta.diff < 0
                ? `μειώθηκε κατά ${-lastDelta.diff}`
                : lastDelta.diff > 0
                  ? `αυξήθηκε κατά ${lastDelta.diff}`
                  : 'σταθερό'
          }
        />
      </div>

      {/* Gantt: jobs as colored blocks, swap buttons between them */}
      <div className="overflow-x-auto rounded-lg border border-border bg-bg-soft/40 p-3">
        <div className="flex items-start" style={{ minWidth: totalWidth + 80 }}>
          {order.map((j, i) => {
            const isInversion = i + 1 < order.length && order[i + 1].t < j.t
            return (
              <div key={`${j.id}-${i}`} className="flex items-start">
                <div className="flex flex-col items-center">
                  <div
                    className="flex h-14 items-center justify-center rounded-md text-white shadow-sm"
                    style={{
                      width: j.t * UNIT,
                      backgroundColor: COLOR[j.t] ?? '#94a3b8',
                    }}
                  >
                    <span className="text-xs font-bold tracking-tight">
                      {j.id}
                    </span>
                    <span className="ml-1 text-[10px] opacity-90">
                      t={j.t}
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] font-mono text-fg-subtle">
                    f = {cumulative[i]}
                  </div>
                </div>
                {i < order.length - 1 && (
                  <button
                    type="button"
                    onClick={() => swapAt(i)}
                    title={`Αντιμετάθεση ${j.id} ⇄ ${order[i + 1].id}`}
                    className={cn(
                      'mx-1 flex h-14 w-7 items-center justify-center rounded-md border text-xs font-medium transition-colors',
                      isInversion
                        ? 'border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100'
                        : 'border-border bg-bg text-fg-subtle hover:bg-bg-soft',
                    )}
                  >
                    <ArrowLeftRight size={12} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
        {/* timeline ruler */}
        <div
          className="relative mt-2 h-3"
          style={{ minWidth: totalWidth + 8 }}
        >
          {cumulative.map((c, i) => (
            <span
              key={i}
              className="absolute -translate-x-1/2 text-[10px] font-mono text-fg-subtle"
              style={{ left: c * UNIT }}
            >
              {c}
            </span>
          ))}
          <span className="absolute -translate-x-1/2 text-[10px] font-mono text-fg-subtle" style={{ left: 0 }}>
            0
          </span>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-border bg-bg-soft/30 px-3 py-2.5 text-xs leading-relaxed text-fg-muted">
        <p>
          <strong className="text-fg">Διάβαση:</strong> κάθε αίτημα είναι ένα
          έγχρωμο μπλοκ με πλάτος ίσο με <span className="font-mono">tᵢ</span>.
          Κάτω από κάθε μπλοκ ο χρόνος ολοκλήρωσης{' '}
          <span className="font-mono">fᵢ</span> = σωρός όλων των προηγουμένων.
          Η <strong>συνολική αναμονή</strong> είναι το άθροισμα όλων των{' '}
          <span className="font-mono">fᵢ</span> — άρα τα αιτήματα που μπαίνουν{' '}
          <em>νωρίς</em> ζυγίζουν περισσότερο: επιβαρύνουν και τον δικό τους
          χρόνο και όλα όσα έρχονται μετά.
        </p>
        <p className="mt-2">
          <strong className="text-fg">Πάτησε ⇄:</strong> τα κίτρινα κουμπιά
          σημαδεύουν ζεύγη «εκτός σειράς» (t αριστερά &gt; t δεξιά). Κάθε
          τέτοια ανταλλαγή μειώνει τη συνολική αναμονή κατά{' '}
          <span className="font-mono">t_αρ − t_δε</span>· καμία άλλη μετράται
          δεν αλλάζει. Συνέχισε να ανταλλάσσεις: το πλήθος των αντιστροφών
          πέφτει βήμα-βήμα, και όταν φτάσει στο <strong>0</strong> έχεις τη
          σειρά SPT — που η μέγιστη αναμονή είναι{' '}
          <span className="font-mono">{SPT_TOTAL}</span>, και η χειρότερη{' '}
          <span className="font-mono">{REV_TOTAL}</span>.
        </p>
      </div>
    </section>
  )
}

function Counter({
  label,
  value,
  subline,
  tone,
  mono,
}: {
  label: string
  value: string
  subline?: string
  tone?: 'ok' | 'warn'
  mono?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-lg border px-3 py-2',
        tone === 'ok' && 'border-emerald-300 bg-emerald-50',
        tone === 'warn' && 'border-amber-300 bg-amber-50',
        !tone && 'border-border bg-bg-soft/40',
      )}
    >
      <div className="text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
        {label}
      </div>
      <div
        className={cn(
          'mt-0.5 text-sm font-semibold tracking-tight',
          mono && 'font-mono',
        )}
      >
        {value}
      </div>
      {subline && (
        <div className="mt-0.5 text-[11px] text-fg-subtle">{subline}</div>
      )}
    </div>
  )
}
