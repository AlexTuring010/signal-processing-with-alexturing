'use client'

/**
 * OneDClosestPair — why the 1D problem is easy, and why the same trick
 * breaks in 2D.
 *
 * Tab «1D»: 8 sorted points on a number line. Stepping advances through
 * the n−1 adjacent pairs, the running minimum updates, and the punchline
 * — "any point strictly between p_i and p_{i+1} would be closer to one
 * of them than they are to each other" — is concretely true on the line.
 *
 * Tab «2D»: 7 points in the plane, sorted by x. The same algorithm
 * (scan adjacent-in-x pairs) is walked through; at the end the user
 * reveals the TRUE closest pair (C, E). They are not adjacent in the
 * x-sort because D sandwiches them, so the linear scan never compares
 * them and lands on a worse pair. This is the gap that motivates the
 * whole strip-of-12-neighbours combine.
 *
 * Built for L05.
 */

import { useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = '1d' | '2d'

/** 8 sorted points, min gap = 2 between 13 and 15. */
const ONE_D = [3, 7, 13, 15, 22, 28, 34, 41]

type Pt2D = { id: string; x: number; y: number }
/** 7 points in the plane. Sorted by x. The TRUE closest pair is C-E
 *  (distance ≈ 3.04) but D sits between them in x-sort, so the linear
 *  scan finds B-C (≈ 3.61) instead. */
const TWO_D: Pt2D[] = [
  { id: 'A', x: 1, y: 5 },
  { id: 'B', x: 3, y: 1 },
  { id: 'C', x: 5, y: 4 },
  { id: 'D', x: 6, y: 8 },
  { id: 'E', x: 8, y: 4.5 },
  { id: 'F', x: 10, y: 1 },
  { id: 'G', x: 12, y: 7 },
]
const TRUE_PAIR_2D: [number, number] = [2, 4] // C, E

const fmt = (x: number) => x.toFixed(2)

const map1D = (v: number) => 40 + ((v - 0) / 45) * 400
const map2X = (v: number) => 40 + (v / 13) * 400
const map2Y = (v: number) => 220 - (v / 9) * 180

type Hist1 = { i: number; gap: number }
type Hist2 = { i: number; d: number }

export function OneDClosestPair() {
  const [tab, setTab] = useState<Tab>('1d')
  const [step1, setStep1] = useState(0)
  const [step2, setStep2] = useState(0)
  const [reveal2, setReveal2] = useState(false)

  const last1 = ONE_D.length - 1 // 7 adjacent pairs
  const last2 = TWO_D.length - 1 // 6 adjacent pairs

  const hist1: Hist1[] = []
  for (let s = 1; s <= step1; s++) {
    hist1.push({ i: s - 1, gap: Math.abs(ONE_D[s] - ONE_D[s - 1]) })
  }
  const cur1 = hist1.length ? hist1[hist1.length - 1] : null
  const min1 = hist1.length ? hist1.reduce((m, h) => (h.gap < m.gap ? h : m)) : null

  const hist2: Hist2[] = []
  for (let s = 1; s <= step2; s++) {
    const a = TWO_D[s - 1]
    const b = TWO_D[s]
    hist2.push({ i: s - 1, d: Math.hypot(a.x - b.x, a.y - b.y) })
  }
  const cur2 = hist2.length ? hist2[hist2.length - 1] : null
  const min2 = hist2.length ? hist2.reduce((m, h) => (h.d < m.d ? h : m)) : null
  const finished2 = step2 === last2
  const trueD = Math.hypot(
    TWO_D[TRUE_PAIR_2D[0]].x - TWO_D[TRUE_PAIR_2D[1]].x,
    TWO_D[TRUE_PAIR_2D[0]].y - TWO_D[TRUE_PAIR_2D[1]].y,
  )

  let note: string
  if (tab === '1d') {
    if (step1 === 0) {
      note =
        'Στη μία διάσταση η δουλειά είναι εύκολη: ταξινόμησε τα σημεία και σάρωσε γειτονικά ζευγάρια — και τίποτα άλλο. Πάτα «Επόμενο» για να ξεκινήσει η σάρωση.'
    } else if (step1 < last1) {
      note = `Έλεγχος ζευγαριού (p${cur1!.i + 1}, p${cur1!.i + 2}) — απόσταση ${fmt(cur1!.gap)}. Ελάχιστο μέχρι τώρα: ${fmt(min1!.gap)} στο (p${min1!.i + 1}, p${min1!.i + 2}).`
    } else {
      note = `Τελείωσε σε ${last1} = n−1 συγκρίσεις. Ελάχιστο: ${fmt(min1!.gap)} στο (p${min1!.i + 1}, p${min1!.i + 2}). Γιατί αρκούν τα γειτονικά; Αν το κοντινότερο ζευγάρι είχε ένα τρίτο σημείο ανάμεσά τους στην ταξινόμηση, εκείνο θα ήταν πιο κοντά σε καθένα τους — αντίφαση.`
    }
  } else {
    if (step2 === 0) {
      note =
        'Δοκίμασε την ίδια ιδέα στο επίπεδο: ταξινόμηση κατά x, και σάρωση γειτονικών στην ταξινόμηση. Τα σημεία είναι ήδη ταξινομημένα A → G κατά x.'
    } else if (step2 < last2) {
      note = `Γειτονικά κατά x: ${TWO_D[cur2!.i].id} και ${TWO_D[cur2!.i + 1].id} — απόσταση ${fmt(cur2!.d)}. Ελάχιστο μέχρι τώρα: ${fmt(min2!.d)} στο (${TWO_D[min2!.i].id}, ${TWO_D[min2!.i + 1].id}).`
    } else if (!reveal2) {
      note = `Τέλος της σάρωσης. Ο αλγόριθμος βρήκε ελάχιστο ${fmt(min2!.d)} στο (${TWO_D[min2!.i].id}, ${TWO_D[min2!.i + 1].id}). Πάτα «Δες το αληθινό κοντινότερο» — το ζευγάρι που έχασε.`
    } else {
      note = `Το αληθινό κοντινότερο είναι (C, E) με απόσταση ${fmt(trueD)} < ${fmt(min2!.d)}. Στην x-ταξινόμηση το D κάθεται ανάμεσα στα C και E (γιατί 5 < 6 < 8), οπότε C και E δεν είναι ποτέ γειτονικά — και ο 1D αλγόριθμος δεν τα συγκρίνει.`
    }
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header + tabs */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Πλησιέστερο ζεύγος — εύκολο σε 1D, σπάει σε 2D
        </div>
        <div className="flex shrink-0 overflow-hidden rounded-md border border-border text-xs font-medium">
          <button
            type="button"
            onClick={() => setTab('1d')}
            className={cn(
              'px-2.5 py-1 transition-colors',
              tab === '1d'
                ? 'bg-accent text-accent-fg'
                : 'text-fg hover:bg-bg-soft',
            )}
          >
            Σε ευθεία (1D)
          </button>
          <button
            type="button"
            onClick={() => setTab('2d')}
            className={cn(
              'border-l border-border px-2.5 py-1 transition-colors',
              tab === '2d'
                ? 'bg-accent text-accent-fg'
                : 'text-fg hover:bg-bg-soft',
            )}
          >
            Στο επίπεδο (2D)
          </button>
        </div>
      </div>

      {/* canvas */}
      <div className="graph-canvas overflow-x-auto">
        {tab === '1d' ? (
          <svg
            viewBox="0 0 480 170"
            className="mx-auto w-full max-w-2xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            <style>{`
              .cp1-axis { stroke: rgb(var(--border-strong)); stroke-width: 2; }
              .cp1-tick { stroke: rgb(var(--fg-muted)); stroke-width: 1; }
              .cp1-pt { fill: rgb(var(--accent)); stroke: rgb(var(--bg-elevated)); stroke-width: 2; }
              .cp1-cur { stroke: rgb(var(--fg)); stroke-width: 3; }
              .cp1-min { stroke: rgb(34 197 94); stroke-width: 3.5; }
              .cp1-id { font: 600 11px ui-sans-serif, system-ui; fill: rgb(var(--fg)); text-anchor: middle; }
              .cp1-val { font: 500 10px ui-sans-serif, system-ui; fill: rgb(var(--fg-muted)); text-anchor: middle; }
              .cp1-mintxt { font: 600 11px ui-sans-serif, system-ui; fill: rgb(34 197 94); text-anchor: middle; }
              .cp1-curtxt { font: 600 11px ui-sans-serif, system-ui; fill: rgb(var(--fg)); text-anchor: middle; }
            `}</style>
            <line x1={40} y1={95} x2={440} y2={95} className="cp1-axis" />
            {min1 && (
              <line
                x1={map1D(ONE_D[min1.i])}
                y1={120}
                x2={map1D(ONE_D[min1.i + 1])}
                y2={120}
                className="cp1-min"
              />
            )}
            {cur1 && (!min1 || cur1.i !== min1.i) && (
              <line
                x1={map1D(ONE_D[cur1.i])}
                y1={70}
                x2={map1D(ONE_D[cur1.i + 1])}
                y2={70}
                className="cp1-cur"
              />
            )}
            {ONE_D.map((v, i) => (
              <g key={i}>
                <line x1={map1D(v)} y1={91} x2={map1D(v)} y2={99} className="cp1-tick" />
                <circle cx={map1D(v)} cy={95} r={7} className="cp1-pt" />
                <text x={map1D(v)} y={52} className="cp1-id">
                  p{i + 1}
                </text>
                <text x={map1D(v)} y={66} className="cp1-val">
                  {v}
                </text>
              </g>
            ))}
            {cur1 && (!min1 || cur1.i !== min1.i) && (
              <text
                x={(map1D(ONE_D[cur1.i]) + map1D(ONE_D[cur1.i + 1])) / 2}
                y={62}
                className="cp1-curtxt"
              >
                Δ = {fmt(cur1.gap)}
              </text>
            )}
            {min1 && (
              <text
                x={(map1D(ONE_D[min1.i]) + map1D(ONE_D[min1.i + 1])) / 2}
                y={140}
                className="cp1-mintxt"
              >
                min = {fmt(min1.gap)}
              </text>
            )}
          </svg>
        ) : (
          <svg
            viewBox="0 0 480 260"
            className="mx-auto w-full max-w-2xl"
            xmlns="http://www.w3.org/2000/svg"
          >
            <style>{`
              .cp2-axis { stroke: rgb(var(--border-strong)); stroke-width: 1.5; }
              .cp2-grid { stroke: rgb(var(--border)); stroke-width: 0.5; opacity: 0.5; }
              .cp2-pt { fill: rgb(var(--accent)); stroke: rgb(var(--bg-elevated)); stroke-width: 2; }
              .cp2-cur { stroke: rgb(var(--fg)); stroke-width: 2.5; }
              .cp2-min { stroke: rgb(56 189 248); stroke-width: 3; }
              .cp2-true { stroke: rgb(34 197 94); stroke-width: 3.5; stroke-dasharray: 5 3; }
              .cp2-id { font: 700 12px ui-sans-serif, system-ui; fill: rgb(var(--fg)); text-anchor: middle; }
              .cp2-val { font: 500 10px ui-sans-serif, system-ui; fill: rgb(var(--fg-muted)); text-anchor: middle; }
              .cp2-truetxt { font: 600 11px ui-sans-serif, system-ui; fill: rgb(22 163 74); text-anchor: middle; }
            `}</style>
            {/* grid */}
            {Array.from({ length: 13 }, (_, i) => (
              <line key={`gx${i}`} x1={map2X(i)} y1={20} x2={map2X(i)} y2={220} className="cp2-grid" />
            ))}
            {Array.from({ length: 10 }, (_, i) => (
              <line key={`gy${i}`} x1={40} y1={map2Y(i)} x2={440} y2={map2Y(i)} className="cp2-grid" />
            ))}
            <line x1={40} y1={220} x2={440} y2={220} className="cp2-axis" />
            <line x1={40} y1={20} x2={40} y2={220} className="cp2-axis" />
            <text x={446} y={224} className="cp2-val" textAnchor="start">x</text>
            <text x={34} y={26} className="cp2-val" textAnchor="end">y</text>
            {/* min pair line */}
            {min2 && (
              <line
                x1={map2X(TWO_D[min2.i].x)}
                y1={map2Y(TWO_D[min2.i].y)}
                x2={map2X(TWO_D[min2.i + 1].x)}
                y2={map2Y(TWO_D[min2.i + 1].y)}
                className="cp2-min"
              />
            )}
            {/* current pair line (suppressed when it equals min) */}
            {cur2 && (!min2 || cur2.i !== min2.i) && (
              <line
                x1={map2X(TWO_D[cur2.i].x)}
                y1={map2Y(TWO_D[cur2.i].y)}
                x2={map2X(TWO_D[cur2.i + 1].x)}
                y2={map2Y(TWO_D[cur2.i + 1].y)}
                className="cp2-cur"
              />
            )}
            {/* true closest pair, revealed at the end */}
            {reveal2 && (
              <line
                x1={map2X(TWO_D[TRUE_PAIR_2D[0]].x)}
                y1={map2Y(TWO_D[TRUE_PAIR_2D[0]].y)}
                x2={map2X(TWO_D[TRUE_PAIR_2D[1]].x)}
                y2={map2Y(TWO_D[TRUE_PAIR_2D[1]].y)}
                className="cp2-true"
              />
            )}
            {reveal2 && (
              <text
                x={(map2X(TWO_D[TRUE_PAIR_2D[0]].x) + map2X(TWO_D[TRUE_PAIR_2D[1]].x)) / 2}
                y={map2Y((TWO_D[TRUE_PAIR_2D[0]].y + TWO_D[TRUE_PAIR_2D[1]].y) / 2) - 10}
                className="cp2-truetxt"
              >
                {fmt(trueD)}
              </text>
            )}
            {/* points */}
            {TWO_D.map((p) => (
              <g key={p.id}>
                <circle cx={map2X(p.x)} cy={map2Y(p.y)} r={8} className="cp2-pt" />
                <text x={map2X(p.x)} y={map2Y(p.y) - 12} className="cp2-id">
                  {p.id}
                </text>
              </g>
            ))}
          </svg>
        )}
      </div>

      {/* legend for 2D */}
      {tab === '2d' && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-subtle">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 bg-zinc-700 dark:bg-zinc-200" /> τρέχον γειτονικό κατά x
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 bg-sky-400" /> ελάχιστο του αλγορίθμου
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 bg-green-500" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #22c55e 0 5px, transparent 5px 8px)' }} /> αληθινό κοντινότερο
          </span>
        </div>
      )}

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-3 min-h-[4.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {tab === '1d' ? (
          <>
            <button
              type="button"
              onClick={() => setStep1((s) => Math.max(0, s - 1))}
              disabled={step1 === 0}
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Πίσω
            </button>
            <button
              type="button"
              onClick={() => setStep1((s) => Math.min(last1, s + 1))}
              disabled={step1 === last1}
              className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Επόμενο
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setStep1(0)}
              disabled={step1 === 0}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Από την αρχή
            </button>
            <span className="ml-auto text-xs font-medium text-fg-subtle">
              Σύγκριση {step1} / {last1}
            </span>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setStep2((s) => Math.max(0, s - 1))
                setReveal2(false)
              }}
              disabled={step2 === 0}
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Πίσω
            </button>
            <button
              type="button"
              onClick={() => setStep2((s) => Math.min(last2, s + 1))}
              disabled={step2 === last2}
              className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Επόμενο
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
            {finished2 && !reveal2 && (
              <button
                type="button"
                onClick={() => setReveal2(true)}
                className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-500/15 dark:text-emerald-300"
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                Δες το αληθινό κοντινότερο
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setStep2(0)
                setReveal2(false)
              }}
              disabled={step2 === 0}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Από την αρχή
            </button>
            <span className="ml-auto text-xs font-medium text-fg-subtle">
              Σύγκριση {step2} / {last2}
            </span>
          </>
        )}
      </div>
    </section>
  )
}
