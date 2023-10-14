import { Buff, Devilment, StandardFinish } from './'
import { DataProvider } from 'data/provider'
import { SnapshotHandler } from 'simulator/handlers/snapshots'
import { Player } from 'simulator/modules/entities/player'
import { Action, ComputedDamage, Snapshot, Stats } from 'types'

export interface WindowInfo {
    stats: Stats
    player: Player
    potencyRatio: number
}

export interface BuffWindowEvent {
    action: Action
    timestamp: number
    targetID?: number
}

export class BuffWindow {
    public start: number
    public end?: number
    public target: number
    protected snapshots: SnapshotHandler = new SnapshotHandler()
    protected events: BuffWindowEvent[] = []
    protected buffs: Buff[] = []
    protected data: DataProvider
    private currentStandard: StandardFinish | undefined
    private currentDevilment: Devilment | undefined
    private realTarget: number

    constructor(start: number, target: number, data: DataProvider) {
        this.start = start
        this.target = target
        this.realTarget = target
        this.data = data
    }

    public get isOpen() {
        return this.buffs.some(buff => buff.isOpen)
    }

    public hasActiveBuffOfType(type: string) {
        return this.buffs.some(buff => buff.type === type && buff.isOpen)
    }

    public getPlayerContribution(windowInfo: WindowInfo): ComputedDamage[] {
        const snapshots = this.snapshots.getPlayerSnapshots(windowInfo.player.id)

        if (!snapshots) { return [] }

        return snapshots.map(snapshot => {
            const computedDamage = {
                timestamp: snapshot.timestamp,
                standard: 0,
                esprit: 0,
                devilment: 0,
            }

            this.buffs.forEach(buff => {
                if (snapshot.timestamp <= buff.start || (buff.end && snapshot.timestamp > buff.end)) {
                    return
                }

                const buffDamage = buff.calculateDamageFromSnapshot(snapshot, windowInfo)
                computedDamage.standard += buffDamage.standard
                computedDamage.esprit += buffDamage.esprit
                computedDamage.devilment += buffDamage.devilment
            })

            return computedDamage
        })
    }

    public overwriteBuff<T extends Buff>(buff: T, current: T): T {
        if (current != null) {
            current.close(buff.start)
        }
        return buff
    }

    public addBuff(buff: Buff) {
        this.buffs.push(buff)

        switch (buff.type) {
        case 'standard':
            this.currentStandard = this.overwriteBuff(buff, this.currentStandard)
            break
        case 'devilment':
            this.currentDevilment = this.overwriteBuff(buff, this.currentDevilment)
            break
        }
    }

    public processSnapshot(snapshot: Snapshot) {
        if (this.isOpen) {
            this.snapshots.handleSnapshot(snapshot)
        }
    }

    public close(timestamp: number) {
        this.closeStandard(timestamp)
        this.closeDevilment(timestamp)
    }

    public closeStandard(timestamp: number) {
        if (this.currentStandard) {
            this.currentStandard.close(timestamp)
            this.currentStandard = undefined
        }

        if (!this.isOpen) {
            this.end = timestamp
        }
    }

    public closeDevilment(timestamp: number) {
        if (this.currentDevilment) {
            this.currentDevilment.close(timestamp)
            this.currentDevilment = undefined
        }

        if (!this.isOpen) {
            this.end = timestamp
        }
    }

    public getEvents(): readonly BuffWindowEvent[] {
        return this.events
    }

    public addStandardCast(isTillana: boolean, timestamp: number) {
        this.addEvent({
            action: isTillana ? this.data.actions.TILLANA : this.data.actions.DOUBLE_STANDARD_FINISH,
            timestamp: timestamp,
            targetID: this.realTarget,
        })
    }

    public addDevilmentCast(timestamp: number) {
        this.addEvent({
            action: this.data.actions.DEVILMENT,
            timestamp: timestamp,
            targetID: this.realTarget,
        })
    }

    public addClosedPosition(timestamp: number, targetID: number) {
        if (this.events.some(event => event.action === this.data.actions.CLOSED_POSITION && event.targetID === targetID)) {
            // TODO why are we getting dupe cast events here?
            return
        }

        this.addEvent({
            action: this.data.actions.CLOSED_POSITION,
            timestamp: timestamp,
            targetID: targetID,
        })

        this.realTarget = targetID
    }

    public addTechnical(timestamp: number) {
        this.addEvent({
            action: this.data.actions.QUADRUPLE_TECHNICAL_FINISH,
            timestamp: timestamp,
        })
    }

    protected addEvent(event: BuffWindowEvent) {
        this.events.push(event)
    }
}
