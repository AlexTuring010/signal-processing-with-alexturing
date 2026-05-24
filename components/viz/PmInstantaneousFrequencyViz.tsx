'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas } from '@/lib/canvas'

/**
 * PM vs FM instantaneous-frequency contrast — slide 7 (PM) vs slide 8 (FM).
 *
 * Prof's slide 6 defines f_i(t) ≜ (1/2π) dθ/dt = f_c + (1/2π) dφ/dt.
 *
 * For FM the prof gives directly  f_i^FM(t) = f_c + K_f · m(t)  (slide 8).
 * For PM, plug φ = K_p · m(t):     f_i^PM(t) = f_c + (K_p/2π) · dm/dt  (slide 7).
 *
 * The qualitative difference: FM's instantaneous frequency tracks the MESSAGE
 * directly; PM's tracks the DERIVATIVE of the message. For a sinusoidal m,
 * this is a 90° phase shift — PM's f_i is fastest at the zero-crossings of m,
 * not at the peaks. For a triangular m, the difference becomes dramatic: FM's
 * f_i is a triangle (continuous), PM's f_i is a SQUARE WAVE (discontinuous
 * jumps at the corners).
 *
 * Layout: four stacked panels with shared time axis.
 *
 *   ┌─────────────────────────────────────────────┐
 *   │ m(t)   message                              │
 *   ├─────────────────────────────────────────────┤
 *   │ dm/dt  derivative                           │
 *   ├─────────────────────────────────────────────┤
 *   │ f_i^PM = f_c + (K_p/2π) dm/dt   (green)     │
 *   ├─────────────────────────────────────────────┤
 *   │ f_i^FM = f_c + K_f m            (blue)      │
 *   └─────────────────────────────────────────────┘
 *
 * Controls: message shape (sinusoidal / triangle), K_p, K_f, f_m.
 */

const FC = 6 // visual carrier frequency
const T_RANGE = 4
const DT = 0.0025

type Shape = 'sin' | 'tri'

const SHAPES: Array<{ id: Shape; label: string }> = [
  { id: 'sin', label: 'sinusoidal — α cos(2π f_m t)' },
  { id: 'tri', label: 'triangle — αυτό κάνει την «PM σπάει σε τετράγωνο»' },
]

export function PmInstantaneousFrequencyViz() {
  const [shape, setShape] = useState<Shape>('sin')
  const [kp, setKp] = useState(2.0)
  const [kf, setKf] = useState(2.0)
  const [fm, setFm] = useState(0.5)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) draw(canvas, colors, shape, kp, kf, fm)
  }, [shape, kp, kf, fm])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Στιγμιαία συχνότητα — PM ακολουθεί το <em>dm/dt</em>, FM ακολουθεί το <em>m</em>
        </h4>
        <p className="mt-1 text-xs text-fg-muted">
          Από <span className="font-mono">f_i = f_c + (1/2π) dφ/dt</span>: για PM,{' '}
          <span className="font-mono">φ = K_p m</span> → η f_i ακολουθεί το{' '}
          <em>dm/dt</em>. Για FM, <span className="font-mono">φ = 2π K_f ∫m</span> →
          η f_i ακολουθεί απευθείας το <em>m</em>. Στο sinusoidal m, αυτή η διαφορά
          δείχνεται ως 90° μετατόπιση. Στο triangle m, η PM <strong>«σπάει»</strong>{' '}
          σε τετράγωνο — η συχνότητα κάνει ασυνεχείς πηδήματα στις γωνίες.
        </p>
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-fg-subtle">Σχήμα m(t):</span>
        {SHAPES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setShape(s.id)}
            className={
              'rounded-full border px-3 py-1 text-xs transition-colors ' +
              (shape === s.id
                ? 'border-accent bg-accent/15 text-fg'
                : 'border-border bg-bg-soft text-fg-muted hover:border-accent/50')
            }
          >
            {s.label}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 380 }}
        className="block h-[380px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="PM vs FM instantaneous-frequency 4-panel contrast"
      />

      <div className="mt-3 grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
        <label className="flex flex-col gap-1">
          <span className="text-fg-muted">
            K<sub>p</sub> (PM) ={' '}
            <span className="font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
              {kp.toFixed(2)}
            </span>{' '}
            rad/V
          </span>
          <input
            type="range"
            min={0.2}
            max={5}
            step={0.05}
            value={kp}
            onChange={(e) => setKp(parseFloat(e.target.value))}
            className="w-full accent-emerald-600"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-fg-muted">
            K<sub>f</sub> (FM) ={' '}
            <span className="font-mono tabular-nums text-blue-700 dark:text-blue-400">
              {kf.toFixed(2)}
            </span>{' '}
            Hz/V
          </span>
          <input
            type="range"
            min={0.2}
            max={5}
            step={0.05}
            value={kf}
            onChange={(e) => setKf(parseFloat(e.target.value))}
            className="w-full accent-blue-600"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-fg-muted">
            f<sub>m</sub> ={' '}
            <span className="font-mono tabular-nums text-fg">{fm.toFixed(2)}</span> Hz
          </span>
          <input
            type="range"
            min={0.3}
            max={1.2}
            step={0.05}
            value={fm}
            onChange={(e) => setFm(parseFloat(e.target.value))}
            className="w-full"
          />
        </label>
      </div>

      <p className="mt-3 text-xs text-fg-muted">
        <strong>Παρατήρηση κλειδί:</strong> για sinusoidal m, το{' '}
        <span className="font-mono">dm/dt</span> είναι ένα μετατοπισμένο sinusoid (το πρόσημο εξαρτάται από
        τη φάση), οπότε <span className="font-mono">f_i^PM</span> είναι το ίδιο σχήμα με{' '}
        <span className="font-mono">f_i^FM</span> αλλά μετατοπισμένο κατά{' '}
        <strong>π/2</strong>. Για triangle m, η <span className="font-mono">f_i^FM</span> είναι ακόμα τρίγωνο
        (συνεχές), αλλά η <span className="font-mono">f_i^PM</span> έχει{' '}
        <strong>ασυνέχειες</strong> — γι' αυτό η PM δεν χρησιμοποιείται για σήματα
        με απότομες αλλαγές. Στα analog audio η FM είναι σχεδόν πάντα η σωστή επιλογή.
      </p>
    </figure>
  )
}

function message(shape: Shape, t: number, fm: number, alpha = 1): number {
  if (shape === 'sin') return alpha * Math.cos(2 * Math.PI * fm * t)
  // triangle in [−α, α] with period 1/fm
  const p = 1 / fm
  const phase = ((t / p) % 1 + 1) % 1 // [0,1)
  // standard symmetric triangle: max at phase 0, min at phase 0.5
  const tri = 1 - 4 * Math.abs(phase - 0.5)
  return alpha * tri
}

function dMessage(shape: Shape, t: number, fm: number, alpha = 1): number {
  if (shape === 'sin') return -alpha * 2 * Math.PI * fm * Math.sin(2 * Math.PI * fm * t)
  // triangle: derivative is +4·alpha·fm in the first half-period, -4·alpha·fm in the second
  const p = 1 / fm
  const phase = ((t / p) % 1 + 1) % 1
  // slope of triangle:  for phase in [0, 0.5], slope is -4 (going from +1 to -1)
  // for phase in [0.5, 1.0], slope is +4 (going from -1 back to +1)
  // ⇒ derivative w.r.t. t = (slope / p) · alpha
  const slope = phase < 0.5 ? -4 : 4
  return (slope / p) * alpha
}

function draw(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  shape: Shape,
  kp: number,
  kf: number,
  fm: number,
) {
  if (!colors) return
  const { ctx, w: width, h: height } = setupCanvas(canvas)
  ctx.fillStyle = colors.bg
  ctx.fillRect(0, 0, width, height)

  const padL = 18
  const padR = 14
  const padT = 8
  const padB = 8
  const gap = 6
  const panelH = (height - padT - padB - 3 * gap) / 4
  const plotW = width - padL - padR

  const N = Math.floor(T_RANGE / DT)
  const m: number[] = new Array(N)
  const dm: number[] = new Array(N)
  const fiPm: number[] = new Array(N)
  const fiFm: number[] = new Array(N)

  let absMaxDm = 0
  let absMaxM = 0
  for (let i = 0; i < N; i++) {
    const t = i * DT
    m[i] = message(shape, t, fm)
    dm[i] = dMessage(shape, t, fm)
    if (Math.abs(m[i]) > absMaxM) absMaxM = Math.abs(m[i])
    if (Math.abs(dm[i]) > absMaxDm) absMaxDm = Math.abs(dm[i])
  }

  for (let i = 0; i < N; i++) {
    fiPm[i] = FC + (kp / (2 * Math.PI)) * dm[i]
    fiFm[i] = FC + kf * m[i]
  }

  // Common frequency-axis range: cover the larger of PM and FM excursion
  const dfPM = (kp / (2 * Math.PI)) * absMaxDm
  const dfFM = kf * absMaxM
  const fRange = Math.max(dfPM, dfFM, 0.5) * 1.2
  const fmin = FC - fRange
  const fmax = FC + fRange

  const panels: Array<{
    label: string
    color: string
    data: number[]
    yRange: [number, number]
    showZero?: boolean
    pmFmCarrier?: boolean
  }> = [
    {
      label: `m(t)  (${shape === 'sin' ? 'sinusoidal' : 'triangle'})`,
      color: colors.fg,
      data: m,
      yRange: [-1.15, 1.15],
      showZero: true,
    },
    {
      label: `dm/dt  — τι «νιώθει» η PM`,
      color: colors.warn,
      data: dm,
      yRange: [-(absMaxDm * 1.15 || 1), absMaxDm * 1.15 || 1],
      showZero: true,
    },
    {
      label: `f_i^PM = f_c + (K_p/2π) · dm/dt   ·   Δf_PM = ${dfPM.toFixed(2)} Hz`,
      color: '#10b981',
      data: fiPm,
      yRange: [fmin, fmax],
      pmFmCarrier: true,
    },
    {
      label: `f_i^FM = f_c + K_f · m(t)   ·   Δf_FM = ${dfFM.toFixed(2)} Hz`,
      color: '#3b82f6',
      data: fiFm,
      yRange: [fmin, fmax],
      pmFmCarrier: true,
    },
  ]

  for (let p = 0; p < panels.length; p++) {
    const panel = panels[p]
    const y0 = padT + p * (panelH + gap)
    const [ymin, ymax] = panel.yRange
    const yOfV = (v: number) =>
      y0 + panelH - ((v - ymin) / (ymax - ymin)) * panelH

    ctx.fillStyle = colors.accentSoft
    ctx.globalAlpha = 0.25
    ctx.fillRect(padL, y0, plotW, panelH)
    ctx.globalAlpha = 1
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 1
    ctx.strokeRect(padL, y0, plotW, panelH)

    // zero or f_c reference line
    ctx.strokeStyle = colors.fgSubtle
    ctx.setLineDash([2, 3])
    ctx.beginPath()
    if (panel.showZero) {
      ctx.moveTo(padL, yOfV(0))
      ctx.lineTo(padL + plotW, yOfV(0))
    } else if (panel.pmFmCarrier) {
      ctx.moveTo(padL, yOfV(FC))
      ctx.lineTo(padL + plotW, yOfV(FC))
    }
    ctx.stroke()
    ctx.setLineDash([])

    // waveform
    ctx.strokeStyle = panel.color
    ctx.lineWidth = 1.4
    ctx.beginPath()
    for (let i = 0; i < N; i++) {
      const x = padL + (i / N) * plotW
      const y = yOfV(panel.data[i])
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // f_c reference label on freq panels
    if (panel.pmFmCarrier) {
      ctx.fillStyle = colors.fgSubtle
      ctx.font = '10px ui-monospace, monospace'
      ctx.textBaseline = 'middle'
      ctx.fillText(`f_c`, padL + 4, yOfV(FC))
    }

    // panel label
    ctx.fillStyle = colors.fg
    ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif'
    ctx.textBaseline = 'top'
    ctx.fillText(panel.label, padL + 6, y0 + 3)
  }
}
