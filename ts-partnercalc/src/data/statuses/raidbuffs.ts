import { Status } from 'models/status'
import { preserve } from 'util/typeutils'

export const STATUSES = preserve<Status>()({
    BATTLE_LITANY: {
        id: 786,
    },
    BATTLE_VOICE: {
        id: 141,
    },
    BROTHERHOOD: {
        id: 1185,
    },
    DIVINATION: {
        id: 1878,
    },
    DEVILMENT: {
        id: 1825,
    },
    EMBOLDEN: {
        id: 1297,
    },
    LEFT_EYE: {
        id: 1454,
    },
    MEDICATED: {
        id: 49,
    },
    STANDARD_FINISH: {
        id: 2105,
    },
    TECHNICAL_FINISH: {
        id: 1822,
    },
    ARCANE_CIRCLE: {
        id: 2599,
    },
    RADIANT_FINALE: {
        id: 2964,
    },
    SEARING_LIGHT: {
        id: 2703,
    },
    // AST cards
    // ...

    // Debuffs
    CHAIN_STRATAGEM: {
        id: 1221,
    },
    MUG: {
        id: 638,
    },
})
