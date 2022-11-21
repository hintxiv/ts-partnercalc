import { simulateDevilment } from 'math/rdps'
import { Player } from 'simulator/modules/entities/player'
import { ComputedDamage, Stats } from 'types'
import { BuffWindow } from './buffwindow'

export class Devilment extends BuffWindow {
    public getPlayerContribution(player: Player, stats: Stats): ComputedDamage[] {
        const snapshots = this.snapshots.getPlayerSnapshots(player.id)

        if (!snapshots) { return [] }

        const computedDamage = []

        for (const snapshot of snapshots) {
            computedDamage.push({
                timestamp: snapshot.timestamp,
                standard: 0,
                esprit: 0,
                devilment: simulateDevilment(snapshot, stats),
            })
        }

        return computedDamage
    }
}
