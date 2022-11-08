import { Status } from 'types'
import { preserve } from 'util/typeutils'

export const SMN_STATUSES = preserve<Status>()({
    SLIPSTREAM: {
        id: 2706,
        groundDoT: true,
    },
})
