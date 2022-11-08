import { Player } from './player'

export class Machinist extends Player {
    protected override init() {
        super.init()

        // Auto-crit statuses
        this.addHook('applybuff', this.onApplyStatus, {
            actionID: this.data.statuses.REASSEMBLED.id,
        })
        this.addHook('removebuff', this.onRemoveStatus, {
            actionID: this.data.statuses.REASSEMBLED.id,
        })

        // Ground DoTs
        this.addHook('applybuff', this.onGroundDoTApply, {
            actionID: this.data.statuses.FLAMETHROWER.id,
        })
        this.addHook('removebuff', this.onRemoveStatus, {
            actionID: this.data.statuses.FLAMETHROWER.id,
        })
    }
}
