import { DataProvider } from 'data/provider'
import { Effect } from 'types'
import { Entity } from './entity'

/**
 * Represents an Enemy entity in the report
 */
export class Enemy extends Entity {
    private data: DataProvider

    constructor(targetKey: string, data: DataProvider) {
        super(targetKey)
        this.data = data
        this.init()
    }

    protected init() {
        // Add hooks for raid buffs (chain, mug)
        Object.values(this.data.debuffs).forEach(debuff => {
            this.addHook('applydebuff', this.onApplyStatus, { actionID: debuff.id })
            this.addHook('removedebuff', this.onRemoveStatus, { actionID: debuff.id })
        })
    }

    public get activeDebuffs(): Effect[] {
        const effects: Effect[] = []

        this.activeStatuses.forEach(statusID => {
            const effect = this.data.getEffect(statusID)
            if (effect != null) {
                effects.push(effect)
            }
        })

        return effects
    }
}
