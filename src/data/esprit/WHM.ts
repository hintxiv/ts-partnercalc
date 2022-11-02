import { Action } from 'types'
import { preserve } from 'util/typeutils'

export const WHM_ACTIONS = preserve<Action>()({
    AFFLATUS_MISERY: {
        name: 'Afflatus Misery',
        id: 16535,
        generatesEsprit: true,
    },
    DIA: {
        name: 'Dia',
        id: 16532,
        generatesEsprit: true,
    },
    GLARE: {
        name: 'Glare',
        id: 16533,
        generatesEsprit: true,
    },
    STONE_IV: {
        name: 'Stone IV',
        id: 7431,
        generatesEsprit: true,
    },
    HOLY: {
        name: 'Holy',
        id: 139,
        generatesEsprit: true,
    },
    STONE_III: {
        name: 'Stone III',
        id: 3568,
        generatesEsprit: true,
    },
    AERO_II: {
        name: 'Aero II',
        id: 132,
        generatesEsprit: true,
    },
    STONE: {
        name: 'Stone',
        id: 119,
        generatesEsprit: true,
    },
    AERO: {
        name: 'Aero',
        id: 121,
        generatesEsprit: true,
    },
    STONE_II: {
        name: 'Stone II',
        id: 127,
        generatesEsprit: true,
    },
    GLARE_III: {
        name: 'Glare III',
        id: 25859,
        generatesEsprit: true,
    },
    HOLY_III: {
        name: 'Holy III',
        id: 25860,
        generatesEsprit: true,
    },
})
