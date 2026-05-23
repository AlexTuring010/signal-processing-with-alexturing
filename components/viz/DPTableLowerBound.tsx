'use client'

/**
 * DPTableLowerBound — visceral feel for «ένας n×m πίνακας θέλει ≥ n·m δουλειά».
 *
 * The four exam questions in L14 (pt1-th1-q7/q8, pt2-th1-q6/q7) all hinge on
 * the same insight: a DP that fills an n-dim or n×m table MUST do at least n
 * (resp. n·m) work, because it touches every cell. Anything asymptotically
 * smaller is impossible.
 *
 * The viz brings that to life: the student slides n (and m, in the 2D mode),
 * watches cells light up row-by-row with a counter ticking «κελιά γεμισμένα /
 * συνολικά», and sees four candidate complexities labelled ✓ ΠΙΘΑΝΟ / ✗
 * ΑΔΥΝΑΤΟ — with a one-line «γιατί» under each. The verdicts are baked into
 * the preset (they're really questions about Big-O classes, not concrete
 * numbers), but the cell counter and the «τουλάχιστον» chip evaluate live so
 * the comparison is concrete.
 *
 * Four presets, one per problem, declared inline so each problem solution can
 * embed the right one with no setup. Built for the L14 problem set.
 */

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

type Candidate = {
  label: string
  /** TRUE when the class could contain a function that is ≥ Ω(n·m) (1D: ≥ Ω(n)). */
  feasible: boolean
  reason: string
}

type Preset = {
  dim: 1 | 2
  /** label shown in the verdict-chip header for the «κατώφλι» */
  threshold: string
  candidates: Candidate[]
  intro: string
}

const PRESETS: Record<string, Preset> = {
  /* pt1-th1-q7 — 2D, options (i) O(n), (ii) O(mn), (iii) o(m²n²), (iv) O(mn²) */
  'pt1-th1-q7': {
    dim: 2,
    threshold: 'Ω(n·m)',
    intro:
      'Ο πίνακας έχει n·m κελιά — όλα πρέπει να γεμίσουν. Άρα η πολυπλοκότητα είναι σίγουρα Ω(n·m). Ποια από τα τέσσερα ΔΕΝ συμβιβάζονται με αυτό το κατώφλι;',
    candidates: [
      {
        label: 'O(n)',
        feasible: false,
        reason: 'Μικρότερο από n·m όταν m > 1 — δεν προλαβαίνεις καν να αγγίξεις όλα τα κελιά.',
      },
      {
        label: 'O(m·n)',
        feasible: true,
        reason: 'Ταιριάζει ακριβώς με το κατώφλι — π.χ. αν κάθε κελί γεμίζει σε O(1).',
      },
      {
        label: 'o(m²·n²)',
        feasible: true,
        reason: 'Π.χ. το O(m·n) είναι o(m²·n²) — η κλάση χωράει συμπεριφορές ≥ Ω(n·m).',
      },
      {
        label: 'O(m·n²)',
        feasible: true,
        reason: 'Μεγαλύτερο από n·m — εύλογο αν κάθε κελί θέλει O(n) δουλειά.',
      },
    ],
  },

  /* pt1-th1-q8 — 1D, options O(n), O(n²), O(1), O(log₂n) */
  'pt1-th1-q8': {
    dim: 1,
    threshold: 'Ω(n)',
    intro:
      'Ο πίνακας έχει n κελιά — όλα πρέπει να γεμίσουν. Άρα η πολυπλοκότητα είναι σίγουρα Ω(n). Ποια από τα τέσσερα μικραίνουν το χρόνο κάτω από αυτό το κατώφλι;',
    candidates: [
      {
        label: 'O(n)',
        feasible: true,
        reason: 'Ακριβώς στο κατώφλι — εύλογο αν κάθε κελί γεμίζει σε O(1).',
      },
      {
        label: 'O(n²)',
        feasible: true,
        reason: 'Πάνω από το κατώφλι — εύλογο αν κάθε κελί θέλει O(n) δουλειά.',
      },
      {
        label: 'O(1)',
        feasible: false,
        reason: 'Σταθερός χρόνος — αδύνατο, δεν αγγίζεις καν τα n κελιά.',
      },
      {
        label: 'O(log₂ n)',
        feasible: false,
        reason: 'Μικρότερο από n — το log n μεγαλώνει πολύ πιο αργά από το n.',
      },
    ],
  },

  /* pt2-th1-q6 — 2D, options O(n³), O(m), O(n), O(m²n²) */
  'pt2-th1-q6': {
    dim: 2,
    threshold: 'Ω(n·m)',
    intro:
      'Ο πίνακας έχει n·m κελιά — όλα πρέπει να γεμίσουν. Άρα η πολυπλοκότητα είναι σίγουρα Ω(n·m). Ποια από τα τέσσερα ΔΕΝ συμβιβάζονται με αυτό το κατώφλι;',
    candidates: [
      {
        label: 'O(n³)',
        feasible: true,
        reason: 'Μεγαλύτερο ή ίσο από n·m όταν n ≥ m — εύλογο αν κάθε κελί θέλει O(n²) δουλειά.',
      },
      {
        label: 'O(m)',
        feasible: false,
        reason: 'Μικρότερο από n·m όταν n > 1 — δεν προλαβαίνεις να γεμίσεις τα n·m κελιά.',
      },
      {
        label: 'O(n)',
        feasible: false,
        reason: 'Μικρότερο από n·m όταν m > 1 — δεν προλαβαίνεις τα n·m κελιά.',
      },
      {
        label: 'O(m²·n²)',
        feasible: true,
        reason: 'Πολύ πάνω από το κατώφλι — εύλογο αν κάθε κελί θέλει O(mn) δουλειά.',
      },
    ],
  },

  /* pt2-th1-q7 — 1D, identical to pt1-th1-q8 */
  'pt2-th1-q7': {
    dim: 1,
    threshold: 'Ω(n)',
    intro:
      'Ο πίνακας έχει n κελιά — όλα πρέπει να γεμίσουν. Άρα η πολυπλοκότητα είναι σίγουρα Ω(n). Ποια από τα τέσσερα μικραίνουν τον χρόνο κάτω από αυτό το κατώφλι;',
    candidates: [
      {
        label: 'O(n)',
        feasible: true,
        reason: 'Ακριβώς στο κατώφλι — εύλογο αν κάθε κελί γεμίζει σε O(1).',
      },
      {
        label: 'O(n²)',
        feasible: true,
        reason: 'Πάνω από το κατώφλι — εύλογο αν κάθε κελί θέλει O(n) δουλειά.',
      },
      {
        label: 'O(1)',
        feasible: false,
        reason: 'Σταθερός χρόνος — αδύνατο, δεν αγγίζεις καν τα n κελιά.',
      },
      {
        label: 'O(log₂ n)',
        feasible: false,
        reason: 'Μικρότερο από n — το log n μεγαλώνει πολύ πιο αργά από το n.',
      },
    ],
  },
}

const FALLBACK_PRESET = PRESETS['pt1-th1-q7']

const N_MIN = 4
const N_MAX = 12

interface Props {
  preset?: keyof typeof PRESETS
}

export function DPTableLowerBound({ preset }: Props) {
  const lookup = preset ? PRESETS[preset] : null
  const cfg = lookup ?? FALLBACK_PRESET
  const [n, setN] = useState(8)
  const [m, setM] = useState(cfg.dim === 2 ? 6 : 1)
  const [filled, setFilled] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<number | null>(null)

  const total = cfg.dim === 2 ? n * m : n

  useEffect(() => {
    if (filled > total) setFilled(total)
  }, [total, filled])

  useEffect(() => {
    if (!playing) {
      if (timerRef.current != null) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }
    timerRef.current = window.setInterval(() => {
      setFilled((f) => {
        if (f >= total) {
          setPlaying(false)
          return total
        }
        return f + 1
      })
    }, 70)
    return () => {
      if (timerRef.current != null) window.clearInterval(timerRef.current)
    }
  }, [playing, total])

  function resetFill() {
    setPlaying(false)
    setFilled(0)
  }

  function playPause() {
    if (filled >= total) setFilled(0)
    setPlaying((p) => !p)
  }

  if (!lookup) {
    return (
      <section className="my-4 rounded-md border border-dashed border-border bg-bg-soft/40 p-3 text-sm text-fg-muted">
        Άγνωστο preset «{String(preset)}» — έλεγξε τη χρήση του DPTableLowerBound.
      </section>
    )
  }

  // Cell coordinates for the grid (n rows × m cols, 1D = single row).
  const CELL = 22
  const GAP = 2
  const gridCols = cfg.dim === 2 ? m : n
  const gridRows = cfg.dim === 2 ? n : 1
  const gridW = gridCols * (CELL + GAP) - GAP
  const gridH = gridRows * (CELL + GAP) - GAP

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          {cfg.dim === 2
            ? 'Πίνακας DP n × m — γιατί χρειάζεται τουλάχιστον n·m δουλειά'
            : 'Πίνακας DP μήκους n — γιατί χρειάζεται τουλάχιστον n δουλειά'}
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          κατώφλι: {cfg.threshold}
        </span>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">{cfg.intro}</p>

      {/* sliders */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex items-center gap-2">
          <span className="shrink-0 font-mono text-sm font-bold text-fg">
            n = <span className="text-accent">{n}</span>
          </span>
          <input
            type="range"
            min={N_MIN}
            max={N_MAX}
            value={n}
            aria-label="Τιμή του n"
            onChange={(e) => {
              setN(Number(e.target.value))
              resetFill()
            }}
            className="h-1.5 w-32 cursor-pointer accent-accent"
          />
        </div>
        {cfg.dim === 2 && (
          <div className="flex items-center gap-2">
            <span className="shrink-0 font-mono text-sm font-bold text-fg">
              m = <span className="text-accent">{m}</span>
            </span>
            <input
              type="range"
              min={N_MIN}
              max={N_MAX}
              value={m}
              aria-label="Τιμή του m"
              onChange={(e) => {
                setM(Number(e.target.value))
                resetFill()
              }}
              className="h-1.5 w-32 cursor-pointer accent-accent"
            />
          </div>
        )}
        <span className="ml-auto rounded-md border border-border bg-bg-soft/40 px-2 py-0.5 font-mono text-xs text-fg">
          σύνολο κελιών = {cfg.dim === 2 ? `${n} × ${m} = ${total}` : `${n}`}
        </span>
      </div>

      {/* grid */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${gridW + 24} ${gridH + 24}`}
          className="mx-auto block w-full"
          style={{ maxWidth: `${Math.max(gridW + 24, 280)}px` }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {Array.from({ length: gridRows }, (_, r) =>
            Array.from({ length: gridCols }, (_, c) => {
              const cellIdx = r * gridCols + c
              const done = cellIdx < filled
              const x = 12 + c * (CELL + GAP)
              const y = 12 + r * (CELL + GAP)
              return (
                <rect
                  key={`${r}-${c}`}
                  x={x}
                  y={y}
                  width={CELL}
                  height={CELL}
                  rx={3}
                  fill={done ? '#bae6fd' : '#f3eee9'}
                  stroke={done ? '#0284c7' : '#cdbfc0'}
                  strokeWidth={1.4}
                />
              )
            }),
          )}
        </svg>
      </div>

      {/* fill counter + controls */}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-border bg-bg-soft/40 px-2 py-1 font-mono text-xs text-fg">
          γεμισμένα: <span className="font-bold text-accent">{filled}</span> / {total}
        </span>
        <button
          type="button"
          onClick={playPause}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
        >
          {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          {playing ? 'Παύση' : filled >= total ? 'Ξανά' : 'Παίξε'}
        </button>
        <button
          type="button"
          onClick={resetFill}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Επαναφορά
        </button>
      </div>

      {/* candidate verdicts */}
      <div className="mt-4">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Οι τέσσερις υποψήφιες πολυπλοκότητες
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {cfg.candidates.map((c) => (
            <div
              key={c.label}
              className={cn(
                'rounded-lg border px-3 py-2 text-sm',
                c.feasible
                  ? 'border-success/40 bg-success/10'
                  : 'border-danger/40 bg-danger/10',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-base font-bold text-fg">{c.label}</span>
                <span
                  className={cn(
                    'rounded px-1.5 py-0.5 text-xs font-bold uppercase tracking-wider',
                    c.feasible ? 'bg-success text-white' : 'bg-danger text-white',
                  )}
                >
                  {c.feasible ? '✓ Πιθανό' : '✗ Αδύνατο'}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-fg-muted">{c.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
