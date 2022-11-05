import { Status } from 'types'
import { preserve } from 'util/typeutils'

export const WAR_STATUSES = preserve<Status>()({
    INNER_RELEASE: {
        id: 1177,
    },
})
