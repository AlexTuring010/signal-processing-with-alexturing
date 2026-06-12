'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * BandpassIQDecompositionViz — the "κατέβασε & δίπλωσε" picture for
 * /noise/bandpass §3. White (bandpass) noise N(t) = N_I·cos − N_Q·sin, and the
 * baseband spectrum of its I/Q components, derived the way the page derives it:
 *
 *   S_{N_I}(f) = S_{N_Q}(f) = S_N(f − f_c) + S_N(f + f_c),   |f| ≤ W/2
 *
 * Top panel (fixed reference): the bandpass PSD S_N(f) — two flat blocks of
 *   height N₀/2 and width W, centered at ±f_c.  Power P_N = N₀·W.
 * Bottom panel (the fold, scrubbable / animatable via s∈[0,1]): the +f_c block
 *   slides LEFT to 0 and the −f_c block slides RIGHT to 0; where they overlap the
 *   heights ADD.  At s = 1 they coincide over |f| ≤ W/2 at height N₀ — double the
 *   bandpass height (two blocks folded into one), same power N₀·W.
 *
 * This replaces the old "imagine sliding the block to baseband" instruction with
 * the actual figure — and unlike the shared NoiseFilterShapingViz it can vary W.
 */

const F_MAX = 1.0 // frequency axis half-range (normalized)
const N0 = 1.0 // one-sided white level (S_N = N₀/2 inside the band)
const Y_MAX = 1.3 // shared vertical scale (baseband reaches N₀ = 1)

const BP_C = [217, 119, 6] as const // amber — bandpass
const BB_C = [29, 78, 216] as const // blue — baseband result

export function BandpassIQDecompositionViz() {
  const [W, setW] = useState(0.24) // block width = bandwidth
  const [fc, setFc] = useState(0.55) // band center
  const [s, setS] = useState(0) // fold progress: 0 = bandpass, 1 = baseband
  const [playing, setPlaying] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Animate the fold when playing.
  useEffect(() => {
    if (!playing) return
    let raf = 0
    const tick = () => {
      setS((prev) => {
        const next = prev + 0.014
        if (next >= 1) {
          setPlaying(false)
          return 1
        }
        raf = requestAnimationFrame(tick)
        return next
      })
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    const render = () => {
      if (canvas && colors) drawScene(canvas, colors, W, fc, s)
    }
    render()
    window.addEventListener('resize', render)
    return () => window.removeEventListener('resize', render)
  }, [W, fc, s])

  const power = N0 * W // P_N = P_{N_I} = P_{N_Q} = N₀·W

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-3 text-sm font-semibold tracking-tight">
        Bandpass θόρυβος → baseband: N = N<sub>I</sub>·cos − N<sub>Q</sub>·sin (κατέβασε &amp; δίπλωσε)
      </h4>

      <canvas
        ref={canvasRef}
        style={{ height: 380 }}
        className="block h-[380px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Bandpass noise spectrum folded down to its baseband I/Q components"
      />

      {/* Star control: the fold itself */}
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (s >= 1) setS(0)
            setPlaying((p) => !p)
          }}
          className="shrink-0 rounded-full border border-accent bg-accent/10 px-3 py-1 text-xs font-medium text-accent hover:bg-accent/20"
        >
          {playing ? '⏸ Παύση' : '▶ Κατέβασε & δίπλωσε'}
        </button>
        <div className="grow">
          <label className="block text-[11px] text-fg-muted">
            bandpass <span className="tabular-nums">(0)</span> → baseband{' '}
            <span className="tabular-nums">(1)</span> · {(s * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={s}
            onChange={(e) => {
              setPlaying(false)
              setS(parseFloat(e.target.value))
            }}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
          />
        </div>
      </div>

      {/* Band geometry */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            Εύρος ζώνης W = <span className="font-mono text-fg tabular-nums">{W.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0.1}
            max={0.4}
            step={0.01}
            value={W}
            onChange={(e) => setW(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            Κέντρο f_c = <span className="font-mono text-fg tabular-nums">{fc.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0.35}
            max={0.75}
            step={0.01}
            value={fc}
            onChange={(e) => setFc(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
          />
        </div>
      </div>

      {/* Readouts: equal power, the height↔width trade, and the R(τ) shapes */}
      <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Ισχύς bandpass P<sub>N</sub> = N₀·W
          </div>
          <div className="font-mono text-fg tabular-nums">{power.toFixed(2)} (×N₀)</div>
        </div>
        <div className="rounded-md border border-accent/40 bg-accent/10 px-3 py-2">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Ισχύς συνιστώσας P<sub>N_I</sub> = P<sub>N_Q</sub> = N₀·W
          </div>
          <div className="font-mono text-fg tabular-nums">{power.toFixed(2)} (×N₀) — ίδια!</div>
        </div>
      </div>
      <p className="mt-2 text-xs text-fg-muted">
        Το baseband φάσμα έχει <strong>διπλάσιο ύψος</strong> (N₀ αντί N₀/2: δύο μπλοκ δίπλωσαν σε
        ένα) αλλά <strong>μισό εύρος</strong> (|f| ≤ W/2 αντί δύο ζωνών πλάτους W) — οπότε το
        εμβαδόν-ισχύς βγαίνει <strong>ίδιο</strong>: κάθε συνιστώσα κουβαλά ΟΛΗ την ισχύ N₀W, όχι τη
        μισή. Στον χρόνο: R<sub>N</sub>(τ) = N₀W·sinc(Wτ)·cos(2πf_cτ), ενώ R<sub>N_I</sub>(τ) =
        R<sub>N_Q</sub>(τ) = N₀W·sinc(Wτ) (το αργό envelope, χωρίς το φέρον).
      </p>
    </figure>
  )
}

// ── drawing ──────────────────────────────────────────────────────────────

function mixColor(t: number): string {
  const r = Math.round(lerp(t, 0, 1, BP_C[0], BB_C[0]))
  const g = Math.round(lerp(t, 0, 1, BP_C[1], BB_C[1]))
  const b = Math.round(lerp(t, 0, 1, BP_C[2], BB_C[2]))
  return `rgb(${r}, ${g}, ${b})`
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  W: number,
  fc: number,
  s: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const GAP = 22
  const panelH = (h - GAP) / 2
  drawBandpassPanel(ctx, colors, 0, 0, w, panelH, W, fc)
  drawFoldPanel(ctx, colors, 0, panelH + GAP, w, panelH, W, fc, s)
}

/** Shared geometry for a panel: returns mappers + key y positions. */
function panelFrame(x0: number, y0: number, pw: number, ph: number) {
  const PAD_L = 14
  const PAD_R = 14
  const TITLE_H = 18
  const PAD_B = 16
  const xf = (f: number) => lerp(f, -F_MAX, F_MAX, x0 + PAD_L, x0 + pw - PAD_R)
  const yAxis = y0 + ph - PAD_B
  const yTop = y0 + TITLE_H + 8
  const yv = (v: number) => lerp(v, 0, Y_MAX, yAxis, yTop)
  return { xf, yv, yAxis, yTop }
}

function drawAxis(
  ctx: CanvasRenderingContext2D,
  colors: NonNullable<ReturnType<typeof getThemeColors>>,
  x0: number,
  pw: number,
  xf: (f: number) => number,
  yAxis: number,
  ticks: { f: number; label: string }[],
) {
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x0 + 12, yAxis)
  ctx.lineTo(x0 + pw - 12, yAxis)
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const t of ticks) ctx.fillText(t.label, xf(t.f), yAxis + 12)
}

/** Filled flat block [a, b] at height v. */
function fillBlock(
  ctx: CanvasRenderingContext2D,
  xf: (f: number) => number,
  yv: (v: number) => number,
  yAxis: number,
  a: number,
  b: number,
  v: number,
  stroke: string,
  fill: string,
) {
  const xa = xf(a)
  const xb = xf(b)
  const yv0 = yv(v)
  ctx.fillStyle = fill
  ctx.fillRect(xa, yv0, xb - xa, yAxis - yv0)
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.moveTo(xa, yAxis)
  ctx.lineTo(xa, yv0)
  ctx.lineTo(xb, yv0)
  ctx.lineTo(xb, yAxis)
  ctx.stroke()
}

function drawBandpassPanel(
  ctx: CanvasRenderingContext2D,
  colors: NonNullable<ReturnType<typeof getThemeColors>>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  W: number,
  fc: number,
) {
  const { xf, yv, yAxis } = panelFrame(x0, y0, pw, ph)

  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('S_N(f) — ζωνοπερατός θόρυβος: δύο μπλοκ ύψους N₀/2 γύρω από ±f_c', x0 + 12, y0 + 12)

  drawAxis(ctx, colors, x0, pw, xf, yAxis, [
    { f: -fc, label: '−f_c' },
    { f: 0, label: '0' },
    { f: fc, label: '+f_c' },
  ])

  const amber = `rgb(${BP_C[0]}, ${BP_C[1]}, ${BP_C[2]})`
  const amberFill = `rgba(${BP_C[0]}, ${BP_C[1]}, ${BP_C[2]}, 0.22)`
  // +f_c and −f_c blocks, width W, height N₀/2
  fillBlock(ctx, xf, yv, yAxis, fc - W / 2, fc + W / 2, N0 / 2, amber, amberFill)
  fillBlock(ctx, xf, yv, yAxis, -fc - W / 2, -fc + W / 2, N0 / 2, amber, amberFill)

  // N₀/2 height tick
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('N₀/2', xf(fc + W / 2) + 3, yv(N0 / 2) + 3)

  // W bracket under the +f_c block
  drawWidthBracket(ctx, colors, xf(fc - W / 2), xf(fc + W / 2), yAxis - 2, 'W')
}

function drawFoldPanel(
  ctx: CanvasRenderingContext2D,
  colors: NonNullable<ReturnType<typeof getThemeColors>>,
  x0: number,
  y0: number,
  pw: number,
  ph: number,
  W: number,
  fc: number,
  s: number,
) {
  const { xf, yv, yAxis } = panelFrame(x0, y0, pw, ph)
  const col = mixColor(s)

  const title =
    s < 0.05
      ? 'Αντίγραφο προς δίπλωση — σύρε/πάτα ▶ για να κατέβει στο baseband'
      : s > 0.95
        ? 'S_{N_I}(f) = S_{N_Q}(f) = N₀ για |f| ≤ W/2 — baseband (διπλάσιο ύψος)'
        : 'Κατεβαίνει & διπλώνεται…  S_N(f − f_c) + S_N(f + f_c)'
  ctx.fillStyle = colors.fgMuted
  ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(title, x0 + 12, y0 + 12)

  drawAxis(ctx, colors, x0, pw, xf, yAxis, [
    { f: -fc, label: '−f_c' },
    { f: 0, label: '0' },
    { f: fc, label: '+f_c' },
  ])

  // baseband window |f| ≤ W/2 (faint guides) — visible target of the fold
  ctx.strokeStyle = colors.border
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  for (const f of [-W / 2, W / 2]) {
    ctx.beginPath()
    ctx.moveTo(xf(f), yv(Y_MAX))
    ctx.lineTo(xf(f), yAxis)
    ctx.stroke()
  }
  ctx.setLineDash([])

  // The fold computed honestly: sum of the two sliding N₀/2 blocks.
  //   +f_c block slides to center fc(1−s); −f_c block slides to −fc(1−s).
  const center = fc * (1 - s)
  const half = W / 2
  const fillRGBA = col.replace('rgb', 'rgba').replace(')', ', 0.24)')
  const STEPS = 600
  const fill = (predicate: (f: number) => number) => {
    ctx.fillStyle = fillRGBA
    ctx.beginPath()
    ctx.moveTo(xf(-F_MAX), yAxis)
    for (let i = 0; i <= STEPS; i++) {
      const f = lerp(i, 0, STEPS, -F_MAX, F_MAX)
      ctx.lineTo(xf(f), yv(predicate(f)))
    }
    ctx.lineTo(xf(F_MAX), yAxis)
    ctx.closePath()
    ctx.fill()
  }
  const hAt = (f: number) => {
    const a = Math.abs(f - center) <= half ? N0 / 2 : 0
    const b = Math.abs(f + center) <= half ? N0 / 2 : 0
    return a + b
  }
  fill(hAt)

  // outline the summed profile
  ctx.strokeStyle = col
  ctx.lineWidth = 1.8
  ctx.beginPath()
  let started = false
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, -F_MAX, F_MAX)
    const px = xf(f)
    const py = yv(hAt(f))
    if (!started) {
      ctx.moveTo(px, py)
      started = true
    } else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // height annotation once folded
  if (s > 0.6) {
    ctx.fillStyle = col
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.globalAlpha = lerp(s, 0.6, 1, 0, 1)
    ctx.fillText('N₀', xf(half) + 3, yv(N0) + 3)
    ctx.globalAlpha = 1
  }
}

function drawWidthBracket(
  ctx: CanvasRenderingContext2D,
  colors: NonNullable<ReturnType<typeof getThemeColors>>,
  xa: number,
  xb: number,
  y: number,
  label: string,
) {
  ctx.strokeStyle = colors.fgSubtle
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xa, y - 4)
  ctx.lineTo(xa, y)
  ctx.lineTo(xb, y)
  ctx.lineTo(xb, y - 4)
  ctx.stroke()
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(label, (xa + xb) / 2, y - 6)
}
