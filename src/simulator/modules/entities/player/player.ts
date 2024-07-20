import { ApplyBuffEvent, ApplyDebuffEvent, SnapshotEvent, TickEvent } from 'api/fflogs/event'
import { Friend } from 'api/fflogs/fight'
import { DataProvider, StatusKey } from 'data/provider'
import { Effect, Job, Status } from 'types'
import { DamageInstance, DamageOptions, Snapshot } from 'types/snapshot'
import { Stats } from 'types/stats'
import {MCH_STATUSES} from '../../../../data/statuses/MCH'
import { SnapshotHook } from '../../../hooks'
import { CritEstimator } from '../../estimators/crit'
import { DHEstimator } from '../../estimators/dh'
import { SnapshotKey } from '../../module'
import { Entity } from '../entity'

const AUTO_CRIT_STATUSES: StatusKey[] = [
    'REASSEMBLED',
    'LIFE_SURGE',
    'INNER_RELEASE',
]

const AUTO_DH_STATUSES: StatusKey[] = [
    'REASSEMBLED',
    'INNER_RELEASE',
]

export class Player extends Entity {
    public id: number
    public name: string
    public job: Job

    protected registerSnapshot: SnapshotHook
    private snapshots: Map<SnapshotKey, Snapshot> = new Map()
    private groundDoTSnapshots: Map<Status['id'], Snapshot> = new Map()

    private critEstimator: CritEstimator = new CritEstimator()
    private DHEstimator: DHEstimator = new DHEstimator()
    private autoCritStatuses: Status[]
    private autoDHStatuses: Status[]

    constructor(friend: Friend, snapshotHook: SnapshotHook, data: DataProvider) {
        super(friend.id.toString(), data)
        this.id = friend.id
        this.name = friend.name
        this.job = friend.job
        this.registerSnapshot = snapshotHook
        this.init()
    }

    protected init() {
        this.autoCritStatuses = AUTO_CRIT_STATUSES
            .map(key => this.data.statuses[key])
        this.autoDHStatuses = AUTO_DH_STATUSES
            .map(key => this.data.statuses[key])

        // Add hooks to maintain raid buff statuses
        Object.values(this.data.buffs).forEach(buff => {
            this.addHook('applybuff', this.onApplyStatus, { actionID: buff.id })
            this.addHook('removebuff', this.onRemoveStatus, { actionID: buff.id })
        })

        // Generic hooks
        this.addHook('snapshot', this.onSnapshot)
        this.addHook('applydebuff', this.onDebuff)
        this.addHook('tick', this.onTick)
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

    protected onSnapshot(event: SnapshotEvent) {
        const action = this.data.getAction(event.actionID)

        const options: DamageOptions = {
            critType: 'normal',
            DHType: 'normal',
        }

        if (action != null) {
            const autoCritStatusUp = action?.onGCD && this.autoCritStatuses
                .some(status => this.activeStatuses.has(status.id))
            const autoDHStatusUp = action?.onGCD && this.autoDHStatuses
                .some(status => this.activeStatuses.has(status.id))

            if (event.isCrit && (action.autoCrit || autoCritStatusUp)) {
                options.critType = 'auto'
            }

            if (event.isDH && (action.autoDH || autoDHStatusUp)) {
                options.DHType = 'auto'
            }
        }

        const damage: DamageInstance = {
            type: 'direct',
            timestamp: event.timestamp,
            amount: event.amount,
            isCrit: event.isCrit,
            isDH: event.isDH,
        }

        const snapshot = new Snapshot({
            id: event.actionID,
            source: this.id,
            timestamp: event.timestamp,
            target: event.targetKey,
            buffs: [...this.activeBuffs],
            options: options,
            damage: [damage],
        })

        this.registerSnapshot(snapshot)

        this.critEstimator.onSnapshot(event, snapshot)
        this.DHEstimator.onSnapshot(event, snapshot)
    }

    protected onDebuff(event: ApplyDebuffEvent) {
        if (!event.appliedBy) {
            return
        }

        const options: DamageOptions = {
            critType: 'normal',
            DHType: 'normal',
        }

        if (event.statusID === MCH_STATUSES.WILDFIRE.id) {
            options.DHType = 'none'
            options.critType = 'none'
        }

        const snapshot = new Snapshot({
            id: event.statusID,
            source: this.id,
            timestamp: event.timestamp,
            target: event.targetKey,
            buffs: this.activeBuffs,
            options: options,
        })

        const key = this.getSnapshotKey(event)

        this.snapshots.set(key, snapshot)
        this.registerSnapshot(snapshot)
    }

    protected onTick(event: TickEvent) {
        const key = this.getSnapshotKey(event)

        if (!this.snapshots.has(key)) {
            if (this.groundDoTSnapshots.has(event.statusID)) {
                const snapshot = this.groundDoTSnapshots.get(event.statusID)

                const damage: DamageInstance = {
                    type: 'tick',
                    timestamp: event.timestamp,
                    amount: event.amount,
                }

                // Copy buffs from the original snapshot, but not debuffs
                const newSnapshot = new Snapshot({
                    ...snapshot,
                    debuffs: [],
                    damage: [damage],
                })

                this.registerSnapshot(newSnapshot)
            }

            return
        }

        const snapshot = this.snapshots.get(key)

        const damage: DamageInstance = {
            type: 'tick',
            timestamp: event.timestamp,
            amount: event.amount,
        }

        this.critEstimator.onTick(event, snapshot.effects)
        this.DHEstimator.onTick(event, snapshot.effects)

        snapshot.damage.push(damage)
    }

    protected onGroundDoTApply(event: ApplyBuffEvent) {
        this.onApplyStatus(event)

        const options: DamageOptions = {
            critType: 'normal',
            DHType: 'normal',
        }

        const snapshot = new Snapshot({
            id: event.statusID,
            source: this.id,
            timestamp: event.timestamp,
            target: event.targetKey,
            buffs: this.activeBuffs,
            options: options,
        })

        this.groundDoTSnapshots.set(event.statusID, snapshot)
    }

    protected get activeBuffs(): Effect[] {
        const effects: Effect[] = []

        this.activeStatuses.forEach(statusID => {
            const effect = this.data.getEffect(statusID)
            if (effect != null) {
                effects.push(effect)
            }
        })

        return effects
    }
}
