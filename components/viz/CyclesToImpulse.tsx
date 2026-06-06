'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * FT §2.2 — "N cycles → impulse".
 *
 * Truncate cos(2πf₀t) to N whole cycles (a finite burst, duration NT₀). It has
 * an ordinary FT: a sinc "bump" at ±f₀ with peak NT₀·aₖ and effective width
 * ~1/(NT₀). As N grows the bump gets TALLER and NARROWER while its AREA stays
 * aₖ — and in the limit (the full periodic cosine) it becomes an impulse of
 * weight aₖ. That is why the FT of a periodic signal has impulse weights exactly
 * equal to the FS coefficients, with no 1/T₀: the 1/T₀ was reading the finite
 * peak; the impulse weight is the invariant area.
 *
 * Units chosen for clean numbers: f₀ = 1, T₀ = 1, so aₖ = a₁ = ½, peak = N/2,
 * effective width = 1/N, area = ½. The frequency y-axis is FIXED (so the bumps'
 * equal areas can be compared directly across N).
 */

const N_MIN = 1
const N_MAX = 8
const A1 = 0.5

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}

// FT of cos(2πt) windowed to N whole cycles (T₀ = 1, f₀ = 1): real, sinc bumps at ±1.
function XN(f: number, N: number) {
  return (N / 2) * (sinc(N * (f - 1)) + sinc(N * (f + 1)))
}

export function CyclesToImpulse() {
  const [N, setN] = useState(3)
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, N)
    if (freqRef.current) drawFreq(freqRef.current, colors, N)
  }, [N])

  const peak = (N * A1).toFixed(2)
  const width = (1 / N).toFixed(2)

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Ν κύκλοι → κρούση: το φάσμα ενός cosine καθώς προσθέτεις κύκλους
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Αριστερά: <span className="font-mono">cos(2πf₀t)</span> κομμένο σε{' '}
        <span className="font-mono">N</span> κύκλους (πεπερασμένο σήμα). Δεξιά: το φάσμα του —
        ένα «καμπανάκι» στα <span className="font-mono">±f₀</span>. Σύρε το{' '}
        <span className="font-mono">N</span>: το καμπανάκι <strong>ψηλώνει</strong> και{' '}
        <strong>στενεύει</strong>, αλλά το <strong>εμβαδόν</strong> του (το σκιασμένο) μένει{' '}
        <strong>σταθερό = aₖ</strong>. Στο όριο → μια <strong>κρούση βάρους aₖ</strong>.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="N κύκλοι του cosine (διάρκεια N·T₀)">
          <canvas
            ref={timeRef}
            style={{ height: 190 }}
            className="block h-[190px] w-full"
            aria-label="N cycles of a cosine burst in the time domain"
          />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="X_N(f): καμπανάκι που γίνεται κρούση">
          <canvas
            ref={freqRef}
            style={{ height: 190 }}
            className="block h-[190px] w-full"
            aria-label="Spectrum of the N-cycle cosine, a bump sharpening into an impulse"
          />
        </Panel>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          N = <span className="font-mono text-fg tabular-nums">{N}</span> κύκλοι
        </label>
        <input
          type="range"
          min={N_MIN}
          max={N_MAX}
          step={1}
          value={N}
          onChange={(e) => setN(parseInt(e.target.value, 10))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Number of cycles N"
        />
      </div>

      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
        <div className="rounded-md border border-border bg-bg p-2">
          κορυφή <span className="font-mono">= N·T₀·aₖ = </span>
          <span
            className="font-mono font-semibold tabular-nums"
            style={{ color: 'rgb(var(--accent))' }}
          >
            {peak}
          </span>
        </div>
        <div className="rounded-md border border-border bg-bg p-2">
          πλάτος <span className="font-mono">≈ 1/(N·T₀) = </span>
          <span className="font-mono font-semibold tabular-nums">{width}</span>
        </div>
        <div className="rounded-md border border-border bg-bg p-2">
          εμβαδόν <span className="font-mono">= aₖ = </span>
          <span className="font-mono font-semibold tabular-nums">0.50</span>{' '}
          <span className="text-fg-subtle">(σταθερό)</span>
        </div>
      </div>

      <div className="mt-2 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Η κορυφή μεγαλώνει (<span className="font-mono">N·T₀·aₖ</span>) και το πλάτος μικραίνει
        (<span className="font-mono">1/N·T₀</span>), αλλά το γινόμενό τους — το{' '}
        <strong>εμβαδόν</strong> — μένει <span className="font-mono">aₖ</span>. Στους{' '}
        <strong>άπειρους κύκλους</strong> (το πλήρες periodic σήμα) το καμπανάκι γίνεται{' '}
        <strong>κρούση βάρους <span className="font-mono">aₖ</span></strong> — γι' αυτό ο FT ενός
        periodic σήματος έχει βάρη κρούσεων ακριβώς τα <span className="font-mono">aₖ</span>.
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

const PAD_X = 30
const PAD_Y = 16

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}

function drawTime(canvas: HTMLCanvasElement, colors: ThemeColors, N: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const tDom = 5
  const yLim = 1.3
  const xt = (t: number) => lerp(t, -tDom, tDom, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  // window edges at ±N/2
  const half = N / 2
  if (half <= tDom) {
    ctx.strokeStyle = colors.fgSubtle
    ctx.setLineDash([3, 3])
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(xt(half), PAD_Y)
    ctx.lineTo(xt(half), h - PAD_Y)
    ctx.moveTo(xt(-half), PAD_Y)
    ctx.lineTo(xt(-half), h - PAD_Y)
    ctx.stroke()
    ctx.setLineDash([])
  }

  // cosine burst, only for |t| ≤ N/2
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.8
  ctx.beginPath()
  const STEPS = 700
  let started = false
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, -tDom, tDom)
    if (Math.abs(t) > half) {
      started = false
      continue
    }
    const x = xt(t)
    const y = yv(Math.cos(2 * Math.PI * t))
    if (!started) {
      ctx.moveTo(x, y)
      started = true
    } else ctx.lineTo(x, y)
  }
  ctx.stroke()

  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`${N} κύκλοι (διάρκεια ${N}·T₀)`, PAD_X + 4, PAD_Y + 10)
}

function drawFreq(canvas: HTMLCanvasElement, colors: ThemeColors, N: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const fDom = 2.3
  const yMax = N_MAX / 2 + 0.5 // fixed, so equal areas read as equal across N
  const yMin = -1.0
  const xt = (f: number) => lerp(f, -fDom, fDom, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, yMin, PAD_Y, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  // shade the main lobe of each bump, f ∈ [c − 1/N, c + 1/N]
  ctx.fillStyle = `rgba(${accentRgb}, 0.18)`
  for (const c of [1, -1]) {
    const fa = c - 1 / N
    const fb = c + 1 / N
    ctx.beginPath()
    ctx.moveTo(xt(fa), yZero)
    const S = 90
    for (let i = 0; i <= S; i++) {
      const f = lerp(i, 0, S, fa, fb)
      ctx.lineTo(xt(f), yv(Math.max(0, XN(f, N))))
    }
    ctx.lineTo(xt(fb), yZero)
    ctx.closePath()
    ctx.fill()
  }

  // X_N(f) curve
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  const STEPS = 720
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -fDom, fDom)
    const x = xt(f)
    const y = yv(XN(f, N))
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // f ticks at ±f₀ and 0
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('f₀', xt(1), yZero + 12)
  ctx.fillText('−f₀', xt(-1), yZero + 12)
  ctx.fillText('0', xt(0), yZero + 12)
  ctx.textAlign = 'left'
  ctx.fillText('f', w - PAD_X + 2, yZero - 4)
}
