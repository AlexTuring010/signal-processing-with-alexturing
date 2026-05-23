'use client'

/**
 * AlternatingPeaksValleys — the «κορυφές και κοιλάδες» scan in O(n).
 *
 * The maximum-length alternating subsequence of front-set-6-ask3 is exactly
 * the sequence of direction changes — every monotone run contributes ONE
 * endpoint to the answer. This viz makes that operational on a bar chart:
 * left → right, each step compares A[i] with A[i-1] to detect the direction;
 * peaks light red and valleys blue when the trend flips; everything in
 * between fades out. After the sweep the picked indices are exactly the
 * O(n) alternating subsequence. Built for L11.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Preset = 'tutorial' | 'monotone-trap' | 'zigzag'

const PRESETS: Record<Preset, { label: string; data: number[]; intro: string }> = {
  tutorial: {
    label: 'Διδακτικό',
    data: [4, 10, 12, 9, 3, 1, 0, 6, 5, 4, 3, 8, 10, 15],
    intro:
      'Το παράδειγμα της εκφώνησης: A = [4,10,12,9,3,1,0,6,5,4,3,8,10,15]. Σάρωνε αριστερά→δεξιά: κάθε αλλαγή φοράς δίνει ένα στοιχείο της υπακολουθίας.',
  },
  'monotone-trap': {
    label: 'Μονότονο τμήμα',
    data: [2, 4, 6, 8, 10, 7, 9, 5, 11, 13],
    intro:
      'Το αριστερό τμήμα (2,4,6,8,10) είναι αύξον — δεν δίνει εναλλαγή ώσπου να αλλάξει η φορά. Παρατήρησε ότι όσο μεγάλο κι αν είναι το μονότονο, μόνο το άκρο του μπαίνει.',
  },
  zigzag: {
    label: 'Καθαρό zigzag',
    data: [5, 1, 6, 2, 7, 3, 8, 1, 9],
    intro:
      'Καθαρή εναλλαγή. Σχεδόν κάθε στοιχείο είναι σημείο καμπής — η υπακολουθία είναι σχεδόν ολόκληρος ο πίνακας.',
  },
}

type Direction = 'up' | 'down' | 'flat' | 'start'

type StepInfo = {
  /** index just examined */
  i: number
  /** direction at this index (relative to i-1) */
  dir: Direction
  /** indices kept in the alternating subsequence after this step */
  kept: number[]
  /** plain-Greek note for this step */
  note: string
}

function classify(prev: number, cur: number): Direction {
  if (cur > prev) return 'up'
  if (cur < prev) return 'down'
  return 'flat'
}

function runScan(A: number[]): StepInfo[] {
  const out: StepInfo[] = []
  if (A.length === 0) return out
  // Step 0 — we treat A[0] as a tentative endpoint; we'll commit it only when
  // we see a direction change. We render it as "start" so the bar lights up.
  out.push({ i: 0, dir: 'start', kept: [], note: 'Ξεκινάμε από τη θέση 0 — δεν ξέρουμε ακόμα τη φορά.' })
  let curDir: Direction = 'flat'
  const kept = [0]
  for (let i = 1; i < A.length; i++) {
    const d = classify(A[i - 1], A[i])
    let didFlip = false
    if (d === 'flat') {
      // tie — keep direction
    } else if (curDir === 'flat') {
      curDir = d
    } else if (d !== curDir) {
      // direction flipped at i-1 — that index is a peak/valley
      const pivot = i - 1
      if (kept[kept.length - 1] !== pivot) kept.push(pivot)
      curDir = d
      didFlip = true
    }
    const isLast = i === A.length - 1
    if (isLast) {
      // last element always joins
      kept.push(i)
    }
    let note = ''
    if (d === 'flat') {
      note = `Θέση ${i}: A[${i}]=${A[i]} = A[${i - 1}] — ίδια τιμή, η φορά μένει.`
    } else if (didFlip) {
      const pivot = i - 1
      const dirLabel = d === 'up' ? 'αύξουσα' : 'φθίνουσα'
      const peakLabel = curDir === 'up' ? 'κοιλάδα' : 'κορυφή'
      note = `Θέση ${i}: η φορά αλλάζει σε ${dirLabel}. Η προηγούμενη θέση ${pivot} (τιμή ${A[pivot]}) είναι ${peakLabel} — μπαίνει στην υπακολουθία.`
    } else {
      const dirLabel = d === 'up' ? 'ανεβαίνει' : 'κατεβαίνει'
      note = `Θέση ${i}: A[${i}]=${A[i]} — η ακολουθία ${dirLabel} ακόμη, δεν μπαίνει νέο σημείο.`
    }
    if (isLast) {
      const last = A.length - 1
      const lastPicked = kept[kept.length - 1] === last
      if (lastPicked) {
        note += ` Φτάσαμε στο τέλος — η θέση ${last} (τιμή ${A[last]}) είναι ο τελευταίος κρίκος της υπακολουθίας.`
      }
    }
    out.push({ i, dir: d, kept: [...kept], note })
  }
  return out
}

const VIEW_W = 640

export function AlternatingPeaksValleys() {
  const [preset, setPreset] = useState<Preset>('tutorial')
  const [step, setStep] = useState(0)

  const conf = PRESETS[preset]
  const A = conf.data
  const steps = useMemo(() => runScan(A), [A])
  const last = steps.length - 1
  const done = step === last
  const cur = steps[step]

  function pick(p: Preset) {
    setPreset(p)
    setStep(0)
  }

  // build the alternating subsequence string
  const altText = cur.kept.map((i) => A[i]).join(', ')
  const altCheck = (() => {
    if (cur.kept.length < 3) return null
    const vals = cur.kept.map((i) => A[i])
    const signs: string[] = []
    for (let k = 1; k < vals.length; k++) {
      signs.push(vals[k] > vals[k - 1] ? '<' : vals[k] < vals[k - 1] ? '>' : '=')
    }
    return vals
      .map((v, k) => (k === 0 ? `${v}` : `${signs[k - 1]} ${v}`))
      .join(' ')
  })()

  const N = A.length
  const PAD_L = 28
  const PAD_R = 16
  const TOP = 20
  const PLOT_H = 140
  const PLOT_W = VIEW_W - PAD_L - PAD_R
  const BAR_W = PLOT_W / N
  const maxA = Math.max(...A)
  const Y = (v: number) => TOP + PLOT_H - (v / maxA) * PLOT_H
  const VIEW_H = TOP + PLOT_H + 38

  const keptSet = new Set(cur.kept)

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Εναλλασσόμενη υπακολουθία — σάρωση «κορυφές & κοιλάδες»
        </div>
        <div className="flex flex-wrap gap-1 rounded-md border border-border p-0.5">
          {(Object.keys(PRESETS) as Preset[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => pick(p)}
              className={cn(
                'rounded px-2 py-0.5 text-xs font-medium transition-colors',
                preset === p
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {PRESETS[p].label}
            </button>
          ))}
        </div>
      </div>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* dashed ridge connecting picked indices */}
          {cur.kept.length > 1 && (
            <polyline
              points={cur.kept
                .map((i) => `${PAD_L + i * BAR_W + BAR_W / 2},${Y(A[i]) - 6}`)
                .join(' ')}
              fill="none"
              stroke="#9f1239"
              strokeWidth={2}
              strokeDasharray="4 4"
              strokeLinejoin="round"
            />
          )}

          {A.map((v, i) => {
            const x = PAD_L + i * BAR_W
            const examined = i <= cur.i
            const picked = keptSet.has(i)
            const isCur = i === cur.i
            let fill = '#e5e7eb'
            let stroke = '#cbd5e1'
            if (picked) {
              // alternate red (peak) / blue (valley): a peak is preceded by an up direction
              const ki = cur.kept.indexOf(i)
              // by construction, kept[0] is index 0 — neutral; subsequent alternate based on signs
              const isPeak = ki > 0 && A[i] > A[cur.kept[ki - 1]]
              fill = ki === 0 ? '#fbbf24' : isPeak ? '#ef4444' : '#3b82f6'
              stroke = ki === 0 ? '#b45309' : isPeak ? '#991b1b' : '#1e40af'
            } else if (examined) {
              fill = '#f3f4f6'
              stroke = '#cbd5e1'
            }
            return (
              <g key={i}>
                <rect
                  x={x + 2}
                  y={Y(v)}
                  width={Math.max(BAR_W - 4, 4)}
                  height={TOP + PLOT_H - Y(v)}
                  rx={2}
                  fill={fill}
                  stroke={isCur ? '#d97706' : stroke}
                  strokeWidth={isCur ? 3 : 1.5}
                />
                <text
                  x={x + BAR_W / 2}
                  y={Y(v) - 4}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={700}
                  fill={isCur ? '#d97706' : '#1c1214'}
                >
                  {v}
                </text>
                <text
                  x={x + BAR_W / 2}
                  y={TOP + PLOT_H + 14}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#9b8a8d"
                >
                  {i}
                </text>
              </g>
            )
          })}

          {/* legend */}
          <g transform={`translate(${PAD_L}, ${VIEW_H - 12})`} fontSize={10}>
            <rect width={10} height={10} fill="#fbbf24" />
            <text x={14} y={9} fill="#9b8a8d">
              άκρο
            </text>
            <rect x={56} width={10} height={10} fill="#ef4444" />
            <text x={70} y={9} fill="#9b8a8d">
              κορυφή
            </text>
            <rect x={124} width={10} height={10} fill="#3b82f6" />
            <text x={138} y={9} fill="#9b8a8d">
              κοιλάδα
            </text>
          </g>
        </svg>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-fg-muted">{cur.note}</p>

      <div className="mt-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-2 text-xs">
        <span className="text-fg-subtle">Υπακολουθία μέχρι τώρα: </span>
        <span className="font-mono font-semibold text-fg">[{altText}]</span>
        {altCheck && cur.kept.length >= 3 && (
          <>
            <span className="ml-2 text-fg-subtle">· έλεγχος εναλλαγής: </span>
            <span className="font-mono font-semibold text-emerald-700">{altCheck} ✓</span>
          </>
        )}
        <span className="ml-2 text-fg-subtle">· μήκος: </span>
        <span className="font-mono font-semibold">{cur.kept.length}</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5">
        <button
          type="button"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-xs font-medium text-fg hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronLeft size={14} /> Προηγ.
        </button>
        <button
          type="button"
          onClick={() => setStep(Math.min(last, step + 1))}
          disabled={done}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-xs font-medium text-fg hover:bg-bg-soft disabled:opacity-40"
        >
          Επόμ. <ChevronRight size={14} />
        </button>
        <button
          type="button"
          onClick={() => setStep(0)}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2 py-1 text-xs font-medium text-fg-muted hover:bg-bg-soft"
        >
          <RotateCcw size={14} /> Reset
        </button>
        <span className="ml-auto text-xs text-fg-subtle">
          Θέση {cur.i} / {N - 1}
        </span>
      </div>
    </section>
  )
}
