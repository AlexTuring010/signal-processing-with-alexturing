'use client'

/**
 * CompressionCostLab — feel why variable-length codes win, and exactly when.
 *
 * Six characters a–f, each with a draggable frequency. The lab computes the
 * optimal Huffman code lengths live and compares two encodings of the same
 * text: fixed length (3 bits for every character) vs Huffman (variable). Two
 * bars show the total bit count; a breakdown table shows where the bits go.
 * Drag the distribution toward uniform and the bars nearly meet — there is no
 * skew to exploit. Drag it lopsided and the gap blows open: Huffman spends a
 * single bit on the dominant character. The point a student should leave with
 * is that variable-length coding is not magic — it is the payoff of frequency
 * skew. Built for L13.
 */

import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

const CHARS = ['a', 'b', 'c', 'd', 'e', 'f'] as const
type Ch = (typeof CHARS)[number]
type Freq = Record<Ch, number>

/** ⌈log₂ 6⌉ — bits per character under a fixed-length code of 6 symbols. */
const FIXED_BITS = 3

const PRESETS: { id: string; label: string; freq: Freq }[] = [
  { id: 'exam', label: 'Η εκφώνηση', freq: { a: 45, b: 13, c: 12, d: 16, e: 9, f: 5 } },
  { id: 'uniform', label: 'Ομοιόμορφη', freq: { a: 17, b: 17, c: 17, d: 17, e: 16, f: 16 } },
  { id: 'skewed', label: 'Πολύ λοξή', freq: { a: 75, b: 5, c: 5, d: 5, e: 5, f: 5 } },
]

/**
 * Optimal Huffman code length for each character — found by simulating the
 * merges. Every merge deepens every leaf already under the two merged trees by
 * one, so a leaf's final depth is exactly the number of merges that swallowed
 * it. Depth = code length.
 */
function huffmanLengths(freq: Freq): Freq {
  type Node = { f: number; leaves: Ch[] }
  let nodes: Node[] = CHARS.map((c) => ({ f: freq[c], leaves: [c] }))
  const len: Freq = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 }
  while (nodes.length > 1) {
    nodes.sort((x, y) => x.f - y.f)
    const x = nodes[0]
    const y = nodes[1]
    for (const c of x.leaves) len[c]++
    for (const c of y.leaves) len[c]++
    nodes = [{ f: x.f + y.f, leaves: [...x.leaves, ...y.leaves] }, ...nodes.slice(2)]
  }
  return len
}

const CHAR_FILL: Record<Ch, string> = {
  a: '#9f1239',
  b: '#be3455',
  c: '#c75c75',
  d: '#d98da0',
  e: '#7e1031',
  f: '#a85a6c',
}

export function CompressionCostLab() {
  const [freq, setFreq] = useState<Freq>(PRESETS[0].freq)

  const len = useMemo(() => huffmanLengths(freq), [freq])
  const total = CHARS.reduce((s, c) => s + freq[c], 0)
  const fixedBits = total * FIXED_BITS
  const huffBits = CHARS.reduce((s, c) => s + freq[c] * len[c], 0)
  const saved = fixedBits - huffBits
  const savedPct = fixedBits > 0 ? Math.round((saved / fixedBits) * 100) : 0
  const huffPct = fixedBits > 0 ? (huffBits / fixedBits) * 100 : 0

  const activePreset = PRESETS.find((p) =>
    CHARS.every((c) => p.freq[c] === freq[c]),
  )?.id

  let verdict: string
  if (savedPct < 14) {
    verdict =
      'Σχεδόν ομοιόμορφη κατανομή — όλοι οι χαρακτήρες εμφανίζονται περίπου εξίσου συχνά. Δεν υπάρχει λοξότητα να εκμεταλλευτείς, οπότε η Huffman κερδίζει ελάχιστα από το σταθερό μήκος.'
  } else if (savedPct < 30) {
    verdict =
      'Μέτρια λοξή κατανομή — μερικοί χαρακτήρες είναι αισθητά συχνότεροι. Η Huffman τους δίνει κοντούς κώδικες και αρχίζει να ξεχωρίζει από το σταθερό μήκος.'
  } else {
    verdict =
      'Πολύ λοξή κατανομή — ένας χαρακτήρας κυριαρχεί. Η Huffman του δίνει κώδικα μόλις 1 δυφίου, και το κέρδος εκτοξεύεται. Εδώ ακριβώς λάμπει το μεταβλητό μήκος.'
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Σταθερό vs μεταβλητό μήκος — πειραματίσου με τις συχνότητες
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          Κέρδος {savedPct}%
        </span>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Σύρε τις συχνότητες των 6 χαρακτήρων. Η Huffman ξαναϋπολογίζεται ζωντανά —
        δες πότε το μεταβλητό μήκος κερδίζει πολύ και πότε λίγο.
      </p>

      {/* frequency sliders */}
      <div className="grid grid-cols-1 gap-x-5 gap-y-2.5 sm:grid-cols-2">
        {CHARS.map((c) => (
          <div key={c} className="flex items-center gap-2.5">
            <span
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm font-bold text-white"
              style={{ backgroundColor: CHAR_FILL[c] }}
            >
              {c}
            </span>
            <input
              type="range"
              min={1}
              max={80}
              value={freq[c]}
              aria-label={`Συχνότητα χαρακτήρα ${c}`}
              onChange={(e) =>
                setFreq((f) => ({ ...f, [c]: Number(e.target.value) }))
              }
              className="h-1.5 w-full cursor-pointer accent-accent"
            />
            <span className="w-9 shrink-0 text-right font-mono text-sm font-bold tabular-nums text-fg">
              {freq[c]}
            </span>
          </div>
        ))}
      </div>

      {/* presets */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-medium text-fg-subtle">Έτοιμα:</span>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setFreq(p.freq)}
            className={cn(
              'rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
              activePreset === p.id
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-fg-muted hover:bg-bg-soft',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* the two cost bars */}
      <div className="mt-4 space-y-2.5">
        <CostBar
          label="Σταθερό μήκος"
          sub="3 δυφία / χαρακτήρα"
          bits={fixedBits}
          widthPct={100}
          fill="#9b8a8d"
        />
        <CostBar
          label="Huffman"
          sub="μεταβλητό μήκος"
          bits={huffBits}
          widthPct={huffPct}
          fill="#9f1239"
        />
      </div>

      {/* savings readout */}
      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg border border-border bg-bg-soft/50 px-3 py-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Εξοικονόμηση
        </span>
        <span className="font-mono text-2xl font-bold tabular-nums text-fg">
          {saved.toLocaleString('el')}
        </span>
        <span className="text-sm text-fg-muted">
          δυφία λιγότερα — δηλαδή <span className="font-bold text-fg">{savedPct}%</span>{' '}
          μικρότερο αρχείο
        </span>
      </div>

      {/* per-character breakdown */}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-fg-subtle">
              <th className="py-1.5 pr-3 font-semibold">Χαρ.</th>
              <th className="py-1.5 pr-3 text-right font-semibold">Συχνότητα</th>
              <th className="py-1.5 pr-3 text-right font-semibold">Μήκος Huffman</th>
              <th className="py-1.5 text-right font-semibold">Δυφία (f × μήκος)</th>
            </tr>
          </thead>
          <tbody>
            {CHARS.map((c) => (
              <tr key={c} className="border-b border-border/60">
                <td className="py-1.5 pr-3">
                  <span
                    className="inline-flex h-5 w-5 items-center justify-center rounded text-xs font-bold text-white"
                    style={{ backgroundColor: CHAR_FILL[c] }}
                  >
                    {c}
                  </span>
                </td>
                <td className="py-1.5 pr-3 text-right font-mono tabular-nums text-fg-muted">
                  {freq[c]}
                </td>
                <td className="py-1.5 pr-3 text-right font-mono tabular-nums text-fg-muted">
                  {len[c]}
                </td>
                <td className="py-1.5 text-right font-mono font-semibold tabular-nums text-fg">
                  {freq[c] * len[c]}
                </td>
              </tr>
            ))}
            <tr className="font-bold text-fg">
              <td className="py-1.5 pr-3">Σ</td>
              <td className="py-1.5 pr-3 text-right font-mono tabular-nums">{total}</td>
              <td className="py-1.5 pr-3 text-right text-fg-subtle">—</td>
              <td className="py-1.5 text-right font-mono tabular-nums text-accent">
                {huffBits}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* verdict */}
      <div
        aria-live="polite"
        className="mt-3 rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {verdict}
      </div>

      {/* reset */}
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => setFreq(PRESETS[0].freq)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-bg-soft"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Επαναφορά
        </button>
      </div>
    </section>
  )
}

function CostBar({
  label,
  sub,
  bits,
  widthPct,
  fill,
}: {
  label: string
  sub: string
  bits: number
  widthPct: number
  fill: string
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-fg">
          {label}{' '}
          <span className="text-xs font-normal text-fg-subtle">({sub})</span>
        </span>
        <span className="font-mono text-sm font-bold tabular-nums text-fg">
          {bits.toLocaleString('el')} δυφία
        </span>
      </div>
      <div className="h-6 w-full overflow-hidden rounded-md bg-bg-soft">
        <div
          className="h-full rounded-md transition-[width] duration-300 ease-out"
          style={{ width: `${Math.max(widthPct, 2)}%`, backgroundColor: fill }}
        />
      </div>
    </div>
  )
}
