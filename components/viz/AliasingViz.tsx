'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * Aliasing demo: original cosine at f_0, sampled at f_s < 2 f_0,
 * shows the *aliased* cosine that those samples could equally well
 * have come from: f_alias = |f_0 - k f_s| where k makes f_alias < f_s/2.
 *
 * Slider: f_0 (signal frequency). f_s is fixed at 4 Hz to make the
 * folding visible.
 *
 * Pedagogically: students should "see" that a high-frequency cosine
 * sampled too slowly looks identical to a low-frequency cosine.
 * The wagon-wheel effect from movies.
 */

const FS = 4 // sample rate, fixed

export function AliasingViz() {
  const [f0, setF0] = useState(3) // Hz
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, f0)
    const onResize = () => {
      if (canvas && colors) drawScene(canvas, colors, f0)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [f0])

  // Compute aliased frequency: f_alias = |f0 - round(f0/fs)*fs| for cosines
  // (more precisely the principal alias in [0, fs/2])
  const fAlias = aliasedFreq(f0, FS)
  const isAliased = Math.abs(fAlias - f0) > 1e-3

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-3 text-sm font-semibold tracking-tight">
        Aliasing — όταν το ίδιο set samples αντιστοιχεί σε **δύο** σήματα
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Σταθερό sample rate: <span className="font-mono">f_s = {FS} Hz</span>{' '}
        (Nyquist limit: f_s/2 = {FS / 2} Hz). Πορτοκαλί καμπύλη: αρχικό
        cos(2π f₀ t). Πράσινη: η κρυφή «ίδια-samples» χαμηλόσυχνη
        παρουσία (alias). Σύρε το f₀ και δες πώς, όταν περάσει το {FS / 2}{' '}
        Hz, η alias αρχίζει να φαίνεται διαφορετική — αλλά τα μπλε samples
        ταυτίζονται.
      </p>
      <canvas
        ref={canvasRef}
        style={{ height: 300 }}
        className="block h-[300px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Aliasing visualization"
      />
      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          f₀ ={' '}
          <span className="font-mono text-fg tabular-nums">{f0.toFixed(2)}</span>{' '}
          Hz
          {' · '}
          alias στα{' '}
          <span className="font-mono text-fg tabular-nums">
            {fAlias.toFixed(2)}
          </span>{' '}
          Hz
          {' · '}
          {isAliased ? (
            <span className="font-medium text-red-600 dark:text-red-400">
              ⚠️ Aliased (f₀ &gt; f_s/2)
            </span>
          ) : (
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              ✓ No aliasing
            </span>
          )}
        </label>
        <input
          type="range"
          min={0.1}
          max={6}
          step={0.05}
          value={f0}
          onChange={(e) => setF0(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
        />
      </div>
      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>Wagon-wheel effect:</strong> σε ταινίες, ένας τροχός που
        γυρίζει γρήγορα φαίνεται να γυρίζει αργά (ή και ανάποδα) όταν η
        rotation rate ξεπεράσει την rate του camera frame. Ίδιο φαινόμενο.
      </div>
    </figure>
  )
}

function aliasedFreq(f0: number, fs: number): number {
  // For real cosines, alias = |f0 - round(f0/fs) * fs|, then mirror to [0, fs/2]
  const k = Math.round(f0 / fs)
  let f = Math.abs(f0 - k * fs)
  if (f > fs / 2) f = fs - f
  return f
}

const T_SPAN = 4
const ORIG_RES = 800

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  f0: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const PAD_X = 50
  const PAD_TOP = 20
  const PAD_BOTTOM = 24
  const yLim = 1.4
  const xt = (t: number) => lerp(t, 0, T_SPAN, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, PAD_TOP, h - PAD_BOTTOM)
  const yZero = yv(0)

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X, yZero)
  ctx.lineTo(w - PAD_X, yZero)
  ctx.stroke()

  const fAlias = aliasedFreq(f0, FS)

  // Alias signal (drawn first, behind original)
  ctx.strokeStyle = 'rgb(34, 197, 94)'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i <= ORIG_RES; i++) {
    const t = (i / ORIG_RES) * T_SPAN
    const v = Math.cos(2 * Math.PI * fAlias * t)
    const x = xt(t)
    const y = yv(v)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // Original signal
  ctx.strokeStyle = 'rgb(217, 119, 6)'
  ctx.lineWidth = 1.6
  ctx.beginPath()
  for (let i = 0; i <= ORIG_RES; i++) {
    const t = (i / ORIG_RES) * T_SPAN
    const v = Math.cos(2 * Math.PI * f0 * t)
    const x = xt(t)
    const y = yv(v)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // Samples
  const Ts = 1 / FS
  ctx.strokeStyle = 'rgb(29, 78, 216)'
  ctx.fillStyle = 'rgb(29, 78, 216)'
  ctx.lineWidth = 1.4
  for (let n = 0; n * Ts <= T_SPAN; n++) {
    const t = n * Ts
    const v = Math.cos(2 * Math.PI * f0 * t)
    const x = xt(t)
    const y = yv(v)
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fill()
  }

  // Legend
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  let lx = PAD_X
  ctx.fillStyle = 'rgb(217, 119, 6)'
  ctx.fillRect(lx, 6, 14, 2)
  ctx.fillText(`αρχικό f₀=${f0.toFixed(2)} Hz`, lx + 18, 14)
  lx += 130
  ctx.fillStyle = 'rgb(34, 197, 94)'
  ctx.fillRect(lx, 6, 14, 2)
  ctx.fillText(`alias στα ${fAlias.toFixed(2)} Hz`, lx + 18, 14)
  lx += 130
  ctx.fillStyle = 'rgb(29, 78, 216)'
  ctx.beginPath()
  ctx.arc(lx + 4, 7, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillText('samples (ίδια)', lx + 12, 14)

  // X-axis labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (let t = 0; t <= T_SPAN; t++) {
    ctx.fillText(`${t}s`, xt(t), h - 6)
  }
}
