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

interface SnapshotProps {
    id: number
    source: number
    timestamp: number
    target: string
    options: DamageOptions
    buffs?: Effect[]
    debuffs?: Effect[]
    damage?: DamageInstance[]
}

export class Snapshot implements SnapshotProps {
    public readonly id: number
    public readonly source: number
    public readonly timestamp: number
    public readonly target: string
    public readonly options: DamageOptions
    public readonly buffs: Effect[]
    public readonly debuffs: Effect[]
    public readonly damage: DamageInstance[]

    constructor({
        id,
        source,
        timestamp,
        target,
        options,
        buffs,
        debuffs,
        damage,
    }: SnapshotProps
    ) {
        this.id = id
        this.source = source
        this.timestamp = timestamp
        this.target = target
        this.options = options
        this.buffs = buffs != null ? buffs : []
        this.debuffs = debuffs != null ? debuffs : []
        this.damage = damage != null ? damage : []
    }

    public addBuffs(buffs: Effect[]) {
        this.buffs.push(...buffs)
    }

    public addDebuffs(debuffs: Effect[]) {
        this.debuffs.push(...debuffs)
    }

    public get effects(): Effect[] {
        return [...this.buffs, ...this.debuffs]
    }
}
