import { Status } from 'types'
import { preserve } from 'util/typeutils'

export const DRK_STATUSES = preserve<Status>()({
    SALTED_EARTH: {
        id: 749,
        groundDoT: true,
    },
})
