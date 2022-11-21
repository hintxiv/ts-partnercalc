import { Player } from './player'

export class Dragoon extends Player {
    protected override init() {
        super.init()

        this.addHook('applybuff', this.onApplyStatus, {
            actionID: this.data.statuses.LIFE_SURGE.id,
        })
        this.addHook('removebuff', this.onRemoveStatus, {
            actionID: this.data.statuses.LIFE_SURGE.id,
        })
    }
}
