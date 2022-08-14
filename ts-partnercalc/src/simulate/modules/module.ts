import {
    CastEvent,
    DamageEvent,
    EventType,
    FFLogsEvent,
} from 'parse/fflogs/event'
import { EventHook } from 'simulate/hooks'

// Type - ID
export type EventKey = `${EventType}-${number}`

// TargetID - ActionID
export type CastKey = `${number}-${number}`

export abstract class Module {
    protected hooks: Map<string, EventHook<FFLogsEvent>> = new Map()
    public dependencies: Module[] = []

    protected abstract init(): void

    protected addDependency(dep: Module) {
        this.dependencies.push(dep)
    }

    protected getEventKey(event: FFLogsEvent): EventKey {
        const id = (event.type === 'cast' || event.type === 'damage')
            ? event.actionID : event.statusID

        return `${event.type}-${id}` as EventKey
    }

    protected getCastKey(event: CastEvent | DamageEvent): CastKey {
        const target = event.targetID ?? 0
        return `${target}-${event.actionID}` as CastKey
    }

    public processEvent(event: FFLogsEvent) {
        // Let dependencies go first
        this.dependencies.forEach(dep => dep.processEvent(event))

        const key = this.getEventKey(event)

        if (this.hooks.has(key)) {
            const hook = this.hooks.get(key)
            hook(event)
        }
    }

    /**
     * Add a callback hook to this module. The generics say:
     *  "the hook must only consume events with the given type"
     *
     *   -> Only one hook per action / type combination is permitted!
     */
    protected addHook<
        T extends EventType,
        E extends Extract<FFLogsEvent, { type: T }>,
    > (
        type: T,
        id: number,
        hook: EventHook<E>
    ) {
        const key = `${type}-${id}`

        this.hooks.set(key, hook.bind(this))
    }
}
