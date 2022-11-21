import { DataProvider } from 'data/provider'
import { Entity } from './entity'

/**
 * Represents an Enemy entity in the report
 */
export class Enemy extends Entity {
    constructor(targetKey: string, data: DataProvider) {
        super(targetKey, data)
        this.init()
    }

    protected init() {
        // Add hooks for raid buffs (chain, mug)
        Object.values(this.data.debuffs).forEach(debuff => {
            this.addHook('applydebuff', this.onApplyStatus, { actionID: debuff.id })
            this.addHook('removedebuff', this.onRemoveStatus, { actionID: debuff.id })
        })
    }
}
