import { DataProvider } from 'data/provider'
import { simulateEsprit } from 'math/esprit'
import { simulateStandard } from 'math/rdps'
import { Player } from 'simulate/modules/entities/player'
import { ComputedDamage, Job, Stats } from 'types'
import { Snapshot } from 'types/snapshot'
import { BuffWindow } from './buffwindow'
import { Devilment } from './devilment'

export class Standard extends BuffWindow {
    public isTillana: boolean
    public targetID: number
    private devilment?: Devilment
    private data: DataProvider

    constructor(start: number, target: number, isTillana: boolean, data: DataProvider) {
        super(start, target)
        this.targetID = target
        this.isTillana = isTillana
        this.data = data
    }

    public override processSnapshot(snapshot: Snapshot) {
        super.processSnapshot(snapshot)

        if (this.devilment) {
            this.devilment.processSnapshot(snapshot)
        }
    }

    public addDevilment(devilment: Devilment) {
        this.devilment = devilment
    }

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

    private getStandardContribution(snapshot: Snapshot, stats: Stats): number {
        return simulateStandard(snapshot, stats, !!this.devilment)
    }

    private getEspritContribution(snapshot: Snapshot, job: Job, potencyRatio: number): number {
        return simulateEsprit(snapshot, job, potencyRatio, this.data)
    }
}
