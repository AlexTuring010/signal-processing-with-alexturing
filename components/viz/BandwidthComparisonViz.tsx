'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { mulberry32, uniform } from '@/lib/random'

/**
 * BandwidthComparisonViz — the "συγκριτική εικόνα" promised in /noise/white-noise
 * §5: the SAME white noise through TWO filters of different bandwidth, both
 * outputs shown at once so the contrast is direct (not toggled).
 *
 *   Narrow filter (small W): output is SLOW and LOW  — Var = N₀·W small.
 *   Wide   filter (large W): output is FAST and HIGH — Var = N₀·W large.
 *
 * Both realizations are built from ONE set of fixed random phases (the shared
 * input noise); a wider passband just keeps more tones, so the wide output is
 * literally the narrow output plus added high-frequency detail. Same vertical
 * scale on both panels so the amplitude difference is honest.
 */

const F_MAX = 50 // Hz — largest bandwidth / tone count
const DF = 1 // Hz — tone spacing (and lowest tone)
const N0 = 1 // normalized one-sided white-noise level
const T_SPAN = 2 // s of y(t) drawn
const N_TONES = Math.round(F_MAX / DF)
const A_TONE = Math.sqrt(2 * N0 * DF) // per-tone amplitude ⇒ Var(y) = N₀·W
const Y_LIM = Math.sqrt(N0 * F_MAX) * 3.0 // shared y-axis so amplitude contrast shows

export function BandwidthComparisonViz() {
  const [wNarrow, setWNarrow] = useState(5)
  const [wWide, setWWide] = useState(40)
  const [seed, setSeed] = useState(3)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // One fixed phase per possible tone = the shared input noise; reseed swaps it.
  const phases = useMemo(() => {
    const rng = mulberry32(seed * 977 + 5)
    return Array.from({ length: N_TONES }, () => uniform(rng, 0, 2 * Math.PI))
  }, [seed])

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    const render = () => {
      if (canvas && colors) drawScene(canvas, colors, wNarrow, wWide, phases)
    }
    render()
    window.addEventListener('resize', render)
    return () => window.removeEventListener('resize', render)
  }, [wNarrow, wWide, phases])

  const zcNarrow = useMemo(() => countZeroCrossings(wNarrow, phases), [wNarrow, phases])
  const zcWide = useMemo(() => countZeroCrossings(wWide, phases), [wWide, phases])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Ίδιος λευκός θόρυβος, δύο φίλτρα — στενό vs ευρύ
        </h4>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
        >
          Νέα δειγματοληψία
        </button>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Same white noise through a narrow and a wide filter, two outputs compared"
      />

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            Στενό φίλτρο W = <span className="font-mono text-fg tabular-nums">{wNarrow} Hz</span>
          </label>
          <input
            type="range"
            min={3}
            max={15}
            step={1}
            value={wNarrow}
            onChange={(e) => setWNarrow(parseInt(e.target.value, 10))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            Ευρύ φίλτρο W = <span className="font-mono text-fg tabular-nums">{wWide} Hz</span>
          </label>
          <input
            type="range"
            min={20}
            max={50}
            step={1}
            value={wWide}
            onChange={(e) => setWWide(parseInt(e.target.value, 10))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
          />
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Στενό: P<sub>Y</sub> = N₀·W · zero-crossings
          </div>
          <div className="font-mono text-fg tabular-nums">
            {(N0 * wNarrow).toFixed(0)} (×N₀) · {zcNarrow}
          </div>
        </div>
        <div className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Ευρύ: P<sub>Y</sub> = N₀·W · zero-crossings
          </div>
          <div className="font-mono text-fg tabular-nums">
            {(N0 * wWide).toFixed(0)} (×N₀) · {zcWide}
          </div>
        </div>
      </div>

      <p className="mt-2 text-xs text-fg-muted">
        Ίδιος θόρυβος εισόδου (ίδιες φάσεις) — μόνο το φίλτρο αλλάζει. Το <strong>στενό</strong> κρατά
        λίγες, αργές συνιστώσες: έξοδος <strong>αργή και χαμηλή</strong>. Το <strong>ευρύ</strong>{' '}
        προσθέτει γρήγορες συνιστώσες πάνω στις ίδιες αργές: έξοδος <strong>γρήγορη και υψηλή</strong>.
        Διπλάσιο W ⇒ διπλάσια ισχύς (πλάτος ∝ √W) <em>και</em> διπλάσιος ρυθμός zero-crossings.
      </p>
    </figure>
  )
}

/** y(t) = A·Σ_{k=1..M} cos(2π·k·t + φ_k), M = round(W/DF). Var = N₀·W. */
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
  wNarrow: number,
  wWide: number,
  phases: number[],
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const GAP = 18
  const panelH = (h - GAP) / 2
  drawTimePanel(ctx, colors, 0, 0, w, panelH, wNarrow, phases, `Στενό φίλτρο — W = ${wNarrow} Hz`)
  drawTimePanel(
    ctx,
    colors,
    0,
    panelH + GAP,
    w,
    panelH,
    wWide,
    phases,
    `Ευρύ φίλτρο — W = ${wWide} Hz`,
  )
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
  label: string,
) {
  if (!colors) return
  const padL = 12
  const padR = 12
  const padT = 16
  const padB = 12
  const M = Math.round(W / DF)
  const xt = (t: number) => lerp(t, 0, T_SPAN, x0 + padL, x0 + pw - padR)
  const yv = (v: number) => lerp(v, Y_LIM, -Y_LIM, y0 + padT, y0 + ph - padB)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(label, x0 + padL, y0 + 10)

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
