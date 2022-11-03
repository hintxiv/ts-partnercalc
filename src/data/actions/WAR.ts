import { Action } from 'types'
import { preserve } from 'util/typeutils'

export const WAR_ACTIONS = preserve<Action>()({
    HEAVY_SWING: {
        name: 'Heavy Swing',
        id: 31,
        generatesEsprit: true,
    },
    OVERPOWER: {
        name: 'Overpower',
        id: 41,
        generatesEsprit: true,
    },
    TOMAHAWK: {
        name: 'Tomahawk',
        id: 46,
        generatesEsprit: true,
    },
    MAIM: {
        name: 'Maim',
        id: 37,
        generatesEsprit: true,
    },
    STORMS_PATH: {
        name: "Storm's Path",
        id: 42,
        generatesEsprit: true,
    },
    STORMS_EYE: {
        name: "Storm's Eye",
        id: 45,
        generatesEsprit: true,
    },
    STEEL_CYCLONE: {
        name: 'Steel Cyclone',
        id: 51,
        generatesEsprit: true,
    },
    DECIMATE: {
        name: 'Decimate',
        id: 3550,
        generatesEsprit: true,
    },
    MYTHRIL_TEMPEST: {
        name: 'Mythril Tempest',
        id: 16462,
        generatesEsprit: true,
    },
    FELL_CLEAVE: {
        name: 'Fell Cleave',
        id: 3549,
        generatesEsprit: true,
    },
    INNER_BEAST: {
        name: 'Inner Beast',
        id: 49,
        generatesEsprit: true,
    },
    INNER_CHAOS: {
        name: 'Inner Chaos',
        id: 16465,
        generatesEsprit: true,
    },
    CHAOTIC_CYCLONE: {
        name: 'Chaotic Cyclone',
        id: 16463,
        generatesEsprit: true,
    },
    PRIMAL_REND: {
        name: 'Primal Rend',
        id: 25753,
        generatesEsprit: true,
    },
    ONSLAUGHT: {
        name: 'Onslaught',
        id: 7386,
        generatesEsprit: true,
    },
    UPHEAVAL: {
        name: 'Upheaval',
        id: 7387,
        generatesEsprit: true,
    },
})
