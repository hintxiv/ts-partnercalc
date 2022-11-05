import { SnapshotEvent, TickEvent } from 'api/fflogs/event'
import { Effect } from 'types'

const BASE_CRIT_RATE = 50
const BASE_CRIT_STAT = 400
const CRIT_INCREMENT = 256
const LEVEL_MOD = 1900

export class CritEstimator {
    private critRates: number[] = []
    private snapshotEvents: SnapshotEvent[] = []

    public onTick(event: TickEvent, effects: Effect[]) {
        if (event.expectedCritRate != null) {
            const critFromBuffs = effects.reduce((total, effect) =>
                total + (effect.critRate ?? 0), 0)

            let critRate = event.expectedCritRate - critFromBuffs * 1000

            while (critRate < BASE_CRIT_RATE) {
                critRate += CRIT_INCREMENT
            }

            critRate += critFromBuffs * 1000
            critRate = critRate / 1000 - critFromBuffs

            this.critRates.push(critRate)
        }
    }

    public onSnapshot(event: SnapshotEvent, effects: Effect[]) {
        const critBuffUp = effects.some(effect => effect.critRate != null)

        if (!critBuffUp) {
            this.snapshotEvents.push(event)
        }
    }

    private estimateCritRate(): number | undefined {
        // No DoTs, give a best guess based on observed crits
        if (this.critRates.length === 0) {
            const events = this.snapshotEvents

            if (events.length === 0) { return undefined }

            const critCount = events.filter(event => event.isCrit).length
            return critCount / events.length
        }

        const mode = this.critRates.sort((a, b) =>
            this.critRates.filter(v => v === a).length - this.critRates.filter(v => v === b).length
        ).pop()

        return mode
    }

    public estimateCritStats(): { critRate: number, critMultiplier: number } {
        const critRate = this.estimateCritRate()

        if (critRate == null) {
            return {
                critRate: 0,
                critMultiplier: 1,
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const critStat = (((critRate * 1000) - 50) * LEVEL_MOD / 200) + BASE_CRIT_STAT

        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const critMultiplier = Math.floor((200 * (critStat - BASE_CRIT_STAT) / LEVEL_MOD) + 1400) / 1000

        return {
            critRate: critRate,
            critMultiplier: critMultiplier,
        }
    }
}
