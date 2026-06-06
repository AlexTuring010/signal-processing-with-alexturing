'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp, type ThemeColors } from '@/lib/canvas'

/**
 * FT §2.2 — "the FT swallows the FS".
 *
 * For a chosen periodic signal, the Fourier-SERIES spectrum (discrete
 * coefficients aₖ at the harmonics kf₀) and the Fourier-TRANSFORM spectrum
 * (impulses aₖ·δ(f − kf₀) at the SAME kf₀) carry identical information. Shown
 * side by side: left = FS stems (dot tops), right = FT impulses (arrow tops),
 * same positions, same weights. The only difference is the notation — so the FS
 * is just a special case of the FT.
 *
 * Impulses are drawn with height = their weight aₖ (the standard convention),
 * with an arrowhead to mark "this is an impulse, of area aₖ".
 */

type SignalKey = 'cos' | 'tones' | 'square'

const SIGNALS: {
  key: SignalKey
  label: string
  formula: string
  ak: (k: number) => number
}[] = [
  {
    key: 'cos',
    label: 'cos(2πf₀t)',
    formula: 'x(t) = cos(2πf₀t)',
    ak: (k) => (Math.abs(k) === 1 ? 0.5 : 0),
  },
  {
    key: 'tones',
    label: 'άθροισμα τόνων',
    formula: 'x(t) = 1 + cos(2πf₀t) + ½·cos(2π·2f₀t)',
    ak: (k) =>
      k === 0 ? 1 : Math.abs(k) === 1 ? 0.5 : Math.abs(k) === 2 ? 0.25 : 0,
  },
  {
    key: 'square',
    label: 'τετραγωνικό 50%',
    formula: 'x(t) = τετραγωνικός παλμός, 50% duty  →  aₖ = ½·sinc(k/2)',
    ak: (k) => (k === 0 ? 0.5 : Math.sin((Math.PI * k) / 2) / (Math.PI * k)),
  },
]

const KMAX = 6

export function PeriodicSpectrumFsVsFt() {
  const [sig, setSig] = useState<SignalKey>('tones')
  const fsRef = useRef<HTMLCanvasElement | null>(null)
  const ftRef = useRef<HTMLCanvasElement | null>(null)
  const signal = SIGNALS.find((s) => s.key === sig)!

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors) return
    if (fsRef.current) drawSpectrum(fsRef.current, colors, signal.ak, 'fs')
    if (ftRef.current) drawSpectrum(ftRef.current, colors, signal.ak, 'ft')
  }, [sig, signal.ak])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Ίδιο periodic σήμα, δύο εργαλεία: aₖ (σειρά) vs κρούσεις (μετασχηματισμός)
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Διάλεξε ένα periodic σήμα. <strong>Αριστερά</strong> το φάσμα όπως το δίνει η{' '}
        <strong>σειρά Fourier</strong> (γραμμές ύψους <span className="font-mono">aₖ</span> στις
        αρμονικές <span className="font-mono">kf₀</span>)· <strong>δεξιά</strong> όπως το δίνει
        ο <strong>Fourier transform</strong> (κρούσεις στις <strong>ίδιες</strong>{' '}
        <span className="font-mono">kf₀</span>, με εμβαδόν <span className="font-mono">aₖ</span>).
        Ίδιες θέσεις, ίδια βάρη.
      </p>

      <div className="mb-3 flex flex-wrap gap-2">
        {SIGNALS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setSig(s.key)}
            className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
              s.key === sig
                ? 'border-accent bg-accent-soft/40 font-semibold text-fg'
                : 'border-border bg-bg text-fg-muted hover:bg-bg-soft'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mb-2 rounded-md border border-border bg-bg px-3 py-1.5 text-center font-mono text-xs text-fg">
        {signal.formula}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Σειρά Fourier" subtitle="συντελεστές aₖ στα kf₀ (διακριτό)">
          <canvas
            ref={fsRef}
            style={{ height: 190 }}
            className="block h-[190px] w-full"
            aria-label="Fourier-series discrete coefficients aₖ at the harmonics"
          />
        </Panel>
        <Panel title="Fourier transform" subtitle="κρούσεις aₖ·δ(f−kf₀) στα ίδια kf₀">
          <canvas
            ref={ftRef}
            style={{ height: 190 }}
            className="block h-[190px] w-full"
            aria-label="Fourier-transform impulses of area aₖ at the same harmonics"
          />
        </Panel>
      </div>

      <figcaption className="mt-3 rounded-md border border-border bg-bg px-3 py-2 text-xs text-fg-muted">
        <strong>Ίδια θέση, ίδιο βάρος.</strong> Η μόνη διαφορά είναι η «γλώσσα»: η σειρά τα λέει{' '}
        <strong>συντελεστές</strong> (διακριτές γραμμές), ο transform τα λέει{' '}
        <strong>κρούσεις</strong> (το ύψος του βέλους παριστάνει το εμβαδόν{' '}
        <span className="font-mono">aₖ</span>). Καμία πληροφορία δεν χάνεται — γι' αυτό η σειρά
        Fourier είναι <strong>ειδική περίπτωση</strong> του Fourier transform.
      </figcaption>
    </figure>
  )
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="flex items-baseline justify-between gap-2 border-b border-border bg-bg-soft px-3 py-1.5">
        <span className="text-[11px] font-semibold tracking-tight">{title}</span>
        <span className="truncate text-[10px] text-fg-muted">{subtitle}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

const PAD_X = 24
const PAD_Y = 16
const F_DOM = KMAX + 0.6

function drawSpectrum(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  ak: (k: number) => number,
  mode: 'fs' | 'ft',
) {
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Shared y-scale across both panels: max |aₖ|.
  let aMax = 0
  for (let k = -KMAX; k <= KMAX; k++) aMax = Math.max(aMax, Math.abs(ak(k)))
  if (aMax < 1e-9) aMax = 1
  const yTop = aMax * 1.18
  const yBot = -aMax * 0.6

  const xt = (f: number) => lerp(f, -F_DOM, F_DOM, PAD_X, w - PAD_X)
  const yv = (v: number) => lerp(v, yTop, yBot, PAD_Y, h - PAD_Y)
  const yZero = yv(0)

  // Axis.
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_X - 4, yZero)
  ctx.lineTo(w - PAD_X + 4, yZero)
  ctx.stroke()

  // f ticks at a few harmonics.
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const k of [-6, -4, -2, 2, 4, 6]) {
    ctx.fillText(`${k}f₀`, xt(k), yZero + (yZero < h - 18 ? 11 : -5))
  }
  ctx.fillText('0', xt(0), yZero + 11)
  ctx.textAlign = 'left'
  ctx.fillText('f', w - PAD_X + 2, yZero - 4)

  // Lines at f = k·f₀ (f₀ = 1 in display units), height aₖ.
  for (let k = -KMAX; k <= KMAX; k++) {
    const a = ak(k)
    if (Math.abs(a) < 1e-9) continue
    const x = xt(k)
    const yA = yv(a)
    ctx.strokeStyle = colors.accent
    ctx.fillStyle = colors.accent
    ctx.lineWidth = 1.8
    ctx.beginPath()
    ctx.moveTo(x, yZero)
    ctx.lineTo(x, yA)
    ctx.stroke()

    if (mode === 'fs') {
      // FS: filled dot at the top (a coefficient value).
      ctx.beginPath()
      ctx.arc(x, yA, 3, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // FT: arrowhead at the top (an impulse of area aₖ).
      const dir = a >= 0 ? 1 : -1
      ctx.beginPath()
      ctx.moveTo(x, yA - dir * 6)
      ctx.lineTo(x - 3.5, yA + dir * 1)
      ctx.lineTo(x + 3.5, yA + dir * 1)
      ctx.closePath()
      ctx.fill()
    }
  }

  // Panel tag.
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(mode === 'fs' ? '• aₖ' : '↑ κρούση (εμβ. aₖ)', PAD_X + 2, PAD_Y + 6)
}
