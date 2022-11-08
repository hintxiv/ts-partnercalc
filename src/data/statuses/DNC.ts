import { Status } from 'types'
import { preserve } from 'util/typeutils'

export const DNC_STATUSES = preserve<Status>()({
    DANCE_PARTNER: {
        id: 1824,
    },
})
