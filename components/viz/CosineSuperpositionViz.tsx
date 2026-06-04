'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

type Colors = NonNullable<ReturnType<typeof getThemeColors>>

/**
 * Superposition in the frequency domain. Toggle individual cosines on/off and
 * watch the amplitude spectrum gain/lose a lollipop PAIR at ±fᵢ for each one,
 * while the time waveform becomes their sum. Makes "spectrum of a sum = union
 * of the individual spectra" (slide 15) concrete — the bit the prose alone
 * couldn't convey ("προσθέτεις cosines → εμφανίζονται ζεύγη lollipops").
 *
 * Each component has its own colour, shared between its toggle chip and its
 * spectral pair, so the reader sees exactly which cosine put which pair where.
 */

type Comp = { f: number; A: number; color: string; label: string }

const COMPONENTS: Comp[] = [
  { f: 1, A: 1.0, color: '#2563eb', label: 'cos(2π·1·t)' },
  { f: 2, A: 0.6, color: '#16a34a', label: '0.6·cos(2π·2·t)' },
  { f: 3, A: 0.45, color: '#d97706', label: '0.45·cos(2π·3·t)' },
  { f: 5, A: 0.3, color: '#9333ea', label: '0.3·cos(2π·5·t)' },
]

const T_HALF = 1.5
const F_MAX = 6

export function CosineSuperpositionViz() {
  const [on, setOn] = useState<boolean[]>([true, false, false, false])
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  const active = useMemo(() => COMPONENTS.filter((_, i) => on[i]), [on])

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, active)
    if (freqRef.current) drawSpectrum(freqRef.current, colors, active)
  }, [active])

  const toggle = (i: number) => setOn((prev) => prev.map((v, j) => (j === i ? !v : v)))

  const expr =
    active.length === 0
      ? 'x(t) = 0'
      : 'x(t) = ' +
        active.map((c) => (c.A === 1 ? `cos(2π·${c.f}·t)` : `${c.A}·cos(2π·${c.f}·t)`)).join(' + ')

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Πρόσθεσε cosines — δες τα ζεύγη lollipops να εμφανίζονται
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Άναψέ τα ένα-ένα. Κάθε cosine βάζει ένα <strong>ζευγάρι</strong> γραμμών στη συχνότητά του{' '}
        (στο <span className="font-mono">±f</span>), με ύψος ίσο με το <strong>μισό του πλάτους του</strong>{' '}
        (<span className="font-mono">A/2</span>) — το φάσμα του αθροίσματος είναι απλώς η{' '}
        <strong>ένωση</strong> των επιμέρους ζευγών.
      </p>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {COMPONENTS.map((c, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={on[i]}
            onClick={() => toggle(i)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors',
              on[i] ? 'text-fg' : 'border-border bg-bg-soft text-fg-muted hover:text-fg',
            )}
            style={on[i] ? { borderColor: c.color, backgroundColor: c.color + '22' } : undefined}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: on[i] ? c.color : 'transparent', border: `1.5px solid ${c.color}` }}
            />
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle="x(t) = άθροισμα των αναμμένων cosines">
          <canvas ref={timeRef} style={{ height: 180 }} className="block h-[180px] w-full" aria-label="time sum" />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle="|X(f)| — ένα ζευγάρι ανά cosine">
          <canvas
            ref={freqRef}
            style={{ height: 180 }}
            className="block h-[180px] w-full"
            aria-label="spectrum lollipops"
          />
        </Panel>
      </div>

      <p className="mt-3 overflow-x-auto rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 font-mono text-xs text-fg">
        {expr}
      </p>
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
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-3 py-1.5">
        <span className="text-[11px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

const PAD_X = 30
const PAD_Y = 16

function drawTime(canvas: HTMLCanvasElement, colors: Colors, active: Comp[]) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const tMin = -T_HALF
  const tMax = T_HALF
  const sumA = active.reduce((s, c) => s + c.A, 0)
  const yLim = Math.max(1.2, sumA * 1.1)

  const xt = (t: number) => lerp(t, tMin, tMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, PAD_Y, h - PAD_Y)
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

  if (active.length > 0) {
    ctx.strokeStyle = colors.accent
    ctx.lineWidth = 2
    ctx.beginPath()
    const STEPS = Math.floor(w * 2)
    for (let i = 0; i <= STEPS; i++) {
      const t = lerp(i, 0, STEPS, tMin, tMax)
      let v = 0
      for (const c of active) v += c.A * Math.cos(2 * Math.PI * c.f * t)
      const px = xt(t)
      const py = yv(v)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  } else {
    ctx.fillStyle = colors.fgSubtle
    ctx.textAlign = 'center'
    ctx.font = '12px ui-sans-serif, system-ui, sans-serif'
    ctx.fillText('(κανένα cosine αναμμένο)', w / 2, yZero - 8)
  }

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), h - 2)
  ctx.fillText(`−${T_HALF}`, xt(tMin), h - 2)
  ctx.fillText(`+${T_HALF}`, xt(tMax), h - 2)
  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'left'
  ctx.fillText('x(t)', xt(0) + 4, PAD_Y + 4)
  ctx.textAlign = 'right'
  ctx.fillText('t', w - PAD_X / 2, yZero - 4)
}

function drawSpectrum(canvas: HTMLCanvasElement, colors: Colors, active: Comp[]) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const fMin = -F_MAX
  const fMax = F_MAX
  const yMax = 0.62
  const yMin = -0.18

  const xt = (f: number) => lerp(f, fMin, fMax, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, yMin, PAD_Y, h - PAD_Y)
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

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), h - 2)
  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'left'
  ctx.fillText('|X(f)|', xt(0) + 4, PAD_Y + 4)
  ctx.textAlign = 'right'
  ctx.fillText('f', w - PAD_X / 2, yZero - 4)

  for (const c of active) {
    const yTop = yv(c.A / 2)
    lollipop(ctx, xt(c.f), yZero, yTop, c.color)
    lollipop(ctx, xt(-c.f), yZero, yTop, c.color)
    ctx.fillStyle = colors.fgSubtle
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`+${c.f}`, xt(c.f), h - 2)
    ctx.fillText(`−${c.f}`, xt(-c.f), h - 2)
  }

  if (active.length === 0) {
    ctx.fillStyle = colors.fgSubtle
    ctx.textAlign = 'center'
    ctx.font = '12px ui-sans-serif, system-ui, sans-serif'
    ctx.fillText('(άναψε ένα cosine)', w / 2, yZero - 8)
  }
}

function lollipop(ctx: CanvasRenderingContext2D, px: number, yZero: number, yTop: number, color: string) {
  ctx.strokeStyle = color
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(px, yZero)
  ctx.lineTo(px, yTop)
  ctx.stroke()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(px, yTop, 3.5, 0, Math.PI * 2)
  ctx.fill()
}
