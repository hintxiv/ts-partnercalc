import { ComputedDamage } from 'models'
import { CastInstance } from 'simulate/instances'
import { BuffWindow } from './buffwindow'
import { Devilment } from './devilment'

// const POTENCY_PER_ESPRIT = 3.68  // per ringabel's calculations
// const ESPRIT_PER_WEAPONSKILL = 10
// const DEFAULT_ESPRIT_RATE = 0.2

export class Standard extends BuffWindow {
    private devilment?: Devilment
    private isTillana: boolean

    constructor(start: number, target: number, isTillana: boolean) {
        super(start, target)
        this.isTillana = isTillana
    }

    public override processCast(cast: CastInstance) {
        super.processCast(cast)

        if (this.devilment) {
            this.devilment.processCast(cast)
        }
    }

    public addDevilment(devilment: Devilment) {
        this.devilment = devilment
    }

    public getPlayerContribution(friendID: number): ComputedDamage[] {
        const casts = this.casts.getFriendlyCasts(friendID)

        if (!casts) { return [] }

        const computedDamage = []

        for (const cast of casts) {
            computedDamage.push({
                timestamp: cast.timestamp,
                standard: this.getStandardContribution(cast),
                esprit: this.getEspritContribution(cast),
                devilment: this.getDevilmentContribution(cast),
            })
        }

        return computedDamage
    }

    private getStandardContribution(cast: CastInstance): number {
        // Need to wire player stats here
        //return simulateStandard(cast, stats, effects, !!this.devilment, isRealPartner)
        return cast.damage.reduce((total, damage) => total + damage.amount * 0.05, 0)
    }

    private getEspritContribution(cast: CastInstance): number {
        // TODO
        return cast.damage.reduce((total, damage) => total + damage.amount * 0.01, 0)
    }

    private getDevilmentContribution(cast: CastInstance): number {
        if (!this.devilment) {
            return 0
        }

        // TODO
        return cast.damage.reduce((total, damage) => total + damage.amount * 0.03, 0)
    }
}
