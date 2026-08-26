'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * "Frequency IS the rate at which the angle advances" — made visible.
 *
 * The one-sentence goal: let the student SEE the carrier's arrow speed up and
 * slow down with the message, and see that the slope of the total angle θ(t)
 * is exactly what we call frequency.
 *
 * Nothing else on the site draws either of these two things:
 *   - a phasor whose rotation RATE varies with time (every other rotating-arrow
 *     viz spins at a constant, user-set rate), and
 *   - θ(t) plotted as a ramp whose local slope is the frequency.
 *
 * Layout — one canvas, four linked views, all sharing one playhead:
 *
 *   ┌───────────────┬──────────────────────────────────────────┐
 *   │               │  m(t)                                    │
 *   │   ↗ θ(t)      ├──────────────────────────────────────────┤
 *   │  (  φ  )      │  θ(t) rising, vs the straight 2π f_c t    │
 *   │   ⇢ 2π f_c t  │  reference — the GAP between them is φ    │
 *   │               ├──────────────────────────────────────────┤
 *   │               │  x(t) = cos θ(t) — peaks bunch/spread     │
 *   └───────────────┴──────────────────────────────────────────┘
 *
 * The time window is FIXED and a playhead sweeps it, so the three panels are
 * stable curves the student can study while the arrow turns in sync. (A
 * scrolling window would make the θ ramp slide vertically and destroy the
 * "slope = frequency" reading.)
 *
 * Three modes, and the order matters pedagogically:
 *   - «Χωρίς message» — the sanity check. φ ≡ 0, the arrow turns at a constant
 *     rate, θ is a perfectly straight line ON the reference, x is a plain
 *     cosine. This is the case where the general definition must reduce to the
 *     frequency the reader already knows.
 *   - «FM» — the message sets the SPEED. φ = β sin(2π f_m t) (the integral of
 *     the message), so the ramp's SLOPE tracks m.
 *   - «PM» — the message sets the POSITION. φ = β·m(t), so the GAP tracks m.
 *
 * FM/PM use the same β so the two modes are directly comparable: both swing
 * f_i by the same ±β·f_m, but for entirely different reasons.
 */

const FC = 1 // carrier turns per unit time — low, so single turns are watchable
const F_MSG = 0.25 // message frequency (2 message cycles per window)
const T_WINDOW = 8 // seconds of signal shown; the playhead loops over this

type Mode = 'none' | 'fm' | 'pm'

function message(t: number) {
  return Math.cos(2 * Math.PI * F_MSG * t)
}

/**
 * Modulation phase φ(t) — the part of the angle the message is responsible for.
 *
 * FM: φ = 2π K_f ∫m dτ = (K_f / f_m)·sin(2π f_m t) = β·sin(2π f_m t)
 * PM: φ = K_p m(t) = β·cos(2π f_m t)
 */
function phi(t: number, mode: Mode, beta: number) {
  if (mode === 'none') return 0
  if (mode === 'pm') return beta * message(t)
  return beta * Math.sin(2 * Math.PI * F_MSG * t)
}

/** Total angle θ(t) = 2π f_c t + φ(t) — everything inside the cosine. */
function theta(t: number, mode: Mode, beta: number) {
  return 2 * Math.PI * FC * t + phi(t, mode, beta)
}

/** Instantaneous frequency f_i = (1/2π)·dθ/dt, in turns per unit time. */
function fInst(t: number, mode: Mode, beta: number) {
  if (mode === 'none') return FC
  if (mode === 'pm') return FC - beta * F_MSG * Math.sin(2 * Math.PI * F_MSG * t)
  return FC + beta * F_MSG * message(t)
}

export function AngleRateViz() {
  const [mode, setMode] = useState<Mode>('none')
  const [beta, setBeta] = useState(2)
  const [running, setRunning] = useState(true)
  const tRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (running) tRef.current = (tRef.current + dt) % T_WINDOW
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) drawScene(canvas, colors, mode, beta, tRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, mode, beta])

  const btn = (m: Mode, label: string) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      className={
        mode === m
          ? 'bg-accent px-3 py-1 text-white'
          : 'bg-bg-soft px-3 py-1 text-fg-muted hover:text-fg'
      }
    >
      {label}
    </button>
  )

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Η γωνία που γυρίζει — «συχνότητα» σημαίνει «κλίση της γωνίας»
        </h4>
        <div className="flex items-center gap-2">
          <div className="inline-flex overflow-hidden rounded-full border border-border text-xs">
            {btn('none', 'Χωρίς message')}
            {btn('fm', 'FM')}
            {btn('pm', 'PM')}
          </div>
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
      </div>

      <p className="mb-3 text-xs text-fg-muted">
        Αριστερά γυρίζει ένα <strong>βελάκι</strong>· η οριζόντια προβολή του
        είναι η κυματομορφή κάτω δεξιά. Η γωνία του είναι η{' '}
        <strong>ολική γωνία</strong> <span className="font-mono">θ(t)</span>. Το{' '}
        <strong>διακεκομμένο γκρι βελάκι</strong> είναι το «χωρίς message»
        βελάκι, που γυρίζει πάντα με σταθερό ρυθμό{' '}
        <span className="font-mono">f_c</span> — και το{' '}
        <strong>άνοιγμα ανάμεσά τους</strong> είναι η{' '}
        <span className="font-mono">φ(t)</span>. Ξεκίνα από το{' '}
        <strong>Χωρίς message</strong>: το μπλε βελάκι κάθεται πάνω στο γκρι, η
        γωνία ανεβαίνει σε <strong>ίσια γραμμή</strong>, και το κύμα είναι ένα
        απλό cosine.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 420 }}
        className="block h-[420px] w-full rounded-md border border-border bg-bg-soft/30 sm:h-[340px]"
        aria-label="Rotating angle, its slope, and the resulting waveform"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          β (πόσο σπρώχνει το message τη γωνία) ={' '}
          <span className="font-mono text-fg tabular-nums">{beta.toFixed(2)}</span>{' '}
          rad
          {mode === 'none' && ' — δεν κάνει τίποτα όσο δεν υπάρχει message'}
        </label>
        <input
          type="range"
          min={0}
          max={3}
          step={0.05}
          value={beta}
          onChange={(e) => setBeta(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="beta"
          disabled={mode === 'none'}
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Τι να συγκρίνεις.</strong> Στο <strong>FM</strong> το message
        ελέγχει την <strong>κλίση</strong> της γωνίας: όπου το{' '}
        <span className="font-mono">m</span> είναι ψηλά, η μπλε καμπύλη ανεβαίνει
        πιο <strong>απότομα</strong> από τη διακεκομμένη και οι κορυφές του
        κύματος <strong>πυκνώνουν</strong>. Στο <strong>PM</strong> το message
        ελέγχει το <strong>άνοιγμα</strong>: το κενό ανάμεσα στις δύο καμπύλες
        ιχνηλατεί κατευθείαν το <span className="font-mono">m</span>. Ίδιο
        βελάκι, ίδια εικόνα — αλλά στη μία περίπτωση το message ρυθμίζει{' '}
        <strong>ταχύτητα</strong> και στην άλλη <strong>θέση</strong>.
      </div>
    </figure>
  )
}

const MSG_C = 'rgb(217, 119, 6)' // amber
const SIG_C = 'rgb(29, 78, 216)' // accent blue

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  mode: Mode,
  beta: number,
  tNow: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'

  const twoCol = w >= 620
  if (twoCol) {
    const side = Math.min(h, w * 0.36)
    drawDial(ctx, colors, 0, (h - side) / 2, side, side, mode, beta, tNow)
    drawPanels(ctx, colors, side, 0, w - side, h, mode, beta, tNow)
  } else {
    const ch = Math.min(h * 0.42, w)
    drawDial(ctx, colors, (w - ch) / 2, 0, ch, ch, mode, beta, tNow)
    drawPanels(ctx, colors, 0, ch, w, h - ch, mode, beta, tNow)
  }
}

/** The rotating arrow, its constant-rate ghost, and the angle between them. */
function drawDial(
  ctx: CanvasRenderingContext2D,
  colors: NonNullable<ReturnType<typeof getThemeColors>>,
  x0: number,
  y0: number,
  bw: number,
  bh: number,
  mode: Mode,
  beta: number,
  tNow: number,
) {
  const cx = x0 + bw / 2
  const cy = y0 + bh / 2 + 4
  const R = Math.min(bw, bh) * 0.33

  const thRef = 2 * Math.PI * FC * tNow
  const th = theta(tNow, mode, beta)

  // Canvas y points down, so a mathematical CCW angle draws as -angle.
  const px = (ang: number, r: number) => cx + r * Math.cos(ang)
  const py = (ang: number, r: number) => cy - r * Math.sin(ang)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.setLineDash([])

  // The angle φ between the two arrows, drawn as a filled wedge.
  if (mode !== 'none' && Math.abs(th - thRef) > 0.02) {
    const a0 = thRef
    const a1 = th
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, R * 0.42, -a0, -a1, a1 > a0)
    ctx.closePath()
    ctx.fillStyle = colors.accentSoft
    ctx.globalAlpha = 0.85
    ctx.fill()
    ctx.globalAlpha = 1
  }

  arrow(ctx, cx, cy, px(thRef, R), py(thRef, R), colors.fgMuted, 1.2, true)
  arrow(ctx, cx, cy, px(th, R), py(th, R), SIG_C, 2, false)

  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'center'
  ctx.fillText('χωρίς message: 2π f_c t', cx, y0 + bh - 16)
  ctx.fillStyle = SIG_C
  ctx.fillText('θ(t) — η ολική γωνία', cx, y0 + 12)

  if (mode !== 'none') {
    ctx.fillStyle = colors.accent
    ctx.textAlign = 'center'
    const mid = (thRef + th) / 2
    ctx.fillText('φ', px(mid, R * 0.6), py(mid, R * 0.6) + 3)
  }

  // Live readout — drawn on the canvas so it actually updates every frame.
  const fi = fInst(tNow, mode, beta)
  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'center'
  ctx.fillText(
    `f_i = ${fi.toFixed(2)} στροφές/s   ·   φ = ${phi(tNow, mode, beta).toFixed(2)} rad`,
    cx,
    y0 + bh - 3,
  )
}

function arrow(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
  width: number,
  dashed: boolean,
) {
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = width
  if (dashed) ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x1, y1)
  ctx.stroke()
  ctx.setLineDash([])

  const a = Math.atan2(y1 - y0, x1 - x0)
  const hl = 7
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x1 - hl * Math.cos(a - 0.4), y1 - hl * Math.sin(a - 0.4))
  ctx.lineTo(x1 - hl * Math.cos(a + 0.4), y1 - hl * Math.sin(a + 0.4))
  ctx.closePath()
  ctx.fill()
}

/** m(t), then θ(t) against its constant-rate reference, then the waveform. */
function drawPanels(
  ctx: CanvasRenderingContext2D,
  colors: NonNullable<ReturnType<typeof getThemeColors>>,
  x0: number,
  y0: number,
  bw: number,
  bh: number,
  mode: Mode,
  beta: number,
  tNow: number,
) {
  const PAD_X = 14
  const xt = (t: number) => lerp(t, 0, T_WINDOW, x0 + PAD_X + 26, x0 + bw - PAD_X)

  const hMsg = bh * 0.26
  const hAng = bh * 0.4
  const hWav = bh - hMsg - hAng

  drawMessagePanel(ctx, colors, xt, y0, hMsg, mode, x0 + PAD_X)
  drawAnglePanel(ctx, colors, xt, y0 + hMsg, hAng, mode, beta, tNow, x0 + PAD_X)
  drawWavePanel(ctx, colors, xt, y0 + hMsg + hAng, hWav, mode, beta, x0 + PAD_X)

  // One playhead across all three panels, in sync with the arrow.
  const xp = xt(tNow)
  ctx.strokeStyle = colors.accent
  ctx.globalAlpha = 0.5
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xp, y0 + 4)
  ctx.lineTo(xp, y0 + bh - 4)
  ctx.stroke()
  ctx.globalAlpha = 1
}

function drawMessagePanel(
  ctx: CanvasRenderingContext2D,
  colors: NonNullable<ReturnType<typeof getThemeColors>>,
  xt: (t: number) => number,
  y0: number,
  ph: number,
  mode: Mode,
  labelX: number,
) {
  const yv = (v: number) => lerp(v, 1.4, -1.4, y0 + 14, y0 + ph - 4)

  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'left'
  ctx.fillText('Message m(t)', labelX, y0 + 10)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xt(0), yv(0))
  ctx.lineTo(xt(T_WINDOW), yv(0))
  ctx.stroke()

  ctx.strokeStyle = MSG_C
  ctx.lineWidth = 1.6
  ctx.beginPath()
  const N = 400
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * T_WINDOW
    const v = mode === 'none' ? 0 : message(t)
    if (i === 0) ctx.moveTo(xt(t), yv(v))
    else ctx.lineTo(xt(t), yv(v))
  }
  ctx.stroke()

  if (mode === 'none') {
    ctx.fillStyle = colors.fgSubtle
    ctx.textAlign = 'right'
    ctx.fillText('m(t) = 0 — κανένα message', xt(T_WINDOW), y0 + 10)
  }
}

function drawAnglePanel(
  ctx: CanvasRenderingContext2D,
  colors: NonNullable<ReturnType<typeof getThemeColors>>,
  xt: (t: number) => number,
  y0: number,
  ph: number,
  mode: Mode,
  beta: number,
  tNow: number,
  labelX: number,
) {
  const top = 2 * Math.PI * FC * T_WINDOW + beta + 1
  const yv = (v: number) => lerp(v, top, -beta - 1, y0 + 14, y0 + ph - 4)

  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'left'
  ctx.fillText('Ολική γωνία θ(t) — η ΚΛΙΣΗ της είναι η συχνότητα', labelX, y0 + 10)

  // The constant-rate reference: a perfectly straight ramp of slope 2π f_c.
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1.2
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(xt(0), yv(0))
  ctx.lineTo(xt(T_WINDOW), yv(2 * Math.PI * FC * T_WINDOW))
  ctx.stroke()
  ctx.setLineDash([])

  ctx.strokeStyle = SIG_C
  ctx.lineWidth = 1.8
  ctx.beginPath()
  const N = 600
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * T_WINDOW
    const v = theta(t, mode, beta)
    if (i === 0) ctx.moveTo(xt(t), yv(v))
    else ctx.lineTo(xt(t), yv(v))
  }
  ctx.stroke()

  // The vertical gap at the playhead IS φ — the same thing as the wedge on the
  // dial, so the two views name one quantity.
  if (mode !== 'none') {
    const xp = xt(tNow)
    const yRef = yv(2 * Math.PI * FC * tNow)
    const yTh = yv(theta(tNow, mode, beta))
    if (Math.abs(yTh - yRef) > 2) {
      ctx.strokeStyle = colors.accent
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(xp, yRef)
      ctx.lineTo(xp, yTh)
      ctx.stroke()
      ctx.fillStyle = colors.accent
      ctx.textAlign = 'left'
      ctx.fillText('φ', xp + 4, (yRef + yTh) / 2 + 3)
    }
  }

  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'right'
  ctx.fillText('2π f_c t', xt(T_WINDOW), yv(2 * Math.PI * FC * T_WINDOW) - 4)
}

function drawWavePanel(
  ctx: CanvasRenderingContext2D,
  colors: NonNullable<ReturnType<typeof getThemeColors>>,
  xt: (t: number) => number,
  y0: number,
  ph: number,
  mode: Mode,
  beta: number,
  labelX: number,
) {
  const yv = (v: number) => lerp(v, 1.35, -1.35, y0 + 14, y0 + ph - 4)

  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'left'
  ctx.fillText('Το κύμα x(t) = cos θ(t)', labelX, y0 + 10)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xt(0), yv(0))
  ctx.lineTo(xt(T_WINDOW), yv(0))
  ctx.stroke()

  ctx.strokeStyle = SIG_C
  ctx.lineWidth = 1.5
  ctx.beginPath()
  const N = 2400
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * T_WINDOW
    const v = Math.cos(theta(t, mode, beta))
    if (i === 0) ctx.moveTo(xt(t), yv(v))
    else ctx.lineTo(xt(t), yv(v))
  }
  ctx.stroke()
}
