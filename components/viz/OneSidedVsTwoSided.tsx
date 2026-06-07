'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * FT §2.4 — "periodicity needs both directions".
 *
 * Two-sided cos(2πf₀t) (a genuine periodic signal) → clean impulses of weight
 * aₖ = ½. One-sided cos(2πf₀t)·u(t) (the cosine "switched on" at t=0) is NOT
 * periodic — it has a beginning — and its transform is:
 *     X(f) = ¼δ(f−f₀) + ¼δ(f+f₀) + (a smooth continuous part).
 * The impulses HALVE (¼) and a continuous part appears: u(t) ↔ ½δ(f)+1/(j2πf)
 * shifted to ±f₀ gives the ¼ deltas plus the smooth term f/(j2π(f²−f₀²)). We draw
 * its real magnitude |f|/(2π|f²−f₀²|) (clamped near the poles at ±f₀).
 */

type Mode = 'two' | 'one'

const F_DOM = 2.4
// magnitude of the continuous part of FT{cos·u}, ∝ |f/(f²−f₀²)| (f₀ = 1)
function smooth(f: number) {
  const d = f * f - 1
  if (Math.abs(d) < 1e-3) return 999
  return (1 / (2 * Math.PI)) * Math.abs(f / d)
}

export function OneSidedVsTwoSided() {
  const [mode, setMode] = useState<Mode>('two')
  const timeRef = useRef<HTMLCanvasElement | null>(null)
  const freqRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (timeRef.current) drawTime(timeRef.current, colors, mode)
    if (freqRef.current) drawFreq(freqRef.current, colors, mode)
  }, [mode])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Δίπλευρο vs μονόπλευρο cosine — η περιοδικότητα θέλει ΚΑΙ τις δύο κατευθύνσεις
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        <strong>Δίπλευρο</strong>: το cosine υπάρχει σε όλο τον χρόνο (γνήσια periodic) → καθαρές{' '}
        <strong>κρούσεις βάρους ½</strong>. <strong>Μονόπλευρο</strong>: το ίδιο cosine «ανάβει»
        στο <span className="font-mono">t = 0</span> (μηδέν για{' '}
        <span className="font-mono">t &lt; 0</span>) — <strong>δεν είναι πια periodic</strong>: οι
        κρούσεις <strong>μισιάζουν (¼)</strong> και εμφανίζεται ένα <strong>συνεχές μέρος</strong>.
      </p>

      <div className="mb-3 flex flex-wrap gap-2">
        {(['two', 'one'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
              m === mode
                ? 'border-accent bg-accent-soft/40 font-semibold text-fg'
                : 'border-border bg-bg text-fg-muted hover:bg-bg-soft'
            }`}
          >
            {m === 'two' ? 'δίπλευρο (periodic)' : 'μονόπλευρο (ανάβει στο t=0)'}
          </button>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Στον χρόνο" subtitle={mode === 'two' ? 'cosine σε όλο τον χρόνο' : 'cosine μόνο για t ≥ 0'}>
          <canvas ref={timeRef} style={{ height: 180 }} className="block h-[180px] w-full" aria-label="Cosine, two-sided or one-sided" />
        </Panel>
        <Panel title="Στη συχνότητα" subtitle={mode === 'two' ? 'καθαρές κρούσεις (½)' : 'κρούσεις ¼ + συνεχές μέρος'}>
          <canvas ref={freqRef} style={{ height: 180 }} className="block h-[180px] w-full" aria-label="Spectrum: clean impulses, or halved impulses plus a continuous part" />
        </Panel>
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Γιατί μισιάζουν: <span className="font-mono">u(t) = ½ + ½·sgn(t)</span>. Το σταθερό{' '}
        <span className="font-mono">½</span> κάνει το σήμα «μισό cosine κατά μέσο όρο» → κρούσεις
        βάρους <span className="font-mono">½·aₖ</span>. Το <span className="font-mono">½·sgn(t)</span>{' '}
        είναι η <strong>ακμή του ανάμματος</strong> στο <span className="font-mono">t = 0</span>, και
        αυτή απλώνει ενέργεια σε ένα <strong>συνεχές</strong> φάσμα. Καθαρό «γραμμικό» φάσμα (μόνο
        κρούσεις βάρους <span className="font-mono">aₖ</span>) παίρνεις <strong>μόνο</strong> όταν οι
        κύκλοι τρέχουν στο <span className="font-mono">±∞</span>. (Το συνεχές μέρος είναι ο FT του{' '}
        <span className="font-mono">u(t)</span> μετατοπισμένος στις ±f₀· εδώ φαίνεται το μέτρο του,{' '}
        <span className="font-mono">|f|/(2π|f²−f₀²|)</span> — <strong>μηδέν</strong> στο{' '}
        <span className="font-mono">f = 0</span> και <strong>απειρίζεται</strong> καθώς{' '}
        <span className="font-mono">f → ±f₀</span>, γι' αυτό η καμπύλη «σπάει» κι ανεβαίνει κατακόρυφα εκεί.)
      </div>
    </figure>
  )
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-3 py-1">
        <span className="text-[10px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

const PAD_X = 28
const PAD_Y = 16

function getRGB(rgb: string): string {
  const m = rgb.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return '29, 78, 216'
  return `${m[1]}, ${m[2]}, ${m[3]}`
}

function drawTime(canvas: HTMLCanvasElement, colors: ThemeColors, mode: Mode) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const tDom = 4.5
  const yLim = 1.3
  const xt = (t: number) => lerp(t, -tDom, tDom, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yLim, -yLim, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  if (mode === 'one') {
    // mark t = 0 onset
    ctx.strokeStyle = colors.danger
    ctx.setLineDash([3, 3])
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(xt(0), PAD_Y)
    ctx.lineTo(xt(0), h - PAD_Y)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = colors.danger
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('ανάβει', xt(0) + 3, PAD_Y + 9)
  }

  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1.8
  ctx.beginPath()
  const STEPS = 760
  let started = false
  for (let i = 0; i <= STEPS; i++) {
    const t = lerp(i, 0, STEPS, -tDom, tDom)
    if (mode === 'one' && t < 0) {
      started = false
      continue
    }
    const x = xt(t)
    const y = yv(Math.cos(2 * Math.PI * t))
    if (!started) {
      ctx.moveTo(x, y)
      started = true
    } else ctx.lineTo(x, y)
  }
  ctx.stroke()
}

function drawFreq(canvas: HTMLCanvasElement, colors: ThemeColors, mode: Mode) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)
  const xt = (f: number) => lerp(f, -F_DOM, F_DOM, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, 1, -0.12, PAD_Y, h - PAD_Y) // display units 0..1
  const yZero = yv(0)
  const accentRgb = getRGB(colors.accent)

  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  // continuous part — the real magnitude |f / (2π(f²−f₀²))| (one-sided only).
  // This curve is ZERO at f=0, DECAYS in the tails, and DIVERGES (vertical
  // asymptote) at f = ±f₀ — it has a pole there. So we draw it BROKEN at the
  // poles: each branch rises steeply and gets cut where it leaves the panel,
  // never capped to a misleading flat top.
  if (mode === 'one') {
    const S = 900
    const TOP = 0.8 // display height where a branch is cut off as it shoots toward ±f₀
    // split the curve into segments wherever it shoots past TOP (around ±f₀)
    const segments: Array<Array<[number, number]>> = []
    let seg: Array<[number, number]> = []
    for (let i = 0; i <= S; i++) {
      const f = lerp(i, 0, S, -F_DOM, F_DOM)
      const v = smooth(f)
      if (v >= TOP) {
        if (seg.length > 1) segments.push(seg)
        seg = []
      } else {
        seg.push([xt(f), yv(v)])
      }
    }
    if (seg.length > 1) segments.push(seg)

    // dashed vertical asymptotes at ±f₀ (muted, behind the impulses) — they tell
    // the reader the continuous part runs off to ∞ here, it isn't cut arbitrarily
    ctx.strokeStyle = `rgba(${accentRgb}, 0.28)`
    ctx.setLineDash([3, 3])
    ctx.lineWidth = 1
    for (const c of [1, -1]) {
      ctx.beginPath()
      ctx.moveTo(xt(c), yZero)
      ctx.lineTo(xt(c), PAD_Y)
      ctx.stroke()
    }
    ctx.setLineDash([])

    // soft fill under each segment
    ctx.fillStyle = `rgba(${accentRgb}, 0.10)`
    for (const s of segments) {
      ctx.beginPath()
      ctx.moveTo(s[0][0], yZero)
      for (const [x, y] of s) ctx.lineTo(x, y)
      ctx.lineTo(s[s.length - 1][0], yZero)
      ctx.closePath()
      ctx.fill()
    }
    // stroke each segment
    ctx.strokeStyle = `rgba(${accentRgb}, 0.8)`
    ctx.lineWidth = 1.5
    for (const s of segments) {
      ctx.beginPath()
      s.forEach(([x, y], idx) => (idx === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)))
      ctx.stroke()
    }

    ctx.fillStyle = colors.fgMuted
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('|f| / (2π|f²−f₀²|)', xt(0), yv(0.16))
  }

  // impulses at ±1
  const weightH = mode === 'two' ? 0.85 : 0.42
  const label = mode === 'two' ? '½' : '¼'
  for (const c of [1, -1]) {
    const x = xt(c)
    const yTop = yv(weightH)
    ctx.strokeStyle = colors.accent
    ctx.fillStyle = colors.accent
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, yTop)
    ctx.stroke()
    // arrowhead
    ctx.beginPath()
    ctx.moveTo(x, yTop - 7)
    ctx.lineTo(x - 4, yTop + 1)
    ctx.lineTo(x + 4, yTop + 1)
    ctx.closePath()
    ctx.fill()
    ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(label, x + (c > 0 ? 10 : -10), yTop - 2)
  }

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('f₀', xt(1), yZero + 12)
  ctx.fillText('−f₀', xt(-1), yZero + 12)
}
