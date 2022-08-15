import { simulateStandard } from 'math/rdps'
import { SimulatedDamage } from 'models'
import { CastInstance } from 'simulate/instances'
import { BuffWindow } from './buffwindow'
import { Devilment } from './devilment'

const POTENCY_PER_ESPRIT = 3.68  // per ringabel's calculations
const ESPRIT_PER_WEAPONSKILL = 10
const DEFAULT_ESPRIT_RATE = 0.2

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

    public getPlayerContribution(friendID: number): SimulatedDamage[] {
        const casts = this.casts.getFriendlyCasts(friendID)

        if (!casts) { return [] }

        const simulatedDamage = []

        for (const cast of casts) {
            simulatedDamage.push({
                timestamp: cast.timestamp,
                standard: this.getStandardContribution(cast),
                esprit: this.getEspritContribution(cast),
                devilment: this.getDevilmentContribution(cast),
            })
        }

        return simulatedDamage
    }

    private getStandardContribution(cast: CastInstance): number {
        // return simulateStandard(cast, ...)
        return 0
    }

    private getEspritContribution(_: CastInstance): number {
        // TODO
        return 0
    }

    private getDevilmentContribution(_: CastInstance): number {
        // TODO
        if (!this.devilment) {
            return 0
        }

        return 0
    }
}
