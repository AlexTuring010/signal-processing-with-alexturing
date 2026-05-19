'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type BlockId =
  | 'source'
  | 'encoder'
  | 'modulator'
  | 'channel'
  | 'demodulator'
  | 'decoder'
  | 'sink'

type BlockSpec = {
  id: BlockId
  label: string
  /** What this block does, in plain Greek. */
  description: string
  /** Highlight color group. */
  group: 'source' | 'tx' | 'channel' | 'rx' | 'sink'
}

type SignalLabels = {
  /** After source, before modulator. */
  m?: string
  /** After modulator, before channel. */
  s?: string
  /** After channel, before demodulator. */
  r?: string
  /** After decoder, into sink. */
  mhat?: string
}

type Props = {
  /**
   * Level of detail.
   *  1 — Source → Channel → Sink (3 blocks)
   *  2 — Source → Transmitter → Channel → Receiver → Sink (5 blocks, tx/rx grouped)
   *  3 — Full chain with encoder/modulator/demodulator/decoder (7 blocks)
   */
  level?: 1 | 2 | 3
  /** Title shown above the diagram. */
  title?: string
  /** Override default Greek block labels — useful for real-world examples. */
  labels?: Partial<Record<BlockId, string>>
  /** Override the signal-line labels. */
  signalLabels?: SignalLabels
  /**
   * When true, show interactive level switcher above the diagram (1/2/3).
   * Default true.
   */
  controls?: boolean
}

const DEFAULT_BLOCKS: Record<BlockId, BlockSpec> = {
  source: {
    id: 'source',
    label: 'Πηγή πληροφορίας',
    description:
      'Από εδώ ξεκινά αυτό που θες να στείλεις: φωνή, εικόνα, αρχείο, ψηφιακά δεδομένα.',
    group: 'source',
  },
  encoder: {
    id: 'encoder',
    label: 'Source coding',
    description:
      'Πριν στείλουμε, μερικές φορές συμπιέζουμε ή κωδικοποιούμε το σήμα — για ασφάλεια ή για μικρότερο όγκο (π.χ. MP3, ZIP).',
    group: 'tx',
  },
  modulator: {
    id: 'modulator',
    label: 'Διαμόρφωση',
    description:
      'Παίρνουμε την πληροφορία και την «βάζουμε πάνω» σε ένα φέρον (carrier) σε υψηλή συχνότητα, ώστε να μπορεί να μεταδοθεί. Επιστρέφουμε στο modulation σε λίγο.',
    group: 'tx',
  },
  channel: {
    id: 'channel',
    label: 'Κανάλι',
    description:
      'Αέρας, καλώδιο χαλκού, οπτική ίνα — ό,τι κι αν είναι, εισάγει εξασθένηση και θόρυβο.',
    group: 'channel',
  },
  demodulator: {
    id: 'demodulator',
    label: 'Αποδιαμόρφωση',
    description:
      'Ο αντίστροφος του modulator: αφαιρεί το carrier και ανακτά το σήμα πληροφορίας στη baseband ζώνη.',
    group: 'rx',
  },
  decoder: {
    id: 'decoder',
    label: 'Source decoding',
    description:
      'Αν το σήμα ήταν συμπιεσμένο/κωδικοποιημένο, εδώ το αποκωδικοποιούμε για να επιστρέψουμε στην αρχική του μορφή.',
    group: 'rx',
  },
  sink: {
    id: 'sink',
    label: 'Δέκτης πληροφορίας',
    description:
      'Το τελικό αποτέλεσμα: ηχείο, οθόνη, μνήμη υπολογιστή. Ποτέ δεν είναι ακριβώς αυτό που ξεκίνησε — γι\' αυτό το λέμε m̂(t).',
    group: 'sink',
  },
}

const BLOCKS_BY_LEVEL: Record<1 | 2 | 3, BlockId[]> = {
  1: ['source', 'channel', 'sink'],
  2: ['source', 'modulator', 'channel', 'demodulator', 'sink'],
  3: ['source', 'encoder', 'modulator', 'channel', 'demodulator', 'decoder', 'sink'],
}

const GROUP_TONE: Record<BlockSpec['group'], string> = {
  source: 'border-sky-400/50 bg-sky-50/60 dark:bg-sky-400/10',
  tx: 'border-blue-400/50 bg-blue-50/60 dark:bg-blue-400/10',
  channel: 'border-amber-400/60 bg-amber-50/60 dark:bg-amber-400/10',
  rx: 'border-emerald-400/50 bg-emerald-50/60 dark:bg-emerald-400/10',
  sink: 'border-purple-400/50 bg-purple-50/60 dark:bg-purple-400/10',
}

export function CommSystemDiagram({
  level: initialLevel = 3,
  title,
  labels,
  signalLabels,
  controls = true,
}: Props) {
  const [level, setLevel] = useState<1 | 2 | 3>(initialLevel)
  const [activeId, setActiveId] = useState<BlockId | null>(null)

  const blockIds = BLOCKS_BY_LEVEL[level]
  const blocks: BlockSpec[] = blockIds.map((id) => ({
    ...DEFAULT_BLOCKS[id],
    label: labels?.[id] ?? DEFAULT_BLOCKS[id].label,
  }))
  const active = activeId ? DEFAULT_BLOCKS[activeId] : null

  const signals: SignalLabels = {
    m: signalLabels?.m ?? 'm(t)',
    s: signalLabels?.s ?? 's(t)',
    r: signalLabels?.r ?? 'r(t)',
    mhat: signalLabels?.mhat ?? 'm̂(t)',
  }

  /** Decide what signal label sits on the wire AFTER block i. */
  const getEdgeLabel = (afterIdx: number): string | undefined => {
    const id = blockIds[afterIdx]
    if (id === 'source') return signals.m
    if (id === 'modulator') return signals.s
    if (id === 'channel') return signals.r
    // The wire from decoder → sink carries m̂(t). For levels without decoder,
    // the wire from demodulator → sink carries m̂(t).
    if (id === 'decoder') return signals.mhat
    if (id === 'demodulator' && !blockIds.includes('decoder')) return signals.mhat
    return undefined
  }

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      {(title || controls) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          {title ? (
            <h4 className="text-sm font-semibold tracking-tight">{title}</h4>
          ) : (
            <span />
          )}
          {controls && (
            <div
              role="radiogroup"
              aria-label="Επίπεδο λεπτομέρειας"
              className="inline-flex items-center rounded-full border border-border bg-bg-soft p-0.5 text-xs"
            >
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={level === n}
                  onClick={() => {
                    setLevel(n as 1 | 2 | 3)
                    setActiveId(null)
                  }}
                  className={cn(
                    'rounded-full px-2.5 py-1 transition-colors',
                    level === n
                      ? 'bg-accent text-accent-fg'
                      : 'text-fg-muted hover:text-fg',
                  )}
                  title={
                    n === 1 ? 'Απλό' : n === 2 ? 'Μέτριο' : 'Πλήρες'
                  }
                >
                  Level {n}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Diagram: horizontal on md+, vertical on mobile */}
      <div className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-1">
        {blocks.map((b, i) => {
          const edgeLabel = getEdgeLabel(i)
          const isLast = i === blocks.length - 1
          return (
            <div
              key={b.id}
              className="flex flex-1 flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-1"
            >
              <button
                type="button"
                onClick={() => setActiveId((cur) => (cur === b.id ? null : b.id))}
                className={cn(
                  'group relative flex min-h-[64px] w-full flex-1 flex-col items-center justify-center rounded-md border-2 px-2 py-2 text-center transition-all',
                  GROUP_TONE[b.group],
                  activeId === b.id
                    ? 'shadow-md ring-2 ring-accent/50'
                    : 'hover:shadow-sm hover:ring-1 hover:ring-accent/30',
                )}
                aria-expanded={activeId === b.id}
                aria-controls={`block-desc-${b.id}`}
              >
                <span className="text-[0.78rem] font-semibold leading-tight tracking-tight text-fg sm:text-xs md:text-[11px] lg:text-xs">
                  {b.label}
                </span>
                <Info
                  className={cn(
                    'absolute right-1 top-1 h-3 w-3 transition-opacity',
                    activeId === b.id ? 'opacity-90 text-accent' : 'opacity-30',
                  )}
                  aria-hidden="true"
                />
              </button>

              {!isLast && (
                <div className="relative flex w-full items-center justify-center md:w-auto md:flex-shrink-0">
                  <ChevronRight
                    className="hidden h-5 w-5 text-fg-muted md:block"
                    aria-hidden="true"
                  />
                  <ChevronDown
                    className="h-4 w-4 text-fg-muted md:hidden"
                    aria-hidden="true"
                  />
                  {edgeLabel && (
                    <span
                      className={cn(
                        'pointer-events-none absolute font-mono text-[10px] text-accent',
                        // Position label above arrow on desktop, beside on mobile.
                        'left-1/2 -translate-x-1/2 -top-3.5 md:-top-3',
                      )}
                    >
                      {edgeLabel}
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Description panel: shown when a block is selected */}
      <div
        id={active ? `block-desc-${active.id}` : undefined}
        className={cn(
          'mt-3 overflow-hidden text-sm leading-relaxed transition-all',
          active ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0',
        )}
        aria-live="polite"
      >
        {active && (
          <div
            className={cn(
              'animate-fade-in rounded-md border px-3 py-2.5',
              GROUP_TONE[active.group],
            )}
          >
            <div className="mb-0.5 text-xs font-semibold tracking-tight text-fg">
              {labels?.[active.id] ?? active.label}
            </div>
            <p className="text-[0.875rem] text-fg/85">{active.description}</p>
          </div>
        )}
      </div>

      {!active && (
        <p className="mt-3 text-center text-[0.78rem] text-fg-subtle">
          Πάτα ή πέρασε με το ποντίκι πάνω από κάθε block για περιγραφή.
        </p>
      )}
    </figure>
  )
}
