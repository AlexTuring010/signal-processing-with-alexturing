'use client'

/**
 * Baseband vs Bandpass spectrum — the two slide-21 / slide-23 figures, made
 * interactive on exactly the parameters the definitions are about.
 *
 *   mode="baseband":  one triangle |X(f)| centred at f = 0, vertices at ±W.
 *                     Definition: X(f) = 0 for |f| ≥ W. The student drags W
 *                     and watches the support (−W, W) grow/shrink while the
 *                     "X(f) = 0" regions stay glued to the edges.
 *
 *   mode="bandpass":  twin triangles centred at ±f_c, each spanning
 *                     (f_c − W, f_c + W). Definition: X(f) = 0 for
 *                     |f − f_c| ≥ W. Dragging f_c slides the lumps out from 0
 *                     (the empty DC gap appears); the live W/f_c readout shows
 *                     the narrowband condition W ≪ f_c.
 *
 * Faithful to the course slides (triangular |X(f)| sketch). Distinct from
 * BasebandToRfShiftPlayground, which answers a different question (which parts
 * of a *modulated* spectrum each AM variant keeps).
 */

import { useState } from 'react'

const ACCENT = 'rgb(29,78,216)'
const ACCENT_FILL = 'rgba(29,78,216,0.18)'
const AMBER = 'rgb(217,119,6)'

const WIDTH = 560
const HEIGHT = 210
const PAD_X = 44
const PAD_Y = 24
const BASE_Y = 168 // f-axis baseline
const APEX_Y = PAD_Y + 18 // top of a unit-height triangle

type Mode = 'baseband' | 'bandpass'

export function BasebandBandpassSpectrumViz({ mode }: { mode: Mode }) {
  const [w, setW] = useState(mode === 'baseband' ? 1.0 : 0.8)
  const [fc, setFc] = useState(3.0)

  const fView = mode === 'baseband' ? 2.6 : 5.5
  const xOf = (f: number) => PAD_X + ((f + fView) / (2 * fView)) * (WIDTH - 2 * PAD_X)
  const yOf = (v: number) => BASE_Y - Math.max(0, v) * (BASE_Y - APEX_Y)

  // One triangle of unit height centred at c, half-width W.
  const triangle = (c: number) =>
    `M ${xOf(c - w)} ${BASE_Y} L ${xOf(c)} ${APEX_Y} L ${xOf(c + w)} ${BASE_Y} Z`

  const ratio = w / fc

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        {mode === 'baseband'
          ? 'Σήμα βασικής ζώνης: ένα λούτσο γύρω από το 0'
          : 'Ζωνοπερατό σήμα: δύο λούτσα γύρω από τα ±f_c'}
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        {mode === 'baseband' ? (
          <>
            Το φάσμα <span className="font-mono">|X(f)|</span> ζει{' '}
            <strong>γύρω από τη μηδενική συχνότητα</strong>. Σύρε το{' '}
            <span className="font-mono">W</span>: το σήμα ζει στο διάστημα{' '}
            <span className="font-mono">(−W, +W)</span> και έξω από εκεί{' '}
            <span className="font-mono">X(f) = 0</span>.
          </>
        ) : (
          <>
            Το ίδιο λούτσο, αλλά τώρα <strong>μετατοπισμένο στα ±f_c</strong> —
            μακριά από το 0. Σύρε το <span className="font-mono">f_c</span> και
            δες τα δύο λούτσα να απομακρύνονται, αφήνοντας{' '}
            <strong>άδειο κενό γύρω από το 0</strong>.
          </>
        )}
      </p>

      <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="block w-full text-fg"
          role="img"
          aria-label={
            mode === 'baseband'
              ? 'Τριγωνικό φάσμα βασικής ζώνης κεντραρισμένο στο μηδέν, με μηδέν φάσμα πέρα από τα ±W'
              : 'Δύο τριγωνικά φάσματα κεντραρισμένα στα συν και πλην f_c, με άδειο κενό γύρω από το μηδέν'
          }
        >
          {/* f-axis */}
          <line
            x1={PAD_X - 8}
            y1={BASE_Y}
            x2={WIDTH - PAD_X + 12}
            y2={BASE_Y}
            stroke="currentColor"
            strokeOpacity="0.45"
          />
          <polygon
            points={`${WIDTH - PAD_X + 18},${BASE_Y} ${WIDTH - PAD_X + 8},${BASE_Y - 4} ${WIDTH - PAD_X + 8},${BASE_Y + 4}`}
            fill="currentColor"
            fillOpacity="0.5"
          />
          <text
            x={WIDTH - PAD_X + 22}
            y={BASE_Y + 4}
            fontSize="11"
            fill="currentColor"
            fillOpacity="0.7"
            fontStyle="italic"
          >
            f
          </text>

          {/* |X(f)| vertical axis at f = 0 */}
          <line
            x1={xOf(0)}
            y1={BASE_Y + 4}
            x2={xOf(0)}
            y2={PAD_Y - 6}
            stroke="currentColor"
            strokeOpacity="0.4"
          />
          <polygon
            points={`${xOf(0)},${PAD_Y - 12} ${xOf(0) - 4},${PAD_Y - 2} ${xOf(0) + 4},${PAD_Y - 2}`}
            fill="currentColor"
            fillOpacity="0.5"
          />

          {mode === 'baseband' ? (
            <>
              {/* faded "X(f) = 0" regions beyond ±W */}
              <text
                x={(xOf(w) + xOf(fView)) / 2}
                y={BASE_Y - 8}
                textAnchor="middle"
                fontSize="9"
                fill="currentColor"
                fillOpacity="0.45"
              >
                X(f) = 0
              </text>
              <text
                x={(xOf(-w) + xOf(-fView)) / 2}
                y={BASE_Y - 8}
                textAnchor="middle"
                fontSize="9"
                fill="currentColor"
                fillOpacity="0.45"
              >
                X(f) = 0
              </text>

              {/* the triangle */}
              <path d={triangle(0)} fill={ACCENT_FILL} stroke={ACCENT} strokeWidth="1.8" />

              {/* edge guides at ±W */}
              {[-w, w].map((edge) => (
                <line
                  key={edge}
                  x1={xOf(edge)}
                  y1={BASE_Y}
                  x2={xOf(edge)}
                  y2={BASE_Y + 5}
                  stroke="currentColor"
                  strokeOpacity="0.5"
                />
              ))}

              {/* |X(f)| label at the apex */}
              <text x={xOf(0) + 8} y={APEX_Y + 10} fontSize="11" fill={ACCENT}>
                |X(f)|
              </text>

              {/* x ticks: −W, 0, W */}
              <g fontSize="11" fill="currentColor" fillOpacity="0.85" fontStyle="italic">
                <text x={xOf(-w)} y={BASE_Y + 17} textAnchor="middle">
                  −W
                </text>
                <text x={xOf(0)} y={BASE_Y + 17} textAnchor="middle" fontStyle="normal">
                  0
                </text>
                <text x={xOf(w)} y={BASE_Y + 17} textAnchor="middle">
                  W
                </text>
              </g>
            </>
          ) : (
            <>
              {/* faded "X(f) = 0" in the empty DC gap */}
              <text
                x={xOf(0)}
                y={BASE_Y - 8}
                textAnchor="middle"
                fontSize="9"
                fill="currentColor"
                fillOpacity="0.45"
              >
                X(f) = 0
              </text>

              {/* ±f_c carrier guides */}
              {[fc, -fc].map((c) => (
                <g key={c}>
                  <line
                    x1={xOf(c)}
                    y1={BASE_Y}
                    x2={xOf(c)}
                    y2={APEX_Y - 4}
                    stroke={AMBER}
                    strokeOpacity="0.55"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={xOf(c)}
                    y={PAD_Y - 2}
                    textAnchor="middle"
                    fontSize="11"
                    fill={AMBER}
                  >
                    {c > 0 ? 'f_c' : '−f_c'}
                  </text>
                </g>
              ))}

              {/* the two triangles */}
              <path d={triangle(fc)} fill={ACCENT_FILL} stroke={ACCENT} strokeWidth="1.8" />
              <path d={triangle(-fc)} fill={ACCENT_FILL} stroke={ACCENT} strokeWidth="1.8" />

              {/* |X(f)| label on the right lump */}
              <text x={xOf(fc) + 8} y={APEX_Y + 10} fontSize="11" fill={ACCENT}>
                |X(f)|
              </text>

              {/* half-width W bracket: f_c → f_c + W (right lump) */}
              <g stroke={ACCENT} strokeOpacity="0.8" strokeWidth="1">
                <line x1={xOf(fc)} y1={BASE_Y + 8} x2={xOf(fc + w)} y2={BASE_Y + 8} />
                <line x1={xOf(fc)} y1={BASE_Y + 5} x2={xOf(fc)} y2={BASE_Y + 11} />
                <line x1={xOf(fc + w)} y1={BASE_Y + 5} x2={xOf(fc + w)} y2={BASE_Y + 11} />
              </g>
              <text
                x={(xOf(fc) + xOf(fc + w)) / 2}
                y={BASE_Y + 20}
                textAnchor="middle"
                fontSize="10"
                fill={ACCENT}
                fontStyle="italic"
              >
                W
              </text>

              {/* 0 tick */}
              <text x={xOf(0)} y={BASE_Y + 17} textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity="0.85">
                0
              </text>
            </>
          )}
        </svg>
      </div>

      {/* sliders */}
      <div className="mt-3 space-y-2">
        {mode === 'bandpass' && (
          <label className="block text-xs text-fg-muted">
            Συχνότητα φέροντος f_c ={' '}
            <span className="font-mono tabular-nums text-fg">{fc.toFixed(2)}</span>
            <input
              type="range"
              min={1.5}
              max={4.0}
              step={0.05}
              value={fc}
              onChange={(e) => setFc(parseFloat(e.target.value))}
              className="mt-1 w-full accent-[rgb(var(--accent))]"
              aria-label="Carrier frequency f_c"
            />
          </label>
        )}
        <label className="block text-xs text-fg-muted">
          Ημι-εύρος ζώνης W ={' '}
          <span className="font-mono tabular-nums text-fg">{w.toFixed(2)}</span>
          <input
            type="range"
            min={mode === 'baseband' ? 0.4 : 0.3}
            max={mode === 'baseband' ? 2.0 : 1.2}
            step={0.05}
            value={w}
            onChange={(e) => setW(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Bandwidth W"
          />
        </label>
      </div>

      {/* teaching readout */}
      <div className="mt-2 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        {mode === 'baseband' ? (
          <>
            Μαθηματικός ορισμός: <span className="font-mono">X(f) = 0 για |f| ≥ W</span>.
            Το σήμα ζει αποκλειστικά στο <span className="font-mono">(−{w.toFixed(2)}, +{w.toFixed(2)})</span> —
            όλη η ενέργειά του είναι στις <strong>χαμηλές συχνότητες</strong>, γύρω από το 0.
            Έτσι μοιάζει το audio από ένα μικρόφωνο ή ένα composite video signal πριν τη διαμόρφωση.
          </>
        ) : (
          <>
            Μαθηματικός ορισμός: <span className="font-mono">X(f) = 0 για |f − f_c| ≥ W</span>.
            Κάθε λούτσο ζει στο <span className="font-mono">(f_c − W, f_c + W)</span>, και γύρω από το 0 το φάσμα είναι άδειο.
            Λόγος <span className="font-mono">W / f_c = {ratio.toFixed(2)}</span>
            {ratio < 0.2 ? (
              <> — αρκετά μικρός ώστε να μιλάμε για <strong>narrowband (σήμα στενής ζώνης)</strong>, η συνηθισμένη υπόθεση <span className="font-mono">W ≪ f_c</span>.</>
            ) : (
              <> — σύρε το <span className="font-mono">f_c</span> ψηλότερα (ή το W χαμηλότερα) ώσπου ο λόγος να γίνει <span className="font-mono">≪ 1</span>: τότε έχεις <strong>narrowband</strong>.</>
            )}
          </>
        )}
      </div>
    </figure>
  )
}
