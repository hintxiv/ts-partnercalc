import { Effect } from 'models'

export interface DamageOptions {
    critType: 'normal' | 'auto' | 'none'
    dhType: 'normal' | 'auto' | 'none'
}

export interface DamageInstance {
    timestamp: number
    amount: number
    isCrit: boolean
    isDH: boolean
}

export interface CastInstance {
    source: number
    timestamp: number
    target: string
    effects: Effect[]
    options: DamageOptions
    damage: DamageInstance[]
}
