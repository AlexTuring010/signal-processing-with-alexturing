'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Why guard bands exist — real BPFs aren't brick walls, and the leakage
 * is what students need to feel.
 *
 * Three SSB channels packed at f_1, f_2, f_3 with adjustable guard band.
 * A real BPF (the receiver's selector for the middle channel) has a
 * sloped roll-off — the steeper, the better, but never infinite. With
 * zero guard band, the BPF's transition band overlaps the adjacent
 * channels' content → that energy leaks into the recovered signal.
 *
 * Two sliders:
 *   - Guard band g (in units of W): 0 to 0.6
 *   - Filter steepness s (in units of W): 0.05 (very steep) to 1.0 (very gentle)
 *
 * The viz shows the channel spectra + the BPF (top panel) and the leaked
 * energy from the two adjacent channels (bottom panel — the "crosstalk
 * spectrum" that the receiver picks up alongside the wanted signal).
 *
 * A verdict box quantifies the crosstalk in dB so the student sees how
 * the practical filter-shape forces a trade-off between guard band and
 * spectrum utilisation.
 */

const W = 1.0
const PAD_X = 32
const PAD_Y = 16

const COLOR_CH = [
  'rgb(29, 78, 216)', // blue   ch1
  'rgb(217, 119, 6)', // amber  ch2 (selected)
  'rgb(22, 163, 74)', // green  ch3
]
const FILL_CH = [
  'rgba(29, 78, 216, 0.28)',
  'rgba(217, 119, 6, 0.32)',
  'rgba(22, 163, 74, 0.28)',
]
const COLOR_BPF = 'rgb(139, 92, 246)' // violet
const COLOR_LEAK = 'rgba(220, 38, 38, 0.55)'

export function FdmCrossTalkViz() {
  const [guard, setGuard] = useState(0.15) // guard band in units of W (0 = tight pack)
  const [steepness, setSteepness] = useState(0.25) // BPF transition width in units of W
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Channel layout: USSB, each channel occupies [f_c, f_c + W]
  // Channel spacing = W + guard
  const spacing = W + guard
  const f1 = 1.5
  const f2 = f1 + spacing
  const f3 = f2 + spacing

  // The BPF for channel 2 — passband [f_2, f_2 + W], transition band
  // 'steepness' wide on each side (linear roll-off from 1 to 0).
  // Adjacent-channel leakage is the integral of |H_BPF|^2 over the adjacent
  // channel's support. We use a simple linear-ramp model:
  //   - Inside passband: |H|=1
  //   - Within `steepness` of either edge: linear decrease from 1 to 0
  // Then leakage from channel 1 (which is at [f_1, f_1+W]) is the integral
  // of |H|^2 over that range.

  const leak = computeLeakage(f1, f2, f3, steepness)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, guard, steepness)
  }, [guard, steepness])

  useEffect(() => {
    const onResize = () => {
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) drawScene(canvas, colors, guard, steepness)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [guard, steepness])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Γιατί χρειαζόμαστε guard bands — η σκόλη του πραγματικού BPF διαρρέει
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Τρία USSB κανάλια στοιβαγμένα στο φάσμα. Ο δέκτης διαλέγει το{' '}
        <span className="font-mono">μεσαίο</span> (πορτοκαλί) με ένα bandpass φίλτρο. Το
        φίλτρο δεν είναι brick wall — έχει transition band με κλίση. Σύρε τη{' '}
        <strong>guard band</strong> προς το 0 και βλέπε πώς το BPF αρχίζει να μαζεύει
        ενέργεια από τα γειτονικά κανάλια (κόκκινες ζώνες).
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 260 }}
        className="block h-[260px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Three FDM channels with BPF and crosstalk visualization"
      />

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            Guard band ={' '}
            <span className="font-mono text-fg tabular-nums">{guard.toFixed(2)}W</span>
          </label>
          <input
            type="range"
            min={0}
            max={0.6}
            step={0.01}
            value={guard}
            onChange={(e) => setGuard(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Guard band in units of W"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            Στενότητα BPF (πλάτος transition){' '}
            <span className="font-mono text-fg tabular-nums">{steepness.toFixed(2)}W</span>
          </label>
          <input
            type="range"
            min={0.05}
            max={1.0}
            step={0.01}
            value={steepness}
            onChange={(e) => setSteepness(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="BPF transition width in units of W"
          />
        </div>
      </div>

      <div
        className={cn(
          'mt-3 rounded-md border px-3 py-2 text-xs',
          leak.totalDb < -30
            ? 'border-green-500/40 bg-green-500/10 text-green-900 dark:text-green-100'
            : leak.totalDb < -15
              ? 'border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-100'
              : 'border-red-500/40 bg-red-500/10 text-red-900 dark:text-red-100',
        )}
      >
        <strong>Crosstalk από τα 2 γειτονικά κανάλια:</strong>{' '}
        <span className="font-mono">{leak.totalDb.toFixed(1)} dB</span> (από{' '}
        <span className="font-mono">{(leak.leftFraction * 100).toFixed(1)}%</span> του
        αριστερού + <span className="font-mono">{(leak.rightFraction * 100).toFixed(1)}%</span>{' '}
        του δεξιού).{' '}
        {leak.totalDb < -30
          ? 'Καλή απομόνωση — το guard band καλύπτει το transition του φίλτρου.'
          : leak.totalDb < -15
            ? 'Οριακό — ακούγεται «θόρυβος» από τους γείτονες.'
            : 'Καθαρή σύγκρουση — δεν μπορείς να ξεχωρίσεις τους σταθμούς.'}
      </div>

      <div className="mt-2 rounded-md border border-border bg-bg-soft/40 px-3 py-2 text-xs text-fg-muted">
        <strong className="text-fg">Η σύλληψη:</strong> η θεωρητική συνθήκη «Δf ≥ W»
        υποθέτει ιδανικά φίλτρα. Στην πράξη, αν το BPF χρειάζεται transition band{' '}
        <span className="font-mono">s</span> για να πέσει σε αμελητέο gain, χρειάζεσαι
        guard band τουλάχιστον <span className="font-mono">2s</span> (μία transition
        στην κάθε πλευρά) — αλλιώς το επιλεγμένο κανάλι «μολύνεται» από τους γείτονες.
        Στο AM ραδιόφωνο: spacing 10 kHz, χρήσιμη ζώνη ~5 kHz, guard band ~5 kHz — εξ
        ου και ο χαρακτηριστικός «τηγανιτός» ήχος όταν ένας ισχυρός γείτονας είναι
        κοντά.
      </div>
    </figure>
  )
}

/**
 * Compute the fraction of adjacent-channel energy that leaks through the
 * BPF for channel 2. The BPF passband is [f_2, f_2 + W] with transition
 * regions of width `steepness` falling linearly from 1 to 0.
 *
 * Channel 1 occupies [f_1, f_1 + W] (entirely to the left of channel 2).
 * The lower transition of the BPF starts at f_2 - steepness and ends at f_2.
 *
 * If f_1 + W < f_2 - steepness → no leakage (gap is wider than transition).
 * Otherwise the overlap of channel-1's support with the transition window
 * has |H|^2 < 1 — we integrate that.
 */
function computeLeakage(
  f1: number,
  f2: number,
  f3: number,
  steepness: number,
): { totalDb: number; leftFraction: number; rightFraction: number } {
  // Channel-1 leakage (left adjacent):
  // Transition window for the lower edge: [f_2 - steepness, f_2]
  // |H(f)|^2 in this window = ((f - (f_2 - steepness)) / steepness)^2
  // Integrate over the intersection with [f_1, f_1 + W].
  const leftFraction = integrateLeakage(f1, f1 + W, f2 - steepness, f2, true)
  const rightFraction = integrateLeakage(f3, f3 + W, f2 + W, f2 + W + steepness, false)
  const total = leftFraction + rightFraction
  const totalDb = total > 1e-9 ? 10 * Math.log10(total) : -100
  return { totalDb, leftFraction, rightFraction }
}

/**
 * Integrate the leakage of a channel of unit power against the BPF
 * transition region. `risingEdge` = true means |H|^2 rises from 0 to 1 over
 * [transStart, transEnd]; false means it falls from 1 to 0.
 *
 * We then express it as a fraction of the channel's total power
 * (which we treat as unity over its width W).
 */
function integrateLeakage(
  chLeft: number,
  chRight: number,
  transStart: number,
  transEnd: number,
  risingEdge: boolean,
): number {
  // Intersection of channel support with transition window
  const a = Math.max(chLeft, transStart)
  const b = Math.min(chRight, transEnd)
  if (b <= a) return 0
  const transWidth = transEnd - transStart
  if (transWidth < 1e-6) return 0

  // Sample the integral numerically.
  const STEPS = 200
  let acc = 0
  for (let i = 0; i < STEPS; i++) {
    const t = (i + 0.5) / STEPS
    const f = a + t * (b - a)
    // |H(f)|^2: depends on where f is in the transition window
    const u = (f - transStart) / transWidth // 0 at transStart, 1 at transEnd
    const h = risingEdge ? u : 1 - u // rising or falling linear ramp
    acc += h * h * ((b - a) / STEPS)
  }
  // Fraction of channel's total power = acc / W (channel power normalised)
  return acc / W
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  guard: number,
  steepness: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const spacing = W + guard
  const f1 = 1.5
  const f2 = f1 + spacing
  const f3 = f2 + spacing
  const fMin = 0
  const fMax = f3 + W + 0.6

  const xt = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)
  const panelGap = 8
  const panelH = (h - 2 * PAD_Y - panelGap) / 2

  // Top panel: channels + BPF overlay
  drawTopPanel(ctx, colors, xt, w, PAD_Y, panelH, f1, f2, f3, steepness)
  // Bottom panel: what leaks into the BPF output (crosstalk)
  drawBottomPanel(ctx, colors, xt, w, PAD_Y + panelH + panelGap, panelH, f1, f2, f3, steepness)
}

function drawTopPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  xt: (f: number) => number,
  canvasW: number,
  yTop: number,
  panelH: number,
  f1: number,
  f2: number,
  f3: number,
  steepness: number,
) {
  if (!colors) return
  ctx.fillStyle = 'rgba(100, 116, 139, 0.05)'
  ctx.fillRect(18, yTop, canvasW - 36, panelH)
  ctx.strokeStyle = colors.border
  ctx.strokeRect(18, yTop, canvasW - 36, panelH)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Φάσμα + BPF του δέκτη (διαλέγει το μεσαίο κανάλι)', 24, yTop + 11)

  const yAxis = yTop + panelH - 16

  // Channels as rectangles (USSB: flat top from f_c to f_c + W)
  const carriers = [f1, f2, f3]
  carriers.forEach((fc, i) => {
    drawFlatRect(ctx, xt, yTop + 18, yAxis, fc, fc + W, COLOR_CH[i], FILL_CH[i])
    // f_c label
    ctx.fillStyle = COLOR_CH[i]
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`f_${i + 1}`, xt(fc), yAxis + 10)
  })

  // BPF overlay (passband [f_2, f_2 + W], transitions of width steepness)
  ctx.strokeStyle = COLOR_BPF
  ctx.lineWidth = 1.8
  ctx.beginPath()
  ctx.moveTo(xt(f2 - steepness * 1.5), yAxis)
  ctx.lineTo(xt(f2 - steepness), yAxis)
  ctx.lineTo(xt(f2), yTop + 18)
  ctx.lineTo(xt(f2 + W), yTop + 18)
  ctx.lineTo(xt(f2 + W + steepness), yAxis)
  ctx.lineTo(xt(f2 + W + steepness * 1.5), yAxis)
  ctx.stroke()
  ctx.fillStyle = COLOR_BPF
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('BPF', xt(f2 + W / 2) - 8, yTop + 13)

  // Axis line + arrow
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(20, yAxis)
  ctx.lineTo(canvasW - 18, yAxis)
  ctx.stroke()
}

function drawBottomPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  xt: (f: number) => number,
  canvasW: number,
  yTop: number,
  panelH: number,
  f1: number,
  f2: number,
  f3: number,
  steepness: number,
) {
  if (!colors) return
  ctx.fillStyle = 'rgba(100, 116, 139, 0.05)'
  ctx.fillRect(18, yTop, canvasW - 36, panelH)
  ctx.strokeStyle = colors.border
  ctx.strokeRect(18, yTop, canvasW - 36, panelH)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Έξοδος BPF (το που πιάνει ο δέκτης) — με crosstalk', 24, yTop + 11)

  const yAxis = yTop + panelH - 16

  // The wanted channel (ch2, passes at full height)
  drawFlatRect(ctx, xt, yTop + 18, yAxis, f2, f2 + W, COLOR_CH[1], FILL_CH[1])

  // Leakage from ch1: portion of ch1 inside the transition window
  drawLeakageBand(
    ctx,
    xt,
    yTop + 18,
    yAxis,
    f1,
    f1 + W,
    f2 - steepness,
    f2,
    true,
  )
  // Leakage from ch3
  drawLeakageBand(
    ctx,
    xt,
    yTop + 18,
    yAxis,
    f3,
    f3 + W,
    f2 + W,
    f2 + W + steepness,
    false,
  )

  // Axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(20, yAxis)
  ctx.lineTo(canvasW - 18, yAxis)
  ctx.stroke()
}

function drawFlatRect(
  ctx: CanvasRenderingContext2D,
  xt: (f: number) => number,
  yTop: number,
  yAxis: number,
  fLeft: number,
  fRight: number,
  stroke: string,
  fill: string,
) {
  ctx.fillStyle = fill
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.moveTo(xt(fLeft), yAxis)
  ctx.lineTo(xt(fLeft), yTop)
  ctx.lineTo(xt(fRight), yTop)
  ctx.lineTo(xt(fRight), yAxis)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

function drawLeakageBand(
  ctx: CanvasRenderingContext2D,
  xt: (f: number) => number,
  yTop: number,
  yAxis: number,
  chLeft: number,
  chRight: number,
  transStart: number,
  transEnd: number,
  risingEdge: boolean,
) {
  const a = Math.max(chLeft, transStart)
  const b = Math.min(chRight, transEnd)
  if (b <= a) return
  const transWidth = transEnd - transStart
  const STEPS = 80
  const fullH = yAxis - yTop
  ctx.fillStyle = COLOR_LEAK
  ctx.strokeStyle = 'rgb(220, 38, 38)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xt(a), yAxis)
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS
    const f = a + t * (b - a)
    const u = (f - transStart) / transWidth
    const h = Math.max(0, Math.min(1, risingEdge ? u : 1 - u))
    // The leaked portion has amplitude proportional to |H|; we draw |H|^2
    // so the visual matches the power that actually appears at the BPF output.
    const ampSq = h * h
    ctx.lineTo(xt(f), yAxis - ampSq * fullH)
  }
  ctx.lineTo(xt(b), yAxis)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}
