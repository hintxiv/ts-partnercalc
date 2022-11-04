import { ApplyDebuffEvent, SnapshotEvent, TickEvent } from 'api/fflogs/event'
import { Friend } from 'api/fflogs/fight'
import { DataProvider, StatusKey } from 'data/provider'
import { Effect, Job, Status } from 'types'
import { DamageInstance, DamageOptions, Snapshot } from 'types/snapshot'
import { Stats } from 'types/stats'
import { SnapshotHook } from '../../hooks'
import { CritEstimator } from '../estimators/crit'
import { DHEstimator } from '../estimators/dh'
import { SnapshotKey } from '../module'
import { Entity } from './entity'

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
    private data: DataProvider
    private snapshots: Map<SnapshotKey, Snapshot> = new Map()
    private critEstimator: CritEstimator = new CritEstimator()
    private DHEstimator: DHEstimator = new DHEstimator()

    private autoCritStatuses: Status[]
    private autoDHStatuses: Status[]

    constructor(friend: Friend, snapshotHook: SnapshotHook, data: DataProvider) {
        super(friend.id.toString())
        this.id = friend.id
        this.name = friend.name
        this.job = friend.job
        this.registerSnapshot = snapshotHook
        this.data = data
        this.init()
    }

    protected init() {
        this.autoCritStatuses = AUTO_CRIT_STATUSES.map(key => this.data.statuses[key])
        this.autoDHStatuses = AUTO_DH_STATUSES.map(key => this.data.statuses[key])

        // Add hooks to maintain raid buff statuses
        Object.values(this.data.buffs).forEach(buff => {
            this.addHook('applybuff', this.onApplyStatus, { actionID: buff.id })
            this.addHook('removebuff', this.onRemoveStatus, { actionID: buff.id })
        })

        // Add job-specific status hooks
        if (this.job.name === 'Dragoon') {
            this.addHook('applybuff', this.onApplyStatus, {
                actionID: this.data.statuses.LIFE_SURGE.id,
            })
            this.addHook('removebuff', this.onRemoveStatus, {
                actionID: this.data.statuses.LIFE_SURGE.id,
            })

        } else if (this.job.name === 'Machinist') {
            this.addHook('applybuff', this.onApplyStatus, {
                actionID: this.data.statuses.REASSEMBLED.id,
            })
            this.addHook('removebuff', this.onRemoveStatus, {
                actionID: this.data.statuses.REASSEMBLED.id,
            })

        } else if (this.job.name === 'Warrior') {
            this.addHook('applybuff', this.onApplyStatus, {
                actionID: this.data.statuses.INNER_RELEASE.id,
            })
            this.addHook('removebuff', this.onRemoveStatus, {
                actionID: this.data.statuses.INNER_RELEASE.id,
            })
        }

        // Generic hooks
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

            if (autoCritStatusUp) {
                console.log('nice auto crit status')
                console.log(event)
            }

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

        const snapshot: Snapshot = {
            id: event.actionID,
            source: this.id,
            timestamp: event.timestamp,
            target: event.targetKey,
            effects: [...this.activeBuffs],
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
            id: event.statusID,
            source: this.id,
            timestamp: event.timestamp,
            target: event.targetKey,
            effects: this.activeBuffs,
            options: options,
            damage: [],
        }

        const key = `${event.targetKey}-${event.statusID}` as SnapshotKey
        this.snapshots.set(key, snapshot)
    }

    private onTick(event: TickEvent) {
        const key = this.getSnapshotKey(event)

        if (!this.snapshots.has(key)) {
            console.warn('Tick event found without a matching snapshot!')
            console.warn(event)
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
