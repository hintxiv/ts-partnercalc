import { simulateStandard } from 'math/rdps'
import { ComputedDamage, Stats } from 'types'
import { Snapshot } from 'types/snapshot'
import { BuffWindow } from './buffwindow'
import { Devilment } from './devilment'

// const POTENCY_PER_ESPRIT = 3.68  // per ringabel's calculations
// const ESPRIT_PER_WEAPONSKILL = 10
// const DEFAULT_ESPRIT_RATE = 0.2

export class Standard extends BuffWindow {
    private devilment?: Devilment
    private isTillana: boolean

    constructor(start: number, target: number, isTillana: boolean) {
        super(start, target)
        this.isTillana = isTillana
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

    public getPlayerContribution(playerID: number, stats: Stats): ComputedDamage[] {
        const snapshots = this.snapshots.getPlayerSnapshots(playerID)

        if (!snapshots) { return [] }

        const computedDamage = []

        for (const snapshot of snapshots) {
            computedDamage.push({
                timestamp: snapshot.timestamp,
                standard: this.getStandardContribution(snapshot, stats),
                esprit: this.getEspritContribution(snapshot),
                devilment: this.devilment
                    ? this.devilment.getContribution(snapshot)
                    : 0,
            })
        }

        return computedDamage
    }

    private getStandardContribution(snapshot: Snapshot, stats: Stats): number {
        // Need to wire player stats here
        return simulateStandard(snapshot, stats, !!this.devilment)
    }

    private getEspritContribution(snapshot: Snapshot): number {
        // TODO
        return snapshot.damage.reduce((total, damage) => total + damage.amount * 0.01, 0)
    }
}
