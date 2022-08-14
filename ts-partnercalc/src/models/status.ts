import { Effect } from './effect'

export interface Status {
    id: number
    hasStacks?: boolean
}

export interface Buff extends Status {
    effect: Effect
}

export interface Debuff extends Status {
    effect: Effect
    castActions: number[]
}
