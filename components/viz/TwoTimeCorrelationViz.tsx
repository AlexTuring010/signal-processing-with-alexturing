'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'
import { mulberry32, uniform } from '@/lib/random'

/**
 * TwoTimeCorrelationViz — what R_X(t_i, t_j) actually measures, in the
 * two-time language this page uses (NO τ, NO PSD, NO Wiener-Khinchin — those
 * are built on the next pages).
 *
 * The autocorrelation R_X(t_i, t_j) = E[X(t_i) X(t_j)] is nothing more than
 * the covariance-style "do these two agree?" between the SAME process sampled
 * at two different times. This makes that literal, reusing the green/red
 * product-sign device from the Cov(X,Y) scatter on the random-variables page:
 *
 *   - Top panel: an ensemble of realizations x(t). Two vertical markers at the
 *     chosen times t_i (blue) and t_j (amber). The dots where the markers cross
 *     each realization ARE the random variables X(t_i), X(t_j).
 *   - Bottom panel: the scatter of every pair (X(t_i), X(t_j)) across the
 *     ensemble, each dot colored by the sign of X(t_i)·X(t_j) — green pushes
 *     R_X up, red pulls it down. R_X is just the AVERAGE of those products.
 *
 * Drag t_i, t_j and watch:
 *   - t_i ≈ t_j        → perfect diagonal, all green, R_X(t,t) = E[X²] = power.
 *   - small |t_i−t_j|  → tight diagonal cloud, R_X large (process is "slow").
 *   - large |t_i−t_j|  → round blob, greens & reds balance, R_X ≈ 0.
 *
 * Two presets: random-phase cosine (crisp elliptical cloud) and a slow
 * lowpass-noise process (genuinely fuzzy cloud, finite memory).
 *
 * Subscripts in the canvas are drawn manually (drawSubscripted) rather than
 * with unicode subscript glyphs, which have unreliable font coverage.
 */

const T_SPAN = 4 // seconds shown
const F0 = 0.5 // cosine freq → period 2 s, two periods across the window
const A = 1
const N = 24 // ensemble members (what we draw AND average — honest estimate)
const LP_M = 12 // sinusoids per lowpass realization
const LP_B = 0.6 // lowpass bandwidth (Hz) → memory length ~ 1/(2B) ≈ 0.8 s
const LP_SCALE = Math.sqrt(2 / LP_M) // → unit-variance lowpass process

const TJ_C = (c: ThemeColors) => c.warn // t_j marker / axis colour (amber)

type PresetId = 'cosine' | 'lowpass'

type Member =
  | { kind: 'cosine'; phi: number }
  | { kind: 'lowpass'; fs: number[]; ps: number[] }

function buildEnsemble(preset: PresetId, seed: number): Member[] {
  const rng = mulberry32(seed || 1)
  const out: Member[] = []
  for (let k = 0; k < N; k++) {
    if (preset === 'cosine') {
      out.push({ kind: 'cosine', phi: uniform(rng, 0, 2 * Math.PI) })
    } else {
      const fs: number[] = []
      const ps: number[] = []
      for (let m = 0; m < LP_M; m++) {
        fs.push(uniform(rng, 0.03, LP_B))
        ps.push(uniform(rng, 0, 2 * Math.PI))
      }
      out.push({ kind: 'lowpass', fs, ps })
    }
  }
  return out
}

function evalX(m: Member, t: number): number {
  if (m.kind === 'cosine') return A * Math.cos(2 * Math.PI * F0 * t + m.phi)
  let s = 0
  for (let i = 0; i < m.fs.length; i++) s += Math.cos(2 * Math.PI * m.fs[i] * t + m.ps[i])
  return LP_SCALE * s
}

const yLimFor = (preset: PresetId) => (preset === 'cosine' ? 1.4 : 2.8)

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

export function TwoTimeCorrelationViz() {
  const [preset, setPreset] = useState<PresetId>('cosine')
  const [seed, setSeed] = useState(7)
  const [ti, setTi] = useState(1.0)
  const [tj, setTj] = useState(1.2)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const ensemble = useMemo(() => buildEnsemble(preset, seed), [preset, seed])

  const stats = useMemo(() => {
    let sij = 0
    let sii = 0
    let sjj = 0
    for (const m of ensemble) {
      const xi = evalX(m, ti)
      const xj = evalX(m, tj)
      sij += xi * xj
      sii += xi * xi
      sjj += xj * xj
    }
    const n = ensemble.length
    const Rij = sij / n
    const denom = Math.sqrt((sii / n) * (sjj / n))
    const rho = denom > 1e-9 ? Rij / denom : 0
    return { Rij, rho }
  }, [ensemble, ti, tj])

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    const render = () => {
      if (canvas && colors) drawScene(canvas, colors, ensemble, ti, tj)
    }
    render()
    window.addEventListener('resize', render)
    return () => window.removeEventListener('resize', render)
  }, [ensemble, ti, tj])

  const dt = Math.abs(ti - tj)
  const coincide = dt < 0.06
  const verdict = coincide
    ? 'ίδια στιγμή: R = E[X²] (ισχύς)'
    : stats.rho > 0.7
      ? 'ισχυρά συσχετισμένα'
      : stats.rho < -0.7
        ? 'αντι-συσχετισμένα'
        : Math.abs(stats.rho) < 0.25
          ? 'σχεδόν ασυσχέτιστα'
          : 'μερικώς συσχετισμένα'

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Τι μετράει η R<sub>X</sub>(t<sub>i</sub>, t<sub>j</sub>) — συσχέτιση δύο χρονικών στιγμών
        </h4>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
        >
          Νέα δειγματοληψία
        </button>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {(
          [
            ['cosine', 'cos(2π f₀ t + Θ) — τυχαία φάση'],
            ['lowpass', 'Αργός θόρυβος (lowpass)'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPreset(id)}
            className={`rounded-full border px-2.5 py-1 text-xs ${
              preset === id
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 380 }}
        className="block h-[380px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Ensemble δύο χρονικών στιγμών και το scatter των τιμών τους"
      />

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <SliderBlock
          label={
            <>
              t<sub>i</sub> <span className="text-accent">(μπλε)</span>
            </>
          }
          value={ti}
          min={0}
          max={T_SPAN}
          step={0.05}
          onChange={setTi}
          accentColor="rgb(var(--accent))"
          fmt={(v) => `${v.toFixed(2)} s`}
        />
        <SliderBlock
          label={
            <>
              t<sub>j</sub> <span style={{ color: 'rgb(var(--warn))' }}>(πορτοκαλί)</span>
            </>
          }
          value={tj}
          min={0}
          max={T_SPAN}
          step={0.05}
          onChange={setTj}
          accentColor="rgb(var(--warn))"
          fmt={(v) => `${v.toFixed(2)} s`}
        />
      </div>

      <div className="mt-3 grid gap-2 rounded-md border border-accent/30 bg-accent-soft/20 px-3 py-2 text-xs sm:grid-cols-3">
        <Stat
          label={
            <>
              R<sub>X</sub>(t<sub>i</sub>, t<sub>j</sub>) ≈
            </>
          }
          value={stats.Rij.toFixed(2)}
        />
        <Stat
          label={
            <>
              Δt = |t<sub>i</sub> − t<sub>j</sub>|
            </>
          }
          value={`${dt.toFixed(2)} s`}
        />
        <Stat label="Τι βλέπεις" value={verdict} />
      </div>

      <p className="mt-3 text-xs leading-relaxed text-fg-muted">
        Κάθε σημείο κάτω είναι ένα ζεύγος (X(t<sub>i</sub>), X(t<sub>j</sub>)) από{' '}
        <strong>ένα</strong> δείγμα του ensemble — ακριβώς όπως το scatter δύο ΤΜ στη σελίδα{' '}
        <a className="text-accent hover:underline" href="/randomness/random-variables">
          Random variables
        </a>
        , μόνο που τώρα οι δύο ΤΜ είναι η <strong>ίδια</strong> διαδικασία σε δύο χρόνους. Χρώμα =
        πρόσημο του γινομένου X(t<sub>i</sub>)·X(t<sub>j</sub>):{' '}
        <span className="text-emerald-600 dark:text-emerald-400">πράσινο</span> σπρώχνει την R
        <sub>X</sub> προς τα πάνω, <span className="text-red-600 dark:text-red-400">κόκκινο</span> προς
        τα κάτω.{' '}
        <strong>
          Η R<sub>X</sub>(t<sub>i</sub>, t<sub>j</sub>) είναι ο μέσος όρος αυτών των γινομένων.
        </strong>{' '}
        Φέρε τα t<sub>i</sub>, t<sub>j</sub> κοντά → στενή διαγώνιος, μεγάλη R<sub>X</sub>·
        απομάκρυνέ τα → η νέφη στρογγυλεύει και η R<sub>X</sub> πέφτει στο μηδέν.
      </p>
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
  accentColor,
}: {
  label: ReactNode
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  fmt: (v: number) => string
  accentColor: string
}) {
  return (
    <div className="text-xs">
      <label className="block text-fg-muted">
        {label} = <span className="font-mono text-fg tabular-nums">{fmt(value)}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ accentColor }}
        className="mt-1 w-full"
      />
    </div>
  )
}

function Stat({ label, value }: { label: ReactNode; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="font-mono text-sm tabular-nums text-fg">{value}</div>
    </div>
  )
}

/**
 * Draw `base` followed by a smaller `sub` subscript, as one group aligned at x.
 * Manual subscripting avoids unicode subscript glyphs (patchy font coverage).
 */
function drawSubscripted(
  ctx: CanvasRenderingContext2D,
  base: string,
  sub: string,
  tail: string,
  x: number,
  y: number,
  align: 'left' | 'right' | 'center',
  color: string,
  size: number,
): number {
  const baseFont = `${size}px ui-sans-serif, system-ui, sans-serif`
  const subFont = `${Math.round(size * 0.78)}px ui-sans-serif, system-ui, sans-serif`
  ctx.font = baseFont
  const wBase = ctx.measureText(base).width
  const wTail = ctx.measureText(tail).width
  ctx.font = subFont
  const wSub = ctx.measureText(sub).width
  const total = wBase + wSub + wTail
  const startX = align === 'left' ? x : align === 'right' ? x - total : x - total / 2
  ctx.fillStyle = color
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.font = baseFont
  ctx.fillText(base, startX, y)
  ctx.font = subFont
  ctx.fillText(sub, startX + wBase, y + size * 0.22)
  if (tail) {
    ctx.font = baseFont
    ctx.fillText(tail, startX + wBase + wSub, y)
  }
  return total
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  ensemble: Member[],
  ti: number,
  tj: number,
) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const GAP = 26
  const timeH = 150
  const scatterTop = timeH + GAP

  drawTimePanel(ctx, colors, 0, 0, w, timeH, ensemble, ti, tj)
  drawScatterPanel(ctx, colors, 0, scatterTop, w, h - scatterTop, ensemble, ti, tj)
}

function drawTimePanel(
  ctx: CanvasRenderingContext2D,
  colors: ThemeColors,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  ensemble: Member[],
  ti: number,
  tj: number,
) {
  const padL = 30
  const padR = 16
  const padT = 18
  const padB = 18
  const yLim = ensemble[0]?.kind === 'cosine' ? yLimFor('cosine') : yLimFor('lowpass')
  const xt = (t: number) => lerp(t, 0, T_SPAN, x0 + padL, x0 + pw - padR)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + padT, y0 + ph - padB)
  const yZero = yv(0)

  // short panel label (the figure heading already says the full story)
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('Ensemble x(t)', x0 + padL, y0 + 10)

  // zero baseline
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(x0 + padL, yZero)
  ctx.lineTo(x0 + pw - padR, yZero)
  ctx.stroke()

  // x-axis ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let t = 0; t <= T_SPAN; t++) ctx.fillText(`${t}s`, xt(t), y0 + ph - 5)

  // faint ensemble of realizations
  const STEPS = 200
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1
  ctx.globalAlpha = 0.16
  for (const m of ensemble) {
    ctx.beginPath()
    for (let s = 0; s <= STEPS; s++) {
      const t = (s / STEPS) * T_SPAN
      const x = xt(t)
      const y = yv(clamp(evalX(m, t), -yLim, yLim))
      if (s === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  // marker lines
  const lineTop = y0 + padT - 2
  const lineBot = y0 + ph - padB
  drawMarkerLine(ctx, xt(ti), lineTop, lineBot, colors.accent)
  drawMarkerLine(ctx, xt(tj), lineTop, lineBot, TJ_C(colors))

  // the value of every realization at t_i and t_j — these ARE X(t_i), X(t_j)
  for (const m of ensemble) {
    drawDot(ctx, xt(ti), yv(clamp(evalX(m, ti), -yLim, yLim)), colors.accent, colors.bg)
    drawDot(ctx, xt(tj), yv(clamp(evalX(m, tj), -yLim, yLim)), TJ_C(colors), colors.bg)
  }

  // marker labels last, on opaque chips so they stay readable over everything
  drawChipLabel(ctx, 't', 'i', xt(ti), lineTop, colors.accent, colors.bg)
  drawChipLabel(ctx, 't', 'j', xt(tj), lineTop, TJ_C(colors), colors.bg)
}

function drawMarkerLine(
  ctx: CanvasRenderingContext2D,
  x: number,
  yTop: number,
  yBot: number,
  color: string,
) {
  ctx.strokeStyle = color
  ctx.globalAlpha = 0.85
  ctx.lineWidth = 1.5
  ctx.setLineDash([4, 3])
  ctx.beginPath()
  ctx.moveTo(x, yTop)
  ctx.lineTo(x, yBot)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1
}

function drawDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  fill: string,
  stroke: string,
) {
  ctx.beginPath()
  ctx.arc(x, y, 2.6, 0, 2 * Math.PI)
  ctx.fillStyle = fill
  ctx.fill()
  ctx.lineWidth = 0.8
  ctx.strokeStyle = stroke
  ctx.stroke()
}

function drawChipLabel(
  ctx: CanvasRenderingContext2D,
  base: string,
  sub: string,
  x: number,
  yTop: number,
  color: string,
  bg: string,
) {
  // measure the t+subscript group to size the opaque chip behind it
  ctx.font = 'bold 10px ui-sans-serif, system-ui, sans-serif'
  const wBase = ctx.measureText(base).width
  ctx.font = 'bold 8px ui-sans-serif, system-ui, sans-serif'
  const wSub = ctx.measureText(sub).width
  const w = wBase + wSub
  ctx.fillStyle = bg
  ctx.fillRect(x - w / 2 - 2, yTop - 11, w + 4, 12)
  drawSubscripted(ctx, base, sub, '', x, yTop - 2, 'center', color, 10)
}

function drawScatterPanel(
  ctx: CanvasRenderingContext2D,
  colors: ThemeColors,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  ensemble: Member[],
  ti: number,
  tj: number,
) {
  // title (subscript-free wording; the axes carry X(t_i)/X(t_j))
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('Ζεύγη τιμών στις δύο στιγμές — όλο το ensemble', x0 + 8, y0 + 4)

  const vr = ensemble[0]?.kind === 'cosine' ? yLimFor('cosine') : yLimFor('lowpass')
  const titleH = 14
  const side = Math.min(pw - 16, ph - titleH - 6)
  const left = x0 + (pw - side) / 2
  const top = y0 + titleH
  const right = left + side
  const bottom = top + side

  const sx = (v: number) => lerp(v, -vr, vr, left, right)
  const sy = (v: number) => lerp(v, vr, -vr, top, bottom)

  // frame
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.strokeRect(left, top, side, side)

  // axes through origin
  ctx.strokeStyle = colors.fgMuted
  ctx.globalAlpha = 0.5
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(left, sy(0))
  ctx.lineTo(right, sy(0))
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(sx(0), top)
  ctx.lineTo(sx(0), bottom)
  ctx.stroke()
  ctx.globalAlpha = 1

  // diagonal X(t_i) = X(t_j): where the cloud collapses when fully correlated
  ctx.strokeStyle = colors.fgSubtle
  ctx.setLineDash([4, 4])
  ctx.globalAlpha = 0.6
  ctx.beginPath()
  ctx.moveTo(sx(-vr), sy(-vr))
  ctx.lineTo(sx(vr), sy(vr))
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1

  // the pairs, colored by sign of the product (the term R_X averages)
  for (const m of ensemble) {
    const xi = evalX(m, ti)
    const xj = evalX(m, tj)
    ctx.fillStyle = xi * xj >= 0 ? colors.success : colors.danger
    ctx.globalAlpha = 0.82
    ctx.beginPath()
    ctx.arc(sx(clamp(xi, -vr, vr)), sy(clamp(xj, -vr, vr)), 3, 0, 2 * Math.PI)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  // axis labels, tinted to match the time-panel markers
  drawSubscripted(ctx, 'X(t', 'i', ')', right - 4, bottom - 5, 'right', colors.accent, 11)
  drawSubscripted(ctx, 'X(t', 'j', ')', left + 5, top + 11, 'left', TJ_C(colors), 11)
}
