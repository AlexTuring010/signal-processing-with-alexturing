'use client'

import { ArrowLeft, Sprout, Apple, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOrchardStore } from '@/lib/orchard/store'
import { plotStats } from './scene/PlotCard'
import { TreeSprite } from './scene/TreeSprite'
import { stageAtForState } from '@/lib/orchard/effects'
import { playOrchardSound } from '@/lib/orchard/audio'

type Props = {
  plotId: string | null
  /** Refreshed once per second by the parent so growth timers are live. */
  now: number
  /** Closes the detail view and returns to the orchard scene. */
  onClose: () => void
}

/**
 * Full-width drill-in view for the currently-selected plot. Shows plant
 * button for empty plots, full stats for planted ones (yield, interval,
 * storage), plus a quick "Μάζεψε" button if there's stored fruit. Replaces
 * the scene grid while open — the back-arrow returns to the grid.
 */
export function PlotDetail({ plotId, now, onClose }: Props) {
  const state = useOrchardStore((s) => s.state)
  const plot = plotId ? state.plots.find((p) => p.id === plotId) ?? null : null
  const apples = state.resources.apples
  const moodMult = useOrchardStore((s) => s.currentMoodMult())
  const plant = useOrchardStore((s) => s.plant)
  const harvest = useOrchardStore((s) => s.harvest)
  const plantCostFor = useOrchardStore((s) => s.plantCostFor)

  if (!plot) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-sm text-fg-subtle">
        Επίλεξε ένα οικόπεδο.
      </div>
    )
  }

  const cost = plantCostFor('classic')
  const canAfford = apples >= cost
  const stats = plotStats(plot, now, state)
  const liveStage = plot.tree ? stageAtForState(plot.tree, now, state) : 0

  return (
    <section className="flex flex-1 flex-col overflow-y-auto">
      <header className="flex items-center gap-2 border-b border-border px-3 py-2">
        <button
          type="button"
          onClick={() => {
            playOrchardSound('click')
            onClose()
          }}
          aria-label="Πίσω στο μποστάνι"
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs text-fg-muted hover:bg-bg-soft hover:text-fg"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Πίσω
        </button>
        <h3 className="text-sm font-semibold">
          {plot.tree ? 'Δέντρο' : 'Άδειο οικόπεδο'}
        </h3>
      </header>

      <div className="flex flex-col gap-3 p-3">
        {/* Visual preview */}
        <div
          className="relative flex h-32 items-center justify-center overflow-hidden rounded-xl border border-border"
          style={{
            background:
              'linear-gradient(180deg, rgb(var(--accent-soft) / 0.35) 0%, rgb(var(--bg-soft)) 70%, rgb(var(--bg-soft)) 100%)',
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-3 bottom-3 h-0.5 rounded-full bg-border"
          />
          {plot.tree ? (
            <TreeSprite
              tree={{ ...plot.tree, growthStage: liveStage }}
              size={88}
              full={
                stats !== null && stats.stored >= stats.storage && stats.storage > 0
              }
            />
          ) : (
            <Sprout className="h-12 w-12 text-fg-subtle/60" />
          )}
        </div>

        {!plot.tree && (
          <>
            <p className="text-sm text-fg-muted">
              {cost === 0
                ? 'Το πρώτο δέντρο είναι δωρεάν — απλά φύτεψέ το.'
                : 'Φύτεψε ένα κλασικό δέντρο. Σε λίγα λεπτά θα δίνει μήλα.'}
            </p>
            <div className="flex items-center justify-between rounded-lg bg-bg-soft px-3 py-2">
              <span className="text-xs text-fg-subtle">Κόστος</span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold tabular-nums">
                {cost === 0 ? 'Δωρεάν' : `🍎 ${cost}`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!canAfford) return
                plant(plot.id, 'classic')
              }}
              disabled={!canAfford}
              className={cn(
                'inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-transform',
                canAfford
                  ? 'bg-accent text-accent-fg shadow-sm hover:scale-[1.02] active:scale-95'
                  : 'cursor-not-allowed bg-bg-soft text-fg-subtle',
              )}
              title={canAfford ? 'Φύτεψε' : 'Δεν έχεις αρκετά μήλα'}
            >
              <Sprout className="h-4 w-4" aria-hidden="true" />
              {cost === 0 ? 'Φύτεψε (δωρεάν)' : `Φύτεψε (${cost} 🍎)`}
            </button>
          </>
        )}

        {plot.tree && stats && (
          <>
            <div className="rounded-xl border border-border bg-bg-soft/50 p-3">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium text-fg-muted">Στάδιο</span>
                <span className="font-semibold">{stats.label}</span>
              </div>
              {stats.msToNext !== null && (
                <div className="flex items-center justify-between text-xs text-fg-subtle">
                  <span>Επόμενο στάδιο σε</span>
                  <span className="tabular-nums">
                    {formatMsLong(stats.msToNext)}
                  </span>
                </div>
              )}
            </div>

            <dl className="grid grid-cols-2 gap-2 text-xs">
              <Stat label="Ρυθμός" value={`1 / ${stats.interval.toFixed(0)}s`} />
              <Stat label="Απόδοση" value={`${stats.yieldPer} 🍎`} />
              <Stat
                label="Αποθήκευση"
                value={`${Math.floor(stats.stored)}/${stats.storage}`}
              />
              <Stat label="Πολλ/τής" value={`×${moodMult.toFixed(2)}`} />
            </dl>

            <button
              type="button"
              onClick={() => harvest(plot.id)}
              disabled={stats.stored <= 0}
              className={cn(
                'inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-transform',
                stats.stored > 0
                  ? 'bg-success text-white shadow-sm hover:scale-[1.02] active:scale-95'
                  : 'cursor-not-allowed bg-bg-soft text-fg-subtle',
              )}
            >
              <Apple className="h-4 w-4" aria-hidden="true" />
              {stats.stored > 0
                ? `Μάζεψε ${Math.floor(stats.stored)} 🍎`
                : 'Δεν είναι έτοιμο'}
            </button>

            {stats.stage === 0 && (
              <p className="flex items-start gap-1.5 rounded-lg bg-accent-soft/40 px-3 py-2 text-xs text-fg-muted">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                Δεν έχει βγάλει ακόμα φύλλα. Λίγη υπομονή.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-bg-soft/50 px-2.5 py-2">
      <div className="text-[10px] uppercase tracking-wide text-fg-subtle">
        {label}
      </div>
      <div className="font-semibold tabular-nums">{value}</div>
    </div>
  )
}

function formatMsLong(ms: number): string {
  if (ms <= 0) return '—'
  const s = Math.ceil(ms / 1000)
  if (s < 60) return `${s} δευτ.`
  const m = Math.floor(s / 60)
  const rs = s % 60
  return rs === 0 ? `${m}λ` : `${m}λ ${rs}δ`
}
