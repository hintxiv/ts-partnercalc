import { RAID_DEBUFFS } from 'data/raidbuffs'
import { Effect, Status } from 'models'
import { Entity } from './entity'

/**
 * Represents an Enemy entity in the report
 */
export class Enemy extends Entity {
    private debuffs: Map<Status['id'], Effect> = new Map()

    constructor(targetKey: string) {
        super(targetKey)
        this.init()
    }

    protected init() {
        // Add hooks for raid buffs (chain, mug)
        RAID_DEBUFFS.forEach(debuff => {
            this.debuffs.set(debuff.id, debuff.effect)
            this.addHook('applydebuff', debuff.id, this.onApplyStatus)
            this.addHook('removedebuff', debuff.id, this.onRemoveStatus)
        })
    }

    public get activeDebuffs(): Effect[] {
        const debuffs = []

        for (const [statusID, effect] of this.debuffs) {
            if (this.hasStatus(statusID)) {
                debuffs.push(effect)
            }
        }

        return debuffs
    }
}
