'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * DistributionExplorerViz — interactive PDF gallery for the three RV
 * distributions K21 actually uses: Uniform, Gaussian, Exponential.
 *
 * Each tab shows the live PDF, the mean line, and (when applicable) the
 * ±σ band, with the computed E[X] and Var(X) printed below. The student
 * drags parameters and sees the shape react: how the variance balloons
 * a Gaussian, how a wider Uniform interval lowers its height to keep
 * the area = 1, how an exponential's decay rate pivots around 1/λ.
 *
 * Cross-mountable on /noise/sources (Gaussian — thermal noise amplitude)
 * and /random-processes (Uniform — random phase).
 */

type DistKind = 'uniform' | 'gaussian' | 'exponential'

const TABS: Array<{ kind: DistKind; label: string; shortGreek: string }> = [
  { kind: 'uniform', label: 'Uniform U(a, b)', shortGreek: 'Uniform' },
  { kind: 'gaussian', label: 'Gaussian N(μ, σ²)', shortGreek: 'Gaussian' },
  { kind: 'exponential', label: 'Exponential(λ)', shortGreek: 'Exponential' },
]

export function DistributionExplorerViz() {
  const [kind, setKind] = useState<DistKind>('gaussian')
  // Uniform
  const [uA, setUA] = useState(-1)
  const [uB, setUB] = useState(1)
  // Gaussian
  const [gMu, setGMu] = useState(0)
  const [gSigma, setGSigma] = useState(1)
  // Exponential
  const [eLambda, setELambda] = useState(1)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, kind, { uA, uB, gMu, gSigma, eLambda })
    const onResize = () => {
      if (canvas && colors) drawScene(canvas, colors, kind, { uA, uB, gMu, gSigma, eLambda })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [kind, uA, uB, gMu, gSigma, eLambda])

  // Stats per current tab
  const stats = computeStats(kind, { uA, uB, gMu, gSigma, eLambda })

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Κύριες κατανομές — PDF, μέσος, διασπορά
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t.kind}
              type="button"
              onClick={() => setKind(t.kind)}
              className={
                'rounded-full border px-3 py-1 text-xs transition-colors ' +
                (kind === t.kind
                  ? 'border-accent bg-accent/15 font-semibold text-fg'
                  : 'border-border bg-bg-soft text-fg-muted hover:border-accent/50 hover:text-fg')
              }
            >
              {t.shortGreek}
            </button>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 280 }}
        className="block h-[280px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label={`PDF of the ${kind} distribution`}
      />

      <div className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
        {kind === 'uniform' && (
          <>
            <SliderBlock
              label="a (lower bound)"
              value={uA}
              min={-3}
              max={uB - 0.1}
              step={0.1}
              onChange={setUA}
              fmt={(v) => v.toFixed(1)}
            />
            <SliderBlock
              label="b (upper bound)"
              value={uB}
              min={uA + 0.1}
              max={3}
              step={0.1}
              onChange={setUB}
              fmt={(v) => v.toFixed(1)}
            />
          </>
        )}
        {kind === 'gaussian' && (
          <>
            <SliderBlock
              label="μ (mean)"
              value={gMu}
              min={-2}
              max={2}
              step={0.1}
              onChange={setGMu}
              fmt={(v) => v.toFixed(1)}
            />
            <SliderBlock
              label="σ (std dev)"
              value={gSigma}
              min={0.2}
              max={2.5}
              step={0.1}
              onChange={setGSigma}
              fmt={(v) => v.toFixed(2)}
            />
          </>
        )}
        {kind === 'exponential' && (
          <SliderBlock
            label="λ (rate)"
            value={eLambda}
            min={0.2}
            max={3}
            step={0.1}
            onChange={setELambda}
            fmt={(v) => v.toFixed(2)}
          />
        )}
      </div>

      <div className="mt-3 grid gap-2 rounded-md border border-accent/30 bg-accent-soft/20 px-3 py-2 text-xs sm:grid-cols-3">
        <Stat label="E[X]" value={stats.mean.toFixed(3)} />
        <Stat label="Var(X)" value={stats.variance.toFixed(3)} />
        <Stat label="σ" value={Math.sqrt(stats.variance).toFixed(3)} />
      </div>

      <p className="mt-3 text-xs text-fg-muted">{stats.commentary}</p>
    </figure>
  )
}

function SliderBlock({
  label,
  value,
  min,
  max,
  step,
  onChange,
  fmt,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  fmt: (v: number) => string
}) {
  return (
    <div>
      <label className="block text-fg-muted">
        {label} ={' '}
        <span className="font-mono text-fg tabular-nums">{fmt(value)}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-1 w-full accent-[rgb(var(--accent))]"
      />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="font-mono text-sm tabular-nums text-fg">{value}</div>
    </div>
  )
}

type Params = {
  uA: number
  uB: number
  gMu: number
  gSigma: number
  eLambda: number
}

function computeStats(kind: DistKind, p: Params) {
  if (kind === 'uniform') {
    const mean = (p.uA + p.uB) / 2
    const variance = (p.uB - p.uA) ** 2 / 12
    return {
      mean,
      variance,
      commentary:
        'Uniform: όλες οι τιμές στο [a, b] εξίσου πιθανές. Ύψος = 1/(b−a) ώστε το ολικό εμβαδόν να είναι 1. Συχνή χρήση: τυχαία φάση Θ ~ U(0, 2π) στις διαμορφώσεις.',
    }
  }
  if (kind === 'gaussian') {
    return {
      mean: p.gMu,
      variance: p.gSigma ** 2,
      commentary:
        '68% της μάζας μέσα σε ±σ από τον μέσο, 95% σε ±2σ, 99.7% σε ±3σ. Πανταχού παρούσα: ο θερμικός θόρυβος είναι Gaussian (Central Limit Theorem — άθροισμα πολλών μικρών ανεξάρτητων διεγέρσεων).',
    }
  }
  return {
    mean: 1 / p.eLambda,
    variance: 1 / p.eLambda ** 2,
    commentary:
      'Exponential: μνημονικά «αμνημόνευτη» — η αναμενόμενη υπολειπόμενη ζωή δεν εξαρτάται από το πόσο έχει ήδη περάσει. Συχνή χρήση: χρόνοι μεταξύ τυχαίων γεγονότων (π.χ. arrivals σε ένα δίκτυο).',
  }
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  kind: DistKind,
  p: Params,
) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // X-axis range and PDF samples depend on the distribution.
  let xMin = 0
  let xMax = 0
  let peakY = 0
  let pdf: (x: number) => number = () => 0
  let mean = 0
  let sigma = 0

  if (kind === 'uniform') {
    xMin = Math.min(p.uA, -3)
    xMax = Math.max(p.uB, 3)
    const height = p.uB > p.uA ? 1 / (p.uB - p.uA) : 0
    peakY = Math.max(height * 1.15, 0.05)
    pdf = (x) => (x >= p.uA && x <= p.uB ? height : 0)
    mean = (p.uA + p.uB) / 2
    sigma = (p.uB - p.uA) / Math.sqrt(12)
  } else if (kind === 'gaussian') {
    xMin = Math.min(p.gMu - 3.5 * p.gSigma, -3)
    xMax = Math.max(p.gMu + 3.5 * p.gSigma, 3)
    peakY = (1 / (p.gSigma * Math.sqrt(2 * Math.PI))) * 1.1
    pdf = (x) =>
      (1 / (p.gSigma * Math.sqrt(2 * Math.PI))) *
      Math.exp(-((x - p.gMu) ** 2) / (2 * p.gSigma ** 2))
    mean = p.gMu
    sigma = p.gSigma
  } else {
    xMin = -0.5
    xMax = Math.max(6, 5 / p.eLambda)
    peakY = p.eLambda * 1.15
    pdf = (x) => (x >= 0 ? p.eLambda * Math.exp(-p.eLambda * x) : 0)
    mean = 1 / p.eLambda
    sigma = 1 / p.eLambda
  }

  // Coordinate transforms
  const padL = 36
  const padR = 14
  const padT = 14
  const padB = 30
  const plotW = w - padL - padR
  const plotH = h - padT - padB
  const xTo = (x: number) => padL + lerp(x, xMin, xMax, 0, plotW)
  const yTo = (y: number) => padT + plotH - lerp(y, 0, peakY, 0, plotH)

  // Grid + axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padL, padT)
  ctx.lineTo(padL, padT + plotH)
  ctx.lineTo(padL + plotW, padT + plotH)
  ctx.stroke()

  // x-axis ticks (5 evenly-spaced)
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui'
  ctx.textAlign = 'center'
  for (let i = 0; i <= 5; i++) {
    const x = xMin + (i / 5) * (xMax - xMin)
    const px = xTo(x)
    ctx.strokeStyle = colors.border
    ctx.beginPath()
    ctx.moveTo(px, padT + plotH)
    ctx.lineTo(px, padT + plotH + 4)
    ctx.stroke()
    ctx.fillText(x.toFixed(1), px, padT + plotH + 16)
  }
  ctx.textAlign = 'left'
  ctx.fillText('x', padL + plotW + 2, padT + plotH + 4)
  ctx.save()
  ctx.translate(8, padT + plotH / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.textAlign = 'center'
  ctx.fillText('f_X(x)', 0, 0)
  ctx.restore()

  // ±σ shaded band (clipped to [xMin, xMax])
  const sLo = Math.max(mean - sigma, xMin)
  const sHi = Math.min(mean + sigma, xMax)
  if (sHi > sLo) {
    ctx.fillStyle = colors.accentSoft
    ctx.globalAlpha = 0.4
    const samples = 80
    ctx.beginPath()
    ctx.moveTo(xTo(sLo), yTo(0))
    for (let i = 0; i <= samples; i++) {
      const x = sLo + (i / samples) * (sHi - sLo)
      ctx.lineTo(xTo(x), yTo(pdf(x)))
    }
    ctx.lineTo(xTo(sHi), yTo(0))
    ctx.closePath()
    ctx.fill()
    ctx.globalAlpha = 1
  }

  // For Gaussian, also tint ±2σ region lightly (95% band hint)
  if (kind === 'gaussian') {
    const two = 2 * p.gSigma
    const s2Lo = Math.max(p.gMu - two, xMin)
    const s2Hi = Math.min(p.gMu + two, xMax)
    ctx.fillStyle = colors.accent
    ctx.globalAlpha = 0.06
    ctx.beginPath()
    const samples = 100
    ctx.moveTo(xTo(s2Lo), yTo(0))
    for (let i = 0; i <= samples; i++) {
      const x = s2Lo + (i / samples) * (s2Hi - s2Lo)
      ctx.lineTo(xTo(x), yTo(pdf(x)))
    }
    ctx.lineTo(xTo(s2Hi), yTo(0))
    ctx.closePath()
    ctx.fill()
    ctx.globalAlpha = 1
  }

  // PDF curve
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2
  ctx.beginPath()
  const N = 400
  let started = false
  for (let i = 0; i <= N; i++) {
    const x = xMin + (i / N) * (xMax - xMin)
    const y = pdf(x)
    if (!started) {
      ctx.moveTo(xTo(x), yTo(y))
      started = true
    } else {
      ctx.lineTo(xTo(x), yTo(y))
    }
  }
  ctx.stroke()

  // Mean line
  ctx.strokeStyle = colors.danger
  ctx.lineWidth = 1.5
  ctx.setLineDash([4, 3])
  ctx.beginPath()
  ctx.moveTo(xTo(mean), padT)
  ctx.lineTo(xTo(mean), padT + plotH)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.danger
  ctx.textAlign = 'center'
  ctx.font = '11px ui-sans-serif, system-ui'
  ctx.fillText(`E[X] = ${mean.toFixed(2)}`, xTo(mean), padT - 2)

  // ±σ markers (vertical ticks)
  if (sigma > 0 && sigma < (xMax - xMin) / 2) {
    ctx.strokeStyle = colors.fgMuted
    ctx.lineWidth = 1
    ctx.setLineDash([2, 3])
    ;[mean - sigma, mean + sigma].forEach((x) => {
      if (x > xMin && x < xMax) {
        ctx.beginPath()
        ctx.moveTo(xTo(x), padT + plotH * 0.3)
        ctx.lineTo(xTo(x), padT + plotH)
        ctx.stroke()
      }
    })
    ctx.setLineDash([])
    ctx.fillStyle = colors.fgMuted
    ctx.textAlign = 'center'
    ctx.font = '10px ui-sans-serif, system-ui'
    if (mean - sigma > xMin) ctx.fillText('μ−σ', xTo(mean - sigma), padT + plotH * 0.28)
    if (mean + sigma < xMax) ctx.fillText('μ+σ', xTo(mean + sigma), padT + plotH * 0.28)
  }
}
