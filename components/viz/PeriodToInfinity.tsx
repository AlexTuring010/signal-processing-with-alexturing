'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * FS → FT bridge: time-domain pulse train + frequency-domain spectrum showing
 * BOTH heights of each harmonic, driven by a single T₀ slider.
 *
 * Left panel: periodic rectangular pulse train. Pulse shape (width τ = 1) is
 * fixed; only the period T₀ changes — pulses get pushed apart as T₀ grows.
 *
 * Right panel (slide-13 style + the raw coefficient marked): at each harmonic
 * f = k/T₀ a stem rises to the fixed envelope X₀(f) = sinc(f) — its tip is the
 * TOTAL T₀·aₖ, which stays at constant height and "fills in" the continuous
 * X(f) as the lines densify (exactly what lecture slide 13 draws). A lower
 * mauve dot marks the RAW coefficient aₖ = X₀(k/T₀)/T₀, which SINKS toward the
 * axis as T₀ grows — the averaging (a₀ is the signal's mean; a lone pulse
 * spread over a longer period averages to less).
 *
 * The pedagogical point (this is exactly where students misread the page):
 * both quantities live at the same harmonic but at DIFFERENT heights. The
 * constant-height tips (totals) fill X(f); the raw aₖ (mauve, sinking) do not.
 * Hence T₀·aₖ → X(f), not aₖ → X(f). Unpacked as "average vs total" in §2.1.
 */

const T_MIN = 1.5
const T_MAX = 12
const TAU = 1 // fixed pulse width

export function PeriodToInfinity() {
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
        T₀ → ∞: από Fourier series σε Fourier transform
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Αριστερά ο periodic παλμός — σταθερό σχήμα <span className="font-mono">τ = 1</span>,
        μεταβλητή περίοδος <span className="font-mono">T₀</span>. Δεξιά το φάσμα, με τα{' '}
        <strong>δύο ύψη</strong> κάθε αρμονικής. Σύρε το <span className="font-mono">T₀</span>:
        οι <strong>κορυφές</strong> των γραμμών μένουν πάνω σε μια σταθερή καμπύλη και απλώς
        πυκνώνουν — αυτά είναι τα <strong>σύνολα</strong> (το{' '}
        <span className="font-mono">T₀·aₖ</span>) που «γεμίζουν» την{' '}
        <span className="font-mono">X(f)</span>, ακριβώς όπως στη διάλεξη. Η χαμηλή{' '}
        <span style={{ color: '#7c3aed' }} className="font-semibold">μωβ κουκκίδα</span> σε κάθε
        γραμμή είναι ο σκέτος συντελεστής <span className="font-mono">aₖ</span> — κι αυτός{' '}
        <strong>χαμηλώνει</strong> προς το μηδέν (ο μέσος όρος ενός μοναχικού παλμού,
        απλωμένου σε ολοένα μεγαλύτερη περίοδο, μικραίνει).
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="periodic παλμός, σταθερό σχήμα">
          <canvas
            ref={timeRef}
            style={{ height: 180 }}
            className="block h-[180px] w-full"
            aria-label="Periodic rectangular pulse train"
          />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="κορυφές = σύνολα (γεμίζουν) · μωβ = aₖ">
          <canvas
            ref={freqRef}
            style={{ height: 180 }}
            className="block h-[180px] w-full"
            aria-label="Discrete spectrum lines on a fixed sinc envelope"
          />
        </Panel>
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          T₀ ={' '}
          <span className="font-mono text-fg tabular-nums">{T0.toFixed(1)}</span>
          {' · '}
          απόσταση γραμμών 1/T₀ ={' '}
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
        Το κλειδί — κάθε αρμονική έχει <strong>δύο ύψη</strong>. Η <strong>κορυφή</strong>{' '}
        (σύνολο, <span className="font-mono">T₀·aₖ</span>) μένει πάνω στη σταθερή καμπύλη και τη
        «γεμίζει» καθώς οι γραμμές πυκνώνουν — αυτό το σταθερό σχήμα είναι η{' '}
        <span className="font-mono">X(f)</span>. Η{' '}
        <span style={{ color: '#7c3aed' }} className="font-semibold">μωβ κουκκίδα</span> (ο σκέτος{' '}
        <span className="font-mono">aₖ</span>) χαμηλώνει προς το μηδέν, γιατί είναι μέσος όρος —
        κι ο μέσος όρος ενός σπάνιου παλμού σβήνει.
        <span className="mt-1.5 block text-fg-muted">
          Άρα αυτό που «γεμίζει» την <span className="font-mono">X(f)</span> είναι τα σύνολα:{' '}
          <span className="font-mono">T₀·aₖ → X(f)</span>, όχι{' '}
          <span className="font-mono">aₖ → X(f)</span>. Η πλήρης εξήγηση —{' '}
          <strong>μέσος όρος vs σύνολο</strong> — έρχεται αμέσως στο §2.1 του επόμενου κεφαλαίου.
        </span>
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

function drawTime(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  T0: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Fixed time window so the visual contrast (dense at small T₀, sparse at
  // large T₀) is preserved.
  const tMax = 12
  const tMin = -tMax
  const yLim = 1.4

  const xt = (t: number) => lerp(t, tMin, tMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -0.4, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // X axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()
  // Y axis at t = 0
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // Pulses centred at k·T₀, each width τ = 1.
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

  // Tick labels — 0, ±T₀, ±2T₀ where they fit
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), h - 1)
  if (T0 <= tMax) {
    ctx.fillText('+T₀', xt(T0), h - 1)
    ctx.fillText('−T₀', xt(-T0), h - 1)
  }
  if (2 * T0 <= tMax) {
    ctx.fillText('+2T₀', xt(2 * T0), h - 1)
    ctx.fillText('−2T₀', xt(-2 * T0), h - 1)
  }

  // Y ticks
  ctx.textAlign = 'right'
  ctx.fillText('1', PAD_X - 3, yv(1) + 3)
  ctx.fillText('0', PAD_X - 3, yZero + 3)

  // Legend
  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(
    `τ = 1 (σταθερό), T₀ = ${T0.toFixed(1)}`,
    PAD_X + 6,
    PAD_Y + 12,
  )
}

function drawFreq(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  T0: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const fMax = 6
  const fMin = -fMax
  const yMax = 1.15

  const xt = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -0.4, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // X axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()
  // Y axis at f = 0
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // Continuous envelope sinc(f) — the FT of a single τ = 1 rectangle.
  // This curve is independent of T₀ — that's the whole point.
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  const STEPS = 400
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const env = f === 0 ? 1 : Math.sin(Math.PI * f) / (Math.PI * f)
    const x = xt(f)
    const y = yv(env)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // Per harmonic at f = k/T₀, show BOTH heights (slide-13 style + the raw aₖ):
  //  - stem from axis up to the envelope X₀(kf₀) = the TOTAL (T₀·aₖ); its tip
  //    sits on the fixed curve and "fills in" X(f) as the lines densify.
  //  - a lower mauve dot at aₖ = X₀(kf₀)/T₀ = the raw coefficient, which SINKS
  //    toward the axis as T₀ grows (averaging). Same mauve as FtAsSampledFsEnvelope.
  const kMax = Math.ceil(fMax * T0) + 1
  const totalColor = colors.accent
  const akColor = '#7c3aed'
  const dotR = T0 > 8 ? 1.4 : 2
  for (let k = -kMax; k <= kMax; k++) {
    const f = k / T0
    if (f < fMin || f > fMax) continue
    const env = f === 0 ? 1 : Math.sin(Math.PI * f) / (Math.PI * f) // X₀(kf₀) = T₀·aₖ
    const ak = env / T0
    const x = xt(f)
    const yTot = yv(env)
    const yAk = yv(ak)
    // stem to the total (its tip fills the fixed envelope)
    ctx.strokeStyle = totalColor
    ctx.lineWidth = T0 > 8 ? 0.8 : 1.2
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, yTot)
    ctx.stroke()
    // tip dot = total T₀·aₖ (on the envelope)
    ctx.fillStyle = totalColor
    ctx.beginPath()
    ctx.arc(x, yTot, dotR, 0, Math.PI * 2)
    ctx.fill()
    // lower dot = raw coefficient aₖ (÷T₀), sinks as T₀ grows
    ctx.fillStyle = akColor
    ctx.beginPath()
    ctx.arc(x, yAk, dotR, 0, Math.PI * 2)
    ctx.fill()
  }

  // Tick labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const fk of [-4, -2, 0, 2, 4]) {
    ctx.fillText(`${fk}`, xt(fk), h - 1)
  }
  ctx.textAlign = 'right'
  ctx.fillText('1', PAD_X - 3, yv(1) + 3)
  ctx.fillText('0', PAD_X - 3, yZero + 3)

  // Legend
  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('· · ·  σχήμα = X(f)', PAD_X + 6, PAD_Y + 12)
  ctx.fillStyle = colors.accent
  ctx.fillText('●| κορυφή = T₀·aₖ (σύνολα, γεμίζουν)', PAD_X + 6, PAD_Y + 26)
  ctx.fillStyle = '#7c3aed'
  ctx.fillText('● aₖ = ÷T₀ (χαμηλώνουν)', PAD_X + 6, PAD_Y + 40)
}

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}
