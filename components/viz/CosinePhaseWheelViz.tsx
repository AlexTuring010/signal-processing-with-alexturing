'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Sine ↔ cosine phase conversions DERIVED (not memorized) from the unit
 * circle — for the foundations/fourier-series cosine-form section.
 *
 * Convention (the same phasor picture as the rest of the chapter): write
 * everything as cos(θ + φ) and read it as a unit arrow that, at θ = 0,
 * points at angle φ; the signal's value is the arrow's HORIZONTAL (Re)
 * projection, and positive φ means "rotate counter-clockwise". The four
 * building blocks then sit at the four compass points:
 *
 *   East  (φ = 0)     cos θ
 *   North (φ = π/2)   −sin θ      = cos(θ + π/2)
 *   West  (φ = ±π)    −cos θ      = cos(θ + π)
 *   South (φ = −π/2)  +sin θ      = cos(θ − π/2)
 *
 * So "+π/2 for −sin" is something you READ off the circle, not recall.
 *
 * Phase is carried in integer steps of π/12 (k ∈ [−12, 12]) so the
 * readout shows clean fractions of π and the cardinals snap exactly.
 */

const FREQ = 0.4 // rotation rate (rev/s) when "Περιστροφή" is on
const WAVE_CYCLES = 2.4
const STEP = Math.PI / 12 // one slider notch = 15° = π/12
const PHASOR_COLOR = 'rgb(29, 78, 216)' // blue
const VALUE_COLOR = 'rgb(217, 119, 6)' // amber — the horizontal projection (= value)

const SNAPS = [
  { k: 0, label: 'cos θ' },
  { k: 6, label: '−sin θ' }, // +π/2
  { k: 12, label: '−cos θ' }, // +π
  { k: -6, label: 'sin θ' }, // −π/2
]

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

/** Format k·(π/12) as a reduced multiple of π, e.g. "π/2", "−π/2", "2π/3", "0". */
function fmtPi(k: number): string {
  if (k === 0) return '0'
  const sign = k < 0 ? '−' : ''
  const a = Math.abs(k)
  const g = gcd(a, 12)
  const num = a / g
  const den = 12 / g
  const top = num === 1 ? 'π' : `${num}π`
  return den === 1 ? `${sign}${top}` : `${sign}${top}/${den}`
}

function nameFor(k: number): string | null {
  if (k === 0) return 'cos θ'
  if (k === 6) return '−sin θ'
  if (k === -6) return 'sin θ'
  if (Math.abs(k) === 12) return '−cos θ'
  return null
}

export function CosinePhaseWheelViz() {
  const [running, setRunning] = useState(false)
  const [k, setK] = useState(6) // start at −sin (φ = +π/2): the classic trap
  const tRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const kRef = useRef(k)
  const runRef = useRef(running)
  kRef.current = k
  runRef.current = running

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (runRef.current) tRef.current += dt
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) draw(canvas, colors, kRef.current * STEP, tRef.current, runRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const toggle = () =>
    setRunning((r) => {
      const next = !r
      if (!next) tRef.current = 0 // pausing returns to the θ = 0 snapshot
      return next
    })

  const name = nameFor(k)

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Ο τροχός φάσης: sine ↔ cosine από τον μοναδιαίο κύκλο
        </h4>
        <button
          type="button"
          onClick={toggle}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
          aria-label={running ? 'Παύση' : 'Περιστροφή'}
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {running ? 'Παύση' : 'Περιστροφή'}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 250 }}
        className="block h-[250px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Μοναδιαίος κύκλος με τη φάση φ και η αντίστοιχη κυματομορφή cos(θ+φ)"
      />

      {/* Readout */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full border border-border bg-bg-soft px-2.5 py-1 font-mono tabular-nums">
          cos(θ + φ), φ = <span className="text-accent">{fmtPi(k)}</span>
        </span>
        {name && (
          <span className="rounded-full border border-accent/40 bg-accent-soft/40 px-2.5 py-1 font-mono">
            = {name}
          </span>
        )}
      </div>

      {/* Snap-to-cardinal buttons */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {SNAPS.map((s) => (
          <button
            key={s.k}
            type="button"
            onClick={() => {
              setK(s.k)
              tRef.current = 0
            }}
            className={cn(
              'rounded-full border px-2.5 py-0.5 text-[11px] font-mono transition-colors',
              k === s.k
                ? 'border-accent bg-accent text-accent-fg'
                : 'border-border bg-bg-soft text-fg-muted hover:text-fg',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Phase slider (in steps of π/12) */}
      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          φ (φάση, σε rad){' '}
          <span className="font-mono text-fg tabular-nums">{fmtPi(k)}</span>
        </label>
        <input
          type="range"
          min={-12}
          max={12}
          step={1}
          value={k}
          onChange={(e) => setK(parseInt(e.target.value, 10))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Φάση φ σε ακέραια βήματα π/12"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Συμφωνία: γράφουμε τα πάντα ως{' '}
        <span className="font-mono">cos(θ + φ)</span> και το βλέπουμε σαν ένα βελάκι
        που στο <span className="font-mono">θ = 0</span> δείχνει στη γωνία{' '}
        <span className="font-mono">φ</span>· η <strong>οριζόντια προβολή</strong>{' '}
        (πορτοκαλί) είναι η <strong>τιμή</strong>, και θετική φ = στρίψε{' '}
        <strong>αριστερόστροφα</strong>. Πάτησε τα κουμπιά: το{' '}
        <span className="font-mono">−sin</span> κάθεται στο{' '}
        <span className="font-mono">+π/2</span> (πάνω) — εκεί η προβολή ξεκινά στο 0
        και <strong>πέφτει</strong>. Έτσι το «+π/2 για το −sin» το{' '}
        <strong>διαβάζεις</strong>, δεν το αποστηθίζεις.
      </div>
    </figure>
  )
}

function draw(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  phi: number,
  t: number,
  running: boolean,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const splitX = Math.min(w * 0.46, 270)
  drawWheel(ctx, colors, 0, 0, splitX, h, phi, t, running)
  drawWave(ctx, colors, splitX, 0, w - splitX, h, phi, t, running)
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
  if (Math.hypot(x1 - x0, y1 - y0) < 4) return
  const a = Math.atan2(y1 - y0, x1 - x0)
  const hd = 7
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x1 - hd * Math.cos(a - Math.PI / 6), y1 - hd * Math.sin(a - Math.PI / 6))
  ctx.lineTo(x1 - hd * Math.cos(a + Math.PI / 6), y1 - hd * Math.sin(a + Math.PI / 6))
  ctx.closePath()
  ctx.fill()
}

function drawWheel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  phi: number,
  t: number,
  running: boolean,
) {
  if (!colors) return
  const cx = x0 + pw / 2
  const cy = y0 + ph / 2
  const R = Math.min(pw, ph) * 0.34

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cx - R - 14, cy)
  ctx.lineTo(cx + R + 14, cy)
  ctx.moveTo(cx, cy - R - 14)
  ctx.lineTo(cx, cy + R + 14)
  ctx.stroke()

  // Unit circle
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.stroke()

  // Im axis hint
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Im', cx + 9, y0 + 9)

  // Four cardinal labels (the building blocks), with φ in radians
  const active = nameFor(Math.round(phi / STEP))
  const card = (
    label: string,
    sub: string,
    px: number,
    py: number,
    align: CanvasTextAlign,
  ) => {
    const isActive = active === label
    ctx.fillStyle = isActive ? colors.accent : colors.fgMuted
    ctx.textAlign = align
    ctx.font = `bold 11px ui-sans-serif, system-ui, sans-serif`
    ctx.fillText(label, px, py)
    ctx.fillStyle = colors.fgSubtle
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.fillText(sub, px, py + 11)
  }
  card('cos θ', 'φ = 0', cx + R + 6, cy - 4, 'left')
  card('−sin θ', 'φ = π/2', cx, cy - R - 12, 'center')
  card('−cos θ', 'φ = ±π', cx - R - 6, cy - 4, 'right')
  card('sin θ', 'φ = −π/2', cx, cy + R + 22, 'center')

  // CCW hint arc (positive-φ direction)
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(cx, cy, R + 9, -Math.PI * 0.78, -Math.PI * 0.55)
  ctx.stroke()

  // Phasor angle (rotates CCW when playing; static snapshot at φ otherwise)
  const ang = phi + (running ? 2 * Math.PI * FREQ * t : 0)
  const tipX = cx + R * Math.cos(ang)
  const tipY = cy - R * Math.sin(ang)

  // Horizontal projection (the value) — dashed drop + bold bar on the Re axis
  ctx.strokeStyle = colors.fgSubtle
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  ctx.moveTo(tipX, tipY)
  ctx.lineTo(tipX, cy)
  ctx.stroke()
  ctx.setLineDash([])
  arrow(ctx, cx, cy, tipX, cy, VALUE_COLOR, 2.4)
  ctx.fillStyle = VALUE_COLOR
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = tipX >= cx ? 'left' : 'right'
  ctx.fillText('τιμή', tipX + (tipX >= cx ? 4 : -4), cy + 11)

  // Phasor
  arrow(ctx, cx, cy, tipX, tipY, PHASOR_COLOR, 2)
  ctx.fillStyle = PHASOR_COLOR
  ctx.beginPath()
  ctx.arc(tipX, tipY, 3, 0, Math.PI * 2)
  ctx.fill()
}

function drawWave(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  phi: number,
  t: number,
  running: boolean,
) {
  if (!colors) return
  const PAD = 16
  const thetaMax = WAVE_CYCLES * 2 * Math.PI
  const yLim = 1.3
  const xt = (th: number) => lerp(th, 0, thetaMax, x0 + PAD, x0 + pw - PAD)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD, y0 + ph - PAD)
  const yZero = yv(0)

  // Baseline + θ = 0 axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD, yZero)
  ctx.lineTo(x0 + pw - PAD, yZero)
  ctx.moveTo(xt(0), y0 + PAD)
  ctx.lineTo(xt(0), y0 + ph - PAD)
  ctx.stroke()

  const STEPS = 240
  const plot = (fn: (th: number) => number, color: string, width: number, dash?: number[]) => {
    ctx.strokeStyle = color
    ctx.lineWidth = width
    if (dash) ctx.setLineDash(dash)
    ctx.beginPath()
    for (let i = 0; i <= STEPS; i++) {
      const th = lerp(i, 0, STEPS, 0, thetaMax)
      const px = xt(th)
      const py = yv(fn(th))
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
    if (dash) ctx.setLineDash([])
  }

  // Faint reference cos θ, bold cos(θ+φ)
  plot((th) => Math.cos(th), colors.fgMuted, 1.2, [4, 3])
  plot((th) => Math.cos(th + phi), colors.fg, 2.2)

  // Value dot at the current angle (links to the wheel's projection)
  const thNow = running ? (2 * Math.PI * FREQ * t) % thetaMax : 0
  if (running) {
    ctx.strokeStyle = colors.fgSubtle
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(xt(thNow), y0 + PAD)
    ctx.lineTo(xt(thNow), y0 + ph - PAD)
    ctx.stroke()
    ctx.setLineDash([])
  }
  ctx.fillStyle = VALUE_COLOR
  ctx.beginPath()
  ctx.arc(xt(thNow), yv(Math.cos(thNow + phi)), 4, 0, Math.PI * 2)
  ctx.fill()

  // y ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('+1', x0 + PAD - 2, yv(1) + 3)
  ctx.fillText('−1', x0 + PAD - 2, yv(-1) + 3)
  ctx.textAlign = 'center'
  ctx.fillText('θ', x0 + pw - PAD, yZero + 12)

  // Legend
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  const lx = x0 + PAD + 4
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('cos θ (αναφορά)', lx, y0 + PAD + 10)
  ctx.fillStyle = colors.fg
  ctx.fillText('cos(θ + φ)', lx, y0 + PAD + 23)
}
