'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Mechanism viz — *why* the Nyquist symmetry is exactly the condition that
 * makes VSB demodulation clean. Coherent demod multiplies the VSB signal by
 * 2cos(ω_c t), which shifts the VSB spectrum to ±f_c. The two folded copies
 * overlap inside the baseband band [−W, W], and the recovered M̃(f) is the
 * SUM of those overlapping halves:
 *
 *     M̃(f) = X_VSB(f + f_c) + X_VSB(f − f_c)   (then LPF [−W, W])
 *
 * Because X_VSB(f ± f_c) ≈ ½ M(f) · H(f ± f_c) inside the baseband band, this
 * becomes
 *
 *     M̃(f) = ½ M(f) [ H(f_c + f) + H(f_c − f) ]
 *
 * The bracket is exactly the Nyquist-symmetry sum. If it's a constant K, then
 * M̃(f) = ½K · M(f) — clean recovery up to scale. If it varies with f, each
 * frequency of M(f) gets a different gain → linear distortion.
 *
 * Three stacked panels:
 *   1. |X_VSB(f)|  — VSB spectrum (full USB + vestige LSB at ±f_c)
 *   2. The two folded copies after multiplying by 2cos(ω_c t):
 *      - left-shifted copy (X_VSB(f + f_c), blue) covering [−W − vestige, +W]
 *      - right-shifted copy (X_VSB(f − f_c), violet) covering [−W, +W + vestige]
 *      They OVERLAP inside [−W, +W] — the overlap is the heart of the trick.
 *   3. M̃(f) after LPF: their sum, clipped to |f| < W. For symmetric filter
 *      this equals const · M(f) (clean recovery). For asymmetric filter, it's
 *      M(f) with f-dependent gain → coloured / distorted recovery.
 *
 * Toggle: symmetric vs asymmetric (same filter shapes as VsbNyquistSymmetryViz
 * so the reader can connect the two vizzes mentally).
 */

type Mode = 'symmetric' | 'asymmetric'

const FC = 4
const W = 1.4 // message bandwidth
const W_VESTIGE = 0.7

const F_MAX_TOP = FC + W + 0.4
const F_MIN_TOP = -F_MAX_TOP
const F_MAX_BB = W + W_VESTIGE + 0.4
const F_MIN_BB = -F_MAX_BB

const COLOR_USB = 'rgb(29, 78, 216)' // blue — full USB stays full
const COLOR_VESTIGE = 'rgb(217, 119, 6)' // amber — vestige fades
const COLOR_LEFTCOPY = 'rgb(29, 78, 216)' // blue — left-shifted copy
const COLOR_RIGHTCOPY = 'rgb(168, 85, 247)' // violet — right-shifted copy
const COLOR_RECOVERED_OK = 'rgb(22, 163, 74)' // green — clean
const COLOR_RECOVERED_BAD = 'rgb(220, 38, 38)' // red — distorted
const COLOR_GHOST = 'rgba(148, 163, 184, 0.5)'

const PAD_X = 36
const PAD_Y = 10
const PANEL_GAP = 6

function shapingFilter(f: number, mode: Mode) {
  const x = f - FC
  if (mode === 'symmetric') {
    if (x >= W_VESTIGE) return 1
    if (x <= -W_VESTIGE) return 0
    return 0.5 * (1 + Math.sin((Math.PI * x) / (2 * W_VESTIGE)))
  }
  const wUpper = W_VESTIGE * 1.4
  const wLower = W_VESTIGE * 0.55
  if (x >= wUpper) return 1
  if (x <= -wLower) return 0
  if (x >= 0) return 0.5 + 0.5 * Math.sin((Math.PI * x) / (2 * wUpper))
  return 0.5 + 0.5 * Math.sin((Math.PI * x) / (2 * wLower))
}

/** Triangle |M(f)|: peak 1 at f=0, zero at ±W. */
function mEnvelope(f: number) {
  const a = Math.abs(f)
  if (a >= W) return 0
  return 1 - a / W
}

/** DSB-SC baseband spectrum at +f_c: ½ M(f - f_c). */
function dsbBumpAtFc(f: number) {
  return 0.5 * mEnvelope(f - FC)
}
/** DSB-SC baseband spectrum at −f_c: ½ M(f + f_c). */
function dsbBumpAtMinusFc(f: number) {
  return 0.5 * mEnvelope(f + FC)
}

/** VSB spectrum: DSB-SC shaped by H_VSB on both ±f_c. */
function vsbSpectrum(f: number, mode: Mode) {
  // Around +f_c: shape with H_VSB(f)
  // Around -f_c: shape with H_VSB(-f) (for real-signal Hermitian symmetry)
  const atPlus = dsbBumpAtFc(f) * shapingFilter(f, mode)
  const atMinus = dsbBumpAtMinusFc(f) * shapingFilter(-f, mode)
  return atPlus + atMinus
}

export function VsbCoherentReconstructionViz() {
  const [mode, setMode] = useState<Mode>('symmetric')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, mode)
  }, [mode])

  useEffect(() => {
    const onResize = () => {
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) drawScene(canvas, colors, mode)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [mode])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Coherent demod του VSB — οι δύο μισές πλευρές αθροίζονται στο baseband
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Πολλαπλασιάζεις το <span className="font-mono">x_VSB(t)</span> με{' '}
        <span className="font-mono">2cos(ω_c t)</span> και το spectrum
        μετατοπίζεται κατά <span className="font-mono">±f_c</span>. Οι δύο
        αντίγραφες <strong>επικαλύπτονται</strong> στη ζώνη baseband και
        αθροίζονται — γι&apos; αυτό το άθροισμα{' '}
        <span className="font-mono">H(f_c+f)+H(f_c−f)</span> πρέπει να είναι
        σταθερό για να ανακτηθεί καθαρά το <span className="font-mono">M(f)</span>.
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div
          role="radiogroup"
          aria-label="Filter mode"
          className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
        >
          {(
            [
              { id: 'symmetric' as Mode, label: 'Nyquist-συμμετρικός ✓' },
              { id: 'asymmetric' as Mode, label: 'Σπασμένη συμμετρία ✗' },
            ]
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={mode === opt.id}
              onClick={() => setMode(opt.id)}
              className={cn(
                'rounded-full px-2.5 py-0.5 transition-colors',
                mode === opt.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 380 }}
        className="block h-[380px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="VSB coherent reconstruction"
      />

      <div
        className={cn(
          'mt-3 rounded-md border px-3 py-2 text-xs',
          mode === 'symmetric'
            ? 'border-green-500/40 bg-green-500/10 text-green-900 dark:text-green-100'
            : 'border-red-500/40 bg-red-500/10 text-red-900 dark:text-red-100',
        )}
      >
        {mode === 'symmetric' ? (
          <>
            <strong>Καθαρή ανάκτηση.</strong> Στη ζώνη baseband, η{' '}
            <span className="font-mono">M̃(f) = ½ M(f) · [H(f_c+f) + H(f_c−f)]</span>{' '}
            είναι ίση με <span className="font-mono">½ · const · M(f)</span>{' '}
            σε όλη την περιοχή <span className="font-mono">|f| &lt; W</span>.
            Καμία γραμμική παραμόρφωση — απλά εξασθένηση κατά μία σταθερά. Το
            ίδιο μηχανισμό «δίπλωσε-και-πρόσθεσε» εκμεταλλεύεται και ο envelope
            detector με reduced carrier.
          </>
        ) : (
          <>
            <strong>Παραμορφωμένη ανάκτηση.</strong> Το άθροισμα{' '}
            <span className="font-mono">H(f_c+f) + H(f_c−f)</span> ποικίλει με{' '}
            <span className="font-mono">f</span> — άρα διαφορετικά baseband
            συστατικά παίρνουν διαφορετικά gain. Το recovered{' '}
            <span className="font-mono">M̃(f)</span> έχει &quot;χρώμα&quot;: μερικές
            συχνότητες ενισχύονται, άλλες αποδυναμώνονται. Στο video αυτό
            φαίνεται σαν αλλαγμένη φωτεινότητα/contrast. Στο voice σαν παραμορφωμένο
            ηχόχρωμα.
          </>
        )}
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  mode: Mode,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const rowH = (h - 2 * PANEL_GAP) / 3
  drawVsbSpectrumPanel(ctx, colors, 0, 0, w, rowH, mode)
  drawShiftedCopiesPanel(ctx, colors, 0, rowH + PANEL_GAP, w, rowH, mode)
  drawRecoveredPanel(ctx, colors, 0, 2 * (rowH + PANEL_GAP), w, rowH, mode)
}

function drawVsbSpectrumPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  mode: Mode,
) {
  if (!colors) return
  const xt = (f: number) => lerp(f, F_MIN_TOP, F_MAX_TOP, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, 0.65, -0.1, y0 + PAD_Y + 4, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('1. |X_VSB(f)| — VSB φάσμα γύρω από ±f_c', x0 + PAD_X, y0 + 10)

  drawHorizontalAxis(ctx, colors, x0, pw, yZero, PAD_X)
  drawVerticalGuide(ctx, colors, xt(FC), y0 + PAD_Y + 4, yZero, 'f_c')
  drawVerticalGuide(ctx, colors, xt(-FC), y0 + PAD_Y + 4, yZero, '−f_c')
  drawVerticalGuide(ctx, colors, xt(0), y0 + PAD_Y + 4, yZero, '0')

  // Filled VSB spectrum — separately color USB vs vestige for the +f_c side
  const STEPS = 400
  // USB at +f_c (f > FC): the full sideband, kept by filter to 1
  fillRegion(ctx, F_MIN_TOP, F_MAX_TOP, STEPS, xt, yv, yZero,
    (f) => (f > FC ? vsbSpectrum(f, mode) : 0), COLOR_USB)
  // Vestige around ±f_c (f < FC): shaped LSB
  fillRegion(ctx, F_MIN_TOP, F_MAX_TOP, STEPS, xt, yv, yZero,
    (f) => (f >= 0 && f < FC ? vsbSpectrum(f, mode) : 0), COLOR_VESTIGE)
  // Negative side: mirror
  fillRegion(ctx, F_MIN_TOP, F_MAX_TOP, STEPS, xt, yv, yZero,
    (f) => (f <= -FC ? vsbSpectrum(f, mode) : 0), COLOR_USB)
  fillRegion(ctx, F_MIN_TOP, F_MAX_TOP, STEPS, xt, yv, yZero,
    (f) => (f < 0 && f > -FC ? vsbSpectrum(f, mode) : 0), COLOR_VESTIGE)
}

function drawShiftedCopiesPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  mode: Mode,
) {
  if (!colors) return
  const xt = (f: number) => lerp(f, F_MIN_BB, F_MAX_BB, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, 0.65, -0.1, y0 + PAD_Y + 4, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(
    '2. Μετά × 2cos(ω_c t) — δύο μετατοπισμένα αντίγραφα επικαλύπτονται',
    x0 + PAD_X,
    y0 + 10,
  )

  drawHorizontalAxis(ctx, colors, x0, pw, yZero, PAD_X)
  drawVerticalGuide(ctx, colors, xt(0), y0 + PAD_Y + 4, yZero, '0')
  drawVerticalGuide(ctx, colors, xt(W), y0 + PAD_Y + 4, yZero, '+W')
  drawVerticalGuide(ctx, colors, xt(-W), y0 + PAD_Y + 4, yZero, '−W')

  // Two copies: X_VSB shifted to baseband
  //   right-copy:  f-axis here represents X_VSB(f - f_c) ... but wait the formula is
  //   M̃(f) = X_VSB(f + f_c) + X_VSB(f - f_c) (then LPF |f|<W).
  // So we evaluate X_VSB at f+f_c (left-shifted copy: brings the +f_c bump to baseband)
  // and at f-f_c (right-shifted copy: brings the -f_c bump to baseband). Both at baseband.
  // BUT: for visualization, both copies will look the same in shape but in different sub-bands.

  // Left-shifted copy (X_VSB(f + f_c)) — this is the +f_c bump moved to baseband.
  //   Has full USB on f > 0 side and shaped LSB-vestige on f < 0 side.
  const leftCopy = (f: number) => vsbSpectrum(f + FC, mode)
  // Right-shifted copy (X_VSB(f - f_c)) — the -f_c bump moved to baseband.
  //   By symmetry (real x_VSB), this is the mirror: full USB on f < 0 side, vestige on f > 0.
  const rightCopy = (f: number) => vsbSpectrum(f - FC, mode)

  // Draw the right-copy first (violet, behind), then left-copy (blue, in front)
  const STEPS = 400

  // Outline for right-copy
  drawOutlineCurve(ctx, F_MIN_BB, F_MAX_BB, STEPS, xt, yv, yZero, rightCopy,
    COLOR_RIGHTCOPY, 'rgba(168, 85, 247, 0.22)')

  // Outline for left-copy
  drawOutlineCurve(ctx, F_MIN_BB, F_MAX_BB, STEPS, xt, yv, yZero, leftCopy,
    COLOR_LEFTCOPY, 'rgba(29, 78, 216, 0.22)')

  // Mark the overlap region [-W, +W] with subtle background tint
  ctx.fillStyle = 'rgba(22, 163, 74, 0.07)'
  ctx.fillRect(xt(-W), y0 + PAD_Y + 4, xt(W) - xt(-W), yZero - (y0 + PAD_Y + 4))
  ctx.fillStyle = colors.success
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('επικάλυψη: |f| < W', xt(0), y0 + ph - PAD_Y - 4)

  // Legend
  const legendY = y0 + 22
  drawLegendSwatch(ctx, colors, x0 + PAD_X + 4, legendY, COLOR_LEFTCOPY,
    'X_VSB(f + f_c) — αριστερό αντίγραφο')
  drawLegendSwatch(ctx, colors, x0 + PAD_X + 4, legendY + 12, COLOR_RIGHTCOPY,
    'X_VSB(f − f_c) — δεξί αντίγραφο')
}

function drawRecoveredPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  mode: Mode,
) {
  if (!colors) return
  const xt = (f: number) => lerp(f, F_MIN_BB, F_MAX_BB, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, 1.2, -0.15, y0 + PAD_Y + 4, y0 + ph - PAD_Y)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(
    '3. Μετά LPF |f|<W — M̃(f) = ½ M(f) · [H(f_c+f) + H(f_c−f)]',
    x0 + PAD_X,
    y0 + 10,
  )

  drawHorizontalAxis(ctx, colors, x0, pw, yZero, PAD_X)
  drawVerticalGuide(ctx, colors, xt(0), y0 + PAD_Y + 4, yZero, '0')
  drawVerticalGuide(ctx, colors, xt(W), y0 + PAD_Y + 4, yZero, '+W')
  drawVerticalGuide(ctx, colors, xt(-W), y0 + PAD_Y + 4, yZero, '−W')

  // Reference: the original M(f) (faded triangle, peak 1 at 0)
  ctx.strokeStyle = COLOR_GHOST
  ctx.fillStyle = 'rgba(148, 163, 184, 0.15)'
  ctx.lineWidth = 1
  ctx.setLineDash([4, 3])
  ctx.beginPath()
  ctx.moveTo(xt(-W), yZero)
  ctx.lineTo(xt(0), yv(1))
  ctx.lineTo(xt(W), yZero)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('M(f) (αναφορά)', xt(0), yv(1) - 4)

  // M̃(f) for |f| < W: (1/2) M(f) [H(f_c+f) + H(f_c-f)]
  const recovered = (f: number) => {
    if (Math.abs(f) >= W) return 0
    const mf = 1 - Math.abs(f) / W
    return 0.5 * mf * (shapingFilter(FC + f, mode) + shapingFilter(FC - f, mode))
  }

  // Determine flatness: compare M̃(f) shape to M(f) — for symmetric this is M(f)/2
  // For asymmetric it deviates. We measure max relative gain deviation.
  let maxRel = 0, minRel = 100
  for (let i = 0; i < 50; i++) {
    const f = lerp(i, 0, 49, -W * 0.95, W * 0.95)
    const mf = 1 - Math.abs(f) / W
    if (mf > 0.05) {
      const rel = recovered(f) / mf
      if (rel > maxRel) maxRel = rel
      if (rel < minRel) minRel = rel
    }
  }
  const isClean = (maxRel - minRel) < 0.05
  const recoveredColor = isClean ? COLOR_RECOVERED_OK : COLOR_RECOVERED_BAD
  const recoveredFill = isClean ? 'rgba(22, 163, 74, 0.25)' : 'rgba(220, 38, 38, 0.25)'

  drawOutlineCurve(ctx, F_MIN_BB, F_MAX_BB, 400, xt, yv, yZero, recovered,
    recoveredColor, recoveredFill, 2.2)

  // Verdict label inside the panel
  ctx.fillStyle = recoveredColor
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(
    isClean
      ? 'M̃(f) ∝ M(f) — καθαρή ανάκτηση'
      : 'M̃(f) ≠ const · M(f) — γραμμική παραμόρφωση',
    x0 + pw - PAD_X - 4,
    y0 + 22,
  )
}

// ─────────── helpers ───────────

function drawHorizontalAxis(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  pw: number,
  yZero: number,
  padX: number,
) {
  if (!colors) return
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + padX, yZero)
  ctx.lineTo(x0 + pw - padX, yZero)
  ctx.stroke()
}

function drawVerticalGuide(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  px: number,
  yTop: number,
  yZero: number,
  label: string,
) {
  if (!colors) return
  ctx.strokeStyle = colors.fgSubtle
  ctx.setLineDash([2, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(px, yTop)
  ctx.lineTo(px, yZero)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(label, px, yZero + 12)
}

function fillRegion(
  ctx: CanvasRenderingContext2D,
  fMin: number,
  fMax: number,
  steps: number,
  xt: (f: number) => number,
  yv: (v: number) => number,
  yZero: number,
  fn: (f: number) => number,
  color: string,
) {
  ctx.fillStyle = color
  ctx.globalAlpha = 0.55
  ctx.beginPath()
  ctx.moveTo(xt(fMin), yZero)
  for (let i = 0; i <= steps; i++) {
    const f = lerp(i, 0, steps, fMin, fMax)
    ctx.lineTo(xt(f), yv(fn(f)))
  }
  ctx.lineTo(xt(fMax), yZero)
  ctx.closePath()
  ctx.fill()
  ctx.globalAlpha = 1
}

function drawOutlineCurve(
  ctx: CanvasRenderingContext2D,
  fMin: number,
  fMax: number,
  steps: number,
  xt: (f: number) => number,
  yv: (v: number) => number,
  yZero: number,
  fn: (f: number) => number,
  strokeColor: string,
  fillColor: string,
  lineWidth = 1.6,
) {
  ctx.fillStyle = fillColor
  ctx.strokeStyle = strokeColor
  ctx.lineWidth = lineWidth
  ctx.beginPath()
  ctx.moveTo(xt(fMin), yZero)
  for (let i = 0; i <= steps; i++) {
    const f = lerp(i, 0, steps, fMin, fMax)
    ctx.lineTo(xt(f), yv(fn(f)))
  }
  ctx.lineTo(xt(fMax), yZero)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

function drawLegendSwatch(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  px: number,
  py: number,
  color: string,
  label: string,
) {
  if (!colors) return
  ctx.fillStyle = color
  ctx.fillRect(px, py - 5, 10, 7)
  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'left'
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText(label, px + 14, py)
}
