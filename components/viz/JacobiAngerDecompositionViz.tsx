'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { besselJ } from '@/lib/bessel'

/**
 * Decomposition viz για την Jacobi-Anger / Fourier-series ταυτότητα του
 * καθηγητή (slides 36 + 44 του SE_session15_16_16_FM.pdf):
 *
 *   cos(β sin θ) = J_0(β) + 2 J_2(β) cos(2θ) + 2 J_4(β) cos(4θ) + …
 *   sin(β sin θ) = 2 J_1(β) sin(θ) + 2 J_3(β) sin(3θ) + 2 J_5(β) sin(5θ) + …
 *
 * (Equivalently: e^{jβ sin θ} = Σ_n J_n(β) e^{jnθ}.)
 *
 * Τρία panels (A4r «three-stacked-panel cancellation» pattern):
 *
 *   Panel A — target: cos(β sin θ), η περιοδική συνάρτηση που θέλουμε.
 *   Panel B — όρος-όρος: κάθε individual term J_{2k}(β) cos(2kθ) σχεδιασμένο
 *             ξεχωριστά (faint αν δεν είναι μέσα στο επιλεγμένο n_max).
 *   Panel C — accumulated sum: η συσσωρευμένη σειρά μέχρι το n_max.
 *             Όταν n_max → ∞, το Panel C ταυτίζεται με το Panel A.
 *
 * Sliders: β, n_max (πόσους όρους να αθροίσουμε).
 * Toggle: cos-component (slide 36 eq. 4.148) ή sin-component (4.148 second line).
 *
 * Η πλαισιωμένη παρατήρηση: ότι μόλις πολλαπλασιαστούν με cos(2π f_c t)/sin(2π f_c t)
 * αυτές οι αρμονικές 2kθ / (2k+1)θ μετατοπίζονται στο φάσμα γύρω από f_c — βγάζοντας
 * τα γνωστά sidebands στις f_c ± n f_m με ύψος A_c J_n(β).
 */

const SAMPLES = 240
const PRESETS = [
  { label: 'β = 0.5', beta: 0.5 },
  { label: 'β = 1', beta: 1.0 },
  { label: 'β = 2.4', beta: 2.405 },
  { label: 'β = 5', beta: 5.0 },
]

type Mode = 'cos' | 'sin'

export function JacobiAngerDecompositionViz() {
  const [beta, setBeta] = useState(2.405)
  const [nMax, setNMax] = useState(4)
  const [mode, setMode] = useState<Mode>('cos')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (canvasRef.current && colors) draw(canvasRef.current, colors, beta, nMax, mode)

    const onResize = () => {
      const c = getThemeColors()
      if (canvasRef.current && c) draw(canvasRef.current, c, beta, nMax, mode)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [beta, nMax, mode])

  // Compute relative error in panel C vs panel A at the chosen n_max
  const matchError = computeMatchError(beta, nMax, mode)
  const matches = matchError < 0.02
  const j0 = besselJ(0, beta)
  const j2 = besselJ(2, beta)
  const j4 = besselJ(4, beta)
  const j1 = besselJ(1, beta)
  const j3 = besselJ(3, beta)
  const j5 = besselJ(5, beta)

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Από πού βγαίνουν οι J_n(β); — Fourier ανάπτυξη του cos/sin(β sin θ)
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setBeta(p.beta)}
              className={`rounded-full border px-2.5 py-0.5 text-xs ${
                Math.abs(beta - p.beta) < 0.01
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-3 text-xs text-fg-muted">
        Πάνω: <strong>η συνάρτηση που θέλουμε</strong> ({mode === 'cos' ? 'cos' : 'sin'}(β sin θ)).
        Μεσαία: <strong>κάθε όρος ξεχωριστά</strong> ως J<sub>n</sub>(β)·{mode === 'cos' ? 'cos' : 'sin'}(nθ).
        Κάτω: <strong>τα προστιθέμενα</strong> έως n ≤ n_max. Σύρε το n_max: στους
        λίγους όρους η αναπαράσταση φαίνεται απλοϊκή· καθώς προσθέτεις περισσότερους, η
        αθροισμένη καμπύλη γίνεται όλο και πιο ίδια με την target.
      </p>

      <div className="mb-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode('cos')}
          className={`rounded-md border px-2.5 py-1 text-xs ${
            mode === 'cos'
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg'
          }`}
        >
          cos(β sin θ) — άρτιες αρμονικές (4.148α)
        </button>
        <button
          type="button"
          onClick={() => setMode('sin')}
          className={`rounded-md border px-2.5 py-1 text-xs ${
            mode === 'sin'
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg'
          }`}
        >
          sin(β sin θ) — περιττές αρμονικές (4.148β)
        </button>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 460 }}
        className="block h-[460px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Three-panel Bessel decomposition of cos(β sin θ)"
      />

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            β = <span className="font-mono text-fg tabular-nums">{beta.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0}
            max={8}
            step={0.01}
            value={beta}
            onChange={(e) => setBeta(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Modulation index beta"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            n_max ={' '}
            <span className="font-mono text-fg tabular-nums">{nMax}</span>{' '}
            <span className="text-fg-subtle">
              ({mode === 'cos'
                ? `έως ${nMax % 2 === 0 ? nMax : nMax - 1}·θ`
                : `έως (${nMax % 2 === 1 ? nMax : nMax - 1})·θ`})
            </span>
          </label>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={nMax}
            onChange={(e) => setNMax(parseInt(e.target.value, 10))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Number of Bessel terms"
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs sm:grid-cols-6">
        {mode === 'cos' ? (
          <>
            <Stat label="J₀(β)" value={j0.toFixed(3)} />
            <Stat label="J₂(β)" value={j2.toFixed(3)} />
            <Stat label="J₄(β)" value={j4.toFixed(3)} />
            <Stat label="Σφάλμα C↔A" value={matchError.toFixed(3)} highlight={!matches} />
            <Stat label="2J₂" value={(2 * j2).toFixed(3)} />
            <Stat label="2J₄" value={(2 * j4).toFixed(3)} />
          </>
        ) : (
          <>
            <Stat label="J₁(β)" value={j1.toFixed(3)} />
            <Stat label="J₃(β)" value={j3.toFixed(3)} />
            <Stat label="J₅(β)" value={j5.toFixed(3)} />
            <Stat label="Σφάλμα C↔A" value={matchError.toFixed(3)} highlight={!matches} />
            <Stat label="2J₁" value={(2 * j1).toFixed(3)} />
            <Stat label="2J₃" value={(2 * j3).toFixed(3)} />
          </>
        )}
      </div>

      {matches ? (
        <div className="mt-3 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs">
          <strong>✓ Σύγκλιση.</strong> Με n_max = {nMax} το άθροισμα συμπίπτει με
          την target με σφάλμα {matchError.toFixed(3)}. Όσοι περισσότεροι όροι,
          τόσο πιο τέλεια η ταύτιση. Εδώ φαίνεται καθαρά γιατί οι{' '}
          <span className="font-mono">J_n(β)</span> «κωδικοποιούν» την μη-γραμμική
          συνάρτηση cos(β sin θ): είναι ακριβώς οι Fourier συντελεστές της.
        </div>
      ) : (
        <div className="mt-3 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs">
          <strong>Χρειάζονται περισσότεροι όροι.</strong> Στο β ={' '}
          <span className="font-mono">{beta.toFixed(2)}</span> με n_max = {nMax}
          απομένει σφάλμα {matchError.toFixed(3)}. Σύρε το n_max ψηλότερα — βλέπεις
          την σύγκλιση να συμβαίνει.
        </div>
      )}
    </figure>
  )
}

function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-md border px-2 py-1 ${
        highlight ? 'border-amber-500/40 bg-amber-500/10' : 'border-border bg-bg-soft'
      }`}
    >
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="font-mono text-fg tabular-nums">{value}</div>
    </div>
  )
}

const TARGET_C = 'rgb(29, 78, 216)'
const TERM_BASE_C = ['rgb(126, 58, 222)', 'rgb(217, 119, 6)', 'rgb(22, 163, 74)', 'rgb(190, 18, 60)', 'rgb(14, 116, 144)', 'rgb(190, 24, 93)']
const SUM_C = 'rgb(220, 38, 38)'

function targetFn(mode: Mode, beta: number, theta: number): number {
  const phi = beta * Math.sin(theta)
  return mode === 'cos' ? Math.cos(phi) : Math.sin(phi)
}

// nth term of the Fourier expansion (slide 36 eq. 4.148).
// cos(β sinθ) = J_0(β) + Σ_{k≥1} 2·J_{2k}(β) cos(2k·θ)
// sin(β sinθ) = Σ_{k≥0} 2·J_{2k+1}(β) sin((2k+1)·θ)
// Returns ZERO if n has the wrong parity for the mode.
function termFn(mode: Mode, beta: number, n: number, theta: number): number {
  if (mode === 'cos') {
    if (n < 0 || n % 2 !== 0) return 0
    const J = besselJ(n, beta)
    if (n === 0) return J
    return 2 * J * Math.cos(n * theta)
  } else {
    if (n <= 0 || n % 2 !== 1) return 0
    const J = besselJ(n, beta)
    return 2 * J * Math.sin(n * theta)
  }
}

function partialSum(mode: Mode, beta: number, nMax: number, theta: number): number {
  let sum = 0
  for (let n = 0; n <= nMax; n++) {
    sum += termFn(mode, beta, n, theta)
  }
  return sum
}

function computeMatchError(beta: number, nMax: number, mode: Mode): number {
  let maxErr = 0
  for (let i = 0; i <= SAMPLES; i++) {
    const theta = (i / SAMPLES) * 2 * Math.PI
    const target = targetFn(mode, beta, theta)
    const sum = partialSum(mode, beta, nMax, theta)
    const err = Math.abs(target - sum)
    if (err > maxErr) maxErr = err
  }
  return maxErr
}

function draw(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  beta: number,
  nMax: number,
  mode: Mode,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Three stacked panels
  const panelH = (h - 40) / 3
  const panelGap = 4

  drawPanel(ctx, colors, 0, panelH, w, 'A', mode, beta, nMax, 'target')
  drawPanel(ctx, colors, panelH + panelGap, panelH, w, 'B', mode, beta, nMax, 'terms')
  drawPanel(ctx, colors, 2 * (panelH + panelGap), panelH, w, 'C', mode, beta, nMax, 'sum')
}

function drawPanel(
  ctx: CanvasRenderingContext2D,
  colors: NonNullable<ReturnType<typeof getThemeColors>>,
  yTop: number,
  panelH: number,
  w: number,
  label: 'A' | 'B' | 'C',
  mode: Mode,
  beta: number,
  nMax: number,
  kind: 'target' | 'terms' | 'sum',
) {
  const PAD_L = 40
  const PAD_R = 24
  const PAD_TOP = 18
  const PAD_BOTTOM = 14

  const yMax = 1.4
  const xt = (t: number) => lerp(t, 0, 1, PAD_L, w - PAD_R)
  const yPlot = (y: number) =>
    lerp(clamp(y, -yMax, yMax), yMax, -yMax, yTop + PAD_TOP, yTop + panelH - PAD_BOTTOM)
  const yBase = yPlot(0)

  // Background frame for panel
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.strokeRect(PAD_L - 1, yTop + PAD_TOP - 1, w - PAD_R - PAD_L + 2, panelH - PAD_TOP - PAD_BOTTOM + 2)

  // Zero axis
  ctx.strokeStyle = colors.border
  ctx.setLineDash([2, 4])
  ctx.beginPath()
  ctx.moveTo(PAD_L, yBase)
  ctx.lineTo(w - PAD_R, yBase)
  ctx.stroke()
  ctx.setLineDash([])

  // Y-tick labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '8px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  for (const yv of [-1, 0, 1]) {
    ctx.fillText(yv.toFixed(0), PAD_L - 4, yPlot(yv) + 3)
  }

  // Panel label box (top-left)
  ctx.fillStyle = colors.fg
  ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(label, PAD_L, yTop + PAD_TOP - 5)

  // Title (next to label)
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  const titles: Record<'A' | 'B' | 'C', string> = {
    A: `Target — ${mode === 'cos' ? 'cos' : 'sin'}(β sin θ)`,
    B: `Όρος-όρος: ${mode === 'cos' ? '2 J_{2k}(β) cos(2k θ)' : '2 J_{2k+1}(β) sin((2k+1) θ)'}`,
    C: `Άθροισμα έως n ≤ ${nMax}`,
  }
  ctx.fillText(titles[label], PAD_L + 18, yTop + PAD_TOP - 5)

  if (kind === 'target') {
    ctx.strokeStyle = TARGET_C
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i <= SAMPLES; i++) {
      const t = i / SAMPLES
      const theta = t * 2 * Math.PI
      const y = targetFn(mode, beta, theta)
      const x = xt(t)
      const yy = yPlot(y)
      if (i === 0) ctx.moveTo(x, yy)
      else ctx.lineTo(x, yy)
    }
    ctx.stroke()
  } else if (kind === 'terms') {
    // Plot each Bessel term J_n cos(nθ) (or sin) separately.
    // For cos: n = 0, 2, 4, ... up to a visualization cap of 10
    // For sin: n = 1, 3, 5, ...
    const ns: number[] = []
    if (mode === 'cos') {
      for (let n = 0; n <= 10; n += 2) ns.push(n)
    } else {
      for (let n = 1; n <= 9; n += 2) ns.push(n)
    }
    ns.forEach((n, idx) => {
      const active = n <= nMax
      ctx.strokeStyle = TERM_BASE_C[idx % TERM_BASE_C.length]
      ctx.lineWidth = active ? 1.4 : 0.9
      ctx.globalAlpha = active ? 0.95 : 0.2
      ctx.beginPath()
      for (let i = 0; i <= SAMPLES; i++) {
        const t = i / SAMPLES
        const theta = t * 2 * Math.PI
        const y = termFn(mode, beta, n, theta)
        const x = xt(t)
        const yy = yPlot(y)
        if (i === 0) ctx.moveTo(x, yy)
        else ctx.lineTo(x, yy)
      }
      ctx.stroke()
      ctx.globalAlpha = 1
    })

    // Legend
    let lx = w - PAD_R - Math.min(ns.length * 38, 280)
    const ly = yTop + PAD_TOP - 5
    ctx.font = '8px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ns.forEach((n, idx) => {
      const active = n <= nMax
      ctx.fillStyle = TERM_BASE_C[idx % TERM_BASE_C.length]
      ctx.globalAlpha = active ? 1 : 0.35
      ctx.fillRect(lx, ly - 7, 8, 2)
      ctx.fillStyle = colors.fgMuted
      ctx.fillText(`n=${n}`, lx + 10, ly - 2)
      ctx.globalAlpha = 1
      lx += 36
    })
  } else {
    // Plot target (faint) + partial sum (bold)
    ctx.strokeStyle = TARGET_C
    ctx.lineWidth = 1.5
    ctx.globalAlpha = 0.3
    ctx.beginPath()
    for (let i = 0; i <= SAMPLES; i++) {
      const t = i / SAMPLES
      const theta = t * 2 * Math.PI
      const y = targetFn(mode, beta, theta)
      const x = xt(t)
      const yy = yPlot(y)
      if (i === 0) ctx.moveTo(x, yy)
      else ctx.lineTo(x, yy)
    }
    ctx.stroke()
    ctx.globalAlpha = 1

    ctx.strokeStyle = SUM_C
    ctx.lineWidth = 2
    ctx.setLineDash([5, 3])
    ctx.beginPath()
    for (let i = 0; i <= SAMPLES; i++) {
      const t = i / SAMPLES
      const theta = t * 2 * Math.PI
      const y = partialSum(mode, beta, nMax, theta)
      const x = xt(t)
      const yy = yPlot(y)
      if (i === 0) ctx.moveTo(x, yy)
      else ctx.lineTo(x, yy)
    }
    ctx.stroke()
    ctx.setLineDash([])

    // Legend
    const lx = w - PAD_R - 180
    const ly = yTop + PAD_TOP - 5
    ctx.font = '8px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillStyle = TARGET_C
    ctx.globalAlpha = 0.3
    ctx.fillRect(lx, ly - 7, 12, 2)
    ctx.globalAlpha = 1
    ctx.fillStyle = colors.fgMuted
    ctx.fillText('target (φαντάσμα)', lx + 16, ly - 2)
    ctx.strokeStyle = SUM_C
    ctx.setLineDash([5, 3])
    ctx.beginPath()
    ctx.moveTo(lx + 90, ly - 6)
    ctx.lineTo(lx + 102, ly - 6)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = colors.fgMuted
    ctx.fillText(`άθροισμα`, lx + 106, ly - 2)
  }
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v))
}
