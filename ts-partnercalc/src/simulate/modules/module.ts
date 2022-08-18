import {
    CastEvent,
    DamageEvent,
    EventType,
    FFLogsEvent,
    TickEvent,
} from 'parse/fflogs/event'
import { EventHook } from 'simulate/hooks'

// Type - ID
export type EventKey = `${EventType}-${number}`

// TargetKey - ActionID
export type CastKey = `${string}-${number}`

// TargetKey - StatusID
export type StatusKey = `${string}-${number}`

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
        return `${event.targetKey}-${event.actionID}`
    }

    protected getStatusKey(event: TickEvent): StatusKey {
        return `${event.targetKey}-${event.statusID}`
    }

    public processEvent(event: FFLogsEvent) {
        // Let dependencies go first
        this.dependencies.forEach(dep => dep.processEvent(event))

        const key = this.getEventKey(event)

        if (this.hooks.has(key)) {
            const hook = this.hooks.get(key)
            hook(event)

        } else if (this.hooks.has(event.type)) {
            const hook = this.hooks.get(event.type)
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
        id: number | 'all',
        hook: EventHook<E>
    ) {
        const key = (id === 'all')
            ? type
            : `${type}-${id}`

        this.hooks.set(key, hook.bind(this))
    }
}
