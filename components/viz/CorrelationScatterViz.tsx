'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * CorrelationScatterViz — see what a "linear relationship" actually is, and how
 * covariance / ρ measure it.
 *
 * Linear mode: drag ρ from −1 to +1 and watch a FIXED cloud of points morph —
 * the same underlying samples tighten toward a straight line (ρ=±1) or scatter
 * shapelessly (ρ=0). Each point is colored by the sign of (xᵢ−x̄)(yᵢ−ȳ) — the
 * exact quantity averaged inside Cov(X,Y). Green = the two agree (both above or
 * both below their means), red = they disagree; the mean-cross splits the plane.
 *
 * Curved mode: Y = X². Knowing X fixes Y exactly (maximal dependence), yet the
 * green/red products cancel by symmetry → ρ ≈ 0. The "uncorrelated ≠
 * independent" trap (§6δ), made visible.
 */

type Mode = 'linear' | 'curved'

function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Deterministic pair of independent standard normals (Box–Muller), seeded once. */
function makeBasePoints(n: number): Array<{ x: number; z: number }> {
  const rand = mulberry32(20260609)
  const pts: Array<{ x: number; z: number }> = []
  for (let i = 0; i < n; i++) {
    const u1 = Math.max(rand(), 1e-9)
    const u2 = rand()
    const r = Math.sqrt(-2 * Math.log(u1))
    pts.push({ x: r * Math.cos(2 * Math.PI * u2), z: r * Math.sin(2 * Math.PI * u2) })
  }
  return pts
}

function pearson(pts: Array<{ x: number; y: number }>) {
  const n = pts.length
  if (n === 0) return 0
  let sx = 0
  let sy = 0
  for (const p of pts) {
    sx += p.x
    sy += p.y
  }
  const mx = sx / n
  const my = sy / n
  let sxy = 0
  let sxx = 0
  let syy = 0
  for (const p of pts) {
    const dx = p.x - mx
    const dy = p.y - my
    sxy += dx * dy
    sxx += dx * dx
    syy += dy * dy
  }
  const d = Math.sqrt(sxx * syy)
  return d > 0 ? sxy / d : 0
}

export function CorrelationScatterViz() {
  const [mode, setMode] = useState<Mode>('linear')
  const [rho, setRho] = useState(0.7)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const base = useMemo(() => makeBasePoints(220), [])

  const points = useMemo(() => {
    if (mode === 'curved') return base.map((p) => ({ x: p.x, y: p.x * p.x }))
    const k = Math.sqrt(Math.max(0, 1 - rho * rho))
    return base.map((p) => ({ x: p.x, y: rho * p.x + k * p.z }))
  }, [base, mode, rho])

  const sampleRho = useMemo(() => pearson(points), [points])

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    const render = () => {
      if (canvas && colors) drawScene(canvas, colors, points, mode)
    }
    render()
    window.addEventListener('resize', render)
    return () => window.removeEventListener('resize', render)
  }, [points, mode])

  const covSign =
    sampleRho > 0.03 ? '> 0 (ανηφορικά)' : sampleRho < -0.03 ? '< 0 (κατηφορικά)' : '≈ 0'
  const verdict =
    mode === 'curved'
      ? 'εξαρτημένες, ρ ≈ 0'
      : Math.abs(sampleRho) > 0.85
        ? 'σχεδόν ευθεία'
        : Math.abs(sampleRho) < 0.1
          ? 'καμία γραμμική'
          : 'γραμμική τάση'

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Γραμμική σχέση &amp; covariance — δες πώς το ρ «βλέπει» ευθείες
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ['linear', 'Γραμμική (ρ ρυθμιζόμενο)'],
              ['curved', 'Καμπύλη Y = X²'],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={
                'rounded-full border px-3 py-1 text-xs transition-colors ' +
                (mode === m
                  ? 'border-accent bg-accent/15 font-semibold text-fg'
                  : 'border-border bg-bg-soft text-fg-muted hover:border-accent/50 hover:text-fg')
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Scatter plot δύο τυχαίων μεταβλητών και η γραμμική τους σχέση"
      />

      {mode === 'linear' && (
        <div className="mt-3 text-xs">
          <SliderBlock
            label="ρ (συντελεστής συσχέτισης)"
            value={rho}
            min={-1}
            max={1}
            step={0.01}
            onChange={setRho}
            fmt={(v) => v.toFixed(2)}
          />
        </div>
      )}

      <div className="mt-3 grid gap-2 rounded-md border border-accent/30 bg-accent-soft/20 px-3 py-2 text-xs sm:grid-cols-3">
        <Stat label="ρ (από τα σημεία)" value={sampleRho.toFixed(2)} />
        <Stat label="Cov πρόσημο" value={covSign} />
        <Stat label="Σχέση;" value={verdict} />
      </div>

      <p className="mt-3 text-xs leading-relaxed text-fg-muted">
        {mode === 'curved' ? (
          <>
            Η <strong>Y καθορίζεται πλήρως από την X</strong> (Y = X²) — απόλυτη εξάρτηση. Κι όμως
            το ρ βγαίνει <strong>≈ 0</strong>: τα <span className="text-emerald-600 dark:text-emerald-400">πράσινα</span> σημεία
            (θετικό γινόμενο αποκλίσεων) και τα <span className="text-red-600 dark:text-red-400">κόκκινα</span> (αρνητικό)
            είναι συμμετρικά και αλληλοεξουδετερώνονται. Το covariance «βλέπει» μόνο{' '}
            <strong>ευθεία</strong> τάση — την καμπύλη τη χάνει. Γι’ αυτό «ασυσχέτιστες» ≠ «ανεξάρτητες».
          </>
        ) : (
          <>
            Κάθε σημείο είναι ένα ζεύγος (X, Y). Χρώμα = πρόσημο του (X−x̄)(Y−ȳ):{' '}
            <span className="text-emerald-600 dark:text-emerald-400">πράσινο</span> όταν τα δύο είναι μαζί
            πάνω/κάτω από τους μέσους τους (συμφωνούν), <span className="text-red-600 dark:text-red-400">κόκκινο</span> όταν
            διαφωνούν. Το Cov είναι ο <strong>μέσος όρος</strong> αυτών των γινομένων. Σύρε το ρ: στο
            ±1 όλα πέφτουν πάνω στην ευθεία· στο 0 πράσινα και κόκκινα ισορροπούν και η ευθεία τάση χάνεται.
          </>
        )}
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
        {label} = <span className="font-mono text-fg tabular-nums">{fmt(value)}</span>
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

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  pts: Array<{ x: number; y: number }>,
  mode: Mode,
) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  let mx = 0
  let my = 0
  for (const p of pts) {
    mx += p.x
    my += p.y
  }
  mx /= pts.length
  my /= pts.length

  const xMin = -3.4
  const xMax = 3.4
  let yMin = -3.4
  let yMax = 3.4
  if (mode === 'curved') {
    let ymax = 0
    for (const p of pts) ymax = Math.max(ymax, p.y)
    yMin = -0.4
    yMax = Math.max(ymax * 1.05, 2)
  }

  const padL = 30
  const padR = 14
  const padT = 14
  const padB = 24
  const plotW = w - padL - padR
  const plotH = h - padT - padB
  const xTo = (x: number) => padL + lerp(x, xMin, xMax, 0, plotW)
  const yTo = (y: number) => padT + plotH - lerp(y, yMin, yMax, 0, plotH)

  // Plot frame
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.strokeRect(padL, padT, plotW, plotH)

  // Mean cross (dashed) — splits the plane into the 4 agree/disagree quadrants
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  if (mx > xMin && mx < xMax) {
    ctx.beginPath()
    ctx.moveTo(xTo(mx), padT)
    ctx.lineTo(xTo(mx), padT + plotH)
    ctx.stroke()
  }
  if (my > yMin && my < yMax) {
    ctx.beginPath()
    ctx.moveTo(padL, yTo(my))
    ctx.lineTo(padL + plotW, yTo(my))
    ctx.stroke()
  }
  ctx.setLineDash([])
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui'
  ctx.textAlign = 'left'
  if (my > yMin && my < yMax) ctx.fillText('μY', padL + 3, yTo(my) - 3)
  if (mx > xMin && mx < xMax) ctx.fillText('μX', xTo(mx) + 3, padT + plotH - 4)

  // Best-fit guide line (linear mode only)
  if (mode === 'linear') {
    const rho = pearson(pts)
    ctx.strokeStyle = colors.accent
    ctx.globalAlpha = 0.35
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(xTo(xMin), yTo(my + rho * (xMin - mx)))
    ctx.lineTo(xTo(xMax), yTo(my + rho * (xMax - mx)))
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  // Points, colored by sign of (x−x̄)(y−ȳ) — the term Cov averages.
  for (const p of pts) {
    const prod = (p.x - mx) * (p.y - my)
    ctx.fillStyle = prod >= 0 ? colors.accent : colors.danger
    ctx.globalAlpha = 0.78
    ctx.beginPath()
    ctx.arc(xTo(p.x), yTo(p.y), 2.6, 0, 2 * Math.PI)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  // Axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '11px ui-sans-serif, system-ui'
  ctx.textAlign = 'right'
  ctx.fillText('X', padL + plotW - 4, padT + plotH - 6)
  ctx.textAlign = 'left'
  ctx.fillText('Y', padL + 5, padT + 11)
}
