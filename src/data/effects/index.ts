import { Effect } from 'types'
import { preserve } from 'util/typeutils'
import { RAID_BUFFS, RAID_DEBUFFS } from './raidbuffs'

export const EFFECTS = preserve<Effect>()({
    ...RAID_BUFFS,
    ...RAID_DEBUFFS,
})

export const BUFFS = preserve<Effect>()({
    ...RAID_BUFFS,
})

export const DEBUFFS = preserve<Effect>()({
    ...RAID_DEBUFFS,
})
