import {
    EventType,
    FFLogsEvent,
    TickEvent,
} from 'api/fflogs/event'
import { EventHook } from 'simulate/hooks'

// TargetKey - StatusID
export type SnapshotKey = `${string}-${number}`

export interface Filter {
    sourceID?: number
    actionID?: number
}

export abstract class Module {
    protected hooks: Map<string, Array< EventHook<FFLogsEvent> >> = new Map()
    public dependencies: Module[] = []

    protected abstract init(): void

    protected addDependency(dep: Module) {
        this.dependencies.push(dep)
    }

    protected getSnapshotKey(event: TickEvent): SnapshotKey {
        return `${event.targetKey}-${event.statusID}`
    }

    public processEvent(event: FFLogsEvent) {
        // Let dependencies go first
        this.dependencies.forEach(dep => dep.processEvent(event))

        // Run each matching hook
        this.getHooks(event).forEach(hook => hook(event))
    }

    private serializeFilter(filter: Filter): string {
        return `source=${filter.sourceID ?? -1},action=${filter.actionID ?? -1}`
    }

    protected makeHookKey(type: EventType, filter?: Filter): string {
        let key: string = type

        if (filter != null) {
            key += ',' + this.serializeFilter(filter)
        }

        return key
    }

    // Add a callback hook with optional sourceID / actionID filters
    protected addHook<
        T extends EventType,
        E extends Extract<FFLogsEvent, { type: T }>,
    > (
        type: T,
        hook: EventHook<E>,
        filter?: Filter
    ) {
        const key = this.makeHookKey(type, filter)
        const hooks = this.hooks.get(key)

        if (hooks == null) {
            this.hooks.set(key, [hook.bind(this)])
        } else {
            hooks.push(hook.bind(this))
        }
    }

    // Get all hooks that might match the given Event
    protected getHooks(event: FFLogsEvent): Array< EventHook<FFLogsEvent> > {
        const hooks = []

        const possibleKeys = [
            this.makeHookKey(event.type),
            this.makeHookKey(event.type, { sourceID: event.sourceID }),
        ]

        if ('actionID' in event) {
            possibleKeys.push(this.makeHookKey(event.type, { actionID: event.actionID }))
            possibleKeys.push(this.makeHookKey(event.type, {
                sourceID: event.sourceID,
                actionID: event.actionID,
            }))
        }

        if ('statusID' in event) {
            possibleKeys.push(this.makeHookKey(event.type, { actionID: event.statusID }))
            possibleKeys.push(this.makeHookKey(event.type, {
                sourceID: event.sourceID,
                actionID: event.statusID,
            }))
        }

        for (const key of possibleKeys) {
            if (this.hooks.has(key)) {
                hooks.push(...this.hooks.get(key))
            }
        }

        return hooks
    }
}
