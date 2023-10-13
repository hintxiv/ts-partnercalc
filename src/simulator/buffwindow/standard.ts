import { simulateEsprit } from 'math/esprit'
import { simulateStandard } from 'math/rdps'
import { ComputedDamage, Job, Stats } from 'types'
import { Snapshot } from 'types/snapshot'
import { BuffWindow, WindowInfo } from './buffwindow'

export class Standard extends BuffWindow {
    override type = 'standard'

    /* Returns the rDPS totals for a given player over this window */
    protected override calculateDamageFromSnapshot(snapshot: Snapshot, windowInfo: WindowInfo): ComputedDamage {
        return {
            timestamp: snapshot.timestamp,
            standard: this.getStandardContribution(snapshot, windowInfo.stats),
            esprit: this.getEspritContribution(snapshot, windowInfo.player.job, windowInfo.potencyRatio),
            devilment: 0,
        }
    }

    private getStandardContribution(snapshot: Snapshot, stats: Stats): number {
        const devilmentUp = this.hasOpenBuffOfType('devilment')
        return simulateStandard(snapshot, stats, devilmentUp)
    }

    private getEspritContribution(snapshot: Snapshot, job: Job, potencyRatio: number): number {
        return simulateEsprit(snapshot, job, potencyRatio, this.data)
    }
}
