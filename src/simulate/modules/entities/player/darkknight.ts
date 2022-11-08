import { Player } from './player'

export class DarkKnight extends Player {
    protected override init() {
        super.init()

        this.addHook('applybuff', this.onGroundDoTApply, {
            actionID: this.data.statuses.SALTED_EARTH.id,
        })
        this.addHook('removebuff', this.onRemoveStatus, {
            actionID: this.data.statuses.SALTED_EARTH.id,
        })
    }
}
