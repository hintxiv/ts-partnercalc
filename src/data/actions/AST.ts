import { Action } from 'types'
import { preserve } from 'util/typeutils'

export const AST_ACTIONS = preserve<Action>()({
    MALEFIC_III: {
        name: 'Malefic III',
        id: 7442,
        generatesEsprit: true,
    },
    MALEFIC_IV: {
        name: 'Malefic IV',
        id: 16555,
        generatesEsprit: true,
    },
    COMBUST_II: {
        name: 'Combust II',
        id: 3608,
        generatesEsprit: true,
    },
    COMBUST_III: {
        name: 'Combust III',
        id: 16554,
        generatesEsprit: true,
    },
    GRAVITY: {
        name: 'Gravity',
        id: 3615,
        generatesEsprit: true,
    },
    FALL_MALEFIC: {
        name: 'Fall Malefic',
        id: 25871,
        generatesEsprit: true,
    },
    GRAVITY_II: {
        name: 'Gravity II',
        id: 25872,
        generatesEsprit: true,
    },
    MACROCOSMOS: {
        name: 'Macrocosmos',
        id: 25874,
        generatesEsprit: true,
    },
})
