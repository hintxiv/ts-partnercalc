import { DamageEvent, TickEvent } from 'api/fflogs/event'
import { Module } from '../module'

const BASE_CRIT_RATE = 50
const BASE_CRIT_STAT = 400
const CRIT_INCREMENT = 256
const LEVEL_MOD = 1900

export class CritEstimator extends Module {
    private tickEvents: TickEvent[] = []
    private damageEvents:  DamageEvent[] = []

    constructor() {
        super()
        this.init()
    }

    protected override init() {
        this.addHook('tick', this.onTick)
        this.addHook('damage', this.onDamage)
    }

    private onTick(event: TickEvent) {
        this.tickEvents.push(event)
    }

    private onDamage(event: DamageEvent) {
        this.damageEvents.push(event)
    }

    private estimateCritRate(): number | undefined {
        // No DoTs, give a best guess based on observed crits
        if (this.tickEvents.length === 0) {
            const events = this.damageEvents

            if (events.length === 0) { return undefined }

            const critCount = events.filter(event => event.isCrit).length
            return critCount / events.length
        }

        const critRates: number[] = []

        for (const event of this.tickEvents) {
            // TODO get crit rate from buffs for each event
            const critFromBuffs = 0

            let critRate = event.expectedCritRate - critFromBuffs * 1000

            while (critRate < BASE_CRIT_RATE) {
                critRate += CRIT_INCREMENT
            }

            critRate += critFromBuffs * 1000
            critRate = critRate / 1000 - critFromBuffs

            critRates.push(critRate)
        }

        const mode = critRates.sort((a, b) =>
            critRates.filter(v => v === a).length - critRates.filter(v => v === b).length
        ).pop()

        return mode
    }

    public estimateCritStats(): { rate: number, mod: number } | undefined {
        const critRate = this.estimateCritRate()

        if (critRate == null) { return undefined }

        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const critStat = (((critRate * 1000) - 50) * LEVEL_MOD / 200) + BASE_CRIT_STAT

        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const critMod = Math.floor((200 * (critStat - BASE_CRIT_STAT) / LEVEL_MOD) + 1400) / 1000

        return {
            rate: critRate,
            mod: critMod,
        }
    }
}
