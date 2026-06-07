'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * "Frequency without repetition", for FT §1 — shows the cosines themselves.
 *
 * Overlays the ACTUAL component cosines and their sum on one axis, so the
 * cancellation mechanism is visible instead of hidden:
 *   - At t = 0 every cosine equals 1 (all crest together) → they pile up → the
 *     sum spikes.
 *   - Away from t = 0 the different frequencies fall out of phase, the faint
 *     cosines fan out to fill the [-1, 1] band, and their sum averages to ~0.
 * So a one-shot pulse emerges from eternal waves — not by hand-tuning them to
 * cancel, but because they automatically AGREE at t = 0 and SCATTER elsewhere.
 *
 * Equal weights (honest: the cosines drawn ARE the cosines summed). The sum is
 * normalised by N so its t = 0 peak is 1; as N grows the relative side ripples
 * flatten — more tones ⇒ sharper, cleaner pulse. At N = 1 the "sum" is just the
 * single eternal cosine: no localisation, which is exactly the point.
 */

const N_MIN = 1
const N_MAX = 9
const DF = 0.22 // frequency spacing; period 1/Δf ≈ 4.5 > window ⇒ one isolated peak
const T_WIN = 2.0

function sumNorm(t: number, N: number) {
  let s = 0
  for (let k = 1; k <= N; k++) s += Math.cos(2 * Math.PI * k * DF * t)
  return s / N
}

export function PulseFromTones() {
  const [N, setN] = useState(4)
  const ref = useRef<HTMLCanvasElement | null>(null)

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
        Οι <span className="font-semibold text-fg-muted">αχνές</span> καμπύλες είναι τα{' '}
        <strong>πραγματικά συστατικά cosines</strong> — το καθένα{' '}
        <strong>τρέχει αιώνια</strong> σε όλο τον άξονα. Η{' '}
        <span className="font-semibold" style={{ color: 'rgb(var(--accent))' }}>
          έντονη
        </span>{' '}
        καμπύλη είναι το <strong>άθροισμά τους</strong>. Στο{' '}
        <span className="font-mono">t = 0</span> κάθε cosine ισούται με{' '}
        <span className="font-mono">1</span> — όλα στοιβάζονται και το άθροισμα{' '}
        <strong>εκτοξεύεται</strong>· παραέξω ξεσυγχρονίζονται, απλώνονται σε όλη τη ζώνη
        και <strong>αλληλοαναιρούνται</strong> (το άθροισμα πέφτει στο ~0).
      </p>

      <canvas
        ref={ref}
        style={{ height: 250 }}
        className="block h-[250px] w-full"
        aria-label="Several eternal cosines overlaid with their sum; they align at t=0 and cancel on the sides"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          αριθμός συχνοτήτων (cosines) N ={' '}
          <span className="font-mono text-fg tabular-nums">{N}</span>
          {N === 1 && (
            <span className="ml-2 text-fg-subtle">
              — ένα μόνο cosine: κανένας παλμός, μόνο ένα αιώνιο κύμα
            </span>
          )}
        </label>
        <input
          type="range"
          min={N_MIN}
          max={N_MAX}
          step={1}
          value={N}
          onChange={(e) => setN(parseInt(e.target.value, 10))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Number of cosines N"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Δεν τα «διαλέγουμε» ένα-ένα για να αναιρεθούν. Στο{' '}
        <span className="font-mono">t = 0</span> κάθε cosine ισούται με{' '}
        <span className="font-mono">1</span>, οπότε στοιβάζονται <strong>αναγκαστικά</strong> →
        κορυφή. Σε κάθε άλλο <span className="font-mono">t</span>, οι διαφορετικές συχνότητες
        είναι σε <strong>διαφορετική φάση</strong>, γεμίζουν όλη τη ζώνη{' '}
        <span className="font-mono">[−1, 1]</span> και ο μέσος τους πέφτει στο ~0. Τα{' '}
        <strong>βάρη</strong> (το <span className="font-mono">X(f)</span>) απλώς καθορίζουν το{' '}
        <strong>σχήμα</strong>· η εντόπιση βγαίνει μόνη της, επειδή στο{' '}
        <span className="font-mono">t = 0</span> συμφωνούν όλες οι συχνότητες.
      </div>
    </figure>
  )
}

const PAD_X = 30
const PAD_Y = 20

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}

function draw(canvas: HTMLCanvasElement, colors: ThemeColors, N: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const yA = 1.18
  const xt = (t: number) => lerp(t, -T_WIN, T_WIN, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yA, -yA, PAD_Y, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)
  const STEPS = 520

  // Zero axis.
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 6, yZero)
  ctx.lineTo(w - PAD_X + 6, yZero)
  ctx.stroke()

  // t = 0 guide (vertical) — where all cosines agree.
  ctx.strokeStyle = `rgba(${accentRgb}, 0.40)`
  ctx.setLineDash([4, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xt(0), PAD_Y - 6)
  ctx.lineTo(xt(0), h - PAD_Y + 4)
  ctx.stroke()
  ctx.setLineDash([])

  // The actual component cosines, faint — they fill the band where they scatter.
  ctx.strokeStyle = `rgba(${accentRgb}, 0.22)`
  ctx.lineWidth = 1
  for (let k = 1; k <= N; k++) {
    ctx.beginPath()
    for (let i = 0; i <= STEPS; i++) {
      const t = lerp(i, 0, STEPS, -T_WIN, T_WIN)
      const y = yv(Math.cos(2 * Math.PI * k * DF * t))
      if (i === 0) ctx.moveTo(xt(t), y)
      else ctx.lineTo(xt(t), y)
    }
    ctx.stroke()
  }

  // Their sum (bold, normalised so the t = 0 peak is 1).
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 2.6
  ctx.beginPath()
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, -T_WIN, T_WIN)
    const y = yv(sumNorm(t, N))
    if (i === 0) ctx.moveTo(xt(t), y)
    else ctx.lineTo(xt(t), y)
  }
  ctx.stroke()

  // Legend (top-left).
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillStyle = colors.accent
  ctx.fillText('άθροισμα', PAD_X + 4, PAD_Y - 4)
  ctx.fillStyle = `rgba(${accentRgb}, 0.55)`
  ctx.fillText('συστατικά cosines', PAD_X + 70, PAD_Y - 4)

  // t = 0 label + axis ticks.
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('t = 0', xt(0), h - 4)
  ctx.textAlign = 'right'
  ctx.fillText('t', w - PAD_X + 4, yZero - 4)
}
