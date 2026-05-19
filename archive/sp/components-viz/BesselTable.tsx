'use client'

import { useState } from 'react'
import { besselJ } from '@/lib/bessel'

/**
 * Interactive J_n(β) lookup table — mirrors the typology that students
 * receive on the exam. Drag a slider for β, the columns highlight the
 * |J_n(β)| values. Useful for exam practice without doing the integral
 * by hand.
 *
 * The official typology gives values at β = 0.25, 0.5, 1.0, 2.0, 5.0, 8.0
 * (rough memory). We give the student the freedom to enter any β so they
 * can verify what they computed.
 */

const PRESET_BETAS = [0.1, 0.25, 0.5, 1.0, 1.5, 2.0, 2.4, 2.405, 3.0, 5.0, 5.52, 8.0]
const N_VALUES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export function BesselTable() {
  const [beta, setBeta] = useState(2.0)

  const values = N_VALUES.map((n) => ({
    n,
    j: besselJ(n, beta),
  }))

  // Find which n is the dominant peak so we can highlight it
  const peakN = values.reduce(
    (best, cur) => (Math.abs(cur.j) > Math.abs(best.j) ? cur : best),
    values[0],
  ).n

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Bessel J<sub>n</sub>(β) — interactive lookup
        </h4>
        <div className="flex flex-wrap gap-1">
          {PRESET_BETAS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setBeta(p)}
              className={`rounded-full border px-2 py-0.5 font-mono text-[11px] ${
                Math.abs(beta - p) < 0.005
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-3 text-xs text-fg-muted">
        Σύρε το β. Κάθε στήλη δείχνει τη συνεισφορά της <span className="font-mono">n</span>
        -οστής sideband. Πράσινο = θετικό· κόκκινο = αρνητικό. Η <strong>έντονη</strong>{' '}
        στήλη είναι η μεγαλύτερη σε μέτρο.
      </p>

      <div className="mb-3">
        <label className="block text-xs text-fg-muted">
          β = <span className="font-mono text-fg tabular-nums">{beta.toFixed(3)}</span>
        </label>
        <input
          type="range"
          min={0}
          max={10}
          step={0.005}
          value={beta}
          onChange={(e) => setBeta(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Modulation index beta"
        />
      </div>

      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full table-fixed text-xs">
          <thead>
            <tr className="bg-bg-soft">
              <th className="px-2 py-2 text-left font-mono text-fg-muted">n</th>
              {N_VALUES.map((n) => (
                <th
                  key={n}
                  className={`px-1 py-2 text-center font-mono ${
                    n === peakN ? 'bg-accent/15 text-accent' : 'text-fg-muted'
                  }`}
                >
                  {n}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="px-2 py-2 text-left font-mono text-fg-muted">
                J<sub>n</sub>(β)
              </th>
              {values.map(({ n, j }) => {
                const positive = j > 0
                const intensity = Math.min(1, Math.abs(j) / 0.6)
                const opacity = 0.1 + intensity * 0.5
                const bg = positive
                  ? `rgba(34, 197, 94, ${opacity})`
                  : `rgba(220, 38, 38, ${opacity})`
                return (
                  <td
                    key={n}
                    className={`px-1 py-2 text-center font-mono tabular-nums ${
                      n === peakN ? 'font-bold' : ''
                    }`}
                    style={{ background: bg }}
                  >
                    {j.toFixed(3)}
                  </td>
                )
              })}
            </tr>
            <tr className="border-t border-border">
              <th className="px-2 py-2 text-left font-mono text-fg-muted">|J<sub>n</sub>|²</th>
              {values.map(({ n, j }) => (
                <td
                  key={n}
                  className="px-1 py-2 text-center font-mono text-fg-muted tabular-nums"
                >
                  {(j * j).toFixed(3)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-[11px] text-fg-subtle">
        Property check: <span className="font-mono">J₀(β)² + 2·Σₙ₌₁ Jₙ(β)² = 1</span>{' '}
        — δηλαδή η συνολική ισχύς διατηρείται. Σύνολο των τιμών εδώ:{' '}
        <span className="font-mono text-fg">
          {(
            values[0].j ** 2 +
            2 * values.slice(1).reduce((s, { j }) => s + j * j, 0)
          ).toFixed(4)}
        </span>{' '}
        (πρέπει να είναι ≈ 1 για αρκετές n).
      </p>
    </figure>
  )
}
