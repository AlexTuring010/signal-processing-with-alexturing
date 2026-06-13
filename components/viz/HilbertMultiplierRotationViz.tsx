'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Why does multiplying X(f) by −j rotate it by exactly −π/2 (and leave the
 * magnitude alone)? The student drags the blue vector X around the complex
 * plane; the amber vector −j·X follows, always 90° clockwise and always the
 * same length. A toggle adds +j·X (the negative-frequency case, +90°).
 *
 *   −j(a + bj) = b − aj      →  Re and Im swap, with one sign flip
 *   |−jX| = √(b² + a²) = |X|  →  magnitude untouched
 *   −j = e^{−jπ/2}           →  multiplication adds −π/2 to the angle
 *
 * This is the geometric heart of the Hilbert multiplier −j·sgn(f): a pure
 * 90° rotation per side, never a stretch. Lives in modulation/bridge §3.
 */

const RANGE = 2.2
const PLUS_C = 'rgb(29, 78, 216)' // X (input)
const MINUS_C = 'rgb(217, 119, 6)' // −jX
const PLUSJ_C = 'rgb(5, 150, 105)' // +jX

type Preset = { label: string; re: number; im: number }
const PRESETS: Preset[] = [
  { label: 'A > 0 (πραγμ. θετικό)', re: 1.5, im: 0 },
  { label: 'A < 0 (πραγμ. αρνητικό)', re: -1.5, im: 0 },
  { label: 'jB (καθαρά φανταστικό)', re: 0, im: 1.3 },
  { label: 'γενικό a + bj', re: 1.1, im: 0.95 },
]

export function HilbertMultiplierRotationViz() {
  const [re, setRe] = useState(1.5)
  const [im, setIm] = useState(0)
  const [showPlusJ, setShowPlusJ] = useState(false)
  const [dragging, setDragging] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const mag = Math.hypot(re, im)
  const phiDeg = (Math.atan2(im, re) * 180) / Math.PI
  const wrap = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180
  // −jX = Im − Re·j
  const mRe = im
  const mIm = -re

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, re, im, showPlusJ)
  }, [re, im, showPlusJ])

  const updateFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    const scale = Math.min(rect.width, rect.height) / (2 * RANGE) - 10
    const clamp = (v: number) => Math.max(-RANGE, Math.min(RANGE, v))
    setRe(clamp((e.clientX - rect.left - cx) / scale))
    setIm(clamp(-(e.clientY - rect.top - cy) / scale))
  }

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Γιατί το ×(−j) είναι στροφή κατά −90° — σύρε το διάνυσμα
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Σύρε την άκρη του <span style={{ color: PLUS_C }} className="font-semibold">μπλε</span> διανύσματος{' '}
        <span className="font-mono">X</span> οπουδήποτε. Το{' '}
        <span style={{ color: MINUS_C }} className="font-semibold">πορτοκαλί</span>{' '}
        <span className="font-mono">−j·X</span> το ακολουθεί — πάντα{' '}
        <strong>90° πιο κάτω</strong> (δεξιόστροφα) και πάντα{' '}
        <strong>ίδιο μήκος</strong>. Αυτό ακριβώς κάνει ο πολλαπλασιαστής του
        Hilbert στις θετικές συχνότητες.
      </p>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
        <canvas
          ref={canvasRef}
          style={{ height: 300, touchAction: 'none' }}
          className={cn(
            'block h-[300px] w-full rounded-md border border-border bg-bg-soft/30',
            dragging ? 'cursor-grabbing' : 'cursor-grab',
          )}
          aria-label="Μιγαδικό επίπεδο: σύρε το διάνυσμα X και δες το −jX να στρέφεται κατά −90 μοίρες με ίδιο μέτρο"
          onPointerDown={(e) => {
            setDragging(true)
            e.currentTarget.setPointerCapture(e.pointerId)
            updateFromEvent(e)
          }}
          onPointerMove={(e) => {
            if (dragging) updateFromEvent(e)
          }}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
        />

        <div className="space-y-2 text-xs">
          <div className="rounded border border-accent/40 bg-accent-soft/30 px-2.5 py-1.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: PLUS_C }}>
              X
            </div>
            <div className="mt-0.5 font-mono">
              = {re.toFixed(2)} {im >= 0 ? '+' : '−'} {Math.abs(im).toFixed(2)}j
            </div>
            <div className="font-mono">
              |X| = {mag.toFixed(2)} · ∠ = {phiDeg.toFixed(0)}°
            </div>
          </div>
          <div className="rounded border px-2.5 py-1.5 border-amber-400/50 bg-amber-50/40 dark:border-amber-400/30 dark:bg-amber-400/10">
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: MINUS_C }}>
              −j·X
            </div>
            <div className="mt-0.5 font-mono">
              = {mRe.toFixed(2)} {mIm >= 0 ? '+' : '−'} {Math.abs(mIm).toFixed(2)}j
            </div>
            <div className="font-mono">
              |−jX| = {mag.toFixed(2)} <span className="text-fg-subtle">(ίδιο)</span> · ∠ = {wrap(phiDeg - 90).toFixed(0)}°
            </div>
          </div>
          <p className="text-[11px] text-fg-subtle">
            Η φάση πάει από <span className="font-mono">{phiDeg.toFixed(0)}°</span> σε{' '}
            <span className="font-mono">{wrap(phiDeg - 90).toFixed(0)}°</span> — ακριβώς{' '}
            <span className="font-mono">−90°</span>. Το μέτρο δεν κουνήθηκε.
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setRe(p.re)
              setIm(p.im)
            }}
            className="rounded-full border border-border bg-bg-soft px-2.5 py-0.5 text-[11px] text-fg-muted transition-colors hover:border-accent/50 hover:text-fg"
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={showPlusJ}
          onClick={() => setShowPlusJ((s) => !s)}
          className={cn(
            'ml-auto rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors',
            showPlusJ
              ? 'border-emerald-400/60 bg-emerald-50/60 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-400/15 dark:text-emerald-200'
              : 'border-border bg-bg-soft text-fg-muted hover:text-fg',
          )}
        >
          {showPlusJ ? '✓ ' : ''}δείξε και ×(+j) {showPlusJ ? '' : '(αρν. συχνότητες)'}
        </button>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <p className="mb-1">
          <strong>Η άλγεβρα σε δύο γραμμές.</strong> Γράψε το{' '}
          <span className="font-mono">−j</span> σε πολική μορφή: είναι το μοναδιαίο
          διάνυσμα που δείχνει «ίσια κάτω», δηλαδή{' '}
          <span className="font-mono">−j = e^(−jπ/2)</span>. Τότε για κάθε{' '}
          <span className="font-mono">X = M·e^(jφ)</span>:
        </p>
        <p className="my-1 text-center font-mono">
          X · (−j) = M·e^(jφ) · e^(−jπ/2) = M·e^(j(φ−π/2))
        </p>
        <p>
          Το μέτρο πολλαπλασιάστηκε με <span className="font-mono">|−j| = 1</span> →
          <strong> μένει M</strong>· στη φάση προστέθηκε <span className="font-mono">−π/2</span>.
          Με συντεταγμένες το ίδιο πράγμα: <span className="font-mono">−j(a+bj) = b − aj</span>,
          οπότε <span className="font-mono">√(b² + a²) = √(a² + b²)</span> — το{' '}
          <span className="font-mono">√(Re² + Im²)</span> δεν αλλάζει, απλώς τα Re/Im
          ανταλλάσσονται (με μια αλλαγή προσήμου). {showPlusJ && (
            <>Συμμετρικά, <span className="font-mono">+j = e^(+jπ/2)</span> στρέφει κατά <span className="font-mono">+90°</span> — αυτό συμβαίνει στις αρνητικές συχνότητες.</>
          )}
        </p>
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  re: number,
  im: number,
  showPlusJ: boolean,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const cx = w / 2
  const cy = h / 2
  const scale = Math.min(w, h) / (2 * RANGE) - 10
  const xPx = (x: number) => cx + x * scale
  const yPx = (y: number) => cy - y * scale

  // Grid at integers
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  for (let g = -2; g <= 2; g++) {
    if (g === 0) continue
    ctx.beginPath()
    ctx.moveTo(xPx(g), yPx(-RANGE))
    ctx.lineTo(xPx(g), yPx(RANGE))
    ctx.moveTo(xPx(-RANGE), yPx(g))
    ctx.lineTo(xPx(RANGE), yPx(g))
    ctx.stroke()
  }

  // Unit circle (scale reference)
  ctx.save()
  ctx.setLineDash([3, 3])
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.arc(cx, cy, scale, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  // Axes
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(xPx(-RANGE), yPx(0))
  ctx.lineTo(xPx(RANGE), yPx(0))
  ctx.moveTo(xPx(0), yPx(-RANGE))
  ctx.lineTo(xPx(0), yPx(RANGE))
  ctx.stroke()

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('Re', xPx(RANGE) - 4, yPx(0) - 4)
  ctx.textAlign = 'left'
  ctx.fillText('Im', xPx(0) + 4, yPx(RANGE) + 9)
  ctx.fillText('−j', xPx(0) + 4, yPx(-1) + 3)

  const mag = Math.hypot(re, im)
  const phi = Math.atan2(im, re)

  // Rotation arc from X to −jX (sweep of exactly −π/2), radius = magnitude.
  // Sampled by hand so the direction is unambiguous (canvas arc() angle
  // conventions are flipped by the y-axis and easy to get backwards).
  if (mag > 0.05) {
    ctx.strokeStyle = MINUS_C
    ctx.lineWidth = 1.3
    ctx.save()
    ctx.setLineDash([2, 2])
    ctx.beginPath()
    const N = 28
    for (let i = 0; i <= N; i++) {
      const th = phi - (Math.PI / 2) * (i / N) // sweep φ → φ − π/2
      const px = xPx(mag * Math.cos(th))
      const py = yPx(mag * Math.sin(th))
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
    ctx.restore()
    // "−π/2" label at the mid-angle
    const midA = phi - Math.PI / 4
    ctx.fillStyle = MINUS_C
    ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('−π/2', xPx(mag * 1.18 * Math.cos(midA)), yPx(mag * 1.18 * Math.sin(midA)) + 3)
  }

  // +j·X (optional): −im + re·j
  if (showPlusJ) {
    drawVector(ctx, cx, cy, scale, -im, re, PLUSJ_C, '+jX', 2)
  }
  // −j·X: im − re·j
  drawVector(ctx, cx, cy, scale, im, -re, MINUS_C, '−jX', 2.5)
  // X (drawn last so it sits on top)
  drawVector(ctx, cx, cy, scale, re, im, PLUS_C, 'X', 2.8)
}

function drawVector(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  re: number,
  im: number,
  color: string,
  label: string,
  width: number,
) {
  const px = cx + re * scale
  const py = cy - im * scale
  if (Math.hypot(re, im) < 0.04) return
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(px, py)
  ctx.stroke()
  // arrowhead
  const headLen = 9
  const headAng = 0.5
  const angle = Math.atan2(-(py - cy), px - cx)
  ctx.beginPath()
  ctx.moveTo(px, py)
  ctx.lineTo(px - headLen * Math.cos(angle - headAng), py + headLen * Math.sin(angle - headAng))
  ctx.lineTo(px - headLen * Math.cos(angle + headAng), py + headLen * Math.sin(angle + headAng))
  ctx.closePath()
  ctx.fill()
  // endpoint dot (drag affordance)
  ctx.beginPath()
  ctx.arc(px, py, 3.5, 0, Math.PI * 2)
  ctx.fill()
  // label
  ctx.font = '12px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(label, px + 7, py - 5)
}
