'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Show that ⟨e^{jkω₀t}, e^{jmω₀t}⟩ = T·δ_{k,m} by example.
 *
 * Plots Re{e^{j(k-m)ω₀t}} = cos((k-m)ω₀t) over one period [0, T₀].
 * The shaded area below the curve is the running integral. When k=m the
 * integrand is constant 1 and the integral is T₀; otherwise the cycle
 * cancels exactly and the integral is 0.
 */

const T0 = 1.0 // period (sec) — display only

export function HarmonicOrthogonalityCheck() {
  const [k, setK] = useState(2)
  const [m, setM] = useState(3)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const result = useMemo(() => {
    // Real part of e^{j(k-m)ω₀t} over [0, T₀]; integral = T₀ if k=m else 0.
    return {
      isOrthogonal: k !== m,
      integral: k === m ? T0 : 0,
      diff: k - m,
    }
  }, [k, m])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = getThemeColors()
    if (!colors) return
    drawIntegrand(canvas, colors, k - m)
  }, [k, m])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        ⟨e^(jkω₀t), e^(jmω₀t)⟩ — ορθογωνιότητα αρμονικών
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Διάλεξε <em>k</em> και <em>m</em>. Σχεδιάζεται το πραγματικό μέρος του
        ολοκληρωτέου, <code className="font-mono">cos((k − m)·ω₀·t)</code>, σε
        μία περίοδο. Η σκιασμένη περιοχή είναι το ολοκλήρωμα. <strong>Μόνο όταν
        k = m</strong> δεν αλληλοεξουδετερώνεται και βγαίνει T₀.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 180 }}
        className="block h-[180px] w-full rounded-md border border-border bg-bg-soft/40"
        aria-label="Integrand cos((k-m)·ω₀·t) over one period"
      />

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Stepper label="k" value={k} onChange={setK} />
        <Stepper label="m" value={m} onChange={setM} />
      </div>

      <div
        className={
          'mt-3 rounded-md border px-3 py-2 text-sm ' +
          (result.isOrthogonal
            ? 'border-success/40 bg-success/10 text-success'
            : 'border-accent/40 bg-accent-soft/30 text-fg')
        }
        role="status"
      >
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          {result.isOrthogonal ? (
            <>
              k − m = {result.diff} ≠ 0 ⇒{' '}
              <code className="font-mono">∫₀^T₀ cos((k−m)ω₀t) dt = 0</code>{' '}
              <span className="text-fg-muted">
                · ακέραιοι κύκλοι σε ένα διάστημα μήκους T₀ → άθροισμα μηδέν.
              </span>
            </>
          ) : (
            <>
              k = m ⇒ ο integrand είναι σταθερά 1 ⇒{' '}
              <code className="font-mono">∫₀^T₀ 1 dt = T₀</code>
            </>
          )}
        </span>
      </div>
    </figure>
  )
}

function Stepper({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-border bg-bg-soft/40 px-3 py-2">
      <span className="text-xs font-medium text-fg-muted">{label}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          className="rounded-md border border-border bg-bg px-2 py-0.5 text-sm leading-none hover:border-accent/50"
          aria-label={`Μείωσε ${label}`}
        >
          −
        </button>
        <span className="min-w-[2.5rem] text-center font-mono text-sm tabular-nums">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="rounded-md border border-border bg-bg px-2 py-0.5 text-sm leading-none hover:border-accent/50"
          aria-label={`Αύξησε ${label}`}
        >
          +
        </button>
      </div>
    </div>
  )
}

function drawIntegrand(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  diff: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const padX = 28
  const padY = 14

  const xt = (t: number) => lerp(t, 0, T0, padX, w - padX)
  const yv = (v: number) => lerp(v, 1.2, -1.2, padY, h - padY)
  const yZero = yv(0)

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padX, yZero)
  ctx.lineTo(w - padX, yZero)
  ctx.stroke()

  // Y ticks (+1, 0, -1)
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  for (const v of [-1, 0, 1]) {
    const y = yv(v)
    ctx.fillText(v.toFixed(0), padX - 3, y + 3)
  }
  // X ticks
  ctx.textAlign = 'center'
  ctx.fillText('0', padX, h - 1)
  ctx.fillText('T₀', w - padX, h - 1)

  // Shaded area = running integral.
  const omega0 = (2 * Math.PI) / T0
  const steps = 240
  ctx.fillStyle =
    diff === 0 ? hexA(colors.accent, 0.25) : hexA(colors.fgMuted, 0.15)
  ctx.beginPath()
  ctx.moveTo(xt(0), yZero)
  for (let i = 0; i <= steps; i++) {
    const t = lerp(i, 0, steps, 0, T0)
    const v = Math.cos(diff * omega0 * t)
    ctx.lineTo(xt(t), yv(v))
  }
  ctx.lineTo(xt(T0), yZero)
  ctx.closePath()
  ctx.fill()

  // Integrand curve.
  ctx.strokeStyle = diff === 0 ? colors.accent : colors.fg
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= steps; i++) {
    const t = lerp(i, 0, steps, 0, T0)
    const v = Math.cos(diff * omega0 * t)
    if (i === 0) ctx.moveTo(xt(t), yv(v))
    else ctx.lineTo(xt(t), yv(v))
  }
  ctx.stroke()

  // Annotation: cycles per period.
  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  if (diff === 0) {
    ctx.fillText('cos(0) = 1  →  σταθερό 1', padX + 6, padY + 12)
  } else {
    const cycles = Math.abs(diff)
    ctx.fillText(`${cycles} ${cycles === 1 ? 'πλήρης κύκλος' : 'πλήρεις κύκλοι'} στο [0, T₀]`, padX + 6, padY + 12)
  }
}

function hexA(rgbStr: string, alpha: number) {
  // rgbStr is like "rgb(220, 38, 38)" — convert to rgba(...)
  const m = /rgb\(([^)]+)\)/.exec(rgbStr)
  if (!m) return rgbStr
  return `rgba(${m[1]}, ${alpha})`
}
