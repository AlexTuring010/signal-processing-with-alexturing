'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * FT §2.1 (coda) — "the generator can be anything".
 *
 * Same recipe as SinglePulseToCoefficients, but the generator is now TWO rects
 * (a double pulse, separation d). Two copies interfere, so the envelope is the
 * single-rect sinc wearing a cosine ripple:
 *      X₀(f) = 2τ · sinc(fτ) · cos(πf·d).
 * The ripple makes "bumps" start to appear — the seed of the impulses §2.2 builds.
 * The recipe is unchanged: repeat every T₀, and aₖ = X₀(k/T₀)/T₀.
 *
 * Two knobs:
 *   - d  (separation): sets the ripple — bigger d → finer ripple (more bumps).
 *   - T₀ (period): sets the sampling step 1/T₀ and the ÷T₀ scaling.
 */

const TAU = 0.7 // each rect's width (fixed)
const D_MIN = 1.0
const D_MAX = 2.6
const T0_MIN = 3.4
const T0_MAX = 8

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}

// FT of two rects of width τ centered at ±d/2 — a rippled sinc.
function X0(f: number, d: number) {
  return 2 * TAU * sinc(f * TAU) * Math.cos(Math.PI * f * d)
}

export function TwoPulsesToCoefficients() {
  const [d, setD] = useState(1.8)
  const [T0, setT0] = useState(4)
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, d, T0)
    if (freqRef.current) drawFreq(freqRef.current, colors, d, T0)
  }, [d, T0])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Δύο rect → FT → δειγματοληψία ÷ T₀: η ίδια συνταγή για άλλον γεννήτορα
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Ο γεννήτορας τώρα είναι <strong>δύο</strong> rect (απόσταση{' '}
        <span className="font-mono">d</span>). Τα δύο αντίγραφα{' '}
        <strong>συμβάλλουν</strong>, οπότε ο FT τους είναι το γνωστό sinc{' '}
        <strong>με κυματισμό</strong>: <span className="font-mono">X₀(f) = 2τ·sinc(fτ)·cos(πfd)</span>{' '}
        — εμφανίζονται «καμπανάκια». Η συνταγή όμως δεν αλλάζει:{' '}
        <span className="font-mono">aₖ = X₀(k/T₀)/T₀</span> (ανοιχτές κουκκίδες ÷ T₀ = γεμάτες στήλες).
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="δύο rect (+ αχνά periodic αντίγραφα ανά T₀)">
          <canvas ref={timeRef} style={{ height: 188 }} className="block h-[188px] w-full" aria-label="A two-rect generator and its faint periodic repetitions" />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="X₀(f) με κυματισμό, δειγματισμένη ÷ T₀">
          <canvas ref={freqRef} style={{ height: 188 }} className="block h-[188px] w-full" aria-label="Rippled envelope X0(f) sampled at the harmonics and divided by T0" />
        </Panel>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            απόσταση d = <span className="font-mono text-fg tabular-nums">{d.toFixed(2)}</span>{' '}
            <span className="text-fg-subtle">(σχηματίζει τον κυματισμό)</span>
          </label>
          <input type="range" min={D_MIN} max={D_MAX} step={0.05} value={d} onChange={(e) => setD(parseFloat(e.target.value))} className="mt-1 w-full accent-[rgb(var(--accent))]" aria-label="Separation d" />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            περίοδος T₀ = <span className="font-mono text-fg tabular-nums">{T0.toFixed(1)}</span>{' '}
            <span className="text-fg-subtle">(βήμα δειγμάτων 1/T₀ = {(1 / T0).toFixed(2)})</span>
          </label>
          <input type="range" min={T0_MIN} max={T0_MAX} step={0.1} value={T0} onChange={(e) => setT0(parseFloat(e.target.value))} className="mt-1 w-full accent-[rgb(var(--accent))]" aria-label="Period T0" />
        </div>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Άλλαξε το <span className="font-mono">d</span>: ο <strong>κυματισμός</strong> της{' '}
        <span className="font-mono">X₀</span> πυκνώνει (μακρύτερα τα rect → πιο στενά «καμπανάκια»).
        Άλλαξε το <span className="font-mono">T₀</span>: μετακινούνται τα δείγματα (στα{' '}
        <span className="font-mono">k/T₀</span>) και αλλάζει το <span className="font-mono">÷T₀</span>.
        Συμπέρασμα: ο γεννήτορας μπορεί να είναι <strong>ο,τιδήποτε</strong> — η περιβάλλουσα{' '}
        <span className="font-mono">X₀</span> είναι απλώς ο FT του, και διαιρείς με την{' '}
        <strong>περίοδο που εσύ διάλεξες</strong>.
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

function drawTime(canvas: HTMLCanvasElement, colors: ThemeColors, d: number, T0: number) {
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

  // faint periodic copies of the whole double-pulse cell, every T₀
  for (let k = -3; k <= 3; k++) {
    if (k === 0) continue
    drawRect(-d / 2 + k * T0, true)
    drawRect(d / 2 + k * T0, true)
  }
  // the generator: two rects at ±d/2
  drawRect(-d / 2, false)
  drawRect(d / 2, false)

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  // d brace between the two centers
  if (d / 2 <= tDom) {
    ctx.fillText('d', 0 + xt(0), yv(1) - 5)
    ctx.strokeStyle = colors.fgSubtle
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(xt(-d / 2), yv(1.12))
    ctx.lineTo(xt(d / 2), yv(1.12))
    ctx.stroke()
  }
  if (T0 <= tDom) {
    ctx.fillText('T₀', (xt(d / 2) + xt(d / 2 + T0)) / 2, yZero + 12)
  }
}

function drawFreq(canvas: HTMLCanvasElement, colors: ThemeColors, d: number, T0: number) {
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

  // X₀(f) rippled-sinc envelope
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1.4
  ctx.beginPath()
  const STEPS = 700
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -fDom, fDom)
    const x = xt(f)
    const y = yv(X0(f, d))
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('X₀(f)', xt(0) + 4, yv(X0(0, d)) - 3)

  // samples at f = k/T₀: open dot on X₀, dashed ÷T₀ drop, filled aₖ stem
  const kMax = Math.ceil(fDom * T0) + 1
  for (let k = -kMax; k <= kMax; k++) {
    const f = k / T0
    if (Math.abs(f) > fDom) continue
    const x = xt(f)
    const samp = X0(f, d)
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
