import { Status } from 'types'
import { preserve } from 'util/typeutils'

export const DRG_STATUSES = preserve<Status>()({
    LIFE_SURGE: {
        id: 116,
    },
})
