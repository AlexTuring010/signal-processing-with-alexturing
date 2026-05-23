'use client'

/**
 * DominantColourBoard — the dominant-colour algorithm on a real 4×4 grid.
 *
 * The page used to wave at a static diagram of «4 quadrants → 4 candidates».
 * The conceptual leap students miss is: «WAIT, why is checking only those
 * four candidates correct?». This viz lets them feel it by:
 *
 *  - watching three presets (clear winner / no winner / tight 50–50) where
 *    the four quadrant-candidates appear and are then verified on the whole
 *    board, each in O(n²);
 *  - and a paint mode where they can cycle any tile's colour and see the
 *    candidates and the verdict update on the fly.
 *
 * The stepper walks the algorithm phases — split → gather candidates →
 * verify each → verdict — so the «O(n²) per candidate × ≤4 candidates =
 * O(n²) combine» pattern is visible, not asserted. Built for L04.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight, Brush, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

type Colour = 'R' | 'B' | 'G' | 'Y'
type Board = Colour[][]

const COLOUR_BG: Record<Colour, string> = {
  R: 'bg-rose-500',
  B: 'bg-sky-500',
  G: 'bg-emerald-500',
  Y: 'bg-amber-400',
}
const COLOUR_HEX: Record<Colour, string> = {
  R: '#f43f5e',
  B: '#0ea5e9',
  G: '#10b981',
  Y: '#fbbf24',
}
const COLOUR_NAME: Record<Colour, string> = {
  R: 'κόκκινο',
  B: 'μπλε',
  G: 'πράσινο',
  Y: 'κίτρινο',
}

const N = 4
const THRESH = (N * N) / 2 // > THRESH ⇒ dominant; for n=4 threshold = 8

/** Preset boards. Each is exactly 4×4. */
const PRESETS: Array<{ id: string; label: string; board: Board; expectedNote: string }> = [
  {
    id: 'has',
    label: 'Έχει κυρίαρχο',
    board: [
      ['R', 'R', 'B', 'G'],
      ['R', 'R', 'Y', 'B'],
      ['R', 'B', 'R', 'Y'],
      ['G', 'R', 'R', 'B'],
    ],
    expectedNote: '9 κόκκινα → κυρίαρχο. Μόνο 1 διακριτός υποψήφιος από τα 4 τεταρτημόρια.',
  },
  {
    id: 'none-spread',
    label: 'Χωρίς κυρίαρχο',
    board: [
      ['R', 'R', 'G', 'G'],
      ['R', 'R', 'G', 'G'],
      ['B', 'B', 'Y', 'Y'],
      ['B', 'B', 'Y', 'Y'],
    ],
    expectedNote: '4 χρώματα × 4 τεμάχια το καθένα — κανένα δεν φτάνει το 9.',
  },
  {
    id: 'tight',
    label: 'Σφιχτό 8 vs 8',
    board: [
      ['R', 'R', 'R', 'R'],
      ['R', 'R', 'R', 'R'],
      ['B', 'B', 'B', 'B'],
      ['B', 'B', 'B', 'B'],
    ],
    expectedNote: '8 = 8: τίποτα δεν είναι αυστηρά > 8. Η ανισότητα είναι αυστηρή.',
  },
]

function getQuadrant(board: Board, qx: number, qy: number): Colour[] {
  const out: Colour[] = []
  const half = N / 2
  for (let y = qy * half; y < (qy + 1) * half; y++) {
    for (let x = qx * half; x < (qx + 1) * half; x++) {
      out.push(board[y][x])
    }
  }
  return out
}

/** True dominant colour of an array of tiles (or null). */
function dominantOf(tiles: Colour[]): Colour | null {
  const counts: Record<string, number> = {}
  for (const t of tiles) counts[t] = (counts[t] || 0) + 1
  const need = tiles.length / 2
  for (const c of Object.keys(counts)) if (counts[c] > need) return c as Colour
  return null
}

function countOnBoard(board: Board, c: Colour): number {
  let n = 0
  for (const row of board) for (const t of row) if (t === c) n++
  return n
}

/** Cycle a tile's colour: R → B → G → Y → R. */
const CYCLE: Colour[] = ['R', 'B', 'G', 'Y']
function nextColour(c: Colour): Colour {
  return CYCLE[(CYCLE.indexOf(c) + 1) % CYCLE.length]
}

const STEP_LABELS = [
  'Η σκακιέρα',
  'Σπάσε σε 4 τεταρτημόρια',
  'Πάρε υποψήφιο από καθένα',
  'Έλεγξε κάθε υποψήφιο',
  'Ετυμηγορία',
] as const

export function DominantColourBoard() {
  const [presetIdx, setPresetIdx] = useState(0)
  const [paintMode, setPaintMode] = useState(false)
  const [board, setBoard] = useState<Board>(() =>
    PRESETS[0].board.map((r) => [...r]),
  )
  const [step, setStep] = useState(0) // 0..4
  const [activeCandIdx, setActiveCandIdx] = useState(0) // for step 3

  // Per-quadrant candidates and merged unique list.
  const { quadCands, uniqueCands } = useMemo(() => {
    const q: Array<Colour | null> = []
    for (let qy = 0; qy < 2; qy++) {
      for (let qx = 0; qx < 2; qx++) {
        q.push(dominantOf(getQuadrant(board, qx, qy)))
      }
    }
    const u: Colour[] = []
    for (const c of q) if (c && !u.includes(c)) u.push(c)
    return { quadCands: q, uniqueCands: u }
  }, [board])

  // Counts of each unique candidate on the whole board.
  const candCounts = useMemo(
    () => uniqueCands.map((c) => ({ colour: c, count: countOnBoard(board, c) })),
    [uniqueCands, board],
  )

  const verdict = candCounts.find((c) => c.count > THRESH) ?? null

  function applyPreset(idx: number) {
    setPresetIdx(idx)
    setBoard(PRESETS[idx].board.map((r) => [...r]))
    setStep(0)
    setActiveCandIdx(0)
    setPaintMode(false)
  }

  function paint(x: number, y: number) {
    if (!paintMode) return
    const next = board.map((r) => [...r])
    next[y][x] = nextColour(next[y][x])
    setBoard(next)
    setStep(0)
    setActiveCandIdx(0)
  }

  function reset() {
    applyPreset(presetIdx)
  }

  return (
    <div className="my-6 rounded-2xl border border-border bg-bg-elevated p-4 shadow-sm sm:p-5">
      {/* header */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
          Αλγόριθμος
        </span>
        <span className="text-sm font-semibold">Κυρίαρχο χρώμα — βήμα-βήμα σε σκακιέρα 4×4</span>
      </div>

      {/* presets + paint */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {PRESETS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => applyPreset(i)}
            className={cn(
              'rounded-lg border px-2.5 py-1.5 text-xs font-semibold',
              presetIdx === i && !paintMode
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border bg-bg-elevated hover:bg-bg',
            )}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={() => setPaintMode((m) => !m)}
          className={cn(
            'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold',
            paintMode
              ? 'border-accent bg-accent/15 text-accent'
              : 'border-border bg-bg-elevated hover:bg-bg',
          )}
          title="Πάτα ένα πλακίδιο για να αλλάξει χρώμα"
        >
          <Brush className="h-3.5 w-3.5" />
          Ζωγράφισε
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_320px]">
        {/* board */}
        <div>
          <div className="relative rounded-xl border border-border bg-bg/40 p-4">
            <div className="grid grid-cols-4 gap-1.5">
              {board.map((row, y) =>
                row.map((c, x) => {
                  const onSweepSpotlight =
                    step === 3 &&
                    uniqueCands.length > 0 &&
                    c === uniqueCands[activeCandIdx]
                  return (
                    <div
                      key={`${x}-${y}`}
                      role={paintMode ? 'button' : undefined}
                      tabIndex={paintMode ? 0 : -1}
                      onClick={() => paint(x, y)}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && paintMode) paint(x, y)
                      }}
                      className={cn(
                        'relative aspect-square rounded-md transition-all duration-200',
                        COLOUR_BG[c],
                        paintMode && 'cursor-pointer ring-1 ring-inset ring-white/30',
                        step === 3 &&
                          uniqueCands.length > 0 &&
                          c !== uniqueCands[activeCandIdx] &&
                          'opacity-30',
                        onSweepSpotlight && 'ring-2 ring-white shadow-lg shadow-black/30',
                      )}
                      title={paintMode ? `${COLOUR_NAME[c]} — κλικ για αλλαγή` : COLOUR_NAME[c]}
                    />
                  )
                }),
              )}
            </div>
            {/* quadrant dividers (steps 1+) */}
            {step >= 1 && (
              <>
                <div className="pointer-events-none absolute inset-x-4 top-1/2 h-[2px] -translate-y-[1px] bg-fg/40" />
                <div className="pointer-events-none absolute inset-y-4 left-1/2 w-[2px] -translate-x-[1px] bg-fg/40" />
              </>
            )}
          </div>
          <div className="mt-1 text-center text-[11px] text-fg-muted">
            {paintMode ? (
              <>Κλικ σε πλακίδιο → επόμενο χρώμα. Ο αλγόριθμος ξανατρέχει αυτόματα.</>
            ) : (
              <>n = 4 · σύνολο = 16 πλακίδια · κυρίαρχο ⇔ &gt; 8 εμφανίσεις</>
            )}
          </div>
        </div>

        {/* trace panel */}
        <div className="rounded-xl border border-border bg-bg/40 p-3 text-sm">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-fg-muted">
            Φάση {step + 1} / 5 · {STEP_LABELS[step]}
          </div>

          {step === 0 && (
            <div className="space-y-1.5">
              <div className="text-fg">
                Η σκακιέρα είναι έτοιμη. Δεν ξέρουμε ακόμα <em>ποιο</em> χρώμα κυριαρχεί — μπορεί
                και κανένα.
              </div>
              <div className="text-xs text-fg-muted">
                {!paintMode && PRESETS[presetIdx]?.expectedNote}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-1.5">
              <div className="text-fg">
                Χωρίζουμε σε 4 τεταρτημόρια <span className="font-mono">2×2</span>. Καθένα είναι
                ένα μικρότερο ίδιο πρόβλημα.
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {(['c₁ (πάνω-αριστερά)', 'c₂ (πάνω-δεξιά)', 'c₃ (κάτω-αριστερά)', 'c₄ (κάτω-δεξιά)'] as const).map(
                  (lbl, i) => (
                    <div key={i} className="rounded border border-border bg-bg/60 px-2 py-1 text-[11px]">
                      {lbl}
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <div className="text-fg">
                Καλούμε αναδρομικά τον αλγόριθμο σε κάθε τεταρτημόριο. Παίρνουμε{' '}
                {quadCands.filter(Boolean).length} υποψήφιο
                {quadCands.filter(Boolean).length === 1 ? '' : 'υς'}.
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                {(['c₁', 'c₂', 'c₃', 'c₄'] as const).map((lbl, i) => {
                  const c = quadCands[i]
                  return (
                    <div
                      key={lbl}
                      className="flex items-center gap-1.5 rounded border border-border bg-bg/60 px-2 py-1"
                    >
                      <span className="font-mono">{lbl} =</span>
                      {c ? (
                        <>
                          <span
                            className="inline-block h-3.5 w-3.5 rounded"
                            style={{ background: COLOUR_HEX[c] }}
                          />
                          <span>{COLOUR_NAME[c]}</span>
                        </>
                      ) : (
                        <span className="italic text-fg-muted">κανένα</span>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="mt-1.5 text-xs text-fg-muted">
                Διακριτοί υποψήφιοι →{' '}
                <span className="font-semibold text-fg">
                  {uniqueCands.length === 0
                    ? '0 (κανένα τεταρτημόριο δεν έχει κυρίαρχο)'
                    : uniqueCands.map((c) => COLOUR_NAME[c]).join(', ')}
                </span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              {uniqueCands.length === 0 ? (
                <div className="rounded border border-amber-500/40 bg-amber-500/10 px-2 py-1.5 text-xs">
                  Κανείς υποψήφιος → η μεγάλη σκακιέρα <em>δεν</em> έχει κυρίαρχο (από την
                  παρατήρηση-κλειδί).
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-1">
                    {uniqueCands.map((c, i) => (
                      <button
                        key={c}
                        onClick={() => setActiveCandIdx(i)}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs',
                          i === activeCandIdx
                            ? 'border-accent bg-accent/15'
                            : 'border-border bg-bg-elevated hover:bg-bg',
                        )}
                      >
                        <span
                          className="inline-block h-3 w-3 rounded"
                          style={{ background: COLOUR_HEX[c] }}
                        />
                        <span>{COLOUR_NAME[c]}</span>
                      </button>
                    ))}
                  </div>
                  {candCounts.length > 0 && (
                    (() => {
                      const cur = candCounts[activeCandIdx]
                      const pass = cur.count > THRESH
                      return (
                        <div
                          className={cn(
                            'rounded border px-2 py-1.5 text-xs',
                            pass
                              ? 'border-emerald-500/40 bg-emerald-500/10'
                              : 'border-rose-500/40 bg-rose-500/10',
                          )}
                        >
                          <div>
                            Σαρώνω ολόκληρη τη σκακιέρα και μετράω{' '}
                            <span
                              className="font-semibold"
                              style={{ color: COLOUR_HEX[cur.colour] }}
                            >
                              {COLOUR_NAME[cur.colour]}
                            </span>{' '}
                            — κόστος <span className="font-mono">O(n²)</span>.
                          </div>
                          <div className="mt-0.5">
                            μετράω <span className="font-mono font-semibold">{cur.count}</span>{' '}
                            εμφανίσεις · κατώφλι &gt; <span className="font-mono">{THRESH}</span>{' '}
                            ·{' '}
                            <span className="font-semibold">
                              {pass ? '✓ κυρίαρχο' : '✗ δεν φτάνει'}
                            </span>
                          </div>
                        </div>
                      )
                    })()
                  )}
                  <div className="text-[11px] text-fg-muted">
                    Συνολική δουλειά εδώ: {uniqueCands.length} ×{' '}
                    <span className="font-mono">O(n²)</span> = <span className="font-mono">O(n²)</span>.
                  </div>
                </>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              {verdict ? (
                <div className="rounded border border-emerald-500/40 bg-emerald-500/10 p-2">
                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    Κυρίαρχο χρώμα:
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="inline-block h-4 w-4 rounded"
                      style={{ background: COLOUR_HEX[verdict.colour] }}
                    />
                    <span className="font-semibold">{COLOUR_NAME[verdict.colour]}</span>
                    <span className="ml-auto font-mono text-xs">
                      {verdict.count} &gt; {THRESH} ✓
                    </span>
                  </div>
                </div>
              ) : (
                <div className="rounded border border-rose-500/40 bg-rose-500/10 p-2">
                  <div className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                    Κανένα κυρίαρχο χρώμα
                  </div>
                  <div className="mt-1 text-[11px] text-fg-muted">
                    {uniqueCands.length === 0
                      ? 'Κανείς υποψήφιος δεν εμφανίστηκε από τα τεταρτημόρια.'
                      : `Οι ${uniqueCands.length} υποψήφιο${uniqueCands.length === 1 ? 'ς' : 'οι'} δεν ξεπέρασαν το κατώφλι.`}
                  </div>
                </div>
              )}
              <div className="text-[11px] text-fg-muted">
                Έλεγξα μόνο {Math.max(uniqueCands.length, 0)} χρώματα, όχι 4 — και σίγουρα όχι όλα
                τα 16 πλακίδια. <em>Αυτό</em> είναι το κέρδος της παρατήρησης.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-bg-elevated px-3 py-1.5 text-xs font-semibold hover:bg-bg"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Από την αρχή
        </button>
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-bg-elevated px-3 py-1.5 text-xs font-semibold hover:bg-bg disabled:opacity-50"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Πίσω
        </button>
        <button
          onClick={() => setStep((s) => Math.min(STEP_LABELS.length - 1, s + 1))}
          disabled={step === STEP_LABELS.length - 1}
          className="inline-flex items-center gap-1 rounded-lg border border-accent/40 bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/25 disabled:opacity-50"
        >
          Επόμενο
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
        <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-fg-muted">
          <Eye className="h-3.5 w-3.5" />
          {paintMode ? 'Εργαστήριο' : `Σενάριο: ${PRESETS[presetIdx].label}`}
        </span>
      </div>
    </div>
  )
}
