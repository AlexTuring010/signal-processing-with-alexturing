'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Δύο όρια του Carson, μία εξίσωση — slide 26 + /fm/idea §7.
 *
 *   B = 2W(β + 1) = 2W + 2β·W = 2W + 2Δf
 *
 * Δύο εκφράσεις του ΙΔΙΟΥ τύπου που γίνονται προφανείς σε διαφορετικά β:
 *
 *   NBFM  (β ≪ 1):   B → 2W              — όπως DSB-AM-SC/Conventional AM
 *   WBFM  (β ≫ 1):   B → 2Δf = 2β·W     — bandwidth κυριαρχείται από deviation
 *
 * Ο φοιτητής πρέπει να καταλάβει ότι ΔΕΝ είναι δύο διαφορετικοί τύποι — είναι
 * η ΙΔΙΑ εξίσωση που «παίρνει το σχήμα του» ορίου που κυριαρχεί.
 *
 * Η viz σχεδιάζει B(β) σε log-log άξονες με τα δύο asymptotes:
 *
 *   - οριζόντια γραμμή στο B = 2W (NBFM asymptote)
 *   - γραμμή κλίσης 1 στα B = 2Δf = 2βW (WBFM asymptote)
 *
 * + ένα draggable β marker. Στις γωνίες ο φοιτητής βλέπει live ποιο όριο
 * κυριαρχεί. Cross-over γύρω στο β = 1.
 *
 * Δευτερεύον panel: ένα πραγματικό-κόσμο σχήμα με τρεις «θέσεις» — NBFM
 * walkie-talkie, FM broadcast, exam canonical — που δείχνουν πώς πλακώνει
 * το Carson στο πραγματικό κανάλι.
 */

const PRESETS = [
  { label: 'NBFM (β = 0.3)', beta: 0.3 },
  { label: 'NBFM/WBFM boundary (β = 1)', beta: 1 },
  { label: 'FM ραδιόφωνο (β = 5)', beta: 5 },
  { label: 'WBFM (β = 20)', beta: 20 },
]

export function NbfmWbfmRegimesViz() {
  const [beta, setBeta] = useState(5)
  const [W, setW] = useState(15) // kHz default — FM broadcast audio
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const result = useMemo(() => {
    const deltaF = beta * W
    const B = 2 * W * (beta + 1)
    const nbfmLimit = 2 * W
    const wbfmLimit = 2 * deltaF
    // ποιο όριο κυριαρχεί:
    //   B / nbfmLimit = β + 1   → όταν β ≪ 1, B/2W ≈ 1
    //   B / wbfmLimit = (β+1)/β = 1 + 1/β  → όταν β ≫ 1, B/2Δf ≈ 1
    const errorVsNbfm = Math.abs(B - nbfmLimit) / B
    const errorVsWbfm = beta > 0.001 ? Math.abs(B - wbfmLimit) / B : 1
    let regime: 'NBFM' | 'transition' | 'WBFM' = 'transition'
    if (errorVsNbfm < 0.1) regime = 'NBFM'
    else if (errorVsWbfm < 0.1) regime = 'WBFM'
    return { B, deltaF, nbfmLimit, wbfmLimit, errorVsNbfm, errorVsWbfm, regime }
  }, [beta, W])

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors || !canvasRef.current) return
    draw(canvasRef.current, colors, beta, W)
    const onResize = () => {
      const c = getThemeColors()
      if (c && canvasRef.current) draw(canvasRef.current, c, beta, W)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [beta, W])

  const regimeColor =
    result.regime === 'NBFM'
      ? 'text-emerald-600 dark:text-emerald-300'
      : result.regime === 'WBFM'
        ? 'text-violet-600 dark:text-violet-300'
        : 'text-amber-600 dark:text-amber-300'

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          NBFM ↔ WBFM — μια εξίσωση, δύο όρια
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setBeta(p.beta)}
              className={`rounded-full border px-2.5 py-0.5 text-xs ${
                Math.abs(beta - p.beta) < 0.05
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
        Το Carson{' '}
        <span className="font-mono">B = 2W(β+1)</span> γράφεται ισοδύναμα{' '}
        <span className="font-mono">B = 2W + 2βW = 2W + 2Δf</span>. Στο NBFM όριο
        (β ≪ 1) ο πρώτος όρος <span className="font-mono">2W</span> κυριαρχεί· στο WBFM όριο
        (β ≫ 1) ο δεύτερος όρος <span className="font-mono">2Δf</span> κυριαρχεί. Δύο όρια,
        ίδιος τύπος.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="B vs β με NBFM and WBFM asymptotes"
      />

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            β ={' '}
            <span className="font-mono text-fg tabular-nums">{beta.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0.05}
            max={30}
            step={0.05}
            value={beta}
            onChange={(e) => setBeta(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Modulation index beta"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            W ={' '}
            <span className="font-mono text-fg tabular-nums">{W.toFixed(0)} kHz</span>
          </label>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={W}
            onChange={(e) => setW(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="Message bandwidth W in kHz"
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <div className="rounded-md border border-border bg-bg-soft px-2 py-1">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">Δf = βW</div>
          <div className="font-mono text-fg tabular-nums">{result.deltaF.toFixed(1)} kHz</div>
        </div>
        <div className="rounded-md border border-emerald-400/40 bg-emerald-50 px-2 py-1 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            NBFM όριο 2W
          </div>
          <div className="font-mono text-fg tabular-nums">
            {result.nbfmLimit.toFixed(0)} kHz
          </div>
        </div>
        <div className="rounded-md border border-violet-400/40 bg-violet-50 px-2 py-1 dark:border-violet-500/30 dark:bg-violet-500/10">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            WBFM όριο 2Δf
          </div>
          <div className="font-mono text-fg tabular-nums">
            {result.wbfmLimit.toFixed(0)} kHz
          </div>
        </div>
        <div className="rounded-md border border-accent/40 bg-accent/10 px-2 py-1">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Carson B (exact)
          </div>
          <div className="font-mono text-fg tabular-nums">{result.B.toFixed(0)} kHz</div>
        </div>
      </div>

      <p className="mt-3 text-xs">
        Καθεστώς:{' '}
        <span className={`font-semibold ${regimeColor}`}>
          {result.regime === 'NBFM'
            ? 'NBFM — το 2W κυριαρχεί'
            : result.regime === 'WBFM'
              ? 'WBFM — το 2Δf κυριαρχεί'
              : 'transition — κανένα όριο δεν είναι ακριβές'}
        </span>{' '}
        <span className="text-fg-subtle">
          (σφάλμα vs 2W: {(result.errorVsNbfm * 100).toFixed(1)}%, vs 2Δf:{' '}
          {Math.min(result.errorVsWbfm * 100, 999).toFixed(1)}%)
        </span>
      </p>
    </figure>
  )
}

const NBFM_C = 'rgb(16, 185, 129)' // emerald
const WBFM_C = 'rgb(168, 85, 247)' // violet
const CARSON_C = 'rgb(29, 78, 216)' // blue
const MARKER_C = 'rgb(220, 38, 38)' // red

function draw(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  beta: number,
  W: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const PAD_L = 50
  const PAD_R = 18
  const PAD_T = 16
  const PAD_B = 38

  // Log-log axes: β ∈ [0.05, 30],  B ∈ [W, 100W]
  const logBetaMin = Math.log10(0.05)
  const logBetaMax = Math.log10(30)
  const logBMin = Math.log10(W) // smaller than nbfm limit
  const logBMax = Math.log10(100 * W) // big enough for wbfm extremes
  const xOf = (b: number) =>
    lerp(Math.log10(b), logBetaMin, logBetaMax, PAD_L, w - PAD_R)
  const yOf = (B: number) =>
    lerp(Math.log10(B), logBMin, logBMax, h - PAD_B, PAD_T)

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_L, h - PAD_B)
  ctx.lineTo(w - PAD_R, h - PAD_B)
  ctx.moveTo(PAD_L, PAD_T)
  ctx.lineTo(PAD_L, h - PAD_B)
  ctx.stroke()

  // Y ticks (log)
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  for (const exp of [0, 1, 2]) {
    const B = W * 10 ** exp
    const y = yOf(B)
    ctx.beginPath()
    ctx.moveTo(PAD_L - 3, y)
    ctx.lineTo(PAD_L, y)
    ctx.stroke()
    ctx.fillText(`${B.toFixed(0)}`, PAD_L - 5, y + 3)
  }
  // Y axis label
  ctx.save()
  ctx.translate(12, (PAD_T + h - PAD_B) / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.textAlign = 'center'
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('Bandwidth B (kHz, log)', 0, 0)
  ctx.restore()

  // X ticks (log)
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const b of [0.1, 0.3, 1, 3, 10, 30]) {
    const x = xOf(b)
    ctx.beginPath()
    ctx.moveTo(x, h - PAD_B)
    ctx.lineTo(x, h - PAD_B + 3)
    ctx.stroke()
    ctx.fillText(`${b}`, x, h - PAD_B + 14)
  }
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('β (log)', (PAD_L + w - PAD_R) / 2, h - PAD_B + 28)

  // NBFM asymptote (horizontal at 2W)
  ctx.strokeStyle = NBFM_C
  ctx.setLineDash([6, 5])
  ctx.lineWidth = 1.5
  const yNbfm = yOf(2 * W)
  ctx.beginPath()
  ctx.moveTo(PAD_L, yNbfm)
  ctx.lineTo(w - PAD_R, yNbfm)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = NBFM_C
  ctx.textAlign = 'left'
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('NBFM όριο: B → 2W', xOf(0.1), yNbfm - 4)

  // WBFM asymptote (slope 1: B = 2βW)
  ctx.strokeStyle = WBFM_C
  ctx.setLineDash([6, 5])
  ctx.lineWidth = 1.5
  ctx.beginPath()
  for (let logB = logBetaMin; logB <= logBetaMax; logB += 0.02) {
    const b = 10 ** logB
    const B = 2 * b * W
    if (B <= W) continue
    const x = xOf(b)
    const y = yOf(B)
    if (logB === logBetaMin) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = WBFM_C
  ctx.textAlign = 'right'
  ctx.fillText('WBFM όριο: B → 2Δf', xOf(28), yOf(2 * 28 * W) + 12)

  // Carson actual curve B = 2W(β+1)
  ctx.strokeStyle = CARSON_C
  ctx.lineWidth = 2.5
  ctx.beginPath()
  for (let logB = logBetaMin; logB <= logBetaMax; logB += 0.01) {
    const b = 10 ** logB
    const B = 2 * W * (b + 1)
    const x = xOf(b)
    const y = yOf(B)
    if (logB === logBetaMin) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
  ctx.fillStyle = CARSON_C
  ctx.textAlign = 'left'
  ctx.font = 'bold 10px ui-sans-serif, system-ui, sans-serif'
  // Place "Carson" label somewhere along the actual curve (β=2 region)
  const labelB = 2 * W * (2 + 1)
  ctx.fillText('Carson exact: B = 2W(β+1)', xOf(2) + 4, yOf(labelB) - 4)

  // Crossover region marker (β = 1)
  const xCross = xOf(1)
  ctx.strokeStyle = colors.border
  ctx.setLineDash([2, 4])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xCross, PAD_T)
  ctx.lineTo(xCross, h - PAD_B)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.fgMuted
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('β = 1 (boundary)', xCross, PAD_T + 10)

  // Current β marker
  const xCur = xOf(beta)
  const yCur = yOf(2 * W * (beta + 1))
  ctx.fillStyle = MARKER_C
  ctx.strokeStyle = MARKER_C
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(xCur, PAD_T)
  ctx.lineTo(xCur, h - PAD_B)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(xCur, yCur, 5, 0, 2 * Math.PI)
  ctx.fill()

  ctx.fillStyle = MARKER_C
  ctx.font = 'bold 10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = xCur > w - PAD_R - 100 ? 'right' : 'left'
  const labelX = xCur > w - PAD_R - 100 ? xCur - 8 : xCur + 8
  ctx.fillText(`β = ${beta.toFixed(2)}`, labelX, yCur - 8)
}
