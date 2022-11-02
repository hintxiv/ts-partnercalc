import { simulateDevilment } from 'math/rdps'
import { Stats } from 'types'
import { Snapshot } from 'types/snapshot'
import { BuffWindow } from './buffwindow'

export class Devilment extends BuffWindow {
    public getContribution(snapshot: Snapshot, stats: Stats): number {
        return simulateDevilment(snapshot, stats)
    }
}
