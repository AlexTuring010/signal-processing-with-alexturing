'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { mulberry32, normal } from '@/lib/random'

/**
 * White Gaussian noise — one realization in time + the estimated PSD.
 *
 * The point the earlier version got WRONG: a single realization's periodogram
 * is an INCONSISTENT estimator. Its per-frequency variance stays ≈ (true PSD)²
 * no matter how large N is, so it ALWAYS looks like a jagged "forest" of towers
 * — growing N just adds MORE equally-noisy bins, it never flattens. What
 * collapses the towers onto the flat S_N = N₀/2 line is AVERAGING over many
 * independent realizations (Var ∝ 1/M). Two sliders make the contrast explicit:
 *   - N → samples per realization ⇒ frequency resolution (more towers, same scatter)
 *   - M → number of averaged periodograms ⇒ scatter shrinks ∝ 1/M ⇒ flattens
 *
 * Convention matches the page: two-sided PSD S_N(f) = N₀/2, shown over |f| ∈
 * [0, FS/2]. The displayed periodogram is normalized so its mean is N₀/2.
 */

const FS = 1000 // sample rate (Hz)
const N0 = 1.0 // N₀ level → two-sided PSD is N₀/2
const SIGMA = Math.sqrt((N0 * FS) / 2) // discrete-time σ so that mean(periodogram/FS) = N₀/2

export function WhiteNoiseSimulationViz() {
  const [N, setN] = useState(256)
  const [M, setM] = useState(1)
  const [seed, setSeed] = useState(3)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    const render = () => {
      if (canvas && colors) drawScene(canvas, colors, N, M, seed)
    }
    render()
    window.addEventListener('resize', render)
    return () => window.removeEventListener('resize', render)
  }, [N, M, seed])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Λευκός Gaussian θόρυβος — δείγμα + εκτιμώμενη PSD
        </h4>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
        >
          Νέα δειγματοληψία
        </button>
      </div>
      <p className="mb-2 text-xs text-fg-muted">
        Το <strong>n(t)</strong> είναι το ίδιο το σήμα του θορύβου — μία{' '}
        <em>realization</em>: μια τυχαία τιμή που αλλάζει στον χρόνο. Ο υπολογιστής
        δεν κρατά συνεχή καμπύλη· κρατά <strong>N samples</strong>, τις τιμές του{' '}
        n(t) σε N χρονικές στιγμές — η γραμμή απλώς ενώνει τα σημεία. Για{' '}
        <strong>λευκό</strong> θόρυβο τα διαδοχικά samples είναι{' '}
        <strong>ανεξάρτητα</strong> (καμία μνήμη), γι' αυτό η εικόνα είναι τόσο
        «αγκαθωτή»· κάθε sample είναι Gaussian με τυπική απόκλιση σ, οπότε ~95%
        τους πέφτουν μέσα στις <strong>±2σ</strong> γραμμές. (Διπλή σημασία του
        «δείγμα/sample»: ο τίτλος λέει «δείγμα» εννοώντας μία ολόκληρη realization —
        ένα σήμα από το ensemble· το slider «N samples» εννοεί τα χρονικά σημεία
        μέσα σε αυτήν.)
      </p>
      <p className="mb-3 text-xs text-fg-muted">
        Πάνω: αυτή η μία realization στον χρόνο. Κάτω: η εκτιμώμενη PSD, που στη
        θεωρία είναι <strong>επίπεδη στα N₀/2</strong> (κόκκινη γραμμή).{' '}
        <strong>Μία</strong> realization (M = 1) δίνει πάντα οδοντωτό «δάσος» — και
        μεγαλώνοντας το N παίρνεις <em>περισσότερα</em> «δέντρα», όχι πιο επίπεδη
        γραμμή (το periodogram κρατά ~100% σφάλμα ανά συχνότητα, ό,τι N κι αν
        βάλεις). Αυτό που το ισιώνει είναι ο <strong>μέσος όρος πολλών</strong>{' '}
        realizations: αύξησε το M και τα δέντρα μαζεύονται στη θεωρητική γραμμή (η
        διασπορά πέφτει ∝ 1/M).
      </p>
      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="White noise simulation"
      />
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            N = <span className="font-mono text-fg tabular-nums">{N}</span> samples (
            {(N / FS).toFixed(2)}s) — frequency resolution
          </label>
          <input
            type="range"
            min={64}
            max={1024}
            step={32}
            value={N}
            onChange={(e) => setN(parseInt(e.target.value, 10))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            M = <span className="font-mono text-fg tabular-nums">{M}</span> realizations (μέσος
            όρος) — εξομάλυνση
          </label>
          <input
            type="range"
            min={1}
            max={64}
            step={1}
            value={M}
            onChange={(e) => setM(parseInt(e.target.value, 10))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
          />
        </div>
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  N: number,
  M: number,
  seed: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const base = seed * 991 + 7
  const K = Math.min(96, Math.floor(N / 4))

  // Precompute the DFT basis once (it is identical for every realization) so the
  // M-fold averaging stays cheap — no trig inside the per-realization loop.
  const f = new Array<number>(K)
  const cosT = new Array<Float64Array>(K)
  const sinT = new Array<Float64Array>(K)
  for (let k = 0; k < K; k++) {
    const fk = (k / K) * (FS / 2)
    f[k] = fk
    const c = new Float64Array(N)
    const s = new Float64Array(N)
    for (let n = 0; n < N; n++) {
      const phi = -2 * Math.PI * fk * (n / FS)
      c[n] = Math.cos(phi)
      s[n] = Math.sin(phi)
    }
    cosT[k] = c
    sinT[k] = s
  }

  // Average the periodogram over M independent realizations; keep realization #0
  // for the time panel so "one realization in time" stays honest.
  let xs0: number[] = []
  const psdSum = new Array<number>(K).fill(0)
  for (let m = 0; m < M; m++) {
    const rng = mulberry32(base + m * 1009)
    const xs = new Array<number>(N)
    for (let i = 0; i < N; i++) xs[i] = normal(rng, 0, SIGMA)
    if (m === 0) xs0 = xs
    for (let k = 0; k < K; k++) {
      const c = cosT[k]
      const s = sinT[k]
      let re = 0
      let im = 0
      for (let n = 0; n < N; n++) {
        re += xs[n] * c[n]
        im += xs[n] * s[n]
      }
      psdSum[k] += (re * re + im * im) / N
    }
  }
  const psdAvg = psdSum.map((v) => v / M)

  const halfH = h / 2 - 6
  drawTimeDomain(ctx, colors, 0, 0, w, halfH, xs0)
  drawPSD(ctx, colors, 0, h / 2 + 6, w, halfH, f, psdAvg, M)
}

function drawTimeDomain(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  xs: number[],
) {
  if (!colors) return
  const PAD_X = 50
  const PAD_TOP = 18
  const PAD_BOTTOM = 22
  const yLim = SIGMA * 4
  const xt = (i: number) => lerp(i, 0, xs.length - 1, x0 + PAD_X, x0 + pw - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, y0 + PAD_TOP, y0 + ph - PAD_BOTTOM)
  const yZero = yv(0)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`n(t) — μία realization · ${xs.length} samples στον χρόνο`, x0 + PAD_X, y0 + 12)

  ctx.strokeStyle = colors.border
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yZero)
  ctx.lineTo(x0 + pw - PAD_X, yZero)
  ctx.stroke()

  // ±σ and ±2σ bands — Gaussian samples land within ±σ ~68% of the time, ±2σ ~95%.
  // ±2σ is drawn prominently (the page leans on it); ±σ stays a faint guide.
  ctx.setLineDash([4, 3])
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  const bands = [
    { k: 2, label: '+2σ', strong: true },
    { k: 1, label: '+σ', strong: false },
    { k: -1, label: '−σ', strong: false },
    { k: -2, label: '−2σ', strong: true },
  ]
  for (const b of bands) {
    const y = yv(b.k * SIGMA)
    ctx.strokeStyle = b.strong ? colors.fgMuted : colors.border
    ctx.lineWidth = b.strong ? 1.2 : 1
    ctx.beginPath()
    ctx.moveTo(x0 + PAD_X, y)
    ctx.lineTo(x0 + pw - PAD_X, y)
    ctx.stroke()
    ctx.fillStyle = b.strong ? colors.fgMuted : colors.fgSubtle
    ctx.fillText(b.label, x0 + PAD_X - 4, y + 3)
  }
  ctx.setLineDash([])
  ctx.lineWidth = 1

  // Plot noise
  ctx.strokeStyle = 'rgb(29, 78, 216)'
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let i = 0; i < xs.length; i++) {
    const x = xt(i)
    const y = yv(xs[i])
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}

function drawPSD(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  f: number[],
  psd: number[],
  M: number,
) {
  if (!colors) return
  const PAD_X = 50
  const PAD_TOP = 18
  const PAD_BOTTOM = 22

  // Two-sided level: mean(periodogram/FS) = N₀/2, matching the page convention.
  const level = N0 / 2
  const psdNorm = psd.map((v) => v / FS)

  const xf = (fHz: number) => lerp(fHz, 0, FS / 2, x0 + PAD_X, x0 + pw - PAD_X)
  const yMax = level * 3
  const yp = (v: number) => lerp(Math.min(v, yMax), 0, yMax, y0 + ph - PAD_BOTTOM, y0 + PAD_TOP + 4)
  const yAxis = y0 + ph - PAD_BOTTOM

  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`Εκτίμηση PSD — μέσος όρος ${M} realization${M > 1 ? 's' : ''}`, x0 + PAD_X, y0 + 12)

  // Theoretical two-sided PSD line at N₀/2
  ctx.strokeStyle = 'rgba(220, 38, 38, 0.7)'
  ctx.setLineDash([5, 4])
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yp(level))
  ctx.lineTo(x0 + pw - PAD_X, yp(level))
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = 'rgb(220, 38, 38)'
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(`Θεωρητικό S_N = N₀/2 = ${level.toFixed(1)}`, x0 + pw - PAD_X - 5, yp(level) - 4)

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + PAD_X, yAxis)
  ctx.lineTo(x0 + pw - PAD_X, yAxis)
  ctx.stroke()

  // Periodogram as vertical bars
  ctx.fillStyle = 'rgba(29, 78, 216, 0.6)'
  for (let k = 0; k < f.length; k++) {
    const x = xf(f[k])
    const y = yp(psdNorm[k])
    ctx.fillRect(x - 1, y, 2, yAxis - y)
  }

  // X-axis
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const fr of [0, FS / 4, FS / 2]) {
    ctx.fillText(`${fr} Hz`, xf(fr), yAxis + 14)
  }
}
