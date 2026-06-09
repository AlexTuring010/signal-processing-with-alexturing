'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { mulberry32 } from '@/lib/random'
import { cn } from '@/lib/utils'

/**
 * Random-phase cosine, stationarity view — for /randomness/stationarity §4α.
 *
 *   X(t) = A cos(2π f₁ t + φ),  φ ~ U[0, S]   with the support S selectable:
 *
 *     full period  S = 2π → every cross-section is symmetric about 0
 *                          → m_X(t) = 0 constant → passes the WSS mean test
 *     half period  S = π  → cross-sections are asymmetric
 *                          → m_X(t) = −(2A/π) sin(2π f₁ t) varies with t → NOT WSS
 *
 *   Top:    realizations + the ensemble-mean curve m_X(t) overlaid, draggable slice.
 *   Bottom: the cross-section histogram at the slice + its mean marker.
 *
 * This is the *mean* condition of WSS made visual (the whole point of slides
 * 24-25); the autocorrelation condition lives in the page's later sections.
 */

const N_SHOWN = 12
const N_HIST = 600
const SAMPLES = 220
const T_SPAN = 2
const F1 = 1.0
const A = 1.0

const REAL_C = 'rgb(29, 78, 216)'
const SLICE_C = 'rgb(217, 119, 6)'
const HIST_C = 'rgba(217, 119, 6, 0.45)'
const MEAN_C = 'rgb(220, 38, 38)'

type Support = 'full' | 'half'
const SUPPORT_MAX: Record<Support, number> = { full: 2 * Math.PI, half: Math.PI }

// ensemble mean m_X(t): 0 for full period, −(2A/π) sin(2π f₁ t) for half
function meanCurve(t: number, support: Support): number {
  if (support === 'full') return 0
  return -((2 * A) / Math.PI) * Math.sin(2 * Math.PI * F1 * t)
}

export function RandomPhaseCosineStationarityViz() {
  const [support, setSupport] = useState<Support>('full')
  const [tSlice, setTSlice] = useState(0.5)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, support, tSlice)
  }, [support, tSlice])

  const isFull = support === 'full'

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        X(t) = A cos(2π f₁ t + φ) — το support της φ κρίνει αν ο μέσος είναι σταθερός
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Διάλεξε το support της τυχαίας φάσης φ. Η <strong>κόκκινη καμπύλη</strong>{' '}
        είναι ο μέσος του ensemble <span className="font-mono">m_X(t)</span>· σύρε την
        time-slice και δες, κάτω, αν η κατανομή των τιμών είναι συμμετρική γύρω από
        το 0 (μέσος 0) ή όχι.
      </p>

      <div
        role="radiogroup"
        aria-label="Phase support"
        className="mb-3 inline-flex flex-wrap items-center gap-1 rounded-md border border-border bg-bg-soft p-0.5 text-[11px]"
      >
        <button
          type="button"
          role="radio"
          aria-checked={isFull}
          onClick={() => setSupport('full')}
          className={cn('rounded px-2.5 py-0.5 transition-colors', isFull ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg')}
        >
          φ ~ U[0, 2π) — full period
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={!isFull}
          onClick={() => setSupport('half')}
          className={cn('rounded px-2.5 py-0.5 transition-colors', !isFull ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg')}
        >
          φ ~ U[0, π] — half period
        </button>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 340 }}
        className="block h-[340px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Random-phase cosine realizations with ensemble mean and the time-slice value distribution"
      />
      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Time-slice t ={' '}
          <span className="font-mono text-fg tabular-nums">{tSlice.toFixed(2)}</span> s
        </label>
        <input
          type="range"
          min={0}
          max={T_SPAN}
          step={0.01}
          value={tSlice}
          onChange={(e) => setTSlice(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        {isFull ? (
          <>
            <strong>Full period (συμμετρικό support):</strong> σε κάθε t η κατανομή
            των τιμών είναι συμμετρική γύρω από το 0, άρα{' '}
            <span className="font-mono">m_X(t) = 0</span> — <strong>σταθερός</strong>.
            Περνάει τη συνθήκη μέσου του WSS (η κόκκινη καμπύλη είναι ίσια στο 0).
          </>
        ) : (
          <>
            <strong>Half period (ασύμμετρο support):</strong> η κατανομή γέρνει,
            άρα <span className="font-mono">m_X(t) = −(2A/π) sin(2π f₁ t)</span>{' '}
            <strong>αλλάζει με τον χρόνο</strong> — <strong>δεν</strong> είναι
            σταθερός, άρα <strong>δεν</strong> είναι WSS (η κόκκινη καμπύλη κυματίζει).
          </>
        )}
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  support: Support,
  tSlice: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const topH = h * 0.6
  drawEnsemble(ctx, colors, 0, 0, w, topH, support, tSlice)
  drawHistogram(ctx, colors, 0, topH + 4, w, h - topH - 4, support, tSlice)
}

function drawEnsemble(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  support: Support,
  tSlice: number,
) {
  if (!colors) return
  const PAD_X = 44
  const PAD_TOP = 16
  const PAD_BOTTOM = 18

  const rng = mulberry32(11)
  const phases = Array.from({ length: N_SHOWN }, () => rng() * SUPPORT_MAX[support])

  const xt = (t: number) => lerp(t, 0, T_SPAN, x0 + PAD_X, x0 + pw - PAD_X)
  const yMid = y0 + PAD_TOP + (ph - PAD_TOP - PAD_BOTTOM) / 2
  const amp = (ph - PAD_TOP - PAD_BOTTOM) * 0.42
  const yv = (v: number) => yMid - v * (amp / A)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`${N_SHOWN} realizations + μέσος ensemble m_X(t)`, x0 + PAD_X, y0 + 11)

  // time-slice line
  const xS = xt(tSlice)
  ctx.strokeStyle = SLICE_C
  ctx.lineWidth = 1.5
  ctx.setLineDash([4, 3])
  ctx.beginPath()
  ctx.moveTo(xS, y0 + PAD_TOP)
  ctx.lineTo(xS, y0 + ph - PAD_BOTTOM)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = SLICE_C
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`t = ${tSlice.toFixed(2)}`, xS, y0 + PAD_TOP - 2)

  // baseline (the m_X = 0 reference)
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yv(0))
  ctx.lineTo(x0 + pw - PAD_X, yv(0))
  ctx.stroke()

  // realizations (faint)
  for (const phi of phases) {
    ctx.strokeStyle = REAL_C
    ctx.globalAlpha = 0.45
    ctx.lineWidth = 1
    ctx.beginPath()
    for (let s = 0; s <= SAMPLES; s++) {
      const t = (s / SAMPLES) * T_SPAN
      const v = A * Math.cos(2 * Math.PI * F1 * t + phi)
      const x = xt(t)
      const y = yv(v)
      if (s === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.globalAlpha = 1
    const vS = A * Math.cos(2 * Math.PI * F1 * tSlice + phi)
    ctx.fillStyle = SLICE_C
    ctx.beginPath()
    ctx.arc(xS, yv(vS), 2.3, 0, Math.PI * 2)
    ctx.fill()
  }

  // ensemble mean curve m_X(t) — bold red
  ctx.strokeStyle = MEAN_C
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let s = 0; s <= SAMPLES; s++) {
    const t = (s / SAMPLES) * T_SPAN
    const y = yv(meanCurve(t, support))
    const x = xt(t)
    if (s === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.fillStyle = MEAN_C
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('m_X(t)', x0 + pw - PAD_X - 40, yv(meanCurve(T_SPAN * 0.97, support)) - 4)

  // axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'right'
  ctx.fillText('+A', x0 + PAD_X - 4, yv(A) + 3)
  ctx.fillText('0', x0 + PAD_X - 4, yv(0) + 3)
  ctx.fillText('−A', x0 + PAD_X - 4, yv(-A) + 3)
}

function drawHistogram(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  support: Support,
  tSlice: number,
) {
  if (!colors) return
  const PAD_X = 44
  const PAD_TOP = 16
  const PAD_BOTTOM = 18

  const rng = mulberry32(909)
  const vals: number[] = []
  let sum = 0
  for (let i = 0; i < N_HIST; i++) {
    const phi = rng() * SUPPORT_MAX[support]
    const v = A * Math.cos(2 * Math.PI * F1 * tSlice + phi)
    vals.push(v)
    sum += v
  }
  const meanEmp = sum / N_HIST

  const NBINS = 30
  const bins = new Array(NBINS).fill(0)
  for (const v of vals) {
    const idx = Math.min(NBINS - 1, Math.max(0, Math.floor(((v + A) / (2 * A)) * NBINS)))
    bins[idx]++
  }
  const maxBin = Math.max(...bins, 1)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`Κατανομή τιμών στη time-slice (t = ${tSlice.toFixed(2)})`, x0 + PAD_X, y0 + 10)

  const xv = (v: number) => lerp(v, -A * 1.2, A * 1.2, x0 + PAD_X, x0 + pw - PAD_X)
  const yh = (c: number) => lerp(c, 0, maxBin * 1.12, y0 + ph - PAD_BOTTOM, y0 + PAD_TOP)
  const yAxis = y0 + ph - PAD_BOTTOM

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yAxis)
  ctx.lineTo(x0 + pw - PAD_X, yAxis)
  ctx.stroke()

  // center line (value = 0) for judging symmetry
  ctx.strokeStyle = colors.border
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  ctx.moveTo(xv(0), yAxis)
  ctx.lineTo(xv(0), y0 + PAD_TOP)
  ctx.stroke()
  ctx.setLineDash([])

  const binW = (xv(A) - xv(-A)) / NBINS
  ctx.fillStyle = HIST_C
  for (let i = 0; i < NBINS; i++) {
    const v = -A + ((i + 0.5) / NBINS) * 2 * A
    const x = xv(v) - binW / 2
    ctx.fillRect(x + 0.5, yh(bins[i]), binW - 1, yAxis - yh(bins[i]))
  }

  // mean marker
  const xm = xv(meanEmp)
  ctx.strokeStyle = MEAN_C
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.moveTo(xm, yAxis)
  ctx.lineTo(xm, y0 + PAD_TOP)
  ctx.stroke()
  ctx.fillStyle = MEAN_C
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = xm > (x0 + pw) / 2 ? 'right' : 'left'
  ctx.fillText(`m_X(t) = ${meanEmp.toFixed(2)}`, xm + (xm > (x0 + pw) / 2 ? -4 : 4), y0 + PAD_TOP + 8)

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('−A', xv(-A), yAxis + 12)
  ctx.fillText('0', xv(0), yAxis + 12)
  ctx.fillText('+A', xv(A), yAxis + 12)
}
