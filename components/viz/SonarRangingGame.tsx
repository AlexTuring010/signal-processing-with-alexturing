'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getThemeColors, type ThemeColors } from '@/lib/canvas'
import { gaussianArray, mulberry32, uniform } from '@/lib/random'

/**
 * Sonar ranging game — the flagship application of cross-correlation (§10a).
 *
 * The prose right above this viz makes a claim that's easy to *state* but hard
 * to *feel*: in radar/sonar you transmit a known pulse x(t), the echo y(t) comes
 * back delayed-attenuated-noisy, and R_xy(τ) peaks exactly at the round-trip
 * delay → distance. "Η cross-correlation μετατρέπει το «κρύβεται το σήμα μου εκεί
 * μέσα, και πού;» σε ένα απλό «βρες την κορυφή»."
 *
 * This component lets the student BE the sonar operator and discover that the
 * claim is true:
 *   1. Fire a ping (a real chirp — pulse compression, what actual systems use).
 *   2. The received trace y(t) shows the echo buried in noise. Crank the noise
 *      slider and the echo vanishes from the eye completely.
 *   3. Drag the red cursor to guess the range by eye — you'll be wrong.
 *   4. Run the cross-correlation: the matched filter slides the known pulse
 *      across y(t), the R(τ) curve builds, and a clean peak appears *exactly*
 *      at the echo — even when the eye saw nothing. Read the peak → distance.
 *   5. Reveal the true target; a scoreboard tallies eyeball error vs
 *      correlation error across rounds, so the lesson lands quantitatively.
 *
 * The horizontal axis of all three stacked panels is the SAME distance axis
 * (delay τ rescaled by d = c·τ/2), so the correlation peak sits directly under
 * the echo and over the target blip — that vertical alignment is the whole aha.
 *
 * Why the peak survives noise that hides the echo: processing gain. Summing the
 * pulse against the template adds the echo coherently (∝ pulse length) but the
 * noise incoherently (∝ √length), so correlation SNR ≈ √N_pulse better than the
 * raw trace. This is the real reason matched filtering works.
 */

// ─── physical model (sonar in water) ──────────────────────────────────────
const C = 1500 // m/s — speed of sound in water
const T_MAX = 1.0 // s — listening window after the ping
const N = 700 // samples across the window
const DT = T_MAX / N
const PULSE_DUR = 0.08 // s — ping length
const PULSE_SAMPLES = Math.round(PULSE_DUR / DT) // ≈ 56
const LAG_MAX = N - PULSE_SAMPLES - 1 // last lag where the template still fits
const distOf = (t: number) => (C * t) / 2 // round-trip delay → one-way range
const D_MAX = distOf(T_MAX) // 750 m — full axis

// shared plot geometry so every panel's x-axis lines up exactly
const PAD_L = 44
const PAD_R = 16
const xOfDist = (d: number, w: number) => PAD_L + (d / D_MAX) * (w - PAD_L - PAD_R)
const distOfX = (px: number, w: number) => ((px - PAD_L) / (w - PAD_L - PAD_R)) * D_MAX

// colors with fixed meaning across the whole game
const COL = {
  pulse: '#3b82f6', // blue — the known transmitted pulse / template
  curve: '#7c3aed', // violet — the correlation curve
  guess: '#ef4444', // red — your eyeball guess
  corr: '#10b981', // green — what correlation says
  truth: '#f59e0b', // amber — the real target (revealed)
}

const ANIM_MS = 1700

type PulseType = 'chirp' | 'tone'

// ─── pulse (template) generation ──────────────────────────────────────────
/** Hann-windowed pulse on [0, PULSE_DUR], zero elsewhere. */
function makeTemplate(pulseType: PulseType): Float64Array {
  const tmpl = new Float64Array(N)
  const f0 = 10
  const f1 = 70 // chirp sweep 10→70 Hz; tone sits at 40 Hz
  const fTone = 40
  const k = (f1 - f0) / PULSE_DUR
  for (let i = 0; i < PULSE_SAMPLES; i++) {
    const t = i * DT
    const env = 0.5 * (1 - Math.cos((2 * Math.PI * t) / PULSE_DUR)) // Hann
    const phase =
      pulseType === 'chirp'
        ? 2 * Math.PI * (f0 * t + 0.5 * k * t * t)
        : 2 * Math.PI * fTone * t
    tmpl[i] = env * Math.cos(phase)
  }
  return tmpl
}

type Scene = {
  tmpl: Float64Array
  y: Float64Array
  cleanEcho: Float64Array
  corr: number[]
  corrMax: number
  estDelay: number
  estDist: number
  trueDelay: number
  trueDist: number
  guessDist: number
  correlationShown: boolean
  revealed: boolean
}

export function SonarRangingGame() {
  const [pulseType, setPulseType] = useState<PulseType>('chirp')
  const [noiseLevel, setNoiseLevel] = useState(0.7)
  const [roundId, setRoundId] = useState(0)
  const [guessT, setGuessT] = useState(T_MAX * 0.5)
  const [correlationShown, setCorrelationShown] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [history, setHistory] = useState<{ eyeErr: number; corrErr: number }[]>([])

  // ── per-round hidden truth (stable until "new target") ──
  const round = useMemo(() => {
    const rng = mulberry32(9001 + roundId * 7919)
    const trueDelay = uniform(rng, 0.18, 0.84)
    const trueDist = distOf(trueDelay)
    // farther echoes are weaker (spreading + absorption) — realistic difficulty
    const a = 0.55 + 0.45 * (1 - trueDist / D_MAX)
    const unitNoise = gaussianArray(777 + roundId * 131, N, 1)
    return { trueDelay, trueDist, a, unitNoise }
  }, [roundId])

  const tmpl = useMemo(() => makeTemplate(pulseType), [pulseType])

  // ── clean echo + received trace ──
  const { cleanEcho, y } = useMemo(() => {
    const lag = Math.round(round.trueDelay / DT)
    const cleanEcho = new Float64Array(N)
    const y = new Float64Array(N)
    for (let i = 0; i < N; i++) {
      const j = i - lag
      const echo = j >= 0 && j < PULSE_SAMPLES ? round.a * tmpl[j] : 0
      cleanEcho[i] = echo
      y[i] = echo + noiseLevel * round.unitNoise[i]
    }
    return { cleanEcho, y }
  }, [round, tmpl, noiseLevel])

  // ── matched-filter correlation: C[L] = Σ y[L+j]·tmpl[j] ──
  const { corr, corrMax, estDelay, estDist } = useMemo(() => {
    const corr = new Array<number>(LAG_MAX + 1)
    let best = -Infinity
    let bestLag = 0
    let corrMax = 1e-9
    for (let L = 0; L <= LAG_MAX; L++) {
      let s = 0
      for (let j = 0; j < PULSE_SAMPLES; j++) s += y[L + j] * tmpl[j]
      corr[L] = s
      if (s > best) {
        best = s
        bestLag = L
      }
      if (Math.abs(s) > corrMax) corrMax = Math.abs(s)
    }
    const estDelay = bestLag * DT
    return { corr, corrMax, estDelay, estDist: distOf(estDelay) }
  }, [y, tmpl])

  const guessDist = distOf(guessT)

  // ── snapshot for the draw routines (read by rAF / observer via ref) ──
  const scene: Scene = {
    tmpl,
    y,
    cleanEcho,
    corr,
    corrMax,
    estDelay,
    estDist,
    trueDelay: round.trueDelay,
    trueDist: round.trueDist,
    guessDist,
    correlationShown,
    revealed,
  }
  const sceneRef = useRef(scene)
  sceneRef.current = scene

  const transmittedRef = useRef<HTMLCanvasElement | null>(null)
  const receivedRef = useRef<HTMLCanvasElement | null>(null)
  const corrRef = useRef<HTMLCanvasElement | null>(null)
  const tacticalRef = useRef<HTMLCanvasElement | null>(null)

  const animatingRef = useRef(false)
  const progressRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  // single paint pass for all four canvases at a given correlation-reveal fraction
  const paint = useCallback((progress: number) => {
    const colors = getThemeColors()
    if (!colors) return
    const s = sceneRef.current
    if (transmittedRef.current) drawTransmitted(transmittedRef.current, colors, s.tmpl)
    if (receivedRef.current)
      drawReceived(receivedRef.current, colors, s, progress, animatingRef.current)
    if (corrRef.current) drawCorrelation(corrRef.current, colors, s, progress)
    if (tacticalRef.current) drawTactical(tacticalRef.current, colors, s, progress)
  }, [])

  const repaint = useCallback(() => {
    paint(animatingRef.current ? progressRef.current : correlationShown ? 1 : 0)
  }, [paint, correlationShown])

  // redraw on any relevant state change (when not mid-animation)
  useEffect(() => {
    if (animatingRef.current) return
    paint(correlationShown ? 1 : 0)
  }, [paint, scene.y, scene.corr, guessT, correlationShown, revealed, pulseType])

  // redraw on resize + theme toggle
  useEffect(() => {
    const onResize = () => repaint()
    window.addEventListener('resize', onResize)
    const obs = new MutationObserver(() => repaint())
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'style'],
    })
    return () => {
      window.removeEventListener('resize', onResize)
      obs.disconnect()
    }
  }, [repaint])

  // ── correlation sweep animation ──
  const runCorrelation = useCallback(() => {
    if (animatingRef.current) return
    animatingRef.current = true
    progressRef.current = 0
    setAnimating(true)
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ANIM_MS)
      progressRef.current = easeInOut(p)
      paint(progressRef.current)
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        animatingRef.current = false
        rafRef.current = null
        setAnimating(false)
        setCorrelationShown(true)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [paint])

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // ── pointer drag for the eyeball guess (received panel) ──
  const [dragging, setDragging] = useState(false)
  useEffect(() => {
    const canvas = receivedRef.current
    if (!canvas) return
    const tFromEvent = (clientX: number): number | null => {
      const rect = canvas.getBoundingClientRect()
      const d = distOfX(clientX - rect.left, rect.width)
      const t = (2 * d) / C
      if (!isFinite(t)) return null
      return Math.max(0.04, Math.min(T_MAX - 0.02, t))
    }
    const locked = () => revealed || animatingRef.current
    const onDown = (e: PointerEvent) => {
      if (locked()) return
      const t = tFromEvent(e.clientX)
      if (t == null) return
      setDragging(true)
      setGuessT(t)
      canvas.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging || locked()) return
      const t = tFromEvent(e.clientX)
      if (t != null) setGuessT(t)
    }
    const onUp = (e: PointerEvent) => {
      setDragging(false)
      try {
        canvas.releasePointerCapture(e.pointerId)
      } catch {
        /* not captured */
      }
    }
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    return () => {
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
    }
  }, [dragging, revealed])

  // ── round controls ──
  const newTarget = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    animatingRef.current = false
    setAnimating(false)
    setCorrelationShown(false)
    setRevealed(false)
    setGuessT(T_MAX * 0.5)
    setRoundId((r) => r + 1)
  }

  const reveal = () => {
    if (!correlationShown || revealed) return
    const eyeErr = Math.abs(guessDist - round.trueDist)
    const corrErr = Math.abs(estDist - round.trueDist)
    setHistory((h) => [...h, { eyeErr, corrErr }])
    setRevealed(true)
  }

  // ── scoreboard ──
  const eyeAvg = history.length ? history.reduce((a, h) => a + h.eyeErr, 0) / history.length : null
  const corrAvg = history.length
    ? history.reduce((a, h) => a + h.corrErr, 0) / history.length
    : null

  const controlsLocked = revealed || animating

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        📡 Sonar: βρες τον στόχο από την ηχώ — η cross-correlation σε δράση
      </h4>
      <p className="mb-3 text-xs leading-relaxed text-fg-muted">
        Είσαι ο χειριστής ενός sonar. Στέλνεις έναν <strong>γνωστό</strong> παλμό{' '}
        <span className="font-mono" style={{ color: COL.pulse }}>
          x(t)
        </span>{' '}
        στο νερό· γυρίζει πίσω μια <strong>ηχώ</strong> — το ίδιο σχήμα, αλλά{' '}
        <em>καθυστερημένο, εξασθενημένο και θαμμένο στον θόρυβο</em>. Βρες την καθυστέρηση και
        ξέρεις την απόσταση: <span className="font-mono">d = c·τ/2</span> (με{' '}
        <span className="font-mono">c = 1500 m/s</span> στο νερό). Δοκίμασε <strong>πρώτα με το
        μάτι</strong> — μετά άσε τη συσχέτιση να βρει την κορυφή.
      </p>

      {/* controls */}
      <div className="mb-3 flex flex-wrap items-end gap-x-5 gap-y-3 rounded-md border border-border bg-bg p-3">
        <div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
            Παλμός ping
          </div>
          <div className="flex gap-1">
            {(['chirp', 'tone'] as PulseType[]).map((p) => (
              <button
                key={p}
                type="button"
                disabled={controlsLocked}
                onClick={() => setPulseType(p)}
                className={`rounded border px-2 py-0.5 font-mono text-[11px] transition disabled:opacity-40 ${
                  pulseType === p
                    ? 'border-transparent text-white'
                    : 'border-border bg-bg-elevated text-fg-muted hover:bg-bg'
                }`}
                style={pulseType === p ? { background: COL.pulse } : undefined}
              >
                {p === 'chirp' ? 'chirp (σάρωση)' : 'tone (καθαρός τόνος)'}
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-[170px] flex-1">
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
            Θόρυβος ={' '}
            <span className="font-mono normal-case tabular-nums text-fg-muted">
              {noiseLevel.toFixed(2)}×
            </span>
          </label>
          <input
            type="range"
            min={0}
            max={1.6}
            step={0.05}
            value={noiseLevel}
            disabled={controlsLocked}
            onChange={(e) => setNoiseLevel(Number(e.target.value))}
            className="w-full disabled:opacity-40"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={runCorrelation}
            disabled={animating}
            className="rounded border border-transparent px-2.5 py-1 text-[11px] font-semibold text-white transition disabled:opacity-50"
            style={{ background: COL.curve }}
          >
            {animating
              ? 'Σαρώνω…'
              : correlationShown
                ? '↻ Τρέξε ξανά'
                : '▶ Τρέξε cross-correlation'}
          </button>
          <button
            type="button"
            onClick={reveal}
            disabled={!correlationShown || revealed}
            title={!correlationShown ? 'Τρέξε πρώτα τη συσχέτιση' : undefined}
            className="rounded border border-transparent px-2.5 py-1 text-[11px] font-semibold text-white transition disabled:opacity-40"
            style={{ background: COL.truth }}
          >
            Αποκάλυψε στόχο
          </button>
          <button
            type="button"
            onClick={newTarget}
            className="rounded border border-border bg-bg-elevated px-2.5 py-1 text-[11px] font-semibold text-fg-muted transition hover:bg-bg"
          >
            Νέος στόχος
          </button>
        </div>
      </div>

      {/* color legend — what every line / dot means across all panels */}
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-md border border-border bg-bg px-3 py-2 text-[11px]">
        <span className="font-semibold text-fg">Τι σημαίνει κάθε χρώμα:</span>
        <LegendItem color={COL.guess} label="μάτι — η εκτίμησή σου" />
        <LegendItem color={COL.corr} label="cross-correlation" />
        <LegendItem color={COL.truth} label="πραγματικός στόχος" />
        <LegendItem color={COL.pulse} label="ο γνωστός παλμός (template)" />
      </div>

      {/* transmitted pulse */}
      <Panel
        title="Ο παλμός που εκπέμπεις — x(t)"
        subtitle={pulseType === 'chirp' ? 'chirp: σάρωση συχνότητας' : 'tone: σταθερή συχνότητα'}
      >
        <canvas
          ref={transmittedRef}
          style={{ height: 84 }}
          className="block h-[84px] w-full"
          aria-label="Transmitted pulse waveform"
        />
      </Panel>

      {/* received signal */}
      <div className="mt-3">
        <Panel
          title="Τι γυρίζει πίσω — y(t) = ηχώ + θόρυβος"
          subtitle="κόκκινη γραμμή = η εκτίμησή σου · ρύθμισέ τη με το slider ↓"
        >
          <canvas
            ref={receivedRef}
            style={{ height: 184, touchAction: 'none', cursor: revealed ? 'default' : 'ew-resize' }}
            className="block h-[184px] w-full"
            aria-label="Received signal with buried echo"
          />
        </Panel>
      </div>

      {/* eyeball-guess slider — makes it obvious the red marker is movable */}
      <div className="mt-2 rounded-md border border-border bg-bg px-3 py-2">
        <label className="flex flex-wrap items-center gap-x-2 text-xs">
          <span
            className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: COL.guess }}
          />
          <span className="font-semibold" style={{ color: COL.guess }}>
            Η εκτίμησή σου με το μάτι
          </span>
          <span className="text-fg-muted">— πού νομίζεις ότι κρύβεται η ηχώ;</span>
          <span className="ml-auto font-mono tabular-nums text-fg">
            d̂ = {Math.round(guessDist)} m
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={Math.round(D_MAX)}
          step={5}
          value={Math.round(guessDist)}
          disabled={revealed}
          onChange={(e) => setGuessT((2 * Number(e.target.value)) / C)}
          aria-label="Eyeball range guess"
          className="mt-1.5 w-full disabled:opacity-40"
          style={{ accentColor: COL.guess }}
        />
      </div>

      {/* correlation curve */}
      <div className="mt-3">
        <Panel title="Ο συσχετιστής — R(τ)" subtitle="βρες την κορυφή = βρες την απόσταση">
          <canvas
            ref={corrRef}
            style={{ height: 168 }}
            className="block h-[168px] w-full"
            aria-label="Cross-correlation curve with peak"
          />
        </Panel>
      </div>

      {/* tactical top-down range view */}
      <div className="mt-3">
        <Panel
          title="Κάτοψη της θάλασσας — πού βρίσκεται ο στόχος;"
          subtitle="θέα από ψηλά · δεξιά = πιο μακριά"
        >
          <canvas
            ref={tacticalRef}
            style={{ height: 76 }}
            className="block h-[76px] w-full"
            aria-label="Top-down tactical range view"
          />
          <p className="mt-1 px-1 text-[10px] leading-snug text-fg-subtle">
            Σαν να κοιτάς τη θάλασσα από ψηλά: το <strong>🚢 πλοίο σου</strong> είναι αριστερά
            (απόσταση 0) και στέλνει το ping προς τα δεξιά. Κάθε κουκκίδα δείχνει σε πόση απόσταση
            λέει ο καθένας ότι είναι ο στόχος —{' '}
            <span style={{ color: COL.guess }}>μάτι</span>,{' '}
            <span style={{ color: COL.corr }}>cross-correlation</span>,{' '}
            <span style={{ color: COL.truth }}>πραγματικός στόχος</span>.
          </p>
        </Panel>
      </div>

      {/* readouts */}
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <ReadoutCard
          color={COL.guess}
          label="Με το μάτι"
          value={`${Math.round(guessDist)} m`}
          error={revealed ? guessDist - round.trueDist : null}
        />
        <ReadoutCard
          color={COL.corr}
          label="Cross-correlation"
          value={correlationShown ? `${Math.round(estDist)} m` : '—'}
          sub={correlationShown ? `τ = ${(estDelay * 1000).toFixed(0)} ms` : undefined}
          error={revealed && correlationShown ? estDist - round.trueDist : null}
        />
        <ReadoutCard
          color={COL.truth}
          label="Πραγματικός στόχος"
          value={revealed ? `${Math.round(round.trueDist)} m` : '???'}
          sub={revealed ? `τ = ${(round.trueDelay * 1000).toFixed(0)} ms` : undefined}
        />
      </div>

      {/* dynamic caption */}
      <p className="mt-3 rounded-md border border-border bg-bg px-3 py-2 text-xs leading-relaxed text-fg-muted">
        {!correlationShown ? (
          <>
            <strong className="text-fg">Έριξες ping.</strong> Η ηχώ είναι κάπου μέσα στο{' '}
            <span className="font-mono">y(t)</span> — αλλά με τόσο θόρυβο, μπορείς να την ξεχωρίσεις
            με το μάτι; Δοκίμασε (σύρε τον κόκκινο δείκτη), και μετά πάτησε{' '}
            <span style={{ color: COL.curve }} className="font-semibold">
              Τρέξε cross-correlation
            </span>
            .
          </>
        ) : !revealed ? (
          <>
            <strong style={{ color: COL.corr }}>Η κορυφή εμφανίστηκε.</strong> Η{' '}
            <span className="font-mono">R(τ)</span> λέει{' '}
            <span className="font-mono">d̂ = {Math.round(estDist)} m</span>, κι ας μην φαινόταν
            τίποτα στο πάνω panel. <strong className="text-fg">Σήκωσε τον θόρυβο</strong> και κοίτα:
            η ηχώ σβήνει από το <span className="font-mono">y(t)</span>, αλλά η κορυφή{' '}
            <em>μένει στη θέση της</em>. Αυτό είναι το processing gain — η συσχέτιση μαζεύει την
            ενέργεια του παλμού ενώ ο θόρυβος αλληλοεξουδετερώνεται.
          </>
        ) : (
          <>
            {(() => {
              const eyeErr = Math.abs(guessDist - round.trueDist)
              const corrErr = Math.abs(estDist - round.trueDist)
              const factor = corrErr > 0.5 ? eyeErr / corrErr : eyeErr / 0.5
              return (
                <>
                  <strong className="text-fg">Αποκάλυψη.</strong> Το μάτι έπεσε έξω{' '}
                  <span style={{ color: COL.guess }} className="font-semibold">
                    {Math.round(eyeErr)} m
                  </span>
                  · η συσχέτιση{' '}
                  <span style={{ color: COL.corr }} className="font-semibold">
                    {Math.round(corrErr)} m
                  </span>
                  {eyeErr > corrErr * 1.5 && corrErr < 60 ? (
                    <>
                      {' '}
                      — <strong style={{ color: COL.corr }}>~{Math.max(2, Math.round(factor))}×
                      ακριβέστερη</strong>. «Βρες την κορυφή» κέρδισε το «κοίτα προσεκτικά».
                    </>
                  ) : (
                    <>. Πάτησε «Νέος στόχος» και ξαναδοκίμασε — ανέβασε κι άλλο τον θόρυβο.</>
                  )}
                </>
              )
            })()}
          </>
        )}
      </p>

      {/* scoreboard */}
      {history.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 rounded-md border border-border bg-bg px-3 py-2 text-xs">
          <span className="font-semibold text-fg">Σκορ ({history.length} γύροι):</span>
          <span>
            μέσο <span style={{ color: COL.guess }}>|σφάλμα| ματιού</span> ={' '}
            <span className="font-mono tabular-nums">{Math.round(eyeAvg ?? 0)} m</span>
          </span>
          <span>
            μέσο <span style={{ color: COL.corr }}>|σφάλμα| συσχέτισης</span> ={' '}
            <span className="font-mono tabular-nums">{Math.round(corrAvg ?? 0)} m</span>
          </span>
          {eyeAvg != null && corrAvg != null && corrAvg > 0.5 && eyeAvg / corrAvg > 1.3 && (
            <span className="font-semibold" style={{ color: COL.corr }}>
              → {Math.round(eyeAvg / corrAvg)}× καλύτερη κατά μέσο όρο
            </span>
          )}
        </div>
      )}
    </figure>
  )
}

// ─── small presentational helpers ─────────────────────────────────────────
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
    <div className="rounded-md border border-border bg-bg p-2">
      <div className="mb-1 flex items-baseline justify-between gap-2 px-1">
        <span className="text-xs font-semibold tracking-tight">{title}</span>
        <span className="text-[10px] font-mono text-fg-subtle">{subtitle}</span>
      </div>
      {children}
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-fg-muted">
      <span
        className="inline-block h-2.5 w-3.5 shrink-0 rounded-sm"
        style={{ background: color }}
      />
      {label}
    </span>
  )
}

function ReadoutCard({
  color,
  label,
  value,
  sub,
  error,
}: {
  color: string
  label: string
  value: string
  sub?: string
  error?: number | null
}) {
  return (
    <div className="rounded-md border border-border bg-bg p-2">
      <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color }}>
        {label}
      </div>
      <div className="font-mono text-base font-semibold tabular-nums text-fg">{value}</div>
      {sub && <div className="font-mono text-[10px] text-fg-subtle">{sub}</div>}
      {error != null && (
        <div className="font-mono text-[10px] tabular-nums" style={{ color }}>
          {error >= 0 ? '+' : '−'}
          {Math.round(Math.abs(error))} m σφάλμα
        </div>
      )}
    </div>
  )
}

function easeInOut(p: number) {
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
}

// ─── canvas setup (local copy: also clears) ───────────────────────────────
function ready(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = Math.max(1, Math.floor(rect.width * dpr))
  canvas.height = Math.max(1, Math.floor(rect.height * dpr))
  const ctx = canvas.getContext('2d')!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, rect.width, rect.height)
  return { ctx, w: rect.width, h: rect.height }
}

// vertical marker with a label tag
function vMarker(
  ctx: CanvasRenderingContext2D,
  x: number,
  top: number,
  bottom: number,
  color: string,
  label: string,
  dash: boolean,
  labelY: number,
) {
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.setLineDash(dash ? [4, 3] : [])
  ctx.beginPath()
  ctx.moveTo(x, top)
  ctx.lineTo(x, bottom)
  ctx.stroke()
  ctx.setLineDash([])
  if (label) {
    ctx.font = '600 9px ui-sans-serif, system-ui, sans-serif'
    const tw = ctx.measureText(label).width
    const bx = Math.max(2, Math.min(x - tw / 2 - 3, ctx.canvas.clientWidth - tw - 6))
    ctx.fillStyle = color
    ctx.globalAlpha = 0.16
    ctx.fillRect(bx, labelY - 9, tw + 6, 12)
    ctx.globalAlpha = 1
    ctx.fillStyle = color
    ctx.fillText(label, bx + 3, labelY)
  }
}

// ─── draws ────────────────────────────────────────────────────────────────
function drawTransmitted(canvas: HTMLCanvasElement, colors: ThemeColors, tmpl: Float64Array) {
  const { ctx, w, h } = ready(canvas)
  const pad = 8
  const mid = h / 2
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(pad, mid)
  ctx.lineTo(w - pad, mid)
  ctx.stroke()

  // the pulse only occupies the first PULSE_DUR — zoom so it fills the panel
  const yScale = (h / 2 - 10) / 1.05
  ctx.strokeStyle = COL.pulse
  ctx.lineWidth = 1.8
  ctx.beginPath()
  for (let i = 0; i < PULSE_SAMPLES; i++) {
    const px = pad + (i / (PULSE_SAMPLES - 1)) * (w - 2 * pad)
    const py = mid - tmpl[i] * yScale
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText(`διάρκεια ${(PULSE_DUR * 1000).toFixed(0)} ms`, pad + 2, h - 6)
}

function drawReceived(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  s: Scene,
  progress: number,
  animating: boolean,
) {
  const { ctx, w, h } = ready(canvas)
  const pad = 14
  const mid = h / 2
  const YR = 3.6
  const yScale = (h / 2 - pad) / YR

  // baseline
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_L, mid)
  ctx.lineTo(w - PAD_R, mid)
  ctx.stroke()

  // received trace y(t)
  ctx.strokeStyle = colors.fgMuted
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let i = 0; i < N; i++) {
    const px = xOfDist(distOf(i * DT), w)
    const py = mid - s.y[i] * yScale
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // after reveal: trace the clean echo in amber so "there it was" is obvious
  if (s.revealed) {
    ctx.strokeStyle = COL.truth
    ctx.lineWidth = 2
    ctx.beginPath()
    let drawn = false
    for (let i = 0; i < N; i++) {
      if (s.cleanEcho[i] === 0) {
        drawn = false
        continue
      }
      const px = xOfDist(distOf(i * DT), w)
      const py = mid - s.cleanEcho[i] * yScale
      if (!drawn) {
        ctx.moveTo(px, py)
        drawn = true
      } else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }

  // during the sweep: blue template sliding across the trace at the current lag
  if (animating) {
    const lag = Math.round(progress * LAG_MAX)
    ctx.strokeStyle = COL.pulse
    ctx.globalAlpha = 0.9
    ctx.lineWidth = 1.8
    ctx.beginPath()
    for (let j = 0; j < PULSE_SAMPLES; j++) {
      const i = lag + j
      if (i >= N) break
      const px = xOfDist(distOf(i * DT), w)
      const py = mid - s.tmpl[j] * yScale
      if (j === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
    ctx.globalAlpha = 1
  }

  // markers: correlation estimate (green), then eyeball guess (red), then truth (amber)
  if (s.correlationShown && !animating) {
    vMarker(ctx, xOfDist(s.estDist, w), pad / 2, h - pad / 2, COL.corr, 'συσχέτιση', false, h - 4)
  }
  if (!s.revealed) {
    const gx = xOfDist(s.guessDist, w)
    vMarker(ctx, gx, pad / 2, h - pad / 2, COL.guess, 'μάτι', true, 12)
    // grab handle so the line reads as a draggable control
    ctx.fillStyle = COL.guess
    ctx.beginPath()
    ctx.moveTo(gx - 5, pad / 2 - 1)
    ctx.lineTo(gx + 5, pad / 2 - 1)
    ctx.lineTo(gx, pad / 2 + 6)
    ctx.closePath()
    ctx.fill()
  }
  if (s.revealed) {
    vMarker(ctx, xOfDist(s.trueDist, w), pad / 2, h - pad / 2, COL.truth, 'στόχος', false, 12)
  }

  // axis label
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('χρόνος / απόσταση →', PAD_L, h - 3)
}

function drawCorrelation(
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
  s: Scene,
  progress: number,
) {
  const { ctx, w, h } = ready(canvas)
  const pad = 16
  const base = h - 22 // R(τ) baseline near the bottom; peak grows upward
  const top = pad

  // distance gridlines + ticks
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  for (const d of [0, 150, 300, 450, 600]) {
    const px = xOfDist(d, w)
    ctx.strokeStyle = colors.border
    ctx.lineWidth = 1
    ctx.globalAlpha = d === 0 ? 1 : 0.5
    ctx.beginPath()
    ctx.moveTo(px, top)
    ctx.lineTo(px, base)
    ctx.stroke()
    ctx.globalAlpha = 1
    ctx.fillStyle = colors.fgSubtle
    ctx.fillText(`${d}`, px + 2, base + 12)
  }
  ctx.fillStyle = colors.fgSubtle
  ctx.fillText('m', w - PAD_R + 2, base + 12)

  const shown = s.correlationShown || progress > 0
  if (!shown) {
    ctx.fillStyle = colors.fgSubtle
    ctx.font = '11px ui-sans-serif, system-ui, sans-serif'
    ctx.fillText('πάτησε «Τρέξε cross-correlation» για να σαρώσεις όλες τις καθυστερήσεις…', PAD_L, (top + base) / 2)
    return
  }

  const sweepLag = s.correlationShown && progress >= 1 ? LAG_MAX : Math.round(progress * LAG_MAX)
  const amp = (base - top) / (s.corrMax * 1.08)

  // curve up to the current sweep lag
  ctx.strokeStyle = COL.curve
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let L = 0; L <= sweepLag; L++) {
    const px = xOfDist(distOf(L * DT), w)
    const py = base - s.corr[L] * amp
    if (L === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // sweep cursor while animating
  if (!(s.correlationShown && progress >= 1)) {
    const px = xOfDist(distOf(sweepLag * DT), w)
    ctx.strokeStyle = colors.fgSubtle
    ctx.setLineDash([3, 3])
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(px, top)
    ctx.lineTo(px, base)
    ctx.stroke()
    ctx.setLineDash([])
  }

  // peak marker once the sweep is complete
  if (s.correlationShown && progress >= 1) {
    const px = xOfDist(s.estDist, w)
    const peakVal = Math.max(...s.corr)
    const py = base - peakVal * amp
    vMarker(ctx, px, top, base, COL.corr, '', false, base)
    ctx.fillStyle = COL.corr
    ctx.beginPath()
    ctx.arc(px, py, 4.5, 0, 2 * Math.PI)
    ctx.fill()
    ctx.font = '600 10px ui-sans-serif, system-ui, sans-serif'
    const lbl = `κορυφή → ${Math.round(s.estDist)} m`
    const tw = ctx.measureText(lbl).width
    const lx = Math.min(px + 6, w - PAD_R - tw)
    ctx.fillText(lbl, lx, py - 6)
  }

  // truth line after reveal
  if (s.revealed) {
    vMarker(ctx, xOfDist(s.trueDist, w), top, base, COL.truth, 'στόχος', false, top + 9)
  }

  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('R(τ)', PAD_L - 2, top + 2)
}

function drawTactical(canvas: HTMLCanvasElement, colors: ThemeColors, s: Scene, progress: number) {
  const { ctx, w, h } = ready(canvas)
  const lane = h / 2 - 4

  // range lane
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD_L, lane)
  ctx.lineTo(w - PAD_R, lane)
  ctx.stroke()
  // range ticks
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = colors.fgSubtle
  for (const d of [0, 150, 300, 450, 600]) {
    const px = xOfDist(d, w)
    ctx.beginPath()
    ctx.moveTo(px, lane - 3)
    ctx.lineTo(px, lane + 3)
    ctx.stroke()
    ctx.fillText(`${d}`, px + 2, lane + 15)
  }

  // ship at range 0 = you, the operator
  const shipX = xOfDist(0, w)
  ctx.font = '15px ui-sans-serif, system-ui, sans-serif'
  ctx.fillText('🚢', shipX - 4, lane + 5)
  ctx.font = '600 9px ui-sans-serif, system-ui, sans-serif'
  ctx.fillStyle = colors.fgMuted
  ctx.fillText('εσύ', shipX - 1, lane - 9)

  const blip = (d: number, color: string, label: string, up: boolean) => {
    const px = xOfDist(d, w)
    const cy = up ? lane - 11 : lane + 11
    // tick from lane
    ctx.strokeStyle = color
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(px, lane)
    ctx.lineTo(px, cy)
    ctx.stroke()
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(px, cy, 4, 0, 2 * Math.PI)
    ctx.fill()
    ctx.font = '600 9px ui-sans-serif, system-ui, sans-serif'
    const tw = ctx.measureText(label).width
    ctx.fillText(label, Math.min(px + 6, w - PAD_R - tw), cy + 3)
  }

  if (s.revealed) blip(s.trueDist, COL.truth, 'στόχος', true)
  if (s.correlationShown && (!s.revealed || progress >= 1)) blip(s.estDist, COL.corr, 'συσχέτιση', s.revealed)
  if (!s.revealed) blip(s.guessDist, COL.guess, 'μάτι', false)
}
