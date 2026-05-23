'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Nonlinear modulator output spectrum + BPF + f_c > 3W constraint.
 *
 * V_in(t) = m(t) + A_c cos(ω_c t) through nonlinearity v ↦ d_1 v + d_2 v²
 * gives V_out with 5 spectral components:
 *
 *   - d_1 m(t)            → baseband bump in [-W, +W]
 *   - d_2 m²(t)           → baseband bump in [-2W, +2W]   ← the troublemaker
 *   - d_1 A_c cos(ω_c t)  → impulses at ±f_c
 *   - 2 d_2 A_c m cos     → AM-like band in [f_c ± W] and [-f_c ± W]
 *   - d_2 A_c²/2 · cos(2ω_c t) → impulses at ±2f_c (plus DC pad-up)
 *
 * The BPF [f_c − W, f_c + W] isolates the AM term. For clean isolation,
 * the m² baseband (right edge at 2W) must NOT bleed into the BPF window
 * (left edge at f_c − W). That gives f_c > 3W.
 *
 * Slider sweeps f_c / W; verdict flips at the crossing.
 */

const W = 1 // message bandwidth (normalized)
const F_MAX = 10 * W

const COLOR_BB_M = 'rgb(29, 78, 216)' // blue — d₁ m baseband
const COLOR_BB_M2 = 'rgb(220, 38, 38)' // red — d₂ m² baseband (troublemaker)
const COLOR_CARRIER = 'rgb(168, 85, 247)' // violet — carrier line
const COLOR_AM = 'rgb(22, 163, 74)' // green — AM cross-term
const COLOR_HARMONIC = 'rgb(217, 119, 6)' // amber — 2f_c harmonic
const COLOR_BPF_FILL = 'rgba(245, 158, 11, 0.16)'
const COLOR_BPF_EDGE = 'rgb(245, 158, 11)'

const PAD_X = 36
const PAD_Y = 14

export function NonlinearModulatorSpectrumViz() {
  const [fcOverW, setFcOverW] = useState(4) // safely above 3
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) draw(canvas, colors, fcOverW)
  }, [fcOverW])

  const fc = fcOverW * W
  const cleanIsolation = fc > 3 * W
  const guardBand = fc - 3 * W

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Μη γραμμικός modulator — γιατί χρειάζεται{' '}
        <span className="font-mono">f_c &gt; 3W</span>
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Το <span className="font-mono">V_out(t)</span> έχει 5 φασματικές
        συνιστώσες. Ο BPF γύρω από το{' '}
        <span className="font-mono">f_c</span> (αμπερ ζώνη) πρέπει να
        απομονώσει <strong>μόνο</strong> τον πράσινο AM όρο. Πρόβλημα: ο
        όρος <span style={{ color: COLOR_BB_M2 }}>m²(t)</span> έχει εύρος{' '}
        <span className="font-mono">2W</span> — διπλάσιο του{' '}
        <span className="font-mono">m(t)</span>. Αν το{' '}
        <span className="font-mono">f_c</span> είναι μικρό, το κόκκινο
        ξεχειλίζει μέσα στο BPF.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 240 }}
        className="block h-[240px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Nonlinear modulator output spectrum with BPF window"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          <span className="font-mono">f_c / W</span> ={' '}
          <span className="font-mono tabular-nums text-fg">{fcOverW.toFixed(2)}</span>
          {' · '}
          {cleanIsolation ? (
            <span className="text-green-700 dark:text-green-400">
              ✓ <span className="font-mono">f_c &gt; 3W</span> · guard band{' '}
              <span className="font-mono tabular-nums">{guardBand.toFixed(2)}W</span>
            </span>
          ) : (
            <span className="text-red-600 dark:text-red-400">
              ✗ <span className="font-mono">f_c ≤ 3W</span> · overlap{' '}
              <span className="font-mono tabular-nums">{(3 * W - fc).toFixed(2)}W</span>
            </span>
          )}
        </label>
        <input
          type="range"
          min={0.5}
          max={5}
          step={0.05}
          value={fcOverW}
          onChange={(e) => setFcOverW(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Carrier frequency over message bandwidth"
        />
      </div>

      <div
        className={cn(
          'mt-3 rounded-md border px-3 py-2 text-xs',
          cleanIsolation
            ? 'border-green-500/40 bg-green-500/10 text-green-800 dark:text-green-200'
            : 'border-red-500/40 bg-red-500/10 text-red-800 dark:text-red-200',
        )}
      >
        {cleanIsolation ? (
          <>
            <strong>Καθαρή απομόνωση.</strong> Η κόκκινη ζώνη{' '}
            <span className="font-mono">m²</span> σταματάει στο{' '}
            <span className="font-mono">2W</span> και το BPF αρχίζει στο{' '}
            <span className="font-mono">f_c − W = {(fc - W).toFixed(2)}W</span> —
            καμία επικάλυψη. Στην έξοδο μένει καθαρό AM σήμα.
          </>
        ) : (
          <>
            <strong>Φασματική επικάλυψη.</strong> Η κόκκινη ζώνη{' '}
            <span className="font-mono">m²</span> εκτείνεται μέχρι{' '}
            <span className="font-mono">2W</span> και πέφτει μέσα στο BPF{' '}
            <span className="font-mono">[f_c − W, f_c + W]</span>. Ο AM όρος
            θα παραμορφωθεί από <span className="font-mono">m²(t)</span>{' '}
            bleed-through.
          </>
        )}
      </div>
    </figure>
  )
}

function draw(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  fcOverW: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const fc = fcOverW * W
  const yBase = h - PAD_Y - 18
  const yTop = PAD_Y + 20

  const xf = (f: number) => lerp(f, -F_MAX, F_MAX, PAD_X, w - PAD_X)
  const yPow = (p: number) => lerp(p, 0, 1, yBase, yTop)

  // BPF window — amber shaded at ±f_c
  if (fc - W < F_MAX && fc + W > -F_MAX) {
    ctx.fillStyle = COLOR_BPF_FILL
    const xL = xf(fc - W),
      xR = xf(fc + W)
    ctx.fillRect(Math.min(xL, xR), yTop, Math.abs(xR - xL), yBase - yTop)
    const xLm = xf(-fc - W),
      xRm = xf(-fc + W)
    ctx.fillRect(Math.min(xLm, xRm), yTop, Math.abs(xRm - xLm), yBase - yTop)
    ctx.strokeStyle = COLOR_BPF_EDGE
    ctx.setLineDash([2, 3])
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(xL, yTop)
    ctx.lineTo(xL, yBase)
    ctx.moveTo(xR, yTop)
    ctx.lineTo(xR, yBase)
    ctx.moveTo(xLm, yTop)
    ctx.lineTo(xLm, yBase)
    ctx.moveTo(xRm, yTop)
    ctx.lineTo(xRm, yBase)
    ctx.stroke()
    ctx.setLineDash([])
  }

  // baseline (f = 0 axis)
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yBase)
  ctx.lineTo(w - PAD_X, yBase)
  ctx.stroke()

  // d_2 m² baseband — RED triangle in [-2W, 2W] (drawn FIRST so blue sits on top)
  drawTriangleBand(ctx, xf, yPow, -2 * W, 2 * W, 0.55, COLOR_BB_M2, 0.35)
  // d_1 m baseband — BLUE triangle in [-W, W] (narrower, sits on top of red)
  drawTriangleBand(ctx, xf, yPow, -W, W, 0.7, COLOR_BB_M, 0.55)

  // d_2 · 2 A_c m·cos — GREEN AM cross-term in [f_c ± W] and [-f_c ± W]
  drawTriangleBand(ctx, xf, yPow, fc - W, fc + W, 0.55, COLOR_AM, 0.6)
  drawTriangleBand(ctx, xf, yPow, -fc - W, -fc + W, 0.55, COLOR_AM, 0.6)

  // d_1 A_c carrier — VIOLET impulse at ±f_c
  drawImpulse(ctx, xf(fc), yPow(0.92), yBase, COLOR_CARRIER)
  drawImpulse(ctx, xf(-fc), yPow(0.92), yBase, COLOR_CARRIER)

  // d_2 A_c²/2 · cos(2ω_c t) — AMBER impulses at ±2f_c (if in range)
  if (2 * fc <= F_MAX) {
    drawImpulse(ctx, xf(2 * fc), yPow(0.4), yBase, COLOR_HARMONIC, 1.8)
    drawImpulse(ctx, xf(-2 * fc), yPow(0.4), yBase, COLOR_HARMONIC, 1.8)
  }

  // Frequency axis ticks
  ctx.strokeStyle = colors.fgMuted
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  const tickEntries: Array<{ f: number; label: string }> = [
    { f: 0, label: '0' },
    { f: W, label: 'W' },
    { f: 2 * W, label: '2W' },
    { f: -W, label: '−W' },
    { f: -2 * W, label: '−2W' },
  ]
  // Carrier tick
  tickEntries.push({ f: fc, label: 'f_c' })
  tickEntries.push({ f: -fc, label: '−f_c' })
  // 2f_c tick if in-range
  if (2 * fc + 0.6 < F_MAX) {
    tickEntries.push({ f: 2 * fc, label: '2f_c' })
    tickEntries.push({ f: -2 * fc, label: '−2f_c' })
  }
  for (const t of tickEntries) {
    if (Math.abs(t.f) > F_MAX) continue
    const x = xf(t.f)
    ctx.beginPath()
    ctx.moveTo(x, yBase)
    ctx.lineTo(x, yBase + 4)
    ctx.stroke()
    ctx.fillText(t.label, x, yBase + 14)
  }

  // Legend (top)
  ctx.textAlign = 'left'
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  let lx = PAD_X + 4
  const ly = 8
  const legend: Array<{ label: string; color: string }> = [
    { label: 'd₁m', color: COLOR_BB_M },
    { label: 'd₂m² (2W bump)', color: COLOR_BB_M2 },
    { label: '±f_c carrier', color: COLOR_CARRIER },
    { label: 'AM cross-term', color: COLOR_AM },
    { label: '2f_c harm.', color: COLOR_HARMONIC },
    { label: 'BPF', color: COLOR_BPF_EDGE },
  ]
  for (const item of legend) {
    ctx.fillStyle = item.color
    ctx.fillRect(lx, ly, 10, 4)
    ctx.fillStyle = colors.fgMuted
    ctx.fillText(item.label, lx + 14, ly + 5)
    lx += ctx.measureText(item.label).width + 30
    if (lx > w - PAD_X - 60) break
  }
}

function drawTriangleBand(
  ctx: CanvasRenderingContext2D,
  xf: (f: number) => number,
  yPow: (p: number) => number,
  fL: number,
  fR: number,
  peak: number,
  color: string,
  alpha: number,
) {
  const fMid = (fL + fR) / 2
  ctx.fillStyle = withAlpha(color, alpha)
  ctx.beginPath()
  ctx.moveTo(xf(fL), yPow(0))
  ctx.lineTo(xf(fMid), yPow(peak))
  ctx.lineTo(xf(fR), yPow(0))
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = color
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.moveTo(xf(fL), yPow(0))
  ctx.lineTo(xf(fMid), yPow(peak))
  ctx.lineTo(xf(fR), yPow(0))
  ctx.stroke()
}

function drawImpulse(
  ctx: CanvasRenderingContext2D,
  x: number,
  yTop: number,
  yBase: number,
  color: string,
  arrowSize = 2.4,
) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(x, yBase)
  ctx.lineTo(x, yTop)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x, yTop - arrowSize * 2)
  ctx.lineTo(x - arrowSize, yTop)
  ctx.lineTo(x + arrowSize, yTop)
  ctx.closePath()
  ctx.fill()
}

function withAlpha(rgb: string, alpha: number): string {
  const m = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (!m) return rgb
  return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${alpha})`
}
