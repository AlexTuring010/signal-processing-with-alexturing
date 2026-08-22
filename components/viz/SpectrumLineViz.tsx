'use client'

import { useId, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * SpectrumLineViz — the figure you would draw on the exam paper for
 * «σχεδιάστε το φάσμα πλάτους (και φάσης)».
 *
 * A past-exam draw problem almost never gives numeric frequencies: it says
 * "±f₁, ±f₂, ±f₃" or "±k·f_c". So this component does NOT take a signal and
 * compute a spectrum — the *caller* passes the finished lines, each with its
 * own symbolic tick label ("−f₂") and its own height label ("B/2"). That is
 * exactly the information the student has to put on paper, and it keeps the
 * figure honest: nothing is drawn that the solution has not already derived.
 *
 * Spec: `plans/DRAW_PROBLEM_AUDIT.md` §5 (viz #2).
 *
 * Serves: `jan26-th2-10`, `jun25-th1-7`, `jun25-th1-4` (foundations
 * impulse-line cluster) and the multi-harmonic AM spectra.
 *
 * Interaction: tapping a line selects it and prints its exact triple
 * (θέση / ύψος / φάση) underneath — so on a phone you can check one line at a
 * time instead of squinting at overlapping labels.
 */

export type SpectrumLine = {
  /** Position on the frequency axis, in whatever unit the caller is using. */
  f: number
  /** Height of the line in the amplitude panel. Must be ≥ 0. */
  mag: number
  /** Phase in radians, for the phase panel. Omit for lines with no phase. */
  phase?: number
  /** Tick label under the axis, e.g. `−f₂` or `2f_c`. Falls back to the number. */
  tick?: string
  /** Label above the line head, e.g. `B/2`. Falls back to the number. */
  magLabel?: string
  /** Label next to the phase head, e.g. `−π/4`. Falls back to a π-fraction. */
  phaseLabel?: string
}

type Props = {
  lines: SpectrumLine[]
  /** Figure heading. */
  title?: string
  /** One-or-two-sentence «τι κοιτάς» under the figure. */
  caption?: ReactNode
  /** Draw arrowheads (δ-impulses) or flat-topped stems. Default: impulses. */
  kind?: 'impulse' | 'stem'
  /** Show the phase panel. Default: true when any line carries a phase. */
  showPhase?: boolean
  /** Axis label for the amplitude panel. */
  magAxisLabel?: string
  /** Axis label for the phase panel. */
  phaseAxisLabel?: string
  /** Frequency axis label. */
  freqAxisLabel?: string
}

const W = 720
const PAD_L = 54
const PAD_R = 22
const MAG_H = 190
const PHASE_H = 168
const MAG_TOP = 30
const MAG_BASE = MAG_H - 46
const PHASE_MID = PHASE_H / 2

/** Render a radian value as a π-fraction: 0.7853… → «π/4». */
function piLabel(p: number): string {
  if (Math.abs(p) < 1e-9) return '0'
  const r = p / Math.PI
  const sign = r < 0 ? '−' : ''
  const a = Math.abs(r)
  const denoms = [1, 2, 3, 4, 6, 8, 12]
  for (const d of denoms) {
    const n = a * d
    if (Math.abs(n - Math.round(n)) < 1e-6) {
      const num = Math.round(n)
      if (d === 1) return `${sign}${num === 1 ? '' : num}π`
      return `${sign}${num === 1 ? '' : num}π/${d}`
    }
  }
  return `${p.toFixed(2)} rad`
}

/** Trim a float for display: 2 → «2», 0.5 → «0.5». */
function num(v: number): string {
  return Number.isInteger(v) ? String(v) : String(Number(v.toFixed(3)))
}

export function SpectrumLineViz({
  lines,
  title,
  caption,
  kind = 'impulse',
  showPhase,
  magAxisLabel = '|X(f)|',
  phaseAxisLabel = '∠X(f)',
  freqAxisLabel = 'f',
}: Props) {
  const uid = useId().replace(/[:]/g, '')
  const [selected, setSelected] = useState<number | null>(null)

  const hasPhase = lines.some((l) => l.phase !== undefined)
  const withPhase = showPhase ?? hasPhase

  const { xOf, yMagOf, yPhaseOf } = useMemo(() => {
    const fs = lines.map((l) => l.f)
    const lo = Math.min(...fs, 0)
    const hi = Math.max(...fs, 0)
    const span = hi - lo || 1
    // 12% breathing room on each side so the outermost label is not clipped.
    const fMin = lo - span * 0.12
    const fMax = hi + span * 0.12
    const magMax = Math.max(...lines.map((l) => l.mag), 1e-9)

    const xOf = (f: number) =>
      PAD_L + ((f - fMin) / (fMax - fMin)) * (W - PAD_L - PAD_R)
    const yMagOf = (m: number) => MAG_BASE - (m / magMax) * (MAG_BASE - MAG_TOP)
    const yPhaseOf = (p: number) => PHASE_MID - (p / Math.PI) * (PHASE_MID - 26)

    return { xOf, yMagOf, yPhaseOf }
  }, [lines])

  const sel = selected !== null ? lines[selected] : null

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      {title && (
        <h4 className="mb-1 text-sm font-semibold tracking-tight">{title}</h4>
      )}
      <p className="mb-3 text-xs text-fg-muted">
        Πάτα μια γραμμή για να δεις ακριβώς τι γράφεις δίπλα της.
      </p>

      {/* ── Amplitude panel ─────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${MAG_H}`}
          className="block h-auto w-full min-w-[320px]"
          role="img"
          aria-label={`Φάσμα πλάτους: ${lines.length} γραμμές`}
        >
          <defs>
            <marker
              id={`head-${uid}`}
              markerWidth="9"
              markerHeight="9"
              refX="4.5"
              refY="4.5"
              orient="auto"
            >
              <path d="M1,1 L8,4.5 L1,8 z" fill="rgb(var(--accent))" />
            </marker>
            <marker
              id={`head-sel-${uid}`}
              markerWidth="9"
              markerHeight="9"
              refX="4.5"
              refY="4.5"
              orient="auto"
            >
              <path d="M1,1 L8,4.5 L1,8 z" fill="rgb(var(--danger))" />
            </marker>
          </defs>

          {/* y axis */}
          <line
            x1={xOf(0)}
            y1={MAG_TOP - 14}
            x2={xOf(0)}
            y2={MAG_BASE}
            stroke="rgb(var(--border-strong))"
            strokeWidth="1"
          />
          {/* f axis */}
          <line
            x1={PAD_L - 14}
            y1={MAG_BASE}
            x2={W - 6}
            y2={MAG_BASE}
            stroke="rgb(var(--fg-muted))"
            strokeWidth="1.2"
          />
          <text
            x={W - 4}
            y={MAG_BASE + 15}
            textAnchor="end"
            className="fill-[rgb(var(--fg-muted))] text-[13px] italic"
          >
            {freqAxisLabel}
          </text>
          <text
            x={PAD_L - 18}
            y={MAG_TOP - 16}
            textAnchor="start"
            className="fill-[rgb(var(--fg-muted))] text-[13px]"
          >
            {magAxisLabel}
          </text>

          {lines.map((l, i) => {
            const x = xOf(l.f)
            const y = yMagOf(l.mag)
            const active = selected === i
            return (
              <g
                key={`m${i}`}
                onClick={() => setSelected(active ? null : i)}
                className="cursor-pointer"
              >
                {/* generous invisible hit area — thumbs are wider than 2px */}
                <rect
                  x={x - 16}
                  y={MAG_TOP - 16}
                  width={32}
                  height={MAG_BASE - MAG_TOP + 34}
                  fill="transparent"
                />
                <line
                  x1={x}
                  y1={MAG_BASE}
                  x2={x}
                  y2={y}
                  stroke={active ? 'rgb(var(--danger))' : 'rgb(var(--accent))'}
                  strokeWidth={active ? 3 : 2}
                  markerEnd={
                    kind === 'impulse'
                      ? `url(#head-${active ? 'sel-' : ''}${uid})`
                      : undefined
                  }
                />
                {kind === 'stem' && (
                  <circle
                    cx={x}
                    cy={y}
                    r={active ? 4.5 : 3.5}
                    fill={active ? 'rgb(var(--danger))' : 'rgb(var(--accent))'}
                  />
                )}
                <text
                  x={x}
                  y={y - 12}
                  textAnchor="middle"
                  className={
                    active
                      ? 'fill-[rgb(var(--danger))] text-[12px] font-semibold'
                      : 'fill-[rgb(var(--fg))] text-[12px]'
                  }
                >
                  {l.magLabel ?? num(l.mag)}
                </text>
                <text
                  x={x}
                  y={MAG_BASE + 17}
                  textAnchor="middle"
                  className={
                    active
                      ? 'fill-[rgb(var(--danger))] text-[12px] font-semibold'
                      : 'fill-[rgb(var(--fg-muted))] text-[12px]'
                  }
                >
                  {l.tick ?? num(l.f)}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* ── Phase panel ─────────────────────────────────────────────── */}
      {withPhase && (
        <div className="mt-2 overflow-x-auto border-t border-border pt-2">
          <svg
            viewBox={`0 0 ${W} ${PHASE_H}`}
            className="block h-auto w-full min-w-[320px]"
            role="img"
            aria-label="Φάσμα φάσης"
          >
            {/* zero line = the f axis */}
            <line
              x1={PAD_L - 14}
              y1={PHASE_MID}
              x2={W - 6}
              y2={PHASE_MID}
              stroke="rgb(var(--fg-muted))"
              strokeWidth="1.2"
            />
            {/* y axis */}
            <line
              x1={xOf(0)}
              y1={20}
              x2={xOf(0)}
              y2={PHASE_H - 16}
              stroke="rgb(var(--border-strong))"
              strokeWidth="1"
            />
            {/* ±π guide rails */}
            {[1, -1].map((s) => (
              <g key={s}>
                <line
                  x1={PAD_L - 14}
                  y1={yPhaseOf(s * Math.PI)}
                  x2={W - 6}
                  y2={yPhaseOf(s * Math.PI)}
                  stroke="rgb(var(--border))"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={PAD_L - 18}
                  y={yPhaseOf(s * Math.PI) + 4}
                  textAnchor="end"
                  className="fill-[rgb(var(--fg-subtle))] text-[11px]"
                >
                  {s > 0 ? 'π' : '−π'}
                </text>
              </g>
            ))}
            <text
              x={PAD_L - 18}
              y={PHASE_MID + 4}
              textAnchor="end"
              className="fill-[rgb(var(--fg-subtle))] text-[11px]"
            >
              0
            </text>
            <text
              x={W - 4}
              y={PHASE_MID + 15}
              textAnchor="end"
              className="fill-[rgb(var(--fg-muted))] text-[13px] italic"
            >
              {freqAxisLabel}
            </text>
            <text
              x={PAD_L - 18}
              y={16}
              textAnchor="start"
              className="fill-[rgb(var(--fg-muted))] text-[13px]"
            >
              {phaseAxisLabel}
            </text>

            {lines.map((l, i) => {
              if (l.phase === undefined) return null
              const x = xOf(l.f)
              const y = yPhaseOf(l.phase)
              const active = selected === i
              const above = l.phase >= 0
              return (
                <g
                  key={`p${i}`}
                  onClick={() => setSelected(active ? null : i)}
                  className="cursor-pointer"
                >
                  <rect
                    x={x - 16}
                    y={16}
                    width={32}
                    height={PHASE_H - 32}
                    fill="transparent"
                  />
                  <line
                    x1={x}
                    y1={PHASE_MID}
                    x2={x}
                    y2={y}
                    stroke={active ? 'rgb(var(--danger))' : 'rgb(var(--success))'}
                    strokeWidth={active ? 3 : 2}
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={active ? 4.5 : 3.5}
                    fill={active ? 'rgb(var(--danger))' : 'rgb(var(--success))'}
                  />
                  <text
                    x={x}
                    y={above ? y - 10 : y + 18}
                    textAnchor="middle"
                    className={
                      active
                        ? 'fill-[rgb(var(--danger))] text-[12px] font-semibold'
                        : 'fill-[rgb(var(--fg))] text-[12px]'
                    }
                  >
                    {l.phaseLabel ?? piLabel(l.phase)}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      )}

      {/* ── Readout ─────────────────────────────────────────────────── */}
      <div className="mt-3 min-h-[2.5rem] rounded-md border border-border bg-bg-soft px-3 py-2 text-xs text-fg-muted">
        {sel ? (
          <span className="font-mono tabular-nums text-fg">
            θέση f = {sel.tick ?? num(sel.f)} · ύψος {sel.magLabel ?? num(sel.mag)}
            {sel.phase !== undefined && (
              <> · φάση {sel.phaseLabel ?? piLabel(sel.phase)}</>
            )}
          </span>
        ) : (
          <>
            {lines.length} γραμμές συνολικά
            {withPhase && ' (πλάτος + φάση)'}. Διάλεξε μία για τα ακριβή νούμερα.
          </>
        )}
      </div>

      {caption && (
        <figcaption className="mt-2 text-xs leading-relaxed text-fg-subtle">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
