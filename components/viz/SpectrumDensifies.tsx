'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * FS → FT bridge, INTRO version (Fourier-series page only).
 *
 * The single idea, kept deliberately light: as the period T₀ grows, the
 * harmonic spacing Δf = 1/T₀ closes up, the discrete line spectrum gets denser,
 * and in the limit it merges into a continuous curve — the Fourier transform.
 *
 * NO height semantics here (no aₖ vs T₀·aₖ, no "totals/averages"). Those belong
 * to the Fourier-transform chapter (§1 + §2.1). On the Series page
 * the reader does not even know what X(f) is yet, so the star is purely the
 * SPACING shrinking: discrete spectrum → continuous spectrum.
 */

const T_MIN = 1.5
const T_MAX = 12
const TAU = 1 // fixed pulse width

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}

export function SpectrumDensifies() {
  const [T0, setT0] = useState(3)
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
        T₀ → ∞: το διακριτό φάσμα γίνεται συνεχές
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Αριστερά ο periodic παλμός· δεξιά το φάσμα του (γραμμές στις{' '}
        <span className="font-mono">k/T₀</span>). Σύρε το{' '}
        <span className="font-mono">T₀</span>: όσο μεγαλώνει η περίοδος, οι γραμμές
        έρχονται πιο κοντά (η απόσταση <span className="font-mono">Δf = 1/T₀</span>{' '}
        μικραίνει) και πυκνώνουν — στο όριο γίνονται μια <strong>συνεχή καμπύλη</strong>.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="periodic παλμός, σταθερό σχήμα">
          <canvas
            ref={timeRef}
            style={{ height: 170 }}
            className="block h-[170px] w-full"
            aria-label="Periodic rectangular pulse train"
          />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="γραμμές στις k/T₀ → πυκνώνουν">
          <canvas
            ref={freqRef}
            style={{ height: 170 }}
            className="block h-[170px] w-full"
            aria-label="Discrete line spectrum densifying toward a continuous curve"
          />
        </Panel>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          T₀ ={' '}
          <span className="font-mono text-fg tabular-nums">{T0.toFixed(1)}</span>
          {' · '}
          απόσταση γραμμών Δf = 1/T₀ ={' '}
          <span className="font-mono text-fg tabular-nums">
            {(1 / T0).toFixed(3)} Hz
          </span>
        </label>
        <input
          type="range"
          min={T_MIN}
          max={T_MAX}
          step={0.1}
          value={T0}
          onChange={(e) => setT0(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Period T0"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Κράτα μόνο τη μεγάλη εικόνα: <strong>periodic → διακριτό φάσμα</strong>· καθώς{' '}
        <span className="font-mono">T₀ → ∞</span> το σήμα παύει να είναι periodic και το
        φάσμα <strong>γίνεται συνεχές</strong>. Αυτή η συνεχής καμπύλη είναι ο{' '}
        <strong>μετασχηματισμός Fourier</strong> — τον χτίζουμε από την αρχή στο επόμενο
        κεφάλαιο.
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
const PAD_Y = 14

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}

function drawTime(canvas: HTMLCanvasElement, colors: ThemeColors, T0: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const tMax = 12
  const tMin = -tMax
  const yLim = 1.4

  const xt = (t: number) => lerp(t, tMin, tMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -0.4, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  const accentRgb = getRGB(colors.accent)
  ctx.fillStyle = `rgba(${accentRgb}, 0.18)`
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.5

  const kMaxAbs = Math.ceil((tMax + TAU) / T0)
  for (let k = -kMaxAbs; k <= kMaxAbs; k++) {
    const c = k * T0
    const a = c - TAU / 2
    const b = c + TAU / 2
    if (b < tMin || a > tMax) continue
    const aC = Math.max(a, tMin)
    const bC = Math.min(b, tMax)
    const xL = xt(aC)
    const xR = xt(bC)
    const yT = yv(1)
    ctx.fillRect(xL, yT, xR - xL, yZero - yT)
    ctx.strokeRect(xL, yT, xR - xL, yZero - yT)
  }

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), h - 1)
  if (T0 <= tMax) {
    ctx.fillText('+T₀', xt(T0), h - 1)
    ctx.fillText('−T₀', xt(-T0), h - 1)
  }

  ctx.textAlign = 'right'
  ctx.fillText('1', PAD_X - 3, yv(1) + 3)
  ctx.fillText('0', PAD_X - 3, yZero + 3)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`τ = 1 (σταθερό), T₀ = ${T0.toFixed(1)}`, PAD_X + 6, PAD_Y + 12)
}

function drawFreq(canvas: HTMLCanvasElement, colors: ThemeColors, T0: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const fMax = 6
  const fMin = -fMax
  const yMax = 1.15

  const xt = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.4, PAD_Y, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // The continuous curve "emerging": a filled area under the shape whose opacity
  // grows with T₀ — at large T₀ the dense lines read as one continuous curve.
  const STEPS = 400
  const fillAlpha = Math.max(0, Math.min(0.3, ((T0 - 3) / 9) * 0.3))
  if (fillAlpha > 0.001) {
    ctx.fillStyle = `rgba(${accentRgb}, ${fillAlpha})`
    ctx.beginPath()
    ctx.moveTo(xt(fMin), yZero)
    for (let i = 0; i <= STEPS; i++) {
      const f = lerp(i, 0, STEPS, fMin, fMax)
      const env = Math.max(0, sinc(f))
      ctx.lineTo(xt(f), yv(env))
    }
    ctx.lineTo(xt(fMax), yZero)
    ctx.closePath()
    ctx.fill()
  }

  // The fixed shape (sinc), light solid — the curve the lines fill in.
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const x = xt(f)
    const y = yv(sinc(f))
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // Discrete lines at f = k/T₀ (up to the shape). Single colour, no height labels.
  const kMax = Math.ceil(fMax * T0) + 1
  ctx.strokeStyle = colors.accent
  ctx.fillStyle = colors.accent
  ctx.lineWidth = T0 > 8 ? 0.8 : 1.3
  for (let k = -kMax; k <= kMax; k++) {
    const f = k / T0
    if (f < fMin || f > fMax) continue
    const x = xt(f)
    const y = yv(sinc(f))
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x, y, T0 > 8 ? 1.2 : 1.8, 0, Math.PI * 2)
    ctx.fill()
  }

  // Δf = 1/T₀ bracket below the axis, between f = 0 and f = 1/T₀ — the star: it
  // visibly narrows as T₀ grows.
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

  // f ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const fk of [-4, -2, 2, 4]) {
    ctx.fillText(`${fk}`, xt(fk), h - 2)
  }
}
