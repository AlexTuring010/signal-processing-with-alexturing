'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * FT §2.1 (coda) — "the repeated piece is your choice".
 *
 * Same recipe as SinglePulseToCoefficients, but the piece you repeat is now TWO
 * copies of the rect (a fixed double pulse). Its FT X₀ is a different envelope,
 * yet the recipe is unchanged: repeat every T₀, sample at k/T₀, divide by T₀.
 *
 * Only ONE knob — T₀ (the period). The two copies are a FIXED shape (separation
 * D): changing their spacing would make it a different signal, so it is not a
 * control here. The point is simply: a different repeated piece → a different
 * envelope, same recipe.
 */

const TAU = 0.7 // each rect's width (fixed)
const D = 2 // separation between the two copies (fixed)
const T0_MIN = 3
const T0_MAX = 8

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}

// FT of two rects of width τ centered at ±D/2
function X0(f: number) {
  return 2 * TAU * sinc(f * TAU) * Math.cos(Math.PI * f * D)
}

export function TwoPulsesToCoefficients() {
  const [T0, setT0] = useState(4)
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
        Δύο αντίγραφα ενός rect → δειγματοληψία ÷ T₀: η ίδια συνταγή
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Τώρα το κομμάτι που επαναλαμβάνεται είναι <strong>δύο αντίγραφα</strong> του rect. Ο FT τους —
        η περιβάλλουσα <span className="font-mono">X₀(f)</span> — έχει άλλο σχήμα, αλλά η συνταγή είναι
        ίδια: δείγματα στα <span className="font-mono">k/T₀</span> (ανοιχτές κουκκίδες),{' '}
        <strong>διά T₀</strong> = οι <strong>γεμάτες στήλες</strong> <span className="font-mono">aₖ</span>.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="δύο αντίγραφα (+ αχνά periodic αντίγραφα ανά T₀)">
          <canvas ref={timeRef} style={{ height: 188 }} className="block h-[188px] w-full" aria-label="A fixed double pulse and its faint periodic repetitions" />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="X₀(f) δειγματισμένη στα k/T₀, ÷ T₀">
          <canvas ref={freqRef} style={{ height: 188 }} className="block h-[188px] w-full" aria-label="Envelope X0(f) sampled at the harmonics and divided by T0" />
        </Panel>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          περίοδος T₀ = <span className="font-mono text-fg tabular-nums">{T0.toFixed(1)}</span>{' '}
          <span className="text-fg-subtle">(βήμα δειγμάτων 1/T₀ = {(1 / T0).toFixed(2)})</span>
        </label>
        <input type="range" min={T0_MIN} max={T0_MAX} step={0.1} value={T0} onChange={(e) => setT0(parseFloat(e.target.value))} className="mt-1 w-full accent-[rgb(var(--accent))]" aria-label="Period T0" />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Σύρε το <span className="font-mono">T₀</span>: τα δείγματα μετακινούνται (στα{' '}
        <span className="font-mono">k/T₀</span>) και το <span className="font-mono">÷T₀</span> τα
        χαμηλώνει — ακριβώς όπως με έναν παλμό. Το μόνο που άλλαξε είναι το{' '}
        <strong>σχήμα</strong> της <span className="font-mono">X₀</span>, επειδή άλλαξε το κομμάτι που
        επαναλαμβάνεις.
      </div>
    </figure>
  )
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
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
  const tDom = 7
  const xt = (t: number) => lerp(t, -tDom, tDom, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, 1.35, -0.4, PAD_Y, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  const drawRect = (center: number, faint: boolean) => {
    const a = center - TAU / 2
    const b = center + TAU / 2
    if (b < -tDom || a > tDom) return
    const xL = xt(Math.max(a, -tDom))
    const xR = xt(Math.min(b, tDom))
    const yT = yv(1)
    if (faint) {
      ctx.fillStyle = `rgba(${accentRgb}, 0.10)`
      ctx.strokeStyle = `rgba(${accentRgb}, 0.4)`
      ctx.lineWidth = 1
    } else {
      ctx.fillStyle = `rgba(${accentRgb}, 0.22)`
      ctx.strokeStyle = colors.accent
      ctx.lineWidth = 1.8
    }
    ctx.fillRect(xL, yT, xR - xL, yZero - yT)
    ctx.strokeRect(xL, yT, xR - xL, yZero - yT)
  }

  // faint periodic copies of the double-pulse cell, every T₀
  for (let k = -3; k <= 3; k++) {
    if (k === 0) continue
    drawRect(-D / 2 + k * T0, true)
    drawRect(D / 2 + k * T0, true)
  }
  // the repeated piece: two copies at ±D/2
  drawRect(-D / 2, false)
  drawRect(D / 2, false)

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  if (T0 <= tDom) {
    ctx.fillText('T₀', (xt(D / 2) + xt(D / 2 + T0)) / 2, yZero + 12)
  }
}

function drawFreq(canvas: HTMLCanvasElement, colors: ThemeColors, T0: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const fDom = 6
  const yMax = 2 * TAU * 1.25
  const xt = (f: number) => lerp(f, -fDom, fDom, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.7, PAD_Y, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  // X₀(f) envelope
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1.4
  ctx.beginPath()
  const STEPS = 700
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -fDom, fDom)
    const x = xt(f)
    const y = yv(X0(f))
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('X₀(f)', xt(0) + 4, yv(X0(0)) - 3)

  // samples at f = k/T₀: open dot on X₀, dashed ÷T₀ drop, filled aₖ stem
  const kMax = Math.ceil(fDom * T0) + 1
  for (let k = -kMax; k <= kMax; k++) {
    const f = k / T0
    if (Math.abs(f) > fDom) continue
    const x = xt(f)
    const samp = X0(f)
    const ak = samp / T0
    ctx.strokeStyle = `rgba(${accentRgb}, 0.4)`
    ctx.setLineDash([2, 2])
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x, yv(samp))
    ctx.lineTo(x, yv(ak))
    ctx.stroke()
    ctx.setLineDash([])
    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 1.8
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, yv(ak))
    ctx.stroke()
    ctx.fillStyle = colors.accent
    ctx.beginPath()
    ctx.arc(x, yv(ak), 2.4, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = colors.fgMuted
    ctx.beginPath()
    ctx.arc(x, yv(samp), 2.4, 0, Math.PI * 2)
    ctx.fill()
  }

  // legend
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('● δείγμα X₀(k/T₀)', PAD_X + 2, PAD_Y + 8)
  ctx.fillStyle = colors.accent
  ctx.fillText('| aₖ = δείγμα ÷ T₀', PAD_X + 2, PAD_Y + 21)
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'center'
  ctx.fillText('f', w - PAD_X + 2, yZero - 4)
}
