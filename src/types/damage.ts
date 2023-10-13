import { Action } from './action'
import { Job } from './job'

interface DamageTypes {
    standard: number
    esprit: number
    devilment: number
}

export interface ComputedDamage extends DamageTypes {
    timestamp: number
}

export interface DamageTotals extends DamageTypes {
    total: number
}

export interface ComputedPlayer {
    id: number
    name: string
    job: Job
    damage: ComputedDamage[]
    totals: DamageTotals
}

export interface ComputedEvent {
    action: Action
    timestamp: number
    target?: ComputedPlayer
}

export interface ComputedWindow {
    start: number
    end: number
    players: ComputedPlayer[]
    actualPartner: ComputedPlayer
    bestPartner: ComputedPlayer
    events: ComputedEvent[]
}

export interface OverallDamage {
    players: ComputedPlayer[]
    bestPartner: ComputedPlayer
}
