import { DamageEvent, TickEvent } from 'api/fflogs/event'
import { Module } from '../module'

const BASE_CRIT_RATE = 50
const BASE_CRIT_STAT = 400
const CRIT_INCREMENT = 256
const LEVEL_MOD = 1900

export class CritEstimator extends Module {
    private tickEvents: Map<number, TickEvent[]> = new Map()
    private damageEvents: Map<number, DamageEvent[]> = new Map()

    constructor() {
        super()
        this.init()
    }

    protected override init() {
        this.addHook('tick', 'all', this.onTick)
        this.addHook('damage', 'all', this.onDamage)
    }

    private onTick(event: TickEvent) {
        if (!this.tickEvents.has(event.sourceID)) {
            this.tickEvents.set(event.sourceID, [])
        }

        this.tickEvents.get(event.sourceID).push(event)
    }

    private onDamage(event: DamageEvent) {
        if (!this.damageEvents.has(event.sourceID)) {
            this.damageEvents.set(event.sourceID, [])
        }

        this.damageEvents.get(event.sourceID).push(event)
    }

    private estimateCritRate(playerID: number): number | undefined {
        if (!this.tickEvents.has(playerID) && !this.damageEvents.has(playerID)) {
            return undefined
        }

        // No DoTs, give a best guess based on observed crits
        if (!this.tickEvents.has(playerID)) {
            const events = this.damageEvents.get(playerID)

            if (events.length === 0) { return undefined }

            const critCount = events.filter(event => event.isCrit).length

            return critCount / events.length
        }

        const critRates: number[] = []

        for (const event of this.tickEvents.get(playerID)) {
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

    public estimateCritStats(playerID: number): { rate: number, mod: number } | undefined {
        const critRate = this.estimateCritRate(playerID)

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
