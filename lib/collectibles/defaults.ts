import type { CollectiblesState } from './types'

export const VERSION = 1 as const

export function freshCollectibles(): CollectiblesState {
  return {
    version: 1,
    startedAt: null,
    found: {},
    equipped: { head: null, eyes: null, body: null, accessory: null },
    roomLayout: {
      floor: null,
      wall: [null, null, null],
      furniture: { bed: null, desk: null, chair: null, lamp: null },
      tabletop: null,
    },
    newSinceSeen: [],
  }
}
