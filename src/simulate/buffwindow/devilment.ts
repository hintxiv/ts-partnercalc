import { simulateDevilment } from 'math/rdps'
import { Player } from 'simulate/modules/entities/player'
import { ComputedDamage, Stats } from 'types'
import { BuffWindow } from './buffwindow'

export class Devilment extends BuffWindow {
    public getPlayerContribution(player: Player, stats: Stats): ComputedDamage[] {
        const snapshots = this.snapshots.getPlayerSnapshots(player.id)

        if (!snapshots) { return [] }

        const computedDamage = []

        // Test
        stats.critRate = 0.26
        stats.DHRate = 0.332
        stats.critMultiplier = 1.61

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
