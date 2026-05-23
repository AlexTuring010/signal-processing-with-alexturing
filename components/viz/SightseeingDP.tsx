'use client'

/**
 * SightseeingDP — the «ταξί ή πατίνι;» recurrence for pt1-th3.
 *
 * OPT(i) = min{ OPT(i−1) + cᵢ,  OPT(max(0,i−4)) + S }. The two arms are
 * physically different:
 *   - «ταξί»  : short hop, one step back from i, costs cᵢ.
 *   - «πατίνι»: one rental covering up to 4 hops, jump four sights back,
 *                flat cost S.
 *
 * The viz steps from OPT(1) to OPT(n) — for each i it draws the two candidate
 * arrows on the sights-strip (a short taxi arrow over the last step, a long
 * scooter arrow spanning the last four), pops the candidate values into a
 * side panel, and pulls the winner into the OPT table. After the fill it
 * back-tracks the choices to highlight the actual route taken: which steps
 * were taxi, which range was covered by a scooter rental. n = 5, cᵢ = 4 each,
 * S = 10 → OPT(5) = 14 with one scooter (covers α₁..α₄) and one taxi for α₅.
 */

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

/** 5 sights with uniform taxi fares; flat scooter rental S=10. */
const N = 5
const C: number[] = [0, 4, 4, 4, 4, 4] // C[i] = cost of taxi step i-1 -> i, C[1..N]
const S = 10

type Choice = 'taxi' | 'scooter'

/* ── precompute OPT, decisions, route ──────────────────────────────────── */

const OPT: number[] = new Array(N + 1).fill(0)
const TAKE: Choice[] = new Array(N + 1).fill('taxi')

for (let i = 1; i <= N; i++) {
  const taxi = OPT[i - 1] + C[i]
  const scoot = OPT[Math.max(0, i - 4)] + S
  if (taxi <= scoot) {
    OPT[i] = taxi
    TAKE[i] = 'taxi'
  } else {
    OPT[i] = scoot
    TAKE[i] = 'scooter'
  }
}

/** Trace the decisions backwards to recover segments. */
type Segment = { kind: Choice; from: number; to: number; cost: number }
const SEGMENTS: Segment[] = (() => {
  const out: Segment[] = []
  let i = N
  while (i > 0) {
    if (TAKE[i] === 'taxi') {
      out.unshift({ kind: 'taxi', from: i - 1, to: i, cost: C[i] })
      i -= 1
    } else {
      const from = Math.max(0, i - 4)
      out.unshift({ kind: 'scooter', from, to: i, cost: S })
      i = from
    }
  }
  return out
})()

/* ── geometry ──────────────────────────────────────────────────────────── */

const SLOT_W = 90
const X0 = 50
const Y_SIGHT = 80
const VB_W = X0 + SLOT_W * N + 30
const VB_H = 180

function sightX(i: number) {
  return X0 + i * SLOT_W
}

export function SightseeingDP() {
  const last = N + 1 // 0 = intro, 1..N fill, N+1 = backtrack
  const [step, setStep] = useState(0)

  const j = step >= 1 && step <= N ? step : 0
  const done = step === last
  const filledUpto = Math.min(step, N)

  const taxiCand = j > 0 ? { val: OPT[j - 1] + C[j], from: j - 1 } : null
  const scootFrom = j > 0 ? Math.max(0, j - 4) : 0
  const scootCand = j > 0 ? { val: OPT[scootFrom] + S, from: scootFrom } : null
  const winner = j > 0 ? TAKE[j] : null

  // For backtrack view, build a lookup so we can color each sight by which segment claims it.
  const segByEnd = useMemo(() => {
    const m = new Map<number, Segment>()
    if (done) for (const s of SEGMENTS) m.set(s.to, s)
    return m
  }, [done])

  let note: string
  if (step === 0) {
    note =
      '5 αξιοθέατα, σταθερό κόμιστρο 4 ανά διαδρομή, μίσθωση πατινιού S = 10 (καλύπτει μέχρι 4 διαδρομές). Θα γεμίσουμε OPT(0), OPT(1), …, OPT(5).'
  } else if (j > 0) {
    note =
      `OPT(${j}): πώς ήρθα στο α${j}; ΤΑΞΙ: OPT(${j - 1}) + c${j} = ${OPT[j - 1]} + ${C[j]} = ${taxiCand!.val}. ` +
      `ΠΑΤΙΝΙ από α${scootFrom}: OPT(${scootFrom}) + S = ${OPT[scootFrom]} + ${S} = ${scootCand!.val}. ` +
      `min → OPT(${j}) = ${OPT[j]}, με τελευταίο τμήμα ${winner === 'taxi' ? 'ταξί' : 'πατίνι'}.`
  } else {
    const taxiCount = SEGMENTS.filter((s) => s.kind === 'taxi').length
    const scootCount = SEGMENTS.filter((s) => s.kind === 'scooter').length
    note =
      `Πέρασμα προς τα πίσω: η βέλτιστη διαδρομή έχει ${scootCount} μίσθωση/μισθώσεις πατινιού και ${taxiCount} διαδρομές ταξί, με συνολικό κόστος OPT(${N}) = ${OPT[N]}. ` +
      `(Έλεγχος: μόνο ταξί = ${C.slice(1).reduce((a, b) => a + b, 0)}, οπότε το πατίνι κερδίζει.)`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Επίσκεψη αξιοθέατων — DP «ταξί ή πατίνι;»
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {done ? `Βέλτιστο: ${OPT[N]}` : step === 0 ? 'Αρχή' : `OPT(${j})`}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Σύντομο βέλος = ένα βήμα ταξί (κόστος c). Μακρύ βέλος = ένα πατίνι που καλύπτει
        μέχρι 4 βήματα (κόστος S).
      </p>

      {/* sights strip */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="mx-auto block w-full"
          style={{ maxWidth: `${VB_W}px` }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker id="sgt-arrow-taxi" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="#d97706" />
            </marker>
            <marker id="sgt-arrow-scoot" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="#0284c7" />
            </marker>
            <marker id="sgt-arrow-final" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,0 L10,5 L0,10 z" fill="#15803d" />
            </marker>
          </defs>

          {/* baseline */}
          <line x1={sightX(0)} y1={Y_SIGHT} x2={sightX(N)} y2={Y_SIGHT} stroke="#cdbfc0" strokeWidth={1.5} />

          {/* sight nodes */}
          {Array.from({ length: N + 1 }, (_, i) => i).map((i) => {
            const seg = segByEnd.get(i)
            const isCur = i === j
            const inFinal = done && (i === 0 || segByEnd.has(i) || SEGMENTS.some((s) => s.from <= i && i <= s.to))
            let fill = '#f3eee9'
            let stroke = '#9b8a8d'
            if (isCur) {
              fill = '#fde68a'
              stroke = '#d97706'
            } else if (done && inFinal) {
              if (seg?.kind === 'scooter') {
                fill = '#bae6fd'
                stroke = '#0284c7'
              } else if (seg?.kind === 'taxi') {
                fill = '#fed7aa'
                stroke = '#d97706'
              } else {
                fill = '#e2e8f0'
                stroke = '#475569'
              }
            }
            return (
              <g key={`s-${i}`}>
                <circle cx={sightX(i)} cy={Y_SIGHT} r={18} fill={fill} stroke={stroke} strokeWidth={2} />
                <text
                  x={sightX(i)}
                  y={Y_SIGHT + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                  fontWeight={700}
                  fill="#1c1214"
                >
                  α{i === 0 ? 0 : i}
                </text>
                {i > 0 && (
                  <text
                    x={sightX(i)}
                    y={Y_SIGHT + 38}
                    textAnchor="middle"
                    fontSize={10}
                    fill="#9b8a8d"
                    fontFamily="ui-monospace, monospace"
                  >
                    c{i}={C[i]}
                  </text>
                )}
                {done && segByEnd.has(i) && (
                  <text
                    x={sightX(i)}
                    y={Y_SIGHT - 28}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={600}
                    fill={segByEnd.get(i)!.kind === 'scooter' ? '#0284c7' : '#d97706'}
                  >
                    {segByEnd.get(i)!.kind === 'scooter' ? '🛴 πατίνι' : '🚖 ταξί'}
                  </text>
                )}
              </g>
            )
          })}

          {/* live candidate arrows during fill */}
          {j > 0 && !done && (
            <>
              {/* taxi candidate: short arc from j-1 to j */}
              <path
                d={`M ${sightX(j - 1) + 18} ${Y_SIGHT - 6} Q ${(sightX(j - 1) + sightX(j)) / 2} ${Y_SIGHT - 38} ${sightX(j) - 18} ${Y_SIGHT - 6}`}
                fill="none"
                stroke="#d97706"
                strokeWidth={2}
                strokeDasharray={winner === 'taxi' ? '0' : '5,3'}
                markerEnd="url(#sgt-arrow-taxi)"
              />
              <text
                x={(sightX(j - 1) + sightX(j)) / 2}
                y={Y_SIGHT - 44}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill="#d97706"
              >
                ταξί · +{C[j]}
              </text>

              {/* scooter candidate: long arc from scootFrom to j */}
              {scootFrom !== j - 1 && (
                <>
                  <path
                    d={`M ${sightX(scootFrom) + 18} ${Y_SIGHT + 6} Q ${(sightX(scootFrom) + sightX(j)) / 2} ${Y_SIGHT + 56} ${sightX(j) - 18} ${Y_SIGHT + 6}`}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth={2}
                    strokeDasharray={winner === 'scooter' ? '0' : '5,3'}
                    markerEnd="url(#sgt-arrow-scoot)"
                  />
                  <text
                    x={(sightX(scootFrom) + sightX(j)) / 2}
                    y={Y_SIGHT + 70}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={700}
                    fill="#0284c7"
                  >
                    πατίνι · +{S}
                  </text>
                </>
              )}
            </>
          )}

          {/* final route arrows */}
          {done &&
            SEGMENTS.map((seg, k) => {
              const isSc = seg.kind === 'scooter'
              const y = isSc ? Y_SIGHT + 6 : Y_SIGHT - 6
              const yMid = isSc ? Y_SIGHT + 56 : Y_SIGHT - 38
              return (
                <g key={`seg-${k}`}>
                  <path
                    d={`M ${sightX(seg.from) + 18} ${y} Q ${(sightX(seg.from) + sightX(seg.to)) / 2} ${yMid} ${sightX(seg.to) - 18} ${y}`}
                    fill="none"
                    stroke="#15803d"
                    strokeWidth={2.6}
                    markerEnd="url(#sgt-arrow-final)"
                  />
                </g>
              )
            })}
        </svg>
      </div>

      {/* OPT table */}
      <div className="mt-3 overflow-x-auto">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Πίνακας OPT
        </div>
        <div className="flex gap-1">
          {OPT.map((val, idx) => {
            const known = idx <= filledUpto
            const isCur = idx === j
            const isCand = j > 0 && (idx === j - 1 || idx === scootFrom) && idx !== j
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
              winner === 'taxi' ? 'border-success/50 bg-success/10' : 'border-border bg-bg-soft/50',
            )}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">🚖 Ταξί</div>
            <div className="font-mono text-fg">
              OPT({j - 1}) + c{j} = {OPT[j - 1]} + {C[j]} ={' '}
              <strong>{taxiCand!.val}</strong>
            </div>
          </div>
          <div
            className={cn(
              'rounded-lg border px-3 py-2 text-sm',
              winner === 'scooter' ? 'border-success/50 bg-success/10' : 'border-border bg-bg-soft/50',
            )}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">🛴 Πατίνι από α{scootFrom}</div>
            <div className="font-mono text-fg">
              OPT({scootFrom}) + S = {OPT[scootFrom]} + {S} ={' '}
              <strong>{scootCand!.val}</strong>
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
