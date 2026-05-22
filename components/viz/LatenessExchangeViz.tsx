'use client'

/**
 * LatenessExchangeViz — the exchange argument for minimum maximum lateness,
 * made operable.
 *
 * The schedule starts SCRAMBLED (jobs out of deadline order). Job ids are the
 * deadline ranks: 1 has the earliest deadline, 4 the latest, so the goal — the
 * EDF schedule — is literally the sorted order 1·2·3·4. Every ⇄ marks two
 * adjacent jobs whose deadlines are out of order: an inversion. Click it and
 * the two jobs swap. Each swap removes exactly one inversion, and the proof
 * panel shows — with the live numbers — why the maximum lateness L can never
 * rise: the earlier-deadline job moves up (finishes no later), the
 * later-deadline job slides into its old finish time but has a roomier
 * deadline. Keep clicking until the schedule is sorted and L has never gone
 * up — that is the whole optimality proof. Built for L12.
 */

import { useState } from 'react'
import { RotateCcw, ArrowLeftRight } from 'lucide-react'

const T: Record<number, number> = { 1: 2, 2: 3, 3: 2, 4: 3 }
const D: Record<number, number> = { 1: 3, 2: 5, 3: 6, 4: 8 }
const START = [3, 1, 4, 2]
const TOTAL = 10 // Σ tⱼ — the last job always finishes here

type Placed = { id: number; s: number; f: number; lateness: number }

function schedule(order: number[]): Placed[] {
  let t = 0
  return order.map((id) => {
    const s = t
    const f = t + T[id]
    t = f
    return { id, s, f, lateness: Math.max(0, f - D[id]) }
  })
}

const maxL = (order: number[]) =>
  schedule(order).reduce((m, p) => Math.max(m, p.lateness), 0)

const inversions = (order: number[]) => {
  let n = 0
  for (let i = 0; i < order.length; i++)
    for (let j = i + 1; j < order.length; j++)
      if (order[i] > order[j]) n++
  return n
}

/** positions k where order[k], order[k+1] are an inversion (adjacent) */
const adjInversions = (order: number[]) => {
  const out: number[] = []
  for (let k = 0; k < order.length - 1; k++)
    if (order[k] > order[k + 1]) out.push(k)
  return out
}

type SwapInfo = {
  jBig: number // later-deadline job (was first)
  iSmall: number // earlier-deadline job (was second)
  fiBefore: number
  fiAfter: number
  fjAfter: number
  liBefore: number
  liAfter: number
  ljAfter: number
  lBefore: number
  lAfter: number
}

const VIEW_W = 620
const PAD_L = 54
const PAD_R = 66
const PLOT_W = VIEW_W - PAD_L - PAD_R
const TOP = 16
const ROW_H = 46
const AXIS_H = 30
const VIEW_H = TOP + 4 * ROW_H + AXIS_H

const X = (t: number) => PAD_L + (t / TOTAL) * PLOT_W

export function LatenessExchangeViz() {
  const [order, setOrder] = useState<number[]>(START)
  const [lastSwap, setLastSwap] = useState<SwapInfo | null>(null)

  const placed = schedule(order)
  const inv = inversions(order)
  const adj = adjInversions(order)
  const L = maxL(order)
  const solved = inv === 0

  function doSwap(k: number) {
    const before = schedule(order)
    const lBefore = before.reduce((m, p) => Math.max(m, p.lateness), 0)
    const jBig = order[k]
    const iSmall = order[k + 1]
    const fiBefore = before[k + 1].f

    const next = [...order]
    ;[next[k], next[k + 1]] = [next[k + 1], next[k]]
    const after = schedule(next)
    const lAfter = after.reduce((m, p) => Math.max(m, p.lateness), 0)

    setLastSwap({
      jBig,
      iSmall,
      fiBefore,
      fiAfter: after[k].f,
      fjAfter: after[k + 1].f,
      liBefore: Math.max(0, fiBefore - D[iSmall]),
      liAfter: Math.max(0, after[k].f - D[iSmall]),
      ljAfter: Math.max(0, after[k + 1].f - D[jBig]),
      lBefore,
      lAfter,
    })
    setOrder(next)
  }

  function reset() {
    setOrder(START)
    setLastSwap(null)
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Επιχείρημα ανταλλαγής — αντιμετάθεσε τις αντιστροφές
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {solved ? 'Ταξινομημένο' : `${inv} ${inv === 1 ? 'αντιστροφή' : 'αντιστροφές'}`}
        </span>
      </div>
      <p className="mb-2 text-xs text-fg-subtle">
        Ο αριθμός κάθε εργασίας είναι η κατάταξή της κατά προθεσμία — στόχος η
        σειρά <span className="font-semibold text-fg">1·2·3·4</span> (η λύση του
        EDF). Κάνε κλικ σε ένα{' '}
        <span className="font-semibold text-amber-700">⇄</span> για να
        αντιμεταθέσεις δύο διαδοχικές εργασίες εκτός σειράς.
      </p>

      {/* canvas */}
      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="mx-auto block w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* highlight band behind each inverted adjacent pair */}
          {adj.map((k) => (
            <rect
              key={`hl${k}`}
              x={PAD_L - 6}
              y={TOP + k * ROW_H + 6}
              width={PLOT_W + 12}
              height={2 * ROW_H - 12}
              rx={8}
              fill="#f59e0b"
              fillOpacity={0.12}
            />
          ))}

          {/* rows */}
          {placed.map((p, i) => {
            const rowTop = TOP + i * ROW_H
            const barY = rowTop + 15
            const barH = 22
            const x0 = X(p.s)
            const x1 = X(p.f)
            const xd = X(D[p.id])
            const late = p.lateness > 0
            const withinEnd = Math.max(x0, Math.min(xd, x1))
            const overStart = Math.max(x0, xd)

            return (
              <g key={`r${i}`}>
                {/* the scheduled block */}
                {late ? (
                  <>
                    {withinEnd > x0 && (
                      <rect
                        x={x0}
                        y={barY}
                        width={withinEnd - x0}
                        height={barH}
                        rx={3}
                        fill="#fef3c7"
                        stroke="#e0b97a"
                        strokeWidth={1.6}
                      />
                    )}
                    <rect
                      x={overStart}
                      y={barY}
                      width={Math.max(x1 - overStart, 3)}
                      height={barH}
                      rx={3}
                      fill="#f87171"
                      stroke="#dc2626"
                      strokeWidth={1.8}
                    />
                  </>
                ) : (
                  <rect
                    x={x0}
                    y={barY}
                    width={Math.max(x1 - x0, 3)}
                    height={barH}
                    rx={4}
                    fill="#86efac"
                    stroke="#22c55e"
                    strokeWidth={2}
                  />
                )}

                {/* job id inside the block */}
                <text
                  x={(x0 + x1) / 2}
                  y={barY + barH / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={14}
                  fontWeight={800}
                  fill="#1c1214"
                >
                  {p.id}
                </text>

                {/* deadline marker */}
                <line
                  x1={xd}
                  y1={rowTop + 11}
                  x2={xd}
                  y2={rowTop + ROW_H - 4}
                  stroke="#d97706"
                  strokeWidth={1.8}
                  strokeDasharray="3 2.5"
                />
                <path
                  d={`M ${xd - 4.5} ${rowTop + 5} L ${xd + 4.5} ${rowTop + 5} L ${xd} ${rowTop + 12} Z`}
                  fill="#d97706"
                />
                <text
                  x={Math.min(Math.max(xd, PAD_L + 12), VIEW_W - PAD_R - 12)}
                  y={rowTop + 3}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={700}
                  fill="#b45309"
                >
                  d={D[p.id]}
                </text>

                {/* lateness readout */}
                <text
                  x={VIEW_W - PAD_R + 33}
                  y={rowTop + ROW_H / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={12}
                  fontWeight={700}
                  fill={late ? '#dc2626' : '#9b8a8d'}
                >
                  ℓ={p.lateness}
                </text>
              </g>
            )
          })}

          {/* swap controls — one per adjacent inversion */}
          {adj.map((k) => {
            const cy = TOP + (k + 1) * ROW_H
            return (
              <g
                key={`sw${k}`}
                role="button"
                tabIndex={0}
                aria-label={`Αντιμετάθεσε τις εργασίες ${order[k]} και ${order[k + 1]}`}
                onClick={() => doSwap(k)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    doSwap(k)
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <circle cx={27} cy={cy} r={13} fill="#fde68a" stroke="#d97706" strokeWidth={2} />
                <text
                  x={27}
                  y={cy + 0.5}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={15}
                  fontWeight={800}
                  fill="#92400e"
                >
                  ⇄
                </text>
              </g>
            )
          })}

          {/* time axis */}
          <line
            x1={X(0)}
            y1={VIEW_H - AXIS_H + 10}
            x2={X(TOTAL)}
            y2={VIEW_H - AXIS_H + 10}
            stroke="#cdbfc0"
            strokeWidth={1.5}
          />
          {Array.from({ length: TOTAL + 1 }, (_, t) => t).map((t) => (
            <g key={t}>
              <line
                x1={X(t)}
                y1={VIEW_H - AXIS_H + 7}
                x2={X(t)}
                y2={VIEW_H - AXIS_H + 13}
                stroke="#cdbfc0"
                strokeWidth={1}
              />
              <text
                x={X(t)}
                y={VIEW_H - AXIS_H + 25}
                textAnchor="middle"
                fontSize={9}
                fontWeight={600}
                fill="#9b8a8d"
              >
                {t}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* readout */}
      <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Μέγιστη καθυστέρηση L
        </span>
        <span className="font-mono text-2xl font-bold tabular-nums text-fg">
          {L}
        </span>
        <span className="text-sm text-fg-muted">
          · αντιστροφές: <span className="font-mono font-bold text-fg">{inv}</span>
        </span>
        {solved && (
          <span className="ml-auto rounded-md bg-success/15 px-2 py-0.5 text-sm font-bold text-success">
            ✓ σειρά EDF
          </span>
        )}
      </div>

      {/* proof panel */}
      <div
        aria-live="polite"
        className="mt-2 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5 text-sm leading-relaxed text-fg-muted"
      >
        {solved ? (
          <p>
            <span className="font-semibold text-fg">
              Καμία αντιστροφή — η σειρά είναι 1·2·3·4, ακριβώς η λύση του EDF.
            </span>{' '}
            Σε κάθε ανταλλαγή η μέγιστη καθυστέρηση L δεν ανέβηκε ποτέ. Άρα:
            ξεκινώντας από <em>οποιοδήποτε</em> χρονοδιάγραμμα, καταλήγουμε στο
            EDF χωρίς να χειροτερέψουμε το L — δηλαδή η λύση του EDF είναι
            βέλτιστη. Αυτό ακριβώς είναι το επιχείρημα ανταλλαγής.
          </p>
        ) : !lastSwap ? (
          <p>
            Κάθε <span className="font-semibold text-amber-700">⇄</span> δείχνει
            μια <span className="font-semibold text-fg">αντιστροφή</span>: δύο
            διαδοχικές εργασίες όπου η πρώτη έχει <em>μεγαλύτερη</em> προθεσμία
            από τη δεύτερη. Κάνε κλικ σε ένα ⇄ και παρακολούθησε το L — δεν
            πρόκειται ποτέ να ανέβει.
          </p>
        ) : (
          <div className="space-y-1.5">
            <p className="font-semibold text-fg">
              Ανταλλαγή: εργασία {lastSwap.jBig} ↔ εργασία {lastSwap.iSmall}
            </p>
            <p>
              Η {lastSwap.iSmall} έχει προθεσμία d={D[lastSwap.iSmall]}, πιο
              κοντινή από την d={D[lastSwap.jBig]} της {lastSwap.jBig} — ήταν
              αντιστροφή· τώρα μπήκαν στη σωστή σειρά.
            </p>
            <p>
              <span className="font-semibold text-fg">Η {lastSwap.iSmall} πάει νωρίτερα:</span>{' '}
              τελειώνει στο {lastSwap.fiAfter} αντί για {lastSwap.fiBefore} — όχι
              αργότερα. Άρα η καθυστέρησή της δεν μεγαλώνει:{' '}
              <span className="font-mono">ℓ′ = {lastSwap.liAfter} ≤ {lastSwap.liBefore}</span>.
            </p>
            <p>
              <span className="font-semibold text-fg">Η {lastSwap.jBig} πάει αργότερα:</span>{' '}
              τελειώνει στο {lastSwap.fjAfter} — ακριβώς εκεί που τελείωνε πριν η{' '}
              {lastSwap.iSmall}. Αλλά έχει πιο χαλαρή προθεσμία, άρα καθυστερεί το
              πολύ όσο καθυστερούσε η {lastSwap.iSmall}:{' '}
              <span className="font-mono">ℓ′ = {lastSwap.ljAfter} ≤ {lastSwap.liBefore}</span>.
            </p>
            <p className="font-semibold text-fg">
              Καμία άλλη εργασία δεν κουνήθηκε —{' '}
              {lastSwap.lAfter < lastSwap.lBefore
                ? `και η μέγιστη καθυστέρηση έπεσε: L = ${lastSwap.lBefore} → ${lastSwap.lAfter}.`
                : `και η μέγιστη καθυστέρηση δεν άλλαξε: L = ${lastSwap.lAfter}.`}
            </p>
          </div>
        )}
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-subtle">
          <ArrowLeftRight className="h-4 w-4 text-amber-600" aria-hidden="true" />
          {solved
            ? 'Τέλος — η σειρά είναι ταξινομημένη.'
            : 'Κάνε κλικ σε ένα ⇄ στο διάγραμμα.'}
        </span>
        <button
          type="button"
          onClick={reset}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Από την αρχή
        </button>
      </div>
    </section>
  )
}
