'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, type ThemeColors } from '@/lib/canvas'

/**
 * Slide 33 — the "FS coefficients ARE the FT envelope sampled at 1/T₀".
 *
 * The relationship the prof writes:
 *     x_k = (1/T₀) · X(k/T₀)
 *
 * Meaning: if we take a single non-periodic rect pulse with FT X(f), and then
 * make it periodic by repeating with period T₀, the Fourier-series coefficients
 * of the periodic version are exactly samples of the original FT envelope at
 * multiples of 1/T₀, scaled by 1/T₀.
 *
 * Viz layout:
 *   - Left  : time domain. Top half shows the single rect pulse (T=1).
 *             Bottom half shows the periodic train with adjustable T₀.
 *   - Right : frequency domain. The single-pulse FT X₀(f) (faint dotted — only
 *             the SHAPE), the real coefficient envelope X₀(f)/T₀, and stems
 *             aₖ = X₀(k/T₀)/T₀ sitting on that lower curve. The aₖ do NOT land
 *             on X₀ itself — they sit on X₀ scaled down by 1/T₀.
 *
 *   T₀ slider controls how close together those samples are. As T₀ → ∞ the
 *   samples become dense and recover the continuous envelope.
 *
 * Pedagogical role (FT §2.1): the FT exists FIRST as the envelope X₀ (the FT of
 * one pulse), and the FS coefficients are just samples of it at step 1/T₀,
 * scaled by 1/T₀ — the "average vs total" picture made concrete on a rect.
 */

const T_PULSE = 1.0 // single-rect width (fixed)
const T0_MIN = 1.5
const T0_MAX = 8.0

export function FtAsSampledFsEnvelope() {
  const [T0, setT0] = useState(2.0) // default = 2·T_PULSE → 50% duty cycle (the FS square-wave case)
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
        Slide 33 — οι FS συντελεστές είναι το FT envelope δειγματισμένο στο 1/T₀
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Ίδιος παλμός <span className="font-mono">rect(t/T)</span> με{' '}
        <span className="font-mono">T = 1</span>, μία φορά (πάνω) και σαν periodic με περίοδο{' '}
        <span className="font-mono">T₀</span> (κάτω). Δεξιά, η <strong>γκρι διακεκομμένη</strong>{' '}
        είναι ο FT ενός μόνο παλμού <span className="font-mono">X₀(f) = T · sinc(fT)</span> —
        μόνο το <strong>σχήμα</strong>. Τα πραγματικά <span className="font-mono">aₖ</span>{' '}
        όμως <strong>δεν</strong> κάθονται εκεί: κάθονται στη{' '}
        <span style={{ color: '#7c3aed' }} className="font-semibold">μωβ</span> καμπύλη{' '}
        <span className="font-mono">X₀(f)/T₀</span> (η σχέση{' '}
        <span className="font-mono">aₖ = (1/T₀) · X₀(k/T₀)</span>). Αύξησε το{' '}
        <span className="font-mono">T₀</span> και η μωβ περιβάλλουσα <strong>κατεβαίνει</strong>{' '}
        κατά <span className="font-mono">1/T₀</span> ενώ τα δείγματα πυκνώνουν. Στο default{' '}
        <span className="font-mono">T₀ = 2</span> (50% duty, το square wave των Σειρών) οι{' '}
        <strong>ζυγές</strong> αρμονικές πέφτουν στα μηδενικά της sinc —{' '}
        <span style={{ color: 'rgb(var(--danger))' }}>κόκκινοι κύκλοι</span>.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel
          title="Χρόνος"
          subtitle="πάνω: μοναδικός παλμός / κάτω: periodic με T₀"
        >
          <canvas
            ref={timeRef}
            style={{ height: 230 }}
            className="block h-[230px] w-full"
            aria-label="Time domain — single pulse and periodic train"
          />
        </Panel>
        <Panel
          title="Συχνότητα"
          subtitle="γκρι διακεκ. = X₀ (σχήμα) · μωβ = X₀/T₀ με τα aₖ"
        >
          <canvas
            ref={freqRef}
            style={{ height: 230 }}
            className="block h-[230px] w-full"
            aria-label="Frequency domain — sinc envelope and sampled FS coefficients"
          />
        </Panel>
      </div>

      <div className="mt-3 rounded-md border border-border bg-bg p-3">
        <label className="block text-xs text-fg-muted">
          Περίοδος T₀ ={' '}
          <span className="font-mono text-fg tabular-nums">{T0.toFixed(2)}</span> s
          <span className="ml-3 text-fg-subtle">
            (απόσταση αρμονικών στη συχνότητα: 1/T₀ ={' '}
            <span className="font-mono text-fg tabular-nums">{(1 / T0).toFixed(3)}</span> Hz)
          </span>
        </label>
        <input
          type="range"
          min={T0_MIN}
          max={T0_MAX}
          step={0.1}
          value={T0}
          onChange={(e) => setT0(Number(e.target.value))}
          className="mt-2 w-full"
        />
        <div className="mt-2 grid gap-1 text-[11px] text-fg-muted sm:grid-cols-2">
          <div>
            Μικρό <span className="font-mono">T₀</span> → λίγα, αραιά στίγματα — το «δείγμα» χάνει
            λεπτομέρειες της envelope.
          </div>
          <div>
            Μεγάλο <span className="font-mono">T₀</span> → πολλά, πυκνά στίγματα — η envelope
            ανακτάται με υψηλότερη ανάλυση. Στο όριο <span className="font-mono">T₀ → ∞</span>{' '}
            παίρνεις πίσω το συνεχές FT.
          </div>
        </div>
      </div>

      <figcaption className="mt-3 text-xs text-fg-muted">
        Δύο όψεις της ίδιας σχέσης: η συνεχής καμπύλη είναι το envelope (ο FT ενός μόνο
        παλμού)· οι FS συντελεστές είναι <strong>δείγματά</strong> του, στο βήμα{' '}
        <span className="font-mono">1/T₀</span>. Όσο μεγαλώνει το{' '}
        <span className="font-mono">T₀</span>, τα δείγματα πυκνώνουν και ανακτούν τη συνεχή
        καμπύλη.
      </figcaption>
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
    <div className="rounded-md border border-border bg-bg p-2">
      <div className="mb-1 flex items-baseline justify-between gap-2 px-1">
        <span className="text-xs font-semibold tracking-tight">{title}</span>
        <span className="text-[10px] font-mono text-fg-subtle">{subtitle}</span>
      </div>
      {children}
    </div>
  )
}

function drawTime(canvas: HTMLCanvasElement, colors: ThemeColors, T0: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const pad = 22

  // Two stacked sub-axes
  const halfH = (h - 3 * pad) / 2
  const yTopAxis = pad + halfH
  const yBotAxis = pad + 2 * halfH + pad

  const tDomain = 10 // show t ∈ [-10, 10]

  // single pulse
  drawAxis(ctx, colors, pad, w - pad / 2, yTopAxis, w / 2, pad, yTopAxis + 2, 't', 'x(t)')

  // pulse drawing
  const pulseHeight = halfH * 0.7
  const x0 = w / 2 - (T_PULSE / 2 / tDomain) * (w / 2 - pad)
  const x1 = w / 2 + (T_PULSE / 2 / tDomain) * (w / 2 - pad)
  ctx.strokeStyle = '#3b82f6'
  ctx.fillStyle = '#3b82f680'
  ctx.lineWidth = 1.8
  ctx.beginPath()
  ctx.moveTo(pad, yTopAxis)
  ctx.lineTo(x0, yTopAxis)
  ctx.lineTo(x0, yTopAxis - pulseHeight)
  ctx.lineTo(x1, yTopAxis - pulseHeight)
  ctx.lineTo(x1, yTopAxis)
  ctx.lineTo(w - pad / 2, yTopAxis)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x0, yTopAxis)
  ctx.lineTo(x0, yTopAxis - pulseHeight)
  ctx.lineTo(x1, yTopAxis - pulseHeight)
  ctx.lineTo(x1, yTopAxis)
  ctx.fill()

  // periodic train
  drawAxis(
    ctx,
    colors,
    pad,
    w - pad / 2,
    yBotAxis,
    w / 2,
    pad + halfH + pad,
    yBotAxis + 2,
    't',
    'x_periodic(t)',
  )

  ctx.strokeStyle = '#10b981'
  ctx.fillStyle = '#10b98180'
  ctx.lineWidth = 1.6
  // draw multiple pulses spaced by T0
  const kMax = Math.ceil(tDomain / T0) + 1
  for (let k = -kMax; k <= kMax; k++) {
    const center = k * T0
    if (Math.abs(center) > tDomain + T_PULSE) continue
    const a = w / 2 + ((center - T_PULSE / 2) / tDomain) * (w / 2 - pad)
    const b = w / 2 + ((center + T_PULSE / 2) / tDomain) * (w / 2 - pad)
    ctx.beginPath()
    ctx.moveTo(a, yBotAxis)
    ctx.lineTo(a, yBotAxis - pulseHeight)
    ctx.lineTo(b, yBotAxis - pulseHeight)
    ctx.lineTo(b, yBotAxis)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(a, yBotAxis)
    ctx.lineTo(a, yBotAxis - pulseHeight)
    ctx.lineTo(b, yBotAxis - pulseHeight)
    ctx.lineTo(b, yBotAxis)
    ctx.fill()
  }

  // T0 annotation
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  const t0PxA = w / 2
  const t0PxB = w / 2 + (T0 / tDomain) * (w / 2 - pad)
  ctx.strokeStyle = colors.fg
  ctx.setLineDash([2, 2])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(t0PxA, yBotAxis + 4)
  ctx.lineTo(t0PxA, yBotAxis + 16)
  ctx.moveTo(t0PxB, yBotAxis + 4)
  ctx.lineTo(t0PxB, yBotAxis + 16)
  ctx.moveTo(t0PxA, yBotAxis + 12)
  ctx.lineTo(t0PxB, yBotAxis + 12)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.fg
  ctx.fillText('T₀', (t0PxA + t0PxB) / 2 - 6, yBotAxis + 22)
}

function drawAxis(
  ctx: CanvasRenderingContext2D,
  colors: ThemeColors,
  xLeft: number,
  xRight: number,
  yAxis: number,
  xMidline: number,
  yTop: number,
  yBottom: number,
  xLabel: string,
  yLabel: string,
) {
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xLeft, yAxis)
  ctx.lineTo(xRight, yAxis)
  ctx.moveTo(xMidline, yTop)
  ctx.lineTo(xMidline, yBottom)
  ctx.stroke()
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText(xLabel, xRight - 8, yAxis - 4)
  ctx.fillText(yLabel, xMidline + 4, yTop + 8)
}

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}

function drawFreq(canvas: HTMLCanvasElement, colors: ThemeColors, T0: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const pad = 26

  const fDomain = 6

  // axes
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, h - pad)
  ctx.lineTo(w - pad / 2, h - pad)
  ctx.moveTo(w / 2, pad / 2)
  ctx.lineTo(w / 2, h - pad)
  ctx.stroke()
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('f', w - pad / 2 - 8, h - pad - 4)
  ctx.fillText('X₀(f),  aₖ', w / 2 + 6, pad / 2 + 8)

  // y scale: keep the single-pulse FT X₀ at full height; the real coefficient
  // envelope X₀/T₀ then sits visibly LOWER by the factor 1/T₀.
  const maxAmp = T_PULSE
  const yScale = (h - 2 * pad) / maxAmp / 1.2
  const samples = 700

  // (1) Single-pulse FT X₀(f) = T·sinc(fT) — faint dotted. This is only the SHAPE;
  // the actual coefficients do NOT sit on this curve.
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1.2
  ctx.globalAlpha = 0.55
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  for (let i = 0; i < samples; i++) {
    const f = -fDomain + (2 * fDomain * i) / (samples - 1)
    const X = T_PULSE * sinc(f * T_PULSE)
    const px = w / 2 + (f / fDomain) * (w / 2 - pad)
    const py = h - pad - X * yScale
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1

  // (2) The REAL envelope of the coefficients: X₀(f)/T₀. The aₖ sit on THIS curve.
  ctx.strokeStyle = '#7c3aed'
  ctx.lineWidth = 1.5
  ctx.globalAlpha = 0.45
  ctx.beginPath()
  for (let i = 0; i < samples; i++) {
    const f = -fDomain + (2 * fDomain * i) / (samples - 1)
    const X = (T_PULSE * sinc(f * T_PULSE)) / T0
    const px = w / 2 + (f / fDomain) * (w / 2 - pad)
    const py = h - pad - X * yScale
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.globalAlpha = 1

  // curve labels
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('X₀(f) = T·sinc(fT) — μόνο το σχήμα', pad + 4, pad / 2 + 8)
  ctx.fillStyle = '#7c3aed'
  ctx.fillText('aₖ κάθονται στο X₀/T₀', pad + 4, pad / 2 + 20)

  // (3) stems at multiples of 1/T0, height aₖ = X₀(k/T₀)/T₀ — on curve (2).
  // A harmonic on a sinc zero has aₖ = 0 → open red ring on the axis.
  const df = 1 / T0
  const kMax = Math.ceil(fDomain / df) + 1
  ctx.lineWidth = 1.6
  for (let k = -kMax; k <= kMax; k++) {
    const f = k * df
    if (Math.abs(f) > fDomain) continue
    const sincVal = sinc(f * T_PULSE)
    const ak = (T_PULSE * sincVal) / T0
    const px = w / 2 + (f / fDomain) * (w / 2 - pad)
    const py = h - pad - ak * yScale
    if (Math.abs(sincVal) < 0.015 && k !== 0) {
      ctx.strokeStyle = colors.danger
      ctx.beginPath()
      ctx.arc(px, h - pad, 4, 0, 2 * Math.PI)
      ctx.stroke()
    } else {
      ctx.fillStyle = '#7c3aed'
      ctx.strokeStyle = '#7c3aed'
      ctx.beginPath()
      ctx.moveTo(px, h - pad)
      ctx.lineTo(px, py)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(px, py, 3.5, 0, 2 * Math.PI)
      ctx.fill()
    }
  }

  // annotation: 1/T0 marker
  const fpx = w / 2 + ((1 / T0) / fDomain) * (w / 2 - pad)
  ctx.strokeStyle = colors.fgSubtle
  ctx.setLineDash([2, 2])
  ctx.beginPath()
  ctx.moveTo(w / 2, h - pad + 4)
  ctx.lineTo(w / 2, h - pad + 12)
  ctx.moveTo(fpx, h - pad + 4)
  ctx.lineTo(fpx, h - pad + 12)
  ctx.moveTo(w / 2, h - pad + 10)
  ctx.lineTo(fpx, h - pad + 10)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.fg
  ctx.fillText('1/T₀', (w / 2 + fpx) / 2 - 12, h - pad + 22)
}
