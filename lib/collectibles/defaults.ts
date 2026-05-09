import type { CollectiblesState } from './types'

export const VERSION = 3 as const

export function freshCollectibles(): CollectiblesState {
  return {
    version: 3,
    startedAt: null,
    found: {},
    equipped: {
      head: null,
      eyes: null,
      body: null,
      accessory: null,
      skin: null,
    },
    placed: [],
    newSinceSeen: [],
  }
}
