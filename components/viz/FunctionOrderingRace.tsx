'use client'

/**
 * FunctionOrderingRace — «βάλε αυτές τις 5 συναρτήσεις στη σωστή σειρά».
 *
 * The L02 ordering exercises ask the student to rank 5 functions (often
 * dressed up — `(log n)^n`, `4002^{2^n}`, `n^{log n}`, etc.) from
 * slowest- to fastest-growing. From paper they look intimidating; the
 * fix is to actually SEE them race.
 *
 * Mechanics:
 *   - Pick a preset group → see five bars, each labelled with the
 *     function and its simplified Θ-class.
 *   - Slide n from a small value upward. The bars use a log-scaled
 *     height so that exponential towers can sit next to constants.
 *   - The bars sort live (lowest on the left), so the student literally
 *     watches the final ordering crystallise.
 *   - A footer lists the canonical ordering with the same colour codes
 *     — functions in the same Θ-class share a swatch.
 *
 * Built for L02 Phase D.
 */

import { useEffect, useMemo, useState } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

type Fn = {
  /** Short id used in the canonical order. */
  id: string
  /** Pretty label rendered on the bar. */
  label: string
  /** What this evaluates to in Θ-terms (one-line). */
  thetaForm: string
  /** Actual computation — log-scale-safe (return log₁₀ of the value). */
  logValue: (n: number) => number
  /** Colour swatch — functions in same Θ-class share it. */
  color: string
}

type Preset = {
  id: string
  title: string
  hint?: string
  nMin: number
  nMax: number
  nInit: number
  nStep: number
  /** The five functions to race. */
  fns: Fn[]
  /** The canonical order, slowest → fastest (ids). */
  order: string[]
  /** One-line summary the student walks away with. */
  takeaway: string
}

const COLORS = {
  blue: 'bg-sky-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-500',
} as const

export const ORDERING_PRESETS: Record<string, Preset> = {
  /* front-set-1-ask1 — Ομάδα Α */
  'fs1-ask1-A': {
    id: 'fs1-ask1-A',
    title: 'Φροντιστηριακό Σετ #1 · Άσκηση 1 — Ομάδα Α',
    hint: 'Όλες απλοποιούνται σε γνωστές τάξεις λογαρίθμων.',
    nMin: 4,
    nMax: 1e6,
    nInit: 64,
    nStep: 1,
    fns: [
      {
        id: 'a1',
        label: 'log(log(500n))',
        thetaForm: 'Θ(log log n)',
        logValue: (n) => Math.log10(Math.max(0.5, Math.log2(Math.log2(500 * n)))),
        color: 'amber',
      },
      {
        id: 'a2',
        label: '0.5·log(n^{10}) − 5 log n',
        thetaForm: 'Θ(1) — αλληλοαναιρούνται',
        logValue: () => 0, // = log10(1)
        color: 'slate',
      },
      {
        id: 'a3',
        label: '(log n)^n',
        thetaForm: 'Θ((log n)^n) — υπερ-εκθετική',
        logValue: (n) => n * Math.log10(Math.max(2, Math.log2(n))),
        color: 'rose',
      },
      {
        id: 'a4',
        label: 'log(n^n) + 10 n^{0.5}',
        thetaForm: 'Θ(n log n)',
        logValue: (n) => Math.log10(n * Math.log2(Math.max(2, n)) + 10 * Math.sqrt(n)),
        color: 'emerald',
      },
      {
        id: 'a5',
        label: '500 · log n',
        thetaForm: 'Θ(log n)',
        logValue: (n) => Math.log10(500 * Math.log2(Math.max(2, n))),
        color: 'blue',
      },
    ],
    order: ['a2', 'a1', 'a5', 'a4', 'a3'],
    takeaway: 'Σταθερά < log log n < log n < n log n < (log n)^n.',
  },

  /* front-set-1-ask1 — Ομάδα Β */
  'fs1-ask1-B': {
    id: 'fs1-ask1-B',
    title: 'Φροντιστηριακό Σετ #1 · Άσκηση 1 — Ομάδα Β',
    hint: 'Πολυώνυμο < εκθετικό < n^{Θ(n)} < παραγοντικό.',
    nMin: 4,
    nMax: 100,
    nInit: 20,
    nStep: 1,
    fns: [
      {
        id: 'b1',
        label: 'C(n, n−4) = C(n, 4)',
        thetaForm: 'Θ(n^4) — πολυώνυμο',
        logValue: (n) => Math.log10((n * (n - 1) * (n - 2) * (n - 3)) / 24 + 1),
        color: 'blue',
      },
      {
        id: 'b2',
        label: '(4n)!',
        thetaForm: 'Θ((4n)!) — παραγοντικό',
        logValue: (n) => {
          // log10((4n)!) ≈ (4n+0.5) log10(4n) − 4n/ln 10
          const x = 4 * n
          return (x + 0.5) * Math.log10(Math.max(2, x)) - x / Math.LN10
        },
        color: 'rose',
      },
      {
        id: 'b3',
        label: 'n^{n + n/2}',
        thetaForm: 'Θ(n^{3n/2}) — n^{Θ(n)}',
        logValue: (n) => ((3 * n) / 2) * Math.log10(Math.max(2, n)),
        color: 'violet',
      },
      {
        id: 'b4',
        label: 'C(n, n/4)',
        thetaForm: 'Θ(d^n) — εκθετικό',
        logValue: (n) => {
          // log10 C(n, n/4) ≈ n · H(1/4) / ln 10, H(p)=-p log p-(1-p)log(1-p)
          const p = 0.25
          const H = -(p * Math.log(p) + (1 - p) * Math.log(1 - p))
          return (n * H) / Math.LN10
        },
        color: 'amber',
      },
      {
        id: 'b5',
        label: 'n^{48}',
        thetaForm: 'Θ(n^{48}) — πολυώνυμο μεγάλου βαθμού',
        logValue: (n) => 48 * Math.log10(Math.max(2, n)),
        color: 'emerald',
      },
    ],
    order: ['b1', 'b5', 'b4', 'b3', 'b2'],
    takeaway: 'Όλα τα πολυώνυμα (b1, b5) πέφτουν κάτω από κάθε εκθετικό (b4), που πέφτει κάτω από n^{Θ(n)} (b3), που πέφτει κάτω από παραγοντικό (b2).',
  },

  /* front-set-1-ask1 — Ομάδα Γ */
  'fs1-ask1-C': {
    id: 'fs1-ask1-C',
    title: 'Φροντιστηριακό Σετ #1 · Άσκηση 1 — Ομάδα Γ',
    hint: 'Όλες «εκθετικού τύπου» — συγκρίνεις log c_i.',
    nMin: 4,
    nMax: 30,
    nInit: 10,
    nStep: 1,
    fns: [
      {
        id: 'c1',
        label: '3^{n²}',
        thetaForm: 'log = Θ(n²)',
        logValue: (n) => n * n * Math.log10(3),
        color: 'amber',
      },
      {
        id: 'c2',
        label: '13 n²',
        thetaForm: 'log = Θ(log n) (πολυώνυμο)',
        logValue: (n) => Math.log10(13 * n * n),
        color: 'blue',
      },
      {
        id: 'c3',
        label: 'n^{13 + 1/n}',
        thetaForm: 'log = Θ(log n) (πολυώνυμο)',
        logValue: (n) => (13 + 1 / n) * Math.log10(Math.max(2, n)),
        color: 'emerald',
      },
      {
        id: 'c4',
        label: 'n^{n^n} + n!',
        thetaForm: 'log = Θ(n^n log n) — γιγαντιαίο',
        logValue: (n) => Math.pow(n, n) * Math.log10(Math.max(2, n)),
        color: 'rose',
      },
      {
        id: 'c5',
        label: '8^{3 n log n}',
        thetaForm: 'log = Θ(n log n)',
        logValue: (n) => 3 * n * Math.log2(Math.max(2, n)) * Math.log10(8),
        color: 'violet',
      },
    ],
    order: ['c2', 'c3', 'c5', 'c1', 'c4'],
    takeaway: 'Τα c2 και c3 πέφτουν στην ίδια κλάση Θ(log n) μέσω του log — μόνο τότε συγκρίνεις απευθείας.',
  },

  /* front-set-2-ask0 — Ομάδα b */
  'fs2-ask0-b': {
    id: 'fs2-ask0-b',
    title: 'Φροντιστηριακό Σετ #2 · Άσκηση 0 — Ομάδα b',
    hint: 'Σταθερά < n < n² < 2^n < πύργοι εκθετικού.',
    nMin: 2,
    nMax: 30,
    nInit: 8,
    nStep: 1,
    fns: [
      {
        id: 'b1',
        label: '2^n',
        thetaForm: 'log = n',
        logValue: (n) => n * Math.log10(2),
        color: 'amber',
      },
      {
        id: 'b2',
        label: '4002^{2^n}',
        thetaForm: 'log = 2^n · log 4002',
        logValue: (n) => Math.pow(2, Math.min(n, 50)) * Math.log10(4002),
        color: 'violet',
      },
      {
        id: 'b3',
        label: '2^{4002^n}',
        thetaForm: 'log = 4002^n',
        logValue: (n) => Math.pow(4002, Math.min(n, 8)) * Math.log10(2),
        color: 'rose',
      },
      {
        id: 'b4',
        label: '4002^{4002}',
        thetaForm: 'Θ(1) — σταθερά!',
        logValue: () => 4002 * Math.log10(4002),
        color: 'slate',
      },
      {
        id: 'b5',
        label: '4002^{n²}',
        thetaForm: 'log = n² · log 4002',
        logValue: (n) => n * n * Math.log10(4002),
        color: 'emerald',
      },
    ],
    // Πάντα: b4 (σταθερά) < b1 (n) < b5 (n²) < b2 (2^n) < b3 (4002^n)
    // ΑΛΛΑ: για μικρά n, b4 = 4002^4002 ≈ 10^14454 είναι ΤΕΡΑΣΤΙΟ
    // — η σύγκριση «σταθερά» γίνεται μόνο ΑΣΥΜΠΤΩΤΙΚΑ.
    order: ['b4', 'b1', 'b5', 'b2', 'b3'],
    takeaway: 'Το b4 είναι σταθερά — πέφτει τελευταίο σε ΟΛΕΣ τις «παραμετρικές» σε n, αλλά μόνο όταν το n φτάσει τη σταθερά. Παγίδα: στο γράφημα φαίνεται τεράστιο γιατί η σταθερά είναι 4002^{4002}.',
  },

  /* front-set-2-ask0 — Ομάδα f */
  'fs2-ask0-f': {
    id: 'fs2-ask0-f',
    title: 'Φροντιστηριακό Σετ #2 · Άσκηση 0 — Ομάδα f',
    hint: 'Δουλεύεις με logarithms — βρίσκεις log f_i και συγκρίνεις.',
    nMin: 2,
    nMax: 30,
    nInit: 10,
    nStep: 1,
    fns: [
      {
        id: 'f1',
        label: 'n^{n+4} + n!',
        thetaForm: 'log = Θ(n log n)',
        logValue: (n) => (n + 4) * Math.log10(Math.max(2, n)),
        color: 'amber',
      },
      {
        id: 'f2',
        label: 'n^{7√n}',
        thetaForm: 'log = Θ(√n log n)',
        logValue: (n) => 7 * Math.sqrt(n) * Math.log10(Math.max(2, n)),
        color: 'emerald',
      },
      {
        id: 'f3',
        label: '4^{3 n log n} = n^{6n}',
        thetaForm: 'log = Θ(n log n) — μεγαλύτερος συντελεστής',
        logValue: (n) => 6 * n * Math.log10(Math.max(2, n)),
        color: 'violet',
      },
      {
        id: 'f4',
        label: '7^{n²}',
        thetaForm: 'log = Θ(n²)',
        logValue: (n) => n * n * Math.log10(7),
        color: 'rose',
      },
      {
        id: 'f5',
        label: 'n^{12 + 1/n}',
        thetaForm: 'log = Θ(log n) (πολυώνυμο)',
        logValue: (n) => (12 + 1 / n) * Math.log10(Math.max(2, n)),
        color: 'blue',
      },
    ],
    order: ['f5', 'f2', 'f1', 'f3', 'f4'],
    takeaway: 'f1 και f3 ΦΑΙΝΟΝΤΑΙ ίδια κλάση (Θ(n log n)) — η ακριβής σύγκριση γίνεται με τους συντελεστές: 6n > n+4 → f3 > f1.',
  },
}

type Props = {
  preset: string
}

const ORDERING_FALLBACK = Object.values(ORDERING_PRESETS)[0]

export function FunctionOrderingRace({ preset: presetId }: Props) {
  const lookup = ORDERING_PRESETS[presetId]
  const preset = lookup ?? ORDERING_FALLBACK

  const [n, setN] = useState(preset.nInit)
  const [playing, setPlaying] = useState(false)

  // Play loop: ramp n from nMin to nMax linearly (in log-space for big ranges).
  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      setN((prev) => {
        const logSpan = Math.log(preset.nMax) - Math.log(preset.nMin)
        const stepFactor = Math.exp(dt * logSpan * 0.25)
        const next = Math.min(preset.nMax, prev * stepFactor)
        if (next >= preset.nMax) {
          setPlaying(false)
          return preset.nMax
        }
        return next
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [playing, preset.nMax, preset.nMin])

  // Compute current sizes and sort.
  const ranked = useMemo(() => {
    const rows = preset.fns.map((fn) => ({
      ...fn,
      lv: fn.logValue(n),
    }))
    rows.sort((a, b) => a.lv - b.lv)
    return rows
  }, [preset.fns, n])

  const lvMax = Math.max(...ranked.map((r) => r.lv), 1)
  const lvMin = Math.min(...ranked.map((r) => r.lv), 0)
  const range = Math.max(1, lvMax - lvMin)

  if (!lookup) {
    return (
      <div className="my-4 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-900">
        FunctionOrderingRace: άγνωστο preset «{presetId}».
      </div>
    )
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">{preset.title}</div>
        <span className="font-mono text-[11px] text-fg-subtle">οι μπάρες δείχνουν log₁₀ της τιμής</span>
      </div>

      {preset.hint && (
        <p className="mb-3 text-[12.5px] italic text-fg-muted">{preset.hint}</p>
      )}

      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-soft px-2.5 py-1 text-xs font-medium hover:bg-bg-elevated"
        >
          {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          {playing ? 'Παύση' : 'Παίξε'}
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false)
            setN(preset.nInit)
          }}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-soft px-2.5 py-1 text-xs font-medium hover:bg-bg-elevated"
        >
          <RotateCcw className="h-3 w-3" />
          Επανεκκίνηση
        </button>
        <label className="ml-auto flex items-center gap-2 text-xs">
          <span className="font-mono text-fg-muted">n</span>
          <input
            type="range"
            min={preset.nMin}
            max={preset.nMax}
            step={preset.nStep}
            value={n}
            onChange={(e) => {
              setPlaying(false)
              setN(Number(e.target.value))
            }}
            className="h-1.5 w-40 cursor-pointer accent-accent"
          />
          <span className="w-16 text-right font-mono">{Math.round(n)}</span>
        </label>
      </div>

      {/* Bars */}
      <div className="space-y-1.5">
        {ranked.map((r, i) => {
          const widthPct = ((r.lv - lvMin) / range) * 100
          return (
            <div key={r.id} className="flex items-center gap-2">
              <div className="w-5 text-right font-mono text-[11px] text-fg-subtle">#{i + 1}</div>
              <div className="relative h-7 flex-1 rounded border border-border bg-bg-soft">
                <div
                  className={cn('absolute inset-y-0 left-0 rounded transition-all duration-200 ease-out', COLORS[r.color as keyof typeof COLORS])}
                  style={{ width: `${Math.max(2, widthPct)}%` }}
                />
                <div className="relative flex h-full items-center justify-between px-2 text-[12px]">
                  <span className="font-mono font-semibold text-fg">{r.label}</span>
                  <span className="font-mono text-[11px] text-fg-muted">{r.thetaForm}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Canonical order */}
      <div className="mt-3 rounded-md border border-emerald-300/50 bg-emerald-50 px-3 py-2 text-[12.5px] leading-relaxed text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-100">
        <span className="font-bold uppercase tracking-wider text-[10px]">Κανονική διάταξη:  </span>
        {preset.order.map((id, i) => (
          <span key={id}>
            <span className="font-mono">{id}</span>
            {i < preset.order.length - 1 && <span className="mx-1 text-fg-subtle">&lt;</span>}
          </span>
        ))}
      </div>

      <div className="mt-2 rounded-md border-l-2 border-l-accent bg-bg-soft/40 px-3 py-2 text-[13px] leading-relaxed text-fg">
        <span className="text-[11px] font-bold uppercase tracking-wider text-accent">Πρότυπο σκέψης  </span>
        {preset.takeaway}
      </div>
    </section>
  )
}
