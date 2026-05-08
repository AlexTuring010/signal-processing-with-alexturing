'use client'

import { useEffect, useState } from 'react'
import { Recycle, Sprout, Lock, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOrchardStore } from '@/lib/orchard/store'
import {
  SEED_SHOP,
  compostUnlocked,
  currentRunCoins,
  ownedCount,
  permanentYieldMult,
  seedReward,
  type SeedShopItemId,
} from '@/lib/orchard/prestige'
import {
  COMPOST_THRESHOLD,
  COMPOST_YIELD_TIERS,
} from '@/lib/orchard/defaults'
import { playOrchardSound } from '@/lib/orchard/audio'
import { getBuildingDef } from '@/lib/orchard/buildings'

/**
 * Prestige hub: shows the current run's projected seed reward, what is
 * preserved across the reset, the permanent-yield ladder, the player's
 * blueprint roster, and a confirm-style "Σύνθλιψε" button. Below: the
 * Seed Shop with one card per item — one-tap purchase, soft caps shown.
 */
export function CompostPanel() {
  const state = useOrchardStore((s) => s.state)
  const compost = useOrchardStore((s) => s.compost)

  const [confirming, setConfirming] = useState(false)
  const [composting, setComposting] = useState<{
    seeds: number
  } | null>(null)

  // Run the actual compost after the overlay has been visible long enough
  // to feel ceremonial. The overlay is the entire side-effect window.
  useEffect(() => {
    if (!composting) return
    const id = window.setTimeout(() => {
      compost()
      setComposting(null)
    }, 2400)
    return () => window.clearTimeout(id)
  }, [composting, compost])

  // Locked banner if the player hasn't crossed the threshold yet.
  if (!compostUnlocked(state)) {
    const remaining = Math.max(
      0,
      COMPOST_THRESHOLD - state.lifetime.coinsEarned,
    )
    return (
      <section className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center text-fg-subtle">
        <Lock className="h-6 w-6" aria-hidden="true" />
        <p className="text-xs leading-snug">
          Συνέχισε να μαζεύεις κέρματα. Το compost ξεκλειδώνει στα{' '}
          <strong>{COMPOST_THRESHOLD.toLocaleString('el-GR')} 🪙</strong>{' '}
          lifetime.
        </p>
        <p className="text-[10px] tabular-nums">
          Λείπουν {remaining.toLocaleString('el-GR')} 🪙
        </p>
      </section>
    )
  }

  const seeds = seedReward(state)
  const runCoins = currentRunCoins(state)
  const yieldMult = permanentYieldMult(state)
  const ownedSeeds = state.resources.seeds

  return (
    <section className="relative flex h-full flex-col gap-2 overflow-y-auto p-2.5">
      {composting && <CompostOverlay seeds={composting.seeds} />}
      <header>
        <h3 className="text-xs font-semibold">Compost · σπόροι</h3>
        <p className="mt-0.5 text-[10px] leading-snug text-fg-muted">
          Ξεκίνα από την αρχή με μόνιμα οφέλη. Όσο πιο μακρύ το run, τόσο
          περισσότεροι σπόροι.
        </p>
      </header>

      {/* Projection card */}
      <div className="rounded-xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/15 via-emerald-400/10 to-amber-400/15 p-2.5">
        <div className="flex items-baseline justify-between text-[11px]">
          <span className="font-medium">Compost τώρα</span>
          <span className="font-semibold tabular-nums">
            {runCoins.toLocaleString('el-GR')} 🪙 → +{seeds} 🌱
          </span>
        </div>
        <div className="mt-1 text-[10px] text-fg-muted">
          Run #{state.prestige.compostRun + 1} · μόνιμη παραγωγή ×
          {yieldMult.toFixed(2)} (μετά compost: ×
          {nextYieldMult(state.prestige.compostRun + 1).toFixed(2)})
        </div>

        {!confirming ? (
          <button
            type="button"
            onClick={() => {
              if (seeds <= 0) return
              playOrchardSound('click')
              setConfirming(true)
            }}
            disabled={seeds <= 0}
            className={cn(
              'mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-transform',
              seeds > 0
                ? 'bg-accent text-accent-fg shadow-sm hover:scale-[1.01] active:scale-95'
                : 'cursor-not-allowed bg-bg-soft text-fg-subtle',
            )}
          >
            <Recycle className="h-3.5 w-3.5" aria-hidden="true" />
            {seeds > 0 ? `Σύνθλιψε για +${seeds} 🌱` : 'Δεν φτάνουν τα κέρματα'}
          </button>
        ) : (
          <div className="mt-2 flex flex-col gap-1">
            <p className="text-[10px] leading-snug text-fg-muted">
              Θα χάσεις δέντρα/κτίρια/μήλα/κέρματα/έρευνα. Κρατάς:
              σπόρους, ⭐, μόνιμα οφέλη και blueprints.
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  // Capture the projected seeds NOW so the overlay can
                  // display them while the timer counts down.
                  setComposting({ seeds })
                  setConfirming(false)
                }}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-danger px-2 py-1 text-[11px] font-semibold text-white shadow-sm transition-transform hover:scale-[1.01] active:scale-95"
              >
                <Check className="h-3 w-3" aria-hidden="true" />
                Σίγουρα
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="inline-flex items-center rounded-full border border-border bg-bg-elevated px-2 py-1 text-[11px] text-fg-muted hover:text-fg"
              >
                Άκυρο
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Permanent yield ladder */}
      <div className="rounded-xl border border-border bg-bg-soft/40 p-2 text-[10px]">
        <div className="font-medium text-fg-muted">Μόνιμα οφέλη παραγωγής</div>
        <ul className="mt-1 grid grid-cols-2 gap-x-2 gap-y-0.5 tabular-nums">
          {COMPOST_YIELD_TIERS.map(([n, m]) => {
            const reached = state.prestige.compostRun >= n
            return (
              <li
                key={n}
                className={cn(
                  'flex items-center gap-1',
                  reached ? 'text-success' : 'text-fg-subtle',
                )}
              >
                {reached ? (
                  <Check className="h-2.5 w-2.5" aria-hidden="true" />
                ) : (
                  <span className="inline-block h-2.5 w-2.5" />
                )}
                Compost ×{n} → ×{m.toFixed(2)}
              </li>
            )
          })}
        </ul>
      </div>

      {/* Blueprints */}
      {state.prestige.blueprints.length > 0 && (
        <div className="rounded-xl border border-border bg-bg-soft/40 p-2 text-[10px]">
          <div className="font-medium text-fg-muted">
            Blueprints (μισό κόστος)
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {state.prestige.blueprints.map((kind) => (
              <span
                key={kind}
                className="inline-flex items-center gap-1 rounded-full bg-bg-elevated px-1.5 py-0.5"
              >
                {getBuildingDef(kind).emoji}
                {getBuildingDef(kind).name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Seed Shop */}
      <div className="mt-1">
        <div className="mb-1 flex items-baseline justify-between text-[11px]">
          <h4 className="font-semibold">Κατάστημα σπόρων</h4>
          <span className="tabular-nums text-fg-subtle">
            {ownedSeeds} 🌱 διαθέσιμοι
          </span>
        </div>
        <ul className="flex flex-col gap-1">
          {SEED_SHOP.map((item) => (
            <SeedShopCard
              key={item.id}
              id={item.id}
              owned={ownedCount(state, item.id)}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Sparkle + fade-out overlay shown for ~2.4 s when the player commits a
 *  compost. The store action runs at the end so the visual lands first. */
function CompostOverlay({ seeds }: { seeds: number }) {
  const sparks = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i / 12) * Math.PI * 2
    const dist = 60 + Math.random() * 30
    return {
      id: i,
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      delay: Math.random() * 0.4,
    }
  })
  return (
    <div className="orchard-compost-bg pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center bg-bg-elevated/90 backdrop-blur-sm">
      <div className="relative flex flex-col items-center gap-2">
        {sparks.map((s) => (
          <span
            key={s.id}
            aria-hidden="true"
            className="orchard-compost-spark absolute text-base"
            style={
              {
                '--dx': `${s.dx}px`,
                '--dy': `${s.dy}px`,
                animationDelay: `${s.delay}s`,
              } as React.CSSProperties
            }
          >
            ✨
          </span>
        ))}
        <span aria-hidden="true" className="orchard-compost-icon text-6xl leading-none">
          🌱
        </span>
        <p className="text-xs font-semibold text-fg">
          +{seeds} σπόροι
        </p>
        <p className="text-[10px] text-fg-muted">Νέο μποστάνι αρχίζει…</p>
      </div>
    </div>
  )
}

function nextYieldMult(nextRunCount: number): number {
  let mult = 1.0
  for (const [n, m] of COMPOST_YIELD_TIERS) {
    if (nextRunCount >= n) mult = m
  }
  return mult
}

function SeedShopCard({ id, owned }: { id: SeedShopItemId; owned: number }) {
  const item = SEED_SHOP.find((x) => x.id === id)!
  const seeds = useOrchardStore((s) => s.state.resources.seeds)
  const buy = useOrchardStore((s) => s.buySeedShopItem)

  const maxed = owned >= item.maxOwned
  const canAfford = seeds >= item.cost
  const can = !maxed && canAfford

  return (
    <li className="flex items-center gap-2 rounded-lg border border-border bg-bg-soft/40 px-2 py-1.5">
      <span aria-hidden="true" className="text-base leading-none">
        {item.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 text-[11px] font-semibold leading-tight">
          <span className="truncate">{item.name}</span>
          <span className="rounded-full bg-bg-elevated px-1 py-0.5 text-[9px] font-bold text-fg-subtle tabular-nums">
            {owned}/{item.maxOwned}
          </span>
        </div>
        <p className="mt-0.5 text-[10px] leading-snug text-fg-muted">
          {item.description}
        </p>
      </div>
      <button
        type="button"
        onClick={() => buy(item.id)}
        disabled={!can}
        title={
          maxed
            ? 'Στο μέγιστο'
            : !canAfford
              ? `Χρειάζονται ${item.cost} 🌱`
              : `Αγόρασε για ${item.cost} 🌱`
        }
        className={cn(
          'inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-1 text-[10px] font-medium transition-transform',
          can
            ? 'bg-accent text-accent-fg shadow-sm hover:scale-[1.02] active:scale-95'
            : 'cursor-not-allowed bg-bg-elevated text-fg-subtle',
        )}
      >
        <Sprout className="h-2.5 w-2.5" aria-hidden="true" />
        {maxed ? 'max' : `${item.cost} 🌱`}
      </button>
    </li>
  )
}
