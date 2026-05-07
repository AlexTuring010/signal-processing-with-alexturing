'use client'

import { useEffect, useState } from 'react'
import {
  Hammer,
  ChevronUp,
  Power,
  PackageOpen,
  Lock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOrchardStore } from '@/lib/orchard/store'
import {
  BUILDING_KINDS,
  batchMs,
  batchYield,
  getBuildingDef,
  hasInputs,
  isUnlocked,
  recipeSummary,
  upgradeCost as upgradeCostFor,
} from '@/lib/orchard/buildings'
import { playOrchardSound } from '@/lib/orchard/audio'
import type { Building, BuildingKind } from '@/lib/orchard/types'
import { MAX_BUILDING_LEVEL } from '@/lib/orchard/defaults'

/**
 * Lists every building (built / unbuilt-but-unlocked / locked). Built ones
 * show batch progress, level, output buffer, plus toggle/collect/upgrade.
 * Sized for the 280-px panel: stacks vertically, scrolls when overflowing.
 */
export function BuildingsPanel() {
  const buildings = useOrchardStore((s) => s.state.buildings)
  const lifetimeCoins = useOrchardStore((s) => s.state.lifetime.coinsEarned)

  return (
    <section className="flex h-full flex-col gap-1.5 overflow-y-auto p-2.5">
      <header className="shrink-0">
        <h3 className="text-xs font-semibold">Κτίρια</h3>
        <p className="mt-0.5 text-[10px] leading-snug text-fg-muted">
          Μετατρέπουν μήλα σε προϊόντα μεγαλύτερης αξίας.
        </p>
      </header>

      <ul className="flex flex-col gap-1.5">
        {BUILDING_KINDS.map((kind) => {
          const owned = buildings.find((b) => b.kind === kind) ?? null
          if (owned) return <BuiltCard key={kind} building={owned} />
          return (
            <UnbuiltCard
              key={kind}
              kind={kind}
              lifetimeCoins={lifetimeCoins}
              buildings={buildings}
            />
          )
        })}
      </ul>
    </section>
  )
}

function BuiltCard({ building }: { building: Building }) {
  const def = getBuildingDef(building.kind)
  const resources = useOrchardStore((s) => s.state.resources)
  const plots = useOrchardStore((s) => s.state.plots)
  const upgradeBuilding = useOrchardStore((s) => s.upgradeBuilding)
  const toggleBuilding = useOrchardStore((s) => s.toggleBuilding)
  const collectOutput = useOrchardStore((s) => s.collectOutput)

  // 500 ms heartbeat just for the in-flight progress bar
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), 500)
    return () => window.clearInterval(id)
  }, [])
  void tick

  const cost = upgradeCostFor(building)
  const canUpgrade =
    building.level < MAX_BUILDING_LEVEL && resources.coins >= cost

  // Synthesize a "virtual barn" view of total apple availability so the card
  // can warn the user when production has stalled for lack of inputs.
  const virtualResources = {
    ...resources,
    apples:
      resources.apples +
      plots.reduce((s, p) => s + (p.tree ? p.tree.storedApples : 0), 0),
  }
  const inputsOK = hasInputs(building, virtualResources)

  // Progress fraction of the in-flight batch (0 if idle).
  const batchEnd =
    building.batchStartedAt !== null ? building.batchStartedAt + batchMs(building) : null
  const remainingMs = batchEnd !== null ? Math.max(0, batchEnd - Date.now()) : 0
  const progress =
    batchEnd !== null
      ? Math.max(0, Math.min(1, 1 - remainingMs / batchMs(building)))
      : 0

  const stored = Math.floor(building.storedOutput)
  const cap = def.outputCap
  const outputFrac = cap > 0 ? Math.min(1, stored / cap) : 0
  const outputFull = stored >= cap

  return (
    <li className="flex flex-col gap-1.5 rounded-xl border border-border bg-bg-soft/40 p-2">
      <div className="flex items-center gap-1.5">
        <span aria-hidden="true" className="text-base">
          {def.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-[11px] font-semibold">
            <span className="truncate">{def.name}</span>
            <span className="rounded-full bg-bg-elevated px-1 py-0.5 text-[9px] font-bold text-fg-subtle">
              Lv {building.level}
            </span>
            {!building.active && (
              <span className="rounded-full bg-warn/20 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider text-warn">
                paused
              </span>
            )}
          </div>
          <div className="text-[10px] leading-tight text-fg-subtle tabular-nums">
            {recipeSummary(building)} · {(batchMs(building) / 1000).toFixed(0)}s
          </div>
        </div>
      </div>

      {/* Batch progress + idle reason */}
      <div className="flex items-center gap-2">
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-bg-elevated">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="w-[58px] text-right text-[10px] tabular-nums text-fg-subtle">
          {batchEnd !== null
            ? `${Math.ceil(remainingMs / 1000)}s`
            : !building.active
              ? 'paused'
              : !inputsOK
                ? 'χωρίς υλικά'
                : outputFull
                  ? 'γέμισε'
                  : 'περιμένει'}
        </span>
      </div>

      {/* Output buffer */}
      <div className="flex items-center gap-1.5">
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-bg-elevated">
          <div
            className={cn(
              'absolute inset-y-0 left-0 rounded-full transition-[width] duration-300',
              outputFull ? 'bg-warn' : 'bg-success',
            )}
            style={{ width: `${outputFrac * 100}%` }}
          />
        </div>
        <span className="w-[42px] text-right text-[10px] tabular-nums text-fg-muted">
          {stored}/{cap}
        </span>
      </div>

      {/* Action row */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => collectOutput(building.id)}
          disabled={stored <= 0}
          title={`Μάζεψε ${stored} ${def.recipe.output}`}
          className={cn(
            'inline-flex flex-1 items-center justify-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium transition-transform',
            stored > 0
              ? 'bg-success text-white shadow-sm hover:scale-[1.01] active:scale-95'
              : 'cursor-not-allowed bg-bg-elevated text-fg-subtle',
          )}
        >
          <PackageOpen className="h-3 w-3" aria-hidden="true" />
          {stored > 0 ? `Μάζεψε ${stored}` : 'Μάζεψε'}
        </button>
        <button
          type="button"
          onClick={() => {
            playOrchardSound('click')
            toggleBuilding(building.id)
          }}
          title={building.active ? 'Σταμάτα' : 'Ξεκίνα'}
          className={cn(
            'inline-flex shrink-0 items-center justify-center rounded-full p-1.5 transition-colors',
            building.active
              ? 'bg-bg-elevated text-fg-muted hover:text-fg'
              : 'bg-warn/20 text-warn hover:bg-warn/30',
          )}
          aria-label={building.active ? 'Σταμάτα' : 'Ξεκίνα'}
        >
          <Power className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={() => upgradeBuilding(building.id)}
          disabled={!canUpgrade}
          title={
            building.level >= MAX_BUILDING_LEVEL
              ? 'Στο μέγιστο'
              : canUpgrade
                ? `Αναβάθμιση: ${cost} 🪙`
                : `Χρειάζονται ${cost} 🪙`
          }
          className={cn(
            'inline-flex shrink-0 items-center justify-center gap-0.5 rounded-full px-2 py-1 text-[10px] font-medium transition-transform',
            canUpgrade
              ? 'bg-accent text-accent-fg shadow-sm hover:scale-[1.02] active:scale-95'
              : 'cursor-not-allowed bg-bg-elevated text-fg-subtle',
          )}
        >
          <ChevronUp className="h-3 w-3" aria-hidden="true" />
          {building.level >= MAX_BUILDING_LEVEL ? 'max' : `${cost}🪙`}
        </button>
      </div>

      {/* Lvl bonus preview */}
      {building.level < MAX_BUILDING_LEVEL && (
        <p className="text-[10px] leading-snug text-fg-subtle">
          Επόμενο Lv: {(batchMs({ ...building, level: building.level + 1 }) / 1000).toFixed(0)}s
          / {batchYield({ ...building, level: building.level + 1 })}{' '}
          {def.recipe.output}.
        </p>
      )}
    </li>
  )
}

function UnbuiltCard({
  kind,
  lifetimeCoins,
  buildings,
}: {
  kind: BuildingKind
  lifetimeCoins: number
  buildings: Building[]
}) {
  const def = getBuildingDef(kind)
  const coins = useOrchardStore((s) => s.state.resources.coins)
  const buildBuilding = useOrchardStore((s) => s.buildBuilding)

  const unlocked = isUnlocked(kind, lifetimeCoins, buildings)
  const canAfford = coins >= def.buildCost
  const requiresMet = !def.requires || buildings.some((b) => b.kind === def.requires)

  // Why is it locked? (gives the player a clear hint to chase)
  let lockedReason: string | null = null
  if (!unlocked) {
    if (def.requires && !requiresMet) {
      const reqDef = getBuildingDef(def.requires)
      lockedReason = `Πρώτα: ${reqDef.name}`
    } else {
      lockedReason = `Ξεκλειδώνει στα ${def.unlockLifetimeCoins} 🪙 lifetime`
    }
  }

  return (
    <li
      className={cn(
        'flex flex-col gap-1.5 rounded-xl border p-2',
        unlocked
          ? 'border-border bg-bg-soft/40'
          : 'border-dashed border-border/60 bg-bg-soft/20 opacity-70',
      )}
    >
      <div className="flex items-center gap-1.5">
        <span
          aria-hidden="true"
          className={cn('text-base', !unlocked && 'grayscale')}
        >
          {def.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-[11px] font-semibold">
            <span className="truncate">{def.name}</span>
            {!unlocked && <Lock className="h-3 w-3 text-fg-subtle" aria-hidden="true" />}
          </div>
          <div className="text-[10px] leading-tight text-fg-subtle tabular-nums">
            {recipeSummary({
              id: 'preview',
              kind,
              level: 0,
              active: false,
              batchStartedAt: null,
              storedOutput: 0,
            })}{' '}
            · {(def.recipe.baseMs / 1000).toFixed(0)}s
          </div>
        </div>
      </div>

      {unlocked ? (
        <button
          type="button"
          onClick={() => buildBuilding(kind)}
          disabled={!canAfford}
          className={cn(
            'inline-flex items-center justify-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium transition-transform',
            canAfford
              ? 'bg-accent text-accent-fg shadow-sm hover:scale-[1.01] active:scale-95'
              : 'cursor-not-allowed bg-bg-elevated text-fg-subtle',
          )}
        >
          <Hammer className="h-3 w-3" aria-hidden="true" />
          Χτίσε ({def.buildCost} 🪙)
        </button>
      ) : (
        <p className="rounded-full bg-bg-elevated px-2 py-1 text-center text-[10px] text-fg-subtle">
          🔒 {lockedReason}
        </p>
      )}
    </li>
  )
}
