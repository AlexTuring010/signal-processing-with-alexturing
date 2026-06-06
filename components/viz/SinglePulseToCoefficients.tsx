'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * FT §2.1 — the "in words" process made interactive:
 *   one pulse x₀(t)  →  its FT X₀(f) (a smooth curve)  →  repeat every T₀  →
 *   the FS coefficients are that curve SAMPLED at f = k/T₀, divided by T₀:
 *       aₖ = X₀(k/T₀) / T₀.
 *
 * Two knobs the reader can play with:
 *   - τ  (pulse width): reshapes X₀(f) = τ·sinc(fτ).
 *   - T₀ (period): sets the sampling step 1/T₀ (and the ÷T₀ scaling).
 *
 * On the spectrum: the open dots sit ON X₀ at the harmonics (the samples
 * X₀(k/T₀)); a dashed drop shows the ÷T₀; the filled stems are the resulting
 * coefficients aₖ. (The deeper "why ÷T₀ = averaging / two heights" view is the
 * separate FtAsSampledFsEnvelope further down §2.1.)
 */

const TAU_MIN = 0.4
const TAU_MAX = 1.5
const T0_MIN = 2
const T0_MAX = 6

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}

function X0(f: number, tau: number) {
  return tau * sinc(f * tau)
}

export function SinglePulseToCoefficients() {
  const [tau, setTau] = useState(1)
  const [T0, setT0] = useState(3)
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, tau, T0)
    if (freqRef.current) drawFreq(freqRef.current, colors, tau, T0)
  }, [tau, T0])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Ένας παλμός → FT → δειγματοληψία ÷ T₀ = οι συντελεστές aₖ
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Αριστερά ένας <strong>μόνο</strong> παλμός <span className="font-mono">x₀(t)</span> (και,
        αχνά, τα periodic αντίγραφά του ανά <span className="font-mono">T₀</span>). Δεξιά ο FT του,{' '}
        <span className="font-mono">X₀(f)</span> — μια <strong>συνεχής</strong> καμπύλη. Οι FS
        συντελεστές είναι αυτή η καμπύλη <strong>δειγματισμένη</strong> στα{' '}
        <span className="font-mono">f = k/T₀</span> (ανοιχτές κουκκίδες), <strong>διά T₀</strong>{' '}
        (η διακεκομμένη πτώση) = οι <strong>γεμάτες στήλες</strong> <span className="font-mono">aₖ</span>.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="ένας παλμός (+ αχνά periodic αντίγραφα)">
          <canvas ref={timeRef} style={{ height: 188 }} className="block h-[188px] w-full" aria-label="A single pulse and its faint periodic repetitions" />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="X₀(f) δειγματισμένη στα k/T₀, ÷ T₀">
          <canvas ref={freqRef} style={{ height: 188 }} className="block h-[188px] w-full" aria-label="X0(f) sampled at the harmonics and divided by T0 to give the coefficients" />
        </Panel>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            πλάτος παλμού τ = <span className="font-mono text-fg tabular-nums">{tau.toFixed(2)}</span>{' '}
            <span className="text-fg-subtle">(σχηματίζει το X₀)</span>
          </label>
          <input type="range" min={TAU_MIN} max={TAU_MAX} step={0.05} value={tau} onChange={(e) => setTau(parseFloat(e.target.value))} className="mt-1 w-full accent-[rgb(var(--accent))]" aria-label="Pulse width tau" />
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
        Άλλαξε το <span className="font-mono">τ</span> και αλλάζει η <strong>μορφή</strong> της{' '}
        <span className="font-mono">X₀</span> (στενός παλμός → πλατιά <span className="font-mono">X₀</span>).
        Άλλαξε το <span className="font-mono">T₀</span> και αλλάζει <strong>πού πέφτουν τα δείγματα</strong>{' '}
        (στα <span className="font-mono">k/T₀</span>) και πόσο τα μικραίνει το{' '}
        <span className="font-mono">÷T₀</span>. Πάντα όμως: <span className="font-mono">aₖ = X₀(k/T₀)/T₀</span>.
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

function drawTime(canvas: HTMLCanvasElement, colors: ThemeColors, tau: number, T0: number) {
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

  const drawPulse = (center: number, faint: boolean) => {
    const a = center - tau / 2
    const b = center + tau / 2
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
  for (let k = -3; k <= 3; k++) if (k !== 0) drawPulse(k * T0, true)
  drawPulse(0, false)

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  if (T0 <= tDom) {
    ctx.fillText('T₀', (xt(0) + xt(T0)) / 2, yZero + 12)
  }
  ctx.fillText('0', xt(0), yZero + 12)
}

function drawFreq(canvas: HTMLCanvasElement, colors: ThemeColors, tau: number, T0: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const fDom = 6
  const yMax = TAU_MAX * 1.18
  const xt = (f: number) => lerp(f, -fDom, fDom, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.45, PAD_Y, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  // X₀(f) continuous curve
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1.4
  ctx.beginPath()
  const STEPS = 600
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -fDom, fDom)
    const x = xt(f)
    const y = yv(X0(f, tau))
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('X₀(f)', xt(0) + 4, yv(X0(0, tau)) - 3)

  // samples at f = k/T₀: open dot on X₀, dashed ÷T₀ drop, filled aₖ stem
  const kMax = Math.ceil(fDom * T0) + 1
  for (let k = -kMax; k <= kMax; k++) {
    const f = k / T0
    if (Math.abs(f) > fDom) continue
    const x = xt(f)
    const samp = X0(f, tau)
    const ak = samp / T0
    // dashed ÷T₀ connector
    ctx.strokeStyle = `rgba(${accentRgb}, 0.4)`
    ctx.setLineDash([2, 2])
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(x, yv(samp))
    ctx.lineTo(x, yv(ak))
    ctx.stroke()
    ctx.setLineDash([])
    // aₖ stem
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
    // dot ON X₀ (the sample being read off the curve)
    ctx.fillStyle = colors.fgMuted
    ctx.beginPath()
    ctx.arc(x, yv(samp), 2.4, 0, Math.PI * 2)
    ctx.fill()
  }

  // legend
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('● δείγμα στο X₀(k/T₀)', PAD_X + 2, PAD_Y + 8)
  ctx.fillStyle = colors.accent
  ctx.fillText('| aₖ = δείγμα ÷ T₀', PAD_X + 2, PAD_Y + 21)
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'center'
  ctx.fillText('f', w - PAD_X + 2, yZero - 4)
}
