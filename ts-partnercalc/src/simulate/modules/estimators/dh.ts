import { TickEvent, DamageEvent } from 'api/fflogs/event'
import { Module } from '../module'

export class DHEstimator extends Module {
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

    public estimateDHRate(playerID: number): number | undefined {
        if (!this.tickEvents.has(playerID) && !this.damageEvents.has(playerID)) {
            return undefined
        }

        // No DoTs, give a best guess based on observed DHs
        if (!this.tickEvents.has(playerID)) {
            const events = this.damageEvents.get(playerID)

            if (events.length === 0) { return undefined }

            const DHCount = events.filter(event => event.isDH).length

            return DHCount / events.length
        }

        for (const event of this.tickEvents.get(playerID)) {
            if (event.directHitPercentage != null) {
                return event.directHitPercentage
            }
        }
    }
}
