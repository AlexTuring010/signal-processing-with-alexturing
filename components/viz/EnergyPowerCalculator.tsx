'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Battery, Zap, Ban } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

type Classification = 'energy' | 'power' | 'neither'

type Preset = {
  id: string
  label: string
  formula: string
  fn: (t: number) => number
  /** Pre-computed analytical result. */
  classification: Classification
  /** Closed-form energy if the signal is an energy signal. */
  E?: number
  /** Closed-form average power if the signal is a power signal. */
  P?: number
  notes: string
}

const PRESETS: Preset[] = [
  {
    id: 'rect',
    label: 'Π(t) — ορθογώνιο',
    formula: 'Π(t)',
    fn: (t) => (Math.abs(t) <= 0.5 ? 1 : 0),
    classification: 'energy',
    E: 1,
    notes:
      'Πεπερασμένη διάρκεια → πεπερασμένη ενέργεια E = 1. Μέση ισχύς απείρως αραιωμένη = 0.',
  },
  {
    id: 'expU',
    label: 'e^(−t) u(t)',
    formula: 'e^{-t} u(t)',
    fn: (t) => (t >= 0 ? Math.exp(-t) : 0),
    classification: 'energy',
    E: 0.5,
    notes:
      'Φθίνον εκθετικό. ∫₀^∞ e^{−2t} dt = 1/2 → energy signal.',
  },
  {
    id: 'cos',
    label: 'cos(2π t)',
    formula: '\\cos(2\\pi t)',
    fn: (t) => Math.cos(2 * Math.PI * t),
    classification: 'power',
    P: 0.5,
    notes:
      'Περιοδικό. Ενέργεια = ∞, αλλά μέση ισχύς = A²/2 = 1/2. Power signal.',
  },
  {
    id: 'ramp',
    label: 'ράμπα t·u(t)',
    formula: 't \\cdot u(t)',
    fn: (t) => (t >= 0 ? t : 0),
    classification: 'neither',
    notes:
      'Ούτε ενέργεια (t² → ∞), ούτε ισχύς (t² τραβάει το μέσο όρο στο άπειρο). Ούτε-ούτε.',
  },
]

export function EnergyPowerCalculator() {
  const [id, setId] = useState<string>('cos')
  const preset = PRESETS.find((p) => p.id === id)!
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Numerical sanity for energy/power over a finite window — for visual confirmation.
  const numbers = useMemo(() => computeNumerics(preset.fn), [preset])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = getThemeColors()
    if (!colors) return
    drawIntegrand(canvas, colors, preset.fn)
  }, [preset])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Ταξινόμηση: σήμα ενέργειας / ισχύος / κανένα
        </h4>
        <div
          role="radiogroup"
          aria-label="Επιλογή σήματος"
          className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
        >
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={id === p.id}
              onClick={() => setId(p.id)}
              className={cn(
                'rounded-full px-2 py-0.5 transition-colors',
                id === p.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
        <div className="border-b border-border bg-bg-soft px-3 py-1.5">
          <div className="text-[11px] font-semibold tracking-tight">
            x(t) και |x(t)|² (η ποσότητα που ολοκληρώνουμε)
          </div>
        </div>
        <canvas
          ref={canvasRef}
          style={{ height: 170 }}
          className="block h-[170px] w-full"
          aria-label="x(t) and |x(t)|^2 over a finite window"
        />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Verdict kind={preset.classification} />
        <div className="rounded-md border border-border bg-bg-soft px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Ενέργεια E
          </div>
          <div className="font-mono text-sm tabular-nums text-fg">
            {preset.E !== undefined
              ? preset.E.toFixed(3)
              : numbers.E.diverges
                ? '→ ∞'
                : numbers.E.value.toFixed(2)}
          </div>
        </div>
        <div className="rounded-md border border-border bg-bg-soft px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Μέση ισχύς P
          </div>
          <div className="font-mono text-sm tabular-nums text-fg">
            {preset.P !== undefined
              ? preset.P.toFixed(3)
              : numbers.P.diverges
                ? '→ ∞'
                : numbers.P.value < 1e-3
                  ? '→ 0'
                  : numbers.P.value.toFixed(3)}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-fg-muted">{preset.notes}</p>
    </figure>
  )
}

function Verdict({ kind }: { kind: Classification }) {
  if (kind === 'energy') {
    return (
      <div className="rounded-md border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">
        <div className="inline-flex items-center gap-1.5">
          <Battery className="h-4 w-4" aria-hidden="true" /> Σήμα ενέργειας
        </div>
        <p className="mt-0.5 text-[11px] text-success/80">
          E πεπερασμένη, P = 0
        </p>
      </div>
    )
  }
  if (kind === 'power') {
    return (
      <div className="rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-sm text-accent">
        <div className="inline-flex items-center gap-1.5">
          <Zap className="h-4 w-4" aria-hidden="true" /> Σήμα ισχύος
        </div>
        <p className="mt-0.5 text-[11px] text-accent/80">
          P πεπερασμένη, E = ∞
        </p>
      </div>
    )
  }
  return (
    <div className="rounded-md border border-warn/40 bg-warn/10 px-3 py-2 text-sm text-warn">
      <div className="inline-flex items-center gap-1.5">
        <Ban className="h-4 w-4" aria-hidden="true" /> Κανένα από τα δύο
      </div>
      <p className="mt-0.5 text-[11px] text-warn/80">
        E = ∞ και P = ∞ — δεν εντάσσεται ούτε στη μία κατηγορία ούτε στην άλλη
      </p>
    </div>
  )
}

const TIME_WINDOW = 10 // sec, symmetric around 0
const INTEGRATION_GRID = 1024

function computeNumerics(fn: (t: number) => number) {
  // Rough estimate using two windows: T = 10 and T = 100. If the energy
  // grows roughly linearly with T, we call it diverging.
  const e10 = energyOverWindow(fn, 10)
  const e100 = energyOverWindow(fn, 100)
  const p10 = e10 / 10
  const p100 = e100 / 100

  // If e doubles when window doubles → power signal (ramp would grow faster).
  const eDiverges = e100 > e10 * 1.5
  // If p stays bounded and roughly equal across windows → power signal.
  const pStable = Math.abs(p100 - p10) / Math.max(1e-6, Math.max(p10, p100)) < 0.4
  const pDiverges = p100 > p10 * 1.5
  const pIsZero = p100 < 1e-4

  return {
    E: { value: e10, diverges: eDiverges },
    P: { value: p100, diverges: pDiverges, stable: pStable, isZero: pIsZero },
  }
}

function energyOverWindow(fn: (t: number) => number, T: number): number {
  const a = -T / 2
  const b = T / 2
  const dt = (b - a) / INTEGRATION_GRID
  let sum = 0
  for (let i = 0; i <= INTEGRATION_GRID; i++) {
    const t = a + i * dt
    const v = fn(t)
    const w = i === 0 || i === INTEGRATION_GRID ? 0.5 : 1 // trapezoidal
    sum += w * v * v
  }
  return sum * dt
}

function drawIntegrand(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  fn: (t: number) => number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const padX = 22
  const padY = 12
  const xMin = -TIME_WINDOW / 2
  const xMax = TIME_WINDOW / 2

  // Sample x and x²
  const N = w * 2
  const xs = new Float64Array(N)
  const ys = new Float64Array(N)
  const ysq = new Float64Array(N)
  let yLo = 0
  let yHi = 0
  for (let i = 0; i < N; i++) {
    const t = lerp(i, 0, N - 1, xMin, xMax)
    const v = fn(t)
    xs[i] = t
    ys[i] = v
    ysq[i] = v * v
    if (v < yLo) yLo = v
    if (v > yHi) yHi = v
    if (v * v > yHi) yHi = v * v
  }
  const range = Math.max(0.5, yHi - yLo)
  yLo = yLo - range * 0.1
  yHi = yHi + range * 0.1

  const px = (t: number) => lerp(t, xMin, xMax, padX, w - padX)
  const py = (y: number) => lerp(y, yHi, yLo, padY, h - padY)

  // Mid-line.
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  if (yLo <= 0 && yHi >= 0) {
    const y0 = py(0)
    ctx.beginPath()
    ctx.moveTo(padX, y0)
    ctx.lineTo(w - padX, y0)
    ctx.stroke()
  }

  // |x(t)|² fill (background).
  ctx.fillStyle = colors.accentSoft
  ctx.beginPath()
  const yBaseline = py(0)
  ctx.moveTo(padX, yBaseline)
  for (let i = 0; i < N; i++) ctx.lineTo(px(xs[i]), py(ysq[i]))
  ctx.lineTo(w - padX, yBaseline)
  ctx.closePath()
  ctx.fill()

  // |x(t)|² curve.
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1.2
  ctx.beginPath()
  for (let i = 0; i < N; i++) {
    const x = px(xs[i])
    const y = py(ysq[i])
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // x(t) curve.
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i < N; i++) {
    const x = px(xs[i])
    const y = py(ys[i])
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // X-axis labels.
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`${xMin}`, padX, h - 2)
  ctx.fillText('0', px(0), h - 2)
  ctx.fillText(`+${xMax}`, w - padX, h - 2)

  // Legend.
  ctx.textAlign = 'left'
  ctx.fillStyle = colors.accent
  ctx.fillText('— x(t)', padX + 4, padY + 9)
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('— |x(t)|² (εμβαδό = ενέργεια στο παράθυρο)', padX + 50, padY + 9)
}
