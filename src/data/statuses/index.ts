import { Status } from 'types'
import { preserve } from 'util/typeutils'
import { BUFFS, DEBUFFS } from './raidbuffs'

export const STATUSES = preserve<Status>()({
    ...BUFFS,
    ...DEBUFFS,
})
