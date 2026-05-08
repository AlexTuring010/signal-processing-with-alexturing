'use client'

import { useEffect, useRef, useState } from 'react'
import { useOrchardStore } from '@/lib/orchard/store'
import { HUD } from './HUD'
import { TabBar, type OrchardTab } from './TabBar'
import { Scene, useNowHeartbeat } from './scene/Scene'
import { PlotDetail } from './PlotDetail'
import { MarketPanel } from './panels/MarketPanel'
import { BuildingsPanel } from './panels/BuildingsPanel'
import { ResearchPanel } from './panels/ResearchPanel'
import { CompostPanel } from './panels/CompostPanel'
import { GoalsPanel } from './panels/GoalsPanel'
import { ActionBar } from './ActionBar'
import { PetFooter } from './PetFooter'
import { SickBanner } from './SickBanner'
import { EventBanner } from './EventBanner'
import { Toasts } from './Toasts'

type Props = {
  open: boolean
  onClose: () => void
  /** Returns to the pet panel (closes orchard + re-opens pet UI in its place). */
  onBackToPet: () => void
}

/**
 * Orchard panel. Anchored to the bottom-left corner, in the same column as
 * the pet panel — the orchard is a richer second-tab-style overlay, not a
 * full-screen takeover. Hydrates the orchard store on first mount; runs a
 * 5s background reconcile while open so growth + idle accrual stays accurate.
 *
 * Sized for compact desktop and small mobile viewports alike: 380 px wide
 * with a `100vw - 2rem` ceiling, height bounded to viewport so it never
 * runs off-screen on short laptops.
 */
export function OrchardModal({ open, onClose, onBackToPet }: Props) {
  const hydrate = useOrchardStore((s) => s.hydrate)
  const tick = useOrchardStore((s) => s.tick)
  const hydrated = useOrchardStore((s) => s.hydrated)

  const [tab, setTab] = useState<OrchardTab>('trees')
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) hydrate()
  }, [open, hydrate])

  // Reconcile on open and on a 5-second interval while open. Also on
  // visibilitychange so a tab that was background-hidden catches up.
  useEffect(() => {
    if (!open) return
    tick()
    const id = window.setInterval(() => tick(), 5000)
    function onVis() {
      if (!document.hidden) tick()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [open, tick])

  // ESC closes; clear plot selection when leaving the trees tab.
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (tab !== 'trees') setSelectedPlot(null)
  }, [tab])

  // Whenever the panel is dismissed, drop transient UI state so reopening
  // always lands on a clean default screen (Δέντρα tab, no plot drilled-in,
  // no leftover plot detail from the previous session).
  useEffect(() => {
    if (!open) {
      setTab('trees')
      setSelectedPlot(null)
    }
  }, [open])

  // Live-tick clock for growth timers etc.
  const now = useNowHeartbeat(open, 1000)

  if (!open) return null
  if (!hydrated) return null

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Μποστάνι"
      className="orchard-panel-in absolute bottom-[68px] left-0 flex w-[280px] max-w-[calc(100vw-2rem)] origin-bottom-left flex-col overflow-hidden rounded-2xl border border-border bg-bg-elevated shadow-xl"
      style={{ height: 'min(520px, calc(100vh - 100px))' }}
    >
      <HUD onBackToPet={onBackToPet} onClose={onClose} />
      <TabBar active={tab} onChange={setTab} />
      <SickBanner />
      <EventBanner />

      <div className="relative flex flex-1 flex-col overflow-hidden">
        {tab === 'trees' && (
          selectedPlot ? (
            <PlotDetail
              plotId={selectedPlot}
              now={now}
              onClose={() => setSelectedPlot(null)}
            />
          ) : (
            <Scene
              selectedPlotId={null}
              onSelect={setSelectedPlot}
              now={now}
            />
          )
        )}

        {tab === 'buildings' && <BuildingsPanel />}
        {tab === 'research' && <ResearchPanel />}
        {tab === 'market' && <MarketPanel />}
        {tab === 'compost' && <CompostPanel />}
        {tab === 'goals' && <GoalsPanel />}
      </div>

      <PetFooter />
      <ActionBar />
      <Toasts anchor="panel" />
    </div>
  )
}
