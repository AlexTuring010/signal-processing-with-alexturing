'use client'

/**
 * LaundryFlowShop — δύο φάσεις, μία στενωπός, ένα κριτήριο που μετράει.
 *
 * Για το front-set-6-ask4 (καθαριστήριο/πλυντήριο): ο Γιώργος ελέγχει ένα
 * ρούχο τη φορά (σειριακά — στενωπός sᵢ), και μετά το ρούχο πλένεται +
 * στεγνώνει σε δικό του μηχάνημα (παράλληλα — pᵢ). Το makespan είναι ο
 * χρόνος που τελειώνει η ΤΕΛΕΥΤΑΙΑ πλύση: max_i ( Σ_{j ≤ i} s_j + p_i ).
 *
 * Three tabs, ΙΔΙΑ είσοδος 5 ρούχων (s,p):
 *   1) «Φθίνον p (βέλτιστο)»  — LPT στη στενωπό· η πιο μακριά πλύση ξεκινά νωρίς
 *   2) «Αύξον p (κακό)»       — SPT στη στενωπό· η μεγάλη πλύση φεύγει στο τέλος
 *   3) «Φθίνον s (παγίδα)»    — διαλέγει τους πιο αργούς ελέγχους πρώτα: αδιάφορο
 *
 * Κάθε tab δείχνει:
 *   • Top row: ένας σειριακός σταθμός με τα 5 μπλοκ ελέγχου σε σειρά (πλάτος ∝ s)
 *   • Below: 5 σειρές παράλληλων πλύσεων· κάθε μία ξεκινά αμέσως μετά τη λήξη
 *     του δικού της ελέγχου, διαρκεί p
 *   • Vertical line + chip στο makespan
 *   • Chip βάζει στη συνολική κατάταξη: ίδιο makespan ή χειρότερο από το βέλτιστο
 *
 * Built for L12 — Phase D, front-set-6-ask4.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'

type Item = { id: string; s: number; p: number }

const ITEMS: Item[] = [
  { id: 'A', s: 3, p: 8 },
  { id: 'B', s: 2, p: 5 },
  { id: 'C', s: 4, p: 10 },
  { id: 'D', s: 1, p: 12 },
  { id: 'E', s: 3, p: 4 },
]

type Tab = 'lpt' | 'spt' | 'long-s'

const TABS: { id: Tab; label: string; verdict: 'opt' | 'bad' | 'mid'; rule: string }[] = [
  {
    id: 'lpt',
    label: 'Φθίνον p — βέλτιστο',
    verdict: 'opt',
    rule: 'Σειρά ελέγχου με φθίνον p (longest parallel time first) — η μεγαλύτερη πλύση ξεκινάει πρώτη και «τρέχει στο παρασκήνιο» όσο γίνονται οι μικρότερες.',
  },
  {
    id: 'spt',
    label: 'Αύξον p — κακό',
    verdict: 'bad',
    rule: 'Σειρά ελέγχου με αύξον p (shortest parallel time first) — η μεγαλύτερη πλύση μένει για το τέλος και «κρέμεται» μόνη της μετά τον τελευταίο έλεγχο.',
  },
  {
    id: 'long-s',
    label: 'Φθίνον s — παγίδα',
    verdict: 'mid',
    rule: 'Σειρά ελέγχου με φθίνον s (μεγαλύτεροι έλεγχοι πρώτα). Μοιάζει «εύλογο» (γρήγορα ξεμπέρδευε τη στενωπό από τους αργούς), αλλά αγνοεί ποια πλύση κινδυνεύει να ξεμείνει.',
  },
]

function orderFor(tab: Tab): Item[] {
  if (tab === 'lpt') return [...ITEMS].sort((a, b) => b.p - a.p || a.id.localeCompare(b.id))
  if (tab === 'spt') return [...ITEMS].sort((a, b) => a.p - b.p || a.id.localeCompare(b.id))
  return [...ITEMS].sort((a, b) => b.s - a.s || a.id.localeCompare(b.id))
}

function schedule(order: Item[]) {
  let t = 0
  return order.map((item) => {
    const checkStart = t
    const checkEnd = t + item.s
    t = checkEnd
    return {
      ...item,
      checkStart,
      checkEnd,
      washStart: checkEnd,
      washEnd: checkEnd + item.p,
    }
  })
}

function makespan(placed: ReturnType<typeof schedule>): number {
  return placed.reduce((m, p) => Math.max(m, p.washEnd), 0)
}

const COLOR: Record<string, string> = {
  A: '#60a5fa',
  B: '#a78bfa',
  C: '#34d399',
  D: '#fb923c',
  E: '#f87171',
}

const OPT_MAKESPAN = makespan(schedule(orderFor('lpt')))

export function LaundryFlowShop() {
  const [tab, setTab] = useState<Tab>('lpt')

  const order = orderFor(tab)
  const placed = schedule(order)
  const ms = makespan(placed)
  const tabMeta = TABS.find((t) => t.id === tab)!

  // Pixel scale: 1 time unit = 24 px, but cap at a reasonable width
  const UNIT = 24
  const totalWidth = Math.max(ms, OPT_MAKESPAN) * UNIT
  const rowHeight = 28
  const checkRowY = 6

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Χρονοπρογραμματισμός καθαριστηρίου — έλεγχος (σειριακά) + πλύση (παράλληλα)
        </div>
        <div className="flex flex-wrap gap-1 rounded-md border border-border p-0.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'rounded px-2 py-1 text-xs font-medium transition-colors',
                tab === t.id
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* item table */}
      <div className="mb-3 overflow-x-auto rounded-lg border border-border bg-bg-soft/30 p-2">
        <table className="w-full text-xs">
          <thead className="text-fg-subtle">
            <tr className="text-left">
              <th className="px-2 py-1 font-semibold">Ρούχο</th>
              <th className="px-2 py-1 font-semibold">s (έλεγχος)</th>
              <th className="px-2 py-1 font-semibold">p (πλύση)</th>
              <th className="px-2 py-1 font-semibold">Σειρά εδώ</th>
              <th className="px-2 py-1 font-semibold">Έλεγχος [start→end]</th>
              <th className="px-2 py-1 font-semibold">Πλύση [start→end]</th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((it) => {
              const p = placed.find((x) => x.id === it.id)!
              const pos = placed.findIndex((x) => x.id === it.id) + 1
              const isBottleneck = p.washEnd === ms
              return (
                <tr key={it.id} className="border-t border-border/40">
                  <td className="px-2 py-1">
                    <span
                      className="inline-block h-3 w-3 rounded mr-1.5 align-middle"
                      style={{ backgroundColor: COLOR[it.id] }}
                    />
                    <span className="font-mono font-semibold">{it.id}</span>
                  </td>
                  <td className="px-2 py-1 font-mono">{it.s}</td>
                  <td className="px-2 py-1 font-mono">{it.p}</td>
                  <td className="px-2 py-1 font-mono">{pos}</td>
                  <td className="px-2 py-1 font-mono">
                    {p.checkStart} → {p.checkEnd}
                  </td>
                  <td
                    className={cn(
                      'px-2 py-1 font-mono',
                      isBottleneck && 'rounded bg-amber-100 font-bold text-amber-800',
                    )}
                  >
                    {p.washStart} → {p.washEnd}
                    {isBottleneck && ' ← makespan'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Gantt chart */}
      <div className="overflow-x-auto rounded-lg border border-border bg-bg-soft/40 p-3">
        <svg
          width={totalWidth + 60}
          height={(placed.length + 1) * rowHeight + 40}
          className="block"
          aria-label="Gantt chart"
        >
          {/* time ruler */}
          <g>
            {Array.from(
              { length: Math.ceil((Math.max(ms, OPT_MAKESPAN) + 1) / 2) },
              (_, i) => i * 2,
            ).map((t) => (
              <g key={t}>
                <line
                  x1={50 + t * UNIT}
                  y1={4}
                  x2={50 + t * UNIT}
                  y2={(placed.length + 1) * rowHeight + 20}
                  stroke="#e2e8f0"
                  strokeWidth={t % 10 === 0 ? 1 : 0.5}
                />
                <text
                  x={50 + t * UNIT}
                  y={(placed.length + 1) * rowHeight + 32}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#64748b"
                >
                  {t}
                </text>
              </g>
            ))}
            {/* makespan marker */}
            <line
              x1={50 + ms * UNIT}
              y1={4}
              x2={50 + ms * UNIT}
              y2={(placed.length + 1) * rowHeight + 20}
              stroke={tabMeta.verdict === 'opt' ? '#10b981' : '#dc2626'}
              strokeWidth={1.6}
              strokeDasharray="4 3"
            />
            <text
              x={50 + ms * UNIT}
              y={2}
              textAnchor="middle"
              fontSize="9"
              fontWeight={700}
              fill={tabMeta.verdict === 'opt' ? '#047857' : '#b91c1c'}
            >
              makespan {ms}
            </text>
          </g>

          {/* serial check row */}
          <g transform={`translate(0, ${checkRowY + 10})`}>
            <text x={4} y={rowHeight / 2 + 4} fontSize="10" fontWeight={600} fill="#475569">
              Έλεγχος
            </text>
            {placed.map((p, i) => (
              <g key={`c-${p.id}-${i}`}>
                <rect
                  x={50 + p.checkStart * UNIT}
                  y={2}
                  width={p.s * UNIT}
                  height={rowHeight - 6}
                  rx={3}
                  fill={COLOR[p.id]}
                  fillOpacity={0.75}
                  stroke={COLOR[p.id]}
                />
                <text
                  x={50 + p.checkStart * UNIT + (p.s * UNIT) / 2}
                  y={rowHeight / 2 + 3}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight={600}
                  fill="#fff"
                >
                  {p.id}
                </text>
              </g>
            ))}
          </g>

          {/* parallel wash rows, one per job */}
          {placed.map((p, i) => (
            <g
              key={`w-${p.id}-${i}`}
              transform={`translate(0, ${checkRowY + 10 + rowHeight + i * rowHeight})`}
            >
              <text
                x={4}
                y={rowHeight / 2 + 4}
                fontSize="10"
                fontWeight={600}
                fill="#475569"
              >
                {p.id} πλύση
              </text>
              {/* full wash bar */}
              <rect
                x={50 + p.washStart * UNIT}
                y={2}
                width={p.p * UNIT}
                height={rowHeight - 6}
                rx={3}
                fill={COLOR[p.id]}
                fillOpacity={p.washEnd === ms ? 0.95 : 0.4}
                stroke={COLOR[p.id]}
              />
              <text
                x={50 + p.washStart * UNIT + (p.p * UNIT) / 2}
                y={rowHeight / 2 + 3}
                textAnchor="middle"
                fontSize="10"
                fontWeight={500}
                fill="#fff"
              >
                p = {p.p}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* verdict + rule explanation */}
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <div className="md:col-span-2 rounded-lg border border-border bg-bg-soft/30 px-3 py-2.5 text-xs leading-relaxed text-fg-muted">
          <strong className="text-fg">{tabMeta.label}.</strong> {tabMeta.rule}
        </div>
        <div
          className={cn(
            'rounded-lg border px-3 py-2.5 text-xs',
            tabMeta.verdict === 'opt' && 'border-emerald-300 bg-emerald-50 text-emerald-900',
            tabMeta.verdict === 'bad' && 'border-rose-300 bg-rose-50 text-rose-900',
            tabMeta.verdict === 'mid' && 'border-amber-300 bg-amber-50 text-amber-900',
          )}
        >
          <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
            Makespan
          </div>
          <div className="mt-1 font-mono text-base font-bold">{ms}</div>
          {tab !== 'lpt' && (
            <div className="mt-1 text-[11px]">
              βέλτιστο = {OPT_MAKESPAN} ·{' '}
              <strong>+{ms - OPT_MAKESPAN}</strong> χαμένος χρόνος
            </div>
          )}
          {tab === 'lpt' && (
            <div className="mt-1 text-[11px]">βέλτιστο — δεν γίνεται καλύτερα</div>
          )}
        </div>
      </div>
    </section>
  )
}
