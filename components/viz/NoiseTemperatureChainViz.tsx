'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * NoiseTemperatureChainViz — the receive chain as a picture, for §9 of
 * /noise/sources. Makes concrete where the receiver's input noise comes from:
 *
 *   [ what the antenna SEES ]  →  📡 antenna  →  📻 receiver (+T_e)  →  input
 *
 * and splits the input noise temperature into its two parts with a stacked bar:
 *   T_total = T_antenna  (noise coming IN, from the sky/ground the antenna sees)
 *           + T_e        (noise the receiver's own electronics ADD)
 *
 * Two controls make the §9 lesson visible:
 *   - scenario toggle: terrestrial (warm antenna, T_ant ≈ 290 K) vs satellite
 *     uplink (cold antenna, T_ant ≈ a few K);
 *   - noise figure F (dB) → T_e = (F_lin − 1)·T0.
 *
 * Readout: T_total = F·T0 ONLY when T_ant = T0 (terrestrial) — the catch behind
 * preferring T_e over F for cold-antenna work — plus the effective noise floor
 * N0 = k·T_total in dBm/Hz, tying back to §8's −174.
 */

const T0 = 290 // K — reference temperature

type Scenario = 'terrestrial' | 'satellite'

const SCENARIOS: Record<
  Scenario,
  { label: string; Tant: number; emoji: string; sees: string; tone: string; barColor: string }
> = {
  terrestrial: {
    label: 'Επίγεια ζεύξη',
    Tant: 290,
    emoji: '🗼',
    sees: 'ζεστή γη & κτίρια (≈ 290 K)',
    tone: 'border-orange-400/50 bg-gradient-to-br from-orange-400/25 to-amber-300/15',
    barColor: 'rgb(234 88 12)',
  },
  satellite: {
    label: 'Satellite uplink',
    Tant: 10,
    emoji: '🛰️',
    sees: 'κρύος ουρανός / διάστημα (λίγα K)',
    tone: 'border-sky-400/50 bg-gradient-to-br from-sky-400/20 to-indigo-400/12',
    barColor: 'rgb(2 132 199)',
  },
}

const MAX_T = 1900 // K — full width of the stacked bar

export function NoiseTemperatureChainViz() {
  const [scenario, setScenario] = useState<Scenario>('terrestrial')
  const [fdB, setFdB] = useState(8)

  const s = SCENARIOS[scenario]
  const Tant = s.Tant
  const Flin = Math.pow(10, fdB / 10)
  const Te = (Flin - 1) * T0
  const Ttot = Tant + Te
  const FT0 = Flin * T0
  const floor = -174 + 10 * Math.log10(Ttot / T0) // dBm/Hz, N0 = k·T_total

  const pctAnt = Math.min(100, (Tant / MAX_T) * 100)
  const pctTe = Math.min(100 - pctAnt, (Te / MAX_T) * 100)

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Η αλυσίδα θορύβου του δέκτη — T<sub>antenna</sub>, T<sub>e</sub>, T<sub>total</sub>
        </h4>
        <div
          role="radiogroup"
          aria-label="Σενάριο"
          className="inline-flex items-center rounded-full border border-border bg-bg-soft p-0.5 text-xs"
        >
          {(Object.keys(SCENARIOS) as Scenario[]).map((id) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={scenario === id}
              onClick={() => setScenario(id)}
              className={cn(
                'rounded-full px-2.5 py-1 transition-colors',
                scenario === id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
              )}
            >
              {SCENARIOS[id].label}
            </button>
          ))}
        </div>
      </div>

      {/* Schematic: scene → antenna → receiver → input */}
      <div className="flex flex-col items-stretch gap-2 sm:flex-row">
        <div
          className={cn(
            'flex flex-1 flex-col justify-center rounded-md border-2 px-3 py-3 text-center',
            s.tone,
          )}
        >
          <div className="text-2xl">{s.emoji}</div>
          <div className="mt-1 text-[11px] font-semibold text-fg">Τι «βλέπει» η κεραία</div>
          <div className="text-[10px] text-fg-muted">{s.sees}</div>
          <div className="mt-1 font-mono text-xs text-fg">
            T<sub>antenna</sub> = {Tant} K
          </div>
          <div className="text-[10px] text-fg-subtle">σήμα (πομπός) + θόρυβος περιβάλλοντος</div>
        </div>

        <Arrow />

        <div className="flex flex-1 flex-col items-center justify-center rounded-md border-2 border-border bg-bg-soft/60 px-3 py-3 text-center">
          <div className="text-2xl">📡</div>
          <div className="mt-1 text-[11px] font-semibold text-fg">Κεραία</div>
          <div className="text-[10px] text-fg-muted">
            μαζεύει σήμα + T<sub>antenna</sub>
          </div>
        </div>

        <Arrow />

        <div className="flex flex-1 flex-col items-center justify-center rounded-md border-2 border-violet-400/50 bg-violet-50/50 px-3 py-3 text-center dark:bg-violet-400/10">
          <div className="text-2xl">📻</div>
          <div className="mt-1 text-[11px] font-semibold text-fg">Δέκτης</div>
          <div className="text-[10px] text-fg-muted">προσθέτει δικό του θόρυβο</div>
          <div className="mt-1 font-mono text-xs text-fg">
            + T<sub>e</sub> = {Math.round(Te)} K
          </div>
        </div>

        <Arrow />

        <div className="flex flex-1 flex-col items-center justify-center rounded-md border-2 border-emerald-400/50 bg-emerald-50/50 px-3 py-3 text-center dark:bg-emerald-400/10">
          <div className="text-[11px] font-semibold text-fg">Είσοδος δέκτη</div>
          <div className="mt-1 font-mono text-xs text-fg">
            T<sub>total</sub> = {Math.round(Ttot)} K
          </div>
          <div className="text-[10px] text-fg-muted">σήμα + όλος ο θόρυβος</div>
        </div>
      </div>

      {/* Stacked temperature bar: T_antenna + T_e = T_total */}
      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-fg-subtle">
          <span>
            T<sub>total</sub> = T<sub>antenna</sub> + T<sub>e</sub>
          </span>
          <span className="font-mono text-fg">{Math.round(Ttot)} K</span>
        </div>
        <div className="flex h-6 w-full overflow-hidden rounded border border-border bg-bg-soft">
          <div
            className="flex items-center justify-center overflow-hidden whitespace-nowrap text-[9px] font-semibold text-white"
            style={{ width: `${pctAnt}%`, backgroundColor: s.barColor }}
          >
            {pctAnt > 9 ? `T_ant ${Tant}` : ''}
          </div>
          <div
            className="flex items-center justify-center overflow-hidden whitespace-nowrap text-[9px] font-semibold text-white"
            style={{ width: `${pctTe}%`, backgroundColor: 'rgb(124 58 237)' }}
          >
            {pctTe > 11 ? `T_e ${Math.round(Te)}` : ''}
          </div>
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px]">
          <span style={{ color: s.barColor }}>
            ■ T<sub>antenna</sub> (μπαίνει απ' έξω)
          </span>
          <span className="text-violet-600 dark:text-violet-400">
            ■ T<sub>e</sub> (το προσθέτει ο δέκτης)
          </span>
        </div>
      </div>

      {/* Noise figure slider */}
      <div className="mt-4">
        <label className="block text-xs text-fg-muted">
          Noise figure F = <span className="font-mono text-fg tabular-nums">{fdB.toFixed(1)} dB</span>{' '}
          (= {Flin.toFixed(2)}× γραμμικά) → T<sub>e</sub> = (F−1)T<sub>0</sub> ={' '}
          <span className="font-mono text-fg">{Math.round(Te)} K</span>
        </label>
        <input
          type="range"
          min={0.5}
          max={8}
          step={0.1}
          value={fdB}
          onChange={(e) => setFdB(parseFloat(e.target.value))}
          className="mt-1 w-full accent-[rgb(var(--accent))]"
        />
      </div>

      {/* Insight readout */}
      <div className="mt-3 rounded-md border border-accent/30 bg-accent-soft/20 px-3 py-2 text-xs leading-relaxed text-fg/90">
        {scenario === 'terrestrial' ? (
          <p>
            Κεραία σε room temperature (T<sub>antenna</sub> = T<sub>0</sub>):{' '}
            <strong className="font-mono">T_total = T0 + (F−1)T0 = F·T0 = {Math.round(FT0)} K</strong>{' '}
            — η «καθαρή» περίπτωση. Το πάτωμα θορύβου ανεβαίνει στα{' '}
            <strong className="font-mono">{floor.toFixed(0)} dBm/Hz</strong> (= −174 + F[dB]).
          </p>
        ) : (
          <p>
            Κρύα κεραία:{' '}
            <strong className="font-mono">
              T_total = {Tant} + {Math.round(Te)} = {Math.round(Ttot)} K
            </strong>
            , ενώ F·T0 = {Math.round(FT0)} K. Η κρύα κεραία γλιτώνει T0 − T<sub>antenna</sub> ={' '}
            {T0 - Tant} K — που μετράει <strong>πιο πολύ όταν ο δέκτης είναι ήσυχος</strong> (μικρό F).
            Πάτωμα: <strong className="font-mono">{floor.toFixed(0)} dBm/Hz</strong>. Γι' αυτό για
            satellite / low-noise προτιμάμε το T<sub>e</sub> από το F.
          </p>
        )}
      </div>
    </figure>
  )
}

function Arrow() {
  return (
    <div className="flex items-center justify-center text-fg-muted sm:flex-shrink-0">
      <span className="sm:hidden">↓</span>
      <span className="hidden sm:inline">→</span>
    </div>
  )
}
