import { ApplyDebuffEvent, SnapshotEvent, TickEvent } from 'api/fflogs/event'
import { Friend } from 'api/fflogs/fight'
import { BUFFS, RAID_BUFFS } from 'data/raidbuffs'
import { Effect, Job, Status } from 'types'
import { DamageInstance, DamageOptions, Snapshot } from 'types/snapshot'
import { Stats } from 'types/stats'
import { SnapshotHook } from '../../hooks'
import { CritEstimator } from '../estimators/crit'
import { DHEstimator } from '../estimators/dh'
import { StatusKey } from '../module'
import { Entity } from './entity'

export class Player extends Entity {
    public id: number
    public name: string
    public job: Job
    protected registerSnapshot: SnapshotHook

    private snapshots: Map<StatusKey, Snapshot> = new Map()
    private buffs: Map<Status['id'], Effect> = new Map()

    private critEstimator: CritEstimator = new CritEstimator()
    private DHEstimator: DHEstimator = new DHEstimator()

    constructor(friend: Friend, snapshotHook: SnapshotHook) {
        super(friend.id.toString())
        this.id = friend.id
        this.name = friend.name
        this.job = friend.job
        this.registerSnapshot = snapshotHook
        this.init()
    }

    protected init() {
        // Add handlers to maintain active raid buffs
        Object.values(BUFFS).forEach(status => {
            this.buffs.set(status.id, RAID_BUFFS[status.id])
            this.addHook('applybuff', this.onApplyStatus, { actionID: status.id })
            this.addHook('removebuff', this.onRemoveStatus, { actionID: status.id })
        })

        this.addHook('snapshot', this.onSnapshot)
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

    private onSnapshot(event: SnapshotEvent) {
        // TODO auto crits
        const options: DamageOptions = {
            critType: 'normal',
            DHType: 'normal',
        }

        const damage: DamageInstance = {
            type: 'direct',
            timestamp: event.timestamp,
            amount: event.amount,
            isCrit: event.isCrit,
            isDH: event.isDH,
        }

        const snapshot: Snapshot = {
            source: this.id,
            timestamp: event.timestamp,
            target: event.targetKey,
            effects: this.activeBuffs, // TODO might need to copy array?
            options: options,
            damage: [damage],
        }

        this.registerSnapshot(snapshot)
    }

    private onDebuff(event: ApplyDebuffEvent) {
        if (!event.appliedBy) {
            // console.warn('Debuff event found without an applying action!')
            // console.warn(event)
            return
        }

        const options: DamageOptions = {
            critType: 'normal',
            DHType: 'normal',
        }

        const snapshot: Snapshot = {
            source: this.id,
            timestamp: event.timestamp,
            target: event.targetKey,
            effects: this.activeBuffs, // TODO might need to copy array?
            options: options,
            damage: [],
        }

        const statusKey = `${event.targetKey}-${event.statusID}` as StatusKey
        this.snapshots.set(statusKey, snapshot)
    }

    private onTick(event: TickEvent) {
        const key = this.getStatusKey(event)

        if (!this.snapshots.has(key)) {
            // console.warn('Tick event found without a matching snapshot!')
            // console.warn(event)
            return
        }

        const snapshot = this.snapshots.get(key)

        const damage: DamageInstance = {
            type: 'tick',
            timestamp: event.timestamp,
            amount: event.amount,
        }

        snapshot.damage.push(damage)
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
