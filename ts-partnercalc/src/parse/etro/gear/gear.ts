import { Slot } from 'parse/etro/api'
import { Stats } from './stats'

export type GearGroup =
    | 'weapon'
    | 'offHand'
    | 'body'
    | 'head'
    | 'accessory'

export const gearMap: Record<Slot, GearGroup> = {
    weapon: 'weapon',
    head: 'head',
    body: 'body',
    hands: 'head',
    waist: 'accessory',
    legs: 'body',
    feet: 'head',
    offHand: 'offHand',
    ears: 'accessory',
    neck: 'accessory',
    wrists: 'accessory',
    fingerL: 'accessory',
    fingerR: 'accessory',
}

export interface Gear
{
    name: string
    gearGroup: GearGroup
    itemLevel: number
    stats: Partial<Stats>
    advancedMelding: boolean
    materiaStats?: Partial<Stats>
    maxSubstat: number
}

export interface Food
{
    name: string
    stats: Array<{
        stat: keyof Stats
        max: number
        multiplier: number
    }>
}

export interface Gearset
{
    id: string
    name: string
    stats: Stats
    food?: Food
    gear?: Gear[]
}
