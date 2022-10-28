import { Status } from 'models'
import { preserve } from 'util/typeutils'

export const BUFFS = preserve<Status>()({
    BATTLE_LITANY: {
        id: 786,
    },
    BATTLE_VOICE: {
        id: 141,
    },
    DEVILMENT: {
        id: 1825,
    },
    STANDARD_FINISH: {
        id: 2105,
    },
    TECHNICAL_FINISH: {
        id: 1822,
    },
})

export const DEBUFFS = preserve<Status>()({
    // Debuffs
    CHAIN_STRATAGEM: {
        id: 1221,
    },
})
