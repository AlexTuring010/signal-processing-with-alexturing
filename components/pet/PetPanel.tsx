'use client'

import { useEffect, useRef, useState } from 'react'
import { Pencil, X, Check, Volume2, VolumeX, Sparkles, Trees, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePetStore, formatAge, evolutionProgress } from '@/lib/pet/store'
import { MAX_NAME_LENGTH } from '@/lib/pet/defaults'
import { getSoundEnabled, setSoundEnabled, playPetSound } from '@/lib/pet/audio'
import { refreshOrchardSoundFlag } from '@/lib/orchard/audio'
import { PetSprite } from './PetSprite'
import { NeedBar } from './NeedBar'
import { ActionRow } from './ActionRow'
import { HatchDialog } from './HatchDialog'
import { Particles, SleepZs } from './particles'
import { MiniGame } from './MiniGame'

type Props = {
  onClose: () => void
  onOpenOrchard: () => void
}

export function PetPanel({ onClose, onOpenOrchard }: Props) {
  const state = usePetStore((s) => s.state)
  const mood = usePetStore((s) => s.mood())
  const lastAction = usePetStore((s) => s.lastAction)
  const boosts = usePetStore((s) => s.boosts)
  const dispatch = usePetStore((s) => s.dispatch)
  const rename = usePetStore((s) => s.rename)
  const reset = usePetStore((s) => s.reset)

  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState(state.name)
  const [confirmReset, setConfirmReset] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [mode, setMode] = useState<'idle' | 'game'>('idle')
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSoundOn(getSoundEnabled())
  }, [])

  function toggleSound() {
    const next = !soundOn
    setSoundEnabled(next)
    setSoundOn(next)
    // The orchard audio module caches the flag on first read — refresh it
    // so flipping the toggle also (un)mutes orchard SFX without a reload.
    refreshOrchardSoundFlag()
    if (next) playPetSound('click')
  }

  // Esc to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function commitRename() {
    rename(draftName)
    setEditing(false)
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Σιγμάκι"
      className="pet-panel-in absolute bottom-[68px] left-0 flex max-h-[calc(100vh-90px)] w-[280px] max-w-[calc(100vw-2rem)] origin-bottom-left flex-col overflow-y-auto rounded-2xl border border-border bg-bg-elevated shadow-xl"
    >
      <header className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          {state.stage === 'egg' ? (
            <span className="truncate text-sm font-semibold">Αυγουλάκι</span>
          ) : editing ? (
            <input
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename()
                if (e.key === 'Escape') {
                  setDraftName(state.name)
                  setEditing(false)
                }
              }}
              maxLength={MAX_NAME_LENGTH}
              className="min-w-0 flex-1 rounded-md border border-border bg-bg px-2 py-0.5 text-sm focus:border-accent focus:outline-none"
            />
          ) : (
            <>
              <span className="truncate text-sm font-semibold">{state.name}</span>
              <button
                type="button"
                onClick={() => {
                  setDraftName(state.name)
                  setEditing(true)
                }}
                aria-label="Άλλαξε όνομα"
                className="rounded p-0.5 text-fg-subtle hover:text-fg"
              >
                <Pencil className="h-3 w-3" />
              </button>
            </>
          )}
          {state.stage !== 'egg' && (
            <span className="shrink-0 text-[10px] uppercase tracking-wider text-fg-subtle">
              · {formatAge(state)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Κλείσε"
          className="rounded p-1 text-fg-subtle transition-colors hover:bg-bg-soft hover:text-fg"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      {state.stage === 'egg' ? (
        <HatchDialog />
      ) : mode === 'game' ? (
        <MiniGame onExit={() => setMode('idle')} />
      ) : (
        <>
          {/* Stage scene */}
          <div
            className="relative mx-3 mt-3 h-[124px] overflow-hidden rounded-xl border border-border"
            style={{
              background:
                'linear-gradient(180deg, rgb(var(--accent-soft) / 0.35) 0%, rgb(var(--bg-soft)) 60%, rgb(var(--bg-soft)) 100%)',
            }}
          >
            {/* "ground" line */}
            <div
              aria-hidden="true"
              className="absolute inset-x-3 bottom-3 h-0.5 rounded-full bg-border"
            />
            <button
              type="button"
              onClick={() => dispatch('pet')}
              aria-label="Χάιδεψε"
              className="absolute inset-0 flex items-end justify-center pb-3"
            >
              <div
                className={cn(
                  'transition-transform',
                  lastAction?.kind === 'feed' && 'pet-eat',
                  lastAction?.kind === 'play' && 'pet-jump',
                  lastAction?.kind === 'hatch' && 'pet-hatch-in',
                )}
              >
                <PetSprite stage={state.stage} mood={mood} size={88} />
              </div>
            </button>
            {state.sleeping && <SleepZs />}
            <Particles trigger={lastAction} />

            {/* Boost toasts */}
            <div className="pointer-events-none absolute right-2 top-2 flex flex-col items-end gap-1">
              {boosts.map((b) => (
                <span
                  key={b.id}
                  className="pet-boost rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success"
                >
                  ✨ {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Needs */}
          <div className="space-y-1.5 px-3 pt-3">
            <NeedBar label="Πείνα" emoji="🍎" value={state.needs.hunger} />
            <NeedBar label="Χαρά" emoji="🎈" value={state.needs.happiness} />
            <NeedBar label="Ενέργεια" emoji="⚡" value={state.needs.energy} />
          </div>

          <EvolutionRow />

          {/* Actions */}
          <div className="px-3 pt-3">
            <ActionRow onPlay={() => setMode('game')} />
          </div>

          {/* Orchard entry — prominent CTA so it's discoverable */}
          <div className="px-3 pb-3 pt-2">
            <button
              type="button"
              onClick={onOpenOrchard}
              aria-label="Άνοιξε το μποστάνι"
              className="pet-orchard-cta group relative flex w-full items-center gap-2 overflow-hidden rounded-xl border border-emerald-400/40 bg-gradient-to-r from-emerald-500/15 via-emerald-400/10 to-amber-400/15 px-3 py-2 text-left text-sm font-medium text-fg shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <span
                aria-hidden="true"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-300"
              >
                <Trees className="h-4 w-4" />
              </span>
              <span className="flex flex-1 flex-col leading-tight">
                <span>Μποστάνι</span>
                <span className="text-[10px] font-normal text-fg-subtle">
                  Φύτεψε, μάζεψε, πούλα
                </span>
              </span>
              <span className="rounded-full bg-warn px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                Νέο
              </span>
              <ChevronRight
                aria-hidden="true"
                className="h-4 w-4 text-fg-subtle transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </>
      )}

      <footer className="flex items-center justify-between gap-2 border-t border-border px-3 py-1.5 text-[10px] text-fg-subtle">
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? 'Σώπασε ήχους' : 'Ενεργοποίησε ήχους'}
          title={soundOn ? 'Ήχοι: ON' : 'Ήχοι: OFF'}
          className="inline-flex items-center gap-1 rounded px-1 py-0.5 hover:bg-bg-soft hover:text-fg"
        >
          {soundOn ? (
            <Volume2 className="h-3.5 w-3.5" />
          ) : (
            <VolumeX className="h-3.5 w-3.5" />
          )}
        </button>
        <span className="flex-1 truncate text-center">Μόνο στον browser.</span>
        {confirmReset ? (
          <span className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                reset()
                setConfirmReset(false)
              }}
              className="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-danger hover:bg-danger/10"
            >
              <Check className="h-3 w-3" />
              Σίγουρα
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="rounded px-1 py-0.5 hover:bg-bg-soft"
            >
              Άκυρο
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="rounded px-1 py-0.5 hover:bg-bg-soft hover:text-fg"
          >
            Reset
          </button>
        )}
      </footer>
    </div>
  )
}

/**
 * Small "Εξέλιξη" indicator. Shown only for baby pets — eggs haven't hatched
 * yet, adults are terminal. Bar reflects the *limiting* factor (min of
 * time-progress and care-progress) so the user sees the bottleneck. A short
 * hint underneath says which one to fix.
 */
function EvolutionRow() {
  const state = usePetStore((s) => s.state)
  const progress = evolutionProgress(state)
  if (!progress) return null

  const pct = Math.round(progress.progress * 100)
  const ready = progress.progress >= 1
  const hint = ready
    ? 'Έτοιμο για εξέλιξη ✨'
    : progress.bottleneck === 'care'
      ? 'Φρόντισέ το λίγο καλύτερα'
      : 'Χρειάζεται λίγος χρόνος ακόμη'

  return (
    <div className="px-3 pt-2">
      <div className="flex items-center gap-2">
        <Sparkles
          className={cn('h-3 w-3', ready ? 'text-warn' : 'text-fg-subtle')}
          aria-hidden="true"
        />
        <span className="w-14 text-[10px] uppercase tracking-wide text-fg-subtle">
          Εξέλιξη
        </span>
        <div
          role="progressbar"
          aria-label="Πρόοδος εξέλιξης"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-bg-soft"
        >
          <div
            className={cn(
              'absolute inset-y-0 left-0 rounded-full transition-[width,background-color] duration-300',
              ready ? 'bg-warn' : 'bg-accent',
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="w-10 text-right text-[10px] tabular-nums text-fg-subtle">
          {pct}%
        </span>
      </div>
      <p
        className={cn(
          'pl-7 pt-0.5 text-[10px]',
          ready ? 'font-medium text-warn' : 'text-fg-subtle',
        )}
      >
        {hint}
      </p>
    </div>
  )
}
