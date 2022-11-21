import {
    ApplyBuffEvent,
    ApplyDebuffEvent,
    RemoveBuffEvent,
    RemoveDebuffEvent,
} from 'api/fflogs/event'
import { DataProvider } from 'data/provider'
import { Effect, Status } from 'types'
import { Module } from '../module'

/**
 * Represents an Entity in the report
 */
export abstract class Entity extends Module {
    public key: string
    protected activeStatuses: Set<Status['id']> = new Set()
    protected data: DataProvider

    constructor(key: string, data: DataProvider) {
        super()
        this.key = key
        this.data = data
    }

    public get activeEffects(): Effect[] {
        const effects: Effect[] = []

        this.activeStatuses.forEach(statusID => {
            const effect = this.data.getEffect(statusID)
            if (effect != null) {
                effects.push(effect)
            }
        })

        return effects
    }

    protected hasStatus(statusID: number) {
        return this.activeStatuses.has(statusID)
    }

    protected onApplyStatus(event: ApplyBuffEvent | ApplyDebuffEvent) {
        this.activeStatuses.add(event.statusID)
    }

    protected onRemoveStatus(event: RemoveBuffEvent | RemoveDebuffEvent) {
        this.activeStatuses.delete(event.statusID)
    }
}
