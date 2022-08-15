import { Status } from 'models'
import { ApplyBuffEvent, ApplyDebuffEvent, RemoveBuffEvent, RemoveDebuffEvent } from 'parse/fflogs/event'
import { Module } from '../module'

/**
 * Represents an Entity in the report
 */
export abstract class Entity extends Module {
    public key: string
    protected activeStatuses: Set<Status['id']> = new Set()

    constructor(key: string) {
        super()
        this.key = key
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
