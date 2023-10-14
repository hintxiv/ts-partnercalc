import { WindowInfo } from './'
import { EFFECTS } from 'data/effects'
import { simulateEsprit } from 'math/esprit'
import { simulateStandard } from 'math/rdps'
import { Snapshot, ComputedDamage, Job, Stats } from 'types'
import { Buff } from './buff'

export class StandardFinish extends Buff {
    public readonly type = 'standard' as const

    public override calculateDamageFromSnapshot(snapshot: Snapshot, windowInfo: WindowInfo): ComputedDamage {
        return {
            timestamp: snapshot.timestamp,
            standard: this.getStandardContribution(snapshot, windowInfo.stats),
            esprit: this.getEspritContribution(snapshot, windowInfo.player.job, windowInfo.potencyRatio),
            devilment: 0,
        }
    }

    private getStandardContribution(snapshot: Snapshot, stats: Stats): number {
        const devilmentUp = snapshot.hasEffect(EFFECTS.DEVILMENT.id)
        return simulateStandard(snapshot, stats, devilmentUp)
    }

    private getEspritContribution(snapshot: Snapshot, job: Job, potencyRatio: number): number {
        return simulateEsprit(snapshot, job, potencyRatio, this.data)
    }
}
