import { Action } from 'types'
import { preserve } from 'util/typeutils'

export const SCH_ACTIONS = preserve<Action>()({
    RUIN: {
        name: 'Ruin',
        id: 163,
        generatesEsprit: true,
    },
    BIO: {
        name: 'Bio',
        id: 164,
        generatesEsprit: true,
    },
    MIASMA: {
        name: 'Miasma',
        id: 168,
        generatesEsprit: true,
    },
    BIO_II: {
        name: 'Bio II',
        id: 178,
        generatesEsprit: true,
    },
    BIOLYSIS: {
        name: 'Biolysis',
        id: 16540,
        generatesEsprit: true,
    },
    BROIL_III: {
        name: 'Broil III',
        id: 16541,
        generatesEsprit: true,
    },
    RUIN_II: {
        name: 'Ruin II',
        id: 17870,
        generatesEsprit: true,
    },
    ART_OF_WAR: {
        name: 'Art of War',
        id: 16539,
        generatesEsprit: true,
    },
    BROIL: {
        name: 'Broil',
        id: 3584,
        generatesEsprit: true,
    },
    BROIL_II: {
        name: 'Broil II',
        id: 7435,
        generatesEsprit: true,
    },
    BROIL_IV: {
        name: 'Broil IV',
        id: 25865,
        generatesEsprit: true,
    },
    ART_OF_WAR_II: {
        name: 'Art of War II',
        id: 25866,
        generatesEsprit: true,
    },
})
