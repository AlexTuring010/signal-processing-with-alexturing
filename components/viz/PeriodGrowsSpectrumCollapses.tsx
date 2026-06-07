'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * The limit OBSERVATION (the puzzle), for FT §1.
 *
 * Concrete periodic signal: one smooth pulse p(t) = e^{-πt²} repeated every T₀.
 * Drag T₀ and watch the two things the prose claims happen at once:
 *   - TIME (left): the copies spread apart. The central pulse is UNCHANGED — the
 *     signal is not vanishing, it's just getting lonelier.
 *   - FREQ (right): the lines at fₖ = k/T₀ crowd together (Δf = 1/T₀ → 0) AND
 *     their heights aₖ = X(fₖ)/T₀ collapse toward 0 (fixed vertical scale).
 *
 * This is deliberately the PUZZLE, not the answer: the pulse is right there in
 * time, so the shrinking heights can't mean "the signal disappeared". What
 * actually survives (the density T₀·aₖ) is the next viz, CoefficientsToDensity.
 *
 * One pulse p(t) = e^{-πt²} ⇒ its FT is the Gaussian X(f) = e^{-πf²}, so the
 * coefficients are aₖ = (1/T₀)·e^{-π(k/T₀)²} (real, positive — clean stems).
 */

const T0_MIN = 1.5
const T0_MAX = 10
const TAU = 1 // pulse width parameter (fixed)

function pulse(t: number) {
  return Math.exp(-Math.PI * (t / TAU) * (t / TAU))
}
// aₖ = X(k/T₀)/T₀, with X(f) = e^{-πf²}
function coeff(k: number, T0: number) {
  const f = k / T0
  return Math.exp(-Math.PI * f * f) / T0
}

export function PeriodGrowsSpectrumCollapses() {
  const [T0, setT0] = useState(2.5)
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, T0)
    if (freqRef.current) drawFreq(freqRef.current, colors, T0)
  }, [T0])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Μεγαλώνει το T₀: οι γραμμές πυκνώνουν ΚΑΙ χαμηλώνουν
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Ένας παλμός που επαναλαμβάνεται κάθε <span className="font-mono">T₀</span>. Σύρε το{' '}
        <span className="font-mono">T₀</span> και κοίτα <strong>ταυτόχρονα</strong> τα δύο
        πλαίσια. <strong>Χρόνος</strong>: οι κόπιες απομακρύνονται, αλλά ο κεντρικός παλμός{' '}
        <strong>μένει ίδιος</strong> — το σήμα δεν εξαφανίζεται, απλώς «μονάζει».{' '}
        <strong>Συχνότητα</strong>: οι γραμμές στις <span className="font-mono">k/T₀</span>{' '}
        έρχονται πιο κοντά (<span className="font-mono">Δf = 1/T₀ → 0</span>){' '}
        <strong>και</strong> τα ύψη τους <span className="font-mono">aₖ</span> πέφτουν.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="ίδιος παλμός, όλο πιο αραιά">
          <canvas
            ref={timeRef}
            style={{ height: 170 }}
            className="block h-[170px] w-full"
            aria-label="A pulse repeating with period T0; copies spread apart as T0 grows"
          />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="γραμμές aₖ: πυκνώνουν + χαμηλώνουν">
          <canvas
            ref={freqRef}
            style={{ height: 170 }}
            className="block h-[170px] w-full"
            aria-label="Discrete spectrum lines that both crowd together and shrink as T0 grows"
          />
        </Panel>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          T₀ ={' '}
          <span className="font-mono text-fg tabular-nums">{T0.toFixed(1)}</span>
          {' · '}απόσταση γραμμών Δf = 1/T₀ ={' '}
          <span className="font-mono text-fg tabular-nums">{(1 / T0).toFixed(3)}</span> Hz
          {' · '}ύψος <span className="font-mono">a₀ = 1/T₀</span> ={' '}
          <span className="font-mono text-fg tabular-nums">{(1 / T0).toFixed(3)}</span>
        </label>
        <input
          type="range"
          min={T0_MIN}
          max={T0_MAX}
          step={0.1}
          value={T0}
          onChange={(e) => setT0(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Period T0"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Εδώ είναι ο γρίφος: στον χρόνο ο παλμός είναι ολοζώντανος, ίδιος όπως πάντα — άρα
        το «χαμήλωμα» των γραμμών <strong>δεν</strong> σημαίνει ότι χάνεται σήμα. Τότε τι
        χαμηλώνει, και τι <strong>επιβιώνει</strong>; Αυτό το λύνουμε αμέσως παρακάτω.
      </div>
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
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-3 py-1">
        <span className="text-[10px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

const PAD_X = 28
const PAD_Y = 16

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}

function drawTime(canvas: HTMLCanvasElement, colors: ThemeColors, T0: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const tMax = 7
  const yLim = 1.25
  const xt = (t: number) => lerp(t, -tMax, tMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -0.25, PAD_Y, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  // Axes.
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  // Pulses at multiples of T₀ (central one emphasised).
  const kMax = Math.ceil((tMax + 2 * TAU) / T0)
  const STEPS = 240
  for (let k = -kMax; k <= kMax; k++) {
    const c = k * T0
    if (c - 2 * TAU > tMax || c + 2 * TAU < -tMax) continue
    const central = k === 0
    ctx.strokeStyle = central ? colors.accent : `rgba(${accentRgb}, 0.5)`
    ctx.lineWidth = central ? 2.2 : 1.4
    ctx.beginPath()
    let started = false
    for (let i = 0; i <= STEPS; i++) {
      const t = lerp(i, 0, STEPS, c - 2.6 * TAU, c + 2.6 * TAU)
      if (t < -tMax || t > tMax) {
        started = false
        continue
      }
      const x = xt(t)
      const y = yv(pulse(t - c))
      if (!started) {
        ctx.moveTo(x, y)
        started = true
      } else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  // T₀ bracket between the central pulse and its right neighbour.
  if (T0 <= tMax) {
    const xa = xt(0)
    const xb = xt(T0)
    const yb = yZero + 10
    ctx.strokeStyle = colors.fg
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(xa, yZero + 3)
    ctx.lineTo(xa, yb + 3)
    ctx.moveTo(xb, yZero + 3)
    ctx.lineTo(xb, yb + 3)
    ctx.moveTo(xa, yb)
    ctx.lineTo(xb, yb)
    ctx.stroke()
    ctx.fillStyle = colors.fg
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('T₀', (xa + xb) / 2, yb + 13)
  }

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('t', w - PAD_X + 2, yZero - 4)
}

function drawFreq(canvas: HTMLCanvasElement, colors: ThemeColors, T0: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const fMax = 3
  const yMax = 1 / T0_MIN // largest a₀ (at T₀ = T0_MIN) → fixed scale shows the drop
  const xt = (f: number) => lerp(f, -fMax, fMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax * 1.08, -yMax * 0.12, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // Axes.
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y - 2)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // Lines aₖ at f = k/T₀ — crowd (spacing ↓) and shrink (height ↓).
  const df = 1 / T0
  const kMax = Math.ceil(fMax / df) + 1
  ctx.strokeStyle = colors.accent
  ctx.fillStyle = colors.accent
  ctx.lineWidth = T0 > 6 ? 1 : 1.5
  for (let k = -kMax; k <= kMax; k++) {
    const f = k * df
    if (Math.abs(f) > fMax) continue
    const ak = coeff(k, T0)
    const x = xt(f)
    const y = yv(ak)
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x, y, T0 > 6 ? 1.4 : 2, 0, 2 * Math.PI)
    ctx.fill()
  }

  // Δf = 1/T₀ bracket below the axis — narrows as T₀ grows.
  const xa = xt(0)
  const xb = xt(1 / T0)
  const yb = yZero + 9
  ctx.strokeStyle = colors.fg
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xa, yZero + 3)
  ctx.lineTo(xa, yb + 3)
  ctx.moveTo(xb, yZero + 3)
  ctx.lineTo(xb, yb + 3)
  ctx.moveTo(xa, yb)
  ctx.lineTo(xb, yb)
  ctx.stroke()
  ctx.fillStyle = colors.fg
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Δf = 1/T₀', xb + 4, yb + 3)

  // a₀ height marker.
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'left'
  ctx.fillText('a₀ = 1/T₀', xt(0) + 4, yv(coeff(0, T0)) - 4)
  ctx.textAlign = 'right'
  ctx.fillText('f', w - PAD_X + 2, yZero - 4)
}
