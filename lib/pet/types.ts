export type Stage = 'egg' | 'baby' | 'adult'

export type NeedKey = 'hunger' | 'happiness' | 'energy'

export type Mood = 'happy' | 'neutral' | 'sad' | 'sick' | 'asleep'

export type ActionKind = 'feed' | 'play' | 'sleep' | 'pet' | 'heal' | 'hatch'

export type Needs = Record<NeedKey, number>

export type Cooldowns = {
  feed: number
  play: number
  clean: number
}

export type PetState = {
  version: 1
  hatched: boolean
  name: string
  stage: Stage
  bornAt: number
  hatchedAt: number | null
  needs: Needs
  sleeping: boolean
  sickSince: number | null
  lastTickAt: number
  cooldowns: Cooldowns
  totalActions: number
}
