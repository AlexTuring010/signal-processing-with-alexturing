'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Σχέση μιγαδικής ↔ cosine μορφής (foundations/fourier-series): the
 * conjugate pair a_k e^{j2πkf₀t} + a_{-k} e^{-j2πkf₀t} fusing into one
 * real cosine 2|a_k|·cos(2πkf₀t + ∠a_k).
 *
 * Unlike CounterRotatingPhasors (which fixes amplitude ½ and zero phase
 * to teach Euler / negative frequency on the reference pages), this viz
 * exposes the two knobs the Fourier-series section is *about*:
 *   • |a_k|  →  amplitude A_k = 2|a_k|   (the ×2 made visible on screen)
 *   • ∠a_k  →  phase     φ_k = ∠a_k
 *
 * Left panel: complex plane. The +k phasor turns CCW, the −k phasor is
 * its mirror across the real axis (a_{-k} = a_k*) and turns CW. Dashed
 * vertical drops show their imaginary parts are equal-and-opposite (they
 * cancel); the bold horizontal vector is the real sum 2|a_k|cosθ.
 *
 * Right panel: the resulting real cosine, with a faint half-amplitude
 * |a_k|cos trace so the factor of 2 is unmistakable. The waveform is
 * static; a playhead sweeps and a dot rides the curve in sync with the
 * rotating sum vector.
 */

const MAG_MIN = 0.2
const MAG_MAX = 1.5
const FREQ = 0.5 // on-screen rotation rate (rev/s); stands in for k·f₀
const CYCLES = 3 // cycles shown in the time panel

const PLUS_COLOR = 'rgb(29, 78, 216)' // blue — the +k term
const MINUS_COLOR = 'rgb(217, 119, 6)' // amber — the −k term

export function ConjugatePhasorPairViz() {
  const [running, setRunning] = useState(true)
  const [mag, setMag] = useState(1.0) // |a_k|
  const [phase, setPhase] = useState(Math.PI / 4) // ∠a_k (rad)
  const tRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Keep the latest knob values available to the raf loop without
  // restarting it every slider tick.
  const magRef = useRef(mag)
  const phaseRef = useRef(phase)
  magRef.current = mag
  phaseRef.current = phase

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (running) tRef.current += dt
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors)
        drawScene(canvas, colors, magRef.current, phaseRef.current, tRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running])

  // Redraw immediately on knob change while paused (so scrubbing updates).
  useEffect(() => {
    if (running) return
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, mag, phase, tRef.current)
  }, [mag, phase, running])

  const degrees = Math.round((phase * 180) / Math.PI)

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Δύο συζυγείς phasors = ένα πραγματικό cosine
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

      <canvas
        ref={canvasRef}
        style={{ height: 250 }}
        className="block h-[250px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Δύο συζυγείς phasors στο μιγαδικό επίπεδο και το πραγματικό cosine που σχηματίζουν"
      />

      {/* Live readout: the knobs ↔ the cosine-form parameters */}
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-border bg-bg-soft px-2.5 py-1 font-mono tabular-nums">
          A
          <sub>k</sub> = 2|a
          <sub>k</sub>| = <span className="text-accent">{(2 * mag).toFixed(2)}</span>
        </span>
        <span className="rounded-full border border-border bg-bg-soft px-2.5 py-1 font-mono tabular-nums">
          φ
          <sub>k</sub> = ∠a
          <sub>k</sub> = <span className="text-accent">{degrees}°</span>
        </span>
      </div>

      {/* Controls */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            |a<sub>k</sub>| (μέτρο){' '}
            <span className="font-mono text-fg tabular-nums">{mag.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={MAG_MIN}
            max={MAG_MAX}
            step={0.05}
            value={mag}
            onChange={(e) => setMag(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Μέτρο |a_k|"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            ∠a<sub>k</sub> (φάση){' '}
            <span className="font-mono text-fg tabular-nums">{degrees}°</span>
          </label>
          <input
            type="range"
            min={-Math.PI}
            max={Math.PI}
            step={0.05}
            value={phase}
            onChange={(e) => setPhase(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Φάση ∠a_k"
          />
        </div>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Οι δύο phasors είναι <strong>μιγαδικά συζυγείς</strong> σε κάθε στιγμή
        (<span className="font-mono">a₋ₖ = aₖ*</span>): οι κατακόρυφες
        (imaginary) συνιστώσες τους είναι αντίθετες και{' '}
        <strong>ακυρώνονται</strong>, οι οριζόντιες (real) προστίθενται. Μένει
        ένα πραγματικό{' '}
        <span className="font-mono">2|aₖ|·cos(2πkf₀t + ∠aₖ)</span>. Σύρε το{' '}
        <strong>|aₖ|</strong> και δες το πλάτος να γίνεται <strong>2|aₖ|</strong>·
        πάτα <strong>Παύση</strong> και σύρε τη <strong>φάση</strong> για να δεις
        το cosine να μετατοπίζεται.
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  mag: number,
  phase: number,
  t: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const splitX = Math.min(w * 0.44, 260)
  drawComplexPlane(ctx, colors, 0, 0, splitX, h, mag, phase, t)
  drawTimePlot(ctx, colors, splitX, 0, w - splitX, h, mag, phase, t)
}

function arrow(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
  width: number,
) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()
  const len = Math.hypot(x1 - x0, y1 - y0)
  if (len < 4) return // too short for a head
  const ang = Math.atan2(y1 - y0, x1 - x0)
  const head = 7
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x1 - head * Math.cos(ang - Math.PI / 6), y1 - head * Math.sin(ang - Math.PI / 6))
  ctx.lineTo(x1 - head * Math.cos(ang + Math.PI / 6), y1 - head * Math.sin(ang + Math.PI / 6))
  ctx.closePath()
  ctx.fill()
}

function drawComplexPlane(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  mag: number,
  phase: number,
  t: number,
) {
  if (!colors) return
  const cx = x0 + pw / 2
  const cy = y0 + ph / 2
  const R = Math.min(pw, ph) * 0.4
  // amplitude → pixels: the real sum can reach 2·MAG_MAX, mapped to R.
  const ppa = R / (2 * MAG_MAX)

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + 8, cy)
  ctx.lineTo(x0 + pw - 8, cy)
  ctx.moveTo(cx, y0 + 8)
  ctx.lineTo(cx, y0 + ph - 8)
  ctx.stroke()

  // Faint circle where the phasor tips ride (radius |a_k|)
  const L = mag * ppa
  ctx.strokeStyle = colors.border
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.arc(cx, cy, L, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  // Axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('Re', x0 + pw - 4, cy - 4)
  ctx.textAlign = 'left'
  ctx.fillText('Im', cx + 4, y0 + 12)

  const theta = 2 * Math.PI * FREQ * t + phase
  // +k tip (CCW). Canvas y inverted: +Im is up → subtract sin.
  const pxPlus = cx + L * Math.cos(theta)
  const pyPlus = cy - L * Math.sin(theta)
  // −k tip (CW, mirror across Re axis): angle −θ.
  const pxMinus = cx + L * Math.cos(theta)
  const pyMinus = cy + L * Math.sin(theta)

  // Dashed vertical drops to the Re axis — the imaginary parts (equal & opposite).
  ctx.strokeStyle = colors.fgSubtle
  ctx.setLineDash([2, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pxPlus, pyPlus)
  ctx.lineTo(pxPlus, cy)
  ctx.moveTo(pxMinus, pyMinus)
  ctx.lineTo(pxMinus, cy)
  ctx.stroke()
  ctx.setLineDash([])

  // Sum vector on the Re axis: 2|a_k|cosθ
  const sumAmp = 2 * mag * Math.cos(theta)
  const sumX = cx + sumAmp * ppa
  // Faint parallelogram construction: tip → sum point (shows tip-to-tail add).
  ctx.strokeStyle = colors.border
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  ctx.moveTo(pxPlus, pyPlus)
  ctx.lineTo(sumX, cy)
  ctx.moveTo(pxMinus, pyMinus)
  ctx.lineTo(sumX, cy)
  ctx.stroke()
  ctx.setLineDash([])

  // The two phasors (drawn over the construction lines)
  arrow(ctx, cx, cy, pxPlus, pyPlus, PLUS_COLOR, 2)
  arrow(ctx, cx, cy, pxMinus, pyMinus, MINUS_COLOR, 2)

  // Sum vector (bold)
  arrow(ctx, cx, cy, sumX, cy, colors.fg, 2.6)

  // Labels on the phasor tips
  ctx.font = 'bold 10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = PLUS_COLOR
  ctx.textAlign = 'left'
  ctx.fillText('+k', pxPlus + 6, pyPlus - 4)
  ctx.fillStyle = MINUS_COLOR
  ctx.fillText('−k', pxMinus + 6, pyMinus + 12)

  // Sum label
  ctx.fillStyle = colors.fg
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('άθροισμα (real)', cx, cy + ph / 2 - 6)
}

function drawTimePlot(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  mag: number,
  phase: number,
  t: number,
) {
  if (!colors) return
  const PAD = 16
  const windowDur = CYCLES / FREQ
  const yLim = 2 * MAG_MAX * 1.12

  const xt = (tt: number) => lerp(tt, 0, windowDur, x0 + PAD, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD, y0 + ph - PAD)
  const yZero = yv(0)

  // Baseline + t=0 axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD, yZero)
  ctx.lineTo(x0 + pw - PAD, yZero)
  ctx.moveTo(xt(0), y0 + PAD)
  ctx.lineTo(xt(0), y0 + ph - PAD)
  ctx.stroke()

  // Amplitude envelope at ±2|a_k| (dashed)
  ctx.strokeStyle = colors.fgSubtle
  ctx.setLineDash([4, 3])
  ctx.beginPath()
  ctx.moveTo(x0 + PAD, yv(2 * mag))
  ctx.lineTo(x0 + pw - PAD, yv(2 * mag))
  ctx.moveTo(x0 + PAD, yv(-2 * mag))
  ctx.lineTo(x0 + pw - PAD, yv(-2 * mag))
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('+2|aₖ|', x0 + PAD + 2, yv(2 * mag) - 3)
  ctx.fillText('−2|aₖ|', x0 + PAD + 2, yv(-2 * mag) + 11)

  const STEPS = 260
  const trace = (amp: number, color: string, width: number) => {
    ctx.strokeStyle = color
    ctx.lineWidth = width
    ctx.beginPath()
    for (let i = 0; i <= STEPS; i++) {
      const tt = lerp(i, 0, STEPS, 0, windowDur)
      const v = amp * Math.cos(2 * Math.PI * FREQ * tt + phase)
      const px = xt(tt)
      const py = yv(v)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }

  // Faint half-amplitude |a_k|cos (one phasor's real part) — makes ×2 visible
  trace(mag, colors.fgMuted, 1.2)
  // The real sum 2|a_k|cos (bold)
  trace(2 * mag, colors.fg, 2.2)

  // Playhead + dot riding the sum curve (synced to the rotating vector)
  const playheadT = t % windowDur
  const sumNow = 2 * mag * Math.cos(2 * Math.PI * FREQ * t + phase)
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(xt(playheadT), y0 + PAD)
  ctx.lineTo(xt(playheadT), y0 + ph - PAD)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.fg
  ctx.beginPath()
  ctx.arc(xt(playheadT), yv(sumNow), 4, 0, Math.PI * 2)
  ctx.fill()

  // Legend
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  const lx = x0 + PAD + 4
  let ly = y0 + PAD + 10
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('|aₖ|·cos (μισό)', lx, ly)
  ly += 13
  ctx.fillStyle = colors.fg
  ctx.fillText('2|aₖ|·cos (άθροισμα)', lx, ly)

  // t=0 label
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('t = 0', xt(0), y0 + ph - 4)
}
