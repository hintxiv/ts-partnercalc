import { Status } from 'types'
import { preserve } from 'util/typeutils'

export const MCH_STATUSES = preserve<Status>()({
    REASSEMBLED: {
        id: 851,
    },
})
