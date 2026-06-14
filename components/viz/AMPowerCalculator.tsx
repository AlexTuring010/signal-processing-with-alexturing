'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Conventional AM power & efficiency calculator.
 *
 * For x(t) = [A_c + A_m cos(2π f_m t)] cos(2π f_c t):
 *   P_carrier      = A_c² / 2
 *   P_each_sideband = (μ A_c)² / 8  =  μ² A_c² / 8
 *   P_total        = P_c + 2 P_sb   =  (A_c²/2)·(1 + μ²/2)
 *   Efficiency η   = (μ²/2) / (1 + μ²/2)
 *
 * Maximum efficiency (at μ=1) is η = (1/2)/(3/2) = 1/3 ≈ 33.3%.
 * That's the canonical "AM wastes 2/3 of its power" exam answer.
 *
 * The viz has two parts:
 *   - Numeric panel: input A_c and A_m, see μ and the four power values
 *   - Curve panel: η(μ) for μ ∈ [0, 1] with current point highlighted
 */

export function AMPowerCalculator() {
  const [Ac, setAc] = useState(10)
  const [Am, setAm] = useState(5)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const mu = Am / Ac
  const Pc = (Ac * Ac) / 2
  const Psb = (mu * mu * Ac * Ac) / 8 // each sideband
  const Ptot = Pc + 2 * Psb
  const eta = (mu * mu) / 2 / (1 + (mu * mu) / 2)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawCurve(canvas, colors, mu)
  }, [mu])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        AM ισχύς και efficiency calculator
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Υποθέτει <strong>single-tone</strong> message{' '}
        <span className="font-mono">m(t) = A_m·cos(2π f_m t)</span>, οπότε{' '}
        <span className="font-mono">μ = A_m / A_c</span>. Δώσε τα πλάτη carrier{' '}
        <span className="font-mono">A_c</span> και message{' '}
        <span className="font-mono">A_m</span> (V)· δείχνει το{' '}
        <span className="font-mono">μ</span>, τις ισχύεις (carrier, sidebands,
        total) και το efficiency{' '}
        <span className="font-mono">η = P_useful / P_total</span>.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-border bg-bg-soft/40 p-3">
          <div className="mb-2 text-[11px] font-semibold tracking-tight">Inputs</div>
          <div className="space-y-2">
            <label className="block text-xs text-fg-muted">
              A_c ={' '}
              <span className="font-mono text-fg tabular-nums">{Ac.toFixed(1)} V</span>
              <input
                type="range"
                min={1}
                max={20}
                step={0.5}
                value={Ac}
                onChange={(e) => setAc(parseFloat(e.target.value))}
                className="mt-1 w-full accent-[rgb(var(--accent))]"
                aria-label="Carrier amplitude A_c"
              />
            </label>
            <label className="block text-xs text-fg-muted">
              A_m ={' '}
              <span className="font-mono text-fg tabular-nums">{Am.toFixed(1)} V</span>
              <input
                type="range"
                min={0}
                max={20}
                step={0.5}
                value={Am}
                onChange={(e) => setAm(parseFloat(e.target.value))}
                className="mt-1 w-full accent-[rgb(var(--accent))]"
                aria-label="Message amplitude A_m"
              />
            </label>
          </div>

          <div className="mt-3 border-t border-border pt-2 text-xs">
            <Row label="μ = A_m / A_c" value={mu.toFixed(3)} highlight={mu > 1} />
            <Row label="P_carrier = A_c²/2" value={`${Pc.toFixed(2)} W`} />
            <Row
              label="P_sideband (each) = μ²A_c²/8"
              value={`${Psb.toFixed(3)} W`}
            />
            <Row label="P_total = P_c + 2P_sb" value={`${Ptot.toFixed(2)} W`} />
            <Row
              label="η = P_useful / P_total"
              value={`${(eta * 100).toFixed(1)}%`}
              bold
            />
          </div>

          {mu > 1 && (
            <div className="mt-2 rounded-md border border-red-400/60 bg-red-50/70 px-2 py-1 text-[11px] text-red-900 dark:border-red-400/40 dark:bg-red-400/10 dark:text-red-100">
              ⚠ μ &gt; 1: overmodulation. Στην πράξη πρέπει να κρατάς μ ≤ 1.
            </div>
          )}
        </div>

        <div className="rounded-md border border-border bg-bg-soft/40 p-3">
          <div className="mb-2 text-[11px] font-semibold tracking-tight">
            Efficiency η ως συνάρτηση του μ
          </div>
          <canvas
            ref={canvasRef}
            style={{ height: 200 }}
            className="block h-[200px] w-full"
            aria-label="Efficiency curve eta vs mu, with current operating point"
          />
          <p className="mt-2 text-[11px] text-fg-subtle">
            Η μέγιστη efficiency στην Conventional AM είναι{' '}
            <strong>33.3%</strong>, στο μ = 1. Αυτό σημαίνει ότι το{' '}
            <strong>2/3 της ισχύος πάντα σπαταλιέται στον carrier</strong>{' '}
            (που δεν κουβαλάει πληροφορία). Γι' αυτό υπάρχει το DSB-SC και
            όλες οι suppressed-carrier παραλλαγές.
          </p>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-fg-subtle">
        Ισχύει για <strong>single-tone</strong> message (ένας τόνος ⇒ ένας
        μοναδικός <span className="font-mono">μ = A_m/A_c</span>). Για message με
        πολλούς τόνους δεν υπάρχει ένας <span className="font-mono">μ</span> —
        εκεί χρησιμοποιείς τη γενική μορφή{' '}
        <span className="font-mono">η = P_m / (A_c² + P_m)</span> με{' '}
        <span className="font-mono">P_m = ⟨m²(t)⟩</span> (§5cγ).
      </p>
    </figure>
  )
}

function Row({
  label,
  value,
  bold,
  highlight,
}: {
  label: string
  value: string
  bold?: boolean
  highlight?: boolean
}) {
  return (
    <div className="flex justify-between gap-3 py-0.5">
      <span className={highlight ? 'text-red-600 dark:text-red-400' : 'text-fg-muted'}>
        {label}
      </span>
      <span
        className={`font-mono tabular-nums ${bold ? 'font-semibold text-fg' : 'text-fg'} ${
          highlight ? 'text-red-600 dark:text-red-400' : ''
        }`}
      >
        {value}
      </span>
    </div>
  )
}

function drawCurve(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  currentMu: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const PAD_X = 30
  const PAD_Y = 16
  const muMax = 1.5
  const etaMax = 0.4

  const xt = (mu: number) => lerp(mu, 0, muMax, PAD_X, w - PAD_X)
  const yv = (eta: number) => lerp(eta, etaMax, -etaMax * 0.1, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.moveTo(PAD_X, yv(etaMax))
  ctx.lineTo(PAD_X, yZero)
  ctx.stroke()

  // y ticks at η = 10%, 20%, 33.3%
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  for (const e of [0.1, 0.2, 0.333]) {
    ctx.strokeStyle = colors.border
    ctx.setLineDash([2, 3])
    ctx.beginPath()
    ctx.moveTo(PAD_X, yv(e))
    ctx.lineTo(w - PAD_X, yv(e))
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillText(`${(e * 100).toFixed(e === 0.333 ? 1 : 0)}%`, PAD_X - 3, yv(e) + 3)
  }

  // x ticks at μ = 0.5, 1.0
  ctx.textAlign = 'center'
  for (const m of [0.5, 1.0]) {
    ctx.strokeStyle = colors.border
    ctx.beginPath()
    ctx.moveTo(xt(m), yZero - 2)
    ctx.lineTo(xt(m), yZero + 4)
    ctx.stroke()
    ctx.fillText(`μ=${m}`, xt(m), yZero + 14)
  }

  // efficiency curve η(μ) = (μ²/2) / (1 + μ²/2)
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  const STEPS = 200
  for (let i = 0; i <= STEPS; i++) {
    const mu = lerp(i, 0, STEPS, 0, muMax)
    const eta = (mu * mu) / 2 / (1 + (mu * mu) / 2)
    const px = xt(mu)
    const py = yv(eta)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // current operating point
  if (currentMu >= 0 && currentMu <= muMax) {
    const mu = currentMu
    const eta = (mu * mu) / 2 / (1 + (mu * mu) / 2)
    const px = xt(mu)
    const py = yv(eta)
    ctx.fillStyle = mu > 1 ? 'rgb(220, 38, 38)' : colors.accent
    ctx.beginPath()
    ctx.arc(px, py, 5, 0, Math.PI * 2)
    ctx.fill()
    // dashed lines from point to axes
    ctx.strokeStyle = colors.fgMuted
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(px, yZero)
    ctx.lineTo(px, py)
    ctx.lineTo(PAD_X, py)
    ctx.stroke()
    ctx.setLineDash([])
    // label at point
    ctx.fillStyle = colors.fg
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(`η = ${(eta * 100).toFixed(1)}%`, px + 7, py - 4)
  }
}
