import { FFLogsEvent } from 'api/fflogs/event'
import { Snapshot, DamageInstance } from '../types/snapshot'

export type EventHook<E extends FFLogsEvent> = (event: E) => void
export type SnapshotHook = (snapshot: Snapshot) => void
export type DamageHook = (damage: DamageInstance) => void
