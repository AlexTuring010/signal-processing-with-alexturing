'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Envelope detector — diode + RC lowpass filter response to AM input.
 *
 * The AM input is rectified by the diode (half-wave: max(0, x(t))). Then
 * the RC integrator follows the message envelope as long as RC is in the
 * sweet spot:
 *   - too small RC → output ripples between carrier cycles
 *   - too big  RC  → output can't follow rapid envelope changes (lag,
 *                    "diagonal clipping")
 *   - sweet RC ≈ 1/(2π f_m) ... 1/(2π W) → clean envelope tracking
 *
 * One panel showing input AM, rectified signal, and the RC output.
 * Slider controls log(RC) so the student can sweep through the regimes.
 */

const FC = 8 // visual carrier cycles
const FM = 0.5 // message frequency
const MU = 0.7 // modulation index

export function EnvelopeDetectorViz() {
  const [logRC, setLogRC] = useState(-0.7) // RC in time units; default ~0.2
  const [running, setRunning] = useState(true)
  const tRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const stateRef = useRef({ vCap: 0 }) // capacitor voltage state for the RC simulation

  const RC = Math.pow(10, logRC)
  // Reset cap state when RC changes
  useEffect(() => {
    stateRef.current.vCap = 0
  }, [RC])

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (running) tRef.current += dt
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) drawScene(canvas, colors, RC, tRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, RC])

  const tooSmall = RC < 0.05
  const tooBig = RC > 1.0

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Envelope detector — η RC συμπεριφορά καθορίζει την ανάκτηση
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
        AM input (μπλε) → δίοδος (half-wave rectified, αχνό γκρι) → RC LPF
        (πορτοκαλί) → ανακτημένο envelope. Σύρε το RC slider για να δεις τις
        τρεις περιοχές: μικρό RC, σωστό RC, μεγάλο RC.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 220 }}
        className="block h-[220px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Envelope detector signal flow"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          RC time constant ={' '}
          <span className="font-mono text-fg tabular-nums">{RC.toFixed(3)}</span>
          {' · '}
          {tooSmall ? (
            <span className="text-red-600 dark:text-red-400">Πολύ μικρό — ripple</span>
          ) : tooBig ? (
            <span className="text-red-600 dark:text-red-400">Πολύ μεγάλο — diagonal clipping</span>
          ) : (
            <span className="text-green-700 dark:text-green-400">Σωστό — καθαρή ανάκτηση</span>
          )}
        </label>
        <input
          type="range"
          min={-2}
          max={0.5}
          step={0.05}
          value={logRC}
          onChange={(e) => setLogRC(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="RC time constant (log scale)"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Πρακτικός κανόνας:</strong>{' '}
        <span className="font-mono">1/f_c &lt;&lt; RC &lt;&lt; 1/W</span>. Δηλαδή
        αρκετά μεγάλο για να εξομαλύνει τους carrier cycles, αρκετά μικρό για να
        ακολουθεί τις διακυμάνσεις του message. Στο εμπορικό AM ραδιόφωνο,
        τυπικά <span className="font-mono">RC ≈ 50 μs</span>, που είναι ανάμεσα
        στα <span className="font-mono">1/(2π · 1 MHz)</span> και{' '}
        <span className="font-mono">1/(2π · 4 kHz)</span>.
      </div>
    </figure>
  )
}

const SIG_C = 'rgb(29, 78, 216)'
const RECT_C = 'rgba(100, 116, 139, 0.5)'
const OUT_C = 'rgb(217, 119, 6)'
const ENV_C = 'rgb(168, 85, 247)'

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  RC: number,
  tNow: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const PAD_X = 16
  const PAD_Y = 16
  const tWindow = 8
  const tStart = tNow - tWindow * 0.7
  const tEnd = tNow + tWindow * 0.3
  const yLim = 2.4

  const xt = (t: number) => lerp(t, tStart, tEnd, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim * 0.5, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // baseline
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()
  // playhead
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(xt(tNow), PAD_Y)
  ctx.lineTo(xt(tNow), h - PAD_Y)
  ctx.stroke()
  ctx.setLineDash([])

  // True envelope (target)
  ctx.strokeStyle = ENV_C
  ctx.setLineDash([4, 4])
  ctx.lineWidth = 1.4
  ctx.beginPath()
  const STEPS = 600
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const env = 1 + MU * Math.cos(2 * Math.PI * FM * t)
    const px = xt(t)
    const py = yv(env)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // AM input (faint)
  ctx.strokeStyle = SIG_C
  ctx.lineWidth = 1
  ctx.globalAlpha = 0.5
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const env = 1 + MU * Math.cos(2 * Math.PI * FM * t)
    const v = env * Math.cos(2 * Math.PI * FC * t)
    const px = xt(t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.globalAlpha = 1

  // Rectified signal (half-wave)
  ctx.strokeStyle = RECT_C
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const env = 1 + MU * Math.cos(2 * Math.PI * FM * t)
    const v = Math.max(0, env * Math.cos(2 * Math.PI * FC * t))
    const px = xt(t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // RC envelope detector simulation: dV/dt = (V_in - V) / RC when V_in > V (charge through diode)
  //                                  dV/dt = -V / RC                  when V_in <= V (discharge through R)
  let vCap = 1 + MU // start near peak
  ctx.strokeStyle = OUT_C
  ctx.lineWidth = 2
  ctx.beginPath()
  let firstPoint = true
  // We integrate forward in time; the RC sim runs at a finer dt internally
  const SIM_STEPS = 4000
  for (let i = 0; i <= SIM_STEPS; i++) {
    const t = lerp(i, 0, SIM_STEPS, tStart, tEnd)
    const env = 1 + MU * Math.cos(2 * Math.PI * FM * t)
    const vIn = Math.max(0, env * Math.cos(2 * Math.PI * FC * t))
    const dt = (tEnd - tStart) / SIM_STEPS
    if (vIn > vCap) {
      // diode conducts — capacitor charges quickly to vIn
      // Use a small "ON" RC = RC/100 for fast charging behavior
      vCap += (vIn - vCap) * (dt / Math.max(RC * 0.01, 0.0001))
      if (vCap > vIn) vCap = vIn
    } else {
      // diode is off — capacitor discharges through R
      vCap += -vCap * (dt / RC)
      if (vCap < 0) vCap = 0
    }
    // Draw every ~6 sim steps
    if (i % 4 === 0) {
      const px = xt(t)
      const py = yv(vCap)
      if (firstPoint) {
        ctx.moveTo(px, py)
        firstPoint = false
      } else {
        ctx.lineTo(px, py)
      }
    }
  }
  ctx.stroke()

  // Legend
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillStyle = SIG_C
  ctx.fillText('— AM input (faint)', PAD_X + 4, PAD_Y + 10)
  ctx.fillStyle = ENV_C
  ctx.fillText('— true envelope', PAD_X + 4, PAD_Y + 22)
  ctx.fillStyle = OUT_C
  ctx.fillText('— RC output', PAD_X + 4, PAD_Y + 34)
}
