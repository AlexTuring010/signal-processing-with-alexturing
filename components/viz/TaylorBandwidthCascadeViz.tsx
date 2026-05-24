'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { besselJ } from '@/lib/bessel'

/**
 * Slides 22-26 του SE_session15_16_16_FM.pdf — η Taylor-πλευρά της παρακίνησης
 * του Carson. Ο prof έγραψε:
 *
 *   x(t) = A_c cos(2π f_c t + φ(t))
 *        = A_c cos(2π f_c t) cos(φ(t)) − A_c sin(2π f_c t) sin(φ(t))
 *
 * Με Taylor γύρω από φ = 0 (slide 22):
 *   cos(φ(t)) = 1 − φ²/2! + φ⁴/4! − …
 *   sin(φ(t)) = φ − φ³/3! + φ⁵/5! − …
 *
 * άρα x(t) = A_c [ cos(2π f_c t)  − A_c (φ²/2!) cos(2π f_c t) + …
 *                  − A_c φ sin(2π f_c t) + A_c (φ³/3!) sin(2π f_c t) − … ]
 *
 * Slide 24's central observation: **η συνέλιξη `Φ*Φ*…*Φ` (n φορές) δίνει σήμα με
 * εύρος ζώνης `nW`.** Άρα ο όρος `φ^n` εμφανίζεται με bandwidth `nW` στο φάσμα,
 * μετατοπισμένο στα `±f_c`.
 *
 * Slide 25: «το φασματικό περιεχόμενο εκτείνεται από −∞ έως +∞» — αλλά τα πλάτη
 * εξασθενούν με factorial (n!) στον παρονομαστή. Για single-tone `m(t) = α cos(2π f_m t)`:
 *
 *   φ(t) = β sin(2π f_m t) ⇒ max|φ| = β
 *   max|φ^n| = β^n  ⇒  πλάτος του όρου `n` ≈ β^n / n!
 *
 * Ο prof στο slide 26 ορίζει το «ενεργό εύρος ζώνης» ως τη ζώνη που περιέχει
 * «σχεδόν ολόκληρη την ισχύ»: `B ≅ 2W(β+1)`. Η εξάσκηση 4 του Stirling
 * δείχνει ότι ο όρος `β^n / n!` κορυφώνεται γύρω στο `n ≈ β`, οπότε ο όρος
 * `n = β+1` είναι ο τελευταίος «σημαντικός» — που είναι ακριβώς η ±(β+1)
 * cutoff του Carson.
 *
 * Αυτή η viz δείχνει την «κασκάδα Taylor»: για ένα δοσμένο β, σχεδιάζει τα
 * πλάτη `β^n/n!` ως bars vs n, και τις «ζώνες» που καταλαμβάνει κάθε όρος
 * `φ^n` στο φάσμα (από `f_c − nW` έως `f_c + nW`). Ο φοιτητής βλέπει:
 *
 *   (α) ότι τα πλάτη γρήγορα φθίνουν μετά το n ≈ β  → cutoff γύρω στο β+1
 *   (β) ότι η ένωση των ζωνών μέχρι το n = β+1 είναι ακριβώς το ±(β+1)W → Carson
 *   (γ) ότι η Bessel τιμή |J_n(β)| (slide 36) ακολουθεί το ίδιο envelope —
 *       οι δύο διαδρομές (Taylor + Bessel) δείχνουν την ΙΔΙΑ φυσική
 */

const N_MAX = 14

type Mode = 'amplitudes' | 'spectrum'

export function TaylorBandwidthCascadeViz() {
  const [beta, setBeta] = useState(3.0)
  const [mode, setMode] = useState<Mode>('amplitudes')
  const ampCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const specCanvasRef = useRef<HTMLCanvasElement | null>(null)

  const series = useMemo(() => {
    // taylorAmp[n] = β^n / n!  (κανονικοποιημένο ώστε max = 1)
    const taylor: number[] = []
    let term = 1
    taylor.push(term) // n=0: 1
    for (let n = 1; n <= N_MAX; n++) {
      term = (term * beta) / n
      taylor.push(term)
    }
    const tMax = Math.max(...taylor)
    const taylorNorm = taylor.map((v) => v / tMax)
    // bessel envelope (slide 36-45): |J_n(β)|
    const bessel = taylor.map((_, n) => Math.abs(besselJ(n, beta)))
    const bMax = Math.max(...bessel, 1e-9)
    const besselNorm = bessel.map((v) => v / bMax)
    // πρώτο n όπου το πλάτος πέφτει κάτω από 1% του max
    let nCut = N_MAX
    for (let n = 0; n < taylorNorm.length; n++) {
      if (taylorNorm[n] < 0.01) {
        nCut = n
        break
      }
    }
    const carsonN = Math.floor(beta) + 1
    return { taylor, taylorNorm, bessel, besselNorm, nCut, carsonN }
  }, [beta])

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (ampCanvasRef.current) drawAmplitudes(ampCanvasRef.current, colors, series, beta)
    if (specCanvasRef.current) drawSpectrum(specCanvasRef.current, colors, series, beta)

    const onResize = () => {
      const c = getThemeColors()
      if (!c) return
      if (ampCanvasRef.current) drawAmplitudes(ampCanvasRef.current, c, series, beta)
      if (specCanvasRef.current) drawSpectrum(specCanvasRef.current, c, series, beta)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [series, beta])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Η κασκάδα Taylor — γιατί το Carson «βγαίνει» στο ±(β+1)W (slides 22-26)
        </h4>
        <div className="flex gap-1.5">
          {(['amplitudes', 'spectrum'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-full border px-2.5 py-0.5 text-xs ${
                mode === m
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg'
              }`}
              aria-pressed={mode === m}
            >
              {m === 'amplitudes' ? 'Πλάτη β^n/n!' : 'Ζώνες ±nW στο φάσμα'}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-3 text-xs text-fg-muted">
        Το single-tone FM έχει <span className="font-mono">φ(t) = β sin(2π f_m t)</span>, οπότε{' '}
        <span className="font-mono">max|φ^n| = β^n</span>· ο όρος Taylor τάξης{' '}
        <span className="font-mono">n</span> εμφανίζεται με πλάτος{' '}
        <span className="font-mono">β^n / n!</span> και bandwidth{' '}
        <span className="font-mono">nW</span> (slide 24: η συνέλιξη Φ*Φ*…*Φ{' '}
        <em>n</em> φορές δίνει σήμα εύρους ζώνης <span className="font-mono">nW</span>). Ο
        όρος{' '}
        <span className="font-mono">n ≈ β</span> είναι ο μέγιστος — μετά πέφτει γρήγορα.
        Carson κόβει στον{' '}
        <span className="font-mono">n = β+1</span>: ο τελευταίος «σημαντικός» όρος.
      </p>

      <div className={mode === 'amplitudes' ? '' : 'hidden'}>
        <canvas
          ref={ampCanvasRef}
          style={{ height: 340 }}
          className="block h-[340px] w-full rounded-md border border-border bg-bg-soft/30"
          aria-label="Taylor amplitudes β^n/n! vs Bessel envelope |J_n(β)|"
        />
      </div>
      <div className={mode === 'spectrum' ? '' : 'hidden'}>
        <canvas
          ref={specCanvasRef}
          style={{ height: 340 }}
          className="block h-[340px] w-full rounded-md border border-border bg-bg-soft/30"
          aria-label="Φασματικές ζώνες ±nW για κάθε όρο Taylor"
        />
      </div>

      <div className="mt-3">
        <label className="block text-xs text-fg-muted">
          β ={' '}
          <span className="font-mono text-fg tabular-nums">{beta.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min={0.2}
          max={10}
          step={0.05}
          value={beta}
          onChange={(e) => setBeta(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
          aria-label="Modulation index beta"
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
        <div className="rounded-md border border-border bg-bg-soft px-2 py-1">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Κορυφαίο n (Taylor)
          </div>
          <div className="font-mono text-fg tabular-nums">
            n ≈ {Math.round(beta)}
          </div>
        </div>
        <div className="rounded-md border border-border bg-bg-soft px-2 py-1">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Cutoff (πλάτος &lt; 1%)
          </div>
          <div className="font-mono text-fg tabular-nums">n = {series.nCut}</div>
        </div>
        <div className="rounded-md border border-accent/40 bg-accent/10 px-2 py-1">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Carson (β+1)
          </div>
          <div className="font-mono text-fg tabular-nums">{series.carsonN}</div>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-fg-subtle">
        Παρατήρηση: η μπλε «κασκάδα Taylor» (β^n/n!) και η κόκκινη «καμπύλη Bessel»
        (|J_n(β)|) σχεδόν συμπίπτουν στην περιοχή <span className="font-mono">n ≲ β</span> —{' '}
        γι' αυτό η Taylor προσέγγιση δουλεύει σωστά εκεί. Πέρα από αυτό αποκλίνουν: η{' '}
        β^n/n! κορυφώνεται κοντά στο <span className="font-mono">n = β</span> και πέφτει
        υπερεκθετικά (factorial)· η J_n(β) πέφτει σαν{' '}
        <span className="font-mono">1/√n</span>, αργότερα. Carson παίρνει το πιο{' '}
        <em>συντηρητικό</em> από τα δύο — και ταιριάζει με την εμπειρική «98% ενέργεια» στο β+1.
      </p>
    </figure>
  )
}

const TAYLOR_COLOR = 'rgb(29, 78, 216)' // blue
const BESSEL_COLOR = 'rgb(220, 38, 38)' // red
const CARSON_COLOR = 'rgb(168, 85, 247)' // violet

function drawAmplitudes(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  series: { taylorNorm: number[]; besselNorm: number[]; carsonN: number; nCut: number },
  _beta: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const PAD_L = 44
  const PAD_R = 16
  const PAD_T = 16
  const PAD_B = 38
  const xMin = 0
  const xMax = N_MAX
  const xOf = (n: number) => lerp(n, xMin, xMax, PAD_L, w - PAD_R)
  const yOf = (v: number) => lerp(v, 0, 1.05, h - PAD_B, PAD_T)

  // Carson shaded zone [0, β+1]
  const xC = xOf(series.carsonN)
  ctx.fillStyle = 'rgba(168, 85, 247, 0.08)'
  ctx.fillRect(PAD_L, PAD_T, xC - PAD_L, h - PAD_B - PAD_T)
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)'
  ctx.setLineDash([4, 4])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xC, PAD_T)
  ctx.lineTo(xC, h - PAD_B)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = CARSON_COLOR
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(`Carson n = β+1 = ${series.carsonN}`, xC + 4, PAD_T + 12)

  // Axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_L, h - PAD_B)
  ctx.lineTo(w - PAD_R, h - PAD_B)
  ctx.moveTo(PAD_L, PAD_T)
  ctx.lineTo(PAD_L, h - PAD_B)
  ctx.stroke()

  // Y ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  for (const v of [0, 0.25, 0.5, 0.75, 1]) {
    const y = yOf(v)
    ctx.beginPath()
    ctx.moveTo(PAD_L - 3, y)
    ctx.lineTo(PAD_L, y)
    ctx.stroke()
    ctx.fillText(v.toFixed(2), PAD_L - 5, y + 3)
  }
  // Y axis label
  ctx.save()
  ctx.translate(12, (PAD_T + h - PAD_B) / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.textAlign = 'center'
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('Κανονικοποιημένο πλάτος', 0, 0)
  ctx.restore()

  // X ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.textAlign = 'center'
  for (let n = 0; n <= N_MAX; n += 2) {
    const x = xOf(n)
    ctx.beginPath()
    ctx.moveTo(x, h - PAD_B)
    ctx.lineTo(x, h - PAD_B + 3)
    ctx.stroke()
    ctx.fillText(`${n}`, x, h - PAD_B + 14)
  }
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('n (τάξη Taylor / αρμονική Bessel)', (PAD_L + w - PAD_R) / 2, h - PAD_B + 28)

  // Taylor bars (blue)
  const barW = (xOf(1) - xOf(0)) * 0.32
  ctx.fillStyle = TAYLOR_COLOR
  for (let n = 0; n <= N_MAX; n++) {
    const v = series.taylorNorm[n]
    if (v < 0.001) continue
    const x = xOf(n) - barW - 1
    const y = yOf(v)
    ctx.fillRect(x, y, barW, h - PAD_B - y)
  }

  // Bessel bars (red)
  ctx.fillStyle = BESSEL_COLOR
  for (let n = 0; n <= N_MAX; n++) {
    const v = series.besselNorm[n]
    if (v < 0.001) continue
    const x = xOf(n) + 1
    const y = yOf(v)
    ctx.fillRect(x, y, barW, h - PAD_B - y)
  }

  // Legend
  const lx = w - PAD_R - 170
  const ly = PAD_T + 4
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.fillRect(lx, ly, 168, 50)
  ctx.strokeRect(lx, ly, 168, 50)
  ctx.fillStyle = TAYLOR_COLOR
  ctx.fillRect(lx + 8, ly + 10, 12, 8)
  ctx.fillStyle = colors.fg
  ctx.textAlign = 'left'
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('Taylor: β^n / n!', lx + 26, ly + 18)
  ctx.fillStyle = BESSEL_COLOR
  ctx.fillRect(lx + 8, ly + 28, 12, 8)
  ctx.fillStyle = colors.fg
  ctx.fillText('Bessel: |J_n(β)| (slide 36)', lx + 26, ly + 36)
}

function drawSpectrum(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  series: { taylorNorm: number[]; carsonN: number },
  _beta: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const PAD_L = 28
  const PAD_R = 18
  const PAD_T = 18
  const PAD_B = 44
  // We'll plot ±n_max·W; W is a reference unit (W = 1)
  const N_VIS = Math.min(N_MAX, Math.max(6, series.carsonN + 4))
  const xMin = -N_VIS - 0.6
  const xMax = N_VIS + 0.6
  const xOf = (k: number) => lerp(k, xMin, xMax, PAD_L, w - PAD_R)
  // y rows: one per Taylor order n=0..N_VIS. n=0 at top.
  const rowH = (h - PAD_T - PAD_B) / (N_VIS + 1)
  const yRow = (n: number) => PAD_T + n * rowH + rowH / 2

  // f_c reference line (vertical center)
  const xCenter = xOf(0)
  ctx.strokeStyle = colors.border
  ctx.setLineDash([2, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xCenter, PAD_T)
  ctx.lineTo(xCenter, h - PAD_B)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('f_c', xCenter, h - PAD_B + 14)

  // Carson cutoff lines at ±(β+1)W
  const carsonN = series.carsonN
  const xCarsonR = xOf(carsonN)
  const xCarsonL = xOf(-carsonN)
  ctx.fillStyle = 'rgba(168, 85, 247, 0.06)'
  ctx.fillRect(xCarsonL, PAD_T, xCarsonR - xCarsonL, h - PAD_T - PAD_B)
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.55)'
  ctx.setLineDash([5, 4])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xCarsonR, PAD_T)
  ctx.lineTo(xCarsonR, h - PAD_B)
  ctx.moveTo(xCarsonL, PAD_T)
  ctx.lineTo(xCarsonL, h - PAD_B)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = CARSON_COLOR
  ctx.textAlign = 'center'
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText(`Carson: ±(β+1)W = ±${carsonN}W`, (xCarsonL + xCarsonR) / 2, PAD_T - 4)

  // X axis at bottom
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_L, h - PAD_B)
  ctx.lineTo(w - PAD_R, h - PAD_B)
  ctx.stroke()
  // X ticks
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  const step = N_VIS > 10 ? 3 : 2
  for (let k = -N_VIS; k <= N_VIS; k += step) {
    if (k === 0) continue
    const x = xOf(k)
    ctx.beginPath()
    ctx.moveTo(x, h - PAD_B)
    ctx.lineTo(x, h - PAD_B + 3)
    ctx.stroke()
    const sign = k > 0 ? '+' : '−'
    ctx.fillText(`${sign}${Math.abs(k)}W`, x, h - PAD_B + 14)
  }
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('f − f_c (πολλαπλάσια του W)', (PAD_L + w - PAD_R) / 2, h - PAD_B + 28)

  // Stacked horizontal bars (one per Taylor order)
  for (let n = 0; n <= N_VIS; n++) {
    const amp = series.taylorNorm[n] ?? 0
    if (amp < 0.001 && n > 0) continue
    const y = yRow(n)
    const bandLeft = xOf(-n)
    const bandRight = xOf(n)
    // Color & opacity by amplitude (within carson = solid, outside = faded)
    const isInsideCarson = n <= carsonN
    const alpha = Math.max(0.12, Math.min(0.85, amp))
    ctx.fillStyle = isInsideCarson
      ? `rgba(29, 78, 216, ${alpha})`
      : `rgba(220, 38, 38, ${alpha * 0.7})`
    const barH = Math.max(4, rowH * 0.65 * amp + 4)
    ctx.fillRect(bandLeft, y - barH / 2, bandRight - bandLeft, barH)
    // Row label
    ctx.fillStyle = colors.fgMuted
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`φ^${n}: BW=${n}W, amp=${(series.taylorNorm[n] ?? 0).toFixed(3)}`, PAD_L - 4, y + 4)
  }
}
