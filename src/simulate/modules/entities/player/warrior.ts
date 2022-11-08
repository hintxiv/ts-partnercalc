import { Player } from './player'

export class Warrior extends Player {
    protected override init() {
        super.init()
        this.addHook('applybuff', this.onApplyStatus, {
            actionID: this.data.statuses.INNER_RELEASE.id,
        })
        this.addHook('removebuff', this.onRemoveStatus, {
            actionID: this.data.statuses.INNER_RELEASE.id,
        })
    }
}
