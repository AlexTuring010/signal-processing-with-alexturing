'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Visualizes the Nyquist symmetry condition for VSB:
 *
 *     H_VSB(f_c + Δ) + H_VSB(f_c - Δ) = const   for |Δ| < W
 *
 * Most VSB explanations write this in one line and move on. This viz makes
 * the constraint *visible* so the reader can feel why it's the price you pay
 * for envelope-detectable VSB.
 *
 * Two panels:
 *   Top    — |H_VSB(f)| near f_c. The slider's Δ pulls out the matched pair
 *            f_c+Δ and f_c-Δ; vertical bars + dotted droplines highlight
 *            H(f_c+Δ) (blue) and H(f_c-Δ) (violet).
 *   Bottom — three traces vs Δ:
 *              · H(f_c + Δ)        (blue, rising)
 *              · H(f_c - Δ)        (violet, falling)
 *              · their sum         (green, the Nyquist-symmetry test)
 *            For the symmetric filter the green sum trace is FLAT at the
 *            constant value (envelope detection works cleanly). For the
 *            asymmetric filter the green trace dips/wiggles → frequency-
 *            dependent gain at baseband → linear distortion.
 *
 * Toggle: symmetric vs asymmetric (skewed roll-off).
 * Slider: Δ position from 0 → W (drags the test point along).
 * Live readout: H(f_c+Δ), H(f_c-Δ), sum, ✓/✗ verdict.
 */

type Mode = 'symmetric' | 'asymmetric'

const FC = 4
const W = 1.4
const W_VESTIGE = 0.7

const F_MIN = FC - W - 0.3
const F_MAX = FC + W + 0.3

const COLOR_PLUS = 'rgb(29, 78, 216)' // blue — H(f_c+Δ)
const COLOR_MINUS = 'rgb(168, 85, 247)' // violet — H(f_c-Δ)
const COLOR_SUM = 'rgb(22, 163, 74)' // green — sum
const COLOR_SUM_BAD = 'rgb(220, 38, 38)' // red — sum when broken
const COLOR_FILTER = 'rgb(100, 116, 139)' // slate — filter curve

const PAD_X = 44
const PAD_Y = 12
const PANEL_GAP = 6

function shapingFilter(f: number, mode: Mode) {
  const x = f - FC
  if (mode === 'symmetric') {
    if (x >= W_VESTIGE) return 1
    if (x <= -W_VESTIGE) return 0
    return 0.5 * (1 + Math.sin((Math.PI * x) / (2 * W_VESTIGE)))
  }
  // Asymmetric: cosine roll-off but DIFFERENT widths on the two sides.
  // Upper side rolls off slowly (wide), lower side rolls off fast (narrow).
  // This violates the H(f_c+x) + H(f_c-x) = 1 condition.
  const wUpper = W_VESTIGE * 1.4
  const wLower = W_VESTIGE * 0.55
  if (x >= wUpper) return 1
  if (x <= -wLower) return 0
  if (x >= 0) return 0.5 + 0.5 * Math.sin((Math.PI * x) / (2 * wUpper))
  return 0.5 + 0.5 * Math.sin((Math.PI * x) / (2 * wLower))
}

export function VsbNyquistSymmetryViz() {
  const [mode, setMode] = useState<Mode>('symmetric')
  const [delta, setDelta] = useState(0.5)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, mode, delta)
  }, [mode, delta])

  useEffect(() => {
    const onResize = () => {
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) drawScene(canvas, colors, mode, delta)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [mode, delta])

  const hPlus = shapingFilter(FC + delta, mode)
  const hMinus = shapingFilter(FC - delta, mode)
  const sum = hPlus + hMinus
  const sumOk = Math.abs(sum - 1) < 0.02

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Η συνθήκη Nyquist — γιατί το «άθροισμα ζευγαριών» πρέπει να είναι σταθερό
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Σύρε το <strong>Δ</strong> και κοίτα δύο σημεία ταυτόχρονα: το{' '}
        <span className="font-mono text-blue-700 dark:text-blue-300">H(f_c+Δ)</span>{' '}
        πάνω από τον carrier και το{' '}
        <span className="font-mono text-violet-700 dark:text-violet-300">H(f_c−Δ)</span>{' '}
        κάτω από αυτόν. Στο κάτω panel βλέπεις το ίδιο αλλά συναρτήσει του Δ:
        η <strong className="text-green-700 dark:text-green-300">πράσινη</strong>{' '}
        γραμμή είναι το άθροισμα. <strong>Επίπεδη γραμμή = envelope detection
        δουλεύει.</strong>
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
        style={{ height: 360 }}
        className="block h-[360px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Nyquist symmetry pair visualization"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Θέση ζευγαριού Δ ={' '}
          <span className="font-mono text-fg tabular-nums">{delta.toFixed(2)} W</span>
          {' · '}
          <span className="font-mono text-blue-700 dark:text-blue-300">
            H(f_c+Δ) = {hPlus.toFixed(2)}
          </span>
          {' · '}
          <span className="font-mono text-violet-700 dark:text-violet-300">
            H(f_c−Δ) = {hMinus.toFixed(2)}
          </span>
          {' · '}
          <span
            className={cn(
              'font-mono font-semibold tabular-nums',
              sumOk
                ? 'text-green-700 dark:text-green-300'
                : 'text-red-700 dark:text-red-400',
            )}
          >
            άθροισμα = {sum.toFixed(2)} {sumOk ? '✓' : '✗'}
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={W}
          step={0.02}
          value={delta}
          onChange={(e) => setDelta(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Pair position Δ"
        />
      </div>

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
            <strong>Συμμετρικός φίλτρο.</strong> Καθώς σύρεις το Δ από 0 μέχρι το{' '}
            <span className="font-mono">W</span>, το{' '}
            <span className="font-mono">H(f_c+Δ)</span> ανεβαίνει από 0.5 σε 1 και
            το <span className="font-mono">H(f_c−Δ)</span> πέφτει από 0.5 σε 0
            «συμπληρωματικά» — το άθροισμά τους μένει{' '}
            <span className="font-mono">≈ 1</span> πάντα.{' '}
            <strong>Κάθε baseband συχνότητα παίρνει το ίδιο gain</strong> — άρα
            το envelope (που γενικά «ζυγίζει» τις δύο πλευρές) ανακτά το{' '}
            <span className="font-mono">m(t)</span> χωρίς γραμμική παραμόρφωση.
          </>
        ) : (
          <>
            <strong>Σπασμένη συμμετρία.</strong> Η πάνω πλευρά κάνει roll-off
            αργά, η κάτω πλευρά κάνει roll-off γρήγορα — οι δύο τιμές{' '}
            <span className="font-mono">H(f_c±Δ)</span> δεν είναι πια
            συμπληρωματικές. Το άθροισμα{' '}
            <strong>ποικίλει με το Δ</strong>: μικρά Δ παίρνουν gain{' '}
            <span className="font-mono">~1</span>, μεγάλα Δ παίρνουν λιγότερο.{' '}
            <strong>Διαφορετικές baseband συχνότητες παίρνουν διαφορετικό
            gain</strong> → γραμμική παραμόρφωση στο ανακτημένο{' '}
            <span className="font-mono">m̃(t)</span>. Το envelope δεν θα είναι
            πια καθαρό <span className="font-mono">A_c + m(t)</span> — θα έχει
            φιλτραρισμένο χρώμα.
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
  delta: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const rowH = (h - PANEL_GAP) / 2
  drawFilterPanel(ctx, colors, 0, 0, w, rowH, mode, delta)
  drawSumPanel(ctx, colors, 0, rowH + PANEL_GAP, w, rowH, mode, delta)
}

function drawFilterPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  mode: Mode,
  delta: number,
) {
  if (!colors) return
  const xt = (f: number) => lerp(f, F_MIN, F_MAX, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, 1.2, -0.15, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yZero = yv(0)

  // Label
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('|H_VSB(f)| — φίλτρο κοντά στον carrier f_c', x0 + PAD_X, y0 + 10)

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  // Reference lines (0.5 dashed)
  ctx.strokeStyle = colors.fgSubtle
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yv(0.5))
  ctx.lineTo(x0 + pw - PAD_X, yv(0.5))
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yv(1))
  ctx.lineTo(x0 + pw - PAD_X, yv(1))
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('0.5', x0 + PAD_X - 3, yv(0.5) + 3)
  ctx.fillText('1', x0 + PAD_X - 3, yv(1) + 3)
  ctx.fillText('0', x0 + PAD_X - 3, yv(0) + 3)

  // f_c vertical guide
  ctx.strokeStyle = colors.fgSubtle
  ctx.setLineDash([2, 4])
  ctx.beginPath()
  ctx.moveTo(xt(FC), yv(1.15))
  ctx.lineTo(xt(FC), yZero)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'center'
  ctx.fillText('f_c', xt(FC), yZero + 12)

  // Filter curve
  ctx.strokeStyle = COLOR_FILTER
  ctx.lineWidth = 2
  const STEPS = 600
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, F_MIN, F_MAX)
    const v = shapingFilter(f, mode)
    const px = xt(f)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Subtle fill under curve
  ctx.fillStyle = 'rgba(100, 116, 139, 0.10)'
  ctx.beginPath()
  ctx.moveTo(xt(F_MIN), yZero)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, F_MIN, F_MAX)
    const v = shapingFilter(f, mode)
    ctx.lineTo(xt(f), yv(v))
  }
  ctx.lineTo(xt(F_MAX), yZero)
  ctx.closePath()
  ctx.fill()

  // The two test points: f_c+Δ (blue) and f_c-Δ (violet)
  const fPlus = FC + delta
  const fMinus = FC - delta
  const hPlus = shapingFilter(fPlus, mode)
  const hMinus = shapingFilter(fMinus, mode)

  // Droplines + horizontal connectors to axis
  ctx.setLineDash([4, 3])
  ctx.lineWidth = 1.4
  ctx.strokeStyle = COLOR_PLUS
  ctx.beginPath()
  ctx.moveTo(xt(fPlus), yv(hPlus))
  ctx.lineTo(xt(fPlus), yZero)
  ctx.stroke()
  ctx.strokeStyle = COLOR_MINUS
  ctx.beginPath()
  ctx.moveTo(xt(fMinus), yv(hMinus))
  ctx.lineTo(xt(fMinus), yZero)
  ctx.stroke()
  ctx.setLineDash([])

  // Horizontal level lines to left axis
  ctx.lineWidth = 1
  ctx.strokeStyle = COLOR_PLUS
  ctx.setLineDash([2, 4])
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yv(hPlus))
  ctx.lineTo(xt(fPlus), yv(hPlus))
  ctx.stroke()
  ctx.strokeStyle = COLOR_MINUS
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yv(hMinus))
  ctx.lineTo(xt(fMinus), yv(hMinus))
  ctx.stroke()
  ctx.setLineDash([])

  // Filled dots
  ctx.fillStyle = COLOR_PLUS
  ctx.beginPath()
  ctx.arc(xt(fPlus), yv(hPlus), 4.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = COLOR_MINUS
  ctx.beginPath()
  ctx.arc(xt(fMinus), yv(hMinus), 4.5, 0, Math.PI * 2)
  ctx.fill()

  // Δ-labels on axis
  ctx.fillStyle = COLOR_PLUS
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('f_c+Δ', xt(fPlus), yZero + 12)
  ctx.fillStyle = COLOR_MINUS
  ctx.fillText('f_c−Δ', xt(fMinus), yZero + 12)
}

function drawSumPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  mode: Mode,
  delta: number,
) {
  if (!colors) return
  const xt = (d: number) => lerp(d, 0, W, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, 1.35, -0.15, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yZero = yv(0)

  // Label
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Άθροισμα ζευγαριών H(f_c+Δ) + H(f_c−Δ) — συναρτήσει του Δ', x0 + PAD_X, y0 + 10)

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  // y=1 reference (the target constant)
  ctx.strokeStyle = colors.success
  ctx.setLineDash([4, 4])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yv(1))
  ctx.lineTo(x0 + pw - PAD_X, yv(1))
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.success
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('στόχος = 1', x0 + pw - PAD_X - 2, yv(1) - 4)

  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'right'
  ctx.fillText('0', x0 + PAD_X - 3, yv(0) + 3)
  ctx.fillText('0.5', x0 + PAD_X - 3, yv(0.5) + 3)
  ctx.fillText('1', x0 + PAD_X - 3, yv(1) + 3)

  // Three traces vs Δ from 0 to W
  const STEPS = 400
  const plusTrace: [number, number][] = []
  const minusTrace: [number, number][] = []
  const sumTrace: [number, number][] = []
  for (let i = 0; i <= STEPS; i++) {
    const d = lerp(i, 0, STEPS, 0, W)
    const hp = shapingFilter(FC + d, mode)
    const hm = shapingFilter(FC - d, mode)
    plusTrace.push([d, hp])
    minusTrace.push([d, hm])
    sumTrace.push([d, hp + hm])
  }

  const drawTrace = (
    trace: [number, number][],
    color: string,
    width: number,
    dashed: boolean,
  ) => {
    ctx.strokeStyle = color
    ctx.lineWidth = width
    if (dashed) ctx.setLineDash([5, 4])
    ctx.beginPath()
    trace.forEach(([d, v], i) => {
      const px = xt(d)
      const py = yv(v)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    })
    ctx.stroke()
    if (dashed) ctx.setLineDash([])
  }

  drawTrace(plusTrace, COLOR_PLUS, 1.5, true)
  drawTrace(minusTrace, COLOR_MINUS, 1.5, true)

  // Sum trace: green if mostly constant near 1, red otherwise
  const sumMin = Math.min(...sumTrace.map(([, v]) => v))
  const sumMax = Math.max(...sumTrace.map(([, v]) => v))
  const sumIsFlat = sumMax - sumMin < 0.04
  drawTrace(sumTrace, sumIsFlat ? COLOR_SUM : COLOR_SUM_BAD, 2.4, false)

  // Vertical marker at current Δ
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([2, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xt(delta), yv(1.35))
  ctx.lineTo(xt(delta), yZero)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'center'
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText(`Δ = ${delta.toFixed(2)}`, xt(delta), y0 + 10)

  // x-axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'center'
  ctx.fillText('Δ = 0', xt(0), yZero + 12)
  ctx.fillText('Δ = W', xt(W), yZero + 12)

  // Legend
  const legendY = y0 + ph - 6
  const drawSwatch = (px: number, color: string, label: string, dashed: boolean) => {
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    if (dashed) ctx.setLineDash([4, 3])
    ctx.beginPath()
    ctx.moveTo(px, legendY)
    ctx.lineTo(px + 14, legendY)
    ctx.stroke()
    if (dashed) ctx.setLineDash([])
    ctx.fillStyle = colors.fgMuted
    ctx.textAlign = 'left'
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.fillText(label, px + 18, legendY + 3)
  }
  drawSwatch(x0 + PAD_X + 4, COLOR_PLUS, 'H(f_c+Δ)', true)
  drawSwatch(x0 + PAD_X + 84, COLOR_MINUS, 'H(f_c−Δ)', true)
  drawSwatch(
    x0 + PAD_X + 164,
    sumIsFlat ? COLOR_SUM : COLOR_SUM_BAD,
    'άθροισμα',
    false,
  )
}
