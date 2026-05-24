'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { besselJ } from '@/lib/bessel'

/**
 * Slide 26 του SE_session15_16_16_FM.pdf:
 *   «Το παραπάνω ισχύει τόσο για τη διαμόρφωση PM όσο και για την FM.»
 *
 * Slide 46 δίνει τους ρητούς τύπους:
 *   B_PM = 2W(K_p α + 1) = 2W(β_p + 1)
 *   B_FM = 2W(K_f α/W + 1) = 2W(β_f + 1)
 *
 * Slide 44: «Θα προκύψει το ίδιο αποτέλεσμα στην περίπτωση διαμόρφωσης PM με
 *           m(t) = α sin(2π f_m t) και K_p = K_f/f_m» (η ισοδυναμία στο
 *           single-tone όριο για να ταυτιστούν τα δύο φάσματα — δείχνει ότι
 *           οι constants μπορούν να μεταφραστούν).
 *
 * Η viz: δύο side-by-side panels με PM και FM φάσματα, με ανεξάρτητους
 * sliders K_f, K_p, α, f_m. Ο φοιτητής βλέπει live ότι:
 *
 *   (α) Carson εφαρμόζεται αυτούσιος και στα δύο
 *   (β) η β έχει διαφορετικό υπολογισμό (β_f = K_f α / f_m vs β_p = K_p α)
 *   (γ) ΟΤΑΝ β_p = β_f, τα δύο φάσματα είναι ταυτόσημα (single-tone όριο)
 *   (δ) Η Carson bandwidth εξαρτάται ΜΟΝΟ από β και W — όχι από το ποιο είναι
 *
 * Default values: K_f = 10, K_p = 2π·10 ≈ 62.83, α = 1, f_m = 1 — βάζουν το
 * σύστημα στο «equivalent» όριο (β_p = β_f = 10).
 */

const FC_VIS = 24
const N_MAX = 16

export function PmFmCarsonEquivalenceViz() {
  const [Kf, setKf] = useState(10) // FM constant
  const [Kp, setKp] = useState(10) // PM constant
  const [alpha, setAlpha] = useState(1) // amplitude
  const fmCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const pmCanvasRef = useRef<HTMLCanvasElement | null>(null)

  // Single-tone: m(t) = α cos(2π f_m t), W = f_m
  // β_f = K_f α / f_m, β_p = K_p α
  const beta_f = (Kf * alpha) / 1 // f_m = 1 in normalized units
  const beta_p = Kp * alpha
  const equivalence = Math.abs(beta_f - beta_p) < 0.05
  const carsonFM = 2 * (beta_f + 1) // in units of f_m
  const carsonPM = 2 * (beta_p + 1)
  const NFM = 2 * Math.floor(beta_f) + 3
  const NPM = 2 * Math.floor(beta_p) + 3

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (fmCanvasRef.current) drawSpectrum(fmCanvasRef.current, colors, beta_f, 'FM')
    if (pmCanvasRef.current) drawSpectrum(pmCanvasRef.current, colors, beta_p, 'PM')

    const onResize = () => {
      const c = getThemeColors()
      if (!c) return
      if (fmCanvasRef.current) drawSpectrum(fmCanvasRef.current, c, beta_f, 'FM')
      if (pmCanvasRef.current) drawSpectrum(pmCanvasRef.current, c, beta_p, 'PM')
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [beta_f, beta_p])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Carson για PM και FM — slide 26 + 46
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Ο prof στο slide 26 γράφει ρητά: «το παραπάνω ισχύει τόσο για PM όσο και για FM».
        Single-tone m(t) = α cos(2π f_m t), W = f_m. Δες πώς αλλάζουν τα β για κάθε
        σχήμα ανεξάρτητα — ο Carson τύπος{' '}
        <span className="font-mono">B = 2W(β+1)</span> εφαρμόζεται αυτούσιος.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-xs font-semibold text-fg">
              FM — β_f = K_f α / f_m
            </span>
            <span className="font-mono text-xs text-fg-muted">
              β_f = {beta_f.toFixed(2)}
            </span>
          </div>
          <canvas
            ref={fmCanvasRef}
            style={{ height: 200 }}
            className="block h-[200px] w-full rounded-md border border-border bg-bg-soft/30"
            aria-label="FM spectrum"
          />
        </div>
        <div>
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-xs font-semibold text-fg">PM — β_p = K_p α</span>
            <span className="font-mono text-xs text-fg-muted">
              β_p = {beta_p.toFixed(2)}
            </span>
          </div>
          <canvas
            ref={pmCanvasRef}
            style={{ height: 200 }}
            className="block h-[200px] w-full rounded-md border border-border bg-bg-soft/30"
            aria-label="PM spectrum"
          />
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <label className="block text-xs text-fg-muted">
            K_f ={' '}
            <span className="font-mono text-fg tabular-nums">{Kf.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min={0.1}
            max={15}
            step={0.1}
            value={Kf}
            onChange={(e) => setKf(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="K_f for FM"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            K_p ={' '}
            <span className="font-mono text-fg tabular-nums">{Kp.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min={0.1}
            max={15}
            step={0.1}
            value={Kp}
            onChange={(e) => setKp(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="K_p for PM"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            α (πλάτος m) ={' '}
            <span className="font-mono text-fg tabular-nums">{alpha.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min={0.1}
            max={3}
            step={0.05}
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="alpha amplitude"
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <div className="rounded-md border border-blue-400/40 bg-blue-50 px-2 py-1 dark:border-blue-500/30 dark:bg-blue-500/10">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            FM: B = 2W(β_f+1)
          </div>
          <div className="font-mono text-fg tabular-nums">{carsonFM.toFixed(1)} · W</div>
        </div>
        <div className="rounded-md border border-emerald-400/40 bg-emerald-50 px-2 py-1 dark:border-emerald-500/30 dark:bg-emerald-500/10">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            PM: B = 2W(β_p+1)
          </div>
          <div className="font-mono text-fg tabular-nums">{carsonPM.toFixed(1)} · W</div>
        </div>
        <div className="rounded-md border border-border bg-bg-soft px-2 py-1">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            N_FM = 2⌊β_f⌋+3
          </div>
          <div className="font-mono text-fg tabular-nums">{NFM}</div>
        </div>
        <div className="rounded-md border border-border bg-bg-soft px-2 py-1">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            N_PM = 2⌊β_p⌋+3
          </div>
          <div className="font-mono text-fg tabular-nums">{NPM}</div>
        </div>
      </div>

      {equivalence ? (
        <p className="mt-3 rounded-md border border-violet-400/40 bg-violet-50/70 px-3 py-2 text-xs dark:border-violet-500/30 dark:bg-violet-500/10">
          <span className="font-semibold text-violet-700 dark:text-violet-300">
            ✓ β_p = β_f — τα δύο φάσματα ταυτίζονται.
          </span>{' '}
          Αυτή είναι ακριβώς η ισοδυναμία του slide 44: PM και FM παράγουν ΤΟ ΙΔΙΟ
          single-tone σήμα όταν οι constants τους «μεταφράζονται» κατάλληλα. Carson
          δίνει την ίδια bandwidth και στα δύο.
        </p>
      ) : (
        <p className="mt-3 text-xs text-fg-subtle">
          Με αυτές τις τιμές, β_p ≠ β_f, οπότε τα φάσματα είναι διαφορετικά. ΟΜΩΣ:
          μέσα σε κάθε panel η ίδια Carson εξίσωση δουλεύει — απλά με διαφορετικό β.
          Δοκίμασε K_f = K_p για να δεις την ισοδυναμία.
        </p>
      )}
    </figure>
  )
}

const POS_C = 'rgb(29, 78, 216)'
const NEG_C = 'rgb(217, 119, 6)'
const CARRIER_C = 'rgb(168, 85, 247)'
const CARSON_C = 'rgba(168, 85, 247, 0.5)'

function drawSpectrum(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  beta: number,
  label: 'FM' | 'PM',
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const PAD_L = 20
  const PAD_R = 16
  const PAD_T = 12
  const PAD_B = 30
  const N_VIS = Math.min(N_MAX, Math.max(6, Math.ceil(beta) + 3))
  const fMin = FC_VIS - N_VIS - 0.6
  const fMax = FC_VIS + N_VIS + 0.6
  const xf = (f: number) => lerp(f, fMin, fMax, PAD_L, w - PAD_R)
  const yAxis = h - PAD_B

  // Carson shading
  const xCarsonL = xf(FC_VIS - (beta + 1))
  const xCarsonR = xf(FC_VIS + (beta + 1))
  ctx.fillStyle = 'rgba(168, 85, 247, 0.08)'
  ctx.fillRect(xCarsonL, PAD_T, xCarsonR - xCarsonL, yAxis - PAD_T)
  ctx.strokeStyle = CARSON_C
  ctx.setLineDash([4, 4])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xCarsonL, PAD_T)
  ctx.lineTo(xCarsonL, yAxis)
  ctx.moveTo(xCarsonR, PAD_T)
  ctx.lineTo(xCarsonR, yAxis)
  ctx.stroke()
  ctx.setLineDash([])

  // Axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_L, yAxis)
  ctx.lineTo(w - PAD_R, yAxis)
  ctx.stroke()

  // f_c label
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('f_c', xf(FC_VIS), yAxis + 14)

  // Carson label
  ctx.fillStyle = CARRIER_C
  ctx.font = 'bold 10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText(`Carson ±${(beta + 1).toFixed(1)}f_m`, (xCarsonL + xCarsonR) / 2, PAD_T + 11)

  // Stems
  const yMagMax = 0.7
  const yPlot = (mag: number) => lerp(mag, 0, yMagMax, yAxis, PAD_T + 18)
  for (let n = -N_VIS; n <= N_VIS; n++) {
    const f = FC_VIS + n
    const J = besselJ(n, beta)
    const mag = Math.abs(J) / 2
    if (mag < 0.001) continue
    const x = xf(f)
    const yTop = yPlot(mag)
    const isNeg = J < 0
    const isCarrier = n === 0
    ctx.strokeStyle = isCarrier ? CARRIER_C : isNeg ? NEG_C : POS_C
    ctx.fillStyle = ctx.strokeStyle
    ctx.lineWidth = isCarrier ? 2.5 : 1.5
    ctx.beginPath()
    ctx.moveTo(x, yAxis)
    ctx.lineTo(x, yTop)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x - 2.5, yTop + 4)
    ctx.lineTo(x, yTop)
    ctx.lineTo(x + 2.5, yTop + 4)
    ctx.closePath()
    ctx.fill()
  }

  // Modality label
  ctx.fillStyle = label === 'FM' ? 'rgb(29, 78, 216)' : 'rgb(16, 185, 129)'
  ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(label, PAD_L + 4, PAD_T + 11)
}
