import { Snapshot } from 'types/snapshot'
import { BuffWindow } from './buffwindow'

export class Devilment extends BuffWindow {
    public getContribution(snapshot: Snapshot): number {
        // TODO
        return snapshot.damage.reduce((total, damage) => total + damage.amount * 0.03, 0)
    }
}
