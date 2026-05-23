'use client'

/**
 * LamppostsMISViz — μέγιστο ανεξάρτητο σύνολο σε μονοπάτι, για pt5-th4.
 *
 * Three tabs over the same 7-position street and the same brightness vector
 * φ = [8, 40, 20, 16, 32, 36, 24]:
 *
 *  1. «Άπληστος odd/even» — two static columns: pick only odd-indexed (84) or
 *     only even-indexed (92). The greedy returns max(84, 92) = 92.
 *  2. «Το πραγματικό βέλτιστο» — surface the third option {x₂, x₅, x₇} = 96
 *     that the greedy cannot reach: not all odd, not all even, mixed.
 *  3. «DP βήμα-βήμα» — step through OPT(i) = max(OPT(i−1), φᵢ + OPT(i−2));
 *     finishes by back-tracking the chosen set {2, 5, 7} from the table.
 *
 * Every lamppost is drawn as a bulb whose glow scales with brightness, so the
 * relative φ values pop out visually before any arithmetic happens.
 */

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

const N = 7
const PHI: number[] = [0, 8, 40, 20, 16, 32, 36, 24] // 1-indexed; PHI[0] unused.
const PHI_MAX = Math.max(...PHI.slice(1))

/* ── precompute OPT and the recovered optimal set ──────────────────────── */

const OPT: number[] = new Array(N + 1).fill(0)
const TAKE: boolean[] = new Array(N + 1).fill(false)
OPT[0] = 0
OPT[1] = PHI[1]
TAKE[1] = true
for (let i = 2; i <= N; i++) {
  const skip = OPT[i - 1]
  const take = PHI[i] + OPT[i - 2]
  if (take > skip) {
    OPT[i] = take
    TAKE[i] = true
  } else {
    OPT[i] = skip
    TAKE[i] = false
  }
}
const CHOSEN: number[] = (() => {
  const out: number[] = []
  let i = N
  while (i > 0) {
    if (TAKE[i]) {
      out.push(i)
      i -= 2
    } else i -= 1
  }
  return out.sort((a, b) => a - b)
})()
const OPT_SUM = OPT[N]

const ODD_SET = [1, 3, 5, 7].filter((i) => i <= N)
const EVEN_SET = [2, 4, 6].filter((i) => i <= N)
const ODD_SUM = ODD_SET.reduce((s, i) => s + PHI[i], 0)
const EVEN_SUM = EVEN_SET.reduce((s, i) => s + PHI[i], 0)
const GREEDY_PICK = ODD_SUM >= EVEN_SUM ? 'odd' : 'even'
const GREEDY_SUM = Math.max(ODD_SUM, EVEN_SUM)

/* ── street geometry ──────────────────────────────────────────────────── */

const SLOT_W = 84
const X0 = 50
const STREET_Y = 150
const VB_W = X0 + SLOT_W * (N - 1) + 50
const VB_H = 220

function slotX(i: number) {
  return X0 + (i - 1) * SLOT_W
}

type Tab = 'greedy' | 'optimal' | 'dp'

function Street({
  selected,
  total,
  caption,
  highlight,
}: {
  selected: Set<number>
  total: number
  caption: string
  highlight?: 'green' | 'rose' | 'sky'
}) {
  return (
    <div className="graph-canvas overflow-x-auto">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="mx-auto block w-full"
        style={{ maxWidth: `${VB_W}px` }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* road */}
        <rect x={20} y={STREET_Y} width={VB_W - 40} height={28} rx={4} fill="#1f2937" />
        <line
          x1={30}
          y1={STREET_Y + 14}
          x2={VB_W - 30}
          y2={STREET_Y + 14}
          stroke="#fbbf24"
          strokeWidth={2}
          strokeDasharray="14,14"
        />

        {/* lampposts */}
        {Array.from({ length: N }, (_, k) => k + 1).map((i) => {
          const x = slotX(i)
          const on = selected.has(i)
          const phi = PHI[i]
          const radius = 10 + 14 * (phi / PHI_MAX)
          const labelColor = on
            ? highlight === 'rose'
              ? '#be123c'
              : highlight === 'sky'
                ? '#0c4a6e'
                : '#166534'
            : '#9b8a8d'
          return (
            <g key={i}>
              {/* pole */}
              <line
                x1={x}
                y1={STREET_Y}
                x2={x}
                y2={STREET_Y - 50}
                stroke={on ? '#1f2937' : '#9b8a8d'}
                strokeWidth={3}
              />
              {/* arm */}
              <line
                x1={x}
                y1={STREET_Y - 50}
                x2={x + 16}
                y2={STREET_Y - 56}
                stroke={on ? '#1f2937' : '#9b8a8d'}
                strokeWidth={3}
              />
              {/* bulb */}
              {on && (
                <circle cx={x + 16} cy={STREET_Y - 56} r={radius + 10} fill="#fde68a" opacity={0.45} />
              )}
              <circle
                cx={x + 16}
                cy={STREET_Y - 56}
                r={radius}
                fill={on ? '#facc15' : '#e7dfd9'}
                stroke={on ? '#a16207' : '#cdbfc0'}
                strokeWidth={2}
              />
              {/* x label */}
              <text
                x={x}
                y={STREET_Y + 50}
                textAnchor="middle"
                fontSize={12}
                fontWeight={700}
                fill="#1c1214"
              >
                x{i}
              </text>
              {/* φ label */}
              <text
                x={x}
                y={STREET_Y + 68}
                textAnchor="middle"
                fontSize={11}
                fontFamily="ui-monospace, monospace"
                fill={labelColor}
                fontWeight={on ? 700 : 500}
              >
                φ={phi}
              </text>
            </g>
          )
        })}
      </svg>
      <p className="mt-1 text-center text-xs text-fg-subtle">
        {caption} · σύνολο φωτεινότητας ={' '}
        <span className="font-mono font-bold text-fg">{total}</span>
      </p>
    </div>
  )
}

export function LamppostsMISViz() {
  const [tab, setTab] = useState<Tab>('greedy')
  const [greedyPick, setGreedyPick] = useState<'odd' | 'even'>(GREEDY_PICK)
  const [dpStep, setDpStep] = useState(0)

  const dpLast = N + 1 // 0 intro · 1..N fill · N+1 backtrack

  const greedySelected = useMemo(() => new Set(greedyPick === 'odd' ? ODD_SET : EVEN_SET), [greedyPick])
  const greedyTotal = greedyPick === 'odd' ? ODD_SUM : EVEN_SUM

  const optimalSelected = useMemo(() => new Set(CHOSEN), [])

  // DP step state
  const j = dpStep >= 1 && dpStep <= N ? dpStep : 0
  const dpDone = dpStep === dpLast
  const filledUpto = Math.min(dpStep, N)
  const takeVal = j >= 2 ? PHI[j] + OPT[j - 2] : j === 1 ? PHI[1] : 0
  const winner = j > 0 ? TAKE[j] : null

  let dpNote: string
  if (dpStep === 0) {
    dpNote = `7 θέσεις στη σειρά με φωτεινότητες [${PHI.slice(1).join(', ')}]. Αρχικά OPT(0) = 0. Θα γεμίσουμε OPT(1), …, OPT(${N}).`
  } else if (j === 1) {
    dpNote = `OPT(1): υπάρχει μόνο μία επιλογή — βάζω κολώνα στη θέση x₁ με φ₁ = ${PHI[1]}, άρα OPT(1) = ${PHI[1]}.`
  } else if (j > 0) {
    dpNote =
      `OPT(${j}): δύο επιλογές για το x${j}. ` +
      `ΕΞΩ: OPT(${j - 1}) = ${OPT[j - 1]}. ` +
      `ΜΕΣΑ: φ${j} + OPT(${j - 2}) = ${PHI[j]} + ${OPT[j - 2]} = ${takeVal}. ` +
      `max → OPT(${j}) = ${OPT[j]} (το x${j} ${winner ? 'ΜΕΣΑ' : 'ΕΞΩ'}).`
  } else {
    dpNote = `Πέρασμα προς τα πίσω: από το τέλος, ρωτάμε σε κάθε i ποια επιλογή κέρδισε. Βρίσκουμε το ανεξάρτητο σύνολο {${CHOSEN.map((i) => `x${i}`).join(', ')}} = ${OPT_SUM}, μη μονό–μη ζυγό.`
  }

  function tabBtn(t: Tab, label: string) {
    return (
      <button
        key={t}
        type="button"
        onClick={() => setTab(t)}
        className={cn(
          'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
          tab === t ? 'bg-accent text-accent-fg' : 'border border-border text-fg-muted hover:bg-bg-soft',
        )}
      >
        {label}
      </button>
    )
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Κολώνες φωτισμού — μέγιστο ανεξάρτητο σύνολο σε μονοπάτι
        </div>
        <div className="flex flex-wrap gap-1">
          {tabBtn('greedy', '1. Άπληστος odd/even')}
          {tabBtn('optimal', '2. Το πραγματικό βέλτιστο')}
          {tabBtn('dp', '3. DP βήμα-βήμα')}
        </div>
      </div>

      {tab === 'greedy' && (
        <>
          <p className="mb-2 text-xs text-fg-subtle">
            Ο άπληστος διαλέγει το καλύτερο ανάμεσα σε «μόνο μονοί δείκτες» και «μόνο
            ζυγοί δείκτες». Δοκίμασε και τις δύο επιλογές:
          </p>
          <div className="mb-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setGreedyPick('odd')}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                greedyPick === 'odd'
                  ? 'bg-rose-500 text-white'
                  : 'border border-border text-fg-muted hover:bg-bg-soft',
              )}
            >
              Μονοί δείκτες {`{x₁,x₃,x₅,x₇}`} = {ODD_SUM}
            </button>
            <button
              type="button"
              onClick={() => setGreedyPick('even')}
              className={cn(
                'rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                greedyPick === 'even'
                  ? 'bg-rose-500 text-white'
                  : 'border border-border text-fg-muted hover:bg-bg-soft',
              )}
            >
              Ζυγοί δείκτες {`{x₂,x₄,x₆}`} = {EVEN_SUM}
            </button>
          </div>
          <Street
            selected={greedySelected}
            total={greedyTotal}
            caption={`Άπληστος: ${greedyPick === 'odd' ? 'μονοί δείκτες' : 'ζυγοί δείκτες'}`}
            highlight="rose"
          />
          <div className="mt-3 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-900 dark:bg-rose-950/30 dark:text-rose-200">
            Ο άπληστος επιστρέφει max({ODD_SUM}, {EVEN_SUM}) ={' '}
            <strong>{GREEDY_SUM}</strong> — αλλά δεν είναι αυτό το βέλτιστο.
            Άλλαξε καρτέλα στο «2. Το πραγματικό βέλτιστο» για να δεις γιατί.
          </div>
        </>
      )}

      {tab === 'optimal' && (
        <>
          <p className="mb-2 text-xs text-fg-subtle">
            Το πραγματικό βέλτιστο ΔΕΝ είναι ούτε «όλα μονά» ούτε «όλα ζυγά» — είναι
            ένα μικτό σύνολο που σπάει το «μοτίβο» του άπληστου.
          </p>
          <Street
            selected={optimalSelected}
            total={OPT_SUM}
            caption={`Βέλτιστο: {${CHOSEN.map((i) => `x${i}`).join(', ')}}`}
            highlight="green"
          />
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm dark:bg-rose-950/30">
              <div className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                Άπληστος odd/even
              </div>
              <div className="font-mono text-rose-900 dark:text-rose-200">{GREEDY_SUM}</div>
            </div>
            <div className="rounded-lg border border-success/50 bg-success/10 px-3 py-2 text-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                Βέλτιστο {`{x₂, x₅, x₇}`}
              </div>
              <div className="font-mono text-success-fg">
                {PHI[2]} + {PHI[5]} + {PHI[7]} = <strong>{OPT_SUM}</strong>
              </div>
            </div>
          </div>
          <p className="mt-2 text-xs text-fg-muted">
            Παρατήρηση: το βέλτιστο ξεκινά μονό (x₂), συνεχίζει ζυγό (x₅), τελειώνει
            ζυγό (x₇) — δεν χωράει στο δίλημμα του άπληστου. Άρα ο άπληστος αποτυγχάνει.
          </p>
        </>
      )}

      {tab === 'dp' && (
        <>
          <p className="mb-2 text-xs text-fg-subtle">
            OPT(i) = max(OPT(i−1), φᵢ + OPT(i−2)). «Μέσα ή έξω» για κάθε θέση.
          </p>
          <Street
            selected={dpDone ? new Set(CHOSEN) : new Set()}
            total={dpDone ? OPT_SUM : 0}
            caption={dpDone ? `Βέλτιστο: {${CHOSEN.map((i) => `x${i}`).join(', ')}}` : 'Πάτα Επόμενο για να γεμίσεις τον πίνακα'}
            highlight="green"
          />

          {/* OPT table */}
          <div className="mt-3 overflow-x-auto">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              Πίνακας OPT
            </div>
            <div className="flex gap-1">
              {OPT.map((val, idx) => {
                const known = idx <= filledUpto
                const isCur = idx === j
                const isCand = j > 0 && (idx === j - 1 || idx === j - 2)
                return (
                  <div key={idx} className="flex flex-col items-center gap-0.5">
                    <div
                      className={cn(
                        'flex h-10 w-12 items-center justify-center rounded-md border font-mono text-sm font-bold',
                        isCur && 'border-accent bg-accent/15 text-fg',
                        !isCur && isCand && 'border-sky-400 bg-sky-400/15 text-fg',
                        !isCur && !isCand && known && 'border-border bg-bg-soft text-fg',
                        !known && 'border-dashed border-border text-transparent',
                      )}
                    >
                      {known ? val : '·'}
                    </div>
                    <span className="font-mono text-[10px] text-fg-subtle">OPT({idx})</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* candidates */}
          {j > 0 && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div
                className={cn(
                  'rounded-lg border px-3 py-2 text-sm',
                  winner ? 'border-border bg-bg-soft/50' : 'border-success/50 bg-success/10',
                )}
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                  Το x{j} ΕΞΩ
                </div>
                <div className="font-mono text-fg">
                  OPT({j - 1}) = <strong>{j >= 2 ? OPT[j - 1] : 0}</strong>
                </div>
              </div>
              <div
                className={cn(
                  'rounded-lg border px-3 py-2 text-sm',
                  winner ? 'border-success/50 bg-success/10' : 'border-border bg-bg-soft/50',
                )}
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                  Το x{j} ΜΕΣΑ
                </div>
                <div className="font-mono text-fg">
                  φ{j} + OPT({Math.max(0, j - 2)}) = {PHI[j]} +{' '}
                  {j >= 2 ? OPT[j - 2] : 0} = <strong>{takeVal}</strong>
                </div>
              </div>
            </div>
          )}

          <div
            aria-live="polite"
            className="mt-2 min-h-[3.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
          >
            {dpNote}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setDpStep((s) => Math.max(0, s - 1))}
              disabled={dpStep === 0}
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Πίσω
            </button>
            <button
              type="button"
              onClick={() => setDpStep((s) => Math.min(dpLast, s + 1))}
              disabled={dpDone}
              className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Επόμενο
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setDpStep(0)}
              disabled={dpStep === 0}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Από την αρχή
            </button>
            <span className="ml-auto text-xs font-medium text-fg-subtle">
              Βήμα {dpStep} / {dpLast}
            </span>
          </div>
        </>
      )}
    </section>
  )
}
