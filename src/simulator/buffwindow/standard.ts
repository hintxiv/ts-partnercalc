import { DataProvider } from 'data/provider'
import { simulateEsprit } from 'math/esprit'
import { simulateStandard } from 'math/rdps'
import { Player } from 'simulator/modules/entities/player'
import { Action, ComputedDamage, Job, Stats } from 'types'
import { Snapshot } from 'types/snapshot'
import { BuffWindow } from './buffwindow'
import { Devilment } from './devilment'

interface StandardEvent {
    action: Action
    timestamp: number
    targetID?: number
}

export class Standard extends BuffWindow {
    private devilment?: Devilment
    private data: DataProvider
    private events: StandardEvent[] = []

    constructor(start: number, target: number, data: DataProvider) {
        super(start, target)
        this.data = data
    }

    public override processSnapshot(snapshot: Snapshot) {
        super.processSnapshot(snapshot)

        if (this.devilment) {
            this.devilment.processSnapshot(snapshot)
        }
    }

    public addStandardCast(isTillana: boolean, timestamp: number, targetID: number) {
        this.addEvent({
            action: isTillana ? this.data.actions.TILLANA : this.data.actions.DOUBLE_STANDARD_FINISH,
            timestamp: timestamp,
            targetID: targetID,
        })
    }

    public addDevilment(devilment: Devilment) {
        this.devilment = devilment

        this.addEvent({
            action: this.data.actions.DEVILMENT,
            timestamp: devilment.start,
            targetID: devilment.target,
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

    /* Merges a new Standard application into this window */
    public mergeWindow(isTillana: boolean, timestamp: number, targetID: number) {
        this.addEvent({
            action: isTillana ? this.data.actions.TILLANA : this.data.actions.DOUBLE_STANDARD_FINISH,
            timestamp: timestamp,
            targetID: targetID,
        })
    }

    public getEvents(): readonly StandardEvent[] {
        return this.events
    }

    /* Returns the rDPS totals for a given player over this window */
    public getPlayerContribution(player: Player, stats: Stats, potencyRatio: number): ComputedDamage[] {
        const snapshots = this.snapshots.getPlayerSnapshots(player.id)

        if (!snapshots) { return [] }

        const computedDamage: ComputedDamage[] = []

        for (const snapshot of snapshots) {
            computedDamage.push({
                timestamp: snapshot.timestamp,
                standard: this.getStandardContribution(snapshot, stats),
                esprit: this.getEspritContribution(snapshot, player.job, potencyRatio),
                devilment: 0,
            })
        }

        if (this.devilment != null) {
            computedDamage.push(...this.devilment.getPlayerContribution(player, stats))
        }

        return computedDamage
    }

    private addEvent(event: StandardEvent) {
        this.events.push(event)
    }

    private getStandardContribution(snapshot: Snapshot, stats: Stats): number {
        const devilmentUp = this.devilment != null && this.devilment.isOpen
        return simulateStandard(snapshot, stats, devilmentUp)
    }

    private getEspritContribution(snapshot: Snapshot, job: Job, potencyRatio: number): number {
        return simulateEsprit(snapshot, job, potencyRatio, this.data)
    }
}
