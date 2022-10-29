export type EventType =
    | 'cast'
    | 'snapshot'
    | 'damage'
    | 'tick'
    | 'applybuff'
    | 'removebuff'
    | 'applydebuff'
    | 'removedebuff'

export interface EventFields
{
    timestamp: number
    sourceID: number
    targetID: number
    targetKey: string
}

export interface CastEvent extends EventFields
{
    type: 'cast'
    actionID: number
}

export interface SnapshotEvent extends EventFields
{
    type: 'snapshot'
    actionID: number
    amount: number
    isCrit: boolean
    isDH: boolean
}

export interface DamageEvent extends EventFields
{
    type: 'damage'
    actionID: number
    amount: number
    isCrit: boolean
    isDH: boolean
}

export interface TickEvent extends EventFields
{
    type: 'tick'
    statusID: number
    amount: number
    expectedCritRate?: number
    actorPotencyRatio?: number
    directHitPercentage?: number
}

export interface ApplyBuffEvent extends EventFields
{
    type: 'applybuff'
    statusID: number
    appliedBy?: number
}

export interface RemoveBuffEvent extends EventFields
{
    type: 'removebuff'
    statusID: number
}

export interface ApplyDebuffEvent extends EventFields
{
    type: 'applydebuff'
    statusID: number
    appliedBy?: number
}

export interface RemoveDebuffEvent extends EventFields
{
    type: 'removedebuff'
    statusID: number
}

export type FFLogsEvent =
    | CastEvent
    | SnapshotEvent
    | DamageEvent
    | TickEvent
    | ApplyBuffEvent
    | RemoveBuffEvent
    | ApplyDebuffEvent
    | RemoveDebuffEvent
