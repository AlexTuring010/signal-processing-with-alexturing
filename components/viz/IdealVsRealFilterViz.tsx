'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Ideal vs real LP filter — the §7 trade-off capstone, driven by the HONEST
 * mechanism (the same truncation picture as §5's viz) instead of an abstract
 * "sharpness" knob.
 *
 *   Left:  ideal LP impulse response h(t) = 2·f_c·sinc(2·f_c·t), with the kept
 *          window ±T shaded; everything outside ±T is thrown away. The width of
 *          what we keep IS the cost — impulse-response length = memory + delay.
 *   Right: |H(f)| of the truncated sinc (numerical), drawn against the ideal
 *          brick wall (dashed). As T grows the real curve sharpens toward the
 *          ideal; as T shrinks the cutoff softens and ripple grows.
 *
 * So the slider is not a made-up "sharpness" parameter — it is literally how
 * much of the impulse response we can afford to keep, and the cutoff sharpness
 * is the payoff. That is the §7 trade-off: sharper cutoff ⇔ longer (costlier)
 * h(t). The readouts make both sides numeric: impulse length 2T (cost) vs the
 * transition-band width f_s − f_p (benefit).
 *
 * §5's <SincTruncationToRealFilterViz /> uses the same picture to make a
 * different point (where δ_p/δ_s/f_p/f_s come from); here the framing and
 * readouts are the cost-vs-sharpness trade-off.
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

export function IdealVsRealFilterViz() {
  const [halfT, setHalfT] = useState(2.5)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, halfT)
  }, [halfT])

  // Numerically evaluate |H(f)| of the truncated sinc at a single f.
  const Htrunc = (f: number) => {
    let s = 0
    const dt = (T_MAX - T_MIN) / STEPS_T
    for (let i = 0; i <= STEPS_T; i++) {
      const t = lerp(i, 0, STEPS_T, T_MIN, T_MAX)
      if (Math.abs(t) > halfT) continue
      const h = 2 * FC * sincNorm(2 * FC * t)
      s += h * Math.cos(2 * Math.PI * f * t) * dt
    }
    return Math.abs(s)
  }

  // Transition width: gap between the |H| = 0.9 and |H| = 0.1 crossings near the
  // cutoff. Shrinks as T grows (sharper cutoff). One scan, derive both edges.
  let fp = 0
  let fs = F_MAX
  let foundFs = false
  const NPROBE = 100
  for (let i = 0; i <= NPROBE; i++) {
    const f = lerp(i, 0, NPROBE, 0, F_MAX)
    const v = Htrunc(f)
    if (v >= 0.9) fp = f
    if (!foundFs && f > 0.25 && v <= 0.1) {
      fs = f
      foundFs = true
    }
  }
  const transitionW = Math.max(0, fs - fp)
  const impulseLen = 2 * halfT

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Ideal vs real LP filter — το trade-off του απότομου cutoff
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Το ίδιο φίλτρο σε δύο όψεις: αριστερά η ιδανική κρουστική απόκριση{' '}
        <span className="font-mono">h(t) = 2 f_c · sinc(2 f_c t)</span> — κρατάμε
        μόνο το κομμάτι μέσα στο <span className="font-mono">±T</span> και πετάμε
        το υπόλοιπο. Δεξιά, το <span className="font-mono">|H(f)|</span> που
        προκύπτει, δίπλα στο ιδανικό brick wall (διακεκομμένο). Σύρε το{' '}
        <span className="font-mono">T</span> — δηλαδή <em>πόσο sinc κρατάς</em>.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 280 }}
        className="block h-[280px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Truncated ideal sinc next to the resulting |H(f)| against the ideal brick wall"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Πόσο sinc κρατάμε: ±T ={' '}
          <span className="font-mono text-fg tabular-nums">{halfT.toFixed(2)}</span>
          <span className="ml-2 text-fg-subtle">
            (μεγάλο T = πιο απότομο cutoff, αλλά μακρύτερη + πιο ακριβή κρουστική απόκριση)
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
          aria-label="How much of the sinc to keep (truncation half-width T)"
        />
      </div>

      <div className="mt-3 grid gap-2 text-[11px] text-fg-muted sm:grid-cols-2">
        <div className="rounded-md border border-border bg-bg-soft/50 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Το κόστος → μήκος κρουστικής ≈ 2T
          </div>
          <div className="font-mono text-fg tabular-nums">
            2T = {impulseLen.toFixed(1)} (μνήμη + καθυστέρηση)
          </div>
        </div>
        <div className="rounded-md border border-border bg-bg-soft/50 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Το όφελος → ζώνη μετάβασης (cutoff)
          </div>
          <div className="font-mono text-fg tabular-nums">
            f_s − f_p ≈ {transitionW.toFixed(2)} (πιο στενή = πιο απότομο)
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Πιο απότομο cutoff = πιο μακριά κρουστική απόκριση (περισσότερη μνήμη,
        περισσότερη καθυστέρηση). Πιο μικρό ripple = πιο πολύπλοκο φίλτρο. Είναι
        το θεμελιώδες σχεδιαστικό trade-off — δεν παίρνεις «ιδανικό» χωρίς κόστος.
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
  ctx.fillText('h(t) — κρατάμε μόνο το ±T', x0 + PAD, y0 + 14)

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

  // Full ideal sinc as faint dashed reference (what we are forced to throw away)
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

  // "length = cost" span arrow under the kept window
  const yArrow = y0 + ph - PAD - 4
  ctx.strokeStyle = REAL_C
  ctx.fillStyle = REAL_C
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(xt(-halfT), yArrow)
  ctx.lineTo(xt(halfT), yArrow)
  ctx.stroke()
  for (const [tx, dir] of [[halfT, -1], [-halfT, 1]] as const) {
    ctx.beginPath()
    ctx.moveTo(xt(tx), yArrow)
    ctx.lineTo(xt(tx) + dir * 4, yArrow - 3)
    ctx.lineTo(xt(tx) + dir * 4, yArrow + 3)
    ctx.closePath()
    ctx.fill()
  }
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('μήκος ≈ 2T = κόστος', xt(0), yArrow - 4)

  // window labels
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
  ctx.fillText('|H(f)| — ιδανικό vs αυτό που βγαίνει', x0 + PAD, y0 + 14)

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

  // Ideal rect — dashed reference (the brick wall we are aiming at)
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
  ctx.fillText('ideal brick wall', x0 + pw - PAD, y0 + 28)
  ctx.fillStyle = REAL_C
  ctx.fillText('αυτό που βγαίνει', x0 + pw - PAD, y0 + 40)
}

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}
