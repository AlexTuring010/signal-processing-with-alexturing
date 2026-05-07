'use client'

import { useEffect, useState } from 'react'
import { usePetStore } from '@/lib/pet/store'
import { PetButton } from './PetButton'
import { PetPanel } from './PetPanel'
import { OrchardModal } from '@/components/orchard/OrchardModal'

/**
 * Root client widget for the persistent virtual pet. Mounts the collapsed
 * button in the bottom-left of every page; expands to a panel on click.
 * Hydrates from localStorage on mount and runs a tick while open.
 *
 * Also owns the OrchardModal mount: the orchard is launched from the pet
 * panel header but lives at this level so it can outlive the panel closing
 * and so it can hide the pet button while it's open.
 */
export function Tamagotchi() {
  const hydrated = usePetStore((s) => s.hydrated)
  const hydrate = usePetStore((s) => s.hydrate)
  const tick = usePetStore((s) => s.tick)
  const [open, setOpen] = useState(false)
  const [orchardOpen, setOrchardOpen] = useState(false)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    // Single tick on mount catches up after a long absence.
    tick()
  }, [tick])

  useEffect(() => {
    if (!open) return
    const id = window.setInterval(() => tick(), 60_000)
    return () => window.clearInterval(id)
  }, [open, tick])

  // When the tab regains focus, reconcile decay.
  useEffect(() => {
    function onVis() {
      if (!document.hidden) tick()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [tick])

  if (!hydrated) return null

  // The pet panel and the orchard panel are anchored at the same spot — they
  // are mutually exclusive (one or the other, never both stacked).
  function handleButton() {
    if (orchardOpen) {
      setOrchardOpen(false)
      return
    }
    setOpen((v) => !v)
  }

  return (
    // z-[60]: above the practice page's FormulaSheet backdrop (z-40) and aside
    // (z-50), so the pet button stays visible on every route. Header is z-40
    // and lives at the top — no overlap with the bottom-anchored widget.
    <div className="fixed bottom-4 left-4 z-[60] print:hidden">
      <div className="relative">
        {open && !orchardOpen && (
          <PetPanel
            onClose={() => setOpen(false)}
            onOpenOrchard={() => {
              setOpen(false)
              setOrchardOpen(true)
            }}
          />
        )}
        <OrchardModal
          open={orchardOpen}
          onClose={() => setOrchardOpen(false)}
          onBackToPet={() => {
            setOrchardOpen(false)
            setOpen(true)
          }}
        />
        <PetButton
          open={open || orchardOpen}
          onClick={handleButton}
        />
      </div>
    </div>
  )
}
