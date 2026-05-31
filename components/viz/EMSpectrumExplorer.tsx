'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'

type Band = {
  id: string
  name: string
  fLow: number
  fHigh: number
  /** Color in `rgb(...)` or hex — applied with alpha at render time. */
  color: string
  /** Short description shown when this band is selected. */
  blurb: string
}

type Tech = {
  id: string
  label: string
  /** Center frequency in Hz. */
  f: number
  emoji: string
  detail: string
}

const BANDS: Band[] = [
  { id: 'elf', name: 'ELF/SLF/ULF', fLow: 3, fHigh: 3e3, color: '99 102 241', blurb: 'Ηλεκτρικά δίκτυα ισχύος, υποβρύχια επικοινωνία.' },
  { id: 'vlf', name: 'VLF', fLow: 3e3, fHigh: 3e4, color: '139 92 246', blurb: 'Πολύ χαμηλές συχνότητες — υποβρύχιες, ναυσιπλοΐα.' },
  { id: 'lf', name: 'LF', fLow: 3e4, fHigh: 3e5, color: '167 139 250', blurb: 'Long-wave radio, χρονικά σήματα.' },
  { id: 'mf', name: 'MF', fLow: 3e5, fHigh: 3e6, color: '79 70 229', blurb: 'AM ραδιόφωνο ζει εδώ.' },
  { id: 'hf', name: 'HF', fLow: 3e6, fHigh: 3e7, color: '37 99 235', blurb: 'Shortwave — ταξιδεύει χιλιόμετρα ανακλώμενο από την ιονόσφαιρα.' },
  { id: 'vhf', name: 'VHF', fLow: 3e7, fHigh: 3e8, color: '2 132 199', blurb: 'FM ραδιόφωνο, αναλογική TV, walkie-talkies.' },
  { id: 'uhf', name: 'UHF', fLow: 3e8, fHigh: 3e9, color: '8 145 178', blurb: 'Ψηφιακή TV, GSM, Wi-Fi 2.4 GHz, Bluetooth, μικροκύματα.' },
  { id: 'shf', name: 'SHF', fLow: 3e9, fHigh: 3e10, color: '5 150 105', blurb: 'Wi-Fi 5 GHz, δορυφορική, ραντάρ, πρώιμο 5G.' },
  { id: 'ehf', name: 'EHF', fLow: 3e10, fHigh: 3e11, color: '101 163 13', blurb: 'mmWave 5G, δορυφόροι υψηλής χωρητικότητας.' },
  { id: 'ir', name: 'Infrared', fLow: 3e11, fHigh: 4.3e14, color: '202 138 4', blurb: 'Θερμότητα, οπτικές ίνες (1550 nm), τηλεχειριστήρια.' },
  { id: 'visible', name: 'Visible', fLow: 4.3e14, fHigh: 7.7e14, color: '236 72 153', blurb: 'Το μόνο που βλέπει το μάτι μας — μια λεπτή φέτα του φάσματος.' },
  { id: 'uv', name: 'UV', fLow: 7.7e14, fHigh: 3e16, color: '147 51 234', blurb: 'Ηλιακό μαύρισμα, αποστείρωση, αστρονομία.' },
  { id: 'xray', name: 'X-ray', fLow: 3e16, fHigh: 3e19, color: '129 140 248', blurb: 'Ιατρική απεικόνιση, αστρονομία.' },
  { id: 'gamma', name: 'Gamma', fLow: 3e19, fHigh: 1e24, color: '236 72 153', blurb: 'Πυρηνικές αντιδράσεις, αστροφυσική.' },
]

const TECHS: Tech[] = [
  { id: 'am', label: 'AM ραδιόφωνο', f: 1e6, emoji: '📻', detail: '535–1605 kHz · MF band.' },
  { id: 'sw', label: 'Shortwave', f: 1e7, emoji: '🌐', detail: 'Διεθνείς εκπομπές · HF band.' },
  { id: 'fm', label: 'FM ραδιόφωνο', f: 1e8, emoji: '🎵', detail: '88–108 MHz · VHF band.' },
  { id: 'tv', label: 'Ψηφιακή TV (DVB-T)', f: 5.5e8, emoji: '📺', detail: '470–700 MHz · UHF band.' },
  { id: 'gsm', label: 'GSM 900', f: 9e8, emoji: '📞', detail: '880–960 MHz · UHF.' },
  { id: 'wifi24', label: 'Wi-Fi 2.4', f: 2.4e9, emoji: '📶', detail: '2.4 GHz · UHF/SHF όριο.' },
  { id: 'wifi5', label: 'Wi-Fi 5/6', f: 5e9, emoji: '📶', detail: '5 GHz · SHF band.' },
  { id: '5g', label: '5G mmWave', f: 4e10, emoji: '📲', detail: '28–60 GHz · EHF band.' },
  { id: 'fiber', label: 'Οπτική ίνα', f: 1.93e14, emoji: '🔦', detail: '~1550 nm = 193 THz · IR.' },
  { id: 'green', label: 'Πράσινο φως', f: 5.5e14, emoji: '💚', detail: 'Κέντρο ορατού φάσματος.' },
]

const F_MIN_LOG = 0 // 1 Hz
const F_MAX_LOG = 24 // 1 YHz

export function EMSpectrumExplorer() {
  const [selectedId, setSelectedId] = useState<string | null>('fm')

  const selected = useMemo(() => {
    if (!selectedId) return null
    const b = BANDS.find((x) => x.id === selectedId)
    if (b) return { kind: 'band' as const, ...b }
    const t = TECHS.find((x) => x.id === selectedId)
    if (t) return { kind: 'tech' as const, ...t }
    return null
  }, [selectedId])

  const xFor = (hz: number) => {
    const log = Math.log10(hz)
    return ((log - F_MIN_LOG) / (F_MAX_LOG - F_MIN_LOG)) * 100
  }

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold tracking-tight">
          Το ηλεκτρομαγνητικό φάσμα
        </h4>
        <span className="text-[10px] text-fg-subtle">scroll →</span>
      </div>
      <p className="mb-3 text-xs text-fg-muted">
        Λογαριθμική κλίμακα από 1 Hz ως 10²⁴ Hz. Πάτα ένα band ή ένα marker.
      </p>

      {/* Scrollable strip */}
      <div className="overflow-x-auto rounded-md border border-border bg-bg pb-2">
        <div className="relative h-[180px] min-w-[900px]">
          {/* Bands */}
          {BANDS.map((b) => {
            const left = xFor(b.fLow)
            const width = xFor(b.fHigh) - left
            const active = selectedId === b.id
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedId(active ? null : b.id)}
                className={cn(
                  'absolute top-7 h-12 cursor-pointer border-r border-bg/60 transition-all',
                  active ? 'opacity-100 ring-2 ring-accent' : 'opacity-65 hover:opacity-90',
                )}
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  background: `rgb(${b.color} / 0.85)`,
                }}
                aria-pressed={active}
                title={`${b.name}: ${formatHz(b.fLow)} – ${formatHz(b.fHigh)}`}
              >
                <span className="block truncate px-1 text-[10px] font-semibold text-white">
                  {b.name}
                </span>
              </button>
            )
          })}

          {/* Tech markers — κλιμακωτές σειρές ώστε οι κάψουλες να μην πατάνε η μία στην άλλη */}
          {TECHS.map((t, i) => {
            const left = xFor(t.f)
            const active = selectedId === t.id
            const row = i % 3
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedId(active ? null : t.id)}
                className={cn(
                  'absolute top-[76px] flex -translate-x-1/2 flex-col items-center transition-all',
                  active ? 'z-20' : 'hover:z-10',
                )}
                style={{ left: `${left}%` }}
                aria-pressed={active}
                title={`${t.label} · ${formatHz(t.f)}`}
              >
                <span
                  className={cn('w-px', active ? 'bg-accent' : 'bg-fg-muted/60')}
                  style={{ height: `${12 + row * 22}px` }}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    'whitespace-nowrap rounded-full border bg-bg-elevated px-1.5 py-0.5 text-[10px] font-medium shadow-sm transition-colors',
                    active
                      ? 'border-accent text-accent'
                      : 'border-border text-fg-muted',
                  )}
                >
                  <span aria-hidden="true">{t.emoji}</span>
                  {active && <span className="ml-1">{t.label}</span>}
                </span>
              </button>
            )
          })}

          {/* Frequency ticks */}
          <div className="absolute bottom-0 left-0 right-0 h-7 border-t border-border">
            {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((logHz) => {
              const left = xFor(Math.pow(10, logHz))
              return (
                <div
                  key={logHz}
                  className="absolute -translate-x-1/2 text-[10px] text-fg-subtle"
                  style={{ left: `${left}%`, top: 4 }}
                >
                  10<sup>{logHz}</sup>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Detail panel */}
      <div className="mt-3 min-h-[64px] rounded-md border border-border bg-bg-soft px-3 py-2.5">
        {!selected ? (
          <p className="text-sm text-fg-muted">
            Πάτα οποιαδήποτε ζώνη ή marker για να δεις τι ζει εκεί.
          </p>
        ) : selected.kind === 'band' ? (
          <div className="text-sm">
            <div className="font-semibold tracking-tight text-fg">
              {selected.name}{' '}
              <span className="font-normal text-fg-muted">
                · {formatHz(selected.fLow)} – {formatHz(selected.fHigh)}
              </span>
            </div>
            <p className="mt-0.5 text-fg/85">{selected.blurb}</p>
          </div>
        ) : (
          <div className="text-sm">
            <div className="font-semibold tracking-tight text-fg">
              {selected.emoji} {selected.label}{' '}
              <span className="font-normal text-fg-muted">
                · {formatHz(selected.f)}
              </span>
            </div>
            <p className="mt-0.5 text-fg/85">{selected.detail}</p>
          </div>
        )}
      </div>
    </figure>
  )
}

function formatHz(hz: number): string {
  if (hz >= 1e21) return `${(hz / 1e21).toFixed(0)} ZHz`
  if (hz >= 1e18) return `${(hz / 1e18).toFixed(0)} EHz`
  if (hz >= 1e15) return `${(hz / 1e15).toFixed(0)} PHz`
  if (hz >= 1e12) return `${(hz / 1e12).toFixed(1)} THz`
  if (hz >= 1e9) return `${(hz / 1e9).toFixed(1)} GHz`
  if (hz >= 1e6) return `${(hz / 1e6).toFixed(1)} MHz`
  if (hz >= 1e3) return `${(hz / 1e3).toFixed(0)} kHz`
  return `${hz.toFixed(0)} Hz`
}
