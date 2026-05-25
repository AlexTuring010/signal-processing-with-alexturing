'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

type FilterId = 'lp' | 'hp' | 'bp' | 'bs'
type SpectrumId = 'speech' | 'baseband-plus-interferer' | 'noise-band' | 'am-cluster'

type Spectrum = {
  id: SpectrumId
  label: string
  description: string
  X: (f: number) => number
}

const F_MAX = 5

const SPECTRA: Spectrum[] = [
  {
    id: 'speech',
    label: 'Φωνή (baseband)',
    description:
      'Σήμα βασικής ζώνης που μοιάζει με ομιλία — συγκεντρωμένο στις χαμηλές συχνότητες, σχεδόν μηδέν πάνω από ~1.5 kHz.',
    X: (f) => {
      const a = Math.abs(f)
      if (a > 1.6) return 0
      const env = Math.exp(-Math.pow(a / 0.85, 2))
      const formant1 = 0.55 * Math.exp(-Math.pow((a - 0.35) / 0.12, 2))
      const formant2 = 0.35 * Math.exp(-Math.pow((a - 0.95) / 0.18, 2))
      return Math.min(1, 0.42 * env + formant1 + formant2)
    },
  },
  {
    id: 'baseband-plus-interferer',
    label: 'Baseband + παρεμβολή',
    description:
      'Επιθυμητό σήμα γύρω από το 0 + ένας αναιθύμητος τόνος-παρεμβολή στις υψηλές συχνότητες. Κλασικό σενάριο για LP φίλτρο.',
    X: (f) => {
      const a = Math.abs(f)
      const want = 0.78 * Math.exp(-Math.pow(a / 0.55, 2))
      const interferer = 0.7 * Math.exp(-Math.pow((a - 3.3) / 0.18, 2))
      return Math.min(1, want + interferer)
    },
  },
  {
    id: 'noise-band',
    label: 'Λευκός θόρυβος + σήμα',
    description:
      'Στενοζωνικό σήμα στα 2 kHz + ευρυζωνικός θόρυβος (επίπεδο φάσμα). Στόχος ένος BP φίλτρου: να σώσει το σήμα, να ρίξει τον θόρυβο.',
    X: (f) => {
      const a = Math.abs(f)
      const signal = 0.75 * Math.exp(-Math.pow((a - 2.0) / 0.22, 2))
      // Pseudo-random low-amplitude wide noise (deterministic for SSR)
      const noise = 0.18 + 0.04 * Math.sin(13.7 * a + 0.4) + 0.03 * Math.cos(7.3 * a + 1.1)
      return Math.min(1, signal + noise)
    },
  },
  {
    id: 'am-cluster',
    label: 'Συστοιχία AM/FM σταθμών',
    description:
      'Δύο γειτονικοί σταθμοί στο πεδίο RF. Με ένα BP γύρω από τον επιθυμητό, ο άλλος εξαφανίζεται.',
    X: (f) => {
      const a = Math.abs(f)
      const ch1 = 0.85 * Math.exp(-Math.pow((a - 1.6) / 0.18, 2))
      const ch2 = 0.7 * Math.exp(-Math.pow((a - 3.0) / 0.20, 2))
      return Math.min(1, ch1 + ch2)
    },
  },
]

type FilterConfig = {
  id: FilterId
  label: string
  /** Returns 1 inside passband, 0 inside stopband. */
  H: (f: number, fc1: number, fc2: number) => number
  /** Whether the filter uses one cutoff (fc1 only) or two (fc1, fc2). */
  twoCutoffs: boolean
}

const FILTERS: FilterConfig[] = [
  {
    id: 'lp',
    label: 'Lowpass',
    twoCutoffs: false,
    H: (f, fc) => (Math.abs(f) < fc ? 1 : 0),
  },
  {
    id: 'hp',
    label: 'Highpass',
    twoCutoffs: false,
    H: (f, fc) => (Math.abs(f) > fc ? 1 : 0),
  },
  {
    id: 'bp',
    label: 'Bandpass',
    twoCutoffs: true,
    H: (f, f1, f2) => {
      const a = Math.abs(f)
      return a > f1 && a < f2 ? 1 : 0
    },
  },
  {
    id: 'bs',
    label: 'Bandstop',
    twoCutoffs: true,
    H: (f, f1, f2) => {
      const a = Math.abs(f)
      return a > f1 && a < f2 ? 0 : 1
    },
  },
]

const PRESETS: Record<FilterId, { fc1: number; fc2: number }> = {
  lp: { fc1: 1.2, fc2: 0 },
  hp: { fc1: 1.2, fc2: 0 },
  bp: { fc1: 1.2, fc2: 2.4 },
  bs: { fc1: 1.2, fc2: 2.4 },
}

const X_C = 'rgb(29, 78, 216)' // accent blue
const H_C = 'rgb(217, 119, 6)' // amber
const Y_C = 'rgb(22, 163, 74)' // green
const KILLED_C = 'rgb(148, 163, 184)' // slate-400

const PAD = 22

export function FilterSpectralMaskViz() {
  const [specId, setSpecId] = useState<SpectrumId>('baseband-plus-interferer')
  const [filterId, setFilterId] = useState<FilterId>('lp')
  const [fc1, setFc1] = useState(PRESETS.lp.fc1)
  const [fc2, setFc2] = useState(PRESETS.lp.fc2)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const spectrum = SPECTRA.find((s) => s.id === specId)!
  const filter = FILTERS.find((f) => f.id === filterId)!

  // When filter type changes, reset cutoffs to the preset for that type
  useEffect(() => {
    setFc1(PRESETS[filterId].fc1)
    setFc2(PRESETS[filterId].fc2)
  }, [filterId])

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, spectrum, filter, fc1, fc2)
  }, [spectrum, filter, fc1, fc2])

  // Compute total + survived energy for the readout
  const STEPS = 600
  let total = 0
  let survived = 0
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_MAX, F_MAX)
    const x = spectrum.X(f)
    const h = filter.H(f, fc1, fc2)
    total += x * x
    survived += (x * h) * (x * h)
  }
  const survivedPct = total > 0 ? Math.round((survived / total) * 100) : 0

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Φίλτρο ως φασματική μάσκα — δες τι περνάει, τι κόβεται
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Διάλεξε σήμα εισόδου και τύπο φίλτρου. Σύρε τις συχνότητες αποκοπής.
        Πάνω: το φάσμα <span className="font-mono">|X(f)|</span> του σήματος.
        Μέσο: η μάσκα <span className="font-mono">|H(f)|</span>. Κάτω: το αποτέλεσμα{' '}
        <span className="font-mono">|Y(f)| = |X(f)|·|H(f)|</span> — η περιοχή που σώθηκε
        είναι πράσινη, η περιοχή που κόπηκε φαίνεται ξεθωριασμένη.
      </p>

      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        <div>
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            Σήμα εισόδου
          </div>
          <div
            role="radiogroup"
            aria-label="Input spectrum"
            className="inline-flex flex-wrap items-center gap-1 rounded-md border border-border bg-bg-soft p-0.5 text-[11px]"
          >
            {SPECTRA.map((s) => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={specId === s.id}
                onClick={() => setSpecId(s.id)}
                className={cn(
                  'rounded px-2 py-0.5 transition-colors',
                  specId === s.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            Τύπος φίλτρου
          </div>
          <div
            role="radiogroup"
            aria-label="Filter type"
            className="inline-flex flex-wrap items-center gap-1 rounded-md border border-border bg-bg-soft p-0.5 text-[11px]"
          >
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="radio"
                aria-checked={filterId === f.id}
                onClick={() => setFilterId(f.id)}
                className={cn(
                  'rounded px-2 py-0.5 transition-colors',
                  filterId === f.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Input spectrum, filter mask, and output spectrum stacked"
      />

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {!filter.twoCutoffs && (
          <div className="sm:col-span-2">
            <label className="block text-xs text-fg-muted">
              Συχνότητα αποκοπής f_c ={' '}
              <span className="font-mono text-fg tabular-nums">{fc1.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min={0.3}
              max={F_MAX - 0.3}
              step={0.05}
              value={fc1}
              onChange={(e) => setFc1(parseFloat(e.target.value))}
              className="mt-1 w-full accent-[rgb(var(--accent))]"
              aria-label="Cutoff frequency"
            />
          </div>
        )}
        {filter.twoCutoffs && (
          <>
            <div>
              <label className="block text-xs text-fg-muted">
                Κάτω cutoff f₁ ={' '}
                <span className="font-mono text-fg tabular-nums">{fc1.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min={0.3}
                max={fc2 - 0.2}
                step={0.05}
                value={fc1}
                onChange={(e) => setFc1(parseFloat(e.target.value))}
                className="mt-1 w-full accent-[rgb(var(--accent))]"
                aria-label="Lower cutoff frequency"
              />
            </div>
            <div>
              <label className="block text-xs text-fg-muted">
                Άνω cutoff f₂ ={' '}
                <span className="font-mono text-fg tabular-nums">{fc2.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min={fc1 + 0.2}
                max={F_MAX - 0.2}
                step={0.05}
                value={fc2}
                onChange={(e) => setFc2(parseFloat(e.target.value))}
                className="mt-1 w-full accent-[rgb(var(--accent))]"
                aria-label="Upper cutoff frequency"
              />
            </div>
          </>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[11px] text-fg-muted">
        <span>
          <span className="font-semibold text-fg">Επιβίωσε:</span>{' '}
          <span className="font-mono tabular-nums">{survivedPct}%</span> της ενέργειας του σήματος.
        </span>
        <span className="text-fg-subtle">{spectrum.description}</span>
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  spectrum: Spectrum,
  filter: FilterConfig,
  fc1: number,
  fc2: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const rowH = h / 3
  drawInput(ctx, colors, 0, 0, w, rowH, spectrum)
  drawFilter(ctx, colors, 0, rowH, w, rowH, filter, fc1, fc2)
  drawOutput(ctx, colors, 0, 2 * rowH, w, rowH, spectrum, filter, fc1, fc2)
}

function drawInput(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  spectrum: Spectrum,
) {
  if (!colors) return
  const xt = (f: number) => lerp(f, -F_MAX, F_MAX, x0 + PAD, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, 1.2, -0.18, y0 + PAD + 4, y0 + ph - PAD)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('|X(f)| — είσοδος', x0 + PAD, y0 + 12)

  drawAxes(ctx, colors, xt, yv, x0, pw, y0, ph, yZero)

  const STEPS = 600
  // filled area
  ctx.fillStyle = `rgba(${getRGB(X_C)}, 0.20)`
  ctx.beginPath()
  ctx.moveTo(xt(-F_MAX), yZero)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_MAX, F_MAX)
    ctx.lineTo(xt(f), yv(spectrum.X(f)))
  }
  ctx.lineTo(xt(F_MAX), yZero)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = X_C
  ctx.lineWidth = 1.8
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_MAX, F_MAX)
    const py = yv(spectrum.X(f))
    if (i === 0) ctx.moveTo(xt(f), py)
    else ctx.lineTo(xt(f), py)
  }
  ctx.stroke()
}

function drawFilter(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  filter: FilterConfig,
  fc1: number,
  fc2: number,
) {
  if (!colors) return
  const xt = (f: number) => lerp(f, -F_MAX, F_MAX, x0 + PAD, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, 1.35, -0.18, y0 + PAD + 4, y0 + ph - PAD)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`|H(f)| — ${filter.label}`, x0 + PAD, y0 + 12)

  drawAxes(ctx, colors, xt, yv, x0, pw, y0, ph, yZero)

  const STEPS = 600
  // filled passband
  ctx.fillStyle = `rgba(${getRGB(H_C)}, 0.20)`
  ctx.beginPath()
  ctx.moveTo(xt(-F_MAX), yZero)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_MAX, F_MAX)
    ctx.lineTo(xt(f), yv(filter.H(f, fc1, fc2)))
  }
  ctx.lineTo(xt(F_MAX), yZero)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = H_C
  ctx.lineWidth = 1.8
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_MAX, F_MAX)
    const py = yv(filter.H(f, fc1, fc2))
    if (i === 0) ctx.moveTo(xt(f), py)
    else ctx.lineTo(xt(f), py)
  }
  ctx.stroke()

  // cutoff labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  if (!filter.twoCutoffs) {
    ctx.fillText('+f_c', xt(fc1), yZero + 12)
    ctx.fillText('−f_c', xt(-fc1), yZero + 12)
  } else {
    ctx.fillText('+f₁', xt(fc1), yZero + 12)
    ctx.fillText('−f₁', xt(-fc1), yZero + 12)
    ctx.fillText('+f₂', xt(fc2), yZero + 12)
    ctx.fillText('−f₂', xt(-fc2), yZero + 12)
  }
  ctx.textAlign = 'right'
  ctx.fillText('1', x0 + PAD - 3, yv(1) + 3)
  ctx.fillText('0', x0 + PAD - 3, yZero + 3)
}

function drawOutput(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  spectrum: Spectrum,
  filter: FilterConfig,
  fc1: number,
  fc2: number,
) {
  if (!colors) return
  const xt = (f: number) => lerp(f, -F_MAX, F_MAX, x0 + PAD, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, 1.2, -0.18, y0 + PAD + 4, y0 + ph - PAD)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('|Y(f)| = |X(f)|·|H(f)| — έξοδος', x0 + PAD, y0 + 12)

  drawAxes(ctx, colors, xt, yv, x0, pw, y0, ph, yZero)

  const STEPS = 600
  // First draw the "killed" portion as a faint ghost — the original |X(f)|
  // wherever the filter is 0
  ctx.fillStyle = `rgba(${getRGB(KILLED_C)}, 0.18)`
  ctx.beginPath()
  let drawing = false
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_MAX, F_MAX)
    const blocked = filter.H(f, fc1, fc2) < 0.5
    const v = spectrum.X(f)
    if (blocked) {
      if (!drawing) {
        ctx.moveTo(xt(f), yZero)
        drawing = true
      }
      ctx.lineTo(xt(f), yv(v))
    } else {
      if (drawing) {
        ctx.lineTo(xt(f), yZero)
        drawing = false
      }
    }
  }
  if (drawing) ctx.lineTo(xt(F_MAX), yZero)
  ctx.closePath()
  ctx.fill()

  // Then the surviving (green) portion
  ctx.fillStyle = `rgba(${getRGB(Y_C)}, 0.30)`
  ctx.beginPath()
  ctx.moveTo(xt(-F_MAX), yZero)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_MAX, F_MAX)
    ctx.lineTo(xt(f), yv(spectrum.X(f) * filter.H(f, fc1, fc2)))
  }
  ctx.lineTo(xt(F_MAX), yZero)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = Y_C
  ctx.lineWidth = 1.8
  ctx.beginPath()
  let started = false
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_MAX, F_MAX)
    const v = spectrum.X(f) * filter.H(f, fc1, fc2)
    const py = yv(v)
    if (!started) {
      ctx.moveTo(xt(f), py)
      started = true
    } else {
      ctx.lineTo(xt(f), py)
    }
  }
  ctx.stroke()

  // Cutoff guide lines, faint
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([2, 3])
  ctx.lineWidth = 1
  const guides = filter.twoCutoffs ? [fc1, -fc1, fc2, -fc2] : [fc1, -fc1]
  for (const g of guides) {
    ctx.beginPath()
    ctx.moveTo(xt(g), y0 + PAD + 4)
    ctx.lineTo(xt(g), yZero)
    ctx.stroke()
  }
  ctx.setLineDash([])
}

function drawAxes(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  xt: (f: number) => number,
  yv: (v: number) => number,
  x0: number,
  pw: number,
  y0: number,
  ph: number,
  yZero: number,
) {
  if (!colors) return
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD, yZero)
  ctx.lineTo(x0 + pw - PAD, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), y0 + PAD + 4)
  ctx.lineTo(xt(0), y0 + ph - PAD)
  ctx.stroke()
}

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}
