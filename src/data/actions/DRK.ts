import { Action } from 'types'
import { preserve } from 'util/typeutils'

export const DRK_ACTIONS = preserve<Action>()({
    HARD_SLASH: {
        name: 'Hard Slash',
        id: 3617,
        generatesEsprit: true,
    },
    SYPHON_STRIKE: {
        name: 'Syphon Strike',
        id: 3623,
        generatesEsprit: true,
    },
    SOULEATER: {
        name: 'Souleater',
        id: 3632,
        generatesEsprit: true,
    },
    UNLEASH: {
        name: 'Unleash',
        id: 3621,
        generatesEsprit: true,
    },
    STALWART_SOUL: {
        name: 'Stalwart Soul',
        id: 16468,
        generatesEsprit: true,
    },
    BLOODSPILLER: {
        name: 'Bloodspiller',
        id: 7392,
        generatesEsprit: true,
    },
    QUIETUS: {
        name: 'Quietus',
        id: 7391,
        generatesEsprit: true,
    },
})
