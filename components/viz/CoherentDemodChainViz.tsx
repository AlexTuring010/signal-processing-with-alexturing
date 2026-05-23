'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Coherent demodulation of DSB-SC — the FULL chain in time AND frequency.
 *
 * Three columns, two rows each. Each column = one stage:
 *
 *   STAGE 1: input        STAGE 2: multiplied        STAGE 3: LPF output
 *   ───────────────       ──────────────────────     ─────────────────────
 *   x(t) = m(t)·cos       y(t) = x(t)·2cos           m̂(t) = m(t)
 *   X(f) two copies       Y(f) three copies          M(f) single copy
 *   at ±f_c               at 0 and ±2f_c             at 0
 *
 * The reader watches the spectral copies SHIFT as a consequence of the
 * multiplication, then watches the LPF kill the ±2f_c copies. This is the
 * modulation-theorem-in-action moment — the "magic" of coherent demod made
 * visible.
 *
 * Distinct from CoherentDemodulationViz (which is the phase-error sweep,
 * time-domain only). That viz answers "what if the LO drifts?" This viz
 * answers "WHY does multiplying + LPF work in the first place?" — the
 * spectral-shift mechanism.
 */

const FC = 4 // visual carrier position in normalised f units
const FM_VIZ = 0.5 // message animation frequency (time domain)
const W_SUPPORT = 0.8 // visual half-bandwidth of M(f) (rect support)
const M_HEIGHT = 0.55 // peak height of M(f)

const COLOR_M = 'rgb(217, 119, 6)' // amber for true m(t) and M(f)
const COLOR_X = 'rgb(29, 78, 216)' // blue for x(t) / X(f)
const COLOR_Y = 'rgb(168, 85, 247)' // violet for y(t) / Y(f) — the product
const COLOR_RECOVERED = 'rgb(22, 163, 74)' // green for recovered output
const COLOR_LPF = 'rgba(220, 38, 38, 0.50)' // red for LPF cutoff line

export function CoherentDemodChainViz() {
  const [running, setRunning] = useState(true)
  const tRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (running) tRef.current += dt * 0.5
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) drawScene(canvas, colors, tRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Coherent demodulation: γιατί δουλεύει — η αλυσίδα σε χρόνο &amp; συχνότητα
        </h4>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
          aria-label={running ? 'Παύση' : 'Παίξε'}
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {running ? 'Παύση' : 'Παίξε'}
        </button>
      </div>

      <p className="mb-3 text-xs text-fg-muted">
        Τρία στάδια, δύο όψεις σε κάθε στάδιο. Η μηχανική του coherent demod
        είναι όλη <strong>στο φάσμα</strong>: η <em>είσοδος</em> έχει δύο
        αντίγραφα του <span className="font-mono">M(f)</span> στις{' '}
        <span className="font-mono">±f_c</span>· ο{' '}
        <em>πολλαπλασιασμός</em> με <span className="font-mono">2cos(2π f_c t)</span>{' '}
        παράγει αντίγραφα στο 0 και στις <span className="font-mono">±2f_c</span>· το{' '}
        <em>LPF</em> κρατά μόνο αυτό στο 0. Αποτέλεσμα:{' '}
        <span className="font-mono">m̂(t) = m(t)</span>.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 420 }}
        className="block h-[420px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Three-stage coherent demodulation chain in time and frequency"
      />

      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
        <div className="rounded-md border border-blue-400/40 bg-blue-50/60 px-2.5 py-2 dark:border-blue-400/40 dark:bg-blue-400/10">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">Στάδιο 1 — Είσοδος</div>
          <div className="mt-1 font-mono">x(t) = m(t)·cos(2πf_c t)</div>
          <div className="font-mono text-fg-muted">X(f) = ½[M(f−f_c) + M(f+f_c)]</div>
        </div>
        <div className="rounded-md border border-violet-400/40 bg-violet-50/60 px-2.5 py-2 dark:border-violet-400/40 dark:bg-violet-400/10">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">Στάδιο 2 — Πολλαπλασιασμός</div>
          <div className="mt-1 font-mono">y(t) = x(t)·2cos(2πf_c t)</div>
          <div className="font-mono text-fg-muted">Y(f) = M(f) + ½[M(f−2f_c) + M(f+2f_c)]</div>
        </div>
        <div className="rounded-md border border-emerald-400/40 bg-emerald-50/60 px-2.5 py-2 dark:border-emerald-400/40 dark:bg-emerald-400/10">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">Στάδιο 3 — LPF</div>
          <div className="mt-1 font-mono">m̂(t) = m(t)</div>
          <div className="font-mono text-fg-muted">M̂(f) = M(f)  ✓</div>
        </div>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Η κόκκινη γραμμή στο φάσμα <strong>Y(f)</strong> δείχνει το cutoff{' '}
        <span className="font-mono">W &lt; cutoff &lt; 2f_c</span> του LPF: ό,τι
        είναι μέσα στο πορτοκαλί ορθογώνιο γύρω από το 0 περνά αναλλοίωτο, ό,τι
        είναι στις <span className="font-mono">±2f_c</span> πετιέται. Άρα το{' '}
        <span className="font-mono">M̂(f) = M(f)</span> ακριβώς — και επομένως{' '}
        <span className="font-mono">m̂(t) = m(t)</span> ακριβώς. Αυτή είναι η
        ταυτότητα: <em>multiply + filter ↔ shift-back + isolate</em>.
      </div>
    </figure>
  )
}

function m(t: number): number {
  // Smooth message — slow cosine + tiny bias so the spectrum is visibly
  // "spread" rather than a pure impulse. Pure impulse would also work but
  // a band-limited shape makes the rect M(f) story honest.
  return Math.cos(2 * Math.PI * FM_VIZ * t)
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  tNow: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const colW = w / 3
  const rowH = h / 2

  // Background tint per column
  ctx.fillStyle = 'rgba(29, 78, 216, 0.04)'
  ctx.fillRect(0, 0, colW, h)
  ctx.fillStyle = 'rgba(168, 85, 247, 0.05)'
  ctx.fillRect(colW, 0, colW, h)
  ctx.fillStyle = 'rgba(22, 163, 74, 0.04)'
  ctx.fillRect(2 * colW, 0, colW, h)

  // Column dividers
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(colW, 8)
  ctx.lineTo(colW, h - 8)
  ctx.moveTo(2 * colW, 8)
  ctx.lineTo(2 * colW, h - 8)
  ctx.stroke()
  // Row divider
  ctx.beginPath()
  ctx.moveTo(12, rowH)
  ctx.lineTo(w - 12, rowH)
  ctx.stroke()

  // ─── ROW 1: TIME DOMAIN ────────────────────────────────────────
  drawTimeStage1(ctx, colors, 0, 0, colW, rowH, tNow)
  drawTimeStage2(ctx, colors, colW, 0, colW, rowH, tNow)
  drawTimeStage3(ctx, colors, 2 * colW, 0, colW, rowH, tNow)

  // ─── ROW 2: FREQUENCY DOMAIN ───────────────────────────────────
  drawFreqStage1(ctx, colors, 0, rowH, colW, rowH)
  drawFreqStage2(ctx, colors, colW, rowH, colW, rowH)
  drawFreqStage3(ctx, colors, 2 * colW, rowH, colW, rowH)
}

// ─── TIME-DOMAIN STAGES ──────────────────────────────────────────────────

function drawTimeStage1(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  tNow: number,
) {
  if (!colors) return
  ctx.fillStyle = colors.fg
  ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('① x(t) — είσοδος', x0 + pw / 2, y0 + 14)

  drawTimePanel(ctx, colors, x0, y0 + 18, pw, ph - 18, tNow, (t) => m(t) * Math.cos(2 * Math.PI * FC * t), COLOR_X, /* env */ true)
}

function drawTimeStage2(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  tNow: number,
) {
  if (!colors) return
  ctx.fillStyle = colors.fg
  ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('② y(t) — μετά τον πολλαπλασιασμό', x0 + pw / 2, y0 + 14)

  drawTimePanel(
    ctx,
    colors,
    x0,
    y0 + 18,
    pw,
    ph - 18,
    tNow,
    (t) => m(t) * (1 + Math.cos(4 * Math.PI * FC * t)), // = x·2cos = m·(1+cos2θ)
    COLOR_Y,
    /* env */ true,
    /* envFn */ (t) => m(t), // the baseband envelope rides over the fast oscillation
  )
}

function drawTimeStage3(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  tNow: number,
) {
  if (!colors) return
  ctx.fillStyle = colors.fg
  ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('③ m̂(t) — έξοδος LPF', x0 + pw / 2, y0 + 14)

  drawTimePanel(ctx, colors, x0, y0 + 18, pw, ph - 18, tNow, m, COLOR_RECOVERED, /* env */ false)
}

function drawTimePanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  tNow: number,
  fn: (t: number) => number,
  color: string,
  showEnv: boolean,
  envFn?: (t: number) => number,
) {
  if (!colors) return
  const PAD_X = 14
  const PAD_Y = 8
  const yLim = 2.2
  const tWindow = 6
  const tStart = tNow - tWindow * 0.7
  const tEnd = tNow + tWindow * 0.3

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yZero = yv(0)

  // baseline
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  // envelope (faint dashed) for stage 1 and stage 2
  if (showEnv) {
    const ef = envFn ?? ((t: number) => m(t))
    ctx.strokeStyle = COLOR_M
    ctx.lineWidth = 1.2
    ctx.setLineDash([4, 4])
    for (const sign of [1, -1]) {
      ctx.beginPath()
      const ESTEPS = 200
      for (let i = 0; i <= ESTEPS; i++) {
        const t = lerp(i, 0, ESTEPS, tStart, tEnd)
        const e = sign * Math.abs(ef(t))
        const px = xt(t)
        const py = yv(e)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()
    }
    ctx.setLineDash([])
  }

  // main trace
  ctx.strokeStyle = color
  ctx.lineWidth = 1.4
  ctx.beginPath()
  const STEPS = 800
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const v = fn(t)
    const px = xt(t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
}

// ─── FREQUENCY-DOMAIN STAGES ────────────────────────────────────────────

function drawFreqStage1(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
) {
  if (!colors) return
  ctx.fillStyle = colors.fg
  ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('① X(f) — δύο αντίγραφα στις ±f_c', x0 + pw / 2, y0 + 14)

  const fMax = 2 * FC + 1
  const ax = makeFreqAxes(ctx, colors, x0, y0 + 18, pw, ph - 18, fMax)

  // X(f) = ½ [M(f-f_c) + M(f+f_c)]
  drawMCopy(ctx, ax, +FC, 0.5, COLOR_X, 'M(f−f_c)/2')
  drawMCopy(ctx, ax, -FC, 0.5, COLOR_X, 'M(f+f_c)/2')

  drawFreqTicks(ctx, colors, ax, [+FC, -FC, 0], ['f_c', '−f_c', '0'])
}

function drawFreqStage2(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
) {
  if (!colors) return
  ctx.fillStyle = colors.fg
  ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('② Y(f) — τρία αντίγραφα', x0 + pw / 2, y0 + 14)

  const fMax = 2 * FC + 1
  const ax = makeFreqAxes(ctx, colors, x0, y0 + 18, pw, ph - 18, fMax)

  // Y(f) = M(f) + ½ [M(f-2f_c) + M(f+2f_c)]
  drawMCopy(ctx, ax, 0, 1.0, COLOR_RECOVERED, 'M(f) ✓')
  drawMCopy(ctx, ax, +2 * FC, 0.5, COLOR_Y, '')
  drawMCopy(ctx, ax, -2 * FC, 0.5, COLOR_Y, '')

  // LPF cutoff lines
  const cutoff = W_SUPPORT * 2 // between W and 2f_c
  ctx.strokeStyle = COLOR_LPF
  ctx.lineWidth = 1.5
  ctx.setLineDash([6, 4])
  ctx.beginPath()
  ctx.moveTo(ax.xt(+cutoff), ax.yTop)
  ctx.lineTo(ax.xt(+cutoff), ax.yBot)
  ctx.moveTo(ax.xt(-cutoff), ax.yTop)
  ctx.lineTo(ax.xt(-cutoff), ax.yBot)
  ctx.stroke()
  ctx.setLineDash([])
  // LPF passband shading
  ctx.fillStyle = 'rgba(245, 158, 11, 0.10)'
  ctx.fillRect(ax.xt(-cutoff), ax.yTop, ax.xt(+cutoff) - ax.xt(-cutoff), ax.yBot - ax.yTop)
  // LPF cutoff labels
  ctx.fillStyle = 'rgb(220, 38, 38)'
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('LPF cutoff', ax.xt(+cutoff) + 8, ax.yTop + 8)

  drawFreqTicks(ctx, colors, ax, [+2 * FC, -2 * FC, 0], ['2f_c', '−2f_c', '0'])
}

function drawFreqStage3(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
) {
  if (!colors) return
  ctx.fillStyle = colors.fg
  ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('③ M̂(f) = M(f) — μόνο baseband', x0 + pw / 2, y0 + 14)

  const fMax = 2 * FC + 1
  const ax = makeFreqAxes(ctx, colors, x0, y0 + 18, pw, ph - 18, fMax)

  drawMCopy(ctx, ax, 0, 1.0, COLOR_RECOVERED, 'M(f)')
  // Ghost outlines where the discarded copies were
  drawGhostCopy(ctx, ax, +2 * FC)
  drawGhostCopy(ctx, ax, -2 * FC)

  drawFreqTicks(ctx, colors, ax, [+2 * FC, -2 * FC, 0], ['2f_c', '−2f_c', '0'])
}

// Frequency-axis helper
type FreqAxes = {
  xt: (f: number) => number
  yv: (v: number) => number
  yZero: number
  yTop: number
  yBot: number
}

function makeFreqAxes(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  fMax: number,
): FreqAxes {
  const PAD_X = 18
  const PAD_Y = 14

  const xt = (f: number) => lerp(f, -fMax, fMax, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, 0.8, -0.15, y0 + PAD_Y, y0 + ph - PAD_Y)
  const yZero = yv(0)
  const yTop = y0 + PAD_Y - 4
  const yBot = y0 + ph - PAD_Y + 4

  // Baseline
  if (colors) {
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x0 + PAD_X, yZero)
    ctx.lineTo(x0 + pw - PAD_X, yZero)
    ctx.stroke()
  }

  return { xt, yv, yZero, yTop, yBot }
}

// Draw a copy of M(f) (a triangular rect-ish shape) centered at f0 with scale α
function drawMCopy(
  ctx: CanvasRenderingContext2D,
  ax: FreqAxes,
  f0: number,
  scale: number,
  color: string,
  label: string,
) {
  const H = M_HEIGHT * scale
  ctx.fillStyle = withAlpha(color, 0.22)
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5

  // Use a triangular shape (peaked at center) so the FT pair illusion holds visually
  const STEPS = 40
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, f0 - W_SUPPORT, f0 + W_SUPPORT)
    const k = 1 - Math.abs(f - f0) / W_SUPPORT
    const h = Math.max(0, H * k)
    const px = ax.xt(f)
    const py = ax.yv(h)
    if (i === 0) ctx.moveTo(px, ax.yZero)
    ctx.lineTo(px, py)
  }
  ctx.lineTo(ax.xt(f0 + W_SUPPORT), ax.yZero)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Label
  if (label) {
    ctx.fillStyle = color
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(label, ax.xt(f0), ax.yv(H) - 4)
  }
}

function drawGhostCopy(ctx: CanvasRenderingContext2D, ax: FreqAxes, f0: number) {
  const H = M_HEIGHT * 0.5
  ctx.strokeStyle = 'rgb(148, 163, 184)'
  ctx.setLineDash([3, 4])
  ctx.lineWidth = 1
  const STEPS = 40
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, f0 - W_SUPPORT, f0 + W_SUPPORT)
    const k = 1 - Math.abs(f - f0) / W_SUPPORT
    const h = Math.max(0, H * k)
    const px = ax.xt(f)
    const py = ax.yv(h)
    if (i === 0) ctx.moveTo(px, ax.yZero)
    ctx.lineTo(px, py)
  }
  ctx.lineTo(ax.xt(f0 + W_SUPPORT), ax.yZero)
  ctx.stroke()
  ctx.setLineDash([])

  // Red X over the ghost
  ctx.strokeStyle = 'rgb(220, 38, 38)'
  ctx.lineWidth = 2
  const xS = 6
  const cx = ax.xt(f0)
  const cy = ax.yv(H * 0.5)
  ctx.beginPath()
  ctx.moveTo(cx - xS, cy - xS)
  ctx.lineTo(cx + xS, cy + xS)
  ctx.moveTo(cx + xS, cy - xS)
  ctx.lineTo(cx - xS, cy + xS)
  ctx.stroke()
}

function drawFreqTicks(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  ax: FreqAxes,
  positions: number[],
  labels: string[],
) {
  if (!colors) return
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  positions.forEach((f, i) => {
    ctx.fillText(labels[i], ax.xt(f), ax.yZero + 14)
  })
}

function withAlpha(rgb: string, alpha: number): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return rgb
  return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${alpha})`
}
