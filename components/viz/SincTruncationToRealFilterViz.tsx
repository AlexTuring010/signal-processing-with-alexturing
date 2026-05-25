'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Sinc truncation → real filter
 *
 * The pedagogical bridge: why can't real filters be ideal?
 *
 * Top-left:  ideal LP impulse response h(t) = 2·f_c·sinc(2·f_c·t),
 *            with a truncation window of half-width T shaded. The
 *            portion outside ±T is what we are FORCED to throw away
 *            to make the filter causal + finite-memory.
 *
 * Top-right: |H(f)| of the truncated sinc, computed numerically via a
 *            discrete sum. As T → ∞ the curve approaches the ideal
 *            brick wall; as T shrinks, the rect smears out into a sinc-
 *            shaped envelope with ripple in passband AND stopband and a
 *            non-zero transition width. The ideal rect is overlaid as a
 *            dashed reference.
 *
 * Bottom:    annotations — passband ripple, transition-band width, and
 *            stopband attenuation read off the curve, so the student
 *            sees that the slide 42-46 spec parameters (δ_p, δ_s, f_p,
 *            f_s) ARE the consequence of truncating the sinc.
 */

const FC = 1.0 // ideal LP cutoff
const F_MIN = -2.5
const F_MAX = 2.5
const T_MIN = -8
const T_MAX = 8
const STEPS_F = 300
const STEPS_T = 800

const SINC_C = 'rgb(168, 85, 247)' // violet
const IDEAL_C = 'rgb(29, 78, 216)' // accent blue
const REAL_C = 'rgb(217, 119, 6)' // amber

const PAD = 22

function sincNorm(x: number): number {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}

export function SincTruncationToRealFilterViz() {
  const [halfT, setHalfT] = useState(2.5)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, halfT)
  }, [halfT])

  // For the readout: numerically compute |H(f)| at a couple of test points
  const Htrunc = (f: number) => {
    let s = 0
    const dt = (T_MAX - T_MIN) / STEPS_T
    for (let i = 0; i <= STEPS_T; i++) {
      const t = lerp(i, 0, STEPS_T, T_MAX, T_MIN) // backward direction is fine for cosine integral
      if (Math.abs(t) > halfT) continue
      const h = 2 * FC * sincNorm(2 * FC * t)
      s += h * Math.cos(2 * Math.PI * f * t) * dt
    }
    return Math.abs(s)
  }

  // Stopband attenuation: max |H(f)| for |f| > 1.5 (well into stopband)
  let stopbandMax = 0
  for (let i = 0; i <= 60; i++) {
    const f = lerp(i, 0, 60, 1.5, 2.5)
    const v = Htrunc(f)
    if (v > stopbandMax) stopbandMax = v
  }
  const stopbandDb = stopbandMax > 1e-6 ? 20 * Math.log10(stopbandMax) : -120

  // Passband peak deviation: |H(f) − 1| at f = 0.5 (well inside passband)
  const passVal = Htrunc(0.5)
  const passRipple = Math.abs(passVal - 1)

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Γιατί τα ρεαλιστικά φίλτρα έχουν ripple — κόβουμε το sinc
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Το ιδανικό LP έχει κρουστική απόκριση{' '}
        <span className="font-mono">h(t) = 2 f_c · sinc(2 f_c t)</span> που εκτείνεται στο{' '}
        ±∞. Για να φτιάξουμε πραγματικό φίλτρο, αναγκαζόμαστε να την «κόψουμε» μέσα στο{' '}
        ±T. Σύρε το T παρακάτω: όσο μικρότερο, τόσο πιο ξεθωριασμένο γίνεται το rect στη
        συχνότητα — εμφανίζονται ripple, transition band, και ατελής stopband attenuation.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 280 }}
        className="block h-[280px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Truncated sinc impulse response and resulting |H(f)|"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Παράθυρο αποκοπής: ±T ={' '}
          <span className="font-mono text-fg tabular-nums">{halfT.toFixed(2)}</span>
          <span className="ml-2 text-fg-subtle">
            (μικρό T = γρήγορο φίλτρο με χαμηλή μνήμη, αλλά πιο μεγάλο ripple)
          </span>
        </label>
        <input
          type="range"
          min={0.5}
          max={6}
          step={0.05}
          value={halfT}
          onChange={(e) => setHalfT(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Truncation window half-width"
        />
      </div>

      <div className="mt-3 grid gap-2 text-[11px] text-fg-muted sm:grid-cols-2">
        <div className="rounded-md border border-border bg-bg-soft/50 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Passband ripple στο f = 0.5
          </div>
          <div className="font-mono text-fg tabular-nums">
            |H(0.5) − 1| = {passRipple.toFixed(3)}
          </div>
        </div>
        <div className="rounded-md border border-border bg-bg-soft/50 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Stopband attenuation (max |f| &gt; 1.5)
          </div>
          <div className="font-mono text-fg tabular-nums">
            {stopbandDb.toFixed(1)} dB
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-md border border-amber-300/50 bg-amber-50/50 px-3 py-2 text-xs leading-relaxed dark:border-amber-400/30 dark:bg-amber-400/10">
        <strong>Η ηθική του διδάγματος:</strong> τα <span className="font-mono">δ_p, δ_s, f_p, f_s</span>{' '}
        των slides 42-46 <em>δεν είναι αυθαίρετα μεγέθη</em> — είναι το άμεσο φυσικό
        αποτέλεσμα του ότι κόψαμε το sinc. Πιο μακρύ παράθυρο T (περισσότερη μνήμη /
        καθυστέρηση) ⇒ μικρότερο ripple, στενότερο transition. Δεν υπάρχει «δωρεάν»
        απότομο φίλτρο.
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  halfT: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const splitX = w / 2
  drawTimeDomain(ctx, colors, 0, 0, splitX, h, halfT)
  drawFreqDomain(ctx, colors, splitX, 0, w - splitX, h, halfT)
}

function drawTimeDomain(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  halfT: number,
) {
  if (!colors) return
  const yLim = 2.4

  const xt = (t: number) => lerp(t, T_MIN, T_MAX, x0 + PAD, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, yLim, -yLim * 0.35, y0 + PAD + 16, y0 + ph - PAD)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('h(t) — sinc αποκομμένο στο ±T', x0 + PAD, y0 + 14)

  // baseline + y-axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD, yZero)
  ctx.lineTo(x0 + pw - PAD, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), y0 + PAD + 16)
  ctx.lineTo(xt(0), y0 + ph - PAD)
  ctx.stroke()

  // Shade the "kept" region inside ±T
  ctx.fillStyle = `rgba(${getRGB(SINC_C)}, 0.08)`
  ctx.fillRect(xt(-halfT), y0 + PAD + 16, xt(halfT) - xt(-halfT), ph - PAD * 2 - 16)

  // Full ideal sinc as faint dashed reference
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let i = 0; i <= STEPS_T; i++) {
    const t = lerp(i, 0, STEPS_T, T_MIN, T_MAX)
    const v = 2 * FC * sincNorm(2 * FC * t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(xt(t), py)
    else ctx.lineTo(xt(t), py)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // Truncated sinc (only inside ±T) — solid violet
  ctx.strokeStyle = SINC_C
  ctx.lineWidth = 2
  ctx.beginPath()
  let started = false
  for (let i = 0; i <= STEPS_T; i++) {
    const t = lerp(i, 0, STEPS_T, T_MIN, T_MAX)
    if (Math.abs(t) > halfT) {
      started = false
      continue
    }
    const v = 2 * FC * sincNorm(2 * FC * t)
    const py = yv(v)
    if (!started) {
      ctx.moveTo(xt(t), py)
      started = true
    } else {
      ctx.lineTo(xt(t), py)
    }
  }
  ctx.stroke()

  // Window boundaries
  ctx.strokeStyle = REAL_C
  ctx.setLineDash([4, 3])
  ctx.lineWidth = 1.4
  for (const tBound of [halfT, -halfT]) {
    ctx.beginPath()
    ctx.moveTo(xt(tBound), y0 + PAD + 16)
    ctx.lineTo(xt(tBound), y0 + ph - PAD)
    ctx.stroke()
  }
  ctx.setLineDash([])

  // labels
  ctx.fillStyle = REAL_C
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('+T', xt(halfT), y0 + PAD + 14)
  ctx.fillText('−T', xt(-halfT), y0 + PAD + 14)

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('0', xt(0), yZero + 12)
}

function drawFreqDomain(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  halfT: number,
) {
  if (!colors) return
  const yLim = 1.4

  const xt = (f: number) => lerp(f, F_MIN, F_MAX, x0 + PAD, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, yLim, -0.18, y0 + PAD + 16, y0 + ph - PAD)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('|H(f)| — αποτέλεσμα στη συχνότητα', x0 + PAD, y0 + 14)

  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD, yZero)
  ctx.lineTo(x0 + pw - PAD, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), y0 + PAD + 16)
  ctx.lineTo(xt(0), y0 + ph - PAD)
  ctx.stroke()

  // Ideal rect — dashed reference
  ctx.strokeStyle = IDEAL_C
  ctx.setLineDash([4, 3])
  ctx.lineWidth = 1.3
  ctx.beginPath()
  ctx.moveTo(xt(F_MIN), yZero)
  ctx.lineTo(xt(-FC), yZero)
  ctx.lineTo(xt(-FC), yv(1))
  ctx.lineTo(xt(FC), yv(1))
  ctx.lineTo(xt(FC), yZero)
  ctx.lineTo(xt(F_MAX), yZero)
  ctx.stroke()
  ctx.setLineDash([])

  // Compute |H(f)| of truncated sinc numerically
  const dt = (T_MAX - T_MIN) / STEPS_T
  const values: number[] = []
  for (let i = 0; i <= STEPS_F; i++) {
    const f = lerp(i, 0, STEPS_F, F_MIN, F_MAX)
    let re = 0
    for (let j = 0; j <= STEPS_T; j++) {
      const t = lerp(j, 0, STEPS_T, T_MIN, T_MAX)
      if (Math.abs(t) > halfT) continue
      const h = 2 * FC * sincNorm(2 * FC * t)
      re += h * Math.cos(2 * Math.PI * f * t) * dt
    }
    values.push(Math.abs(re))
  }

  // Filled area
  ctx.fillStyle = `rgba(${getRGB(REAL_C)}, 0.18)`
  ctx.beginPath()
  ctx.moveTo(xt(F_MIN), yZero)
  for (let i = 0; i <= STEPS_F; i++) {
    const f = lerp(i, 0, STEPS_F, F_MIN, F_MAX)
    ctx.lineTo(xt(f), yv(values[i]))
  }
  ctx.lineTo(xt(F_MAX), yZero)
  ctx.closePath()
  ctx.fill()

  // Real curve
  ctx.strokeStyle = REAL_C
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= STEPS_F; i++) {
    const f = lerp(i, 0, STEPS_F, F_MIN, F_MAX)
    const py = yv(values[i])
    if (i === 0) ctx.moveTo(xt(f), py)
    else ctx.lineTo(xt(f), py)
  }
  ctx.stroke()

  // f_c labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('+f_c', xt(FC), yZero + 12)
  ctx.fillText('−f_c', xt(-FC), yZero + 12)

  ctx.textAlign = 'right'
  ctx.fillText('1', x0 + PAD - 3, yv(1) + 3)
  ctx.fillText('0', x0 + PAD - 3, yZero + 3)

  // Legend
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillStyle = IDEAL_C
  ctx.fillText('ideal rect (αναφορά)', x0 + pw - PAD, y0 + 28)
  ctx.fillStyle = REAL_C
  ctx.fillText('truncated sinc → |H(f)|', x0 + pw - PAD, y0 + 40)
}

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}
