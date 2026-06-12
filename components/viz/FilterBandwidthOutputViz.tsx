'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { mulberry32, uniform } from '@/lib/random'

/**
 * FilterBandwidthOutputViz — the slide-56 picture for /noise/white-noise §5:
 * white noise through an ideal LPF of bandwidth W. As W grows the output y(t)
 * gets BOTH larger and faster — the "double identity":
 *   - power   P_Y = N0·W       ∝ W   ⇒ amplitude ∝ √W
 *   - "speed" zero-crossings   ∝ W   ⇒ wiggles get denser
 *
 * Top panel: the flat input PSD with the passband [0, W] shaded — the shaded
 * area IS the output power. Bottom panel: one realization y(t), built as a sum
 * of unit-spaced tones up to W with FIXED random phases, so dragging W adds
 * higher-frequency detail on top of the slow structure (it doesn't reshuffle
 * what's already there). Var = N0·W by construction, top tone = W.
 */

const F_MAX = 50 // Hz — frequency axis / largest bandwidth
const DF = 1 // Hz — tone spacing (and the lowest tone)
const N0 = 1 // normalized one-sided white-noise level
const T_SPAN = 2 // s of y(t) drawn
const N_TONES = Math.round(F_MAX / DF)
const A_TONE = Math.sqrt(2 * N0 * DF) // per-tone amplitude ⇒ Var(y) = N0·W
const Y_LIM = Math.sqrt(N0 * F_MAX) * 3.6 // fixed y-axis so amplitude growth shows

export function FilterBandwidthOutputViz() {
  const [W, setW] = useState(8)
  const [seed, setSeed] = useState(3)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Fixed phases for every possible tone; reseed swaps the whole realization.
  const phases = useMemo(() => {
    const rng = mulberry32(seed * 977 + 5)
    return Array.from({ length: N_TONES }, () => uniform(rng, 0, 2 * Math.PI))
  }, [seed])

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    const render = () => {
      if (canvas && colors) drawScene(canvas, colors, W, phases)
    }
    render()
    window.addEventListener('resize', render)
    return () => window.removeEventListener('resize', render)
  }, [W, phases])

  const M = Math.round(W / DF)
  const power = N0 * M * DF // = N0·W
  // zero-crossing count over the window (a proxy for "speed")
  const zc = useMemo(() => countZeroCrossings(W, phases), [W, phases])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Εύρος ζώνης φίλτρου W → ισχύς + ταχύτητα της εξόδου y(t)
        </h4>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
        >
          Νέα δειγματοληψία
        </button>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setW(5)}
          className="rounded-full border border-border bg-bg-soft px-2.5 py-1 text-xs text-fg-muted hover:border-accent/40 hover:text-fg"
        >
          Στενό (W = 5 Hz)
        </button>
        <button
          type="button"
          onClick={() => setW(40)}
          className="rounded-full border border-border bg-bg-soft px-2.5 py-1 text-xs text-fg-muted hover:border-accent/40 hover:text-fg"
        >
          Ευρύ (W = 40 Hz)
        </button>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Output of a bandlimited filter as bandwidth changes"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Εύρος ζώνης W = <span className="font-mono text-fg tabular-nums">{W} Hz</span> (ιδανικό LPF,
          passband 0–{W} Hz)
        </label>
        <input
          type="range"
          min={3}
          max={F_MAX}
          step={1}
          value={W}
          onChange={(e) => setW(parseInt(e.target.value, 10))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
        />
      </div>

      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Ισχύς εξόδου P<sub>Y</sub> = N₀·W ∝ W
          </div>
          <div className="font-mono text-fg tabular-nums">{power.toFixed(0)} (×N₀)</div>
        </div>
        <div className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            «Ταχύτητα»: zero-crossings στα {T_SPAN}s ∝ W
          </div>
          <div className="font-mono text-fg tabular-nums">{zc}</div>
        </div>
      </div>

      <p className="mt-2 text-xs text-fg-muted">
        Σύρε το W: η έξοδος γίνεται ταυτόχρονα <strong>μεγαλύτερη</strong> (περισσότερη ισχύς, πλάτος ∝
        √W) και <strong>γρηγορότερη</strong> (πιο πυκνά zero-crossings ∝ W). Ίδιος θόρυβος εισόδου —
        μόνο το φίλτρο αλλάζει.
      </p>
    </figure>
  )
}

/** y(t) = A·Σ_{k=1..M} cos(2π·k·t + φ_k), M = round(W/DF). Var = N0·W. */
function evalY(t: number, M: number, phases: number[]): number {
  let s = 0
  for (let k = 1; k <= M; k++) s += Math.cos(2 * Math.PI * (k * DF) * t + phases[k - 1])
  return A_TONE * s
}

function countZeroCrossings(W: number, phases: number[]): number {
  const M = Math.round(W / DF)
  const STEPS = 1600
  let prev = evalY(0, M, phases)
  let count = 0
  for (let i = 1; i <= STEPS; i++) {
    const t = (i / STEPS) * T_SPAN
    const cur = evalY(t, M, phases)
    if ((prev < 0 && cur >= 0) || (prev >= 0 && cur < 0)) count++
    prev = cur
  }
  return count
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  W: number,
  phases: number[],
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const GAP = 20
  const topH = Math.round(h * 0.38)
  drawSpectrumPanel(ctx, colors, 0, 0, w, topH, W)
  drawTimePanel(ctx, colors, 0, topH + GAP, w, h - topH - GAP, W, phases)
}

function drawSpectrumPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  W: number,
) {
  if (!colors) return
  const padL = 40
  const padR = 14
  const padT = 16
  const padB = 18
  const xf = (f: number) => lerp(f, 0, F_MAX, x0 + padL, x0 + pw - padR)
  const top = y0 + padT
  const base = y0 + ph - padB
  const psdH = base - top // height representing N0/2

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('|H(f)| πάνω στον λευκό θόρυβο  →  σκιά = ισχύς εξόδου', x0 + padL, y0 + 9)

  // axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + padL, base)
  ctx.lineTo(x0 + pw - padR, base)
  ctx.stroke()

  // flat input PSD (dashed line at N0/2)
  ctx.strokeStyle = 'rgb(217, 119, 6)'
  ctx.setLineDash([4, 3])
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.moveTo(x0 + padL, top)
  ctx.lineTo(x0 + pw - padR, top)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = 'rgb(217, 119, 6)'
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('S_X = N₀/2', x0 + pw - padR, top - 3)

  // passband [0, W] shaded — the output PSD; its area is the output power
  ctx.fillStyle = 'rgba(29, 78, 216, 0.28)'
  ctx.fillRect(x0 + padL, top, xf(W) - (x0 + padL), psdH)
  ctx.strokeStyle = 'rgb(29, 78, 216)'
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.moveTo(x0 + padL, top)
  ctx.lineTo(xf(W), top)
  ctx.lineTo(xf(W), base)
  ctx.stroke()

  // W marker
  ctx.fillStyle = 'rgb(29, 78, 216)'
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`W = ${W} Hz`, xf(W), base + 12)

  // f-axis ticks
  ctx.fillStyle = colors.fgSubtle
  for (const fr of [0, F_MAX / 2, F_MAX]) {
    if (Math.abs(fr - W) > 4) ctx.fillText(`${fr}`, xf(fr), base + 12)
  }
}

function drawTimePanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  W: number,
  phases: number[],
) {
  if (!colors) return
  const padL = 40
  const padR = 14
  const padT = 14
  const padB = 16
  const M = Math.round(W / DF)
  const xt = (t: number) => lerp(t, 0, T_SPAN, x0 + padL, x0 + pw - padR)
  const yv = (v: number) => lerp(v, Y_LIM, -Y_LIM, y0 + padT, y0 + ph - padB)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Έξοδος y(t) στον χρόνο', x0 + padL, y0 + 9)

  // zero baseline
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(x0 + padL, yZero)
  ctx.lineTo(x0 + pw - padR, yZero)
  ctx.stroke()

  // y(t)
  ctx.strokeStyle = 'rgb(29, 78, 216)'
  ctx.lineWidth = 1.3
  ctx.beginPath()
  const STEPS = 900
  for (let i = 0; i <= STEPS; i++) {
    const t = (i / STEPS) * T_SPAN
    const x = xt(t)
    const y = yv(Math.max(-Y_LIM, Math.min(Y_LIM, evalY(t, M, phases))))
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}
