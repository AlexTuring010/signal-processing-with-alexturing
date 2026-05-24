'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'

/**
 * 4-stage walkthrough: από bandpass θόρυβο σε triangular output PSD.
 *
 * Stage 1 — Bandpass noise around f_c. PSD επίπεδη μέσα στο [-B/2,B/2] γύρω
 *           από ±f_c (η Carson ζώνη του δέκτη). Δείχνουμε realisation στο
 *           χρόνο + φάσμα.
 * Stage 2 — I/Q decomposition. n(t) = n_I cos − n_Q sin. n_I, n_Q είναι
 *           lowpass, ορθογώνια, PSD επίπεδη μέσα στο [-B/2,B/2] με ΔΙΠΛΆΣΙΟ
 *           ύψος (η ισχύς του n μεταφέρεται στα δύο baseband components).
 * Stage 3 — Phasor: το σήμα A_c (πραγματικός άξονας) + n_I (παράλληλο) +
 *           n_Q (κάθετο, quadrature). Ο limiter αφαιρεί την radial συνιστώσα·
 *           μόνο η ορθογώνια επηρεάζει τη φάση. Small-noise approx:
 *           θ_n(t) ≈ n_Q(t)/A_c.
 * Stage 4 — Discriminator differentiates: v_n(t) = (1/2π) dθ_n/dt.
 *           PSD: S_v(f) = f² · S_θ(f) = N_0 · f² / A_c² — η triangular!
 *           LPF at ±W κρατά τη μέση parabola — output noise power κάλπη Ν₀W³/(3A_c²)·2.
 *
 * Πεδαγωγική: κάθε stage εξηγείται με δικό του annotated panel + μία
 * γραμμή της αλγεβρικής μετάβασης. Ο user βλέπει την παραγωγή χωρίς να
 * χαθεί στις πράξεις του Haykin.
 */

type Stage = 0 | 1 | 2 | 3

const STAGES: { label: string; title: string; algebra: string; insight: string }[] = [
  {
    label: '1/4 · Bandpass θόρυβος',
    title: 'Stage 1 — Λευκός θόρυβος μέσα από τον RF bandpass',
    algebra: 'n(t) ∼ flat PSD = N_0/2,  φιλτραρισμένος στο [f_c − B/2, f_c + B/2]',
    insight:
      'Ο RF bandpass του δέκτη κόβει τον λευκό θόρυβο σε μια ζώνη πλάτους B = 2(β+1)W γύρω από τον carrier. Το αποτέλεσμα είναι «bandpass θόρυβος» — επίπεδη PSD μέσα στη ζώνη, μηδέν έξω.',
  },
  {
    label: '2/4 · I/Q decomposition',
    title: 'Stage 2 — Bandpass θόρυβος = n_I cos − n_Q sin',
    algebra: 'n(t) = n_I(t) cos(2π f_c t) − n_Q(t) sin(2π f_c t)',
    insight:
      'Κάθε bandpass σήμα γράφεται με δύο lowpass συνιστώσες: n_I (in-phase, παράλληλη στον carrier) και n_Q (quadrature, κάθετη). Η ισχύς του n μοιράζεται στα δύο — άρα η PSD κάθε baseband component έχει διπλάσιο ύψος αλλά μισό εύρος.',
  },
  {
    label: '3/4 · Phasor + small-noise',
    title: 'Stage 3 — Limiter αφαιρεί την radial· φάση μετράει μόνο',
    algebra: 'θ_n(t) ≈ n_Q(t) / A_c   (όταν |n| ≪ A_c)',
    insight:
      'Στο μιγαδικό επίπεδο: ο carrier A_c βρίσκεται στον πραγματικό άξονα. Το n_I προσθέτεται παράλληλα (αλλάζει envelope), το n_Q κάθετα (αλλάζει φάση). Ο limiter ισιώνει την envelope πίσω στο A_c και αφήνει μόνο τη γωνία — άρα μόνο το n_Q επιβιώνει.',
  },
  {
    label: '4/4 · Discriminator → f² PSD',
    title: 'Stage 4 — Διαφόριση παράγει το triangular spectrum',
    algebra: 'v_n(t) = (1/2π) dθ_n/dt   ⇒   S_v(f) = f² · N_0 / A_c²',
    insight:
      'Ο discriminator διαφορίζει τη φάση για να βγάλει στιγμιαία συχνότητα. Στο φάσμα, διαφόριση = πολλαπλασιασμός με j2πf, άρα η PSD πολλαπλασιάζεται με f². Από επίπεδο θόρυβο (N_0/A_c² for |f| ≤ W) γίνεται παραβολικός — γνωστός ως «triangular noise spectrum».',
  },
]

const TIME_SAMPLES = 240

function makeNoiseSamples(seed: number, n: number) {
  // deterministic pseudo-random for stable visuals between renders
  let s = seed
  const next = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  const out = new Array(n)
  for (let i = 0; i < n; i++) {
    const u1 = next() || 1e-9
    const u2 = next()
    out[i] = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  }
  return out
}

function smooth(samples: number[], window: number) {
  const n = samples.length
  const out = new Array(n)
  for (let i = 0; i < n; i++) {
    let acc = 0
    let count = 0
    for (let k = -window; k <= window; k++) {
      const j = i + k
      if (j >= 0 && j < n) {
        acc += samples[j]
        count++
      }
    }
    out[i] = acc / count
  }
  return out
}

export function TriangularNoiseDerivationViz() {
  const [stage, setStage] = useState<Stage>(0)
  const [N0, setN0] = useState(0.5)
  const [Ac, setAc] = useState(1.0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const noiseTraces = useMemo(() => {
    // n_I and n_Q are independent lowpass realizations, then we build n(t)
    const nI = smooth(makeNoiseSamples(7, TIME_SAMPLES), 4)
    const nQ = smooth(makeNoiseSamples(91, TIME_SAMPLES), 4)
    return { nI, nQ }
  }, [])

  useEffect(() => {
    const colors = getThemeColors()
    if (!colors || !canvasRef.current) return
    drawScene(canvasRef.current, colors, stage, N0, Ac, noiseTraces)
    const onResize = () => {
      const c = getThemeColors()
      if (c && canvasRef.current) drawScene(canvasRef.current, c, stage, N0, Ac, noiseTraces)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [stage, N0, Ac, noiseTraces])

  const cur = STAGES[stage]

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Bandpass θόρυβος → triangular spectrum — η παραγωγή σε 4 stages
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {STAGES.map((s, idx) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setStage(idx as Stage)}
              className={`rounded-full border px-2.5 py-0.5 text-xs ${
                stage === idx
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-2 text-xs font-semibold text-fg">{cur.title}</p>
      <p className="mb-3 text-xs leading-relaxed text-fg-muted">{cur.insight}</p>

      <canvas
        ref={canvasRef}
        style={{ height: 320 }}
        className="block h-[320px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Triangular noise derivation visualization"
      />

      <p className="mt-2 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-1.5 text-center font-mono text-xs text-fg">
        {cur.algebra}
      </p>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-fg-muted">
            Επίπεδο θορύβου N₀ ={' '}
            <span className="font-mono text-fg tabular-nums">{N0.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0.1}
            max={1.5}
            step={0.05}
            value={N0}
            onChange={(e) => setN0(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
          />
        </div>
        <div>
          <label className="block text-xs text-fg-muted">
            Πλάτος carrier A_c ={' '}
            <span className="font-mono text-fg tabular-nums">{Ac.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min={0.4}
            max={2.0}
            step={0.05}
            value={Ac}
            onChange={(e) => setAc(parseFloat(e.target.value))}
            className="mt-1 w-full accent-[rgb(var(--accent))]"
          />
        </div>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-fg-subtle">
        <strong>Παρατήρηση μέσω των sliders:</strong> διπλασίασε το A_c → η output PSD πέφτει στο τέταρτο (1/A_c²). Αύξησε το N₀ → η output PSD ανεβαίνει γραμμικά. Από εδώ έρχεται το <em>3β²</em> gain: όσο μεγαλώνει το A_c² (carrier ισχύς) το output noise μειώνεται.
      </p>
    </figure>
  )
}

// ── drawing ──────────────────────────────────────────────────────────────

const SIG_C = 'rgb(29, 78, 216)'
const NI_C = 'rgb(34, 197, 94)'
const NQ_C = 'rgb(168, 85, 247)'
const NOISE_C = 'rgba(220, 38, 38, 0.6)'
const AXIS_C = 'rgba(120, 120, 120, 0.5)'

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  stage: Stage,
  N0: number,
  Ac: number,
  noise: { nI: number[]; nQ: number[] },
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  if (stage === 0) drawStage1(ctx, colors, 0, 0, w, h, N0, noise)
  if (stage === 1) drawStage2(ctx, colors, 0, 0, w, h, N0, noise)
  if (stage === 2) drawStage3(ctx, colors, 0, 0, w, h, Ac, noise)
  if (stage === 3) drawStage4(ctx, colors, 0, 0, w, h, N0, Ac)
}

function drawStage1(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  w: number,
  h: number,
  N0: number,
  noise: { nI: number[]; nQ: number[] },
) {
  if (!colors) return
  const halfW = w / 2
  // LEFT: time-domain n(t) realization (synthesized: n_I cos + n_Q sin at "f_c")
  drawTimePanel(
    ctx,
    colors,
    x0 + 8,
    y0 + 8,
    halfW - 16,
    h - 16,
    'n(t) — bandpass θόρυβος (μία υλοποίηση)',
    (i, t) => {
      // Build n(t) at synthetic f_c — high-freq carrier oscillation modulated by envelope
      const fc = 8
      const env = noise.nI[i] * 0.7
      const env2 = noise.nQ[i] * 0.7
      return N0 * (env * Math.cos(2 * Math.PI * fc * t) - env2 * Math.sin(2 * Math.PI * fc * t))
    },
    NOISE_C,
    1.4,
  )
  // RIGHT: spectrum |N(f)| around ±f_c (idealized as rectangle)
  drawSpectrumPanel(
    ctx,
    colors,
    x0 + halfW + 8,
    y0 + 8,
    halfW - 16,
    h - 16,
    'PSD S_N(f) — επίπεδη στις Carson ζώνες ±f_c',
    (f) => {
      const fc = 0.55
      const halfBw = 0.18
      const left = (Math.abs(f) > fc - halfBw && Math.abs(f) < fc + halfBw) ? N0 / 2 : 0
      return left
    },
    NOISE_C,
    true,
  )
}

function drawStage2(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  w: number,
  h: number,
  N0: number,
  noise: { nI: number[]; nQ: number[] },
) {
  if (!colors) return
  const halfH = h / 2
  // TOP: n_I(t) and n_Q(t) — both lowpass
  drawTimePanel(
    ctx,
    colors,
    x0 + 8,
    y0 + 8,
    w - 16,
    halfH - 16,
    'n_I(t) (πράσινο), n_Q(t) (μωβ) — lowpass συνιστώσες',
    null,
    null,
    null,
    [
      { color: NI_C, fn: (i) => N0 * noise.nI[i] * 0.9 },
      { color: NQ_C, fn: (i) => N0 * noise.nQ[i] * 0.9 },
    ],
  )
  // BOTTOM: baseband PSD of n_I (= n_Q) — rect of height N_0 from -W/2 to +W/2
  // (versus original bandpass PSD shown faded for comparison)
  drawSpectrumPanel(
    ctx,
    colors,
    x0 + 8,
    y0 + halfH + 8,
    w - 16,
    halfH - 16,
    'PSD των n_I, n_Q — lowpass, διπλάσιο ύψος (N_0)',
    (f) => {
      // baseband PSD: N_0 from -W/2 to W/2 (= half of bandpass full B/2)
      const halfBw = 0.18
      return Math.abs(f) < halfBw ? N0 : 0
    },
    NI_C,
    false,
  )
}

function drawStage3(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  w: number,
  h: number,
  Ac: number,
  noise: { nI: number[]; nQ: number[] },
) {
  if (!colors) return
  const halfW = w / 2
  // LEFT: phasor diagram (A_c on real axis + small n_I parallel + small n_Q perpendicular)
  drawPhasorDiagram(ctx, colors, x0 + 8, y0 + 8, halfW - 16, h - 16, Ac, noise)
  // RIGHT: θ_n(t) trace = n_Q(t)/A_c, scaled
  drawTimePanel(
    ctx,
    colors,
    x0 + halfW + 8,
    y0 + 8,
    halfW - 16,
    h - 16,
    'θ_n(t) ≈ n_Q(t)/A_c — μόνο η quadrature επιβιώνει',
    (i) => noise.nQ[i] / Ac,
    NQ_C,
    1.5,
  )
}

function drawStage4(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x0: number,
  y0: number,
  w: number,
  h: number,
  N0: number,
  Ac: number,
) {
  if (!colors) return
  const halfW = w / 2
  // LEFT: input phase noise PSD S_θ(f) — flat
  drawSpectrumPanel(
    ctx,
    colors,
    x0 + 8,
    y0 + 8,
    halfW - 16,
    h - 16,
    'Input: S_θ(f) = N_0/A_c² (επίπεδη)',
    (f) => {
      const halfBw = 0.4
      return Math.abs(f) < halfBw ? N0 / (Ac * Ac) : 0
    },
    NQ_C,
    false,
  )
  // RIGHT: output PSD S_v(f) = f² · S_θ(f) = N_0 f²/A_c² — the triangular spectrum
  drawSpectrumPanel(
    ctx,
    colors,
    x0 + halfW + 8,
    y0 + 8,
    halfW - 16,
    h - 16,
    'Output: S_v(f) = N_0 f²/A_c² (triangular)',
    (f) => {
      const halfBw = 0.4
      if (Math.abs(f) > halfBw) return 0
      // peak parabola at edge — scaled for visibility
      const peak = (N0 / (Ac * Ac)) * 1.0
      return peak * (f / halfBw) ** 2
    },
    'rgb(220, 38, 38)',
    false,
    true, // shade lpf region
  )
}

// ── helpers ──────────────────────────────────────────────────────────────

function drawTimePanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x: number,
  y: number,
  pw: number,
  ph: number,
  title: string,
  fn: ((i: number, t: number) => number) | null,
  color: string | null,
  lineWidth: number | null,
  multi?: { color: string; fn: (i: number) => number }[],
) {
  if (!colors) return
  const PAD = 26
  const inner = { x: x + PAD, y: y + PAD - 4, w: pw - PAD - 8, h: ph - PAD - 14 }
  // title
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(title, x + 6, y + 14)
  // axis
  const cy = inner.y + inner.h / 2
  ctx.strokeStyle = AXIS_C
  ctx.beginPath()
  ctx.moveTo(inner.x, cy)
  ctx.lineTo(inner.x + inner.w, cy)
  ctx.stroke()
  // panel border
  ctx.strokeStyle = colors.border
  ctx.strokeRect(x + 2, y + 18, pw - 4, ph - 22)

  const drawTrace = (fn: (i: number, t: number) => number, c: string, lw: number) => {
    ctx.strokeStyle = c
    ctx.lineWidth = lw
    ctx.beginPath()
    const yMax = 1.4
    for (let i = 0; i < TIME_SAMPLES; i++) {
      const t = i / TIME_SAMPLES
      const px = inner.x + (i / (TIME_SAMPLES - 1)) * inner.w
      const v = fn(i, t)
      const py = lerp(v, -yMax, yMax, inner.y + inner.h, inner.y)
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }

  if (fn && color !== null) drawTrace(fn, color, lineWidth ?? 1.4)
  if (multi) multi.forEach((m) => drawTrace((i) => m.fn(i), m.color, 1.4))
}

function drawSpectrumPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x: number,
  y: number,
  pw: number,
  ph: number,
  title: string,
  psdFn: (f: number) => number,
  color: string,
  showSidebands: boolean,
  shadeLpf?: boolean,
) {
  if (!colors) return
  const PAD = 30
  const inner = { x: x + PAD, y: y + PAD - 4, w: pw - PAD - 8, h: ph - PAD - 14 }
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(title, x + 6, y + 14)
  ctx.strokeStyle = colors.border
  ctx.strokeRect(x + 2, y + 18, pw - 4, ph - 22)

  // axes
  const yAxis = inner.y + inner.h - 2
  ctx.strokeStyle = AXIS_C
  ctx.beginPath()
  ctx.moveTo(inner.x, yAxis)
  ctx.lineTo(inner.x + inner.w, yAxis)
  ctx.stroke()

  // f axis ranges based on which spectrum we draw
  const fMin = showSidebands ? -0.9 : -0.6
  const fMax = showSidebands ? 0.9 : 0.6
  const yMax = 1.0

  const xf = (f: number) => lerp(f, fMin, fMax, inner.x, inner.x + inner.w)
  const yv = (v: number) => lerp(v, 0, yMax, yAxis, inner.y + 6)

  // fill
  const STEPS = 200
  ctx.fillStyle = color.startsWith('rgb(') ? color.replace('rgb(', 'rgba(').replace(')', ', 0.25)') : color
  ctx.beginPath()
  ctx.moveTo(xf(fMin), yAxis)
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const v = psdFn(f)
    ctx.lineTo(xf(f), yv(v))
  }
  ctx.lineTo(xf(fMax), yAxis)
  ctx.closePath()
  ctx.fill()

  // stroke
  ctx.strokeStyle = color
  ctx.lineWidth = 1.6
  ctx.beginPath()
  let started = false
  for (let i = 0; i <= STEPS; i++) {
    const f = lerp(i, 0, STEPS, fMin, fMax)
    const v = psdFn(f)
    const px = xf(f)
    const py = yv(v)
    if (!started) {
      ctx.moveTo(px, py)
      started = true
    } else {
      ctx.lineTo(px, py)
    }
  }
  ctx.stroke()

  // LPF cutoff at ±W (only on stage 4)
  if (shadeLpf) {
    const W = 0.4
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.7)'
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 3])
    ctx.beginPath()
    ctx.moveTo(xf(-W), inner.y + 6)
    ctx.lineTo(xf(-W), yAxis)
    ctx.moveTo(xf(W), inner.y + 6)
    ctx.lineTo(xf(W), yAxis)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = 'rgb(34, 197, 94)'
    ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('LPF: ±W', xf(0), inner.y + 6 - 2)
  }

  // labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  if (showSidebands) {
    ctx.fillText('−f_c', xf(-0.55), yAxis + 12)
    ctx.fillText('0', xf(0), yAxis + 12)
    ctx.fillText('+f_c', xf(0.55), yAxis + 12)
  } else {
    ctx.fillText(`−W`, xf(-0.4), yAxis + 12)
    ctx.fillText('0', xf(0), yAxis + 12)
    ctx.fillText(`+W`, xf(0.4), yAxis + 12)
  }
}

function drawPhasorDiagram(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  x: number,
  y: number,
  pw: number,
  ph: number,
  Ac: number,
  noise: { nI: number[]; nQ: number[] },
) {
  if (!colors) return
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Phasor: carrier + n_I (παράλληλο) + n_Q (κάθετο)', x + 6, y + 14)
  ctx.strokeStyle = colors.border
  ctx.strokeRect(x + 2, y + 18, pw - 4, ph - 22)

  const cx = x + pw / 2
  const cy = y + 18 + (ph - 22) / 2
  const scale = Math.min(pw, ph) * 0.32

  // Axes
  ctx.strokeStyle = AXIS_C
  ctx.beginPath()
  ctx.moveTo(x + 12, cy)
  ctx.lineTo(x + pw - 12, cy)
  ctx.moveTo(cx, y + 24)
  ctx.lineTo(cx, y + ph - 8)
  ctx.stroke()

  // Carrier A_c (blue)
  const acEnd = { x: cx + Ac * scale * 0.7, y: cy }
  ctx.strokeStyle = SIG_C
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(acEnd.x, acEnd.y)
  ctx.stroke()
  drawArrowHead(ctx, cx, cy, acEnd.x, acEnd.y, SIG_C, 7)
  ctx.fillStyle = SIG_C
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('A_c (carrier)', acEnd.x + 4, acEnd.y - 4)

  // From tip of A_c, add small n_I parallel + n_Q perpendicular
  const idx = 100 // pick a representative noise sample for the phasor demo
  const nI_val = noise.nI[idx] * 0.35
  const nQ_val = noise.nQ[idx] * 0.35
  const nIEnd = { x: acEnd.x + nI_val * scale, y: acEnd.y }
  const nQEnd = { x: nIEnd.x, y: nIEnd.y - nQ_val * scale }

  // n_I phasor (green, parallel to real)
  ctx.strokeStyle = NI_C
  ctx.lineWidth = 1.8
  ctx.beginPath()
  ctx.moveTo(acEnd.x, acEnd.y)
  ctx.lineTo(nIEnd.x, nIEnd.y)
  ctx.stroke()
  drawArrowHead(ctx, acEnd.x, acEnd.y, nIEnd.x, nIEnd.y, NI_C, 5)
  ctx.fillStyle = NI_C
  ctx.fillText('n_I (in-phase)', nIEnd.x + 4, nIEnd.y + 14)

  // n_Q phasor (purple, perpendicular)
  ctx.strokeStyle = NQ_C
  ctx.lineWidth = 1.8
  ctx.beginPath()
  ctx.moveTo(nIEnd.x, nIEnd.y)
  ctx.lineTo(nQEnd.x, nQEnd.y)
  ctx.stroke()
  drawArrowHead(ctx, nIEnd.x, nIEnd.y, nQEnd.x, nQEnd.y, NQ_C, 5)
  ctx.fillStyle = NQ_C
  ctx.fillText('n_Q (quadrature)', nQEnd.x + 4, nQEnd.y - 4)

  // Resultant — dashed from origin
  ctx.strokeStyle = 'rgba(220, 38, 38, 0.7)'
  ctx.lineWidth = 1.4
  ctx.setLineDash([4, 3])
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(nQEnd.x, nQEnd.y)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = 'rgb(220, 38, 38)'
  ctx.fillText('resultant', nQEnd.x + 4, nQEnd.y - 16)

  // Annotation: limiter removes radial component
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('→ ο limiter αφαιρεί τη radial συνιστώσα·', cx, y + ph - 22)
  ctx.fillText('μένει μόνο η γωνία θ_n ≈ n_Q/A_c', cx, y + ph - 10)
}

function drawArrowHead(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
  size: number,
) {
  const dx = toX - fromX
  const dy = toY - fromY
  const angle = Math.atan2(dy, dx)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(toX, toY)
  ctx.lineTo(toX - size * Math.cos(angle - Math.PI / 6), toY - size * Math.sin(angle - Math.PI / 6))
  ctx.lineTo(toX - size * Math.cos(angle + Math.PI / 6), toY - size * Math.sin(angle + Math.PI / 6))
  ctx.closePath()
  ctx.fill()
}
