'use client'

/**
 * GasStationsGreedy — «ο άπληστος μένει μπροστά», ζωντανά.
 *
 * Front-set-6-ask6: shortest set of refuels with a tank that runs n km. The
 * greedy stops at the FURTHEST reachable station each leg. The proof is the
 * "greedy stays ahead" induction: after k stops, gₖ ≥ oₖ. This viz puts the
 * greedy trip on a number line and a competing optimal trip below it, walks
 * leg by leg, and reads off the inequality each step — until the greedy
 * finishes with no more stops than the optimum. Built for L11.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'

const TANK = 8
const STATIONS = [0, 3, 5, 7, 10, 12, 15, 17, 21, 24] // includes start at 0
const DESTINATION = 28

/** Greedy: from current pos, jump to the FURTHEST station within tank range. */
function greedyStops(stations: number[], dest: number, tank: number): number[] {
  const stops: number[] = []
  let cur = stations[0]
  while (cur + tank < dest) {
    let best = cur
    for (const s of stations) {
      if (s > cur && s <= cur + tank) best = s
    }
    if (best === cur) break // unreachable
    cur = best
    stops.push(best)
  }
  return stops
}

/** A valid but sub-greedy "optimal-ish" trip (uses one MORE stop) — built to
 * contrast against the greedy and show gₖ ≥ oₖ at each k. */
function competingStops(): number[] {
  // Hand-picked: this trip stops at 3, 7, 12, 17, 24 — five legs, still valid.
  // Greedy below stops at 7, 15, 21, 24 — four legs. They tie at the destination.
  return [3, 7, 12, 17, 24]
}

const GREEDY = greedyStops(STATIONS, DESTINATION, TANK)
const COMPETING = competingStops()

type StepInfo = {
  kAtThisStep: number // 1-based: after this step, the greedy has done k stops
  gk: number // position of greedy's k-th stop
  ok: number | null // position of competing trip's k-th stop, if it exists
  note: string
}

const STEPS: StepInfo[] = (() => {
  const out: StepInfo[] = []
  const maxLen = Math.max(GREEDY.length, COMPETING.length)
  out.push({
    kAtThisStep: 0,
    gk: 0,
    ok: 0,
    note: 'Και οι δύο διαδρομές ξεκινούν με γεμάτη δεξαμενή. Ο άπληστος (πάνω) ψάχνει τον μακρινότερο σταθμό σε ακτίνα 8 km· μια οποιαδήποτε άλλη βέλτιστη λύση (κάτω) μπορεί να σταματήσει πιο νωρίς.',
  })
  for (let k = 1; k <= maxLen; k++) {
    const gk = GREEDY[k - 1] ?? GREEDY[GREEDY.length - 1]
    const ok = COMPETING[k - 1] ?? null
    let note = ''
    if (k <= GREEDY.length && ok !== null) {
      const ahead = gk >= ok
      note = `Στάση νο. ${k}: ο άπληστος φτάνει στο km ${gk}, η άλλη λύση στο km ${ok}. ${ahead ? `Άρα g${sub(k)} ≥ o${sub(k)} ✓ — «ο άπληστος μένει μπροστά».` : 'Παραβίαση: αυτό δεν συμβαίνει με τον σωστό κανόνα.'}`
    } else if (k > GREEDY.length && ok !== null) {
      note = `Ο άπληστος έχει ήδη τερματίσει — η άλλη λύση χρειάζεται ακόμα στάση στο km ${ok}. Αυτό αποδεικνύει ότι ο άπληστος χρησιμοποιεί ΛΙΓΟΤΕΡΕΣ ή ΙΣΕΣ στάσεις.`
    } else if (ok === null && k <= GREEDY.length) {
      note = `Στάση νο. ${k} του άπληστου στο km ${gk}.`
    } else {
      note = `Και οι δύο διαδρομές έχουν τελειώσει.`
    }
    out.push({ kAtThisStep: k, gk, ok, note })
  }
  return out
})()

function sub(n: number): string {
  const SUBS = '₀₁₂₃₄₅₆₇₈₉'
  return n
    .toString()
    .split('')
    .map((d) => SUBS[+d])
    .join('')
}

const VIEW_W = 700
const PAD_L = 30
const PAD_R = 30

export function GasStationsGreedy() {
  const [step, setStep] = useState(0)

  const last = STEPS.length - 1
  const done = step === last
  const cur = STEPS[step]

  // X scale: positions in [0, DESTINATION]
  const PLOT_W = VIEW_W - PAD_L - PAD_R
  const X = (p: number) => PAD_L + (p / DESTINATION) * PLOT_W

  const greedyDoneStops = useMemo(() => GREEDY.slice(0, cur.kAtThisStep), [cur.kAtThisStep])
  const competingDoneStops = useMemo(() => {
    if (cur.kAtThisStep === 0) return [] as number[]
    return COMPETING.slice(0, Math.min(cur.kAtThisStep, COMPETING.length))
  }, [cur.kAtThisStep])

  const VIEW_H = 200

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Ελάχιστες στάσεις ανεφοδιασμού — «ο άπληστος μένει μπροστά»
        </div>
        <div className="text-xs text-fg-subtle">
          τετράμπαρο = {TANK} km · προορισμός = {DESTINATION} km
        </div>
      </div>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="mx-auto block w-full max-w-3xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* shared road */}
          <line x1={X(0)} y1={50} x2={X(DESTINATION)} y2={50} stroke="#cbd5e1" strokeWidth={2.5} />
          <line x1={X(0)} y1={140} x2={X(DESTINATION)} y2={140} stroke="#cbd5e1" strokeWidth={2.5} />

          {/* row labels */}
          <text x={4} y={54} fontSize={11} fontWeight={700} fill="#9f1239">
            ΑΠΛ
          </text>
          <text x={4} y={144} fontSize={11} fontWeight={700} fill="#0e7490">
            ΑΛ
          </text>

          {/* all candidate stations (ticks) */}
          {STATIONS.slice(1).map((s) => (
            <g key={`tk-${s}`}>
              <line x1={X(s)} y1={42} x2={X(s)} y2={58} stroke="#cbd5e1" strokeWidth={1.5} />
              <line x1={X(s)} y1={132} x2={X(s)} y2={148} stroke="#cbd5e1" strokeWidth={1.5} />
              <text x={X(s)} y={32} textAnchor="middle" fontSize={9} fill="#9b8a8d">
                {s}
              </text>
              <text x={X(s)} y={166} textAnchor="middle" fontSize={9} fill="#9b8a8d">
                {s}
              </text>
            </g>
          ))}
          {/* destination */}
          <g>
            <line x1={X(DESTINATION)} y1={40} x2={X(DESTINATION)} y2={150} stroke="#16a34a" strokeWidth={2} strokeDasharray="3 3" />
            <text x={X(DESTINATION)} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="#15803d">
              προορισμός
            </text>
          </g>
          {/* start */}
          <g>
            <circle cx={X(0)} cy={50} r={5} fill="#0ea5e9" stroke="#0c4a6e" strokeWidth={1.5} />
            <circle cx={X(0)} cy={140} r={5} fill="#0ea5e9" stroke="#0c4a6e" strokeWidth={1.5} />
            <text x={X(0)} y={186} textAnchor="middle" fontSize={9} fill="#9b8a8d">
              0
            </text>
          </g>

          {/* greedy stops (done) */}
          {greedyDoneStops.map((s, k) => (
            <g key={`g-${s}`}>
              <circle cx={X(s)} cy={50} r={7} fill="#f43f5e" stroke="#9f1239" strokeWidth={2} />
              <text x={X(s)} y={54} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ffffff">
                {k + 1}
              </text>
            </g>
          ))}
          {/* greedy: connecting arc up to last stop or destination */}
          {greedyDoneStops.length > 0 && (
            <polyline
              points={[0, ...greedyDoneStops].map((s) => `${X(s)},50`).join(' ') + ` ${X(DESTINATION)},50`}
              fill="none"
              stroke="#9f1239"
              strokeWidth={2}
              strokeDasharray="3 3"
            />
          )}

          {/* competing stops (done) */}
          {competingDoneStops.map((s, k) => (
            <g key={`c-${s}`}>
              <circle cx={X(s)} cy={140} r={7} fill="#0ea5e9" stroke="#0c4a6e" strokeWidth={2} />
              <text x={X(s)} y={144} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ffffff">
                {k + 1}
              </text>
            </g>
          ))}
          {competingDoneStops.length > 0 && (
            <polyline
              points={[0, ...competingDoneStops].map((s) => `${X(s)},140`).join(' ') + ` ${X(DESTINATION)},140`}
              fill="none"
              stroke="#0c4a6e"
              strokeWidth={2}
              strokeDasharray="3 3"
            />
          )}

          {/* inequality marker between gₖ and oₖ */}
          {cur.kAtThisStep > 0 && cur.ok !== null && (
            <g>
              {/* dashed vertical comparing positions */}
              <line x1={X(cur.gk)} y1={50} x2={X(cur.gk)} y2={66} stroke="#9f1239" strokeWidth={1.2} />
              <line x1={X(cur.ok)} y1={124} x2={X(cur.ok)} y2={140} stroke="#0c4a6e" strokeWidth={1.2} />
              {/* span connector */}
              <path
                d={`M ${X(Math.min(cur.gk, cur.ok))} 95 L ${X(Math.max(cur.gk, cur.ok))} 95`}
                stroke="#a16207"
                strokeWidth={1.5}
              />
              <text
                x={(X(cur.gk) + X(cur.ok)) / 2}
                y={88}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill="#a16207"
              >
                g{sub(cur.kAtThisStep)} ≥ o{sub(cur.kAtThisStep)} ✓
              </text>
            </g>
          )}
        </svg>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-fg-muted">{cur.note}</p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-rose-200 bg-rose-50/40 p-2 text-xs">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-semibold uppercase tracking-wider text-rose-700">
              Άπληστος
            </span>
            <span className="font-mono text-rose-900">
              {greedyDoneStops.length} στάσ
              {greedyDoneStops.length === 1 ? 'η' : 'εις'}
            </span>
          </div>
          <span className="font-mono">
            [{[0, ...greedyDoneStops, DESTINATION].join(' → ')}]
          </span>
        </div>
        <div className="rounded-lg border border-sky-200 bg-sky-50/40 p-2 text-xs">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-semibold uppercase tracking-wider text-sky-700">
              Άλλη λύση
            </span>
            <span className="font-mono text-sky-900">
              {competingDoneStops.length} στάσ
              {competingDoneStops.length === 1 ? 'η' : 'εις'}
            </span>
          </div>
          <span className="font-mono">
            [{[0, ...competingDoneStops, DESTINATION].join(' → ')}]
          </span>
        </div>
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
          k = {cur.kAtThisStep} / {STEPS.length - 1}
        </span>
        {done && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            ✓ {GREEDY.length} ≤ {COMPETING.length} — ο άπληστος βέλτιστος
          </span>
        )}
      </div>
    </section>
  )
}
