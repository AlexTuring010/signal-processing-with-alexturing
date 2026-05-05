'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Show the master equation S_Y(f) = |H(f)|² S_X(f) at work.
 * Three columns:
 *   1. Input PSD: flat white noise at N₀/2
 *   2. Filter |H(f)|² (selectable: ideal LPF, ideal BPF, RC LPF)
 *   3. Output PSD = product
 *
 * The output power is the area under the output PSD; show this as a
 * shaded region with a numeric readout.
 */

const FILTERS = [
  { id: 'lpf', label: 'Ιδανικό LPF', desc: '|H|² = 1 για |f| ≤ B' },
  { id: 'bpf', label: 'Ιδανικό BPF', desc: '|H|² = 1 για B₁ ≤ |f| ≤ B₂' },
  { id: 'rc', label: 'RC LPF (1-pole)', desc: '|H(f)|² = 1/(1 + (f/f_c)²)' },
] as const

type FilterId = (typeof FILTERS)[number]['id']

export function NoiseFilterShapingViz() {
  const [filter, setFilter] = useState<FilterId>('lpf')
  const [param, setParam] = useState(0.4) // normalized cutoff/center
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, filter, param)
    const onResize = () => {
      if (canvas && colors) drawScene(canvas, colors, filter, param)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [filter, param])

  const meta = FILTERS.find((f) => f.id === filter)!

  // Compute output power for the readout (as a fraction of input N0/2 · f_max)
  const fMax = 1.0
  const N0 = 1.0
  const dF = fMax / 400
  let powerOut = 0
  for (let f = -fMax; f <= fMax; f += dF) {
    const H2 = filterMag2(filter, f, param)
    powerOut += (N0 / 2) * H2 * dF
  }

  const paramLabel =
    filter === 'lpf'
      ? `B = ${(param * fMax).toFixed(2)}`
      : filter === 'bpf'
        ? `f_c = ${(param * fMax).toFixed(2)}, ΔΒ = 0.15`
        : `f_c = ${(param * fMax).toFixed(2)}`

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-3 text-sm font-semibold tracking-tight">
        S<sub>Y</sub>(f) = |H(f)|² S<sub>X</sub>(f) — άσπρος θόρυβος μέσα από φίλτρο
      </h4>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full border px-2.5 py-1 text-xs ${
              filter === f.id
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <p className="mb-2 text-xs text-fg-muted">{meta.desc}</p>
      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Noise through filter visualization"
      />
      <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">{paramLabel}</label>
          <input
            type="range"
            min={0.05}
            max={0.95}
            step={0.01}
            value={param}
            onChange={(e) => setParam(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
          />
        </div>
        <div className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Output power P_Y = ∫ |H(f)|² S_X(f) df
          </div>
          <div className="font-mono text-fg tabular-nums">{powerOut.toFixed(3)}</div>
        </div>
      </div>
    </figure>
  )
}

const IN_C = 'rgb(217, 119, 6)'
const FILT_C = 'rgb(168, 85, 247)'
const OUT_C = 'rgb(29, 78, 216)'

function filterMag2(filter: FilterId, f: number, param: number): number {
  const fMax = 1.0
  switch (filter) {
    case 'lpf':
      return Math.abs(f) <= param * fMax ? 1 : 0
    case 'bpf': {
      const fc = param * fMax
      const half = 0.15
      return Math.abs(Math.abs(f) - fc) <= half ? 1 : 0
    }
    case 'rc': {
      const fc = param * fMax
      return 1 / (1 + (f / fc) ** 2)
    }
  }
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  filter: FilterId,
  param: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const colW = (w - 24) / 3
  drawPanel(ctx, colors, 8, 0, colW, h, 'input', filter, param)
  drawPanel(ctx, colors, 8 + colW + 4, 0, colW, h, 'filter', filter, param)
  drawPanel(ctx, colors, 8 + 2 * (colW + 4), 0, colW, h, 'output', filter, param)
}

function drawPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  panel: 'input' | 'filter' | 'output',
  filter: FilterId,
  param: number,
) {
  if (!colors) return
  const PAD = 12
  const TITLE_H = 22
  const fMax = 1.0
  const xf = (f: number) => lerp(f, -fMax, fMax, x0 + PAD, x0 + pw - PAD)
  const yMax = 1.3
  const yv = (v: number) => lerp(v, yMax, 0, y0 + TITLE_H + 6, y0 + ph - PAD - 16)
  const yAxis = y0 + ph - PAD - 16

  // Title
  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  const titles = {
    input: 'S_X(f) — λευκός θόρυβος',
    filter: '|H(f)|²',
    output: 'S_Y(f) = |H|²·S_X',
  }
  ctx.fillText(titles[panel], x0 + pw / 2, y0 + 14)

  // Axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD, yAxis)
  ctx.lineTo(x0 + pw - PAD, yAxis)
  ctx.stroke()

  // f labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('-1', xf(-1), yAxis + 12)
  ctx.fillText('0', xf(0), yAxis + 12)
  ctx.fillText('1', xf(1), yAxis + 12)

  const color = panel === 'input' ? IN_C : panel === 'filter' ? FILT_C : OUT_C
  const N0 = 1.0

  // Plot
  ctx.strokeStyle = color
  ctx.fillStyle = color + '33'
  ctx.lineWidth = 1.6
  ctx.beginPath()
  const STEPS = 200
  let started = false
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -fMax, fMax)
    let v: number
    if (panel === 'input') v = N0 / 2
    else if (panel === 'filter') v = filterMag2(filter, f, param)
    else v = (N0 / 2) * filterMag2(filter, f, param)
    const px = xf(f)
    const py = yv(v)
    if (!started) {
      ctx.moveTo(px, yAxis)
      ctx.lineTo(px, py)
      started = true
    } else ctx.lineTo(px, py)
  }
  ctx.lineTo(xf(fMax), yAxis)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}
