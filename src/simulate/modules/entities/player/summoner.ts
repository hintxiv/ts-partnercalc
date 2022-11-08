import { Player } from './player'

export class Summoner extends Player {
    protected override init() {
        super.init()

        this.addHook('applybuff', this.onGroundDoTApply, {
            actionID: this.data.statuses.SLIPSTREAM.id,
        })
        this.addHook('removebuff', this.onRemoveStatus, {
            actionID: this.data.statuses.SLIPSTREAM.id,
        })
    }
}
