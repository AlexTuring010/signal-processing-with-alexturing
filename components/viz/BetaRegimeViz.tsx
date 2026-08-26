'use client'

import { useState } from 'react'
import { useEffect, useRef } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * The one-sentence goal: let the student see that holding the frequency swing
 * Δf FIXED and changing only how FAST the message wiggles (W) flips FM between
 * two completely different regimes — which is why β is a RATIO and not just Δf.
 *
 * /fm/idea §5 hands over β_f = Δf/W straight from the slide, including the word
 * «κανονικοποιημένη», without ever saying what W is doing there. This is the
 * figure for that question.
 *
 * It is a BAND diagram, not a spectrum: the point is which of the two terms in
 * Carson's 2(Δf + W) dominates, so drawing individual Bessel lines would put
 * the emphasis in the wrong place (CarsonRuleViz on /fm/carson already owns the
 * sideband forest and the β+1 cutoff).
 *
 *   |←              B = 2(Δf + W)              →|
 *   ┌───┬───────────────────────────────────┬───┐
 *   │ W │        swing  2Δf   (amber)       │ W │
 *   └───┴───────────────────────────────────┴───┘
 *                       f_c
 *
 * Drag W up with Δf fixed and the amber core shrinks to nothing against the
 * blue margins: same swing, but now the message's own width sets the cost, and
 * the signal has slid into NBFM.
 */

const F_MIN = 1
const F_MAX = 150

export function BetaRegimeViz() {
  const [df, setDf] = useState(75)
  const [w, setW] = useState(15)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) draw(canvas, colors, df, w)
  }, [df, w])

  useEffect(() => {
    const onResize = () => {
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) draw(canvas, colors, df, w)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [df, w])

  const beta = df / w
  const B = 2 * (df + w)
  const regime =
    beta < 0.3
      ? { label: 'NBFM (β ≪ 1)', cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' }
      : beta > 1
        ? { label: 'WBFM (β ≫ 1)', cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-500' }
        : { label: 'Ενδιάμεση περιοχή', cls: 'bg-fg-subtle/15 text-fg-muted' }
  const dominant =
    df > 3 * w
      ? 'Κυριαρχεί το Δf — το κόστος το ορίζει το πόσο μακριά σπρώχνεις τη συχνότητα.'
      : w > 3 * df
        ? 'Κυριαρχεί το W — το κόστος το ορίζει το ίδιο το message, σχεδόν σαν AM.'
        : 'Οι δύο όροι είναι συγκρίσιμοι — κανένας δεν κυριαρχεί.'

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-3 text-sm font-semibold tracking-tight">
        Γιατί το W: ίδιο Δf, δύο εντελώς διαφορετικά σήματα
      </h4>

      <p className="mb-3 text-xs text-fg-muted">
        Το <strong className="text-amber-600 dark:text-amber-500">πορτοκαλί</strong>{' '}
        είναι το εύρος που <strong>σαρώνει</strong> η στιγμιαία συχνότητα,{' '}
        <span className="font-mono">2Δf</span>. Τα{' '}
        <strong className="text-blue-700 dark:text-blue-400">μπλε</strong>{' '}
        περιθώρια είναι το <span className="font-mono">W</span> που προσθέτει το
        ίδιο το message σε κάθε πλευρά. Κράτα το{' '}
        <span className="font-mono">Δf</span> σταθερό και σύρε μόνο το{' '}
        <span className="font-mono">W</span>.
      </p>

      <canvas
        ref={canvasRef}
        style={{ height: 190 }}
        className="block h-[190px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Carson band split into the swept range and the message-width margins"
      />

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            Απόκλιση συχνότητας{' '}
            <span className="font-mono text-fg tabular-nums">Δf = {df}</span> kHz — πόσο{' '}
            <strong>μακριά</strong> σπρώχνεται η συχνότητα
          </label>
          <input
            type="range"
            min={F_MIN}
            max={F_MAX}
            step={1}
            value={df}
            onChange={(e) => setDf(parseInt(e.target.value, 10))}
            className="mt-1 w-full accent-amber-600"
            aria-label="frequency deviation"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            Bandwidth του message{' '}
            <span className="font-mono text-fg tabular-nums">W = {w}</span> kHz — πόσο{' '}
            <strong>γρήγορα</strong> προλαβαίνει να αλλάζει
          </label>
          <input
            type="range"
            min={F_MIN}
            max={F_MAX}
            step={1}
            value={w}
            onChange={(e) => setW(parseInt(e.target.value, 10))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
            aria-label="message bandwidth"
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-mono tabular-nums">
          β_f = Δf/W = {df}/{w} = {beta.toFixed(2)}
        </span>
        <span className={`rounded-full px-2 py-0.5 font-medium ${regime.cls}`}>{regime.label}</span>
        <span className="font-mono tabular-nums text-fg-muted">
          B = 2(Δf + W) = {B} kHz
        </span>
        <span className="font-mono tabular-nums text-fg-subtle">
          (το message μόνο του: 2W = {2 * w} kHz)
        </span>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        {dominant} Το <strong>β_f</strong> είναι ακριβώς ο αριθμός που λέει{' '}
        <strong>ποιος από τους δύο κυριαρχεί</strong>: το κόστος σε bandwidth
        βγαίνει <span className="font-mono">β_f + 1 = {(beta + 1).toFixed(2)}</span>{' '}
        φορές το <span className="font-mono">2W</span> που θα χρειαζόταν το
        message από μόνο του.
      </div>
    </figure>
  )
}

const SWING_C = 'rgb(217, 119, 6)'
const MARGIN_C = 'rgb(29, 78, 216)'

function draw(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  df: number,
  w: number,
) {
  if (!colors) return
  const { ctx, w: cw, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, cw, h)
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'

  const PAD = 26
  const half = df + w
  const span = half * 1.18
  const xf = (f: number) => lerp(f, -span, span, PAD, cw - PAD)

  const yTop = 58
  const yBot = h - 62
  const cxf = xf(0)

  // Carson band: message margins first, swept range painted over the middle.
  ctx.fillStyle = MARGIN_C
  ctx.globalAlpha = 0.28
  ctx.fillRect(xf(-half), yTop, xf(half) - xf(-half), yBot - yTop)
  ctx.globalAlpha = 1

  ctx.fillStyle = SWING_C
  ctx.globalAlpha = 0.45
  ctx.fillRect(xf(-df), yTop, xf(df) - xf(-df), yBot - yTop)
  ctx.globalAlpha = 1

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.strokeRect(xf(-half), yTop, xf(half) - xf(-half), yBot - yTop)

  // carrier
  ctx.strokeStyle = colors.fg
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(cxf, yTop - 8)
  ctx.lineTo(cxf, yBot + 8)
  ctx.stroke()
  ctx.fillStyle = colors.fg
  ctx.textAlign = 'center'
  ctx.fillText('f_c', cxf, yBot + 22)

  // inner label for the swept range
  ctx.fillStyle = colors.fg
  if (xf(df) - xf(-df) > 78) {
    ctx.fillText(`σάρωση 2Δf = ${2 * df} kHz`, cxf, (yTop + yBot) / 2 + 3)
  }

  // the W margins
  ctx.fillStyle = MARGIN_C
  for (const s of [-1, 1]) {
    const a = xf(s * df)
    const b = xf(s * half)
    if (Math.abs(b - a) > 26) {
      ctx.textAlign = 'center'
      ctx.fillText('W', (a + b) / 2, (yTop + yBot) / 2 + 3)
    }
  }

  // total bracket above
  bracket(ctx, colors.fg, xf(-half), xf(half), yTop - 18, `B = 2(Δf + W) = ${2 * half} kHz`)

  // what the message alone would need, for scale
  ctx.setLineDash([3, 3])
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(xf(-w), yBot + 30)
  ctx.lineTo(xf(w), yBot + 30)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = colors.fgMuted
  ctx.textAlign = 'center'
  ctx.fillText(`2W = ${2 * w} kHz (τι θα ήθελε το message μόνο του)`, cxf, yBot + 44)
}

function bracket(
  ctx: CanvasRenderingContext2D,
  color: string,
  xa: number,
  xb: number,
  y: number,
  label: string,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(xa, y + 5)
  ctx.lineTo(xa, y)
  ctx.lineTo(xb, y)
  ctx.lineTo(xb, y + 5)
  ctx.stroke()
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.fillText(label, (xa + xb) / 2, y - 5)
}
