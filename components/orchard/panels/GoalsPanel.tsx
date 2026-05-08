'use client'

import { Check, Lock, Sparkles, Star, Target, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOrchardStore } from '@/lib/orchard/store'
import { usePetStore } from '@/lib/pet/store'
import {
  ALL_ACHIEVEMENTS,
  GROUP_LABEL,
  type AchievementGroup,
} from '@/lib/orchard/achievements'
import { getQuest } from '@/lib/orchard/quests'
import { STAR_WISHES, wishOwned } from '@/lib/orchard/prestige'

/**
 * Single "Στόχοι" tab combining today's quests + lifetime achievements.
 * Quests at the top — they're active and time-bound. Achievements below in
 * a grouped list with locked / earned states.
 */
export function GoalsPanel() {
  const state = useOrchardStore((s) => s.state)
  const pet = usePetStore((s) => s.state)

  const quests = state.quests
  const baseline = quests.baseline
  const allAchieved = new Set(state.achieved)

  // Group achievements for display.
  const grouped = new Map<AchievementGroup, typeof ALL_ACHIEVEMENTS>()
  for (const a of ALL_ACHIEVEMENTS) {
    if (!grouped.has(a.group)) grouped.set(a.group, [])
    grouped.get(a.group)!.push(a)
  }
  const earnedCount = state.achieved.length
  const totalCount = ALL_ACHIEVEMENTS.length

  return (
    <section className="flex h-full flex-col gap-2 overflow-y-auto p-2.5">
      <header>
        <h3 className="text-xs font-semibold">Στόχοι</h3>
        <p className="mt-0.5 text-[10px] leading-snug text-fg-muted">
          Ολοκλήρωσε καθημερινούς στόχους και ξεκλείδωσε επιτεύγματα
          για ⭐.
        </p>
      </header>

      {/* ---------- Today's quests ---------- */}
      <div className="flex items-center justify-between text-[11px]">
        <span className="inline-flex items-center gap-1 font-semibold">
          <Target className="h-3 w-3 text-accent" aria-hidden="true" />
          Στόχοι ημέρας
        </span>
        <span className="text-fg-subtle tabular-nums">
          {quests.completed.length}/{quests.selected.length}
          {quests.bonusClaimedDate === quests.date && ' · ✓'}
        </span>
      </div>
      <ul className="flex flex-col gap-1">
        {quests.selected.length === 0 && (
          <li className="rounded-lg border border-dashed border-border bg-bg-soft/40 px-2 py-1.5 text-[10px] text-fg-subtle">
            Φόρτωση στόχων…
          </li>
        )}
        {quests.selected.map((id) => {
          const q = getQuest(id)
          if (!q) return null
          const done = quests.completed.includes(id)
          const progress = Math.min(
            q.target,
            q.progress(state, baseline, pet),
          )
          const frac = q.target > 0 ? progress / q.target : 0
          return (
            <li
              key={id}
              className={cn(
                'rounded-lg border p-1.5',
                done
                  ? 'border-success/30 bg-success/10'
                  : 'border-border bg-bg-soft/40',
              )}
            >
              <div className="flex items-center justify-between gap-1 text-[11px]">
                <span className="flex items-center gap-1 font-semibold">
                  {done && (
                    <Check
                      className="h-3 w-3 text-success"
                      aria-hidden="true"
                    />
                  )}
                  <span className="truncate">{q.name}</span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-0.5 text-[10px] font-medium text-fg-muted tabular-nums">
                  +{q.starReward}
                  <Star className="h-2.5 w-2.5 fill-current" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <div
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={q.target}
                  className="h-1 flex-1 overflow-hidden rounded-full bg-bg-elevated"
                >
                  <div
                    className={cn(
                      'h-full rounded-full transition-[width] duration-300',
                      done ? 'bg-success' : 'bg-accent',
                    )}
                    style={{ width: `${frac * 100}%` }}
                  />
                </div>
                <span className="w-12 text-right text-[10px] tabular-nums text-fg-subtle">
                  {progress}/{q.target}
                </span>
              </div>
              <p className="mt-1 text-[10px] leading-snug text-fg-subtle">
                {q.description}
              </p>
            </li>
          )
        })}
      </ul>

      {/* ---------- Wishes (spend ⭐) ---------- */}
      <div className="mt-2 flex items-center justify-between text-[11px]">
        <span className="inline-flex items-center gap-1 font-semibold">
          <Sparkles className="h-3 w-3 text-emerald-500" aria-hidden="true" />
          Ευχές
        </span>
        <span className="text-fg-subtle tabular-nums">
          {state.resources.stars} ⭐ διαθέσιμα
        </span>
      </div>
      <ul className="flex flex-col gap-1">
        {STAR_WISHES.map((wish) => (
          <WishCard key={wish.id} id={wish.id} />
        ))}
      </ul>

      {/* ---------- Achievements ---------- */}
      <div className="mt-2 flex items-center justify-between text-[11px]">
        <span className="inline-flex items-center gap-1 font-semibold">
          <Trophy className="h-3 w-3 text-warn" aria-hidden="true" />
          Επιτεύγματα
        </span>
        <span className="text-fg-subtle tabular-nums">
          {earnedCount}/{totalCount}
        </span>
      </div>

      {Array.from(grouped.entries()).map(([group, items]) => {
        const groupEarned = items.filter((a) => allAchieved.has(a.id)).length
        return (
          <div key={group} className="flex flex-col gap-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
              {GROUP_LABEL[group]} · {groupEarned}/{items.length}
            </h4>
            <ul className="flex flex-col gap-0.5">
              {items.map((a) => {
                const earned = allAchieved.has(a.id)
                return (
                  <li
                    key={a.id}
                    className={cn(
                      'flex items-center gap-1.5 rounded-md px-1.5 py-1',
                      earned
                        ? 'bg-success/10 text-fg'
                        : 'bg-bg-soft/30 text-fg-subtle',
                    )}
                  >
                    {earned ? (
                      <Check
                        className="h-3 w-3 shrink-0 text-success"
                        aria-hidden="true"
                      />
                    ) : (
                      <Lock
                        className="h-3 w-3 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-semibold leading-tight">
                        {a.name}
                      </div>
                      <div className="text-[10px] leading-snug text-fg-muted">
                        {a.description}
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-0.5 text-[10px] tabular-nums">
                      +{a.starReward}
                      <Star
                        className="h-2.5 w-2.5 fill-current"
                        aria-hidden="true"
                      />
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </section>
  )
}

function WishCard({ id }: { id: string }) {
  const wish = STAR_WISHES.find((w) => w.id === id)!
  const stars = useOrchardStore((s) => s.state.resources.stars)
  const owned = useOrchardStore((s) => wishOwned(s.state, wish.id))
  const claim = useOrchardStore((s) => s.claimWish)
  const inProgress = useOrchardStore((s) => s.state.researchTree.inProgress)

  const maxed = owned >= wish.maxOwned
  const canAfford = stars >= wish.cost
  // Research-skip is wasted with no in-flight job; gate the button.
  const skipBlocked = wish.id === 'wish-research-skip' && !inProgress
  const can = !maxed && canAfford && !skipBlocked

  return (
    <li className="flex items-center gap-2 rounded-lg border border-border bg-bg-soft/40 px-2 py-1.5">
      <span aria-hidden="true" className="text-base leading-none">
        {wish.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 text-[11px] font-semibold leading-tight">
          <span className="truncate">{wish.name}</span>
          {wish.stackable && (
            <span className="rounded-full bg-bg-elevated px-1 py-0.5 text-[9px] font-bold text-fg-subtle tabular-nums">
              {owned}/{wish.maxOwned === Infinity ? '∞' : wish.maxOwned}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[10px] leading-snug text-fg-muted">
          {wish.description}
        </p>
      </div>
      <button
        type="button"
        onClick={() => claim(wish.id)}
        disabled={!can}
        title={
          maxed
            ? 'Στο μέγιστο'
            : skipBlocked
              ? 'Δεν τρέχει έρευνα'
              : !canAfford
                ? `Χρειάζονται ${wish.cost} ⭐`
                : `Πάρε για ${wish.cost} ⭐`
        }
        className={cn(
          'inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-1 text-[10px] font-medium transition-transform',
          can
            ? 'bg-emerald-500 text-white shadow-sm hover:scale-[1.02] active:scale-95'
            : 'cursor-not-allowed bg-bg-elevated text-fg-subtle',
        )}
      >
        <Star className="h-2.5 w-2.5 fill-current" aria-hidden="true" />
        {maxed ? 'max' : `${wish.cost}`}
      </button>
    </li>
  )
}
