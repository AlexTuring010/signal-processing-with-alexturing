'use client'

/**
 * RodCuttingDP — fill the C[0..n] table for the classic rod-cutting DP.
 *
 * Instance: n=8, prices V = (1, 5, 8, 9, 10, 17, 17, 20). The viz steps
 * through each i = 1..n. At step i it shows ALL candidates V_k + C(i−k) for
 * k = 1..i — the rod is split visually into a left red piece of length k and
 * a right purple piece of length i−k whose value reads off the already-filled
 * table. The winning k lights green; C(i) takes that value. After the fill
 * we backtrack to recover the optimal cuts for the full rod (6 cm + 2 cm =
 * 22 — and we can sanity-check the same total is reachable by V_2 + V_6 etc.,
 * but the canonical recovery is the one the algorithm builds).
 */

import { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

const V: number[] = [0, 1, 5, 8, 9, 10, 17, 17, 20] // 1-indexed; V[0] unused
const N = 8

/* ── precompute the table + the chosen first-cut at each step ─────────── */

const C: number[] = new Array(N + 1).fill(0)
const FIRST_K: number[] = new Array(N + 1).fill(0) // FIRST_K[i] = the k that wins for C(i)

for (let i = 1; i <= N; i++) {
  let best = -Infinity
  let bestK = 1
  for (let k = 1; k <= i; k++) {
    const cand = V[k] + C[i - k]
    if (cand > best) {
      best = cand
      bestK = k
    }
  }
  C[i] = best
  FIRST_K[i] = bestK
}

/** Recover the cuts of the full rod by following FIRST_K. */
const FINAL_CUTS: number[] = (() => {
  const cuts: number[] = []
  let i = N
  while (i > 0) {
    const k = FIRST_K[i]
    cuts.push(k)
    i -= k
  }
  return cuts
})()
const FINAL_C = C[N]

/* ── geometry ──────────────────────────────────────────────────────────── */

const UNIT = 38
const ROD_Y = 60
const ROD_H = 30
const VB_W = 60 + N * UNIT + 60
const VB_H = 230

function rodX(k: number) {
  return 30 + k * UNIT
}

export function RodCuttingDP() {
  const last = N + 1 // 0 intro · 1..N fill · N+1 backtrack
  const [step, setStep] = useState(0)
  const [hoverK, setHoverK] = useState<number | null>(null)

  const i = step >= 1 && step <= N ? step : 0
  const done = step === last
  const filledUpto = Math.min(step, N)

  const candidates = i > 0 ? Array.from({ length: i }, (_, idx) => idx + 1) : []
  const winningK = i > 0 ? FIRST_K[i] : 0
  const displayedK = i > 0 ? hoverK ?? winningK : 0

  let note: string
  if (step === 0) {
    note =
      `Τιμές V = (${V.slice(1).join(', ')}). Αρχικά C(0) = 0 (μηδενική ράβδος → μηδέν κέρδος). Θα γεμίσουμε C(1), …, C(${N}).`
  } else if (i > 0) {
    const vK = V[displayedK]
    const cRest = C[i - displayedK]
    note =
      `C(${i}): δοκιμάζουμε όλα τα k = 1..${i}. ` +
      `Κάθε υποψήφιο = V_k + C(${i}−k). ` +
      `Νικητής: k = ${winningK}, με V_${winningK} + C(${i - winningK}) = ${V[winningK]} + ${C[i - winningK]} = ${C[i]}. ` +
      (hoverK != null
        ? `Δείχνεις τώρα: k = ${displayedK}, που δίνει ${vK} + ${cRest} = ${vK + cRest}.`
        : '')
  } else {
    note = `Πέρασμα προς τα πίσω: ξεκινώντας από i = ${N}, σε κάθε βήμα κόβουμε το «νικητή k» — ${FINAL_CUTS.join(' + ')} = ${N}. Συνολικό κέρδος C(${N}) = ${FINAL_C}.`
  }

  // For the rod display in backtrack mode: build the cumulative offsets.
  const finalCutOffsets: number[] = (() => {
    const out: number[] = [0]
    let cur = 0
    for (const k of FINAL_CUTS) {
      cur += k
      out.push(cur)
    }
    return out
  })()

  const SEG_COLORS = ['#fb923c', '#a78bfa', '#34d399', '#60a5fa', '#fbbf24', '#f472b6']

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Τεμαχισμός ράβδου — γέμισμα του πίνακα C
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {done ? `Βέλτιστο: ${FINAL_C}` : step === 0 ? 'Αρχή' : `C(${i})`}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Κάθε C(i) δοκιμάζει όλα τα πρώτα κομμάτια k = 1..i. Πορτοκαλί = κομμένο πρώτο
        κομμάτι μήκους k (αξία Vₖ) · μωβ = υπόλοιπο μήκους i−k (αξία C(i−k)).
      </p>

      {/* the rod */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="mx-auto block w-full"
          style={{ maxWidth: `${VB_W}px` }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* full rod outline at the back */}
          <rect
            x={rodX(0)}
            y={ROD_Y}
            width={i > 0 ? UNIT * i : UNIT * (done ? N : 0)}
            height={ROD_H}
            fill="#f3eee9"
            stroke="#9b8a8d"
            strokeWidth={1.4}
          />

          {/* during fill: split based on displayedK */}
          {i > 0 && !done && (
            <>
              <rect
                x={rodX(0)}
                y={ROD_Y}
                width={UNIT * displayedK}
                height={ROD_H}
                fill="#fed7aa"
                stroke="#d97706"
                strokeWidth={2}
              />
              {i - displayedK > 0 && (
                <rect
                  x={rodX(displayedK)}
                  y={ROD_Y}
                  width={UNIT * (i - displayedK)}
                  height={ROD_H}
                  fill="#ddd6fe"
                  stroke="#7c3aed"
                  strokeWidth={2}
                />
              )}
              {/* cut marker */}
              <line
                x1={rodX(displayedK)}
                y1={ROD_Y - 6}
                x2={rodX(displayedK)}
                y2={ROD_Y + ROD_H + 6}
                stroke="#d97706"
                strokeWidth={2}
                strokeDasharray="3,2"
              />
              <text
                x={rodX(displayedK / 2)}
                y={ROD_Y - 8}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill="#9a3412"
              >
                Vₖ = V_{displayedK} = {V[displayedK]}
              </text>
              {i - displayedK > 0 && (
                <text
                  x={rodX(displayedK + (i - displayedK) / 2)}
                  y={ROD_Y - 8}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill="#5b21b6"
                >
                  C({i}−{displayedK}) = C({i - displayedK}) = {C[i - displayedK]}
                </text>
              )}
            </>
          )}

          {/* backtrack: final cuts */}
          {done && (
            <>
              {FINAL_CUTS.map((k, idx) => {
                const fromX = rodX(finalCutOffsets[idx])
                return (
                  <g key={`cut-${idx}`}>
                    <rect
                      x={fromX}
                      y={ROD_Y}
                      width={UNIT * k}
                      height={ROD_H}
                      fill={SEG_COLORS[idx % SEG_COLORS.length]}
                      stroke="#1c1214"
                      strokeWidth={1.4}
                    />
                    <text
                      x={fromX + (UNIT * k) / 2}
                      y={ROD_Y + ROD_H / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={12}
                      fontWeight={700}
                      fill="#1c1214"
                    >
                      {k} cm · V={V[k]}
                    </text>
                  </g>
                )
              })}
            </>
          )}

          {/* length labels under each cm tick */}
          {Array.from({ length: N + 1 }, (_, k) => (
            <g key={`tick-${k}`}>
              <line x1={rodX(k)} y1={ROD_Y + ROD_H} x2={rodX(k)} y2={ROD_Y + ROD_H + 4} stroke="#9b8a8d" />
              <text
                x={rodX(k)}
                y={ROD_Y + ROD_H + 16}
                textAnchor="middle"
                fontSize={10}
                fill="#9b8a8d"
              >
                {k}
              </text>
            </g>
          ))}

          {/* V row */}
          <text x={20} y={ROD_Y + ROD_H + 44} fontSize={10} fontWeight={700} fill="#9b8a8d">
            V:
          </text>
          {Array.from({ length: N }, (_, kk) => kk + 1).map((k) => (
            <text
              key={`V-${k}`}
              x={rodX(k) - UNIT / 2}
              y={ROD_Y + ROD_H + 44}
              textAnchor="middle"
              fontSize={11}
              fontFamily="ui-monospace, monospace"
              fill="#1c1214"
            >
              {V[k]}
            </text>
          ))}

          {/* candidate-k pickers during fill */}
          {i > 0 && !done && (
            <>
              <text
                x={20}
                y={ROD_Y + ROD_H + 72}
                fontSize={10}
                fontWeight={700}
                fill="#9b8a8d"
              >
                k:
              </text>
              {candidates.map((k) => {
                const isWin = k === winningK
                const isShow = k === displayedK
                return (
                  <g
                    key={`pick-${k}`}
                    onMouseEnter={() => setHoverK(k)}
                    onMouseLeave={() => setHoverK(null)}
                    onClick={() => setHoverK(k === hoverK ? null : k)}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect
                      x={rodX(k) - UNIT / 2 - 11}
                      y={ROD_Y + ROD_H + 60}
                      width={22}
                      height={18}
                      rx={3}
                      fill={isShow ? '#fde68a' : isWin ? '#dcfce7' : '#f3eee9'}
                      stroke={isShow ? '#d97706' : isWin ? '#16a34a' : '#cdbfc0'}
                      strokeWidth={1.4}
                    />
                    <text
                      x={rodX(k) - UNIT / 2}
                      y={ROD_Y + ROD_H + 72}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={700}
                      fill="#1c1214"
                    >
                      {V[k] + C[i - k]}
                    </text>
                  </g>
                )
              })}
            </>
          )}
        </svg>
      </div>

      {/* C table */}
      <div className="mt-3 overflow-x-auto">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Πίνακας C
        </div>
        <div className="flex gap-1">
          {C.map((val, idx) => {
            const known = idx <= filledUpto
            const isCur = idx === i
            const isCand = i > 0 && idx === i - displayedK
            return (
              <div key={idx} className="flex flex-col items-center gap-0.5">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-md border font-mono text-sm font-bold',
                    isCur && 'border-accent bg-accent/15 text-fg',
                    !isCur && isCand && 'border-purple-500 bg-purple-500/15 text-fg',
                    !isCur && !isCand && known && 'border-border bg-bg-soft text-fg',
                    !known && 'border-dashed border-border text-transparent',
                  )}
                >
                  {known ? val : '·'}
                </div>
                <span className="font-mono text-[10px] text-fg-subtle">C({idx})</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* annotation */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[3.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setStep((s) => Math.max(0, s - 1))
            setHoverK(null)
          }}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Πίσω
        </button>
        <button
          type="button"
          onClick={() => {
            setStep((s) => Math.min(last, s + 1))
            setHoverK(null)
          }}
          disabled={done}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Επόμενο
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => {
            setStep(0)
            setHoverK(null)
          }}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Από την αρχή
        </button>
        <span className="ml-auto text-xs font-medium text-fg-subtle">
          Βήμα {step} / {last}
        </span>
      </div>
    </section>
  )
}
