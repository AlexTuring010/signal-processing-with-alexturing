'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * "Frequency without repetition", for FT §1.
 *
 * The conceptual blocker the page opens with: how can a signal that never
 * repeats have a "frequency"? Answer: frequency lives in the INGREDIENTS, not
 * in the whole. A pure cosine is eternal (runs from −∞ to +∞); but a weighted
 * blend of many eternal cosines can REINFORCE in one spot and CANCEL everywhere
 * else, building a one-shot pulse out of never-ending waves.
 *
 * Target pulse: a Gaussian p(t) = e^{−πt²} (real, even, smooth) whose Fourier
 * transform is the Gaussian density P(f) = e^{−πf²}. We rebuild it as a discrete
 * inverse-FT Riemann sum over tones spaced Δf:
 *     recon(t) = Σ_{k=−N}^{N} P(kΔf)·cos(2π·kΔf·t)·Δf
 * The slider adds tones (raises N). At low N the partial sum is wavy across the
 * WHOLE window — you literally see the constituent cosines showing through; as N
 * grows the sides cancel flat and only the central bump survives.
 *
 * Deliberately ONE idea: eternal tones → localized pulse. No spectrum/height
 * bookkeeping (that is the next viz). One faint, schematic full-width cosine is
 * drawn purely to anchor "the ingredients never stop".
 */

const N_MIN = 1
const N_MAX = 16
const DF = 0.12 // tone spacing (fixed); reconstruction period 1/Δf ≈ 8.3 > window
const T_WIN = 3.2

function gaussTime(t: number) {
  return Math.exp(-Math.PI * t * t)
}
function gaussFreq(f: number) {
  return Math.exp(-Math.PI * f * f)
}

function recon(t: number, N: number) {
  let s = gaussFreq(0) * DF // k = 0 term
  for (let k = 1; k <= N; k++) {
    const f = k * DF
    s += 2 * gaussFreq(f) * Math.cos(2 * Math.PI * f * t) * DF
  }
  return s
}

export function PulseFromTones() {
  const [N, setN] = useState(5)
  const ref = useRef<HTMLCanvasElement | null>(null)
  const fMax = N * DF

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors || !ref.current) return
    draw(ref.current, colors, N)
  }, [N])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Αιώνια cosines φτιάχνουν έναν μοναχικό παλμό
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Στόχος (διακεκομμένη): ένας <strong>μονήρης παλμός</strong> που{' '}
        <strong>δεν επαναλαμβάνεται</strong>. Τον χτίζουμε ανακατεύοντας καθαρά{' '}
        <span className="font-mono">cos(2πft)</span> — που το καθένα{' '}
        <strong>τρέχει αιώνια</strong>. Σύρε για να προσθέσεις συχνότητες: με λίγες, το
        άθροισμα κυματίζει σε όλο τον άξονα· με περισσότερες, τα κύματα{' '}
        <strong>αλληλοαναιρούνται στα πλάγια</strong> και <strong>συμφωνούν στο κέντρο</strong>{' '}
        — μένει ο παλμός.
      </p>

      <canvas
        ref={ref}
        style={{ height: 240 }}
        className="block h-[240px] w-full"
        aria-label="A localized pulse rebuilt as a sum of eternal cosines; more tones sharpen it"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          αριθμός συχνοτήτων (tones) N ={' '}
          <span className="font-mono text-fg tabular-nums">{N}</span>
          {' · '}μέγιστη συχνότητα στο μείγμα ={' '}
          <span className="font-mono text-fg tabular-nums">{fMax.toFixed(2)}</span> Hz
        </label>
        <input
          type="range"
          min={N_MIN}
          max={N_MAX}
          step={1}
          value={N}
          onChange={(e) => setN(parseInt(e.target.value, 10))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Number of tones N"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Η συχνότητα δεν ζει στο <strong>όλο</strong> σήμα — ζει στα{' '}
        <strong>συστατικά</strong> του. Κάθε cosine επαναλαμβάνεται για πάντα· το{' '}
        <strong>μείγμα</strong> τους όχι. Γι' αυτό «ο παλμός έχει μέσα του τη συχνότητα{' '}
        <span className="font-mono">f</span>» σημαίνει απλώς «το cosine της{' '}
        <span className="font-mono">f</span> είναι ένα από τα συστατικά του, με κάποιο
        βάρος» — και δεν χρειάζεται καμία επανάληψη του ίδιου του σήματος.
      </div>
    </figure>
  )
}

const PAD_X = 30
const PAD_Y = 16

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}

function draw(canvas: HTMLCanvasElement, colors: ThemeColors, N: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const yMax = 1.28
  const yMin = -0.5
  const xt = (t: number) => lerp(t, -T_WIN, T_WIN, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yMax, yMin, PAD_Y, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)
  const STEPS = 480

  // Axis.
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 6, yZero)
  ctx.lineTo(w - PAD_X + 6, yZero)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y - 4)
  ctx.lineTo(xt(0), h - PAD_Y)
  ctx.stroke()

  // One faint, schematic full-width cosine: the highest tone currently included,
  // drawn at a visible (not weight-scaled) amplitude to anchor "ingredients are
  // eternal, oscillating waves that span the whole axis".
  const fRep = N * DF
  ctx.strokeStyle = `rgba(${accentRgb}, 0.30)`
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, -T_WIN, T_WIN)
    const y = yv(0.26 * Math.cos(2 * Math.PI * fRep * t))
    if (i === 0) ctx.moveTo(xt(t), y)
    else ctx.lineTo(xt(t), y)
  }
  ctx.stroke()

  // Target pulse (dashed).
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1.4
  ctx.setLineDash([4, 3])
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, -T_WIN, T_WIN)
    const y = yv(gaussTime(t))
    if (i === 0) ctx.moveTo(xt(t), y)
    else ctx.lineTo(xt(t), y)
  }
  ctx.stroke()
  ctx.setLineDash([])

  // Partial reconstruction (bold) — the sum of N tones, to scale.
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2.2
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, -T_WIN, T_WIN)
    const y = yv(recon(t, N))
    if (i === 0) ctx.moveTo(xt(t), y)
    else ctx.lineTo(xt(t), y)
  }
  ctx.stroke()

  // Legend.
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillStyle = colors.accent
  ctx.fillText('άθροισμα N tones', PAD_X + 4, PAD_Y + 4)
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('στόχος: ο παλμός', PAD_X + 4, PAD_Y + 18)
  ctx.fillStyle = `rgba(${accentRgb}, 0.6)`
  ctx.fillText('ένα συστατικό cosine (σχηματικά)', PAD_X + 4, PAD_Y + 32)

  // t ticks.
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('0', xt(0), h - 2)
  ctx.fillText('t', w - PAD_X + 2, yZero - 4)
}
