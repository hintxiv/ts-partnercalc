import { Status } from 'types'
import { preserve } from 'util/typeutils'
import { DRG_STATUSES } from './DRG'
import { MCH_STATUSES } from './MCH'
import { BUFFS, DEBUFFS } from './raidbuffs'
import { WAR_STATUSES } from './WAR'

export const STATUSES = preserve<Status>()({
    ...BUFFS,
    ...DEBUFFS,
    ...DRG_STATUSES,
    ...MCH_STATUSES,
    ...WAR_STATUSES,
})
