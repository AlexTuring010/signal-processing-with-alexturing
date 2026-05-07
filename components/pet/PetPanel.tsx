'use client'

import { useEffect, useRef, useState } from 'react'
import { Pencil, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePetStore, formatAge } from '@/lib/pet/store'
import { MAX_NAME_LENGTH } from '@/lib/pet/defaults'
import { PetSprite } from './PetSprite'
import { NeedBar } from './NeedBar'
import { ActionRow } from './ActionRow'
import { HatchDialog } from './HatchDialog'
import { Particles, SleepZs } from './particles'

type Props = {
  onClose: () => void
}

export function PetPanel({ onClose }: Props) {
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
  const panelRef = useRef<HTMLDivElement>(null)

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
      className="pet-panel-in absolute bottom-[68px] left-0 w-[280px] max-w-[calc(100vw-2rem)] origin-bottom-left rounded-2xl border border-border bg-bg-elevated shadow-xl"
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

          {/* Actions */}
          <div className="px-3 pb-2 pt-3">
            <ActionRow />
          </div>
        </>
      )}

      <footer className="flex items-center justify-between gap-2 border-t border-border px-3 py-1.5 text-[10px] text-fg-subtle">
        <span>Αποθηκεύεται μόνο στον browser σου.</span>
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
