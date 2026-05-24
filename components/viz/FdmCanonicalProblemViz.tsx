'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * The canonical FDM exam problem made visual.
 *
 *   m(t) = sinc(2Wt)   →   M(f) is a RECT of width 2W centered at 0
 *   k(t) = Π(4Wt)       →   K(f) is a SINC of effective bandwidth ~4W (first null)
 *
 * Two carriers f_1, f_2. Toggle DSB-SC vs USSB. Slider for the spacing
 * f_2 - f_1 in units of W. The viz draws four stacked panels showing the
 * step-by-step solution structure:
 *
 *   (1) Baseband M(f) (rect) at f_1's "color band"
 *   (2) Baseband K(f) (sinc) at f_2's "color band"
 *   (3) After modulation: the two spectra placed at ±f_1 and ±f_2
 *   (4) Combined G(f) — with overlap detection (red highlight if collision)
 *
 * Verdict footer states the min spacing condition the student would write
 * on their exam: USSB needs f_2 - f_1 ≥ W (for the m channel) + W_k (for k),
 * but since k is broader, the bottleneck for USSB is "f_2 ≥ f_1 + W"
 * which means f_2 - f_1 ≥ W when f_2 > f_1. For DSB-SC: f_2 - f_1 ≥ W + W_k.
 *
 * Pedagogical claim: this is the single highest-frequency exam problem in
 * the K21 corpus (Πρόοδος A Θ3 / Πρόοδος B Θ3 / Jan'26 Θ3 / June'25 Θ2 /
 * Πρόοδος April'26 Θ3). Walking through this viz step-by-step IS the exam
 * solution.
 */

type ModType = 'dsb' | 'ssb'

const W = 1.0 // m's bandwidth (one-sided, in arbitrary units)
const W_K = 2.0 // k's effective bandwidth (sinc first null), in units of W
const F1 = 3.0 // anchored carrier-1 position

export function FdmCanonicalProblemViz() {
  const [spacing, setSpacing] = useState(5.0) // f_2 - f_1 in units of W
  const [modType, setModType] = useState<ModType>('ssb')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Minimum non-overlap spacing depends on mode AND on which channel is which.
  // For USSB (upper sideband only on the +f side):
  //   channel 1 occupies [f_1, f_1 + W]
  //   channel 2 occupies [f_2, f_2 + W_K]
  //   condition: f_2 ≥ f_1 + W (independent of W_K because channel 2 starts at f_2)
  // For DSB-SC:
  //   channel 1 occupies [f_1 - W, f_1 + W]
  //   channel 2 occupies [f_2 - W_K, f_2 + W_K]
  //   condition: f_2 - W_K ≥ f_1 + W → f_2 - f_1 ≥ W + W_K
  const minSpacing = modType === 'ssb' ? W : W + W_K
  const overlapping = spacing < minSpacing

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, spacing, modType)
  }, [spacing, modType])

  useEffect(() => {
    const onResize = () => {
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) drawScene(canvas, colors, spacing, modType)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [spacing, modType])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Η canonical εξεταστική άσκηση — m(t) = sinc(2Wt), k(t) = Π(4Wt) σε δύο φέροντα
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Δύο μηνύματα διαφορετικού σχήματος, διαφορετικής bandwidth — το{' '}
        <span className="font-mono">m</span> γίνεται <strong>rect</strong> στο πεδίο
        συχνότητας, το <span className="font-mono">k</span> γίνεται <strong>sinc</strong>{' '}
        (πιο πλατύ). Σύρε την απόσταση των δύο φερόντων και δες σε ποια συνθήκη τα δύο
        κανάλια <em>μόλις</em> πάψουν να συγκρούονται.
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div
          role="radiogroup"
          aria-label="Modulation scheme"
          className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
        >
          {(
            [
              { id: 'ssb' as ModType, label: 'USSB (κάθε κανάλι ~W ή W_k)' },
              { id: 'dsb' as ModType, label: 'DSB-SC (κάθε κανάλι 2W ή 2W_k)' },
            ]
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={modType === opt.id}
              onClick={() => setModType(opt.id)}
              className={cn(
                'rounded-full px-2.5 py-0.5 transition-colors',
                modType === opt.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 360 }}
        className="block h-[360px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Step-by-step FDM canonical problem: baseband, modulated, combined spectrum"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Απόσταση φερόντων Δf = f₂ − f₁ ={' '}
          <span className="font-mono text-fg tabular-nums">{spacing.toFixed(2)} W</span>
          {' · '}
          ελάχιστο για μη-σύγκρουση:{' '}
          <span className="font-mono">
            {modType === 'ssb' ? 'W' : `W + W_k = ${(W + W_K).toFixed(0)}W`}
          </span>
          {' · '}
          {overlapping ? (
            <span className="font-semibold text-red-600 dark:text-red-400">
              ⚠ Επικάλυψη (κόκκινη ζώνη στο G(f))
            </span>
          ) : (
            <span className="text-green-700 dark:text-green-400">Καθαρός διαχωρισμός</span>
          )}
        </label>
        <input
          type="range"
          min={0.5}
          max={6}
          step={0.05}
          value={spacing}
          onChange={(e) => setSpacing(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Δf carrier spacing in units of W"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Το exam template σε 4 βήματα:</strong>{' '}
        (1) Σχεδίασε <span className="font-mono">M(f)</span> (rect) και{' '}
        <span className="font-mono">K(f)</span> (sinc) στο baseband.{' '}
        (2) Modulation theorem → <em>shift</em> κάθε baseband στο ±f<sub>c</sub>.{' '}
        (3) Απαίτησε την μικρότερη <span className="font-mono">Δf</span> ώστε οι δύο
        υποστηρίξεις (supports) να μην τέμνονται.{' '}
        (4) Σχεδίασε το <span className="font-mono">G(f) = X_m(f) + X_k(f)</span>.{' '}
        Η μόνη διαφορά μεταξύ DSB και USSB είναι ότι το DSB έχει διπλάσιο εύρος ανά
        κανάλι (κάτι sideband + πάνω sideband, αντί για μόνο πάνω).
      </div>
    </figure>
  )
}

const COLOR_M = 'rgb(29, 78, 216)' // blue
const FILL_M = 'rgba(29, 78, 216, 0.30)'
const COLOR_K = 'rgb(217, 119, 6)' // amber
const FILL_K = 'rgba(217, 119, 6, 0.30)'
const COLOR_OVERLAP = 'rgba(220, 38, 38, 0.55)'

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  spacing: number,
  modType: ModType,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const PAD_X = 32
  const PAD_TOP = 14
  const PAD_BOT = 14

  // 4 stacked panels. The bottom panel (G(f)) gets a little extra room.
  const panelGap = 6
  const panelH = (h - PAD_TOP - PAD_BOT - 3 * panelGap) / 4
  const panelTops = [
    PAD_TOP,
    PAD_TOP + panelH + panelGap,
    PAD_TOP + 2 * (panelH + panelGap),
    PAD_TOP + 3 * (panelH + panelGap),
  ]

  const f2 = F1 + spacing
  // Frequency axis range: include both sides for the modulated/combined panels
  const fMaxModulated = f2 + W_K + 1
  // Use the same x-mapping for ALL panels so spectra align visually
  const fMin = -fMaxModulated
  const fMax = fMaxModulated
  const xt = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)

  // Panel 1: M(f) at baseband — rect from -W to W
  drawPanel(ctx, colors, panelTops[0], panelH, w, 'Baseband: M(f) = rect (από m(t) = sinc(2Wt))', () => {
    drawRect(ctx, xt, panelTops[0], panelH, -W, W, 1.0, COLOR_M, FILL_M)
    labelBracket(ctx, colors, xt(-W), xt(W), panelTops[0] + panelH - 14, '2W', COLOR_M)
  }, xt, fMin, fMax)

  // Panel 2: K(f) at baseband — sinc-like (use cosine envelope as visual approximation)
  drawPanel(ctx, colors, panelTops[1], panelH, w, 'Baseband: K(f) = sinc (από k(t) = Π(4Wt))', () => {
    drawSinc(ctx, xt, panelTops[1], panelH, 0, W_K, 1.0, COLOR_K, FILL_K)
    labelBracket(ctx, colors, xt(-W_K), xt(W_K), panelTops[1] + panelH - 14, `2W_k = ${(2 * W_K).toFixed(0)}W (πρώτο null)`, COLOR_K)
  }, xt, fMin, fMax)

  // Panel 3: After modulation — each baseband shifted to ±f_c
  drawPanel(ctx, colors, panelTops[2], panelH, w, modType === 'ssb' ? 'Modulated USSB: το m στα ±f₁, το k στα ±f₂' : 'Modulated DSB-SC: m γύρω από ±f₁, k γύρω από ±f₂', () => {
    if (modType === 'ssb') {
      // USSB: only the upper sideband; on + side that's [f, f+W]; on - side it mirrors at [-f-W, -f]
      drawRect(ctx, xt, panelTops[2], panelH, F1, F1 + W, 0.95, COLOR_M, FILL_M)
      drawRect(ctx, xt, panelTops[2], panelH, -F1 - W, -F1, 0.95, COLOR_M, FILL_M)
      drawSincBand(ctx, xt, panelTops[2], panelH, f2, f2 + W_K, 0.95, COLOR_K, FILL_K)
      drawSincBand(ctx, xt, panelTops[2], panelH, -f2 - W_K, -f2, 0.95, COLOR_K, FILL_K)
    } else {
      // DSB-SC: full ±W around each carrier
      drawRect(ctx, xt, panelTops[2], panelH, F1 - W, F1 + W, 0.9, COLOR_M, FILL_M)
      drawRect(ctx, xt, panelTops[2], panelH, -F1 - W, -F1 + W, 0.9, COLOR_M, FILL_M)
      drawSinc(ctx, xt, panelTops[2], panelH, f2, W_K, 0.9, COLOR_K, FILL_K)
      drawSinc(ctx, xt, panelTops[2], panelH, -f2, W_K, 0.9, COLOR_K, FILL_K)
    }
    // Mark f_1 and f_2 tick labels at bottom
    const yLab = panelTops[2] + panelH - 4
    ctx.fillStyle = COLOR_M
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('f₁', xt(F1), yLab)
    ctx.fillText('-f₁', xt(-F1), yLab)
    ctx.fillStyle = COLOR_K
    ctx.fillText('f₂', xt(f2), yLab)
    ctx.fillText('-f₂', xt(-f2), yLab)
  }, xt, fMin, fMax)

  // Panel 4: Combined G(f) — with overlap detection
  drawPanel(ctx, colors, panelTops[3], panelH, w, 'Πολυπλεγμένο: G(f) = X_m(f) + X_k(f)', () => {
    // First draw both modulated spectra (same as panel 3)
    if (modType === 'ssb') {
      drawRect(ctx, xt, panelTops[3], panelH, F1, F1 + W, 0.95, COLOR_M, FILL_M)
      drawRect(ctx, xt, panelTops[3], panelH, -F1 - W, -F1, 0.95, COLOR_M, FILL_M)
      drawSincBand(ctx, xt, panelTops[3], panelH, f2, f2 + W_K, 0.95, COLOR_K, FILL_K)
      drawSincBand(ctx, xt, panelTops[3], panelH, -f2 - W_K, -f2, 0.95, COLOR_K, FILL_K)
      // Overlap region: positive side: [f_2, f_1 + W] if f_2 < f_1 + W
      const overlapStart = f2
      const overlapEnd = F1 + W
      if (overlapEnd > overlapStart) {
        drawOverlap(ctx, xt, panelTops[3], panelH, overlapStart, overlapEnd)
        drawOverlap(ctx, xt, panelTops[3], panelH, -overlapEnd, -overlapStart)
      }
    } else {
      drawRect(ctx, xt, panelTops[3], panelH, F1 - W, F1 + W, 0.9, COLOR_M, FILL_M)
      drawRect(ctx, xt, panelTops[3], panelH, -F1 - W, -F1 + W, 0.9, COLOR_M, FILL_M)
      drawSinc(ctx, xt, panelTops[3], panelH, f2, W_K, 0.9, COLOR_K, FILL_K)
      drawSinc(ctx, xt, panelTops[3], panelH, -f2, W_K, 0.9, COLOR_K, FILL_K)
      // DSB overlap: positive side: [f_2 - W_k, f_1 + W]
      const overlapStart = f2 - W_K
      const overlapEnd = F1 + W
      if (overlapEnd > overlapStart) {
        drawOverlap(ctx, xt, panelTops[3], panelH, overlapStart, overlapEnd)
        drawOverlap(ctx, xt, panelTops[3], panelH, -overlapEnd, -overlapStart)
      }
    }
  }, xt, fMin, fMax)
}

function drawPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  yTop: number,
  panelH: number,
  w: number,
  title: string,
  body: () => void,
  xt: (f: number) => number,
  fMin: number,
  fMax: number,
) {
  if (!colors) return
  // Panel background
  ctx.fillStyle = 'rgba(100, 116, 139, 0.05)'
  ctx.fillRect(18, yTop, w - 36, panelH)
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.strokeRect(18, yTop, w - 36, panelH)

  // Title
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(title, 24, yTop + 11)

  // X axis at panel bottom + arrow
  const yAxis = yTop + panelH - 22
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xt(fMin), yAxis)
  ctx.lineTo(xt(fMax), yAxis)
  ctx.stroke()
  // f=0 vertical guide line
  ctx.strokeStyle = colors.border
  ctx.beginPath()
  ctx.moveTo(xt(0), yTop + 16)
  ctx.lineTo(xt(0), yAxis)
  ctx.stroke()

  body()
}

function drawRect(
  ctx: CanvasRenderingContext2D,
  xt: (f: number) => number,
  yTop: number,
  panelH: number,
  fLeft: number,
  fRight: number,
  height: number,
  stroke: string,
  fill: string,
) {
  const yAxis = yTop + panelH - 22
  const yPeak = yTop + 18 + (1 - height) * (yAxis - yTop - 18)
  ctx.fillStyle = fill
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.moveTo(xt(fLeft), yAxis)
  ctx.lineTo(xt(fLeft), yPeak)
  ctx.lineTo(xt(fRight), yPeak)
  ctx.lineTo(xt(fRight), yAxis)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

/** Draws a centered sinc bump at f0 with width parameter W_eff (first-null half-width). */
function drawSinc(
  ctx: CanvasRenderingContext2D,
  xt: (f: number) => number,
  yTop: number,
  panelH: number,
  f0: number,
  Weff: number,
  height: number,
  stroke: string,
  fill: string,
) {
  const yAxis = yTop + panelH - 22
  const yTopUsable = yTop + 18
  const STEPS = 200
  const fLeft = f0 - Weff
  const fRight = f0 + Weff
  ctx.fillStyle = fill
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.moveTo(xt(fLeft), yAxis)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fLeft, fRight)
    const x = (f - f0) / Weff
    let v: number
    if (Math.abs(x) < 1e-6) {
      v = 1
    } else {
      v = Math.sin(Math.PI * x) / (Math.PI * x)
    }
    // Take absolute value as magnitude spectrum (sketch); clip negatives so
    // the visual stays clean and the rectified shape matches the typical
    // exam-board drawing.
    v = Math.abs(v)
    const y = yTopUsable + (1 - v * height) * (yAxis - yTopUsable)
    ctx.lineTo(xt(f), y)
  }
  ctx.lineTo(xt(fRight), yAxis)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

/** Draws the +carrier side of an SSB-shifted sinc: only positive half of the lobe. */
function drawSincBand(
  ctx: CanvasRenderingContext2D,
  xt: (f: number) => number,
  yTop: number,
  panelH: number,
  fLeft: number,
  fRight: number,
  height: number,
  stroke: string,
  fill: string,
) {
  const yAxis = yTop + panelH - 22
  const yTopUsable = yTop + 18
  const STEPS = 150
  const width = fRight - fLeft
  ctx.fillStyle = fill
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.moveTo(xt(fLeft), yAxis)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fLeft, fRight)
    // Use a half-sinc shape: peak at fLeft, descending to 0 at fRight, with
    // sinc-style lobe oscillation in the middle. Sketch-grade — emphasizes
    // "starts at peak, narrows to null".
    const t = (f - fLeft) / width
    const x = t * 2.0 // first null at t=0.5 ⇒ x=1
    const v = Math.abs(t < 1e-6 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x))
    const y = yTopUsable + (1 - v * height) * (yAxis - yTopUsable)
    ctx.lineTo(xt(f), y)
  }
  ctx.lineTo(xt(fRight), yAxis)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

function drawOverlap(
  ctx: CanvasRenderingContext2D,
  xt: (f: number) => number,
  yTop: number,
  panelH: number,
  fStart: number,
  fEnd: number,
) {
  const yAxis = yTop + panelH - 22
  const yPeak = yTop + 12
  ctx.fillStyle = COLOR_OVERLAP
  ctx.fillRect(xt(fStart), yPeak, xt(fEnd) - xt(fStart), yAxis - yPeak)
  ctx.strokeStyle = 'rgb(220, 38, 38)'
  ctx.lineWidth = 1
  ctx.strokeRect(xt(fStart), yPeak, xt(fEnd) - xt(fStart), yAxis - yPeak)
}

function labelBracket(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x1: number,
  x2: number,
  y: number,
  label: string,
  color: string,
) {
  if (!colors) return
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x1, y - 3)
  ctx.lineTo(x1, y + 3)
  ctx.moveTo(x1, y)
  ctx.lineTo(x2, y)
  ctx.moveTo(x2, y - 3)
  ctx.lineTo(x2, y + 3)
  ctx.stroke()
  ctx.fillStyle = color
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(label, (x1 + x2) / 2, y - 5)
}
