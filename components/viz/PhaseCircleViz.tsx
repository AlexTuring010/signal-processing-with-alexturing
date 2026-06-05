'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * The phase of X(f) as a direction on the trig circle (FT chapter §3.5).
 *
 * The phase ∠X(f) is just the ANGLE the complex value X(f) points at. Reading it
 * as the phase of the time component cos(2πft + ∠X(f)), the four compass points
 * are exactly the "characteristic cases":
 *
 *   East  (φ = 0)     X(f) ∈ ℝ⁺        → cos(2πft)         (cosine, peak at 0)
 *   North (φ = +π/2)  X(f) = +j·(θετ.)  → cos(2πft+π/2)=−sin (sine)
 *   West  (φ = ±π)    X(f) ∈ ℝ⁻        → cos(2πft+π)=−cos   (flipped cosine)
 *   South (φ = −π/2)  X(f) = −j·(θετ.)  → cos(2πft−π/2)=+sin (sine)
 *
 * Anything in between is a complex value → a cosine with an intermediate phase
 * shift. Drag the angle and watch both the arrow and the time waveform.
 *
 * φ is carried as an integer k ∈ [−12, 12] with φ = k·π/12, so cardinals snap
 * exactly and the readout shows clean fractions of π.
 */

const STEP = Math.PI / 12 // one notch = 15°
const WAVE_CYCLES = 2

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

/** Format k·(π/12) as a reduced multiple of π. */
function fmtPi(k: number): string {
  if (k === 0) return '0'
  if (k === 12) return 'π'
  if (k === -12) return '−π'
  const sign = k < 0 ? '−' : ''
  const a = Math.abs(k)
  const g = gcd(a, 12)
  const num = a / g
  const den = 12 / g
  const top = num === 1 ? 'π' : `${num}π`
  return den === 1 ? `${sign}${top}` : `${sign}${top}/${den}`
}

type CaseInfo = { value: string; comp: string; form: string; cardinal: boolean }

function caseInfo(k: number): CaseInfo {
  if (k === 0) return { value: 'X(f) πραγματικός θετικός', comp: 'cosine', form: 'cos(2πft)', cardinal: true }
  if (k === 12 || k === -12)
    return { value: 'X(f) πραγματικός αρνητικός', comp: 'ανεστραμμένο cosine', form: '−cos(2πft)', cardinal: true }
  if (k === 6) return { value: 'X(f) = +j·(θετικό), δηλ. Im{X} > 0', comp: 'sine', form: '−sin(2πft)', cardinal: true }
  if (k === -6) return { value: 'X(f) = −j·(θετικό), δηλ. Im{X} < 0', comp: 'sine', form: '+sin(2πft)', cardinal: true }
  return { value: 'X(f) μιγαδικός (real + imag)', comp: 'cosine με ολίσθηση φάσης', form: `cos(2πft + ${fmtPi(k)})`, cardinal: false }
}

const PRESETS = [
  { k: 0, label: 'πραγματικός +' },
  { k: 6, label: '+j' },
  { k: 12, label: 'πραγματικός −' },
  { k: -6, label: '−j' },
]

export function PhaseCircleViz() {
  const [k, setK] = useState(0)
  const circleRef = useRef<HTMLCanvasElement | null>(null)
  const waveRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (circleRef.current) drawCircle(circleRef.current, colors, k)
    if (waveRef.current) drawWave(waveRef.current, colors, k)
  }, [k])

  const info = caseInfo(k)

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Ο τριγωνομετρικός κύκλος της φάσης — πού «δείχνει» το X(f)
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Η φάση <span className="font-mono">∠X(f)</span> είναι απλώς η <strong>γωνία</strong> που
        δείχνει ο μιγαδικός <span className="font-mono">X(f)</span>. Οι τέσσερις «γωνίες-κλειδιά» στον
        κύκλο είναι ακριβώς οι χαρακτηριστικές περιπτώσεις — και η δεξιά καμπύλη δείχνει τι{' '}
        <strong>σχήμα στον χρόνο</strong> δίνει η καθεμία.
      </p>

      <div className="mb-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => {
          const active = k === p.k
          return (
            <button
              key={p.k}
              type="button"
              onClick={() => setK(p.k)}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                active
                  ? 'border-transparent bg-accent text-white'
                  : 'border-border bg-bg text-fg-muted hover:bg-bg-elevated'
              }`}
            >
              {p.label}
            </button>
          )
        })}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Μιγαδικό επίπεδο" subtitle="η κατεύθυνση = η φάση ∠X(f)">
          <canvas
            ref={circleRef}
            style={{ height: 240 }}
            className="block h-[240px] w-full"
            aria-label="Phase of X(f) as a direction on the unit circle"
          />
        </Panel>
        <Panel title="Στον χρόνο" subtitle="η συνιστώσα cos(2πft + ∠X(f))">
          <canvas
            ref={waveRef}
            style={{ height: 240 }}
            className="block h-[240px] w-full"
            aria-label="Time-domain component for the current phase"
          />
        </Panel>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          Φάση <span className="font-mono">∠X(f)</span> ={' '}
          <span className="font-mono text-fg tabular-nums">{fmtPi(k)}</span>
        </label>
        <input
          type="range"
          min={-12}
          max={12}
          step={1}
          value={k}
          onChange={(e) => setK(parseInt(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Phase angle"
        />
      </div>

      <figcaption
        className={`mt-3 rounded-md border px-3 py-2 text-xs ${
          info.cardinal ? 'border-accent/40 bg-accent-soft/30 text-fg' : 'border-border bg-bg text-fg-muted'
        }`}
      >
        <strong>{info.value}</strong> → φάση <span className="font-mono">{fmtPi(k)}</span> →{' '}
        <strong>{info.comp}</strong>: <span className="font-mono">{info.form}</span>.
        {info.cardinal
          ? ''
          : ' Καμία «καθαρή» περίπτωση — ένας γενικός μιγαδικός δίνει cosine απλώς μετατοπισμένο.'}
      </figcaption>
    </figure>
  )
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-3 py-1.5">
        <span className="text-[11px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

const CARDINALS: { k: number; label: string; comp: string }[] = [
  { k: 0, label: 'ℝ⁺', comp: 'cos' },
  { k: 6, label: '+j', comp: 'sine' },
  { k: 12, label: 'ℝ⁻', comp: '−cos' },
  { k: -6, label: '−j', comp: 'sine' },
]

function drawCircle(canvas: HTMLCanvasElement, colors: ThemeColors, k: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const cx = w / 2
  const cy = h / 2
  const R = Math.min(w, h) / 2 - 38
  const phi = k * STEP

  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cx - R - 16, cy)
  ctx.lineTo(cx + R + 16, cy)
  ctx.moveTo(cx, cy - R - 16)
  ctx.lineTo(cx, cy + R + 16)
  ctx.stroke()
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Re', cx + R + 4, cy - 5)
  ctx.fillText('Im', cx + 5, cy - R - 6)

  // unit circle
  ctx.strokeStyle = colors.fgSubtle
  ctx.globalAlpha = 0.45
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.stroke()
  ctx.globalAlpha = 1

  // cardinal markers + labels
  for (const c of CARDINALS) {
    const a = c.k * STEP
    const px = cx + R * Math.cos(a)
    const py = cy - R * Math.sin(a)
    const active = k === c.k || (c.k === 12 && k === -12)
    ctx.fillStyle = active ? colors.accent : colors.fgSubtle
    ctx.beginPath()
    ctx.arc(px, py, active ? 5 : 3.5, 0, Math.PI * 2)
    ctx.fill()
    // label outside the circle
    const lx = cx + (R + 16) * Math.cos(a)
    const ly = cy - (R + 16) * Math.sin(a)
    ctx.font = active
      ? 'bold 11px ui-sans-serif, system-ui, sans-serif'
      : '11px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = Math.abs(Math.cos(a)) < 0.3 ? 'center' : Math.cos(a) > 0 ? 'left' : 'right'
    ctx.textBaseline = Math.abs(Math.sin(a)) < 0.3 ? 'middle' : Math.sin(a) > 0 ? 'bottom' : 'top'
    ctx.fillStyle = active ? colors.accent : colors.fgMuted
    ctx.fillText(`${c.label} → ${c.comp}`, lx, ly)
  }
  ctx.textBaseline = 'alphabetic'

  // the phasor for the current phase
  const tipX = cx + R * Math.cos(phi)
  const tipY = cy - R * Math.sin(phi)
  ctx.strokeStyle = colors.accent
  ctx.fillStyle = colors.accent
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(tipX, tipY)
  ctx.stroke()
  // arrowhead
  const ah = 8
  ctx.beginPath()
  ctx.moveTo(tipX, tipY)
  ctx.lineTo(tipX - ah * Math.cos(phi - 0.4), tipY + ah * Math.sin(phi - 0.4))
  ctx.lineTo(tipX - ah * Math.cos(phi + 0.4), tipY + ah * Math.sin(phi + 0.4))
  ctx.closePath()
  ctx.fill()

  // angle arc + label near origin
  ctx.strokeStyle = colors.accent
  ctx.globalAlpha = 0.5
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(cx, cy, 20, 0, -phi, phi > 0)
  ctx.stroke()
  ctx.globalAlpha = 1
}

function drawWave(canvas: HTMLCanvasElement, colors: ThemeColors, k: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const phi = k * STEP
  const padX = 22
  const padY = 18
  const yMid = h / 2
  const amp = (h / 2 - padY) * 0.92
  const thetaMax = WAVE_CYCLES * 2 * Math.PI

  const xt = (theta: number) => lerp(theta, 0, thetaMax, padX, w - padX)
  const yv = (v: number) => yMid - v * amp

  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padX, yMid)
  ctx.lineTo(w - padX, yMid)
  ctx.moveTo(padX, padY / 2)
  ctx.lineTo(padX, h - padY / 2)
  ctx.stroke()
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('t', w - padX, yMid - 4)
  ctx.fillText('0', padX - 3, yMid + 11)

  // faint reference cosine (φ = 0) for comparison
  ctx.strokeStyle = colors.fgSubtle
  ctx.globalAlpha = 0.35
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let i = 0; i <= 300; i++) {
    const th = lerp(i, 0, 300, 0, thetaMax)
    const px = xt(th)
    const py = yv(Math.cos(th))
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1

  // the current component cos(θ + φ)
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2.4
  ctx.beginPath()
  for (let i = 0; i <= 300; i++) {
    const th = lerp(i, 0, 300, 0, thetaMax)
    const px = xt(th)
    const py = yv(Math.cos(th + phi))
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // marker at t = 0 — "where it starts" (value cos φ)
  ctx.fillStyle = colors.accent
  ctx.beginPath()
  ctx.arc(xt(0), yv(Math.cos(phi)), 4, 0, Math.PI * 2)
  ctx.fill()

  // labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('– – cos (φ=0) για σύγκριση', padX + 2, h - 4)
  ctx.fillStyle = colors.fg
  ctx.textAlign = 'right'
  ctx.fillText(caseInfo(k).form, w - padX, padY + 2)
}
