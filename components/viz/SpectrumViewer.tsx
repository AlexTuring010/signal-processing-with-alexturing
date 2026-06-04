'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Lightbulb } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'
import { InlineMath } from '@/components/math'

/**
 * Side-by-side: time signal + amplitude spectrum + phase spectrum.
 *
 * Goal: students see that **periodic ⇒ discrete spectrum**, and that the two
 * spectra together carry the full information of the signal. Toggling between
 * presets shows how a single cosine shows up as one spike pair, how harmonics
 * stack, and how a square wave decomposes into odd-harmonic sinc-decay.
 *
 * All series are computed analytically (closed-form a_k), then the time
 * waveform is reconstructed from the same a_k so the two views are guaranteed
 * to agree visually.
 */

const T0 = 1.0 // fundamental period
const F0 = 1 / T0 // fundamental frequency in Hz
const OMEGA0 = 2 * Math.PI * F0
const K_MAX = 25

type Coeff = { mag: number; phase: number } // a_k in polar form
type Preset = {
  id: string
  label: string
  description: string
  /** Closed-form x(t) (cosine form), shown so each spectrum maps to a real signal equation. */
  formula: string
  // returns a_k for k in [-K_MAX, K_MAX]; key is the integer k.
  coeffs: () => Map<number, Coeff>
}

const PRESETS: Preset[] = [
  {
    id: 'cosine',
    label: 'Καθαρό cosine',
    description: 'Δύο σπικς, στο +f₀ και −f₀, μέτρο 1/2.',
    formula: 'x(t) = \\cos(\\omega_0 t)',
    coeffs: () => {
      const m = new Map<number, Coeff>()
      m.set(1, { mag: 0.5, phase: 0 })
      m.set(-1, { mag: 0.5, phase: 0 })
      return m
    },
  },
  {
    id: 'cos-phase',
    label: 'Cosine με phase shift',
    description: 'Ίδια πλάτη, διαφορετικές φάσεις. Το σχήμα στον χρόνο μετατοπίζεται.',
    formula: 'x(t) = \\cos(\\omega_0 t + \\pi/3)',
    coeffs: () => {
      const phi = Math.PI / 3
      const m = new Map<number, Coeff>()
      m.set(1, { mag: 0.5, phase: phi })
      m.set(-1, { mag: 0.5, phase: -phi })
      return m
    },
  },
  {
    id: 'two-cosines',
    label: 'cos + 3η αρμονική',
    description: 'Προστίθεται μια αρμονική στο 3f₀ — πολύ απλή «μη-cosine» κυματομορφή.',
    formula: 'x(t) = \\cos\\omega_0 t + \\tfrac12\\cos 3\\omega_0 t',
    coeffs: () => {
      const m = new Map<number, Coeff>()
      m.set(1, { mag: 0.5, phase: 0 })
      m.set(-1, { mag: 0.5, phase: 0 })
      m.set(3, { mag: 0.25, phase: 0 })
      m.set(-3, { mag: 0.25, phase: 0 })
      return m
    },
  },
  {
    id: 'square',
    label: 'Τετραγωνικός παλμός 50%',
    description:
      'a_k = ½·sinc(k/2). Μόνο περιττές αρμονικές, μέτρα φθίνουν σαν 1/k. DC = 1/2.',
    formula:
      'x(t) = \\tfrac12 + \\tfrac{2}{\\pi}\\left[\\cos\\omega_0 t - \\tfrac13\\cos 3\\omega_0 t + \\tfrac15\\cos 5\\omega_0 t - \\cdots\\right]',
    coeffs: () => {
      const m = new Map<number, Coeff>()
      m.set(0, { mag: 0.5, phase: 0 })
      for (let k = -K_MAX; k <= K_MAX; k++) {
        if (k === 0) continue
        const x = k / 2
        const sinc = Math.sin(Math.PI * x) / (Math.PI * x)
        const a = 0.5 * sinc
        if (Math.abs(a) < 1e-9) continue
        m.set(k, { mag: Math.abs(a), phase: a >= 0 ? 0 : Math.PI })
      }
      return m
    },
  },
]

export function SpectrumViewer() {
  const [presetId, setPresetId] = useState<string>('cosine')
  const [showSymmetry, setShowSymmetry] = useState(false)
  const preset = PRESETS.find((p) => p.id === presetId)!

  const coeffs = useMemo(() => preset.coeffs(), [preset])

  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const magRef = useRef<HTMLCanvasElement | null>(null)
  const phaseRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, coeffs)
    if (magRef.current) drawSpectrum(magRef.current, colors, coeffs, 'mag', showSymmetry)
    if (phaseRef.current) drawSpectrum(phaseRef.current, colors, coeffs, 'phase', showSymmetry)
  }, [coeffs, showSymmetry])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold tracking-tight">
            Σήμα και φάσμα — δύο όψεις του ίδιου πράγματος
          </h4>
          <p className="text-xs text-fg-muted">{preset.description}</p>
          <p className="mt-1 overflow-x-auto text-[13px] text-fg">
            <InlineMath>{preset.formula}</InlineMath>
          </p>
        </div>
        <label className="flex items-center gap-1.5 text-xs text-fg-muted">
          <input
            type="checkbox"
            checked={showSymmetry}
            onChange={(e) => setShowSymmetry(e.target.checked)}
            className="accent-[rgb(var(--accent))]"
          />
          Σημείωσε τη συμμετρία ±f
        </label>
      </div>

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
              presetId === p.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
        <Panel title="Στον χρόνο" subtitle="x(t) = Σ aₖ e^(jkω₀t)">
          <canvas
            ref={timeRef}
            style={{ height: 200 }}
            className="block h-[200px] w-full"
            aria-label="Time-domain waveform"
          />
        </Panel>

        <div className="grid grid-cols-1 gap-3">
          <Panel title="|aₖ| — φάσμα πλάτους" subtitle="διακριτές γραμμές στα k·f₀">
            <canvas
              ref={magRef}
              style={{ height: 95 }}
              className="block h-[95px] w-full"
              aria-label="Amplitude spectrum"
            />
          </Panel>
          <Panel title="∠aₖ — φάσμα φάσης" subtitle="rad (περιττή για real signals)">
            <canvas
              ref={phaseRef}
              style={{ height: 95 }}
              className="block h-[95px] w-full"
              aria-label="Phase spectrum"
            />
          </Panel>
        </div>
      </div>

      {presetId === 'square' && <PhaseRecapForSquare />}

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Παρατήρησε: <strong>μόνο γραμμές</strong> στα ακέραια πολλαπλάσια του f₀.
        Δεν υπάρχει σήμα μεταξύ τους — αυτό είναι το «φάσμα είναι discrete». Για
        real signals οι γραμμές στο −f είναι ο μιγαδικός συζυγής αυτών στο +f, οπότε
        το <em>μέτρο</em> είναι κατοπτρικό και η <em>φάση</em> αντισυμμετρική.
      </div>
    </figure>
  )
}

function PhaseRecapForSquare() {
  return (
    <aside className="mt-3 rounded-lg border border-amber-300/60 bg-amber-50/70 px-4 py-3.5 text-amber-950 shadow-sm dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold tracking-tight">
        <Lightbulb className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>Γιατί η φάση βγαίνει μόνο 0 ή π — κι εναλλάξ;</span>
      </div>

      <div className="text-[0.95rem] leading-relaxed [&>*:first-child]:mt-0">
        <p>
          Κοίτα τα <strong>πρόσημα</strong> των πρώτων συντελεστών. Το{' '}
          <InlineMath>{'a_k = \\tfrac12\\,\\mathrm{sinc}(k/2)'}</InlineMath> <strong>εναλλάσσει πρόσημο</strong>{' '}
          καθώς ανεβαίνεις αρμονικές (οι ζυγές μηδενίζονται):
        </p>
        <ul className="my-2 grid gap-0.5 pl-1">
          <li><InlineMath>{'a_1 = +\\tfrac{1}{\\pi}'}</InlineMath> → θετικό → <strong>φάση 0</strong></li>
          <li><InlineMath>{'a_3 = -\\tfrac{1}{3\\pi}'}</InlineMath> → αρνητικό → <strong>φάση π</strong></li>
          <li><InlineMath>{'a_5 = +\\tfrac{1}{5\\pi}'}</InlineMath> → θετικό → <strong>φάση 0</strong></li>
          <li><InlineMath>{'a_7 = -\\tfrac{1}{7\\pi}'}</InlineMath> → αρνητικό → <strong>φάση π</strong></li>
        </ul>
        <p className="text-[0.9rem]">
          (Από πού το <InlineMath>{'1/\\pi'}</InlineMath>; Είναι{' '}
          <InlineMath>{'a_1 = \\tfrac12\\,\\mathrm{sinc}(\\tfrac12) = \\tfrac12\\cdot\\tfrac{2}{\\pi} = \\tfrac{1}{\\pi}'}</InlineMath>{' '}
          — το <InlineMath>{'\\tfrac12'}</InlineMath> «κόβει» στη μέση το <InlineMath>{'2/\\pi'}</InlineMath> που δίνει το{' '}
          <InlineMath>{'\\mathrm{sinc}(\\tfrac12)'}</InlineMath>.)
        </p>
        <p>
          Στη <strong>cosine μορφή</strong> ο συντελεστής μπροστά σε κάθε αρμονική είναι{' '}
          <InlineMath>{'2a_k'}</InlineMath> — όχι <InlineMath>{'a_k'}</InlineMath> — γιατί το ζεύγος{' '}
          <InlineMath>{'+f'}</InlineMath> και <InlineMath>{'-f'}</InlineMath> ενώνεται σε ένα πραγματικό cosine.
          Γι' αυτό μπροστά στο <InlineMath>{'\\cos\\omega_0 t'}</InlineMath> βλέπεις{' '}
          <InlineMath>{'\\tfrac{2}{\\pi} = 2\\cdot\\tfrac{1}{\\pi}'}</InlineMath>, ενώ <InlineMath>{'a_1 = \\tfrac1\\pi'}</InlineMath>.
          Τα εναλλασσόμενα πρόσημα πάντως μένουν τα ίδια:
        </p>
        <p className="my-1.5 overflow-x-auto">
          <InlineMath>{'x(t) = \\tfrac12 + \\tfrac{2}{\\pi}\\left[\\cos\\omega_0 t - \\tfrac13\\cos 3\\omega_0 t + \\tfrac15\\cos 5\\omega_0 t - \\cdots\\right]'}</InlineMath>
        </p>
        <p>
          Και να το κλειδί: <strong>ένα «−» μπροστά από ένα cosine ΕΙΝΑΙ φάση π</strong>, αφού{' '}
          <InlineMath>{'-\\cos\\theta = \\cos(\\theta + \\pi)'}</InlineMath>. Άρα τα πρόσημα{' '}
          <InlineMath>{'+,-,+,-'}</InlineMath> του sinc <em>είναι</em> ακριβώς οι φάσεις{' '}
          <InlineMath>{'0,\\,\\pi,\\,0,\\,\\pi'}</InlineMath>. Τίποτα ενδιάμεσο δεν εμφανίζεται γιατί τα{' '}
          <InlineMath>{'a_k'}</InlineMath> είναι <strong>πραγματικοί</strong> αριθμοί (συμμετρικό σήμα).
        </p>
      </div>

      <div className="mt-3 grid gap-3 border-t border-amber-300/40 pt-3 dark:border-amber-400/20 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="text-[0.9rem] leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          <p>
            <strong>Θύμησου τι σημαίνει φάση:</strong> η γωνία που σχηματίζει το διάνυσμα του{' '}
            μιγαδικού <em>z</em> με τον θετικό real άξονα στο{' '}
            <Link href="/reference/complex-numbers#plane" className="text-accent underline-offset-2 hover:underline">
              μιγαδικό επίπεδο
            </Link>. Ένας <strong>πραγματικός</strong> αριθμός δείχνει μόνο δεξιά ή αριστερά:{' '}
            <span className="font-mono">+</span> → φάση 0, <span className="font-mono">−</span> → φάση π.
            (Φανταστικός θα έδειχνε πάνω/κάτω → <InlineMath>{'\\pm\\pi/2'}</InlineMath> — εδώ δεν συμβαίνει.)
          </p>
        </div>
        <PhaseFourCasesSVG />
      </div>

      <p className="mt-3 text-[0.9rem] leading-relaxed">
        <strong>Και γιατί μοιάζει «επίπεδη»;</strong> Επειδή όλες οι φάσεις είναι 0 ή{' '}
        <InlineMath>{'\\pm\\pi'}</InlineMath>, κι επειδή <InlineMath>{'+\\pi'}</InlineMath> και{' '}
        <InlineMath>{'-\\pi'}</InlineMath> είναι το ίδιο σημείο στον κύκλο, η αντισυμμετρία της φάσης
        δεν ξεχωρίζει οπτικά. Διάλεξε το preset <strong>«Cosine με phase shift»</strong> (φάσεις{' '}
        <InlineMath>{'\\pm\\pi/3'}</InlineMath>) για να τη δεις καθαρά.
      </p>
    </aside>
  )
}

function PhaseFourCasesSVG() {
  // Inline diagram: four arrows in the complex plane (right, left, up, down)
  // with the phase value labelled at each tip. Stays small; mobile-friendly.
  return (
    <svg
      viewBox="-70 -70 140 140"
      className="mx-auto h-32 w-32 shrink-0 text-amber-900 dark:text-amber-200"
      aria-label="Τέσσερα ειδικά σημεία στο μιγαδικό επίπεδο και οι φάσεις τους"
    >
      {/* Axes */}
      <line x1="-58" y1="0" x2="58" y2="0" stroke="currentColor" strokeOpacity="0.35" />
      <line x1="0" y1="-58" x2="0" y2="58" stroke="currentColor" strokeOpacity="0.35" />
      <text x="60" y="3" fontSize="8" fill="currentColor" opacity="0.6">Re</text>
      <text x="3" y="-60" fontSize="8" fill="currentColor" opacity="0.6">Im</text>

      {/* +5 → phase 0 (right) */}
      <line x1="0" y1="0" x2="42" y2="0" stroke="rgb(29,78,216)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="42" cy="0" r="3" fill="rgb(29,78,216)" />
      <text x="46" y="4" fontSize="10" fill="currentColor" fontWeight="600">0</text>

      {/* -5 → phase π (left) */}
      <line x1="0" y1="0" x2="-42" y2="0" stroke="rgb(220,38,38)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="-42" cy="0" r="3" fill="rgb(220,38,38)" />
      <text x="-65" y="4" fontSize="10" fill="currentColor" fontWeight="600">π</text>

      {/* +5j → phase π/2 (up; SVG y is flipped) */}
      <line x1="0" y1="0" x2="0" y2="-42" stroke="rgb(22,163,74)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="0" cy="-42" r="3" fill="rgb(22,163,74)" />
      <text x="4" y="-46" fontSize="10" fill="currentColor" fontWeight="600">π/2</text>

      {/* -5j → phase -π/2 (down) */}
      <line x1="0" y1="0" x2="0" y2="42" stroke="rgb(202,138,4)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="0" cy="42" r="3" fill="rgb(202,138,4)" />
      <text x="4" y="56" fontSize="10" fill="currentColor" fontWeight="600">−π/2</text>
    </svg>
  )
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-3 py-1.5">
        <span className="text-[11px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

const PAD_X = 28
const PAD_Y = 14

function reconstruct(coeffs: Map<number, Coeff>, t: number) {
  // x(t) = Σ a_k e^{j k ω0 t}; for real signals this comes out real.
  let re = 0
  for (const [k, c] of coeffs) {
    const phase = c.phase + k * OMEGA0 * t
    re += c.mag * Math.cos(phase)
  }
  return re
}

function drawTime(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  coeffs: Map<number, Coeff>,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const tStart = -1.5 * T0
  const tEnd = 1.5 * T0

  // Determine y-range adaptively — sample 200 points.
  let maxAbs = 0
  for (let i = 0; i < 200; i++) {
    const t = lerp(i, 0, 199, tStart, tEnd)
    maxAbs = Math.max(maxAbs, Math.abs(reconstruct(coeffs, t)))
  }
  const yLim = Math.max(0.6, maxAbs * 1.15)

  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, h / 2)
  ctx.lineTo(w - PAD_X, h / 2)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(`+${yLim.toFixed(1)}`, PAD_X - 3, PAD_Y + 9)
  ctx.fillText(`−${yLim.toFixed(1)}`, PAD_X - 3, h - PAD_Y)
  ctx.textAlign = 'center'
  ctx.fillText(`${tStart.toFixed(1)}T₀`, PAD_X, h - 1)
  ctx.fillText(`+${tEnd.toFixed(1)}T₀`, w - PAD_X, h - 1)
  // Period boundaries
  for (const tBoundary of [-T0, 0, T0]) {
    const x = lerp(tBoundary, tStart, tEnd, PAD_X, w - PAD_X)
    ctx.strokeStyle = colors.border
    ctx.setLineDash([2, 3])
    ctx.beginPath()
    ctx.moveTo(x, PAD_Y)
    ctx.lineTo(x, h - PAD_Y)
    ctx.stroke()
    ctx.setLineDash([])
  }

  // waveform
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  const steps = w * 2
  for (let i = 0; i <= steps; i++) {
    const t = lerp(i, 0, steps, tStart, tEnd)
    const v = reconstruct(coeffs, t)
    const x = lerp(t, tStart, tEnd, PAD_X, w - PAD_X)
    const y = lerp(v, yLim, -yLim, PAD_Y, h - PAD_Y)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}

function drawSpectrum(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  coeffs: Map<number, Coeff>,
  kind: 'mag' | 'phase',
  showSymmetry: boolean,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // f-range
  const fMax = 7 * F0
  const fMin = -fMax

  // y-range
  let yMax: number
  if (kind === 'mag') {
    yMax = 0.6
    for (const c of coeffs.values()) yMax = Math.max(yMax, c.mag * 1.2)
  } else {
    yMax = Math.PI
  }
  const yMin = kind === 'mag' ? 0 : -Math.PI

  const xt = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, yMin, PAD_Y, h - PAD_Y)

  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  const yZero = yv(0)
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()
  // vertical axis at f=0
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let kf = -6; kf <= 6; kf += 2) {
    const x = xt(kf * F0)
    if (kf !== 0) ctx.fillText(`${kf}f₀`, x, h - 1)
  }
  ctx.textAlign = 'right'
  if (kind === 'mag') {
    ctx.fillText(yMax.toFixed(2), PAD_X - 3, PAD_Y + 9)
    ctx.fillText('0', PAD_X - 3, yZero + 3)
  } else {
    ctx.fillText('+π', PAD_X - 3, PAD_Y + 9)
    ctx.fillText('0', PAD_X - 3, yZero + 3)
    ctx.fillText('−π', PAD_X - 3, h - PAD_Y)
  }

  // Spectrum lines (lollipops).
  const sortedKeys = [...coeffs.keys()].sort((a, b) => a - b)
  for (const k of sortedKeys) {
    const c = coeffs.get(k)!
    if (kind === 'mag' && c.mag < 1e-9) continue
    if (kind === 'phase' && c.mag < 1e-9) continue

    const f = k * F0
    if (f < fMin || f > fMax) continue
    const x = xt(f)

    let v: number
    if (kind === 'mag') {
      v = c.mag
    } else {
      v = c.phase
      // wrap into (-π, π]
      while (v > Math.PI) v -= 2 * Math.PI
      while (v <= -Math.PI) v += 2 * Math.PI
    }
    const y = yv(v)

    // Symmetry highlight: if showing, color +f and -f differently
    const isMirror = showSymmetry && k < 0
    const lineColor = isMirror ? colors.fgMuted : colors.accent
    const dotColor = isMirror ? colors.fgMuted : colors.accent

    ctx.strokeStyle = lineColor
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, y)
    ctx.stroke()

    ctx.fillStyle = dotColor
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fill()

    // label k
    ctx.fillStyle = colors.fgSubtle
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    if (kind === 'mag' && k !== 0) {
      ctx.fillText(`k=${k}`, x, y - 5)
    }
  }
}
