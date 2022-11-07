import { Player } from './player'

export class Machinist extends Player {
    protected override init() {
        super.init()
        this.addHook('applybuff', this.onApplyStatus, {
            actionID: this.data.statuses.REASSEMBLED.id,
        })
        this.addHook('removebuff', this.onRemoveStatus, {
            actionID: this.data.statuses.REASSEMBLED.id,
        })
    }
}
