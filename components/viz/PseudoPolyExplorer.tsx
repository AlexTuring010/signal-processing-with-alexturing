'use client'

/**
 * PseudoPolyExplorer — why Θ(n·W) is NOT a polynomial-time algorithm.
 *
 * The trap students fall into: «n·W has no exponents, so it must be
 * polynomial». The fix is to see that W is a NUMBER in the input, and a
 * number of value W is written with only ⌈log₂W⌉ bits. So the real input
 * size grows like log W, while the running time grows like W.
 *
 * The viz builds a doubling ladder: every time you double W, the input gains
 * exactly ONE bit, but the running time DOUBLES. Watch the bit-boxes creep up
 * by one while the runtime bars explode. That gap is the whole meaning of
 * «pseudo-polynomial». Built for L15.
 */

import { useState } from 'react'
import { RotateCcw, Plus, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

const N_ITEMS = 4 // the 4 items of the lecture's knapsack instance
const BASE_W = 8
const MAX_D = 7

type Row = { d: number; W: number; bits: number; bin: string; runtime: number }

function buildRow(d: number): Row {
  const W = BASE_W * 2 ** d
  const bin = W.toString(2)
  return { d, W, bits: bin.length, bin, runtime: N_ITEMS * W }
}

export function PseudoPolyExplorer() {
  const [d, setD] = useState(0)

  const rows: Row[] = Array.from({ length: d + 1 }, (_, k) => buildRow(k))
  const top = rows[d]
  const first = rows[0]
  const maxRuntime = top.runtime

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Ο χρόνος n·W — πολυωνυμικός ή όχι;
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          n = {N_ITEMS} αντικείμενα
        </span>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-fg-subtle">
        Κάθε διπλασιασμός του W προσθέτει <strong>ένα</strong> δυφίο στην
        είσοδο — αλλά <strong>διπλασιάζει</strong> τον χρόνο n·W. Δες το χάσμα.
      </p>

      {/* current top readout */}
      <div className="mb-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2 text-center">
          <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-fg-subtle">
            Τιμή W
          </div>
          <div className="font-mono text-xl font-bold tabular-nums text-fg">
            {top.W}
          </div>
        </div>
        <div className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2 text-center">
          <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-fg-subtle">
            Δυφία (μέγεθος)
          </div>
          <div className="font-mono text-xl font-bold tabular-nums text-fg">
            {top.bits}
          </div>
        </div>
        <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-center">
          <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-fg-subtle">
            Χρόνος n·W
          </div>
          <div className="font-mono text-xl font-bold tabular-nums text-fg">
            {top.runtime}
          </div>
        </div>
      </div>

      {/* the doubling ladder */}
      <div className="overflow-x-auto">
        <div className="min-w-[22rem]">
          <div className="mb-1 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-wider text-fg-subtle">
            <span className="w-[5.5rem] shrink-0">W</span>
            <span className="w-[7rem] shrink-0">Δυφία εισόδου</span>
            <span className="flex-1">Χρόνος εκτέλεσης</span>
          </div>
          {rows.map((r) => {
            const isTop = r.d === d
            return (
              <div
                key={r.d}
                className={cn(
                  'flex items-center gap-2 rounded py-1',
                  isTop && 'bg-accent/5',
                )}
              >
                <span className="w-[5.5rem] shrink-0 font-mono text-xs font-bold text-fg">
                  W = {r.W}
                </span>
                {/* input: one box per bit */}
                <span className="flex w-[7rem] shrink-0 gap-0.5">
                  {r.bin.split('').map((c, i) => (
                    <span
                      key={i}
                      className={cn(
                        'h-3.5 w-2 rounded-[2px] border',
                        c === '1'
                          ? 'border-sky-500/70 bg-sky-500/60'
                          : 'border-sky-500/40 bg-transparent',
                      )}
                    />
                  ))}
                </span>
                {/* runtime: a bar that doubles each row */}
                <span className="flex flex-1 items-center gap-1.5">
                  <span className="relative h-3.5 flex-1 overflow-hidden rounded-[3px] bg-bg-soft">
                    <span
                      className="absolute inset-y-0 left-0 rounded-[3px] bg-danger/70"
                      style={{ width: `${(r.runtime / maxRuntime) * 100}%` }}
                    />
                  </span>
                  <span className="w-12 shrink-0 text-right font-mono text-xs font-bold text-fg">
                    {r.runtime}
                  </span>
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* the gap, in words */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-2">
          <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-fg-subtle">
            Είσοδος
          </div>
          <div className="text-fg">
            {first.bits} → {top.bits} δυφία{' '}
            <span className="font-bold text-fg">
              (+{top.bits - first.bits})
            </span>
          </div>
        </div>
        <div className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2">
          <div className="text-[0.65rem] font-semibold uppercase tracking-wider text-fg-subtle">
            Χρόνος
          </div>
          <div className="text-fg">
            {first.runtime} → {top.runtime}{' '}
            <span className="font-bold text-danger">
              (×{top.runtime / first.runtime})
            </span>
          </div>
        </div>
      </div>

      {/* verdict */}
      <div
        aria-live="polite"
        className="mt-2 min-h-[3.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {d === 0 ? (
          'Πάτα «×2 το W» και παρακολούθησε δύο πράγματα: τα μπλε δυφία της εισόδου και την κόκκινη μπάρα του χρόνου.'
        ) : (
          <>
            Πρόσθεσες <strong className="text-fg">{d}</strong> δυφία στην
            είσοδο — και ο χρόνος έγινε{' '}
            <strong className="text-fg">×{2 ** d}</strong>. Ο χρόνος n·W είναι{' '}
            <strong className="text-fg">2^(δυφία)</strong>: εκθετικός ως προς το
            μέγεθος της εισόδου, πολυωνυμικός μόνο ως προς την <em>τιμή</em> του
            W. Αυτό ακριβώς σημαίνει <strong className="text-fg">ψευδοπολυωνυμικός</strong>.
          </>
        )}
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setD((x) => Math.max(0, x - 1))}
          disabled={d === 0}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
          ÷2 το W
        </button>
        <button
          type="button"
          onClick={() => setD((x) => Math.min(MAX_D, x + 1))}
          disabled={d === MAX_D}
          className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          ×2 το W
        </button>
        <button
          type="button"
          onClick={() => setD(0)}
          disabled={d === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Από την αρχή
        </button>
        <span className="ml-auto text-xs font-medium text-fg-subtle">
          {d} διπλασιασμοί
        </span>
      </div>
    </section>
  )
}
