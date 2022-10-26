import { TickEvent, DamageEvent } from 'api/fflogs/event'
import { Module } from '../module'

export class DHEstimator extends Module {
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

    public estimateDHRate(): number | undefined {
        // No DoTs, give a best guess based on observed DHs
        if (this.tickEvents.length === 0) {
            const events = this.damageEvents

            if (events.length === 0) { return undefined }

            const DHCount = events.filter(event => event.isDH).length
            return DHCount / events.length
        }

        for (const event of this.tickEvents) {
            if (event.directHitPercentage != null) {
                return event.directHitPercentage
            }
        }
    }
}
