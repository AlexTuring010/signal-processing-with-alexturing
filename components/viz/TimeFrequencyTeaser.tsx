'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, AlertCircle, Loader2 } from 'lucide-react'
import { magnitudeSpectrum } from '@/lib/fft'

const AUDIO_SRC = '/audio/intro-speech.mp3'
const COSINE_HZ = 500
/** How much of a single window we use for the FFT (samples). */
const FFT_SIZE = 4096
/** Up to this Hz we plot in the spectrum (anything above is folded away). */
const MAX_DISPLAY_HZ = 4000
/** Amplitude of the added cosine, relative to the audio peak. */
const COSINE_AMP = 0.4

type AudioState =
  | { status: 'loading' }
  | { status: 'error'; reason: string }
  | { status: 'ready'; samples: Float32Array; sampleRate: number }

export function TimeFrequencyTeaser() {
  const [audio, setAudio] = useState<AudioState>({ status: 'loading' })
  const [showCosine, setShowCosine] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioElRef = useRef<HTMLAudioElement | null>(null)

  const timeCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const freqCanvasRef = useRef<HTMLCanvasElement | null>(null)

  // Decode audio once on mount.
  useEffect(() => {
    let cancelled = false
    const Ctx =
      typeof window !== 'undefined'
        ? (window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext })
              .webkitAudioContext)
        : null
    if (!Ctx) {
      setAudio({ status: 'error', reason: 'Ο browser δεν υποστηρίζει Web Audio.' })
      return
    }
    const ctx = new Ctx()
    fetch(AUDIO_SRC)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.arrayBuffer()
      })
      .then((buf) => ctx.decodeAudioData(buf))
      .then((decoded) => {
        if (cancelled) return
        const channel = decoded.getChannelData(0)
        // Copy to a normal Float32Array we own (decoded buffers are read-only sometimes).
        const samples = new Float32Array(channel)
        // Normalize to peak = 1 so subsequent +cosine math stays well-scaled.
        let peak = 0
        for (let i = 0; i < samples.length; i++) {
          const a = Math.abs(samples[i])
          if (a > peak) peak = a
        }
        if (peak > 0) {
          for (let i = 0; i < samples.length; i++) samples[i] /= peak
        }
        setAudio({ status: 'ready', samples, sampleRate: decoded.sampleRate })
      })
      .catch(() => {
        if (cancelled) return
        setAudio({
          status: 'error',
          reason: 'Δεν βρέθηκε το audio sample. Σύντομα έρχεται.',
        })
      })
      .finally(() => {
        ctx.close().catch(() => {})
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Build the displayed waveform (optionally with the added cosine).
  const waveform = useMemo(() => {
    if (audio.status !== 'ready') return null
    const { samples, sampleRate } = audio
    const out = new Float32Array(samples.length)
    if (showCosine) {
      const k = (2 * Math.PI * COSINE_HZ) / sampleRate
      for (let i = 0; i < samples.length; i++) {
        out[i] = samples[i] + COSINE_AMP * Math.cos(k * i)
      }
    } else {
      out.set(samples)
    }
    return out
  }, [audio, showCosine])

  // Build the spectrum from the steady-state middle of the audio.
  const spectrum = useMemo(() => {
    if (audio.status !== 'ready' || !waveform) return null
    const { sampleRate } = audio
    const fftSize = Math.min(FFT_SIZE, prevPow2(waveform.length))
    if (fftSize < 64) return null
    const start = Math.max(0, Math.floor((waveform.length - fftSize) / 2))
    const slice = waveform.subarray(start, start + fftSize)
    const mag = magnitudeSpectrum(slice)
    // Normalize for display.
    let peak = 1e-9
    for (let i = 0; i < mag.length; i++) if (mag[i] > peak) peak = mag[i]
    const display = new Float32Array(mag.length)
    for (let i = 0; i < mag.length; i++) display[i] = mag[i] / peak
    return { mag: display, sampleRate, binCount: mag.length, fftSize }
  }, [waveform, audio])

  // Render time-domain canvas.
  useEffect(() => {
    const canvas = timeCanvasRef.current
    if (!canvas || !waveform) return
    drawWaveform(canvas, waveform)
  }, [waveform])

  // Render spectrum canvas.
  useEffect(() => {
    const canvas = freqCanvasRef.current
    if (!canvas || !spectrum) return
    drawSpectrum(canvas, spectrum.mag, spectrum.sampleRate, spectrum.binCount)
  }, [spectrum])

  // Audio element lifecycle.
  useEffect(() => {
    const el = audioElRef.current
    if (!el) return
    const onEnd = () => setIsPlaying(false)
    el.addEventListener('ended', onEnd)
    el.addEventListener('pause', onEnd)
    return () => {
      el.removeEventListener('ended', onEnd)
      el.removeEventListener('pause', onEnd)
    }
  }, [])

  const togglePlay = async () => {
    const el = audioElRef.current
    if (!el) return
    if (isPlaying) {
      el.pause()
      setIsPlaying(false)
    } else {
      try {
        await el.play()
        setIsPlaying(true)
      } catch {
        // ignore — likely autoplay blocked
      }
    }
  }

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Ένα σήμα · δύο φακοί
        </h4>

        {audio.status === 'ready' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg"
              aria-label={isPlaying ? 'Παύση' : 'Παίξε το audio'}
            >
              {isPlaying ? (
                <Pause className="h-3.5 w-3.5" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              {isPlaying ? 'Παύση' : 'Άκου το'}
            </button>

            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-bg-soft px-3 py-1 text-xs hover:border-accent/50 hover:text-fg">
              <input
                type="checkbox"
                checked={showCosine}
                onChange={(e) => setShowCosine(e.target.checked)}
                className="h-3 w-3 accent-[rgb(var(--accent))]"
              />
              + 500 Hz cosine
            </label>
          </div>
        )}
      </div>

      <audio ref={audioElRef} src={AUDIO_SRC} preload="auto" />

      <div className="grid gap-3 md:grid-cols-2">
        <PlotPanel
          title="Στον χρόνο"
          subtitle="Τι θα μετρούσε ένα μικρόφωνο στιγμή με στιγμή"
        >
          {audio.status === 'loading' && <PlotPlaceholder loading />}
          {audio.status === 'error' && <PlotPlaceholder error={audio.reason} />}
          {audio.status === 'ready' && (
            <canvas
              ref={timeCanvasRef}
              width={600}
              height={180}
              className="block h-[180px] w-full"
              aria-label="Time-domain waveform"
            />
          )}
          <PlotAxisCaption left="t = 0" right="t = τέλος" />
        </PlotPanel>

        <PlotPanel
          title="Στη συχνότητα"
          subtitle="Πόσο «ζυγίζει» κάθε συχνότητα μέσα στο σήμα"
        >
          {audio.status === 'loading' && <PlotPlaceholder loading />}
          {audio.status === 'error' && <PlotPlaceholder error={audio.reason} />}
          {audio.status === 'ready' && (
            <canvas
              ref={freqCanvasRef}
              width={600}
              height={180}
              className="block h-[180px] w-full"
              aria-label="Frequency-domain magnitude spectrum"
            />
          )}
          <PlotAxisCaption
            left="0 Hz"
            right={`${MAX_DISPLAY_HZ / 1000} kHz`}
            highlight={showCosine ? '500 Hz' : undefined}
          />
        </PlotPanel>
      </div>

      <p className="mt-3 text-xs text-fg-muted">
        Παρατήρησε ότι ένα καθαρό cosine βγάζει ένα <strong>«καρφί»</strong> στη
        συχνότητα. Θα δούμε γιατί στο επόμενο κεφάλαιο. Η συχνότητα δεν είναι
        κάτι που «υπάρχει» στον χρόνο — είναι ένας <em>διαφορετικός φακός</em>{' '}
        για να κοιτάξεις το ίδιο σήμα.
      </p>
    </figure>
  )
}

/* ------------------------- Sub-components ------------------------- */

function PlotPanel({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/60">
      <div className="border-b border-border bg-bg-soft px-3 py-2">
        <div className="text-xs font-semibold tracking-tight text-fg">{title}</div>
        <div className="text-[11px] text-fg-muted">{subtitle}</div>
      </div>
      <div>{children}</div>
    </div>
  )
}

function PlotPlaceholder({
  loading,
  error,
}: {
  loading?: boolean
  error?: string
}) {
  return (
    <div className="flex h-[180px] items-center justify-center">
      {loading && (
        <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> Φόρτωση δείγματος...
        </span>
      )}
      {error && (
        <span className="inline-flex items-center gap-1.5 px-3 text-center text-xs text-fg-muted">
          <AlertCircle className="h-4 w-4 shrink-0 text-warn" /> {error}
        </span>
      )}
    </div>
  )
}

function PlotAxisCaption({
  left,
  right,
  highlight,
}: {
  left: string
  right: string
  highlight?: string
}) {
  return (
    <div className="flex items-center justify-between border-t border-border bg-bg-soft px-3 py-1 text-[10px] tabular-nums text-fg-subtle">
      <span>{left}</span>
      {highlight && <span className="text-accent">↑ {highlight}</span>}
      <span>{right}</span>
    </div>
  )
}

/* ------------------------- Drawing helpers ------------------------- */

function getColors() {
  if (typeof window === 'undefined') return null
  const root = getComputedStyle(document.documentElement)
  const fg = `rgb(${root.getPropertyValue('--fg').trim() || '15 23 42'})`
  const fgMuted = `rgb(${root.getPropertyValue('--fg-muted').trim() || '71 85 105'})`
  const accent = `rgb(${root.getPropertyValue('--accent').trim() || '29 78 216'})`
  const border = `rgb(${root.getPropertyValue('--border').trim() || '226 232 240'})`
  return { fg, fgMuted, accent, border }
}

function setupCanvas(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)
  return { ctx, w: rect.width, h: rect.height }
}

function drawWaveform(canvas: HTMLCanvasElement, samples: Float32Array) {
  const colors = getColors()
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  // Center axis
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, h / 2)
  ctx.lineTo(w, h / 2)
  ctx.stroke()

  // Waveform — use min/max per pixel for a clean envelope look.
  const stride = Math.max(1, Math.floor(samples.length / w))
  const padding = 8
  const halfH = (h - padding * 2) / 2
  ctx.strokeStyle = colors.accent
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let x = 0; x < w; x++) {
    let min = 1
    let max = -1
    const start = x * stride
    const end = Math.min(start + stride, samples.length)
    for (let i = start; i < end; i++) {
      const v = samples[i]
      if (v < min) min = v
      if (v > max) max = v
    }
    // Clamp to [-1.4, 1.4] visually so cosine doesn't push past the canvas.
    const yMin = h / 2 - Math.max(-1.4, Math.min(1.4, max)) * halfH
    const yMax = h / 2 - Math.max(-1.4, Math.min(1.4, min)) * halfH
    ctx.moveTo(x + 0.5, yMin)
    ctx.lineTo(x + 0.5, yMax)
  }
  ctx.stroke()
}

function drawSpectrum(
  canvas: HTMLCanvasElement,
  mag: Float32Array,
  sampleRate: number,
  binCount: number,
) {
  const colors = getColors()
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const padding = 8
  const plotH = h - padding * 2
  const baselineY = h - padding

  // Subtle gridlines at 500 Hz, 1k, 2k, 3k, 4k
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  for (const f of [500, 1000, 2000, 3000, 4000]) {
    const x = (f / MAX_DISPLAY_HZ) * w
    ctx.beginPath()
    ctx.moveTo(x, padding)
    ctx.lineTo(x, baselineY)
    ctx.stroke()
    ctx.fillText(`${f >= 1000 ? `${f / 1000}k` : f}`, x, baselineY + 9)
  }

  // Compute how many bins fit in MAX_DISPLAY_HZ
  const nyquist = sampleRate / 2
  const cutoffBin = Math.min(binCount, Math.ceil((MAX_DISPLAY_HZ / nyquist) * binCount))
  if (cutoffBin <= 1) return

  // Bars
  ctx.fillStyle = colors.accent
  for (let i = 0; i < cutoffBin; i++) {
    const x = (i / cutoffBin) * w
    const xNext = ((i + 1) / cutoffBin) * w
    const barW = Math.max(1, xNext - x - 0.5)
    const v = Math.max(0, Math.min(1, mag[i]))
    const barH = v * plotH
    ctx.fillRect(x, baselineY - barH, barW, barH)
  }

  // Baseline
  ctx.strokeStyle = colors.fgMuted
  ctx.beginPath()
  ctx.moveTo(0, baselineY)
  ctx.lineTo(w, baselineY)
  ctx.stroke()
}

function prevPow2(n: number): number {
  let p = 1
  while ((p << 1) <= n) p <<= 1
  return p
}
