'use client'

/**
 * InternetPlanCounter — γιατί η «τοπική σύγκριση» αποτυγχάνει.
 *
 * Front-set-7-ask4: monthly vs annual internet plan. The greedy looks at the
 * next 12 months and picks the cheaper option — but the 12-month commitment
 * carries a memory the greedy can't see. This viz lays out a 13-month horizon
 * (twelve €1s and one €1000) and walks BOTH strategies in lock-step: greedy
 * locks in annual at month 1, then pays €1000 at month 13; the optimum buys
 * one €1 monthly, then switches to annual covering months 2–13. Two running
 * cost columns make the difference visceral. Built for L11.
 */

import { useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'

const PRICES = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1000]
const ANNUAL = 12
const N = PRICES.length // 13

type Action = { kind: 'monthly' | 'annual'; from: number; to: number; cost: number; reason: string }

/** Greedy: month-by-month; pick annual iff C ≤ sum of next 12 months. */
function runGreedy(): Action[] {
  const out: Action[] = []
  let i = 0
  while (i < N) {
    const reachable = i + 12 <= N
    if (!reachable) {
      out.push({
        kind: 'monthly',
        from: i,
        to: i,
        cost: PRICES[i],
        reason: `Μήνας ${i + 1}: δεν χωρά πλήρες ετήσιο πακέτο μέχρι το τέλος, οπότε ο άπληστος αναγκάζεται σε μηνιαίο (€${PRICES[i]}).`,
      })
      i++
      continue
    }
    const next12 = PRICES.slice(i, i + 12).reduce((s, x) => s + x, 0)
    if (ANNUAL > next12) {
      out.push({
        kind: 'monthly',
        from: i,
        to: i,
        cost: PRICES[i],
        reason: `Μήνας ${i + 1}: άθροισμα 12 επόμενων μηνιαίων = €${next12} < €${ANNUAL} ετήσιο, οπότε μηνιαίο.`,
      })
      i++
    } else {
      out.push({
        kind: 'annual',
        from: i,
        to: i + 11,
        cost: ANNUAL,
        reason: `Μήνας ${i + 1}: άθροισμα επόμενων 12 = €${next12} ≥ €${ANNUAL} ετήσιο, οπότε «κλείνει» ετήσιο για τους μήνες ${i + 1}–${i + 12}.`,
      })
      i += 12
    }
  }
  return out
}

/** Optimum (hand-chosen): monthly for month 1, then annual for months 2–13. */
const OPTIMUM: Action[] = [
  {
    kind: 'monthly',
    from: 0,
    to: 0,
    cost: 1,
    reason:
      'Μήνας 1: μηνιαίο (€1) — η βέλτιστη λύση αφήνει τον φτηνό μήνα να μην «κλειδώσει» πρόωρα το ετήσιο.',
  },
  {
    kind: 'annual',
    from: 1,
    to: 12,
    cost: ANNUAL,
    reason:
      'Μήνες 2–13: ετήσιο (€12). Αυτό σκεπάζει και τον φοβερό μήνα 13 με τα €1000 — μέσα στο πάγιο πλέον.',
  },
]

const GREEDY = runGreedy()

type StepInfo = {
  /** index into GREEDY array of the just-executed action (–1 = pre-start) */
  gIdx: number
  oIdx: number
  /** which months are covered up to this step (greedy / optimum) */
  greedyCovered: number
  optCovered: number
  greedyCost: number
  optCost: number
  /** message for this step */
  note: string
}

const STEPS: StepInfo[] = (() => {
  const out: StepInfo[] = []
  out.push({
    gIdx: -1,
    oIdx: -1,
    greedyCovered: 0,
    optCovered: 0,
    greedyCost: 0,
    optCost: 0,
    note: 'Δύο στρατηγικές στον ίδιο 13μηνο ορίζοντα. Στιγμές 1–12: €1 ανά μήνα· στιγμή 13: €1000. Ετήσιο πακέτο = €12 για 12 μήνες. Πάτα «Επόμενο» για να δεις την κάθε επιλογή σε lock-step.',
  })
  // Walk both — emit one step per "action" of greedy.
  const length = Math.max(GREEDY.length, OPTIMUM.length)
  let gCov = 0, oCov = 0, gC = 0, oC = 0
  for (let k = 0; k < length; k++) {
    const g = GREEDY[k]
    const o = OPTIMUM[k]
    if (g) {
      gCov = g.to + 1
      gC += g.cost
    }
    if (o) {
      oCov = o.to + 1
      oC += o.cost
    }
    let note = ''
    if (g) note += `ΑΠΛΗΣΤΟΣ — ${g.reason} `
    if (o) note += `ΒΕΛΤΙΣΤΗ — ${o.reason}`
    out.push({
      gIdx: g ? k : out[out.length - 1].gIdx,
      oIdx: o ? k : out[out.length - 1].oIdx,
      greedyCovered: gCov,
      optCovered: oCov,
      greedyCost: gC,
      optCost: oC,
      note,
    })
  }
  return out
})()

const VIEW_W = 720

export function InternetPlanCounter() {
  const [step, setStep] = useState(0)

  const last = STEPS.length - 1
  const done = step === last
  const cur = STEPS[step]

  // Build per-month panels for greedy + optimum
  const greedyActions = GREEDY.slice(0, cur.gIdx + 1)
  const optActions = OPTIMUM.slice(0, cur.oIdx + 1)

  const PAD_L = 36
  const PAD_R = 16
  const PLOT_W = VIEW_W - PAD_L - PAD_R
  const CELL_W = PLOT_W / N
  const ROW_H = 36
  const ROW_GAP = 14
  const TOP = 22

  const monthLabel = (i: number) => `${i + 1}`

  function renderRow(label: string, actions: Action[], yOffset: number, color: string) {
    return (
      <g transform={`translate(0, ${yOffset})`}>
        <text x={4} y={ROW_H / 2 + 4} fontSize={11} fontWeight={700} fill={color}>
          {label}
        </text>
        {/* month cells */}
        {PRICES.map((_, i) => (
          <rect
            key={`bg-${i}`}
            x={PAD_L + i * CELL_W + 1}
            y={4}
            width={CELL_W - 2}
            height={ROW_H - 8}
            rx={3}
            fill="#fafafa"
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        ))}
        {/* placed actions */}
        {actions.map((a, k) => {
          const left = PAD_L + a.from * CELL_W + 1
          const width = (a.to - a.from + 1) * CELL_W - 2
          const isMonthly = a.kind === 'monthly'
          const fill = isMonthly ? '#fde68a' : color
          const stroke = isMonthly ? '#a16207' : color
          const textFill = isMonthly ? '#1c1214' : '#ffffff'
          return (
            <g key={k}>
              <rect
                x={left}
                y={4}
                width={Math.max(width, 6)}
                height={ROW_H - 8}
                rx={3}
                fill={fill}
                stroke={stroke}
                strokeWidth={1.6}
              />
              <text
                x={left + width / 2}
                y={ROW_H / 2 + 4}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill={textFill}
              >
                {isMonthly ? `€${a.cost}` : `ετήσιο €${ANNUAL}`}
              </text>
            </g>
          )
        })}
      </g>
    )
  }

  const VIEW_H = TOP + 2 * ROW_H + ROW_GAP + 38

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Μηνιαίο vs ετήσιο — το αντιπαράδειγμα
        </div>
        <div className="text-xs text-fg-subtle">
          ορίζοντας 13 μηνών · τιμές [1,1,…,1,1000] · ετήσιο €12
        </div>
      </div>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="mx-auto block w-full max-w-3xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* month axis */}
          <g transform={`translate(0, ${TOP - 14})`}>
            {PRICES.map((p, i) => (
              <g key={i}>
                <text
                  x={PAD_L + i * CELL_W + CELL_W / 2}
                  y={-2}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#9b8a8d"
                  fontWeight={600}
                >
                  μήνας {monthLabel(i)}
                </text>
                <text
                  x={PAD_L + i * CELL_W + CELL_W / 2}
                  y={9}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={700}
                  fill={p >= 100 ? '#dc2626' : '#9b8a8d'}
                >
                  €{p}
                </text>
              </g>
            ))}
          </g>

          {renderRow('ΑΠΛ.', greedyActions, TOP, '#9f1239')}
          {renderRow('ΒΕΛΤ.', optActions, TOP + ROW_H + ROW_GAP, '#0e7490')}
        </svg>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-fg-muted">{cur.note}</p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-rose-200 bg-rose-50/40 p-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold uppercase tracking-wider text-rose-700">
              Άπληστος
            </span>
            <span className="font-mono font-bold text-rose-900">
              €{cur.greedyCost}
            </span>
          </div>
          <span className="text-fg-subtle">
            Καλύπτει μήνες 1–{cur.greedyCovered}/{N}
          </span>
        </div>
        <div className="rounded-lg border border-sky-200 bg-sky-50/40 p-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold uppercase tracking-wider text-sky-700">
              Βέλτιστη
            </span>
            <span className="font-mono font-bold text-sky-900">
              €{cur.optCost}
            </span>
          </div>
          <span className="text-fg-subtle">
            Καλύπτει μήνες 1–{cur.optCovered}/{N}
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
          Βήμα {step} / {last}
        </span>
        {done && (
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-rose-800">
            ✗ €{cur.greedyCost} ≫ €{cur.optCost} — ο άπληστος χάνει
          </span>
        )}
      </div>
    </section>
  )
}
