import { simulateDevilment } from 'math/rdps'
import { Snapshot, ComputedDamage } from 'types'
import { Buff } from './buff'
import { WindowInfo } from './buffWindow'

export class Devilment extends Buff {
    public readonly type = 'devilment' as const

    public override calculateDamageFromSnapshot(snapshot: Snapshot, windowInfo: WindowInfo): ComputedDamage {
        return {
            timestamp: snapshot.timestamp,
            standard: 0,
            esprit: 0,
            devilment: simulateDevilment(snapshot, windowInfo.stats),
        }
    }
}
