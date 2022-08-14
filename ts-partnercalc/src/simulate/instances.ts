import { ActionType } from 'models/action'
import { Effect } from 'models/effect'

export type DamageType = ActionType | 'DoT'

export interface DamageOptions {
    critType: 'normal' | 'auto' | 'none'
    dhType: 'normal' | 'auto' | 'none'
}

export interface CastInstance {
    source: number
    timestamp: number
    targetKey: string
    effects: Effect[]
    options: DamageOptions
}

export interface DamageInstance {
    cast: CastInstance
    type: DamageType
    amount: number
}
