import { DataProvider } from 'data/provider'
import { SnapshotHandler } from 'simulator/handlers/snapshots'
import { Player } from 'simulator/modules/entities/player'
import { Action, ComputedDamage, Stats } from 'types'
import { Snapshot } from 'types/snapshot'

export interface BuffWindowEvent {
    action: Action
    timestamp: number
    targetID?: number
}

export interface WindowInfo {
    stats: Stats
    player: Player
    potencyRatio: number
}

export abstract class BuffWindow {
    public abstract readonly type: string
    public start: number
    public end?: number
    public target: number
    protected snapshots: SnapshotHandler = new SnapshotHandler()
    protected events: BuffWindowEvent[] = []
    protected children: BuffWindow[] = []
    protected data: DataProvider

    constructor(start: number, target: number, data: DataProvider) {
        this.start = start
        this.target = target
        this.data = data
    }

    public processSnapshot(snapshot: Snapshot) {
        if (this.isOpen) {
            this.snapshots.handleSnapshot(snapshot)
            this.children.forEach(child => child.processSnapshot(snapshot))
        }
    }

    public get isOpen() {
        return this.end == null
    }

    public hasOpenBuffOfType(type: string) {
        return this.type === type || this.children.some(
            child => child.isOpen && child.type === type
        )
    }

    public close(end: number) {
        if (this.isOpen) {
            this.end = end
        }
    }

    public getEvents(): readonly BuffWindowEvent[] {
        const events = [...this.events]
        events.push(...this.children.flatMap(window => window.getEvents()))
        events.sort((a, b) => a.timestamp - b.timestamp)

        return events
    }

    public addChild(child: BuffWindow) {
        this.children.push(child)
    }

    protected addEvent(event: BuffWindowEvent) {
        this.events.push(event)
    }

    public addStandardCast(isTillana: boolean, timestamp: number, targetID: number) {
        this.addEvent({
            action: isTillana ? this.data.actions.TILLANA : this.data.actions.DOUBLE_STANDARD_FINISH,
            timestamp: timestamp,
            targetID: targetID,
        })
    }

    public addClosedPosition(timestamp: number, targetID: number) {
        this.addEvent({
            action: this.data.actions.CLOSED_POSITION,
            timestamp: timestamp,
            targetID: targetID,
        })
    }

    public addTechnical(timestamp: number) {
        this.addEvent({
            action: this.data.actions.QUADRUPLE_TECHNICAL_FINISH,
            timestamp: timestamp,
        })
    }

    public getPlayerContribution(windowInfo: WindowInfo): ComputedDamage[] {
        const snapshots = this.snapshots.getPlayerSnapshots(windowInfo.player.id)

        if (!snapshots) { return [] }

        return snapshots.map(snapshot => {
            const computedDamage = this.calculateDamageFromSnapshot(snapshot, windowInfo)

            this.children.forEach(child => {
                if (snapshot.timestamp <= child.start || (child.end && snapshot.timestamp > child.end)) {
                    return
                }

                const childDamage = child.calculateDamageFromSnapshot(snapshot, windowInfo)
                computedDamage.standard += childDamage.standard
                computedDamage.esprit += childDamage.esprit
                computedDamage.devilment += childDamage.devilment
            })

            return computedDamage
        })
    }

    protected abstract calculateDamageFromSnapshot(snapshot: Snapshot, windowInfo: WindowInfo): ComputedDamage
}
