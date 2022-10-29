import { Effect } from './effect'

export interface Status {
    id: number
    hasStacks?: boolean
}

export interface Buff {
    effect: Effect
}

export interface Debuff {
    effect: Effect
    castActions: number[]
}
