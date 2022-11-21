import { Player } from './player'

export class Ninja extends Player {
    protected override init() {
        super.init()

        this.addHook('applybuff', this.onGroundDoTApply, {
            actionID: this.data.statuses.DOTON.id,
        })
        this.addHook('removebuff', this.onRemoveStatus, {
            actionID: this.data.statuses.DOTON.id,
        })
    }
}
