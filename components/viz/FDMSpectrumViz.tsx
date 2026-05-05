'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * FDM (Frequency Division Multiplexing) spectrum viz.
 *
 * Three modulated signals stacked at carriers f_1, f_2, f_3. Slider for
 * carrier spacing. Each signal has the same message bandwidth W. When the
 * spacing drops below the minimum (which depends on whether they're DSB or
 * SSB), the spectra overlap and the channels collide — visible in red.
 *
 * Modulation type toggle: DSB (each signal occupies 2W) or SSB (W).
 * Minimum carrier spacing for non-overlap is 2W for DSB and W for SSB.
 *
 * This is the canonical exam problem — appears in nearly every exam in
 * the K21 corpus (Πρόοδος A Θ3, Πρόοδος B Θ3, Jan'26 Θ3, June'25 Θ2).
 */

type ModType = 'dsb' | 'ssb'

const W = 1.0 // message bandwidth
const NUM_CHANNELS = 3

export function FDMSpectrumViz() {
  const [spacing, setSpacing] = useState(2.5) // carrier spacing in units of W
  const [modType, setModType] = useState<ModType>('dsb')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const minSpacing = modType === 'dsb' ? 2 * W : W // minimum non-overlap spacing
  const overlapping = spacing < minSpacing

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, spacing, modType)
  }, [spacing, modType])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        FDM — τρία κανάλια στοιχειωμένα στο φάσμα
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Τρία messages, καθένα με bandwidth <span className="font-mono">W</span>,
        διαμορφωμένα γύρω από διαφορετικούς carriers. Σύρε το spacing για να
        δεις πότε συγκρούονται. Toggle modulation type — η minimum απόσταση
        αλλάζει: <span className="font-mono">2W</span> για DSB,{' '}
        <span className="font-mono">W</span> για SSB.
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div
          role="radiogroup"
          aria-label="Modulation type"
          className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
        >
          {(['dsb', 'ssb'] as ModType[]).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={modType === m}
              onClick={() => setModType(m)}
              className={cn(
                'rounded-full px-2.5 py-0.5 transition-colors',
                modType === m ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
              )}
            >
              {m === 'dsb' ? 'DSB-SC' : 'SSB (USB)'}
            </button>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 220 }}
        className="block h-[220px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="FDM spectrum showing three channels at variable spacing"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Carrier spacing Δf ={' '}
          <span className="font-mono text-fg tabular-nums">{spacing.toFixed(2)} W</span>
          {' · '}
          ελάχιστο για μη-σύγκρουση: <span className="font-mono">{minSpacing.toFixed(1)} W</span>
          {' · '}
          {overlapping ? (
            <span className="font-semibold text-red-600 dark:text-red-400">
              ⚠ Channels overlap (κόκκινες ζώνες)
            </span>
          ) : (
            <span className="text-green-700 dark:text-green-400">
              Καθαρός διαχωρισμός
            </span>
          )}
        </label>
        <input
          type="range"
          min={0.6}
          max={4}
          step={0.05}
          value={spacing}
          onChange={(e) => setSpacing(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Carrier spacing in units of W"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Η εξεταστική ερώτηση:</strong> δίνεται message{' '}
        <span className="font-mono">m(t) = sinc(2Wt)</span> και «πιάστρα» k(t) σε
        δύο carriers <span className="font-mono">f_1, f_2</span>, ζητείται η
        συνθήκη μη-επικάλυψης. Αν είναι DSB-SC: <span className="font-mono">|f_2 − f_1| ≥ 2W</span>.
        Αν είναι SSB: <span className="font-mono">|f_2 − f_1| ≥ W</span>. Αν είναι
        Conventional AM: ίδιο με DSB-SC ως bandwidth (2W) αλλά με extra carrier
        impulse που δεν προσθέτει στο BW.
      </div>
    </figure>
  )
}

const COLORS_CH = [
  'rgb(29, 78, 216)', // blue
  'rgb(217, 119, 6)', // amber
  'rgb(22, 163, 74)', // green
]
const OVERLAP_C = 'rgba(220, 38, 38, 0.5)'

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  spacing: number,
  modType: ModType,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const PAD_X = 28
  const PAD_Y = 18

  // Carriers at f_1, f_2, f_3 with given spacing
  const f1 = 1.5
  const fcs = Array.from({ length: NUM_CHANNELS }, (_, i) => f1 + i * spacing)
  const fMax = fcs[NUM_CHANNELS - 1] + W + 0.5
  const fMin = -fMax
  const yMax = 1.2

  const xt = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -yMax * 0.3, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // x axis
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

  // arrow
  ctx.fillStyle = colors.fgMuted
  ctx.beginPath()
  ctx.moveTo(w - PAD_X + 6, yZero)
  ctx.lineTo(w - PAD_X - 4, yZero - 4)
  ctx.lineTo(w - PAD_X - 4, yZero + 4)
  ctx.closePath()
  ctx.fill()
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('f', w - PAD_X + 12, yZero + 4)

  // For each channel, draw the spectrum bumps at +f_c and -f_c
  for (let ch = 0; ch < NUM_CHANNELS; ch++) {
    const fc = fcs[ch]
    const color = COLORS_CH[ch]
    const fillColor = color.replace('rgb(', 'rgba(').replace(')', ', 0.30)')

    // Determine the range of frequencies the channel occupies
    if (modType === 'dsb') {
      // DSB-SC: full bandwidth 2W centered at ±f_c
      drawTriangleBump(ctx, xt, yv, fc - W, fc + W, 1, color, fillColor)
      drawTriangleBump(ctx, xt, yv, -fc - W, -fc + W, 1, color, fillColor)
    } else {
      // SSB-USB: only the upper sideband at +f_c (so width W from f_c to f_c+W),
      // mirror at -f_c is on the LOWER side (from -f_c-W to -f_c)
      drawTriangleBump(ctx, xt, yv, fc, fc + W, 1, color, fillColor)
      drawTriangleBump(ctx, xt, yv, -fc - W, -fc, 1, color, fillColor)
    }

    // Carrier label
    ctx.fillStyle = color
    ctx.font = 'bold 10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`f_${ch + 1}`, xt(fc), yZero + 14)
  }

  // Highlight overlap regions in red
  // For DSB: overlap if |f_{i+1} - f_i| < 2W
  // For SSB: overlap if |f_{i+1} - f_i| < W
  const minSpacing = modType === 'dsb' ? 2 * W : W
  if (spacing < minSpacing) {
    for (let ch = 0; ch < NUM_CHANNELS - 1; ch++) {
      const fcA = fcs[ch]
      const fcB = fcs[ch + 1]
      let overlapStart = 0
      let overlapEnd = 0
      if (modType === 'dsb') {
        overlapStart = fcB - W
        overlapEnd = fcA + W
      } else {
        overlapStart = fcB
        overlapEnd = fcA + W
      }
      if (overlapEnd > overlapStart) {
        ctx.fillStyle = OVERLAP_C
        ctx.fillRect(xt(overlapStart), yv(0.6), xt(overlapEnd) - xt(overlapStart), yZero - yv(0.6))
        // Also at the negative side (mirror)
        ctx.fillRect(xt(-overlapEnd), yv(0.6), xt(-overlapStart) - xt(-overlapEnd), yZero - yv(0.6))
      }
    }
  }
}

function drawTriangleBump(
  ctx: CanvasRenderingContext2D,
  xt: (f: number) => number,
  yv: (v: number) => number,
  fLeft: number,
  fRight: number,
  height: number,
  strokeColor: string,
  fillColor: string,
) {
  const fPeak = (fLeft + fRight) / 2
  ctx.fillStyle = fillColor
  ctx.strokeStyle = strokeColor
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.moveTo(xt(fLeft), yv(0))
  ctx.lineTo(xt(fPeak), yv(height))
  ctx.lineTo(xt(fRight), yv(0))
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}
