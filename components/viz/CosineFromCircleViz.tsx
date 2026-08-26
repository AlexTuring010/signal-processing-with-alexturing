'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * The one-sentence goal: let the student SEE that a cosine is the shadow of a
 * point going round a circle, and that "turns per second" is exactly what we
 * call frequency.
 *
 * This is the picture /fm/idea §2α argues from before it dares differentiate
 * anything, so the reader must not be asked to imagine it.
 *
 * Deliberately NOT the complex plane. RotatingPhasor already owns
 * e^{jωt} = cos + j·sin for /foundations/signals and /reference/*, and it is
 * shared by three pages. Here the imaginary axis would be an extra concept the
 * argument does not need: the claim is only "circular motion, seen edge-on, is
 * a cosine".
 *
 *   ┌──────────────────┬────────────────────────────────────┐
 *   │      ___         │   x(t) = cos(2π f t)               │
 *   │    /  P\         │        ∙───────╮                   │
 *   │   |   ¦ |        │   ╭────╯        ╰────╮             │
 *   │    \__¦_/        │  ⟵ μία στροφή = ένας κύκλος ⟶      │
 *   │       ●shadow    │                                    │
 *   └──────────────────┴────────────────────────────────────┘
 *
 * The shadow dot on the circle's horizontal axis and the playhead dot on the
 * waveform are the SAME colour and carry the same live number, which is how the
 * two views are tied together. No straight connector is drawn between them:
 * the circle's value axis is horizontal and the waveform's is vertical, so a
 * connecting line would imply an alignment that is not there.
 *
 * The period bracket under the waveform is the payoff — drag the frequency and
 * watch one turn of the arrow and one cycle of the wave stay locked together
 * while both get shorter.
 */

const T_WINDOW = 4 // seconds of waveform shown

export function CosineFromCircleViz() {
  const [freq, setFreq] = useState(1)
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
      if (canvas && colors) drawScene(canvas, colors, freq, tRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, freq])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Το cosine είναι η σκιά ενός σημείου που γυρίζει σε κύκλο
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
        Αριστερά, το σημείο <strong>P</strong> γυρίζει με σταθερό βήμα. Η{' '}
        <strong className="text-amber-600 dark:text-amber-500">σκιά</strong> του
        στον οριζόντιο άξονα (η διακεκομμένη πέφτει πάνω της) πηγαινοέρχεται
        δεξιά-αριστερά. Δεξιά, <strong>η ίδια ακριβώς τιμή σχεδιασμένη στον
        χρόνο</strong> — ίδιο χρώμα, ίδιος αριθμός. Αυτό που γράφει είναι ένα
        cosine.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 300 }}
        className="block h-[300px] w-full rounded-md border border-border bg-bg-soft/30 sm:h-[260px]"
        aria-label="A point going round a circle and the cosine its shadow traces"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Συχνότητα <span className="font-mono text-fg tabular-nums">f = {freq.toFixed(2)}</span>{' '}
          στροφές ανά δευτερόλεπτο &nbsp;→&nbsp; περίοδος{' '}
          <span className="font-mono text-fg tabular-nums">T = 1/f = {(1 / freq).toFixed(2)} s</span>
        </label>
        <input
          type="range"
          min={0.25}
          max={2.5}
          step={0.05}
          value={freq}
          onChange={(e) => setFreq(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="frequency in turns per second"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Σύρε τη συχνότητα.</strong> Το σημείο γυρίζει πιο γρήγορα και οι
        κορυφές του κύματος πυκνώνουν — <strong>μαζί</strong>, γιατί{' '}
        <strong>μία στροφή του σημείου είναι ακριβώς ένας κύκλος του κύματος</strong>{' '}
        (το αγκύλιο κάτω δεξιά τα δείχνει κλειδωμένα). Γι' αυτό «συχνότητα»
        σημαίνει κυριολεκτικά <strong>στροφές ανά δευτερόλεπτο</strong> — και
        γι' αυτό μια στροφή, που είναι <span className="font-mono">2π</span> rad,
        είναι η πηγή κάθε <span className="font-mono">2π</span> που θα δεις σε
        αυτό το κεφάλαιο.
      </div>
    </figure>
  )
}

const SHADOW_C = 'rgb(217, 119, 6)' // amber — the shadow and its waveform dot
const WAVE_C = 'rgb(29, 78, 216)' // accent blue

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  freq: number,
  tNow: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'

  const th = 2 * Math.PI * freq * tNow
  const side = Math.min(h, w * 0.34)
  drawCircle(ctx, colors, 4, (h - side) / 2, side, side, th)
  drawWave(ctx, colors, side + 8, 0, w - side - 12, h, freq, tNow, th)
}

function drawCircle(
  ctx: CanvasRenderingContext2D,
  colors: NonNullable<ReturnType<typeof getThemeColors>>,
  x0: number,
  y0: number,
  bw: number,
  bh: number,
  th: number,
) {
  const cx = x0 + bw / 2
  const cy = y0 + bh / 2 - 4
  const R = Math.min(bw, bh) * 0.34

  const pxv = cx + R * Math.cos(th)
  const pyv = cy - R * Math.sin(th) // canvas y grows downward

  // horizontal axis — the one the shadow lives on
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cx - R * 1.35, cy)
  ctx.lineTo(cx + R * 1.35, cy)
  ctx.stroke()

  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.setLineDash([])

  // the angle swept so far
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(cx, cy, R * 0.28, 0, -th, true)
  ctx.stroke()
  ctx.fillStyle = colors.accent
  ctx.textAlign = 'left'
  ctx.fillText('θ', cx + R * 0.34, cy - R * 0.14)

  // radius arm + the point
  ctx.strokeStyle = colors.fg
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(pxv, pyv)
  ctx.stroke()
  ctx.fillStyle = colors.fg
  ctx.beginPath()
  ctx.arc(pxv, pyv, 4, 0, 2 * Math.PI)
  ctx.fill()
  ctx.textAlign = 'center'
  ctx.fillText('P', pxv, pyv - 8)

  // the shadow: drop a dashed line onto the horizontal axis
  ctx.strokeStyle = SHADOW_C
  ctx.lineWidth = 1.2
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(pxv, pyv)
  ctx.lineTo(pxv, cy)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = SHADOW_C
  ctx.beginPath()
  ctx.arc(pxv, cy, 4.5, 0, 2 * Math.PI)
  ctx.fill()

  ctx.textAlign = 'center'
  ctx.fillText('η σκιά', cx, cy + R * 1.32)
  ctx.fillStyle = colors.fgMuted
  ctx.fillText(`cos θ = ${Math.cos(th).toFixed(2)}`, cx, y0 + bh - 2)
}

function drawWave(
  ctx: CanvasRenderingContext2D,
  colors: NonNullable<ReturnType<typeof getThemeColors>>,
  x0: number,
  y0: number,
  bw: number,
  bh: number,
  freq: number,
  tNow: number,
  th: number,
) {
  const PAD = 12
  const xt = (t: number) => lerp(t, 0, T_WINDOW, x0 + PAD, x0 + bw - PAD)
  const yv = (v: number) => lerp(v, 1.5, -1.5, y0 + 18, y0 + bh - 34)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'left'
  ctx.fillText('Η ίδια τιμή, σχεδιασμένη στον χρόνο:  x(t) = cos(2π f t)', x0 + PAD, y0 + 11)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xt(0), yZero)
  ctx.lineTo(xt(T_WINDOW), yZero)
  ctx.stroke()

  ctx.setLineDash([2, 4])
  for (const v of [1, -1]) {
    ctx.beginPath()
    ctx.moveTo(xt(0), yv(v))
    ctx.lineTo(xt(T_WINDOW), yv(v))
    ctx.stroke()
  }
  ctx.setLineDash([])

  ctx.strokeStyle = WAVE_C
  ctx.lineWidth = 1.8
  ctx.beginPath()
  const N = 1200
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * T_WINDOW
    const v = Math.cos(2 * Math.PI * freq * t)
    if (i === 0) ctx.moveTo(xt(t), yv(v))
    else ctx.lineTo(xt(t), yv(v))
  }
  ctx.stroke()

  // playhead + the dot carrying the same value as the shadow
  const xp = xt(tNow)
  ctx.strokeStyle = colors.accent
  ctx.globalAlpha = 0.45
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xp, y0 + 14)
  ctx.lineTo(xp, y0 + bh - 34)
  ctx.stroke()
  ctx.globalAlpha = 1

  const yp = yv(Math.cos(th))
  ctx.fillStyle = SHADOW_C
  ctx.beginPath()
  ctx.arc(xp, yp, 4.5, 0, 2 * Math.PI)
  ctx.fill()
  ctx.textAlign = xp > x0 + bw * 0.75 ? 'right' : 'left'
  ctx.fillText(`${Math.cos(th).toFixed(2)}`, xp + (xp > x0 + bw * 0.75 ? -8 : 8), yp - 6)

  // one period, bracketed — shrinks as the frequency rises
  const T = 1 / freq
  if (T <= T_WINDOW) {
    const yb = y0 + bh - 20
    const xa = xt(0)
    const xb = xt(T)
    ctx.strokeStyle = colors.fg
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(xa, yb - 4)
    ctx.lineTo(xa, yb)
    ctx.lineTo(xb, yb)
    ctx.lineTo(xb, yb - 4)
    ctx.stroke()
    ctx.fillStyle = colors.fg
    ctx.textAlign = 'center'
    ctx.fillText('μία στροφή = ένας κύκλος', (xa + xb) / 2, yb + 11)
  }
}
