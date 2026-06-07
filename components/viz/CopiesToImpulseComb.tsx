'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * Quick preview for the §2.1 → §2.2 bridge.
 *
 * As the number of repeated copies N grows (toward a true infinite periodic
 * signal), the FT stops being a smooth envelope you sample: around each harmonic
 * k·f₀ it bunches into a peak that gets TALLER and NARROWER (area fixed) until,
 * in the limit, it is an impulse δ at k·f₀ with weight aₖ. So the FT of a
 * periodic signal is a "comb" of impulses with weights aₖ — exactly what §2.2
 * builds next.
 *
 * Deliberately schematic: each harmonic is a tent of fixed area that narrows +
 * heightens with N, switching to an impulse arrow once it spikes past the top.
 * Heights follow a decaying envelope aₖ so the comb has the right shape.
 */

const N_MIN = 1
const N_MAX = 16
const K = 4 // harmonics −K..K at multiples of f₀
const Y_MAX = 3

function ak(k: number) {
  return Math.exp(-((k / 2.6) ** 2))
}

export function CopiesToImpulseComb() {
  const [N, setN] = useState(3)
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors || !ref.current) return
    draw(ref.current, colors, N)
  }, [N])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Πιο πολλά αντίγραφα → οι κορυφές γίνονται κρούσεις (ένα «χτένι»)
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Σύρε τον αριθμό αντιγράφων <span className="font-mono">N</span>. Γύρω από κάθε
        αρμονική <span className="font-mono">k·f₀</span> η κορυφή γίνεται όλο και πιο{' '}
        <strong>ψηλή και στενή</strong> (το εμβαδόν της μένει σταθερό) — ώσπου «κλειδώνει» σε
        μια <strong>κρούση δ</strong> με βάρος τον συντελεστή <span className="font-mono">aₖ</span>.
      </p>

      <canvas
        ref={ref}
        style={{ height: 170 }}
        className="block h-[170px] w-full"
        aria-label="Spectral peaks at harmonics growing taller and narrower into a comb of impulses as N grows"
      />

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          αριθμός αντιγράφων N ={' '}
          <span className="font-mono text-fg tabular-nums">{N}</span>
          {N >= N_MAX && <span className="ml-2 text-fg-subtle">— σχεδόν κρούσεις</span>}
        </label>
        <input
          type="range"
          min={N_MIN}
          max={N_MAX}
          step={1}
          value={N}
          onChange={(e) => setN(parseInt(e.target.value, 10))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Number of copies N"
        />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Στο όριο <span className="font-mono">N → ∞</span> (γνήσιο periodic σήμα) ο FT είναι ένα{' '}
        <strong>«χτένι» από κρούσεις</strong> στις αρμονικές, με βάρη τους συντελεστές{' '}
        <span className="font-mono">aₖ</span>. Αυτό ακριβώς χτίζει βήμα-βήμα η §2.2.
      </div>
    </figure>
  )
}

const PAD_X = 26
const PAD_Y = 18

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}

function draw(canvas: HTMLCanvasElement, colors: ThemeColors, N: number) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const fDom = K + 0.7
  const xt = (f: number) => lerp(f, -fDom, fDom, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, Y_MAX * 1.05, -Y_MAX * 0.08, PAD_Y, h - PAD_Y)
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  // Axis.
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 6, yZero)
  ctx.lineTo(w - PAD_X + 6, yZero)
  ctx.stroke()

  const wHalf = 0.5 / N // tent half-base ∝ 1/N
  const peakOf = (k: number) => 0.5 * ak(k) * N // height ∝ aₖ·N (area fixed)

  for (let k = -K; k <= K; k++) {
    const c = k * 1 // f₀ = 1
    const x0 = xt(c)
    const hPk = peakOf(k)

    if (hPk <= Y_MAX) {
      // Tent of fixed area: narrows + heightens with N.
      const xL = xt(c - wHalf)
      const xR = xt(c + wHalf)
      const yT = yv(hPk)
      ctx.fillStyle = `rgba(${accentRgb}, 0.18)`
      ctx.strokeStyle = colors.accent
      ctx.lineWidth = 1.4
      ctx.beginPath()
      ctx.moveTo(xL, yZero)
      ctx.lineTo(x0, yT)
      ctx.lineTo(xR, yZero)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    } else {
      // Spiked: draw as an impulse arrow at k·f₀.
      const yTop = yv(Y_MAX)
      ctx.strokeStyle = colors.accent
      ctx.fillStyle = colors.accent
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x0, yZero)
      ctx.lineTo(x0, yTop)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x0, yTop - 1)
      ctx.lineTo(x0 - 4, yTop + 7)
      ctx.lineTo(x0 + 4, yTop + 7)
      ctx.closePath()
      ctx.fill()
    }
  }

  // Harmonic ticks.
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let k = -2; k <= 2; k++) {
    const label = k === 0 ? '0' : k === 1 ? 'f₀' : k === -1 ? '−f₀' : `${k}f₀`
    ctx.fillText(label, xt(k), yZero + 14)
  }
  ctx.textAlign = 'right'
  ctx.fillText('f', w - PAD_X + 4, yZero - 4)
}
