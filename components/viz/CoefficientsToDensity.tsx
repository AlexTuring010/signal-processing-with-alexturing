'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * "Amount-per-line vanishes, density survives", for FT §1.
 *
 * The crux that turns the ×T₀ move from a trick into the obvious thing. For a
 * periodic signal the spectrum is lines at fₖ = k/T₀ with spacing Δf = 1/T₀.
 * As T₀ grows:
 *   - TOP panel — the raw coefficients aₖ = X(fₖ)·Δf both CROWD together and
 *     SINK toward zero (aₖ is an average; spread over more emptiness it dilutes).
 *   - BOTTOM panel — the rescaled T₀·aₖ = aₖ/Δf = X(fₖ) crowd together but LOCK
 *     onto a fixed continuous curve X(f). That curve is the DENSITY (amount per
 *     unit frequency), and it is what survives the limit → the Fourier transform.
 *
 * Multiplying by T₀ = dividing by Δf = converting "amount in one bin" into
 * "amount per unit frequency", exactly like a histogram → a density curve.
 *
 * X(f) is shown as a smooth real bump (we picture a real-even signal so heights
 * are real); the message is the limit mechanism, not a specific named signal.
 */

const T0_MIN = 1
const T0_MAX = 10
const F_MAX = 4
const W = 2.2 // density width

// Density X(f): a smooth, real, even "bump". Picture the spectrum of a real-even signal.
function X(f: number) {
  return Math.exp(-Math.PI * (f / W) * (f / W))
}

export function CoefficientsToDensity() {
  const [T0, setT0] = useState(2.5)
  const topRef = useRef<HTMLCanvasElement | null>(null)
  const botRef = useRef<HTMLCanvasElement | null>(null)
  const df = 1 / T0
  const a0 = X(0) * df // = X(0)/T₀
  const dens0 = X(0) // = T₀·a₀

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (topRef.current) drawTop(topRef.current, colors, T0)
    if (botRef.current) drawBottom(botRef.current, colors, T0)
  }, [T0])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Τα aₖ βυθίζονται· η πυκνότητα T₀·aₖ κλειδώνει στο X(f)
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Ίδιο σήμα, μεγαλώνει η περίοδος <span className="font-mono">T₀</span>. Οι γραμμές
        είναι στις <span className="font-mono">fₖ = k/T₀</span>, με απόσταση{' '}
        <span className="font-mono">Δf = 1/T₀</span>.{' '}
        <strong>Πάνω</strong>: τα σκέτα <span className="font-mono">aₖ</span> (ποσό{' '}
        <em>ανά γραμμή</em>) πυκνώνουν <strong>και βυθίζονται</strong> προς το 0.{' '}
        <strong>Κάτω</strong>: τα <span className="font-mono">T₀·aₖ = aₖ/Δf</span> (ποσό{' '}
        <em>ανά μονάδα συχνότητας</em> — η <strong>πυκνότητα</strong>) πυκνώνουν αλλά{' '}
        <strong>κάθονται πάνω σε μια σταθερή καμπύλη</strong> <span className="font-mono">X(f)</span>.
      </p>

      <div className="grid gap-3">
        <Panel
          title="ποσό ανά γραμμή:  aₖ = X(fₖ)·Δf"
          subtitle="σταθερός κάθετος άξονας → δες τα να βυθίζονται"
        >
          <canvas
            ref={topRef}
            style={{ height: 150 }}
            className="block h-[150px] w-full"
            aria-label="Raw Fourier coefficients sinking toward zero as the period grows"
          />
        </Panel>
        <Panel
          title="πυκνότητα:  T₀·aₖ = aₖ/Δf = X(fₖ)"
          subtitle="κλειδώνουν πάνω στη σταθερή X(f) — αυτή επιβιώνει"
        >
          <canvas
            ref={botRef}
            style={{ height: 150 }}
            className="block h-[150px] w-full"
            aria-label="Rescaled coefficients locking onto a fixed continuous density curve X(f)"
          />
        </Panel>
      </div>

      <div className="mt-3 rounded-md border border-border bg-bg p-3">
        <label className="block text-xs text-fg-muted">
          Περίοδος T₀ ={' '}
          <span className="font-mono text-fg tabular-nums">{T0.toFixed(1)}</span>
          <span className="ml-3 text-fg-subtle">
            Δf = 1/T₀ ={' '}
            <span className="font-mono text-fg tabular-nums">{df.toFixed(3)}</span> Hz
          </span>
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
        <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
          <div className="rounded-md border border-border bg-bg-elevated p-2">
            <span className="text-fg-muted">ανά γραμμή </span>
            <span className="font-mono">a₀ = X(0)/T₀</span> ={' '}
            <span className="font-mono font-semibold tabular-nums text-[rgb(var(--danger))]">
              {a0.toFixed(3)}
            </span>{' '}
            <span className="text-fg-subtle">→ 0</span>
          </div>
          <div className="rounded-md border border-border bg-bg-elevated p-2">
            <span className="text-fg-muted">πυκνότητα </span>
            <span className="font-mono">T₀·a₀ = X(0)</span> ={' '}
            <span
              className="font-mono font-semibold tabular-nums"
              style={{ color: 'rgb(var(--accent))' }}
            >
              {dens0.toFixed(3)}
            </span>{' '}
            <span className="text-fg-subtle">σταθερό</span>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Ο πολλαπλασιασμός με <span className="font-mono">T₀</span> δεν «διώχνει μια
        ενόχληση»: είναι <strong>διαίρεση με το Δf</strong>, δηλαδή μετατροπή του «ποσό σε
        ένα bin» σε «<strong>ποσό ανά μονάδα συχνότητας</strong>» — το μόνο μέγεθος με
        πεπερασμένο όριο όταν τα bins συγχωνεύονται. Στο όριο{' '}
        <span className="font-mono">T₀ → ∞</span>, η κάτω καμπύλη <em>είναι</em> ο
        μετασχηματισμός Fourier <span className="font-mono">X(f)</span>.
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
        <span className="font-mono text-[10px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

const PAD_X = 30
const PAD_Y = 14

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}

function frameAxis(
  ctx: CanvasRenderingContext2D,
  colors: ThemeColors,
  w: number,
  h: number,
  xt: (f: number) => number,
  yZero: number,
) {
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 6, yZero)
  ctx.lineTo(w - PAD_X + 6, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y - 2)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const fk of [-2, 2]) ctx.fillText(`${fk}`, xt(fk), h - 2)
  ctx.textAlign = 'right'
  ctx.fillText('f', w - PAD_X + 4, yZero - 3)
}

// TOP: raw aₖ = X(fₖ)·Δf, fixed vertical scale so the sinking is visible.
function drawTop(canvas: HTMLCanvasElement, colors: ThemeColors, T0: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const df = 1 / T0
  const yTopMax = X(0) / T0_MIN // largest possible a₀ (at T₀ = 1)
  const xt = (f: number) => lerp(f, -F_MAX, F_MAX, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yTopMax * 1.08, -yTopMax * 0.12, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  frameAxis(ctx, colors, w, h, xt, yZero)

  const danger = getRGB(colors.danger)
  ctx.strokeStyle = `rgb(${danger})`
  ctx.fillStyle = `rgb(${danger})`
  ctx.lineWidth = T0 > 6 ? 1 : 1.5
  const kMax = Math.ceil(F_MAX / df) + 1
  for (let k = -kMax; k <= kMax; k++) {
    const f = k * df
    if (Math.abs(f) > F_MAX) continue
    const ak = X(f) * df
    const x = xt(f)
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, yv(ak))
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x, yv(ak), T0 > 6 ? 1.5 : 2.2, 0, 2 * Math.PI)
    ctx.fill()
  }

  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('aₖ', PAD_X + 4, PAD_Y + 6)
}

// BOTTOM: T₀·aₖ = X(fₖ) on the fixed density curve X(f).
function drawBottom(canvas: HTMLCanvasElement, colors: ThemeColors, T0: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const df = 1 / T0
  const yMax = X(0)
  const xt = (f: number) => lerp(f, -F_MAX, F_MAX, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax * 1.08, -yMax * 0.12, PAD_Y, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  // Fixed density curve X(f) behind the stems (filled, faint).
  const STEPS = 360
  ctx.fillStyle = `rgba(${accentRgb}, 0.12)`
  ctx.beginPath()
  ctx.moveTo(xt(-F_MAX), yZero)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_MAX, F_MAX)
    ctx.lineTo(xt(f), yv(X(f)))
  }
  ctx.lineTo(xt(F_MAX), yZero)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.6
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_MAX, F_MAX)
    const y = yv(X(f))
    if (i === 0) ctx.moveTo(xt(f), y)
    else ctx.lineTo(xt(f), y)
  }
  ctx.stroke()

  frameAxis(ctx, colors, w, h, xt, yZero)

  // Stems T₀·aₖ = X(fₖ) sitting exactly on the curve.
  ctx.strokeStyle = colors.accent
  ctx.fillStyle = colors.accent
  ctx.lineWidth = T0 > 6 ? 1 : 1.5
  const kMax = Math.ceil(F_MAX / df) + 1
  for (let k = -kMax; k <= kMax; k++) {
    const f = k * df
    if (Math.abs(f) > F_MAX) continue
    const x = xt(f)
    const y = yv(X(f))
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x, y, T0 > 6 ? 1.5 : 2.2, 0, 2 * Math.PI)
    ctx.fill()
  }

  ctx.fillStyle = colors.accent
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('X(f)', PAD_X + 4, PAD_Y + 6)
}
