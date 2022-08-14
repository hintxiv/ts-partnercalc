import { FFLogsEvent } from 'parse/fflogs/event'
import { CastInstance, DamageInstance } from './instances'

export type EventHook<E extends FFLogsEvent> = (event: E) => void
export type CastHook = (cast: CastInstance) => void
export type DamageHook = (damage: DamageInstance) => void
