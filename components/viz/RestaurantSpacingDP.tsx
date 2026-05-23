'use client'

/**
 * RestaurantSpacingDP — άνοιγμα εστιατορίων κατά μήκος δρόμου με περιορισμό k.
 *
 * Instance from the prompt: m = (5, 10, 20, 25, 40, 50), p = (10, 30, 20, 50,
 * 60, 40), k = 15 km. The DP closely mirrors the lampposts MIS, but with two
 * twists worth showing:
 *  - the «predecessor» j is NOT i−2; it's the largest index with
 *    mᵢ − mⱼ ≥ 15. So in step i we draw a 15-km «exclusion zone» around i and
 *    physically show which slots fall outside it.
 *  - the «open / skip» candidates carry pᵢ (the profit of i) and D(j) (the
 *    DP value at the latest feasible predecessor).
 *
 * Final D-table = (10, 30, 30, 80, 140, 140), with the best subset {2, 4, 5}
 * giving 140 — the viz lights this up in the backtrack frame.
 */

import { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

const M_POS: number[] = [5, 10, 20, 25, 40, 50] // 0-indexed positions (km)
const P_VAL: number[] = [10, 30, 20, 50, 60, 40]
const K_KM = 15
const N = M_POS.length

/* ── precompute pred(i), D, decisions, optimal set ─────────────────────── */

const PRED: number[] = (() => {
  // PRED[i] = largest 1-indexed j < i with M[i-1] - M[j-1] >= K. 0 if none.
  const out: number[] = [0]
  for (let i = 1; i <= N; i++) {
    let best = 0
    for (let j = 1; j < i; j++) {
      if (M_POS[i - 1] - M_POS[j - 1] >= K_KM) best = j
    }
    out[i] = best
  }
  return out
})()

const D: number[] = [0]
const TAKE: boolean[] = [false]
for (let i = 1; i <= N; i++) {
  const skip = D[i - 1]
  const take = P_VAL[i - 1] + D[PRED[i]]
  if (take > skip) {
    D.push(take)
    TAKE.push(true)
  } else {
    D.push(skip)
    TAKE.push(false)
  }
}

const CHOSEN: number[] = (() => {
  const out: number[] = []
  let i = N
  while (i > 0) {
    if (TAKE[i]) {
      out.push(i)
      i = PRED[i]
    } else i -= 1
  }
  return out.sort((a, b) => a - b)
})()
const FINAL_D = D[N]

/* ── geometry ──────────────────────────────────────────────────────────── */

const VB_W = 720
const VB_H = 230
const X_LEFT = 50
const X_RIGHT = VB_W - 50
const HW_Y = 130
const M_MAX = M_POS[M_POS.length - 1]
const M_MIN = 0

function locX(km: number) {
  return X_LEFT + ((km - M_MIN) / (M_MAX - M_MIN)) * (X_RIGHT - X_LEFT)
}

export function RestaurantSpacingDP() {
  const last = N + 1 // 0 intro · 1..N fill · N+1 backtrack
  const [step, setStep] = useState(0)

  const i = step >= 1 && step <= N ? step : 0
  const done = step === last
  const filledUpto = Math.min(step, N)

  const winner = i > 0 ? TAKE[i] : null
  const predIdx = i > 0 ? PRED[i] : 0
  const skipVal = i > 0 ? D[i - 1] : 0
  const takeVal = i > 0 ? P_VAL[i - 1] + D[predIdx] : 0

  let note: string
  if (step === 0) {
    note = `6 πιθανές τοποθεσίες σε km m = (${M_POS.join(', ')}), προσδοκώμενα κέρδη p = (${P_VAL.join(', ')}), περιορισμός απόστασης k = ${K_KM}. Στόχος: το μέγιστο D(${N}) — γέμισμα από το D(0) = 0.`
  } else if (i > 0) {
    const km_i = M_POS[i - 1]
    note =
      `D(${i}): η τοποθεσία ${i} βρίσκεται στο km ${km_i}. ` +
      `ΧΩΡΙΣ εστιατόριο: D(${i - 1}) = ${skipVal}. ` +
      `ΜΕ εστιατόριο (κέρδος ${P_VAL[i - 1]}): ο τελευταίος επιτρεπτός γείτονας είναι η τοποθεσία ${predIdx} (km ${predIdx === 0 ? '—' : M_POS[predIdx - 1]}) — δηλαδή p${i} + D(${predIdx}) = ${P_VAL[i - 1]} + ${D[predIdx]} = ${takeVal}. ` +
      `max → D(${i}) = ${D[i]} (το ${i} ${winner ? 'ΜΕΣΑ' : 'ΕΞΩ'}).`
  } else {
    note = `Πέρασμα προς τα πίσω: από i = ${N}, η μέγιστη απόδοση είναι D(${N}) = ${FINAL_D}, με επιλογή των τοποθεσιών {${CHOSEN.join(', ')}} (στις θέσεις m = ${CHOSEN.map((c) => M_POS[c - 1]).join(', ')} km).`
  }

  const finalSet = new Set(done ? CHOSEN : [])

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Εστιατόρια κατά μήκος δρόμου — DP με περιορισμό απόστασης k = {K_KM}
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {done ? `Βέλτιστο: ${FINAL_D}` : step === 0 ? 'Αρχή' : `D(${i})`}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Κίτρινο = η τοποθεσία i · μπλε = ο πιο πρόσφατος επιτρεπτός γείτονας · κόκκινο
        ραβδωτό = ζώνη αποκλεισμού πλάτους k γύρω από το i · πράσινο = στη βέλτιστη λύση.
      </p>

      {/* highway */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="mx-auto block w-full"
          style={{ maxWidth: `${VB_W}px` }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* road */}
          <rect x={X_LEFT - 4} y={HW_Y - 12} width={X_RIGHT - X_LEFT + 8} height={24} rx={3} fill="#1f2937" />
          <line
            x1={X_LEFT}
            y1={HW_Y}
            x2={X_RIGHT}
            y2={HW_Y}
            stroke="#fbbf24"
            strokeWidth={2}
            strokeDasharray="14,14"
          />

          {/* exclusion zone (during fill) */}
          {i > 0 && !done && (
            <rect
              x={locX(Math.max(0, M_POS[i - 1] - K_KM))}
              y={HW_Y - 60}
              width={locX(M_POS[i - 1]) - locX(Math.max(0, M_POS[i - 1] - K_KM))}
              height={120}
              fill="url(#hatch-red)"
              opacity={0.45}
            />
          )}

          {/* hatch pattern definition */}
          <defs>
            <pattern id="hatch-red" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="#f87171" strokeWidth="2" />
            </pattern>
          </defs>

          {/* km ticks */}
          {[0, 10, 20, 30, 40, 50].map((km) => (
            <g key={`tick-${km}`}>
              <line x1={locX(km)} y1={HW_Y + 12} x2={locX(km)} y2={HW_Y + 18} stroke="#9b8a8d" />
              <text x={locX(km)} y={HW_Y + 30} textAnchor="middle" fontSize={10} fill="#9b8a8d">
                {km}
              </text>
            </g>
          ))}

          {/* locations */}
          {M_POS.map((km, idx) => {
            const id = idx + 1
            const isCur = id === i
            const isPred = i > 0 && id === predIdx && predIdx > 0
            const inFinal = finalSet.has(id)
            let fill = '#f3eee9'
            let stroke = '#9b8a8d'
            if (inFinal) {
              fill = '#22c55e'
              stroke = '#15803d'
            } else if (isCur) {
              fill = '#fde68a'
              stroke = '#d97706'
            } else if (isPred) {
              fill = '#bae6fd'
              stroke = '#0284c7'
            }
            return (
              <g key={`loc-${id}`}>
                {/* building icon */}
                <rect
                  x={locX(km) - 14}
                  y={HW_Y - 56}
                  width={28}
                  height={36}
                  rx={3}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                />
                <rect
                  x={locX(km) - 10}
                  y={HW_Y - 50}
                  width={6}
                  height={6}
                  fill={stroke}
                  opacity={0.4}
                />
                <rect
                  x={locX(km) + 4}
                  y={HW_Y - 50}
                  width={6}
                  height={6}
                  fill={stroke}
                  opacity={0.4}
                />
                <rect
                  x={locX(km) - 4}
                  y={HW_Y - 28}
                  width={8}
                  height={8}
                  fill={stroke}
                  opacity={0.6}
                />
                <text
                  x={locX(km)}
                  y={HW_Y - 64}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill="#1c1214"
                >
                  {id} · km {km}
                </text>
                <text
                  x={locX(km)}
                  y={HW_Y + 52}
                  textAnchor="middle"
                  fontSize={11}
                  fontFamily="ui-monospace, monospace"
                  fontWeight={inFinal || isCur ? 700 : 500}
                  fill="#1c1214"
                >
                  p={P_VAL[idx]}
                </text>
              </g>
            )
          })}

          {/* arrow from i to its predecessor */}
          {i > 0 && predIdx > 0 && !done && (
            <>
              <defs>
                <marker id="restaur-pred-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L10,5 L0,10 z" fill="#0284c7" />
                </marker>
              </defs>
              <path
                d={`M ${locX(M_POS[i - 1])} ${HW_Y + 70} Q ${(locX(M_POS[i - 1]) + locX(M_POS[predIdx - 1])) / 2} ${HW_Y + 100} ${locX(M_POS[predIdx - 1])} ${HW_Y + 70}`}
                fill="none"
                stroke="#0284c7"
                strokeWidth={2}
                strokeDasharray="6,3"
                markerEnd="url(#restaur-pred-arrow)"
              />
              <text
                x={(locX(M_POS[i - 1]) + locX(M_POS[predIdx - 1])) / 2}
                y={HW_Y + 112}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill="#0284c7"
              >
                pred({i}) = {predIdx}
              </text>
            </>
          )}
        </svg>
      </div>

      {/* D table */}
      <div className="mt-3 overflow-x-auto">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Πίνακας D
        </div>
        <div className="flex gap-1">
          {D.map((val, idx) => {
            const known = idx <= filledUpto
            const isCur = idx === i
            const isCand = i > 0 && (idx === i - 1 || idx === predIdx) && idx !== i
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
                <span className="font-mono text-[10px] text-fg-subtle">D({idx})</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* candidate computation */}
      {i > 0 && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div
            className={cn(
              'rounded-lg border px-3 py-2 text-sm',
              winner ? 'border-border bg-bg-soft/50' : 'border-success/50 bg-success/10',
            )}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              ΧΩΡΙΣ εστιατόριο στο {i}
            </div>
            <div className="font-mono text-fg">
              D({i - 1}) = <strong>{skipVal}</strong>
            </div>
          </div>
          <div
            className={cn(
              'rounded-lg border px-3 py-2 text-sm',
              winner ? 'border-success/50 bg-success/10' : 'border-border bg-bg-soft/50',
            )}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
              ΜΕ εστιατόριο στο {i}
            </div>
            <div className="font-mono text-fg">
              p{i} + D({predIdx}) = {P_VAL[i - 1]} + {D[predIdx]} ={' '}
              <strong>{takeVal}</strong>
            </div>
          </div>
        </div>
      )}

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
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Πίσω
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(last, s + 1))}
          disabled={done}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          Επόμενο
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setStep(0)}
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
