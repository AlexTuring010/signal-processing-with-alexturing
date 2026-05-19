'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { besselJ, bandwidthN } from '@/lib/bessel'

/**
 * FM single-tone spectrum, drawn as Bessel sidebands.
 *
 * For x_FM(t) = A_c cos(2π f_c t + β sin(2π f_m t)), the spectrum is
 *   X(f) = (A_c/2) Σ_n J_n(β) [δ(f - f_c - n f_m) + δ(f + f_c + n f_m)]
 *
 * We draw the positive-frequency side: a forest of impulses at f_c + n f_m
 * with heights |J_n(β)| · (A_c/2). The carrier is at n=0.
 *
 * Sliders:
 *   β  — modulation index. As β grows, energy shifts from the carrier
 *        (J_0) outward to higher-order sidebands. At β ≈ 2.405 the
 *        carrier vanishes (first zero of J_0) — a classic exam fact.
 *
 * Toggle:
 *   Carson markers — show ±(β+1)f_m around f_c, the bandwidth predicted
 *   by Carson's rule (the bridge to the next chapter).
 */

const FC_VIS = 24 // visual carrier position (in units of f_m)
const N_MAX = 14
const A_C = 1
const PRESETS = [
  { label: 'NBFM', beta: 0.2 },
  { label: 'β = 1', beta: 1.0 },
  { label: 'β ≈ 2.405', beta: 2.405 },
  { label: 'β = 5', beta: 5.0 },
]

export function BesselSpectrumViz() {
  const [beta, setBeta] = useState(2.4)
  const [showCarson, setShowCarson] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, beta, showCarson)

    const onResize = () => {
      if (canvas && colors) drawScene(canvas, colors, beta, showCarson)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [beta, showCarson])

  // Precompute key Bessel values for the readout
  const j0 = besselJ(0, beta)
  const j1 = besselJ(1, beta)
  const j2 = besselJ(2, beta)
  const j3 = besselJ(3, beta)
  const carsonBW = 2 * (beta + 1) // in units of f_m
  const significantN = bandwidthN(beta, 0.01)

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          FM φάσμα — Bessel sidebands στις f_c ± n·f_m
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setBeta(p.beta)}
              className={`rounded-full border px-2.5 py-0.5 text-xs ${
                Math.abs(beta - p.beta) < 0.01
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-3 text-xs text-fg-muted">
        Κάθε γραμμή είναι ένα <strong>sideband</strong>. Ύψος ={' '}
        <span className="font-mono">|J_n(β)| · A_c/2</span>. Η μεσαία γραμμή
        (n=0) είναι ο carrier — κουνάς το β και βλέπεις πώς το <em>ύψος του
        carrier πέφτει</em> και μεταφέρεται σε γειτονικές sidebands.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="FM Bessel spectrum visualization"
      />

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            β = <span className="font-mono text-fg tabular-nums">{beta.toFixed(3)}</span>
          </label>
          <input
            type="range"
            min={0}
            max={8}
            step={0.01}
            value={beta}
            onChange={(e) => setBeta(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Modulation index beta"
          />
        </div>
        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-xs text-fg-muted">
            <input
              type="checkbox"
              checked={showCarson}
              onChange={(e) => setShowCarson(e.target.checked)}
              className="accent-[rgb(var(--accent))]"
            />
            Δείξε Carson bandwidth ±(β+1)f_m
          </label>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <Stat label="J₀(β)" value={j0.toFixed(4)} highlight={Math.abs(j0) < 0.05} />
        <Stat label="J₁(β)" value={j1.toFixed(4)} />
        <Stat label="J₂(β)" value={j2.toFixed(4)} />
        <Stat label="J₃(β)" value={j3.toFixed(4)} />
        <Stat
          label="Σημαντικά sidebands (n)"
          value={`±${significantN}`}
          full
        />
        <Stat label="Carson BW" value={`${carsonBW.toFixed(2)} · f_m`} full />
      </div>

      {Math.abs(j0) < 0.05 && (
        <div className="mt-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs">
          <strong>⚠️ Ο carrier εξαφανίζεται!</strong> Στις τιμές β ≈ 2.405, 5.520, 8.654… ο
          συντελεστής J₀(β) γίνεται μηδέν — όλη η ενέργεια του carrier μεταφέρεται στις
          sidebands. Συχνή ερώτηση εξετάσεων.
        </div>
      )}
    </figure>
  )
}

function Stat({
  label,
  value,
  highlight = false,
  full = false,
}: {
  label: string
  value: string
  highlight?: boolean
  full?: boolean
}) {
  return (
    <div
      className={`rounded-md border px-2 py-1 ${
        highlight
          ? 'border-amber-500/40 bg-amber-500/10'
          : 'border-border bg-bg-soft'
      } ${full ? 'sm:col-span-2' : ''}`}
    >
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="font-mono text-fg tabular-nums">{value}</div>
    </div>
  )
}

const POS_C = 'rgb(29, 78, 216)'
const NEG_C = 'rgb(217, 119, 6)'
const CARRIER_C = 'rgb(168, 85, 247)'

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  beta: number,
  showCarson: boolean,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const PAD_X = 32
  const PAD_TOP = 24
  const PAD_BOTTOM = 36

  // Show window from f_c - 8 f_m to f_c + 8 f_m (in units of f_m)
  const fMin = FC_VIS - 8
  const fMax = FC_VIS + 8

  const xf = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)
  const yMagMax = 0.7
  const yPlot = (mag: number) => lerp(mag, 0, yMagMax, h - PAD_BOTTOM, PAD_TOP)
  const yAxis = h - PAD_BOTTOM

  // Carson bandwidth shading
  if (showCarson) {
    const left = xf(FC_VIS - (beta + 1))
    const right = xf(FC_VIS + (beta + 1))
    ctx.fillStyle = 'rgba(168, 85, 247, 0.08)'
    ctx.fillRect(left, PAD_TOP - 6, right - left, yAxis - PAD_TOP + 6)
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)'
    ctx.setLineDash([4, 4])
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(left, PAD_TOP - 6)
    ctx.lineTo(left, yAxis)
    ctx.moveTo(right, PAD_TOP - 6)
    ctx.lineTo(right, yAxis)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = CARRIER_C
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`Carson BW = 2(β+1)f_m`, (left + right) / 2, PAD_TOP - 8)
  }

  // Frequency axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yAxis)
  ctx.lineTo(w - PAD_X, yAxis)
  ctx.stroke()

  // Axis labels at integer multiples of f_m relative to f_c
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let n = -8; n <= 8; n++) {
    const x = xf(FC_VIS + n)
    ctx.beginPath()
    ctx.moveTo(x, yAxis)
    ctx.lineTo(x, yAxis + 3)
    ctx.stroke()
    if (n === 0) {
      ctx.fillStyle = colors.fg
      ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
      ctx.fillText('f_c', x, yAxis + 14)
      ctx.fillStyle = colors.fgSubtle
      ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    } else if (n % 2 === 0) {
      const sign = n > 0 ? '+' : '−'
      ctx.fillText(`f_c${sign}${Math.abs(n)}f_m`, x, yAxis + 14)
    }
  }
  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'right'
  ctx.fillText('f →', w - PAD_X, yAxis + 26)

  // Y-axis label
  ctx.save()
  ctx.translate(10, h / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'center'
  ctx.fillText('|X(f)|', 0, 0)
  ctx.restore()

  // Draw sidebands
  for (let n = -N_MAX; n <= N_MAX; n++) {
    const f = FC_VIS + n
    if (f < fMin || f > fMax) continue
    const J = besselJ(n, beta)
    const mag = (Math.abs(J) * A_C) / 2
    if (mag < 0.001) continue
    const x = xf(f)
    const yTop = yPlot(mag)
    const isNegativeJ = J < 0
    const isCarrier = n === 0
    ctx.strokeStyle = isCarrier ? CARRIER_C : isNegativeJ ? NEG_C : POS_C
    ctx.fillStyle = ctx.strokeStyle
    ctx.lineWidth = isCarrier ? 2.5 : 1.6

    // Stem
    ctx.beginPath()
    ctx.moveTo(x, yAxis)
    ctx.lineTo(x, yTop)
    ctx.stroke()

    // Arrowhead (impulse marker)
    ctx.beginPath()
    ctx.moveTo(x - 3, yTop + 4)
    ctx.lineTo(x, yTop)
    ctx.lineTo(x + 3, yTop + 4)
    ctx.closePath()
    ctx.fill()

    // Label J_n value (if significant)
    if (mag > 0.04) {
      ctx.fillStyle = colors.fgMuted
      ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`J${subscript(n)}`, x, yTop - 4)
    }
  }

  // Legend (top-left)
  const legendX = PAD_X
  const legendY = PAD_TOP - 4
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  let lx = legendX
  ctx.fillStyle = CARRIER_C
  ctx.fillRect(lx, legendY - 7, 8, 8)
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('carrier (n=0)', lx + 11, legendY)
  lx += 90
  ctx.fillStyle = POS_C
  ctx.fillRect(lx, legendY - 7, 8, 8)
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('Jₙ > 0', lx + 11, legendY)
  lx += 60
  ctx.fillStyle = NEG_C
  ctx.fillRect(lx, legendY - 7, 8, 8)
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('Jₙ < 0', lx + 11, legendY)
}

function subscript(n: number): string {
  const map: Record<string, string> = {
    '-': '₋',
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉',
  }
  return n
    .toString()
    .split('')
    .map((ch) => map[ch] ?? ch)
    .join('')
}
