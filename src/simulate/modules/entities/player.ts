import { ApplyDebuffEvent, CastEvent, DamageEvent, TickEvent } from 'api/fflogs/event'
import { Friend } from 'api/fflogs/fight'
import { BUFFS, RAID_BUFFS } from 'data/raidbuffs'
import { Effect, Job, Status } from 'models'
import { EstimatedStats, Stats } from 'models/stats'
import { CastHook } from 'simulate/hooks'
import { CastInstance, DamageInstance, DamageOptions } from 'simulate/instances'
import { CritEstimator } from '../estimators/crit'
import { DHEstimator } from '../estimators/dh'
import { CastKey, StatusKey } from '../module'
import { Entity } from './entity'

export class Player extends Entity {
    public id: number
    public name: string
    public job: Job
    protected emitCast: CastHook

    private casts: Map<CastKey, CastInstance> = new Map()
    private snapshots: Map<StatusKey, CastInstance> = new Map()
    private buffs: Map<Status['id'], Effect> = new Map()

    private critEstimator: CritEstimator = new CritEstimator()
    private DHEstimator: DHEstimator = new DHEstimator()

    constructor(friend: Friend, castHook: CastHook) {
        super(friend.id.toString())
        this.id = friend.id
        this.name = friend.name
        this.job = friend.job
        this.emitCast = castHook
        this.init()
    }

    protected init() {
        // Add handlers to maintain active raid buffs
        Object.values(BUFFS).forEach(status => {
            this.buffs.set(status.id, RAID_BUFFS[status.id])
            this.addHook('applybuff', this.onApplyStatus, { actionID: status.id })
            this.addHook('removebuff', this.onRemoveStatus, { actionID: status.id })
        })

        this.addHook('cast', this.onCast)
        this.addHook('damage',  this.onDamage)
        this.addHook('applydebuff', this.onDebuff)
        this.addHook('tick', this.onTick)

        // Add crit + DH estimators as dependents
        this.addDependency(this.critEstimator)
        this.addDependency(this.DHEstimator)
    }

    public getEstimatedStats(): Stats {
        const {critRate, critMultiplier} = this.critEstimator.estimateCritStats()
        const DHRate = this.DHEstimator.estimateDHRate()

        return {
            critRate: critRate,
            DHRate: DHRate,
            critMultiplier: critMultiplier,
            DHMultiplier: 1.25,
        }
    }

    private onCast(event: CastEvent) {
        // TODO auto crits
        const options: DamageOptions = {
            critType: 'normal',
            DHType: 'normal',
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
