'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Modulation theorem visualization.
 *
 * Show that y(t) = x(t)·cos(2π f_c t)  ⇄  Y(f) = ½[X(f − f_c) + X(f + f_c)].
 *
 * Three time-domain stripes (message, carrier, product) on the left.
 * Two frequency-domain stripes (X(f) baseband, Y(f) modulated) on the right.
 *
 * Three baseband presets keep this concrete:
 *   - "triangle"   : a triangular pulse (closed-form: Λ(t/W) ↔ W·sinc²(fW))
 *   - "rect"       : a rectangular pulse (rect(t/W) ↔ W·sinc(fW))
 *   - "lowpass"    : sum of two cosines at low frequencies (toy "speech")
 *
 * Slider controls f_c. The user sees the spectrum split into two copies that
 * march outward as f_c grows — exactly the geometry of AM.
 */

type PresetId = 'triangle' | 'rect' | 'lowpass'

type Preset = {
  id: PresetId
  label: string
  description: string
  /** Time-domain x(t). */
  x: (t: number) => number
  /** Frequency-domain |X(f)| signed (real for these even cases). */
  X: (f: number) => number
  /** Bandwidth W of the baseband (visual hint). */
  W: number
}

const PRESETS: Preset[] = [
  {
    id: 'triangle',
    label: 'Τρίγωνο',
    description: 'Λ(t/W) ↔ W·sinc²(fW). Όλο θετικό φάσμα — όμορφο για να δεις τη μετατόπιση.',
    x: (t) => {
      const W = 1
      const a = Math.abs(t) / W
      return a <= 1 ? 1 - a : 0
    },
    X: (f) => {
      const W = 1
      const x = f * W
      const sinc = x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x)
      return W * sinc * sinc
    },
    W: 1,
  },
  {
    id: 'rect',
    label: 'Ορθογώνιος',
    description: 'rect(t/W) ↔ W·sinc(fW). Δες πώς αναπαράγονται και τα αρνητικά lobe-της sinc.',
    x: (t) => {
      const W = 1
      return Math.abs(t) <= W / 2 ? 1 : 0
    },
    X: (f) => {
      const W = 1
      const x = f * W
      const sinc = x === 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x)
      return W * sinc
    },
    W: 1,
  },
  {
    id: 'lowpass',
    label: 'Toy "speech"',
    description: 'Άθροισμα δύο cosines χαμηλών συχνοτήτων — μοιάζει με baseband ομιλία.',
    x: (t) => 0.6 * Math.cos(2 * Math.PI * 0.4 * t) + 0.4 * Math.cos(2 * Math.PI * 0.7 * t),
    X: (f) => {
      // For visualization we render X(f) as narrow peaks near ±0.4 and ±0.7
      // (we render them as gaussian-like pulses for visual clarity, since true
      // delta functions don't draw nicely).
      const peak = (f0: number, h: number) => {
        const sigma = 0.04
        return h * Math.exp(-((f - f0) ** 2) / (2 * sigma * sigma))
      }
      return peak(0.4, 0.6) + peak(-0.4, 0.6) + peak(0.7, 0.4) + peak(-0.7, 0.4)
    },
    W: 0.8,
  },
]

const FC_MIN = 0
const FC_MAX = 4

export function ModulationTheoremViz() {
  const [presetId, setPresetId] = useState<PresetId>('triangle')
  const [fc, setFc] = useState(2.0)

  const preset = useMemo(() => PRESETS.find((p) => p.id === presetId)!, [presetId])

  const refMessage = useRef<HTMLCanvasElement | null>(null)
  const refCarrier = useRef<HTMLCanvasElement | null>(null)
  const refProduct = useRef<HTMLCanvasElement | null>(null)
  const refSpectrumX = useRef<HTMLCanvasElement | null>(null)
  const refSpectrumY = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (refMessage.current) drawTime(refMessage.current, colors, (t) => preset.x(t), 'message')
    if (refCarrier.current)
      drawTime(refCarrier.current, colors, (t) => Math.cos(2 * Math.PI * fc * t), 'carrier')
    if (refProduct.current)
      drawTime(
        refProduct.current,
        colors,
        (t) => preset.x(t) * Math.cos(2 * Math.PI * fc * t),
        'product',
        (t) => preset.x(t),
      )
    if (refSpectrumX.current) drawSpectrum(refSpectrumX.current, colors, preset, 0)
    if (refSpectrumY.current) drawSpectrum(refSpectrumY.current, colors, preset, fc)
  }, [preset, fc])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Modulation theorem — η μαθηματική καρδιά της AM
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Πολλαπλασιάζουμε ένα baseband σήμα <span className="font-mono">x(t)</span> με ένα carrier
        cosine συχνότητας <span className="font-mono">f_c</span>. Στη συχνότητα, το{' '}
        <span className="font-mono">X(f)</span> «σπάει» σε δύο μισά αντίγραφα,
        μετατοπισμένα στις <span className="font-mono">±f_c</span>. Σύρε το{' '}
        <span className="font-mono">f_c</span> και δες τα αντίγραφα να μετακινούνται.
      </p>

      <div
        role="radiogroup"
        aria-label="Baseband preset"
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
      <p className="-mt-1 mb-3 text-[11px] text-fg-subtle">{preset.description}</p>

      <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
        <div className="grid grid-rows-3 gap-2">
          <Panel title="Μήνυμα x(t)" subtitle="baseband, χαμηλή συχνότητα">
            <canvas
              ref={refMessage}
              style={{ height: 90 }}
              className="block h-[90px] w-full"
              aria-label="Baseband message x(t)"
            />
          </Panel>
          <Panel title="Carrier cos(2π f_c t)" subtitle="γρήγορη oscilling carrier">
            <canvas
              ref={refCarrier}
              style={{ height: 90 }}
              className="block h-[90px] w-full"
              aria-label="Carrier cosine"
            />
          </Panel>
          <Panel
            title="Γινόμενο y(t) = x(t)·cos(2π f_c t)"
            subtitle="carrier «καβαλάει» στο envelope του x(t)"
          >
            <canvas
              ref={refProduct}
              style={{ height: 90 }}
              className="block h-[90px] w-full"
              aria-label="Modulated product"
            />
          </Panel>
        </div>

        <div className="grid grid-rows-2 gap-2">
          <Panel title="X(f) — baseband spectrum" subtitle="κεντραρισμένο στο 0">
            <canvas
              ref={refSpectrumX}
              style={{ height: 140 }}
              className="block h-[140px] w-full"
              aria-label="X(f) baseband"
            />
          </Panel>
          <Panel
            title="Y(f) = ½[X(f − f_c) + X(f + f_c)]"
            subtitle="δύο μισά αντίγραφα, στα ±f_c"
          >
            <canvas
              ref={refSpectrumY}
              style={{ height: 140 }}
              className="block h-[140px] w-full"
              aria-label="Modulated spectrum Y(f)"
            />
          </Panel>
        </div>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Carrier f_c ={' '}
          <span className="font-mono text-fg tabular-nums">{fc.toFixed(2)}</span> Hz
          {' · '}
          Bandwidth του x(t): ~
          <span className="font-mono text-fg tabular-nums">{preset.W.toFixed(2)}</span> Hz
        </label>
        <input
          type="range"
          min={FC_MIN}
          max={FC_MAX}
          step={0.05}
          value={fc}
          onChange={(e) => setFc(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Carrier frequency f_c"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Αυτή είναι η AM modulation</strong> σε δύο γραμμές. Παίρνεις ένα baseband σήμα
        (φωνή, μουσική) και το πολλαπλασιάζεις με carrier. Το φάσμα μεταφέρεται γύρω από{' '}
        <span className="font-mono">±f_c</span> χωρίς να αλλάξει σχήμα — ίδια πληροφορία,
        νέα θέση. Στις υψηλές συχνότητες οι κεραίες είναι πρακτικού μεγέθους και πολλά
        κανάλια χωρούν δίπλα-δίπλα.
      </div>
    </figure>
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
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-3 py-1">
        <span className="text-[10px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[9px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

const PAD_X = 28
const PAD_Y = 10

function drawTime(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  fn: (t: number) => number,
  kind: 'message' | 'carrier' | 'product',
  envelope?: (t: number) => number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const tMin = -3
  const tMax = 3
  const yLim = 1.4

  const xt = (t: number) => lerp(t, tMin, tMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // baseline
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()

  // optional envelope (for product trace)
  if (envelope) {
    ctx.strokeStyle = colors.fgMuted
    ctx.setLineDash([3, 3])
    ctx.lineWidth = 1
    for (const sign of [1, -1]) {
      ctx.beginPath()
      const STEPS = 400
      for (let i = 0; i <= STEPS; i++) {
        const t = lerp(i, 0, STEPS, tMin, tMax)
        const v = sign * envelope(t)
        const x = xt(t)
        const y = yv(v)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
    ctx.setLineDash([])
  }

  // main waveform
  if (kind === 'carrier') ctx.strokeStyle = colors.warn
  else if (kind === 'product') ctx.strokeStyle = colors.accent
  else ctx.strokeStyle = colors.success
  ctx.lineWidth = kind === 'carrier' ? 1.2 : 1.6
  ctx.beginPath()
  const STEPS = 800
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tMin, tMax)
    const v = fn(t)
    const x = xt(t)
    const y = yv(v)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), h - 1)
  ctx.fillText(`${tMin}`, PAD_X, h - 1)
  ctx.fillText(`+${tMax}`, w - PAD_X, h - 1)
}

function drawSpectrum(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  preset: Preset,
  fc: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const fMax = 5
  const fMin = -fMax
  // Y range — find peak across the curve we'll draw
  const Xpeak = Math.max(1, Math.abs(preset.X(0)) * 1.15)
  const yMax = fc === 0 ? Xpeak : Math.max(0.6 * Xpeak, 0.6)
  const yMin = -yMax * 0.4

  const xt = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, yMin, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // f = ±fc dotted markers (only on Y(f) panel)
  if (fc > 0) {
    ctx.strokeStyle = colors.warn
    ctx.setLineDash([3, 3])
    for (const f0 of [-fc, fc]) {
      ctx.beginPath()
      ctx.moveTo(xt(f0), PAD_Y)
      ctx.lineTo(xt(f0), h - PAD_Y)
      ctx.stroke()
    }
    ctx.setLineDash([])
    ctx.fillStyle = colors.warn
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`+f_c`, xt(fc), PAD_Y + 8)
    ctx.fillText(`−f_c`, xt(-fc), PAD_Y + 8)
  }

  // The spectrum curve: if fc=0, draw X(f); else draw ½[X(f−fc) + X(f+fc)]
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  const STEPS = 500
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const v = fc === 0 ? preset.X(f) : 0.5 * (preset.X(f - fc) + preset.X(f + fc))
    const x = xt(f)
    const y = yv(v)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const fk of [-4, -2, 0, 2, 4]) {
    ctx.fillText(`${fk}`, xt(fk), h - 1)
  }
  ctx.textAlign = 'right'
  ctx.fillText(yMax.toFixed(1), PAD_X - 3, PAD_Y + 9)
  ctx.fillText('0', PAD_X - 3, yZero + 3)
}
