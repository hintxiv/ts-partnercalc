import { TickEvent, SnapshotEvent } from 'api/fflogs/event'
import { Effect } from 'types'

export class DHEstimator {
    private directHitPercentages: number[] = []
    private snapshotEvents: SnapshotEvent[] = []

    public onTick(event: TickEvent, effects: Effect[]) {
        if (event.directHitPercentage != null) {
            const DHFromBuffs = effects.reduce((total, effect) =>
                total + (effect.DHRate ?? 0), 0)

            this.directHitPercentages.push(event.directHitPercentage - DHFromBuffs)
        }
    }

    public onSnapshot(event: SnapshotEvent, effects: Effect[]) {
        const DHBuffUp = effects.some(effect => effect.DHRate != null)

        if (!DHBuffUp) {
            this.snapshotEvents.push(event)
        }
    }

    public estimateDHRate(): number {
        // No DoTs, give a best guess based on observed DHs
        if (this.directHitPercentages.length === 0) {
            const events = this.snapshotEvents

            if (events.length === 0) { return 0 }

            const DHCount = events.filter(event => event.isDH).length
            return DHCount / events.length
        }

        const DHRates = this.directHitPercentages

        const mode = DHRates.sort((a, b) =>
            DHRates.filter(v => v === a).length - DHRates.filter(v => v === b).length
        ).pop()

        return mode
    }
}
