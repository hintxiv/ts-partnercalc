import { Action } from 'types'
import { preserve } from 'util/typeutils'

export const WAR_ACTIONS = preserve<Action>()({
    HEAVY_SWING: {
        name: 'Heavy Swing',
        id: 31,
        onGCD: true,
        generatesEsprit: true,
    },
    OVERPOWER: {
        name: 'Overpower',
        id: 41,
        onGCD: true,
        generatesEsprit: true,
    },
    TOMAHAWK: {
        name: 'Tomahawk',
        id: 46,
        onGCD: true,
        generatesEsprit: true,
    },
    MAIM: {
        name: 'Maim',
        id: 37,
        onGCD: true,
        generatesEsprit: true,
    },
    STORMS_PATH: {
        name: "Storm's Path",
        id: 42,
        onGCD: true,
        generatesEsprit: true,
    },
    STORMS_EYE: {
        name: "Storm's Eye",
        id: 45,
        onGCD: true,
        generatesEsprit: true,
    },
    STEEL_CYCLONE: {
        name: 'Steel Cyclone',
        id: 51,
        onGCD: true,
        generatesEsprit: true,
    },
    DECIMATE: {
        name: 'Decimate',
        id: 3550,
        onGCD: true,
        generatesEsprit: true,
    },
    MYTHRIL_TEMPEST: {
        name: 'Mythril Tempest',
        id: 16462,
        onGCD: true,
        generatesEsprit: true,
    },
    FELL_CLEAVE: {
        name: 'Fell Cleave',
        id: 3549,
        onGCD: true,
        generatesEsprit: true,
    },
    INNER_BEAST: {
        name: 'Inner Beast',
        id: 49,
        onGCD: true,
        generatesEsprit: true,
    },
    INNER_CHAOS: {
        name: 'Inner Chaos',
        id: 16465,
        onGCD: true,
        generatesEsprit: true,
        autoCrit: true,
        autoDH: true,
    },
    CHAOTIC_CYCLONE: {
        name: 'Chaotic Cyclone',
        id: 16463,
        onGCD: true,
        generatesEsprit: true,
        autoCrit: true,
        autoDH: true,
    },
    PRIMAL_REND: {
        name: 'Primal Rend',
        id: 25753,
        onGCD: true,
        generatesEsprit: true,
        autoCrit: true,
        autoDH: true,
    },
    ONSLAUGHT: {
        name: 'Onslaught',
        id: 7386,
        onGCD: true,
        generatesEsprit: true,
    },
    UPHEAVAL: {
        name: 'Upheaval',
        id: 7387,
        onGCD: true,
        generatesEsprit: true,
    },
})
