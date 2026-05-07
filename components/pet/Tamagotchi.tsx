'use client'

import { useEffect, useState } from 'react'
import { usePetStore } from '@/lib/pet/store'
import { PetButton } from './PetButton'
import { PetPanel } from './PetPanel'

/**
 * Root client widget for the persistent virtual pet. Mounts the collapsed
 * button in the bottom-left of every page; expands to a panel on click.
 * Hydrates from localStorage on mount and runs a tick while open.
 */
export function Tamagotchi() {
  const hydrated = usePetStore((s) => s.hydrated)
  const hydrate = usePetStore((s) => s.hydrate)
  const tick = usePetStore((s) => s.tick)
  const [open, setOpen] = useState(false)

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

  return (
    <div className="fixed bottom-4 left-4 z-40 print:hidden">
      <div className="relative">
        {open && <PetPanel onClose={() => setOpen(false)} />}
        <PetButton open={open} onClick={() => setOpen((v) => !v)} />
      </div>
    </div>
  )
}
