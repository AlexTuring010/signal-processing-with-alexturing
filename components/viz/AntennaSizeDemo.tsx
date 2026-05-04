'use client'

import { useState, useMemo } from 'react'

const SPEED_OF_LIGHT = 3e8 // m/s

type Reference = { size: number; emoji: string; label: string; span: string }

/** Reference objects sorted from smallest to largest, in meters. */
const REFERENCES: Reference[] = [
  { size: 0.001, emoji: '·', label: 'σπυρί άμμου', span: '~1 mm' },
  { size: 0.025, emoji: '🪙', label: 'κέρμα', span: '~2.5 cm' },
  { size: 0.15, emoji: '📱', label: 'κινητό', span: '~15 cm' },
  { size: 1.7, emoji: '🧍', label: 'άνθρωπος', span: '~1.7 m' },
  { size: 10, emoji: '🏠', label: 'σπίτι', span: '~10 m' },
  { size: 100, emoji: '🏢', label: 'πολυκατοικία', span: '~100 m' },
  { size: 828, emoji: '🗼', label: 'Burj Khalifa', span: '828 m' },
  { size: 5000, emoji: '🏔️', label: 'Όλυμπος', span: '~5 km' },
  { size: 100000, emoji: '🌆', label: 'πόλη', span: '~100 km' },
]

type Preset = { label: string; f: number; note: string }
const PRESETS: Preset[] = [
  { label: 'Ομιλία', f: 1e3, note: '1 kHz — μέσα στην ομιλία μας' },
  { label: 'AM ραδιόφωνο', f: 1e6, note: '1 MHz — π.χ. ΕΡΑ Πρώτο' },
  { label: 'FM ραδιόφωνο', f: 1e8, note: '100 MHz — π.χ. Best 92.6' },
  { label: 'Wi-Fi', f: 2.4e9, note: '2.4 GHz' },
  { label: '5G mmWave', f: 6e10, note: '60 GHz' },
]

function formatLength(meters: number): { value: string; unit: string } {
  if (meters >= 1000) return { value: (meters / 1000).toFixed(1), unit: 'km' }
  if (meters >= 1) return { value: meters.toFixed(2), unit: 'm' }
  if (meters >= 0.01) return { value: (meters * 100).toFixed(1), unit: 'cm' }
  return { value: (meters * 1000).toFixed(2), unit: 'mm' }
}

function formatFreq(hz: number): { value: string; unit: string } {
  if (hz >= 1e9) return { value: (hz / 1e9).toFixed(2), unit: 'GHz' }
  if (hz >= 1e6) return { value: (hz / 1e6).toFixed(2), unit: 'MHz' }
  if (hz >= 1e3) return { value: (hz / 1e3).toFixed(2), unit: 'kHz' }
  return { value: hz.toFixed(0), unit: 'Hz' }
}

/** Slider works in log10(Hz). Range: 100 Hz (10^2) to 100 GHz (10^11). */
const LOG_MIN = 2
const LOG_MAX = 11

export function AntennaSizeDemo() {
  const [logF, setLogF] = useState(8) // 100 MHz default
  const f = Math.pow(10, logF)
  const lambdaQuarter = SPEED_OF_LIGHT / (4 * f)

  const closestRef = useMemo(() => {
    let best = REFERENCES[0]
    let bestDiff = Math.abs(Math.log10(best.size) - Math.log10(lambdaQuarter))
    for (const r of REFERENCES) {
      const d = Math.abs(Math.log10(r.size) - Math.log10(lambdaQuarter))
      if (d < bestDiff) {
        best = r
        bestDiff = d
      }
    }
    return best
  }, [lambdaQuarter])

  const len = formatLength(lambdaQuarter)
  const freq = formatFreq(f)

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="text-sm font-semibold tracking-tight">
        Πόσο μακριά πρέπει να είναι μια κεραία;
      </h4>
      <p className="mt-1 text-xs text-fg-muted">
        Πιο αποδοτική κεραία ≈ {' '}
        <span className="font-mono">λ/4 = c / (4f)</span>. Σύρε τη συχνότητα και
        δες πώς αλλάζει.
      </p>

      {/* Big readout */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-md border border-border bg-bg-soft px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
            Συχνότητα
          </div>
          <div className="mt-0.5 font-mono text-xl font-semibold tabular-nums">
            {freq.value}{' '}
            <span className="text-sm font-normal text-fg-muted">{freq.unit}</span>
          </div>
        </div>
        <div className="rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-wider text-accent">
            Μέγεθος κεραίας (λ/4)
          </div>
          <div className="mt-0.5 font-mono text-xl font-semibold text-accent tabular-nums">
            {len.value}{' '}
            <span className="text-sm font-normal text-fg-muted">{len.unit}</span>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="mt-5">
        <input
          type="range"
          min={LOG_MIN}
          max={LOG_MAX}
          step={0.05}
          value={logF}
          onChange={(e) => setLogF(parseFloat(e.target.value))}
          className="w-full accent-[rgb(var(--accent))]"
          aria-label="Συχνότητα (λογαριθμική κλίμακα)"
        />
        <div className="mt-1 flex justify-between text-[10px] text-fg-subtle">
          <span>100 Hz</span>
          <span>10 kHz</span>
          <span>1 MHz</span>
          <span>100 MHz</span>
          <span>10 GHz</span>
        </div>
      </div>

      {/* Presets */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setLogF(Math.log10(p.f))}
            className="rounded-full border border-border bg-bg-soft px-2.5 py-1 text-xs text-fg-muted transition-colors hover:border-accent/50 hover:text-fg"
            title={p.note}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Scale comparison */}
      <div className="mt-5 rounded-md bg-bg-soft px-3 py-3">
        <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
          Σε σύγκριση
        </div>
        <div className="mt-1 flex items-center gap-3">
          <div className="text-3xl" aria-hidden="true">
            {closestRef.emoji}
          </div>
          <div className="text-sm">
            <div className="font-medium text-fg">~{closestRef.label}</div>
            <div className="text-xs text-fg-muted">{closestRef.span}</div>
          </div>
        </div>
      </div>

      {/* Reference scale */}
      <div className="mt-4">
        <div className="flex items-end justify-between">
          {REFERENCES.map((r) => {
            const isClosest = r === closestRef
            return (
              <div
                key={r.label}
                className={
                  'flex flex-col items-center gap-0.5 transition-opacity ' +
                  (isClosest ? 'opacity-100' : 'opacity-40')
                }
                title={`${r.label} (${r.span})`}
              >
                <span className="text-base sm:text-lg" aria-hidden="true">
                  {r.emoji}
                </span>
                <span className="hidden text-[9px] text-fg-subtle sm:inline">
                  {r.span}
                </span>
              </div>
            )
          })}
        </div>
        <div className="mt-1 flex justify-between text-[9px] text-fg-subtle">
          <span>μικρό</span>
          <span>μεγάλο</span>
        </div>
      </div>
    </figure>
  )
}
