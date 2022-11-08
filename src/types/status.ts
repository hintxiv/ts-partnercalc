import { Effect } from './effect'

export interface Status {
    id: number
    hasStacks?: boolean
    groundDoT?: boolean
}

export interface Buff {
    effect: Effect
}
