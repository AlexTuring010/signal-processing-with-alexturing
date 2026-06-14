'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, CheckCircle2, XCircle } from 'lucide-react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * AM vs DSB-SC, viewed through the same envelope-detector.
 *
 * Two side-by-side columns share the exact same message m(t) and the exact
 * same carrier frequency, so the difference is purely in what gets sent over
 * the air. The reader watches the same envelope-detector chain on both:
 *
 *   AM column         DSB-SC column
 *   ─────────         ─────────────
 *   x_AM = [A_c+m]cos x_DSB = m cos
 *   |x_AM| → m̂        |x_DSB| → m̂
 *
 * The envelope-detector output is shown overlaid against the true m(t).
 * The AM column gives a clean, faithful copy (μ ≤ 1). The DSB-SC column
 * gives the rectified |m(t)| — visibly wrong.
 *
 * Beneath each column: a verdict chip ("OK ✓" / "BROKEN ✗") and a numerical
 * RMS-error % readout.
 *
 * The slider lets the reader sweep μ for the AM column (illustrating that AM
 * even at high μ is recoverable so long as μ < 1; DSB-SC, regardless, is
 * broken). The shape preset lets them switch the message between three
 * canonical shapes that make the failure visible.
 *
 * Goal: make the "DSB-SC requires synchronous (coherent) demodulation"
 * requirement visceral, not just stated.
 */

const FC = 9 // carrier visual cycles per unit time
const FM = 0.4 // base message frequency
const A_C_AM = 1 // AM column carrier amplitude

type Preset = {
  id: string
  label: string
  m: (t: number) => number
  hint: string
}

const PRESETS: Preset[] = [
  {
    id: 'cosine',
    label: 'cos(2π f_m t)',
    m: (t) => Math.cos(2 * Math.PI * FM * t),
    hint: 'Καθαρό single-tone — η rectification γίνεται σχήμα ǀ·ǀ.',
  },
  {
    id: 'asym',
    label: '½ + ½ cos',
    m: (t) => 0.5 + 0.5 * Math.cos(2 * Math.PI * FM * t),
    hint: 'Bias πάνω από 0 — εδώ ακόμα και DSB-SC «τυχαίνει» να μην ξεγλιστράει.',
  },
  {
    id: 'sum',
    label: 'cos + 0.6·cos(2.3·)',
    m: (t) =>
      0.55 * Math.cos(2 * Math.PI * FM * t) +
      0.45 * Math.cos(2 * Math.PI * 2.3 * FM * t),
    hint: 'Πολλαπλά zero-crossings — η rectification παράγει πολλά «δόντια» στο |m|.',
  },
]

export function DsbVsAmEnvelopeDetectorComparison() {
  const [mu, setMu] = useState(0.7)
  const [presetId, setPresetId] = useState<string>('cosine')
  const [running, setRunning] = useState(true)
  const tRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const preset = PRESETS.find((p) => p.id === presetId)!

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (running) tRef.current += dt * 0.6
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) drawScene(canvas, colors, mu, preset, tRef.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running, mu, preset])

  const amDistortion = computeAMDistortion(mu, preset.m)
  const dsbDistortion = computeDSBDistortion(preset.m)
  const amVerdict = amDistortion < 0.05 ? 'ok' : amDistortion < 0.2 ? 'edge' : 'bad'

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          AM vs DSB-SC μέσα από τον <em>ίδιο</em> envelope detector
        </h4>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
          aria-label={running ? 'Παύση' : 'Παίξε'}
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {running ? 'Παύση' : 'Παίξε'}
        </button>
      </div>

      <p className="mb-3 text-xs text-fg-muted">
        Ίδιο <span className="font-mono">m(t)</span>, ίδιο{' '}
        <span className="font-mono">f_c</span> — διαφορετική διαμόρφωση.
        Αριστερά: Conventional AM (<span className="font-mono">x = [A_c + m]·cos</span>).
        Δεξιά: DSB-SC (<span className="font-mono">x = m·cos</span>). Και στις δύο
        στήλες περνάμε το σήμα από την <strong>ίδια αλυσίδα</strong>: envelope
        detector (βγάζει την απόλυτη τιμή του φακέλου){' '}
        <span className="font-mono">→</span> <strong>DC-block</strong> που αφαιρεί
        τη σταθερή συνιστώσα — αυτός που στην AM αφαιρεί το{' '}
        <span className="font-mono">A_c</span>. Σύγκρινε το ανακτημένο{' '}
        <span className="font-mono">m̂</span> (μπλε για AM, κόκκινο για DSB) με το
        αληθινό <span className="font-mono">m</span> (amber διακεκομμένο).
      </p>

      <div
        role="radiogroup"
        aria-label="Message preset"
        className="mb-3 inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
      >
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={presetId === p.id}
            onClick={() => setPresetId(p.id)}
            className={`rounded-full px-2.5 py-0.5 transition-colors ${
              presetId === p.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="mb-3 text-[11px] text-fg-subtle">{preset.hint}</p>

      <canvas
        ref={canvasRef}
        style={{ height: 380 }}
        className="block h-[380px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Side-by-side comparison: AM envelope detector recovers m(t) cleanly, DSB-SC produces |m(t)|"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          AM modulation index μ ={' '}
          <span className="font-mono text-fg tabular-nums">{mu.toFixed(2)}</span>
          {' · '}
          <span className="text-fg-subtle">
            (επηρεάζει μόνο την αριστερή AM στήλη — η DSB-SC δεν έχει A_c για να ρυθμίσει)
          </span>
        </label>
        <input
          type="range"
          min={0.2}
          max={1.1}
          step={0.02}
          value={mu}
          onChange={(e) => setMu(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="AM modulation index"
        />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div
          className={`rounded-md border px-3 py-2 text-xs leading-snug ${
            amVerdict === 'ok'
              ? 'border-emerald-400/50 bg-emerald-50/70 dark:border-emerald-400/40 dark:bg-emerald-400/10'
              : amVerdict === 'edge'
                ? 'border-amber-400/50 bg-amber-50/70 dark:border-amber-400/40 dark:bg-amber-400/10'
                : 'border-red-400/60 bg-red-50/70 dark:border-red-400/40 dark:bg-red-400/10'
          }`}
        >
          <div className="mb-1 flex items-center gap-1.5 font-semibold">
            {amVerdict === 'ok' ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-300" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-red-700 dark:text-red-300" />
            )}
            <span>AM: {amVerdict === 'ok' ? 'καθαρή ανάκτηση' : amVerdict === 'edge' ? 'οριακή' : 'σπασμένη (μ > 1)'}</span>
          </div>
          <div className="font-mono tabular-nums text-fg">
            RMS error / RMS m = {(amDistortion * 100).toFixed(1)}%
          </div>
          <p className="mt-1 text-fg-muted">
            Ο envelope detector βγάζει <span className="font-mono">|A_c + m(t)|</span>,
            που για <span className="font-mono">μ ≤ 1</span> ισούται με{' '}
            <span className="font-mono">A_c + m(t)</span>. Ο DC-block αφαιρεί το σταθερό{' '}
            <span className="font-mono">A_c</span> και μένει{' '}
            <strong>ακριβώς το <span className="font-mono">m(t)</span></strong> — γι' αυτό
            η μπλε κάθεται πάνω στην amber.
          </p>
        </div>

        <div className="rounded-md border border-red-400/60 bg-red-50/70 px-3 py-2 text-xs leading-snug dark:border-red-400/40 dark:bg-red-400/10">
          <div className="mb-1 flex items-center gap-1.5 font-semibold">
            <XCircle className="h-3.5 w-3.5 text-red-700 dark:text-red-300" />
            <span>DSB-SC: σπασμένη ανάκτηση</span>
          </div>
          <div className="font-mono tabular-nums text-fg">
            RMS error / RMS m = {(dsbDistortion * 100).toFixed(1)}%
          </div>
          <p className="mt-1 text-fg-muted">
            Ο envelope detector βγάζει <span className="font-mono">|m(t)|</span>. Ο{' '}
            <strong>ίδιος DC-block</strong> (που στην AM αφαιρούσε το{' '}
            <span className="font-mono">A_c</span>) αφαιρεί τον μέσο όρο, οπότε η κόκκινη
            είναι <span className="font-mono">|m(t)| − ⟨|m|⟩</span> —{' '}
            <strong>γι' αυτό πέφτει και κάτω από το μηδέν</strong>. Το σχήμα όμως μένει
            λάθος: όπου το <span className="font-mono">m(t)</span> ήταν αρνητικό, η
            rectification το «αναποδογύρισε» προς τα πάνω, και καμία αφαίρεση DC δεν το
            ξαναγυρίζει. Λύση: <strong>coherent demodulation</strong> (×{' '}
            <span className="font-mono">2cos(2π f_c t)</span> + LPF).
          </p>
        </div>
      </div>
    </figure>
  )
}

const COLOR_MSG = 'rgb(217, 119, 6)' // amber
const COLOR_AM = 'rgb(29, 78, 216)' // blue — AM detector output (clean)
const COLOR_DSB = 'rgb(220, 38, 38)' // red — DSB detector output (broken)
const COLOR_CARRIER = 'rgb(168, 85, 247)' // violet

function computeAMDistortion(mu: number, m: (t: number) => number): number {
  if (mu < 1e-3) return 0
  const N = 600
  let errSq = 0
  let mSq = 0
  for (let i = 0; i < N; i++) {
    const t = (i / N) * (1 / FM) // one message period
    const mv = mu * m(t) // scaled to amplitude mu
    const env = Math.abs(A_C_AM + mv) // envelope detector output
    const mHat = env - A_C_AM // DC-blocked recovered
    errSq += (mHat - mv) ** 2
    mSq += mv * mv
  }
  if (mSq < 1e-9) return 0
  return Math.sqrt(errSq / mSq)
}

function computeDSBDistortion(m: (t: number) => number): number {
  // DSB envelope detector outputs |m(t)|. Error vs true m(t) over one period.
  const N = 600
  let errSq = 0
  let mSq = 0
  // First subtract DC of |m| so the "best linear recovery" is fair
  let dc = 0
  for (let i = 0; i < N; i++) {
    const t = (i / N) * (1 / FM)
    dc += Math.abs(m(t))
  }
  dc /= N
  for (let i = 0; i < N; i++) {
    const t = (i / N) * (1 / FM)
    const mv = m(t)
    const env = Math.abs(mv) - dc // DC-blocked detector output
    errSq += (env - mv) ** 2
    mSq += mv * mv
  }
  if (mSq < 1e-9) return 1
  return Math.sqrt(errSq / mSq)
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  mu: number,
  preset: Preset,
  tNow: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Two columns
  const colW = w / 2
  const PAD = 6

  // Each column has three stacked rows: title, transmitted signal, recovered vs true
  drawColumn(ctx, colors, 0, 0, colW - PAD, h, mu, preset, tNow, 'am')
  // Divider
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(colW, 8)
  ctx.lineTo(colW, h - 8)
  ctx.stroke()
  drawColumn(ctx, colors, colW + PAD, 0, colW - PAD, h, mu, preset, tNow, 'dsb')
}

function drawColumn(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  mu: number,
  preset: Preset,
  tNow: number,
  mode: 'am' | 'dsb',
) {
  if (!colors) return
  const headerH = 22
  // Header
  ctx.fillStyle = colors.fg
  ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  if (mode === 'am') {
    ctx.fillText('AM:  x = [A_c + m]·cos', x0 + 10, y0 + 14)
  } else {
    ctx.fillText('DSB-SC:  x = m·cos', x0 + 10, y0 + 14)
  }

  const innerY = y0 + headerH
  const innerH = ph - headerH
  const topH = innerH * 0.5
  const botH = innerH - topH

  drawTransmitted(ctx, colors, x0, innerY, pw, topH, mu, preset, tNow, mode)
  drawRecovered(ctx, colors, x0, innerY + topH, pw, botH, mu, preset, tNow, mode)
}

function drawTransmitted(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  mu: number,
  preset: Preset,
  tNow: number,
  mode: 'am' | 'dsb',
) {
  if (!colors) return
  const PAD_X = 14
  const PAD_Y = 12
  const tWindow = 7
  const tStart = tNow - tWindow * 0.7
  const tEnd = tNow + tWindow * 0.3
  const yLim = 2.2

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 8, y0 + ph - PAD_Y)
  const yZero = yv(0)

  // Sub-header
  ctx.fillStyle = colors.fgMuted
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Εκπεμπόμενο x(t) (envelope: violet)', x0 + PAD_X, y0 + 10)

  // Zero line
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  const STEPS = 600
  const SIG_STEPS = 1200

  // Envelope ±|env|
  ctx.strokeStyle = COLOR_CARRIER
  ctx.lineWidth = 1.3
  ctx.setLineDash([4, 4])
  for (const sign of [1, -1]) {
    ctx.beginPath()
    for (let i = 0; i <= STEPS; i++) {
      const t = lerp(i, 0, STEPS, tStart, tEnd)
      const m = preset.m(t)
      const env = sign * (mode === 'am' ? Math.abs(A_C_AM + mu * m) : Math.abs(m))
      const px = xt(t)
      const py = yv(env)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }
  ctx.setLineDash([])

  // Transmitted signal x(t)
  ctx.strokeStyle = mode === 'am' ? COLOR_AM : COLOR_DSB
  ctx.lineWidth = 1.1
  ctx.beginPath()
  for (let i = 0; i <= SIG_STEPS; i++) {
    const t = lerp(i, 0, SIG_STEPS, tStart, tEnd)
    const m = preset.m(t)
    const env = mode === 'am' ? A_C_AM + mu * m : m
    const v = env * Math.cos(2 * Math.PI * FC * t)
    const px = xt(t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // For DSB-SC: mark phase-reversal points (zero-crossings of m(t))
  if (mode === 'dsb') {
    ctx.fillStyle = COLOR_DSB
    ctx.font = 'bold 10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    let prev = preset.m(tStart)
    const MS = 400
    for (let i = 1; i <= MS; i++) {
      const t = lerp(i, 0, MS, tStart, tEnd)
      const cur = preset.m(t)
      if (Math.sign(cur) !== Math.sign(prev) && Math.abs(cur - prev) > 0.01) {
        ctx.fillText('↺', xt(t), y0 + PAD_Y + 14)
      }
      prev = cur
    }
  }
}

function drawRecovered(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  mu: number,
  preset: Preset,
  tNow: number,
  mode: 'am' | 'dsb',
) {
  if (!colors) return
  const PAD_X = 14
  const PAD_Y = 12
  const tWindow = 7
  const tStart = tNow - tWindow * 0.7
  const tEnd = tNow + tWindow * 0.3
  const yLim = 1.5

  const xt = (t: number) => lerp(t, tStart, tEnd, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_Y + 8, y0 + ph - PAD_Y)
  const yZero = yv(0)

  // Sub-header
  ctx.fillStyle = colors.fgMuted
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Μετά detector + DC-block:  m̂  vs  m', x0 + PAD_X, y0 + 10)

  // Zero line
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  const STEPS = 360

  // Pre-compute DC offset for DSB |m| so the "best linear comparison" is centred
  let dcOffset = 0
  if (mode === 'dsb') {
    let sum = 0
    const NN = 240
    for (let i = 0; i < NN; i++) {
      const t = (i / NN) * (1 / FM)
      sum += Math.abs(preset.m(t))
    }
    dcOffset = sum / NN
  }

  // Fill the error band between recovered and true
  ctx.fillStyle =
    mode === 'am' ? 'rgba(29, 78, 216, 0.12)' : 'rgba(220, 38, 38, 0.18)'
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const m = preset.m(t)
    const recovered =
      mode === 'am'
        ? Math.abs(A_C_AM + mu * m) - A_C_AM
        : Math.abs(m) - dcOffset
    const px = xt(t)
    const py = yv(recovered)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  for (let i = STEPS; i >= 0; i--) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const m = preset.m(t)
    const mScaled = mode === 'am' ? mu * m : m
    ctx.lineTo(xt(t), yv(mScaled))
  }
  ctx.closePath()
  ctx.fill()

  // True m(t)
  ctx.strokeStyle = COLOR_MSG
  ctx.lineWidth = 1.4
  ctx.setLineDash([4, 3])
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const m = preset.m(t)
    const v = mode === 'am' ? mu * m : m
    const px = xt(t)
    const py = yv(v)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // Recovered m̂(t)
  ctx.strokeStyle = mode === 'am' ? COLOR_AM : COLOR_DSB
  ctx.lineWidth = 1.8
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, tStart, tEnd)
    const m = preset.m(t)
    const recovered =
      mode === 'am'
        ? Math.abs(A_C_AM + mu * m) - A_C_AM
        : Math.abs(m) - dcOffset
    const px = xt(t)
    const py = yv(recovered)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
}
