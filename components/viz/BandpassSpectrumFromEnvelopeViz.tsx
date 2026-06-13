'use client'

/**
 * X(f) from G(f): the §7 relation  X(f) = ½[G(f − f_c) + G*(−f − f_c)]  made
 * visible.
 *
 * Two stacked panels share one f-axis:
 *   Top:    |G(f)|, the baseband spectrum of the complex envelope, around 0.
 *   Bottom: |X(f)|, built as TWO copies of that shape —
 *             • the right hump  = G(f − f_c)      (G shifted up to +f_c)
 *             • the left hump   = G*(−f − f_c)     (G conjugate-REFLECTED to −f_c)
 *
 * The toggle is the whole point:
 *   • g real  → G is conjugate-symmetric, so the reflected copy looks identical
 *               to the shifted one → symmetric spectrum (AM / DSB-SC).
 *   • g complex (SSB) → G is one-sided/asymmetric, so the reflected copy is a
 *               mirror image, NOT the same → asymmetric spectrum (SSB).
 *
 * SVG + currentColor for theme, same house style as BasebandBandpassSpectrumViz.
 */

import { useState } from 'react'

const ACCENT = 'rgb(29,78,216)' // blue — the G(f − f_c) copy
const ACCENT_FILL = 'rgba(29,78,216,0.18)'
const VIOLET = 'rgb(168,85,247)' // violet — the G*(−f − f_c) conjugate copy
const VIOLET_FILL = 'rgba(168,85,247,0.18)'
const AMBER = 'rgb(217,119,6)' // ±f_c guides

const WIDTH = 560
const HEIGHT = 332
const PAD_X = 46
const TOP_BASE = 150 // baseline of |G(f)| panel
const TOP_APEX = 42
const BOT_BASE = 312 // baseline of |X(f)| panel
const BOT_APEX = 204
const W = 1 // message half-bandwidth

type Mode = 'real' | 'complex'

export function BandpassSpectrumFromEnvelopeViz() {
  const [mode, setMode] = useState<Mode>('real')
  const [fc, setFc] = useState(3.0)

  const fView = fc + W + 0.7
  const xOf = (f: number) => PAD_X + ((f + fView) / (2 * fView)) * (WIDTH - 2 * PAD_X)
  const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
  const yTop = (v: number) => TOP_BASE - clamp01(v) * (TOP_BASE - TOP_APEX)
  const yBot = (v: number) => BOT_BASE - clamp01(v) * (BOT_BASE - BOT_APEX)

  // Baseband |G(f)|, peak 1. Real → symmetric triangle on (−W, W); complex →
  // one-sided half-sine bump on (0, W), the SSB upper-sideband shape.
  const gMag = (f: number) =>
    mode === 'real'
      ? Math.max(0, 1 - Math.abs(f) / W)
      : f > 0 && f < W
        ? Math.sin((Math.PI * f) / W)
        : 0

  // Build a filled path from sampling v(f) over the full f-window.
  const pathFor = (vf: (f: number) => number, yf: (v: number) => number) => {
    const STEPS = 260
    let d = `M ${xOf(-fView).toFixed(1)} ${yf(0).toFixed(1)}`
    for (let i = 0; i <= STEPS; i++) {
      const f = -fView + (i / STEPS) * (2 * fView)
      d += ` L ${xOf(f).toFixed(1)} ${yf(vf(f)).toFixed(1)}`
    }
    d += ` L ${xOf(fView).toFixed(1)} ${yf(0).toFixed(1)} Z`
    return d
  }

  const gPath = pathFor((f) => gMag(f), yTop)
  const rightPath = pathFor((f) => 0.5 * gMag(f - fc), yBot) // G(f − f_c)
  const leftPath = pathFor((f) => 0.5 * gMag(-f - fc), yBot) // G*(−f − f_c)

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Από το G(f) στο X(f): το φάσμα του σήματος στον αέρα
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Το baseband φάσμα <span className="font-mono">|G(f)|</span> (πάνω)
        μετατοπίζεται στα <span className="font-mono">±f_c</span> για να φτιάξει το
        φάσμα <span className="font-mono">|X(f)|</span> του πραγματικού σήματος
        (κάτω). Άλλαξε αν το <span className="font-mono">g(t)</span> είναι
        πραγματικό ή μιγαδικό — και δες πότε το φάσμα βγαίνει{' '}
        <strong>συμμετρικό</strong> και πότε όχι.
      </p>

      <div
        role="radiogroup"
        aria-label="Είδος complex envelope"
        className="mb-3 inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
      >
        {([
          ['real', 'g πραγματικό (AM/DSB)'],
          ['complex', 'g μιγαδικό (SSB)'],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={mode === id}
            onClick={() => setMode(id)}
            className={
              'rounded-full px-2.5 py-0.5 transition-colors ' +
              (mode === id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg')
            }
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="block w-full text-fg"
          role="img"
          aria-label="Πάνω: baseband φάσμα G(f) γύρω από το μηδέν. Κάτω: φάσμα X(f) με ένα αντίγραφο του G στο +f_c και το κατοπτρικό-συζυγές αντίγραφο στο −f_c."
        >
          {/* ---- TOP PANEL: |G(f)| ---- */}
          <line x1={PAD_X - 8} y1={TOP_BASE} x2={WIDTH - PAD_X + 12} y2={TOP_BASE} stroke="currentColor" strokeOpacity="0.45" />
          <polygon points={`${WIDTH - PAD_X + 18},${TOP_BASE} ${WIDTH - PAD_X + 8},${TOP_BASE - 4} ${WIDTH - PAD_X + 8},${TOP_BASE + 4}`} fill="currentColor" fillOpacity="0.5" />
          <text x={WIDTH - PAD_X + 22} y={TOP_BASE + 4} fontSize="11" fill="currentColor" fillOpacity="0.7" fontStyle="italic">f</text>
          {/* vertical axis at f=0 */}
          <line x1={xOf(0)} y1={TOP_BASE + 4} x2={xOf(0)} y2={TOP_APEX - 8} stroke="currentColor" strokeOpacity="0.4" />

          <path d={gPath} fill={ACCENT_FILL} stroke={ACCENT} strokeWidth="1.8" />
          <text x={xOf(0) + 8} y={TOP_APEX + 8} fontSize="11" fill={ACCENT}>|G(f)|</text>
          <text x={xOf(0)} y={TOP_BASE + 16} textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.85">0</text>
          <text x={xOf(0)} y={TOP_APEX - 12} textAnchor="middle" fontSize="9.5" fill="currentColor" fillOpacity="0.55">
            complex envelope, baseband
          </text>

          {/* ---- connecting arrow ---- */}
          <g stroke="currentColor" strokeOpacity="0.4" fill="currentColor" fillOpacity="0.5">
            <line x1={xOf(0)} y1={TOP_BASE + 22} x2={xOf(0)} y2={BOT_APEX - 30} strokeWidth="1.2" strokeDasharray="3 3" />
            <polygon points={`${xOf(0)},${BOT_APEX - 22} ${xOf(0) - 4},${BOT_APEX - 32} ${xOf(0) + 4},${BOT_APEX - 32}`} />
          </g>
          <text x={xOf(0) + 10} y={(TOP_BASE + BOT_APEX) / 2 - 4} fontSize="9.5" fill="currentColor" fillOpacity="0.6">
            μετατόπιση στα ±f_c
          </text>

          {/* ---- BOTTOM PANEL: |X(f)| ---- */}
          <line x1={PAD_X - 8} y1={BOT_BASE} x2={WIDTH - PAD_X + 12} y2={BOT_BASE} stroke="currentColor" strokeOpacity="0.45" />
          <polygon points={`${WIDTH - PAD_X + 18},${BOT_BASE} ${WIDTH - PAD_X + 8},${BOT_BASE - 4} ${WIDTH - PAD_X + 8},${BOT_BASE + 4}`} fill="currentColor" fillOpacity="0.5" />
          <text x={WIDTH - PAD_X + 22} y={BOT_BASE + 4} fontSize="11" fill="currentColor" fillOpacity="0.7" fontStyle="italic">f</text>

          {/* ±f_c guides */}
          {[fc, -fc].map((c) => (
            <g key={c}>
              <line x1={xOf(c)} y1={BOT_BASE} x2={xOf(c)} y2={BOT_APEX - 6} stroke={AMBER} strokeOpacity="0.5" strokeDasharray="3 3" />
              <text x={xOf(c)} y={BOT_BASE + 16} textAnchor="middle" fontSize="11" fill={AMBER}>{c > 0 ? 'f_c' : '−f_c'}</text>
            </g>
          ))}
          <text x={xOf(0)} y={BOT_BASE + 16} textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.85">0</text>

          {/* the two copies */}
          <path d={leftPath} fill={VIOLET_FILL} stroke={VIOLET} strokeWidth="1.8" />
          <path d={rightPath} fill={ACCENT_FILL} stroke={ACCENT} strokeWidth="1.8" />

          {/* hump labels */}
          <text x={xOf(fc)} y={BOT_APEX - 8} textAnchor="middle" fontSize="10.5" fill={ACCENT}>G(f − f_c)</text>
          <text x={xOf(-fc)} y={BOT_APEX - 8} textAnchor="middle" fontSize="10.5" fill={VIOLET}>G*(−f − f_c)</text>
          <text x={PAD_X - 8} y={BOT_APEX - 8} fontSize="11" fill="currentColor" fillOpacity="0.7">|X(f)|</text>
        </svg>
      </div>

      {/* f_c slider */}
      <label className="mt-3 block text-xs text-fg-muted">
        Συχνότητα φέροντος f_c ={' '}
        <span className="font-mono tabular-nums text-fg">{fc.toFixed(2)}</span>
        <input
          type="range"
          min={1.6}
          max={3.6}
          step={0.05}
          value={fc}
          onChange={(e) => setFc(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Carrier frequency f_c"
        />
      </label>

      {/* teaching readout */}
      <div className="mt-2 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <span className="font-mono">X(f) = ½[G(f − f_c) + G*(−f − f_c)]</span>.{' '}
        {mode === 'real' ? (
          <>
            Με <span className="font-mono">g(t)</span> πραγματικό ισχύει{' '}
            <span className="font-mono">G*(−f) = G(f)</span> (συζυγής συμμετρία), οπότε
            το <span style={{ color: VIOLET }}>αριστερό αντίγραφο</span> βγαίνει{' '}
            <strong>ίδιο</strong> με το <span style={{ color: ACCENT }}>δεξί</span>: το
            φάσμα είναι <strong>συμμετρικό</strong> γύρω από το 0. Έτσι μοιάζουν{' '}
            <strong>AM</strong> και <strong>DSB-SC</strong>.
          </>
        ) : (
          <>
            Με <span className="font-mono">g(t)</span> μιγαδικό το{' '}
            <span className="font-mono">G(f)</span> είναι ασύμμετρο (εδώ ζει μόνο στις
            θετικές συχνότητες — η μία sideband). Το{' '}
            <span style={{ color: VIOLET }}>αριστερό αντίγραφο</span> είναι το{' '}
            <strong>κατοπτρικό-συζυγές</strong> <span className="font-mono">G*</span>,{' '}
            <strong>όχι ίδιο</strong> με το <span style={{ color: ACCENT }}>δεξί</span>:
            το φάσμα βγαίνει <strong>μη συμμετρικό</strong>. Αυτό είναι το χαρακτηριστικό
            της <strong>SSB</strong>.
          </>
        )}
      </div>
    </figure>
  )
}
