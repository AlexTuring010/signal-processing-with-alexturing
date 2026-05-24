'use client'

/**
 * StripJustification — why a mixed pair closer than δ must lie in the 2δ-strip.
 *
 * The page asserts: if a left-right pair has distance < δ, BOTH endpoints
 * are within δ of L. The proof is a one-line x-projection argument, but
 * it does not «click» from prose — students fail to see that the disk
 * of radius δ around a right point simply cannot reach across L if the
 * point itself sits more than δ from L.
 *
 * The viz makes it physical: slide a single right-side point p along the
 * x-axis. A δ-radius reach disk follows. While p is inside the strip the
 * disk crosses L (and may catch left points → there could be a close
 * mixed pair); past dx = δ the disk falls entirely on the right of L
 * and not a single left point is in range. That is the whole reason the
 * strip is exactly 2δ wide.
 *
 * Built for L05.
 */

import { useState } from 'react'

const W = 480
const H = 240
const PAD_Y = 26
const Lx = W / 2
const DELTA_PX = 64
const PY = H / 2

/** Five fixed left-side candidates. Placed so that at small dx some are
 *  inside the disk; at dx = δ none are; the closest catches around dx ≈ 0.4·δ. */
const LEFT_PTS: Array<{ x: number; y: number; id: string }> = [
  { x: Lx - 12, y: PY - 8, id: 'q₁' },
  { x: Lx - 30, y: PY + 40, id: 'q₂' },
  { x: Lx - 70, y: PY - 50, id: 'q₃' },
  { x: Lx - 110, y: PY + 60, id: 'q₄' },
  { x: Lx - 150, y: PY - 20, id: 'q₅' },
]

const fmtDelta = (px: number) => (px / DELTA_PX).toFixed(2)

export function StripJustification() {
  const [dx, setDx] = useState(0.45 * DELTA_PX)

  const px = Lx + dx
  const inStrip = dx <= DELTA_PX
  const onLine = dx === 0

  const ptDists = LEFT_PTS.map((q) => ({
    q,
    d: Math.hypot(q.x - px, q.y - PY),
    inDisk: Math.hypot(q.x - px, q.y - PY) < DELTA_PX,
  }))
  const closeCount = ptDists.filter((pd) => pd.inDisk).length

  const diskFill = inStrip ? 'rgb(34 197 94 / 0.15)' : 'rgb(244 63 94 / 0.13)'
  const diskStroke = inStrip ? 'rgb(34 197 94)' : 'rgb(244 63 94)'
  const pColor = inStrip ? 'rgb(34 197 94)' : 'rgb(244 63 94)'

  let note: string
  if (onLine) {
    note =
      'Το p ακριβώς πάνω στη γραμμή L. Ο δίσκος ακτίνας δ απλώνεται και στις δύο πλευρές — οποιοδήποτε αριστερό σημείο μέσα του σχηματίζει μικτό ζευγάρι σε απόσταση < δ.'
  } else if (dx < DELTA_PX) {
    note = `Το p απέχει ${fmtDelta(dx)}·δ από τη L — βρίσκεται μέσα στη ζώνη. Ο δίσκος ξεπερνά τη L και ${closeCount > 0 ? `${closeCount} αριστερά σημεία πέφτουν μέσα του — αυτά είναι υποψήφια για κοντινό μικτό ζευγάρι.` : 'σε αυτή τη θέση κανένα αριστερό δεν είναι μέσα, αλλά θα μπορούσε.'}`
  } else if (dx === DELTA_PX) {
    note =
      'Το p ακριβώς δ μακριά από τη L — ο δίσκος μόλις που αγγίζει τη γραμμή. Ένα αριστερό σημείο σε απόσταση < δ θα έπρεπε να βρίσκεται πάνω στη L — άρα δεν είναι αυστηρά αριστερό.'
  } else {
    note = `Το p απέχει ${fmtDelta(dx)}·δ > δ από τη L — έξω από τη ζώνη. Ο δίσκος δεν φτάνει ποτέ τη L. Άρα ΚΑΝΕΝΑ αριστερό σημείο δεν μπορεί να είναι σε απόσταση < δ από το p, ό,τι κι αν έχει για y. Το p αγνοείται στο combine.`
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Γιατί η ζώνη είναι ακριβώς 2δ — η εμβέλεια του p
        </div>
        <span
          className={
            'shrink-0 rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider ' +
            (inStrip
              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-500/15 text-rose-700 dark:text-rose-300')
          }
        >
          {inStrip ? 'στη ζώνη — εξετάζεται' : 'έξω από τη ζώνη — αγνοείται'}
        </span>
      </div>

      <div className="graph-canvas overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H + 30}`}
          className="mx-auto w-full max-w-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>{`
            .sj-strip { fill: rgb(234 179 8 / 0.18); stroke: rgb(234 179 8 / 0.55); stroke-dasharray: 4 3; }
            .sj-L { stroke: rgb(var(--fg)); stroke-width: 2; stroke-dasharray: 6 4; }
            .sj-leftpt { fill: rgb(244 63 94); stroke: rgb(var(--bg-elevated)); stroke-width: 1.5; }
            .sj-id { font: 700 12px ui-sans-serif, system-ui; fill: rgb(var(--fg)); text-anchor: middle; }
            .sj-qid { font: 600 10px ui-sans-serif, system-ui; fill: rgb(var(--fg-muted)); text-anchor: middle; }
            .sj-lbl { font: 600 10px ui-sans-serif, system-ui; fill: rgb(var(--fg-muted)); text-anchor: middle; }
            .sj-bracket { stroke: rgb(var(--fg-muted)); stroke-width: 1.5; }
            .sj-delta { font: 700 11px ui-sans-serif, system-ui; fill: rgb(202 138 4); text-anchor: middle; }
          `}</style>

          {/* 2δ strip */}
          <rect
            x={Lx - DELTA_PX}
            y={PAD_Y}
            width={2 * DELTA_PX}
            height={H - 2 * PAD_Y}
            className="sj-strip"
          />

          {/* L */}
          <line x1={Lx} y1={PAD_Y - 6} x2={Lx} y2={H - PAD_Y + 6} className="sj-L" />
          <text x={Lx} y={PAD_Y - 12} className="sj-id">
            L
          </text>

          {/* δ bracket at top, on right side */}
          <line x1={Lx} y1={PAD_Y - 22} x2={Lx + DELTA_PX} y2={PAD_Y - 22} className="sj-bracket" />
          <line x1={Lx} y1={PAD_Y - 26} x2={Lx} y2={PAD_Y - 18} className="sj-bracket" />
          <line x1={Lx + DELTA_PX} y1={PAD_Y - 26} x2={Lx + DELTA_PX} y2={PAD_Y - 18} className="sj-bracket" />
          <text x={Lx + DELTA_PX / 2} y={PAD_Y - 26} className="sj-delta">
            δ
          </text>

          {/* dx bracket under p */}
          <line x1={Lx} y1={H - PAD_Y + 22} x2={px} y2={H - PAD_Y + 22} className="sj-bracket" />
          <line x1={Lx} y1={H - PAD_Y + 18} x2={Lx} y2={H - PAD_Y + 26} className="sj-bracket" />
          <line x1={px} y1={H - PAD_Y + 18} x2={px} y2={H - PAD_Y + 26} className="sj-bracket" />
          <text x={(Lx + px) / 2} y={H - PAD_Y + 38} className="sj-lbl">
            απόσταση από L = {fmtDelta(dx)}·δ
          </text>

          {/* reach disk */}
          <circle cx={px} cy={PY} r={DELTA_PX} fill={diskFill} stroke={diskStroke} strokeWidth={2} />

          {/* connection lines for in-disk left points */}
          {ptDists.map(
            (pd, i) =>
              pd.inDisk && (
                <line
                  key={`ln${i}`}
                  x1={pd.q.x}
                  y1={pd.q.y}
                  x2={px}
                  y2={PY}
                  stroke="rgb(34 197 94)"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                />
              ),
          )}

          {/* left points */}
          {ptDists.map((pd) => (
            <g key={pd.q.id}>
              <circle
                cx={pd.q.x}
                cy={pd.q.y}
                r={7}
                className="sj-leftpt"
                opacity={pd.inDisk ? 1 : 0.6}
              />
              <text x={pd.q.x} y={pd.q.y - 11} className="sj-qid">
                {pd.q.id}
              </text>
            </g>
          ))}

          {/* p */}
          <circle cx={px} cy={PY} r={9} fill={pColor} stroke="rgb(var(--bg-elevated))" strokeWidth={2} />
          <text x={px} y={PY - 14} className="sj-id">
            p
          </text>
        </svg>
      </div>

      {/* slider */}
      <div className="mt-3 flex items-center gap-3">
        <span className="shrink-0 text-xs font-medium text-fg-subtle">Σύρε το p:</span>
        <input
          type="range"
          min={0}
          max={1.5 * DELTA_PX}
          step={1}
          value={dx}
          onChange={(e) => setDx(Number(e.target.value))}
          className="flex-1 accent-accent"
          aria-label="απόσταση του p από τη L"
        />
        <span className="w-14 shrink-0 text-right font-mono text-xs text-fg-muted tabular-nums">
          {fmtDelta(dx)}·δ
        </span>
      </div>

      {/* counter + legend */}
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-subtle">
        <span>
          Αριστερά σημεία μέσα στη εμβέλεια δ του p:{' '}
          <span className="font-mono font-bold text-fg">{closeCount}</span> / {LEFT_PTS.length}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-rose-500" /> αριστερά
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-yellow-500/40 ring-1 ring-yellow-500" /> ζώνη 2δ
        </span>
      </div>

      <div
        aria-live="polite"
        className="mt-3 min-h-[4.75rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg-muted"
      >
        {note}
      </div>
    </section>
  )
}
