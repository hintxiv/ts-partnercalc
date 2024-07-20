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
    SCARLET_DELIRIUM: {
        name: 'Scarlet Delirium',
        id: 36928,
        generatesEsprit: true,
    },
    COMEUPPANCE: {
        name: 'Comeuppance',
        id: 36929,
        generatesEsprit: true,
    },
    TORCLEAVER: {
        name: 'Torcleaver',
        id: 36930,
        generatesEsprit: true,
    },
    IMPALEMENT: {
        name: 'Impalement',
        id: 36931,
        generatesEsprit: true,
    },
    DISESTEEM: {
        name: 'Disesteem',
        id: 36932,
        generatesEsprit: true,
    },
})
