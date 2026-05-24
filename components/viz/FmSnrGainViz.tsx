'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * FM gain over AM — οπτικοποιεί την βασική σχέση G = 9β² (μ = 1)
 * πάνω από συγκρίσιμη AM.
 *
 * Δύο sliders:
 *   - β (FM modulation index)
 *   - SNR_ref σε dB (the «reference SNR» κάτω από το ίδιο P_T και ίδιο W)
 *
 * Δύο panels:
 *   1. LOG-LOG plot: SNR_out vs SNR_ref για AM (μ=1) και FM (τρέχον β).
 *      Και τα δύο είναι ευθείες με slope 1 (γραμμικά πάνω από threshold)
 *      αλλά FM ψηλότερα κατά 10·log10(9β²) dB. Ο gap στις dB κλίμακες
 *      κάνει το «225× = 23.5 dB» visceral.
 *   2. β sweep: SNR gain (9β²) σε dB & Carson BW (2(β+1)W) σε W-μονάδες,
 *      στην ίδια log-axis. Δείχνει ότι gain ∝ β² αλλά BW ∝ β —
 *      διπλασιάζεις BW, τετραπλάσιο SNR.
 *
 * Toggle «Same P_T derivation» που δείχνει τη βήμα-βήμα αλγεβρα της
 * 9β² σύγκρισης (P_T_AM = (3/4)A² για μ=1 vs P_T_FM = B²/2 → ratio = 9β²
 * όταν P_T_AM = P_T_FM).
 */

const PRESETS = [
  { label: 'NBFM (β = 0.5)', beta: 0.5 },
  { label: 'FM broadcast (β = 5)', beta: 5 },
  { label: 'Wideband (β = 10)', beta: 10 },
]

export function FmSnrGainViz() {
  const [beta, setBeta] = useState(5)
  const [snrRefDb, setSnrRefDb] = useState(20)
  const [showAlgebra, setShowAlgebra] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const stats = useMemo(() => {
    // FM output SNR (μ=1, single-tone): SNR_out_FM = 3β² · SNR_ref
    // AM output SNR (μ=1): SNR_out_AM_at_muEq1 = (1/3) · SNR_ref [Haykin convention, same P_T]
    // Gain G = SNR_FM / SNR_AM = (3β²) / (1/3) = 9β²
    const snrRef = Math.pow(10, snrRefDb / 10)
    const snrOutFm = 3 * beta * beta * snrRef
    const snrOutAm = (1 / 3) * snrRef
    const gainLinear = (3 * beta * beta) / (1 / 3) // = 9β²
    const gainDb = 10 * Math.log10(gainLinear)
    // Bandwidths (in units of W)
    const bwFm = 2 * (beta + 1) // 2(β+1)W
    const bwAm = 2 // 2W
    return { snrRef, snrOutFm, snrOutAm, gainLinear, gainDb, bwFm, bwAm }
  }, [beta, snrRefDb])

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors || !canvasRef.current) return
    draw(canvasRef.current, colors, beta, snrRefDb)
    const onResize = () => {
      const c = getThemeColors()
      if (c && canvasRef.current) draw(canvasRef.current, c, beta, snrRefDb)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [beta, snrRefDb])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          FM gain πάνω από AM — G = 9β², bandwidth trade-off
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

      <p className="mb-3 text-xs leading-relaxed text-fg-muted">
        Σύγκρινε FM (current β) με Conventional AM (μ = 1) στο <strong>ίδιο SNR_ref</strong> και <strong>ίδιο P_T</strong> (συνολική εκπεμπόμενη ισχύς). Πάνω panel: SNR_out vs SNR_ref σε dB κλίμακα — η FM γραμμή είναι ακριβώς {stats.gainDb.toFixed(1)} dB πάνω από την AM. Κάτω panel: όσο μεγαλώνει το β, ο gain (πορτοκαλί) μεγαλώνει σαν β² ενώ το Carson BW (μπλε) μεγαλώνει σαν β — διπλασιάζεις BW, τετραπλάσιο SNR gain.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 360 }}
        className="block h-[360px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="FM SNR gain over AM visualization"
      />

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            β (FM modulation index) ={' '}
            <span className="font-mono text-fg tabular-nums">{beta.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0.2}
            max={15}
            step={0.1}
            value={beta}
            onChange={(e) => setBeta(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            SNR_ref ={' '}
            <span className="font-mono text-fg tabular-nums">{snrRefDb.toFixed(0)} dB</span>
          </label>
          <input
            type="range"
            min={0}
            max={40}
            step={1}
            value={snrRefDb}
            onChange={(e) => setSnrRefDb(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
        <div className="rounded-md border border-border bg-bg-soft px-2 py-1.5">
          <div className="text-fg-subtle">SNR_out (AM μ=1)</div>
          <div className="font-mono text-orange-700 dark:text-orange-300 tabular-nums">
            {(10 * Math.log10(stats.snrOutAm)).toFixed(1)} dB
          </div>
        </div>
        <div className="rounded-md border border-border bg-bg-soft px-2 py-1.5">
          <div className="text-fg-subtle">SNR_out (FM β={beta.toFixed(1)})</div>
          <div className="font-mono text-emerald-700 dark:text-emerald-300 tabular-nums">
            {(10 * Math.log10(stats.snrOutFm)).toFixed(1)} dB
          </div>
        </div>
        <div className="rounded-md border border-border bg-bg-soft px-2 py-1.5">
          <div className="text-fg-subtle">Gain G = 9β²</div>
          <div className="font-mono text-fg tabular-nums">
            {stats.gainLinear.toFixed(0)}× ({stats.gainDb.toFixed(1)} dB)
          </div>
        </div>
        <div className="rounded-md border border-border bg-bg-soft px-2 py-1.5">
          <div className="text-fg-subtle">BW penalty (FM/AM)</div>
          <div className="font-mono text-fg tabular-nums">
            {(stats.bwFm / stats.bwAm).toFixed(2)}×
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowAlgebra((s) => !s)}
        className="mt-3 inline-flex items-center rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
      >
        {showAlgebra ? '−' : '+'} «Same P_T» derivation
      </button>
      {showAlgebra && (
        <div className="mt-2 space-y-1.5 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 font-mono text-[11px] leading-relaxed text-fg">
          <div>AM single-tone (μ=1): x_AM(t) = (A + A·cos(2π f_m t)) cos(2π f_c t)</div>
          <div>P_T_AM = A²·(1 + μ²/2)/2 = A²·(3/4) — carrier + 2 sidebands</div>
          <div>useful (sidebands only): P_sb = A²·μ²/4 = A²/4 → η = (1/4)/(3/4) = 1/3</div>
          <div>SNR_out_AM = η · (P_T/N₀W) = (1/3) · ((3/4)A²)/(N₀W) = A²/(4 N₀W)</div>
          <div className="mt-2">FM (const envelope B): x_FM(t) = B·cos(2π f_c t + φ(t))</div>
          <div>P_T_FM = B²/2</div>
          <div>SNR_out_FM = 3β² · (P_T_FM/(N₀W))·(2/2) = 3β² · B²/(2 N₀W)</div>
          <div className="mt-2">Συνθήκη: P_T_AM = P_T_FM ⇒ A²·(3/4) = B²/2 ⇒ A² = (2/3)·B²</div>
          <div>Άρα SNR_out_AM = (2/3)·B²/(4 N₀W) = B²/(6 N₀W)</div>
          <div>G = SNR_FM/SNR_AM = [3β²·B²/(2N₀W)] / [B²/(6N₀W)] = 3β² · 6/2 = <strong>9β²</strong> ✓</div>
        </div>
      )}
    </figure>
  )
}

// ── drawing ──────────────────────────────────────────────────────────────

const FM_C = 'rgb(16, 185, 129)'
const AM_C = 'rgb(217, 119, 6)'
const BW_C = 'rgb(29, 78, 216)'
const AXIS_C = 'rgba(120, 120, 120, 0.5)'

function draw(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  beta: number,
  snrRefDb: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const halfH = h / 2 - 8
  drawSnrPanel(ctx, colors, 0, 0, w, halfH, beta, snrRefDb)
  drawBetaSweepPanel(ctx, colors, 0, h / 2 + 8, w, halfH, beta)
}

function drawSnrPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  beta: number,
  curRefDb: number,
) {
  if (!colors) return
  const PAD = { l: 50, r: 16, t: 22, b: 24 }
  const inner = { x: x0 + PAD.l, y: y0 + PAD.t, w: pw - PAD.l - PAD.r, h: ph - PAD.t - PAD.b }

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('SNR_out vs SNR_ref — log-log (dB κλίμακα)', x0 + 6, y0 + 14)
  ctx.strokeStyle = colors.border
  ctx.strokeRect(x0 + 2, y0 + 18, pw - 4, ph - 22)

  // x: SNR_ref dB from 0..40
  // y: SNR_out dB from -10..70
  const refMin = 0
  const refMax = 40
  const outMin = -10
  const outMax = 70

  const xf = (db: number) => lerp(db, refMin, refMax, inner.x, inner.x + inner.w)
  const yf = (db: number) => lerp(db, outMin, outMax, inner.y + inner.h, inner.y)

  // axis ticks (10-dB grid)
  ctx.strokeStyle = AXIS_C
  ctx.lineWidth = 0.5
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = colors.fgSubtle
  for (let r = refMin; r <= refMax; r += 10) {
    ctx.beginPath()
    ctx.moveTo(xf(r), inner.y)
    ctx.lineTo(xf(r), inner.y + inner.h)
    ctx.stroke()
    ctx.textAlign = 'center'
    ctx.fillText(`${r}`, xf(r), inner.y + inner.h + 12)
  }
  for (let o = outMin; o <= outMax; o += 20) {
    ctx.beginPath()
    ctx.moveTo(inner.x, yf(o))
    ctx.lineTo(inner.x + inner.w, yf(o))
    ctx.stroke()
    ctx.textAlign = 'right'
    ctx.fillText(`${o}`, inner.x - 4, yf(o) + 3)
  }
  // axis labels
  ctx.textAlign = 'center'
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('SNR_ref (dB)', inner.x + inner.w / 2, inner.y + inner.h + 22)
  ctx.save()
  ctx.translate(x0 + 14, inner.y + inner.h / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('SNR_out (dB)', 0, 0)
  ctx.restore()

  // AM line: SNR_out_dB = SNR_ref_dB + 10·log10(1/3) = SNR_ref - 4.77 dB
  const amOffset = 10 * Math.log10(1 / 3)
  ctx.strokeStyle = AM_C
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(xf(refMin), yf(refMin + amOffset))
  ctx.lineTo(xf(refMax), yf(refMax + amOffset))
  ctx.stroke()
  ctx.fillStyle = AM_C
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('AM (μ=1): SNR_ref − 4.8 dB', inner.x + 8, yf(refMin + amOffset) - 6)

  // FM line: SNR_out_dB = SNR_ref_dB + 10·log10(3β²)
  const fmOffset = 10 * Math.log10(3 * beta * beta)
  ctx.strokeStyle = FM_C
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(xf(refMin), yf(Math.min(outMax, refMin + fmOffset)))
  ctx.lineTo(xf(refMax), yf(Math.min(outMax, refMax + fmOffset)))
  ctx.stroke()
  ctx.fillStyle = FM_C
  ctx.fillText(`FM (β=${beta.toFixed(1)}): SNR_ref + ${fmOffset.toFixed(1)} dB`, inner.x + 8, yf(Math.min(outMax, refMin + fmOffset)) + 14)

  // Vertical marker at current SNR_ref
  ctx.strokeStyle = 'rgba(220, 38, 38, 0.5)'
  ctx.lineWidth = 1
  ctx.setLineDash([3, 3])
  ctx.beginPath()
  ctx.moveTo(xf(curRefDb), inner.y)
  ctx.lineTo(xf(curRefDb), inner.y + inner.h)
  ctx.stroke()
  ctx.setLineDash([])

  // Annotate the gap at current SNR_ref
  const yAm = yf(Math.min(outMax, Math.max(outMin, curRefDb + amOffset)))
  const yFm = yf(Math.min(outMax, Math.max(outMin, curRefDb + fmOffset)))
  ctx.strokeStyle = 'rgba(220, 38, 38, 0.8)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(xf(curRefDb) - 8, yAm)
  ctx.lineTo(xf(curRefDb) - 8, yFm)
  ctx.stroke()
  // small arrowheads
  ctx.fillStyle = 'rgba(220, 38, 38, 0.9)'
  ctx.beginPath()
  ctx.moveTo(xf(curRefDb) - 8, yFm)
  ctx.lineTo(xf(curRefDb) - 12, yFm + 5)
  ctx.lineTo(xf(curRefDb) - 4, yFm + 5)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(xf(curRefDb) - 8, yAm)
  ctx.lineTo(xf(curRefDb) - 12, yAm - 5)
  ctx.lineTo(xf(curRefDb) - 4, yAm - 5)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = 'rgb(220, 38, 38)'
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(`gap = ${(fmOffset - amOffset).toFixed(1)} dB`, xf(curRefDb) - 14, (yAm + yFm) / 2 + 3)
}

function drawBetaSweepPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  curBeta: number,
) {
  if (!colors) return
  const PAD = { l: 50, r: 60, t: 22, b: 24 }
  const inner = { x: x0 + PAD.l, y: y0 + PAD.t, w: pw - PAD.l - PAD.r, h: ph - PAD.t - PAD.b }

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Gain vs β (πορτοκαλί, log) και Carson BW vs β (μπλε)', x0 + 6, y0 + 14)
  ctx.strokeStyle = colors.border
  ctx.strokeRect(x0 + 2, y0 + 18, pw - 4, ph - 22)

  const betaMin = 0.2
  const betaMax = 15
  const xf = (b: number) => lerp(Math.log10(b), Math.log10(betaMin), Math.log10(betaMax), inner.x, inner.x + inner.w)

  // gain (left axis) — log10(9β²) from 0..3 (1× to 1000×)
  const yfL = (g: number) => lerp(Math.log10(Math.max(1, g)), 0, 3, inner.y + inner.h, inner.y)
  // BW (right axis) — 2 (β+1) from 2 to 32 (linear)
  const yfR = (bw: number) => lerp(bw, 2, 32, inner.y + inner.h, inner.y)

  // β log-axis ticks
  ctx.strokeStyle = AXIS_C
  ctx.lineWidth = 0.5
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = colors.fgSubtle
  ;[0.2, 0.5, 1, 2, 5, 10, 15].forEach((b) => {
    if (b < betaMin || b > betaMax) return
    ctx.beginPath()
    ctx.moveTo(xf(b), inner.y)
    ctx.lineTo(xf(b), inner.y + inner.h)
    ctx.stroke()
    ctx.textAlign = 'center'
    ctx.fillText(`${b}`, xf(b), inner.y + inner.h + 12)
  })

  // Left axis (gain in dB)
  ctx.textAlign = 'right'
  ctx.fillStyle = AM_C
  ;[0, 10, 20, 30].forEach((db) => {
    const g = Math.pow(10, db / 10)
    if (Math.log10(g) < 0 || Math.log10(g) > 3) return
    ctx.fillText(`${db} dB`, inner.x - 4, yfL(g) + 3)
  })

  // Right axis (BW in W units)
  ctx.textAlign = 'left'
  ctx.fillStyle = BW_C
  ;[2, 10, 20, 30].forEach((bw) => {
    if (bw < 2 || bw > 32) return
    ctx.fillText(`${bw}W`, inner.x + inner.w + 4, yfR(bw) + 3)
  })

  // axis labels
  ctx.textAlign = 'center'
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('β (log)', inner.x + inner.w / 2, inner.y + inner.h + 22)

  // Gain curve (orange)
  ctx.strokeStyle = AM_C
  ctx.lineWidth = 2
  ctx.beginPath()
  const N = 80
  for (let i = 0; i <= N; i++) {
    const b = Math.pow(10, lerp(i, 0, N, Math.log10(betaMin), Math.log10(betaMax)))
    const g = 9 * b * b
    const px = xf(b)
    const py = yfL(g)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // BW curve (blue)
  ctx.strokeStyle = BW_C
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= N; i++) {
    const b = Math.pow(10, lerp(i, 0, N, Math.log10(betaMin), Math.log10(betaMax)))
    const bw = 2 * (b + 1)
    const px = xf(b)
    const py = yfR(bw)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // current β marker
  const gCur = 9 * curBeta * curBeta
  const bwCur = 2 * (curBeta + 1)
  ctx.fillStyle = AM_C
  ctx.beginPath()
  ctx.arc(xf(curBeta), yfL(gCur), 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = BW_C
  ctx.beginPath()
  ctx.arc(xf(curBeta), yfR(bwCur), 4, 0, Math.PI * 2)
  ctx.fill()
}
