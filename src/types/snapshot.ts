import { Effect } from './effect'

export interface DamageOptions {
    critType: 'normal' | 'auto' | 'none'
    DHType: 'normal' | 'auto' | 'none'
}

export type DamageInstance = DirectDamageInstance | TickDamageInstance

interface DamageInstanceFields {
    type: string
    timestamp: number
    amount: number
}

export interface DirectDamageInstance extends DamageInstanceFields {
    type: 'direct'
    isCrit: boolean
    isDH: boolean
}

export interface TickDamageInstance extends DamageInstanceFields {
    type: 'tick'
}

// Tracks all damage instances for a given ability snapshot
export interface Snapshot {
    source: number
    timestamp: number
    target: string
    effects: Effect[]
    options: DamageOptions
    damage: DamageInstance[]
}
