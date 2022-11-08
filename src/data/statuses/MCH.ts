import { Status } from 'types'
import { preserve } from 'util/typeutils'

export const MCH_STATUSES = preserve<Status>()({
    FLAMETHROWER: {
        id: 1205,
        groundDoT: true,
    },
    REASSEMBLED: {
        id: 851,
    },
})
