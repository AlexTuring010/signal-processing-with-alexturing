'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas } from '@/lib/canvas'

/**
 * Constant-envelope vs amplitude-modulated complex envelope.
 *
 * Slide 11 of the prof's deck: P_x^PM = P_x^FM = A_c²/2 because the envelope
 * V(t) = √(x_I² + x_Q²) = A_c is constant. The student should SEE this — and
 * see that AM does NOT have this property.
 *
 * Layout: two complex planes side by side.
 *
 *   ┌──────────────────────────┬──────────────────────────┐
 *   │  FM complex envelope     │  AM complex envelope     │
 *   │  g(t) = A_c · e^{jφ(t)}   │  g(t) = [A_c + m(t)]·1   │
 *   │                          │                          │
 *   │  • • • • • •             │  ▶───────                │
 *   │ •          • on circle   │  expands and contracts   │
 *   │•   ──────   •            │  along the real axis     │
 *   │ •          •             │                          │
 *   │  • • • • • •             │                          │
 *   │                          │                          │
 *   │  |g| = A_c (CONSTANT)    │  |g| varies with m       │
 *   │  → P_x = A_c²/2           │  → P_x has DC + sb terms │
 *   └──────────────────────────┴──────────────────────────┘
 *
 * A trail shows the trajectory; a live readout shows |g(t)| changing
 * (or staying constant) as t advances.
 *
 * Controls:
 *   – Play/Pause
 *   – β slider (for the FM phase amplitude φ(t) = β sin(2π f_m t))
 *   – μ slider (for the AM envelope shape [A_c + μ A_c cos]·)
 */

const FM = 0.6

export function ConstantEnvelopeCircleViz() {
  const [running, setRunning] = useState(true)
  const [beta, setBeta] = useState(2.0)
  const [mu, setMu] = useState(0.6)
  const tRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (running) tRef.current += dt * 0.7
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) draw(canvas, colors, tRef.current, beta, mu)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, beta, mu])

  const v_fm = 1 // constant
  const v_am = (1 + mu * Math.cos(2 * Math.PI * FM * tRef.current)) / 2 + 0.5 // visualization-relative

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Complex envelope: γιατί η FM έχει ισχύ A_c²/2 ανεξάρτητα του β
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
        Το complex envelope <span className="font-mono">g(t) = x_I + j x_Q</span>{' '}
        ζωγραφίζεται σαν τροχιά στο μιγαδικό επίπεδο. Στο FM,{' '}
        <span className="font-mono">g(t) = A_c · e^&#123;jφ(t)&#125;</span> —
        κινείται σε <strong>κύκλο ακτίνας A_c</strong>. Στο AM,{' '}
        <span className="font-mono">g(t) = [A_c + m(t)] · 1</span> — κινείται
        κατά μήκος του πραγματικού άξονα και αλλάζει μήκος. Το{' '}
        <span className="font-mono">|g(t)|² / 2</span> είναι η στιγμιαία ισχύς —
        σταθερή για FM, ταλαντωμένη για AM.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 360 }}
        className="block h-[360px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Complex envelope: FM circle vs AM line segment"
      />

      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            FM: φ(t) = β sin(2π f_m t), β ={' '}
            <span className="font-mono text-fg tabular-nums">{beta.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0.3}
            max={5}
            step={0.05}
            value={beta}
            onChange={(e) => setBeta(parseFloat(e.target.value))}
            className="mt-1 w-full accent-blue-500"
            aria-label="FM modulation index β"
          />
          <p className="mt-1 text-[11px] text-fg-subtle">
            |g| = A_c, σταθερό. Το β ελέγχει μόνο πόσο γρήγορα κινείται γύρω
            στον κύκλο, όχι την ακτίνα.
          </p>
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            AM: g(t) = [1 + μ cos(2π f_m t)] · A_c, μ ={' '}
            <span className="font-mono text-fg tabular-nums">{mu.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0}
            max={0.95}
            step={0.01}
            value={mu}
            onChange={(e) => setMu(parseFloat(e.target.value))}
            className="mt-1 w-full accent-amber-500"
            aria-label="AM modulation index μ"
          />
          <p className="mt-1 text-[11px] text-fg-subtle">
            |g(t)| διαφέρει με τον χρόνο. Όσο μεγαλύτερο το μ, τόσο πιο μακριά
            είναι το ταλάντωμα.
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs leading-relaxed">
        <strong>Γιατί η ισχύς της FM είναι σταθερή σε A_c²/2:</strong> το
        στιγμιαίο τετράγωνο του bandpass σήματος ολοκληρώνεται σε{' '}
        <span className="font-mono">⟨x²⟩ = ½⟨|g|²⟩</span>. Όταν{' '}
        <span className="font-mono">|g| = A_c</span> πάντα, παίρνουμε{' '}
        <span className="font-mono">⟨x²⟩ = A_c²/2</span> — χωρίς εξάρτηση από
        το β. Στο AM, <span className="font-mono">|g(t)| = A_c[1 + μ cos]</span>,
        άρα <span className="font-mono">⟨|g|²⟩ = A_c²(1 + μ²/2)</span> →{' '}
        <span className="font-mono">⟨x²⟩ = A_c²/2 + A_c²μ²/4</span> (φέρον +
        sidebands). Η FM «δαπανά όλη την ισχύ της στη πληροφορία», το AM όχι.
      </div>

      <div className="mt-2 text-xs text-fg-muted">
        Τρέχουσες ακτίνες:{' '}
        <span className="font-mono text-blue-600 dark:text-blue-400">
          |g_FM| = A_c = {v_fm.toFixed(2)}
        </span>{' '}
        <span className="font-mono text-amber-600 dark:text-amber-400">
          |g_AM| = {v_am.toFixed(2)}·A_c
        </span>{' '}
        — δες πώς το πρώτο μένει «κολλημένο» στο 1.00 και το δεύτερο χορεύει.
      </div>
    </figure>
  )
}

const COL_FM = 'rgb(29, 78, 216)'
const COL_AM = 'rgb(217, 119, 6)'
const COL_TRAIL_FM = 'rgba(29, 78, 216, 0.25)'
const COL_TRAIL_AM = 'rgba(217, 119, 6, 0.25)'

function draw(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  tNow: number,
  beta: number,
  mu: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const cw = w / 2
  drawComplexPlane(ctx, colors, 0, 0, cw, h, 'fm', tNow, beta, mu)
  drawComplexPlane(ctx, colors, cw, 0, cw, h, 'am', tNow, beta, mu)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cw, 0)
  ctx.lineTo(cw, h)
  ctx.stroke()
}

function drawComplexPlane(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  mode: 'fm' | 'am',
  tNow: number,
  beta: number,
  mu: number,
) {
  if (!colors) return
  // header
  ctx.fillStyle = mode === 'fm' ? COL_FM : COL_AM
  ctx.font = 'bold 12px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(
    mode === 'fm' ? 'FM:  g(t) = A_c · e^{jφ(t)}' : 'AM:  g(t) = [A_c + m(t)] · 1',
    x0 + pw / 2,
    y0 + 16,
  )
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText(
    mode === 'fm' ? '|g| = A_c (κύκλος)' : '|g(t)| ταλαντούται κατά μήκος του Re-άξονα',
    x0 + pw / 2,
    y0 + 30,
  )

  // axes
  const cx = x0 + pw / 2
  const cy = y0 + ph / 2 + 14
  const R = Math.min(pw, ph) * 0.36
  // axis lines
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + 16, cy)
  ctx.lineTo(x0 + pw - 16, cy)
  ctx.moveTo(cx, y0 + 40)
  ctx.lineTo(cx, y0 + ph - 16)
  ctx.stroke()
  // axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Re', x0 + pw - 30, cy - 4)
  ctx.textAlign = 'right'
  ctx.fillText('Im', cx - 6, y0 + 50)

  // unit-radius circle reference (faint)
  ctx.strokeStyle = colors.border
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.stroke()
  ctx.setLineDash([])

  // trajectory trail
  const trailColor = mode === 'fm' ? COL_TRAIL_FM : COL_TRAIL_AM
  ctx.strokeStyle = trailColor
  ctx.lineWidth = 2
  ctx.beginPath()
  const TRAIL_N = 240
  const TRAIL_DT = 2.5 / TRAIL_N
  for (let i = 0; i <= TRAIL_N; i++) {
    const t = tNow - i * TRAIL_DT
    const { x, y } = sample(t, beta, mu, mode, R, cx, cy)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // current g(t)
  const { x: gx, y: gy, mag } = sample(tNow, beta, mu, mode, R, cx, cy)
  const mainColor = mode === 'fm' ? COL_FM : COL_AM
  ctx.strokeStyle = mainColor
  ctx.lineWidth = 1.5
  // vector from origin
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(gx, gy)
  ctx.stroke()
  // dot
  ctx.fillStyle = mainColor
  ctx.beginPath()
  ctx.arc(gx, gy, 5, 0, Math.PI * 2)
  ctx.fill()

  // magnitude readout
  ctx.fillStyle = mainColor
  ctx.font = 'bold 11px ui-monospace, ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(
    `|g| = ${mag.toFixed(2)} · A_c`,
    x0 + pw / 2,
    y0 + ph - 8,
  )
}

function sample(
  t: number,
  beta: number,
  mu: number,
  mode: 'fm' | 'am',
  R: number,
  cx: number,
  cy: number,
): { x: number; y: number; mag: number } {
  if (mode === 'fm') {
    const phi = beta * Math.sin(2 * Math.PI * FM * t)
    const xI = Math.cos(phi)
    const xQ = Math.sin(phi)
    return { x: cx + xI * R, y: cy - xQ * R, mag: 1 }
  } else {
    const v = (1 + mu * Math.cos(2 * Math.PI * FM * t)) / 2 + 0.5
    // x_I = (A_c + m(t)) / A_c (normalized), x_Q = 0
    return { x: cx + v * R, y: cy, mag: v }
  }
}
