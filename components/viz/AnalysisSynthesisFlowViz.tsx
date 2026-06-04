'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { getThemeColors, setupCanvas } from '@/lib/canvas'
import { cn } from '@/lib/utils'

type Colors = NonNullable<ReturnType<typeof getThemeColors>>

/**
 * Slide 21 of session 4 (theory2): «Ανάλυση και Σύνθεση Σημάτων».
 *
 *   x(t)  ──── Ανάλυση συχνοτήτων ───►  {(f_k, A_k)}_k  ──── Σύνθεση ────►  x(t)
 *
 * The prof's data-flow diagram showing the analyze/synthesize cycle. The
 * viz makes the cycle interactive: pick a signal, see its harmonics
 * extracted as (frequency, amplitude) pairs, then *perturb* the
 * amplitudes via sliders and watch the synthesized signal drift away
 * from the original. Closes the loop visually — synthesis with the
 * extracted a_k reproduces x(t); changing them produces a different
 * signal.
 *
 * Why a bespoke viz when SpectrumViewer exists: SpectrumViewer shows
 * time + spectrum as static dual views. This viz frames it as a
 * pipeline with an editable middle, which is the prof's actual
 * pedagogical move on slide 21 — the «κατάλληλες ποσότητες» are not just
 * coordinates, they are knobs the student can turn.
 */

type Preset = {
  id: string
  label: string
  description: string
  // Cosine-form amplitudes: x(t) = Σ_{k≥0} A_k cos(2π k f0 t + φ_k)
  // (real form; k=0 is DC; we only store k ≥ 0 since the conjugate is implied)
  components: Array<{ k: number; A: number; phi: number }>
}

const T0 = 1.0
const F0 = 1 / T0

const PRESETS: Preset[] = [
  {
    id: 'three-tones',
    label: '3 αρμονικές',
    description:
      'Άθροισμα 3 cosines στις f₀, 2f₀, 3f₀. Το πιο απλό «μη-cosine» periodic σήμα.',
    components: [
      { k: 1, A: 1.0, phi: 0 },
      { k: 2, A: 0.5, phi: 0 },
      { k: 3, A: 0.33, phi: 0 },
    ],
  },
  {
    id: 'square',
    label: 'Τετραγωνικός παλμός',
    description:
      'Μόνο περιττές αρμονικές, μέτρα φθίνουν σαν 1/k. Η DC είναι 0.5 (μέσος όρος).',
    components: [
      { k: 0, A: 0.5, phi: 0 },
      { k: 1, A: 2 / Math.PI, phi: 0 },
      { k: 3, A: 2 / (3 * Math.PI), phi: 0 },
      { k: 5, A: 2 / (5 * Math.PI), phi: 0 },
    ],
  },
  {
    id: 'sawtooth',
    label: 'Πριονοκυματικό',
    description:
      'Όλες οι αρμονικές παρόντες (άρτιες + περιττές), μέτρα φθίνουν σαν 1/k.',
    components: [
      { k: 1, A: 2 / Math.PI, phi: -Math.PI / 2 },
      { k: 2, A: 1 / Math.PI, phi: -Math.PI / 2 },
      { k: 3, A: 2 / (3 * Math.PI), phi: -Math.PI / 2 },
      { k: 4, A: 1 / (2 * Math.PI), phi: -Math.PI / 2 },
    ],
  },
  {
    id: 'phase-shifted',
    label: 'Με phase shift',
    description:
      'Η ίδια αρμονική περιεχομένη, αλλά διαφορετικές φάσεις — το σχήμα στον χρόνο αλλάζει εντελώς.',
    components: [
      { k: 1, A: 1.0, phi: Math.PI / 4 },
      { k: 2, A: 0.7, phi: -Math.PI / 3 },
      { k: 3, A: 0.4, phi: Math.PI / 2 },
    ],
  },
]

export function AnalysisSynthesisFlowViz() {
  const [presetId, setPresetId] = useState<string>('three-tones')
  const preset = PRESETS.find((p) => p.id === presetId)!

  // Per-k amplitude scale (0..1.5 of original), 0 = component removed.
  const [scale, setScale] = useState<Record<number, number>>({})

  // Reset scales when preset changes
  const presetSig = preset.id
  useEffect(() => {
    setScale({})
  }, [presetSig])

  // The "extracted" components (the row of (f_k, A_k) shown in the middle column)
  const extracted = useMemo(() => {
    return preset.components.map((c) => ({
      k: c.k,
      A: c.A,
      phi: c.phi,
      Aeff: c.A * (scale[c.k] ?? 1),
    }))
  }, [preset, scale])

  // Did the user perturb anything?
  const perturbed = useMemo(() => {
    return Object.keys(scale).some((k) => Math.abs((scale[Number(k)] ?? 1) - 1) > 1e-6)
  }, [scale])

  const origRef = useRef<HTMLCanvasElement | null>(null)
  const synthRef = useRef<HTMLCanvasElement | null>(null)
  const spectrumRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (origRef.current) drawTime(origRef.current, colors, preset.components, 'orig')
    if (synthRef.current)
      drawTime(
        synthRef.current,
        colors,
        extracted.map((c) => ({ k: c.k, A: c.Aeff, phi: c.phi })),
        perturbed ? 'modified' : 'orig',
      )
    if (spectrumRef.current) drawSpectrum(spectrumRef.current, colors, extracted, perturbed)
  }, [preset.components, extracted, perturbed])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Ο κύκλος ανάλυσης / σύνθεσης
      </h4>
      <p className="mb-3 text-xs text-fg-muted">{preset.description}</p>

      <div
        role="radiogroup"
        aria-label="Προεπιλογές σήματος"
        className="mb-3 inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
      >
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={presetId === p.id}
            onClick={() => setPresetId(p.id)}
            className={cn(
              'rounded-full px-2.5 py-0.5 transition-colors',
              presetId === p.id
                ? 'bg-accent text-accent-fg'
                : 'text-fg-muted hover:text-fg',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-start">
        {/* LEFT: original signal */}
        <Panel
          title="x(t) — αρχικό"
          subtitle="Είσοδος στην ανάλυση"
          tone="orig"
        >
          <canvas
            ref={origRef}
            style={{ height: 130 }}
            className="block h-[130px] w-full"
            aria-label="Original time-domain signal"
          />
        </Panel>

        {/* MIDDLE: arrows + extracted (f_k, A_k) table with sliders */}
        <div className="lg:py-2">
          <div className="mb-2 hidden items-center justify-center text-[11px] text-accent lg:flex">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            <span className="ml-1 font-medium">Ανάλυση</span>
          </div>
          <div className="rounded-md border border-border bg-bg-soft px-2.5 py-2">
            <div className="mb-1 text-[10px] uppercase tracking-wider text-fg-subtle">
              Συνιστώσες
            </div>
            <table className="w-full text-[11px] tabular-nums">
              <thead>
                <tr className="text-left text-fg-subtle">
                  <th className="pr-2 pb-1 font-medium">k</th>
                  <th className="pr-2 pb-1 font-medium">f</th>
                  <th className="pb-1 font-medium">A_k</th>
                </tr>
              </thead>
              <tbody>
                {extracted.map((c) => {
                  const s = scale[c.k] ?? 1
                  return (
                    <tr key={c.k}>
                      <td className="pr-2 py-0.5 font-mono text-fg-muted">{c.k}</td>
                      <td className="pr-2 py-0.5 font-mono text-fg-muted">
                        {c.k === 0 ? 'DC' : `${c.k}f₀`}
                      </td>
                      <td className="py-0.5">
                        <div className="flex items-center gap-1.5">
                          <input
                            type="range"
                            min="0"
                            max="1.5"
                            step="0.05"
                            value={s}
                            onChange={(e) =>
                              setScale((prev) => ({
                                ...prev,
                                [c.k]: parseFloat(e.target.value),
                              }))
                            }
                            className="w-14 accent-[rgb(var(--accent))]"
                            aria-label={`Πλάτος για αρμονική ${c.k}`}
                          />
                          <span className="w-9 font-mono text-fg">
                            {c.Aeff.toFixed(2)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {perturbed && (
              <button
                type="button"
                onClick={() => setScale({})}
                className="mt-2 inline-flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[10px] text-fg-muted hover:bg-bg-soft"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" />
                Επαναφορά
              </button>
            )}
          </div>
          <div className="mt-2 hidden items-center justify-center text-[11px] text-fg-muted lg:flex">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            <span className="ml-1 font-medium">Σύνθεση</span>
          </div>
        </div>

        {/* RIGHT: synthesized signal */}
        <Panel
          title={perturbed ? 'x̂(t) — με δικά σου A_k' : 'x̂(t) — αναπαραγμένο'}
          subtitle={
            perturbed
              ? 'Αλλάζοντας τα A_k, αλλάζει το σήμα'
              : 'Σύνθεση με αρχικά A_k = ίδιο σήμα'
          }
          tone={perturbed ? 'modified' : 'orig'}
        >
          <canvas
            ref={synthRef}
            style={{ height: 130 }}
            className="block h-[130px] w-full"
            aria-label="Synthesized time-domain signal"
          />
        </Panel>
      </div>

      {/* Bottom: amplitude spectrum reflecting current A_k */}
      <div className="mt-3">
        <Panel title="|a_k| — τι διάβασε η ανάλυση" subtitle="discrete spectrum στα k·f₀">
          <canvas
            ref={spectrumRef}
            style={{ height: 90 }}
            className="block h-[90px] w-full"
            aria-label="Amplitude spectrum of extracted components"
          />
        </Panel>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <p className="m-0">
          <strong>Δύο πράγματα να δοκιμάσεις.</strong> (1) Άσε τα A_k στις αρχικές
          τιμές: η σύνθεση αναπαράγει το αρχικό σήμα ακριβώς — η ανάλυση «έπιασε»
          όλη την πληροφορία. (2) Σύρε ένα slider στο μηδέν: η σύνθεση χάνει
          ακριβώς αυτή τη συνιστώσα συχνότητας — απόδειξη ότι κάθε αρμονική
          μεταφέρει <em>ξεχωριστή και ανεξάρτητη</em> πληροφορία.
        </p>
      </div>
    </figure>
  )
}

function Panel({
  title,
  subtitle,
  tone,
  children,
}: {
  title: string
  subtitle?: string
  tone?: 'orig' | 'modified'
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-md border bg-bg-soft px-3 py-2',
        tone === 'modified' ? 'border-amber-400/60' : 'border-border',
      )}
    >
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <div className="text-[11px] font-semibold tracking-tight">{title}</div>
        {subtitle && (
          <div className="text-[10px] text-fg-subtle">{subtitle}</div>
        )}
      </div>
      {children}
    </div>
  )
}

// ─── Drawing ───────────────────────────────────────────────────────

function drawTime(
  canvas: HTMLCanvasElement,
  colors: Colors,
  components: Array<{ k: number; A: number; phi: number }>,
  tone: 'orig' | 'modified',
) {
  const { ctx, w: W, h: H } = setupCanvas(canvas)
  ctx.clearRect(0, 0, W, H)

  const padL = 8
  const padR = 8
  const padT = 6
  const padB = 6
  const innerW = W - padL - padR
  const innerH = H - padT - padB
  const midY = padT + innerH / 2

  // Compute signal samples
  const N = 400
  const xs = new Float64Array(N)
  let maxAbs = 0
  for (let i = 0; i < N; i++) {
    const t = (i / (N - 1)) * (2 * T0) // show 2 periods
    let v = 0
    for (const c of components) {
      v += c.A * Math.cos(2 * Math.PI * c.k * F0 * t + c.phi)
    }
    xs[i] = v
    if (Math.abs(v) > maxAbs) maxAbs = Math.abs(v)
  }
  if (maxAbs < 0.001) maxAbs = 1
  const scale = (innerH / 2) * 0.92

  // Zero-line
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 0.8
  ctx.beginPath()
  ctx.moveTo(padL, midY)
  ctx.lineTo(W - padR, midY)
  ctx.stroke()

  // Period boundary markers at t = T0
  ctx.strokeStyle = colors.border
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  ctx.moveTo(padL + innerW / 2, padT)
  ctx.lineTo(padL + innerW / 2, H - padB)
  ctx.stroke()
  ctx.setLineDash([])

  // Signal trace
  ctx.strokeStyle = tone === 'modified' ? '#f59e0b' : colors.accent
  ctx.lineWidth = 1.6
  ctx.beginPath()
  for (let i = 0; i < N; i++) {
    const x = padL + (i / (N - 1)) * innerW
    const y = midY - (xs[i] / maxAbs) * scale
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // T0 label
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui'
  ctx.textAlign = 'center'
  ctx.fillText('T₀', padL + innerW / 2, H - 1)
}

function drawSpectrum(
  canvas: HTMLCanvasElement,
  colors: Colors,
  extracted: Array<{ k: number; A: number; Aeff: number }>,
  perturbed: boolean,
) {
  const { ctx, w: W, h: H } = setupCanvas(canvas)
  ctx.clearRect(0, 0, W, H)

  const padL = 30
  const padR = 12
  const padT = 8
  const padB = 22
  const innerW = W - padL - padR
  const innerH = H - padT - padB

  const baselineY = H - padB

  // Determine x-axis range (k from -kmax to +kmax)
  const kmax = Math.max(6, ...extracted.map((c) => c.k))
  // Max amplitude for scaling — use original (so perturbation is visible relative to baseline)
  const maxA = Math.max(0.5, ...extracted.map((c) => Math.max(c.A, c.Aeff))) * 1.1
  const xOf = (k: number) => padL + ((k + kmax) / (2 * kmax)) * innerW
  const yOf = (mag: number) => baselineY - (mag / maxA) * innerH

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, baselineY)
  ctx.lineTo(W - padR, baselineY)
  ctx.stroke()

  // y-axis at k=0
  ctx.strokeStyle = colors.border
  ctx.beginPath()
  ctx.moveTo(xOf(0), padT)
  ctx.lineTo(xOf(0), baselineY)
  ctx.stroke()

  // Tick labels (integer k)
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui'
  ctx.textAlign = 'center'
  for (let k = -kmax; k <= kmax; k++) {
    if (k === 0) continue
    const x = xOf(k)
    ctx.strokeStyle = colors.border
    ctx.beginPath()
    ctx.moveTo(x, baselineY)
    ctx.lineTo(x, baselineY + 3)
    ctx.stroke()
    if (k % 2 === 0 || kmax <= 5) ctx.fillText(String(k), x, baselineY + 14)
  }
  ctx.fillText('0', xOf(0), baselineY + 14)

  // Stems: draw the original amplitude as a faded grey "ghost" AND the current
  // value (solid) when perturbed, so you can see where each harmonic moved.
  // NB: colors.accent is an "rgb(r g b)" string — appending a hex-alpha suffix
  // ('55'/'88') yields an invalid color the canvas silently ignores, so the
  // ghost ends up inheriting the previous stroke (the amber). Use an explicit
  // faded grey instead: it reads as a neutral "where it was" marker.
  const ghost = 'rgba(100, 116, 139, 0.55)' // slate-500, faded
  for (const c of extracted) {
    if (c.k === 0) {
      // DC stem: render at k=0 with mag c.Aeff (no conjugate)
      drawStem(ctx, xOf(0), baselineY, yOf(c.Aeff / 2), '#0ea5e9', 3.5)
      if (perturbed && Math.abs(c.A - c.Aeff) > 1e-6)
        drawStem(ctx, xOf(0) + 4, baselineY, yOf(c.A / 2), ghost, 2)
      continue
    }
    // Each cosine A·cos(2πk f0 t + φ) contributes |a_k| = A/2 at ±k
    const magNew = c.Aeff / 2
    const magOld = c.A / 2
    // +k
    if (perturbed && Math.abs(c.A - c.Aeff) > 1e-6) {
      drawStem(ctx, xOf(c.k) + 2, baselineY, yOf(magOld), ghost, 1.5)
    }
    drawStem(ctx, xOf(c.k), baselineY, yOf(magNew), perturbed ? '#f59e0b' : colors.accent, 3.5)
    // -k (conjugate)
    if (perturbed && Math.abs(c.A - c.Aeff) > 1e-6) {
      drawStem(ctx, xOf(-c.k) + 2, baselineY, yOf(magOld), ghost, 1.5)
    }
    drawStem(ctx, xOf(-c.k), baselineY, yOf(magNew), perturbed ? '#f59e0b' : colors.accent, 3.5)
  }

  // Axis label
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui'
  ctx.textAlign = 'right'
  ctx.fillText('k', W - padR, baselineY - 4)
  ctx.textAlign = 'left'
  ctx.fillText('|aₖ|', padL - 26, padT + 8)
}

function drawStem(
  ctx: CanvasRenderingContext2D,
  x: number,
  baselineY: number,
  topY: number,
  color: string,
  width: number,
) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(x, baselineY)
  ctx.lineTo(x, topY)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(x, topY, 2.6, 0, 2 * Math.PI)
  ctx.fill()
}
