import { BUFFS, RAID_BUFFS } from 'data/raidbuffs'
import { Effect, Job, Status } from 'models'
import { ApplyDebuffEvent, CastEvent, DamageEvent, TickEvent } from 'parse/fflogs/event'
import { CastHook } from 'simulate/hooks'
import { CastInstance, DamageInstance, DamageOptions } from 'simulate/instances'
import { CastKey, StatusKey } from '../module'
import { Entity } from './entity'

export class Player extends Entity {
    public id: number
    public job: Job
    protected emitCast: CastHook

    private casts: Map<CastKey, CastInstance> = new Map()
    private snapshots: Map<StatusKey, CastInstance> = new Map()
    private buffs: Map<Status['id'], Effect> = new Map()

    constructor(id: number, job: Job, castHook: CastHook) {
        super(id.toString())
        this.id = id
        this.job = job
        this.emitCast = castHook
        this.init()
    }

    protected init() {
        // Add handlers to maintain active raid buffs
        Object.values(BUFFS).forEach(status => {
            this.buffs.set(status.id, RAID_BUFFS[status.id])
            this.addHook('applybuff', status.id, this.onApplyStatus)
            this.addHook('removebuff', status.id, this.onRemoveStatus)
        })

        this.addHook('cast', 'all', this.onCast)
        this.addHook('damage', 'all', this.onDamage)
        this.addHook('applydebuff', 'all', this.onDebuff)
        this.addHook('tick', 'all', this.onTick)
    }

    private onCast(event: CastEvent) {
        // TODO auto crits
        const options: DamageOptions = {
            critType: 'normal',
            dhType: 'normal',
        }

        const cast: CastInstance = {
            source: this.id,
            timestamp: event.timestamp,
            target: event.targetKey,
            effects: this.activeBuffs,
            options: options,
            damage: [],
        }

        this.casts.set(this.getCastKey(event), cast)

        this.emitCast(cast)
    }

    private onDebuff(event: ApplyDebuffEvent) {
        if (!event.appliedBy) {
            console.warn('Debuff event found without an applying action')
            console.warn(event)
            return
        }

        const castKey = `${event.targetKey}-${event.appliedBy}` as CastKey
        const cast = this.casts.get(castKey)

        if (!cast) {
            console.warn('Debuff applied with no corresponding cast')
            console.warn(event)
            return
        }

        const statusKey = `${event.targetKey}-${event.statusID}` as StatusKey

        this.snapshots.set(statusKey, cast)
    }

    private onDamage(event: DamageEvent) {
        const key = this.getCastKey(event)

        if (!this.casts.has(key)) {
            console.warn('Damage event found without a matching cast')
            console.warn(event)
            return
        }

        const cast = this.casts.get(key)

        const damage: DamageInstance = {
            type: 'direct',
            timestamp: event.timestamp,
            amount: event.amount,
            isCrit: event.isCrit,
            isDH: event.isDH,
        }

        cast.damage.push(damage)
    }

    private onTick(event: TickEvent) {
        const key = this.getStatusKey(event)

        if (!this.snapshots.has(key)) {
            console.warn('Tick event found without a matching snapshot')
            console.warn(event)
            return
        }

        const cast = this.snapshots.get(key)

        const damage: DamageInstance = {
            type: 'tick',
            timestamp: event.timestamp,
            amount: event.amount,
        }

        cast.damage.push(damage)
    }

    private get activeBuffs(): Effect[] {
        const buffs = []

        for (const [statusID, buff] of this.buffs) {
            if (this.hasStatus(statusID)) {
                buffs.push(buff)
            }
        }

        return buffs
    }
}
