import type { CollectiblesState } from './types'

export const VERSION = 2 as const

export function freshCollectibles(): CollectiblesState {
  return {
    version: 2,
    startedAt: null,
    found: {},
    equipped: { head: null, eyes: null, body: null, accessory: null },
    placed: [],
    newSinceSeen: [],
  }
}
