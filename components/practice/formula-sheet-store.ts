'use client'

import { create } from 'zustand'

/**
 * Tiny client-only store that lets `<ExerciseCard>` (and the floating
 * button) cooperate with `<FormulaSheetPanel>` without prop drilling.
 *
 * Open/close, plus a list of formula IDs to highlight when assist mode
 * is active for a particular exercise.
 */
type State = {
  open: boolean
  /** Highlighted formula IDs (when an exercise's assist mode is on). */
  highlighted: string[]
  /** Optional note shown above the highlighted formulas. */
  memorizationNote: React.ReactNode | null

  openSheet: () => void
  closeSheet: () => void
  toggleSheet: () => void
  /** Open the sheet with assist mode for a specific exercise. */
  openWithAssist: (formulaIds: string[], note?: React.ReactNode) => void
  /** Clear assist (back to plain browsing). */
  clearAssist: () => void
}

export const useFormulaSheet = create<State>((set, get) => ({
  open: false,
  highlighted: [],
  memorizationNote: null,
  openSheet: () => set({ open: true }),
  closeSheet: () => set({ open: false }),
  toggleSheet: () => set({ open: !get().open }),
  openWithAssist: (formulaIds, note) =>
    set({ open: true, highlighted: formulaIds, memorizationNote: note ?? null }),
  clearAssist: () => set({ highlighted: [], memorizationNote: null }),
}))
