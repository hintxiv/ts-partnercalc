import { simulateDevilment } from 'math/rdps'
import { ComputedDamage, Snapshot } from 'types'
import { BuffWindow, BuffWindowEvent, WindowInfo } from './buffwindow'

export class Devilment extends BuffWindow {
    override type = 'devilment'
    override events: BuffWindowEvent[] = []

    public addDevilmentCast(timestamp: number, targetID: number) {
        this.addEvent({
            action: this.data.actions.DEVILMENT,
            timestamp: timestamp,
            targetID: targetID,
        })
    }

    protected override calculateDamageFromSnapshot(snapshot: Snapshot, windowInfo: WindowInfo): ComputedDamage {
        return {
            timestamp: snapshot.timestamp,
            standard: 0,
            esprit: 0,
            devilment: simulateDevilment(snapshot, windowInfo.stats),
        }
    }
}
