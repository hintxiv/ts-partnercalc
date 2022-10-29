import { Job } from './job'

interface ComputedDamageTypes {
    standard: number
    esprit: number
    devilment: number
}

export interface ComputedDamage extends ComputedDamageTypes {
    timestamp: number
}

export interface DamageTotals extends ComputedDamageTypes {
    total: number
}

export interface ComputedPlayer {
    name: string
    job: Job
    damage: ComputedDamage[]
    totals: DamageTotals
}

export interface ComputedStandard {
    start: number
    end: number
    players: ComputedPlayer[]
}
