'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * AM vs DSB-SC spectrum, viewed side-by-side at the SAME μ.
 *
 * Two stacked panels share the same horizontal axis (frequency, normalised
 * units) so the reader can see at a glance:
 *
 *   1. The sidebands are *identical* in both — same positions, same heights.
 *      So bandwidth is identical (BW = 2 f_m for single-tone).
 *   2. The only difference is the **carrier impulse**: present at A_c/2 in
 *      AM, absent in DSB-SC. That carrier impulse is the wasted-power chunk.
 *   3. As μ → 0 in the AM panel, the sidebands vanish but the carrier stays
 *      — making the "carrier doesn't carry information" point crystal-clear.
 *
 * Below each panel: a power readout (P_c, P_sb, P_total, η). The AM panel
 * shows the wasted-carrier fraction in violet; the DSB-SC panel shows η =
 * 100% in green.
 *
 * Distinct from AMSpectrumViz (which only shows AM) and from
 * AMFamilySpectra (which compares AM/DSB/SSB/VSB by spectrum *shape*, not by
 * impulse heights with a live μ slider).
 */

const FC = 4 // visual carrier position
const FM = 1 // visual message frequency
const A_C = 1 // carrier amplitude (held constant)

const CARRIER_C = 'rgb(168, 85, 247)' // violet for carrier (wasted)
const SIDEBAND_C = 'rgb(29, 78, 216)' // accent blue for sidebands (useful)
const MUTED_C = 'rgb(148, 163, 184)' // slate

export function DsbScSpectrumViz() {
  const [mu, setMu] = useState(0.7)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, mu)
  }, [mu])

  // Power expressions assume A_c is held at 1 in the AM panel.
  // For DSB-SC at the same effective μ, the message has amplitude A_m = μ·A_c,
  // so P_DSB = A_m^2/4 = μ²/4. P_c_AM = A_c²/2 = 1/2.
  // P_sb_each_AM = (μ A_c)² / 8 = μ²/8. P_sb_total_AM = μ²/4.
  // η_AM = (μ²/4) / (1/2 + μ²/4).
  const Pc = A_C * A_C / 2
  const PsbEach = (mu * A_C) ** 2 / 8
  const PsbTotal = 2 * PsbEach
  const PtotalAM = Pc + PsbTotal
  const etaAM = PtotalAM > 0 ? PsbTotal / PtotalAM : 0
  const PtotalDSB = PsbTotal // same sidebands, no carrier
  const powerRatio = PtotalAM / Math.max(PtotalDSB, 1e-9) // AM uses this many × the DSB power

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Φάσμα: Conventional AM vs DSB-SC — η μόνη διαφορά είναι ο carrier
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Ίδιο single-tone <span className="font-mono">m(t)</span>, ίδιο{' '}
        <span className="font-mono">f_c</span>, ίδιο{' '}
        <span className="font-mono">μ</span>. Πάνω: AM. Κάτω: DSB-SC. Παρατήρησε
        ότι οι πλευρικές (μπλε) είναι <strong>πανομοιότυπες</strong> —
        ίδιες θέσεις, ίδια ύψη. Το μόνο που λείπει στο DSB-SC είναι ο
        carrier impulse (violet) — και μαζί του φεύγει η σπατάλη ισχύος.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="AM vs DSB-SC spectra at the same modulation index"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          μ = <span className="font-mono text-fg tabular-nums">{mu.toFixed(2)}</span>
          {' · '}
          ύψος carrier (μόνο AM) = <span className="font-mono text-fg tabular-nums">A_c/2 = {Pc > 0 ? '0.50' : '0.00'}</span>
          {' · '}
          ύψος κάθε πλευρικής (και τα δύο) ={' '}
          <span className="font-mono text-fg tabular-nums">μA_c/4 = {(mu / 4).toFixed(3)}</span>
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.02}
          value={mu}
          onChange={(e) => setMu(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Modulation index mu (shared)"
        />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-violet-400/50 bg-violet-50/60 px-3 py-2 text-xs dark:border-violet-400/40 dark:bg-violet-400/10">
          <div className="font-semibold text-violet-900 dark:text-violet-100">
            AM (Conventional)
          </div>
          <table className="mt-1 w-full font-mono text-[11px] text-fg tabular-nums">
            <tbody>
              <tr>
                <td className="text-fg-muted">P_c (carrier, σπαταλημένη)</td>
                <td className="text-right">{Pc.toFixed(3)}</td>
              </tr>
              <tr>
                <td className="text-fg-muted">2 P_sb (πλευρικές, χρήσιμη)</td>
                <td className="text-right">{PsbTotal.toFixed(3)}</td>
              </tr>
              <tr className="border-t border-violet-300/40">
                <td className="text-fg-muted">P_total</td>
                <td className="text-right">{PtotalAM.toFixed(3)}</td>
              </tr>
              <tr>
                <td className="text-fg-muted">η = P_useful / P_total</td>
                <td className="text-right">
                  <strong>{(etaAM * 100).toFixed(1)}%</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rounded-md border border-emerald-400/50 bg-emerald-50/60 px-3 py-2 text-xs dark:border-emerald-400/40 dark:bg-emerald-400/10">
          <div className="font-semibold text-emerald-900 dark:text-emerald-100">
            DSB-SC
          </div>
          <table className="mt-1 w-full font-mono text-[11px] text-fg tabular-nums">
            <tbody>
              <tr>
                <td className="text-fg-muted">P_c (κανένας carrier)</td>
                <td className="text-right">0.000</td>
              </tr>
              <tr>
                <td className="text-fg-muted">2 P_sb (πλευρικές, χρήσιμη)</td>
                <td className="text-right">{PsbTotal.toFixed(3)}</td>
              </tr>
              <tr className="border-t border-emerald-300/40">
                <td className="text-fg-muted">P_total</td>
                <td className="text-right">{PtotalDSB.toFixed(3)}</td>
              </tr>
              <tr>
                <td className="text-fg-muted">η = P_useful / P_total</td>
                <td className="text-right">
                  <strong>100.0%</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Στο τρέχον <span className="font-mono">μ = {mu.toFixed(2)}</span>, η Conventional AM
        στέλνει <span className="font-mono">{powerRatio.toFixed(1)}×</span> την ισχύ
        που στέλνει η DSB-SC για το <em>ίδιο</em> message. Όλη η επιπλέον ισχύς
        πάει στον carrier impulse (violet) — που, όπως είδαμε, δεν κουβαλάει
        πληροφορία. Στο <span className="font-mono">μ = 1</span> ο λόγος γίνεται{' '}
        <span className="font-mono">3×</span> — αυτό είναι το <strong>33.3% ceiling</strong>{' '}
        της AM. Στο <span className="font-mono">μ → 0</span>, ο λόγος εκρήγνυται:
        όλη η ισχύς πάει στον carrier και η AM γίνεται καθαρή σπατάλη.
      </div>
    </figure>
  )
}

const PAD_X = 28
const PAD_Y = 14

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  mu: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const panelH = (h - 6) / 2
  drawSpectrumPanel(ctx, colors, 0, 0, w, panelH, mu, 'am')
  // divider
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(20, panelH + 3)
  ctx.lineTo(w - 20, panelH + 3)
  ctx.stroke()
  drawSpectrumPanel(ctx, colors, 0, panelH + 6, w, panelH, mu, 'dsb')
}

function drawSpectrumPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  mu: number,
  mode: 'am' | 'dsb',
) {
  if (!colors) return

  const fMax = FC + FM + 1.8
  const fMin = -fMax
  const yMax = 0.62

  const xt = (f: number) => lerp(f, fMin, fMax, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yMax, -yMax * 0.25, y0 + PAD_Y + 6, y0 + ph - PAD_Y)
  const yZero = yv(0)

  // Panel title chip
  ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  if (mode === 'am') {
    ctx.fillStyle = 'rgb(124, 58, 237)'
    ctx.fillText('AM:   X_AM(f) = (A_c/2)[δ(f∓f_c)] + sidebands', x0 + PAD_X, y0 + 12)
  } else {
    ctx.fillStyle = 'rgb(5, 150, 105)'
    ctx.fillText('DSB-SC:   X_DSB(f) = ½[M(f∓f_c)] — μόνο sidebands', x0 + PAD_X, y0 + 12)
  }

  // x axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()
  // arrow head
  ctx.fillStyle = colors.fgMuted
  ctx.beginPath()
  ctx.moveTo(x0 + pw - PAD_X + 6, yZero)
  ctx.lineTo(x0 + pw - PAD_X - 4, yZero - 4)
  ctx.lineTo(x0 + pw - PAD_X - 4, yZero + 4)
  ctx.closePath()
  ctx.fill()
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('f', x0 + pw - PAD_X + 12, yZero + 4)

  // y axis at f=0
  ctx.strokeStyle = colors.border
  ctx.beginPath()
  ctx.moveTo(xt(0), yZero - 20)
  ctx.lineTo(xt(0), yZero + 6)
  ctx.stroke()

  const carrierH = A_C / 2
  const sidebandH = (mu * A_C) / 4

  // Carrier impulses (only for AM; ghost outline for DSB-SC)
  if (mode === 'am') {
    drawImpulse(ctx, xt(FC), yZero, yv(carrierH), CARRIER_C, 'A_c/2', false)
    drawImpulse(ctx, xt(-FC), yZero, yv(carrierH), CARRIER_C, 'A_c/2', false)
  } else {
    // Ghost where the carrier WOULD be — red X over it
    drawGhostImpulse(ctx, xt(FC), yZero, yv(carrierH))
    drawGhostImpulse(ctx, xt(-FC), yZero, yv(carrierH))
    // Annotation: "no carrier"
    ctx.fillStyle = 'rgb(220, 38, 38)'
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('(suppressed)', xt(FC), yv(carrierH) - 14)
    ctx.fillText('(suppressed)', xt(-FC), yv(carrierH) - 14)
  }

  // Sideband impulses — IDENTICAL in both modes
  if (mu > 0.001) {
    drawImpulse(ctx, xt(FC + FM), yZero, yv(sidebandH), SIDEBAND_C, 'μA_c/4', true)
    drawImpulse(ctx, xt(FC - FM), yZero, yv(sidebandH), SIDEBAND_C, 'μA_c/4', true)
    drawImpulse(ctx, xt(-FC + FM), yZero, yv(sidebandH), SIDEBAND_C, 'μA_c/4', true)
    drawImpulse(ctx, xt(-FC - FM), yZero, yv(sidebandH), SIDEBAND_C, 'μA_c/4', true)
  }

  // Bandwidth annotation around +f_c
  const bwY = y0 + ph - PAD_Y - 18
  ctx.strokeStyle = colors.fgMuted
  ctx.setLineDash([4, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xt(FC - FM), bwY)
  ctx.lineTo(xt(FC + FM), bwY)
  ctx.stroke()
  ctx.setLineDash([])
  // tick marks
  ctx.beginPath()
  ctx.moveTo(xt(FC - FM), bwY - 4)
  ctx.lineTo(xt(FC - FM), bwY + 4)
  ctx.moveTo(xt(FC + FM), bwY - 4)
  ctx.lineTo(xt(FC + FM), bwY + 4)
  ctx.stroke()
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('BW = 2 f_m', xt(FC), bwY - 6)

  // Tick labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('f_c', xt(FC), yZero + 14)
  ctx.fillText('−f_c', xt(-FC), yZero + 14)
  ctx.fillText('0', xt(0), yZero + 14)
}

function drawImpulse(
  ctx: CanvasRenderingContext2D,
  x: number,
  yBase: number,
  yTop: number,
  color: string,
  label: string,
  showLabel: boolean,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = 2.2
  ctx.beginPath()
  ctx.moveTo(x, yBase)
  ctx.lineTo(x, yTop)
  ctx.stroke()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, yTop - 6)
  ctx.lineTo(x - 4, yTop + 2)
  ctx.lineTo(x + 4, yTop + 2)
  ctx.closePath()
  ctx.fill()
  if (showLabel && yBase - yTop > 12) {
    ctx.font = '8.5px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillStyle = color
    ctx.fillText(label, x, yTop - 8)
  }
}

function drawGhostImpulse(
  ctx: CanvasRenderingContext2D,
  x: number,
  yBase: number,
  yTop: number,
) {
  // Faint outline + red X — where the carrier WOULD have been in AM
  ctx.strokeStyle = MUTED_C
  ctx.lineWidth = 1.2
  ctx.setLineDash([2, 3])
  ctx.beginPath()
  ctx.moveTo(x, yBase)
  ctx.lineTo(x, yTop)
  ctx.stroke()
  ctx.setLineDash([])

  // Red X marker
  ctx.strokeStyle = 'rgb(220, 38, 38)'
  ctx.lineWidth = 2
  const xS = 5
  ctx.beginPath()
  ctx.moveTo(x - xS, yTop - xS)
  ctx.lineTo(x + xS, yTop + xS)
  ctx.moveTo(x + xS, yTop - xS)
  ctx.lineTo(x - xS, yTop + xS)
  ctx.stroke()
}
