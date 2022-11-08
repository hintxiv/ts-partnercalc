import { Status } from 'types'
import { preserve } from 'util/typeutils'

export const NIN_STATUSES = preserve<Status>()({
    DOTON: {
        id: 501,
        groundDoT: true,
    },
})
