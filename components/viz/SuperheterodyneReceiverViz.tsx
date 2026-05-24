'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * Superheterodyne receiver — how a radio actually picks ONE station out of
 * many FDM-multiplexed channels.
 *
 * The student selects one of four AM stations (540, 720, 1000, 1400 kHz —
 * real medium-wave channels). The viz then computes the local-oscillator
 * frequency f_LO = f_target + 455 kHz (high-side injection, the standard
 * AM-receiver convention with IF = 455 kHz) and shows three vertical panels:
 *
 *   (1) Antenna input — all four channels visible (real medium-wave
 *       multiplexed spectrum)
 *   (2) After mixer: each channel shifted by ±f_LO. Sums and differences
 *       create images, but only the target lands at the IF.
 *   (3) After the IF filter (narrow BPF around 455 kHz): only the target
 *       channel survives, regardless of which station was picked. Same
 *       demodulator handles all of them.
 *
 * Punchline: tuning a radio = changing f_LO. The IF filter is fixed and
 * narrow (easy to build with high-Q components). The demodulator runs at
 * fixed IF. THIS is why the architecture won.
 *
 * Below the panels: a compact block-diagram strip showing the chain
 * (antenna → RF amp → mixer → IF filter → demod → audio amp).
 */

type StationId = 0 | 1 | 2 | 3

const STATIONS = [
  { id: 0 as StationId, fc: 540, label: '540 kHz · "BBC"' },
  { id: 1 as StationId, fc: 720, label: '720 kHz · "Reuters"' },
  { id: 2 as StationId, fc: 1000, label: '1000 kHz · "ΕΡΤ"' },
  { id: 3 as StationId, fc: 1400, label: '1400 kHz · "Sport FM"' },
]
const W_AUDIO = 5 // station bandwidth (one-sided) kHz; 2W = 10 kHz matches AM spec
const IF_KHZ = 455 // standard medium-wave IF

const COLOR_STATION = [
  'rgb(29, 78, 216)', // blue
  'rgb(217, 119, 6)', // amber
  'rgb(22, 163, 74)', // green
  'rgb(168, 85, 247)', // violet
]
const FILL_STATION = [
  'rgba(29, 78, 216, 0.32)',
  'rgba(217, 119, 6, 0.32)',
  'rgba(22, 163, 74, 0.32)',
  'rgba(168, 85, 247, 0.32)',
]
const COLOR_IF = 'rgb(220, 38, 38)'

export function SuperheterodyneReceiverViz() {
  const [selected, setSelected] = useState<StationId>(2)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const targetFc = STATIONS[selected].fc
  const fLo = targetFc + IF_KHZ // high-side injection

  useEffect(() => {
    const canvas = canvasRef.current
    const colors = getThemeColors()
    if (canvas && colors) drawScene(canvas, colors, selected, fLo)
  }, [selected, fLo])

  useEffect(() => {
    const onResize = () => {
      const canvas = canvasRef.current
      const colors = getThemeColors()
      if (canvas && colors) drawScene(canvas, colors, selected, fLo)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [selected, fLo])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Superheterodyne — πώς διαλέγει ο δέκτης ένα κανάλι από τέσσερα
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Τέσσερις σταθμοί medium-wave στους 540, 720, 1000, 1400 kHz. Διάλεξε
        σταθμό — ο τοπικός ταλαντωτής (LO) ρυθμίζεται αυτόματα. Ο μίκτης μετατοπίζει
        όλους τους σταθμούς, αλλά μόνο ένας πέφτει ΑΚΡΙΒΩΣ στην <strong>Intermediate
        Frequency (IF) = 455 kHz</strong>. Το στενό IF φίλτρο (σταθερό, δύσκολο
        αν ήταν tunable) αφήνει να περάσει μόνο αυτός. <em>Tuning = αλλάζω το{' '}
        f<sub>LO</sub>, ΟΧΙ το φίλτρο.</em>
      </p>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-fg-muted">Επιλεγμένος σταθμός:</span>
        <div
          role="radiogroup"
          aria-label="Tuned station"
          className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-bg-soft p-0.5 text-[11px]"
        >
          {STATIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={selected === s.id}
              onClick={() => setSelected(s.id)}
              className={cn(
                'rounded-full px-2.5 py-0.5 transition-colors',
                selected === s.id
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:text-fg',
              )}
              style={
                selected === s.id
                  ? undefined
                  : { color: COLOR_STATION[s.id] }
              }
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        style={{ height: 340 }}
        className="block h-[340px] w-full rounded-md border border-border bg-bg-soft/30"
        aria-label="Superheterodyne receiver: three spectrum panels showing antenna input, post-mixer, and IF-filtered output"
      />

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        <strong>f<sub>LO</sub> για αυτόν τον σταθμό:</strong>{' '}
        <span className="font-mono">f<sub>LO</sub> = f<sub>target</sub> + IF = {targetFc} + {IF_KHZ} = {fLo} kHz</span>
        {' '}(high-side injection).{' '}
        Όταν αυτός ο σταθμός πολλαπλασιαστεί με <span className="font-mono">cos(2π f<sub>LO</sub> t)</span>,
        μετατοπίζεται κατά ±{fLo} kHz — η ζώνη γύρω από <span className="font-mono">f<sub>LO</sub> − f<sub>target</sub> = {IF_KHZ}</span> kHz
        είναι ακριβώς αυτό που περνά από το IF φίλτρο.
      </div>
    </figure>
  )
}

function drawScene(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  selected: StationId,
  fLo: number,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const PAD_X = 36
  const PAD_TOP = 12
  const PAD_BOT = 14
  const panelGap = 6
  const panelH = (h - PAD_TOP - PAD_BOT - 2 * panelGap) / 3
  const panelTops = [PAD_TOP, PAD_TOP + panelH + panelGap, PAD_TOP + 2 * (panelH + panelGap)]

  // Panel 1: Antenna input — RF range covers all stations
  drawPanel(ctx, colors, panelTops[0], panelH, w, PAD_X, 'Είσοδος κεραίας: όλοι οι σταθμοί στο φάσμα MW (kHz)', () => {
    drawAntennaInput(ctx, colors, panelTops[0], panelH, w, PAD_X, selected)
  })

  // Panel 2: After mixer — each station gets shifted by ±f_LO
  // The "useful" copies are at |f - f_LO| (low-side) — only the target lands at +IF.
  drawPanel(ctx, colors, panelTops[1], panelH, w, PAD_X, `Μετά τον μίκτη (×cos(2π f_LO t), f_LO = ${fLo} kHz): κάθε σταθμός εμφανίζεται στο ±(f − f_LO)`, () => {
    drawMixerOutput(ctx, colors, panelTops[1], panelH, w, PAD_X, selected, fLo)
  })

  // Panel 3: After IF filter (455 kHz, narrow): only the target survives
  drawPanel(ctx, colors, panelTops[2], panelH, w, PAD_X, 'Έξοδος IF φίλτρου (στενό BPF γύρω από 455 kHz): μόνο ο επιλεγμένος σταθμός', () => {
    drawIfOutput(ctx, colors, panelTops[2], panelH, w, PAD_X, selected)
  })
}

function drawPanel(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  yTop: number,
  panelH: number,
  w: number,
  padX: number,
  title: string,
  body: () => void,
) {
  if (!colors) return
  ctx.fillStyle = 'rgba(100, 116, 139, 0.05)'
  ctx.fillRect(18, yTop, w - 36, panelH)
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.strokeRect(18, yTop, w - 36, panelH)
  ctx.fillStyle = colors.fgMuted
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(title, 24, yTop + 11)
  body()
}

function drawAntennaInput(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  yTop: number,
  panelH: number,
  w: number,
  padX: number,
  selected: StationId,
) {
  if (!colors) return
  // X axis: 0 to 1600 kHz (covers all MW stations plus a margin)
  const fMin = 0
  const fMax = 1600
  const xt = (f: number) => lerp(f, fMin, fMax, padX, w - padX)
  const yAxis = yTop + panelH - 22

  drawAxisWithTicks(ctx, colors, xt, yAxis, fMin, fMax, [0, 500, 1000, 1500], 'f (kHz)')

  STATIONS.forEach((s, i) => {
    const isSelected = i === selected
    const height = isSelected ? 0.95 : 0.65
    drawAmStation(
      ctx,
      xt,
      yTop + 18,
      yAxis,
      s.fc,
      W_AUDIO,
      height,
      COLOR_STATION[i],
      FILL_STATION[i],
      isSelected,
    )
    // Label
    ctx.fillStyle = COLOR_STATION[i]
    ctx.font = isSelected
      ? 'bold 9px ui-sans-serif, system-ui, sans-serif'
      : '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${s.fc}`, xt(s.fc), yAxis + 10)
  })
}

function drawMixerOutput(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  yTop: number,
  panelH: number,
  w: number,
  padX: number,
  selected: StationId,
  fLo: number,
) {
  if (!colors) return
  // After mixing with cos(2π f_LO t), each station at f_c produces two
  // copies in the positive half: at |f_c - f_LO| and at f_c + f_LO.
  // We focus on the low-side copies (the high-side copies are far above,
  // get rejected by the IF filter anyway).
  // X axis: 0 to ~2000 kHz to show both clusters
  const fMin = 0
  const fMax = 2200
  const xt = (f: number) => lerp(f, fMin, fMax, padX, w - padX)
  const yAxis = yTop + panelH - 22

  drawAxisWithTicks(ctx, colors, xt, yAxis, fMin, fMax, [0, 455, 1000, 1500, 2000], 'f (kHz)')

  // Mark IF window (narrow band around 455 kHz)
  const ifBandHalf = 6 // ±6 kHz around 455
  ctx.fillStyle = 'rgba(220, 38, 38, 0.10)'
  ctx.fillRect(xt(IF_KHZ - ifBandHalf), yTop + 16, xt(IF_KHZ + ifBandHalf) - xt(IF_KHZ - ifBandHalf), yAxis - yTop - 16)
  ctx.strokeStyle = COLOR_IF
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xt(IF_KHZ), yTop + 16)
  ctx.lineTo(xt(IF_KHZ), yAxis)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.fillStyle = COLOR_IF
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('IF', xt(IF_KHZ), yTop + 14)

  // Draw each station's low-side mixer output: at |f_c - f_LO|
  STATIONS.forEach((s, i) => {
    const fOut = Math.abs(s.fc - fLo)
    const isSelected = i === selected
    const height = isSelected ? 0.95 : 0.55
    // half-amplitude relative to input (mixer split) — but the visual is
    // about position, not amplitude
    drawAmStation(
      ctx,
      xt,
      yTop + 18,
      yAxis,
      fOut,
      W_AUDIO,
      height * 0.7,
      COLOR_STATION[i],
      FILL_STATION[i],
      isSelected,
    )
    ctx.fillStyle = COLOR_STATION[i]
    ctx.font = isSelected
      ? 'bold 9px ui-sans-serif, system-ui, sans-serif'
      : '9px ui-sans-serif, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${fOut}`, xt(fOut), yAxis + 10)
  })

  // Also show the high-side sum images (way to the right) faintly
  STATIONS.forEach((s, i) => {
    const fOut = s.fc + fLo
    if (fOut > fMax) return
    drawAmStation(
      ctx,
      xt,
      yTop + 18,
      yAxis,
      fOut,
      W_AUDIO,
      0.35,
      COLOR_STATION[i],
      FILL_STATION[i],
      false,
    )
  })
}

function drawIfOutput(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  yTop: number,
  panelH: number,
  w: number,
  padX: number,
  selected: StationId,
) {
  if (!colors) return
  // X axis: focus on the IF window
  const fMin = 0
  const fMax = 1000
  const xt = (f: number) => lerp(f, fMin, fMax, padX, w - padX)
  const yAxis = yTop + panelH - 22

  drawAxisWithTicks(ctx, colors, xt, yAxis, fMin, fMax, [0, 455, 1000], 'f (kHz)')

  // IF passband box
  const ifBandHalf = 6
  ctx.fillStyle = 'rgba(220, 38, 38, 0.06)'
  ctx.fillRect(xt(IF_KHZ - ifBandHalf), yTop + 16, xt(IF_KHZ + ifBandHalf) - xt(IF_KHZ - ifBandHalf), yAxis - yTop - 16)
  ctx.strokeStyle = COLOR_IF
  ctx.setLineDash([3, 3])
  ctx.lineWidth = 1
  ctx.strokeRect(xt(IF_KHZ - ifBandHalf), yTop + 16, xt(IF_KHZ + ifBandHalf) - xt(IF_KHZ - ifBandHalf), yAxis - yTop - 16)
  ctx.setLineDash([])
  ctx.fillStyle = COLOR_IF
  ctx.font = '9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('IF passband (~455 ± 6 kHz)', xt(IF_KHZ), yTop + 14)

  // Only the selected station survives at IF
  drawAmStation(
    ctx,
    xt,
    yTop + 18,
    yAxis,
    IF_KHZ,
    W_AUDIO,
    0.95,
    COLOR_STATION[selected],
    FILL_STATION[selected],
    true,
  )
  ctx.fillStyle = COLOR_STATION[selected]
  ctx.font = 'bold 9px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(`${STATIONS[selected].label} → στο IF`, xt(IF_KHZ), yAxis + 10)
}

function drawAxisWithTicks(
  ctx: CanvasRenderingContext2D,
  colors: ReturnType<typeof getThemeColors>,
  xt: (f: number) => number,
  yAxis: number,
  fMin: number,
  fMax: number,
  ticks: number[],
  axisLabel: string,
) {
  if (!colors) return
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(xt(fMin), yAxis)
  ctx.lineTo(xt(fMax), yAxis)
  ctx.stroke()
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '8px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ticks.forEach((t) => {
    ctx.beginPath()
    ctx.moveTo(xt(t), yAxis)
    ctx.lineTo(xt(t), yAxis + 3)
    ctx.stroke()
  })
  ctx.textAlign = 'right'
  ctx.fillText(axisLabel, xt(fMax) - 2, yAxis - 2)
}

/**
 * Draws a stylised AM-station spectrum: a carrier spike at f_c with two
 * triangular sidebands (LSB at f_c - W and USB at f_c + W). Captures the
 * Conventional-AM character so students can recognise the shape.
 */
function drawAmStation(
  ctx: CanvasRenderingContext2D,
  xt: (f: number) => number,
  yTopUsable: number,
  yAxis: number,
  fc: number,
  W: number,
  height: number,
  stroke: string,
  fill: string,
  highlight: boolean,
) {
  const fullH = yAxis - yTopUsable
  // Both sidebands as triangles
  ctx.fillStyle = fill
  ctx.strokeStyle = stroke
  ctx.lineWidth = highlight ? 1.6 : 1.2
  ctx.beginPath()
  ctx.moveTo(xt(fc - W), yAxis)
  ctx.lineTo(xt(fc), yAxis - height * fullH * 0.55)
  ctx.lineTo(xt(fc + W), yAxis)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  // Carrier spike
  ctx.strokeStyle = stroke
  ctx.lineWidth = highlight ? 2.5 : 1.8
  ctx.beginPath()
  ctx.moveTo(xt(fc), yAxis)
  ctx.lineTo(xt(fc), yAxis - height * fullH)
  ctx.stroke()
  if (highlight) {
    ctx.fillStyle = stroke
    ctx.beginPath()
    ctx.arc(xt(fc), yAxis - height * fullH, 2.5, 0, Math.PI * 2)
    ctx.fill()
  }
}
