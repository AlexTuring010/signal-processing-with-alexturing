'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * The Fourier-transform "cosine form" made concrete (FT chapter §8.1).
 *
 * For real x(t), conjugate symmetry collapses the inverse transform to a
 * one-sided integral of cosines:
 *     x(t) = ∫₀^∞ 2|X(f)| cos(2πft + ∠X(f)) df
 * the continuous limit of the Fourier-series cosine form
 *     x(t) = A₀ + Σ 2|aₖ| cos(2πkf₀t + ∠aₖ).
 *
 * We reconstruct the chapter's protagonist — a rectangular pulse rect(t/T),
 * X(f) = T·sinc(fT) — as a Riemann sum of cosine slices, sweeping how many
 * frequencies we include. Because rect is even, X is real, so ∠X(f) ∈ {0, π}
 * and a real slice is 2·sinc(fₙ)·cos(2πfₙt)·Δf (the sinc's sign IS the phase).
 *
 * The "ignore phase" toggle drops ∠X (uses 2|sinc| with phase 0 everywhere):
 * the negative lobes stop subtracting and the pulse collapses — the visceral
 * proof that the phase spectrum is half the information.
 */

const T = 1 // pulse width — rect(t/T), so x(t) = 1 for |t| < 0.5
const DF = 0.1 // frequency step of the Riemann sum
const N_MAX = 60
const F_DOMAIN = 6.5 // top panel frequency window
const T_DOMAIN = 2.2 // bottom panel time window

function sinc(x: number) {
  if (Math.abs(x) < 1e-9) return 1
  return Math.sin(Math.PI * x) / (Math.PI * x)
}

/** X(f) for rect(t/T): real-valued T·sinc(fT). */
function X(f: number) {
  return T * sinc(f * T)
}

/** Reconstruct x̂(t) from the first N one-sided cosine slices. */
function reconstruct(t: number, n: number, includePhase: boolean) {
  let sum = 0
  for (let k = 1; k <= n; k++) {
    const f = (k - 0.5) * DF
    // 2|X|cos(2πft+∠X) = 2·X·cos(2πft) for real X (sign = phase).
    // Ignoring phase means using the magnitude 2|X| with phase 0.
    const amp = includePhase ? X(f) : Math.abs(X(f))
    sum += 2 * amp * Math.cos(2 * Math.PI * f * t) * DF
  }
  return sum
}

export function FtCosineSynthesisViz() {
  const [n, setN] = useState(15)
  const [includePhase, setIncludePhase] = useState(true)

  const specRef = useRef<HTMLCanvasElement | null>(null)
  const reconRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (specRef.current) drawSpectrum(specRef.current, colors, n, includePhase)
    if (reconRef.current) drawRecon(reconRef.current, colors, n, includePhase)
  }, [n, includePhase])

  const fMax = (n * DF).toFixed(1)

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Η cosine μορφή: ένας παλμός χτισμένος από cosines
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Ανακατασκευάζουμε τον τετραγωνικό παλμό <span className="font-mono">rect(t/T)</span> ως{' '}
        <strong>συνεχές άθροισμα από cosines</strong>:{' '}
        <span className="font-mono">x(t) = ∫₀^∞ 2|X(f)|·cos(2πft + ∠X(f)) df</span>. Σύρε για να
        προσθέσεις περισσότερες συχνότητες — κάθε μία είναι ένα cosine πλάτους{' '}
        <span className="font-mono">2|X(f)|·Δf</span> και φάσης <span className="font-mono">∠X(f)</span>.
      </p>

      <Panel title="Πλάτος cosine ανά συχνότητα" subtitle="2|X(f)| = 2T·|sinc(fT)| (one-sided)">
        <canvas
          ref={specRef}
          style={{ height: 140 }}
          className="block h-[140px] w-full"
          aria-label="One-sided cosine amplitude across frequency"
        />
      </Panel>

      <div className="mt-2">
        <Panel title="Ανακατασκευή x̂(t)" subtitle="άθροισμα cosines vs ο πραγματικός παλμός">
          <canvas
            ref={reconRef}
            style={{ height: 180 }}
            className="block h-[180px] w-full"
            aria-label="Reconstructed signal versus the true rectangular pulse"
          />
        </Panel>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <label className="flex-1 text-xs text-fg-muted" style={{ minWidth: 200 }}>
          Cosines: <span className="font-mono text-fg tabular-nums">{n}</span>
          {' · '}συχνότητες έως{' '}
          <span className="font-mono text-fg tabular-nums">f = {fMax}</span> Hz
          <input
            type="range"
            min={1}
            max={N_MAX}
            step={1}
            value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Number of cosine slices"
          />
        </label>
        <label className="flex items-center gap-1.5 text-xs text-fg-muted">
          <input
            type="checkbox"
            checked={includePhase}
            onChange={(e) => setIncludePhase(e.target.checked)}
            className="h-3.5 w-3.5"
          />
          συμπεριέλαβε τη φάση <span className="font-mono">∠X(f)</span>
        </label>
      </div>

      <figcaption
        className={`mt-3 rounded-md border px-3 py-2 text-xs ${
          includePhase
            ? 'border-border bg-bg text-fg-muted'
            : 'border-danger/40 bg-danger/10 text-fg-muted'
        }`}
      >
        {includePhase ? (
          <>
            <strong>Όσο περισσότερες συχνότητες, τόσο πιο κοφτός ο παλμός</strong> (το «κυμάτισμα» στις
            ακμές είναι το φαινόμενο Gibbs). Στο όριο <span className="font-mono">f → ∞</span> το
            άθροισμα γίνεται το ολοκλήρωμα και βγάζει ακριβώς το <span className="font-mono">rect</span>.
            Ίδια ιδέα με τη σειρά Fourier — απλώς συνεχές <span className="font-mono">f</span> αντί για
            διακριτό <span className="font-mono">k</span>.
          </>
        ) : (
          <>
            <strong>Φάση αγνοημένη.</strong> Χρησιμοποιούμε μόνο το <span className="font-mono">2|X(f)|</span>{' '}
            με φάση 0 — οι αρνητικοί λοβοί του sinc (που έπρεπε να <em>αφαιρεθούν</em>) προστίθενται
            τώρα θετικά, και ο παλμός <strong>καταρρέει</strong>. Η φάση δεν είναι διακόσμηση: κουβαλάει
            μισή την πληροφορία. Ξαναάναψέ τη.
          </>
        )}
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
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-3 py-1.5">
        <span className="text-[11px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

const PAD_X = 34
const PAD_Y = 16
const STEPS = 500

function drawSpectrum(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  n: number,
  includePhase: boolean,
) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const fMax = n * DF

  const peak = 2 * T // 2|X(0)|
  const xt = (f: number) => lerp(f, 0, F_DOMAIN, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, peak * 1.15, -peak * 0.12, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X / 2, yZero)
  ctx.moveTo(PAD_X, PAD_Y / 2)
  ctx.lineTo(PAD_X, h - PAD_Y)
  ctx.stroke()

  // shaded "included band" [0, fMax] under the magnitude curve
  ctx.fillStyle = colors.accent
  ctx.globalAlpha = 0.12
  ctx.beginPath()
  ctx.moveTo(xt(0), yZero)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, 0, Math.min(fMax, F_DOMAIN))
    ctx.lineTo(xt(f), yv(2 * Math.abs(X(f))))
  }
  ctx.lineTo(xt(Math.min(fMax, F_DOMAIN)), yZero)
  ctx.closePath()
  ctx.fill()
  ctx.globalAlpha = 1

  // magnitude curve: accent within the band, faint grey beyond fMax
  for (let pass = 0; pass < 2; pass++) {
    ctx.beginPath()
    let started = false
    for (let i = 0; i <= STEPS; i++) {
      const f = lerp(i, 0, STEPS, 0, F_DOMAIN)
      const inBand = f <= fMax
      if ((pass === 0) !== inBand) {
        started = false
        continue
      }
      const px = xt(f)
      const py = yv(2 * Math.abs(X(f)))
      if (!started) {
        ctx.moveTo(px, py)
        started = true
      } else ctx.lineTo(px, py)
    }
    ctx.strokeStyle = pass === 0 ? colors.accent : colors.fgSubtle
    ctx.globalAlpha = pass === 0 ? 1 : 0.5
    ctx.lineWidth = pass === 0 ? 2.2 : 1.4
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  // mark the "phase π" lobes (sinc < 0) inside the band, as a red strip on the axis
  if (includePhase) {
    ctx.strokeStyle = colors.danger
    ctx.lineWidth = 3
    let started = false
    for (let i = 0; i <= STEPS; i++) {
      const f = lerp(i, 0, STEPS, 0, F_DOMAIN)
      const neg = f <= fMax && X(f) < 0
      if (neg && !started) {
        ctx.beginPath()
        ctx.moveTo(xt(f), yZero + 4)
        started = true
      } else if (!neg && started) {
        ctx.lineTo(xt(lerp(i - 1, 0, STEPS, 0, F_DOMAIN)), yZero + 4)
        ctx.stroke()
        started = false
      }
    }
    if (started) {
      ctx.lineTo(xt(fMax), yZero + 4)
      ctx.stroke()
    }
  }

  // fMax marker
  if (fMax < F_DOMAIN) {
    ctx.strokeStyle = colors.fgMuted
    ctx.setLineDash([3, 3])
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(xt(fMax), PAD_Y / 2)
    ctx.lineTo(xt(fMax), h - PAD_Y)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = colors.fgMuted
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('f_max', xt(fMax) + 3, PAD_Y + 4)
  }

  // labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('f', w - PAD_X / 2, yZero - 4)
  ctx.textAlign = 'center'
  for (const fk of [1, 2, 3, 4, 5]) ctx.fillText(`${fk}`, xt(fk), yZero + 13)
  if (includePhase) {
    ctx.fillStyle = colors.danger
    ctx.textAlign = 'left'
    ctx.fillText('κόκκινο = φάση π (ανεστραμμένος λοβός)', PAD_X + 2, h - 3)
  } else {
    ctx.fillStyle = colors.fgMuted
    ctx.textAlign = 'left'
    ctx.fillText('φάση = 0 παντού (αγνοημένη)', PAD_X + 2, h - 3)
  }
}

function drawRecon(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  n: number,
  includePhase: boolean,
) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const yMax = 1.35
  const yMin = -0.4
  const xt = (t: number) => lerp(t, -T_DOMAIN, T_DOMAIN, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, yMin, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X / 2, yZero)
  ctx.moveTo(xt(0), PAD_Y / 2)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // true rect (dashed)
  ctx.strokeStyle = colors.fgSubtle
  ctx.setLineDash([4, 3])
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(xt(-T_DOMAIN), yv(0))
  ctx.lineTo(xt(-0.5), yv(0))
  ctx.lineTo(xt(-0.5), yv(1))
  ctx.lineTo(xt(0.5), yv(1))
  ctx.lineTo(xt(0.5), yv(0))
  ctx.lineTo(xt(T_DOMAIN), yv(0))
  ctx.stroke()
  ctx.setLineDash([])

  // reconstruction
  ctx.strokeStyle = includePhase ? colors.accent : colors.danger
  ctx.lineWidth = 2.2
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, -T_DOMAIN, T_DOMAIN)
    const v = reconstruct(t, n, includePhase)
    const px = xt(t)
    // clamp into the panel: ignoring phase makes ∫|sinc| diverge at t=0, so the
    // curve would otherwise shoot off-canvas — a pegged plateau reads as "wrong".
    const py = Math.max(PAD_Y, Math.min(h - PAD_Y, yv(v)))
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // labels / ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('−T/2', xt(-0.5), yZero + 13)
  ctx.fillText('+T/2', xt(0.5), yZero + 13)
  ctx.textAlign = 'right'
  ctx.fillText('1', PAD_X - 4, yv(1) + 3)
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('t', w - PAD_X / 2, yZero - 4)

  // legend
  ctx.textAlign = 'left'
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('– – πραγματικό rect', PAD_X + 2, PAD_Y + 2)
  ctx.fillStyle = includePhase ? colors.accent : colors.danger
  ctx.fillText('— άθροισμα cosines', PAD_X + 2, PAD_Y + 15)
}
