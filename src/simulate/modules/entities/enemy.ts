import { DEBUFFS, RAID_DEBUFFS } from 'data/raidbuffs'
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
        Object.values(DEBUFFS).forEach(status => {
            this.debuffs.set(status.id, RAID_DEBUFFS[status.id].effect)
            this.addHook('applydebuff', this.onApplyStatus, { actionID: status.id })
            this.addHook('removedebuff', this.onRemoveStatus, { actionID: status.id })
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
