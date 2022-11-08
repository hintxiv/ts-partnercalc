import { Status } from 'types'
import { preserve } from 'util/typeutils'
import { DNC_STATUSES } from './DNC'
import { DRG_STATUSES } from './DRG'
import { DRK_STATUSES } from './DRK'
import { MCH_STATUSES } from './MCH'
import { NIN_STATUSES } from './NIN'
import { BUFFS, DEBUFFS } from './raidbuffs'
import { SMN_STATUSES } from './SMN'
import { WAR_STATUSES } from './WAR'

export const STATUSES = preserve<Status>()({
    ...BUFFS,
    ...DEBUFFS,
    ...DNC_STATUSES,
    ...DRG_STATUSES,
    ...DRK_STATUSES,
    ...MCH_STATUSES,
    ...NIN_STATUSES,
    ...SMN_STATUSES,
    ...WAR_STATUSES,
})
