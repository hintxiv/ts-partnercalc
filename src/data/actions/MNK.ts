import { Action } from 'types'
import { preserve } from 'util/typeutils'

export const MNK_ACTIONS = preserve<Action>()({
    BOOTSHINE: {
        name: 'Bootshine',
        id: 53,
        generatesEsprit: true,
        autoCrit: true,
    },
    TRUE_STRIKE: {
        name: 'True Strike',
        id: 54,
        generatesEsprit: true,
    },
    SNAP_PUNCH: {
        name: 'Snap Punch',
        id: 56,
        generatesEsprit: true,
    },
    TWIN_SNAKES: {
        name: 'Twin Snakes',
        id: 61,
        generatesEsprit: true,
    },
    ARM_OF_THE_DESTROYER: {
        name: 'Arm of the Destroyer',
        id: 62,
        generatesEsprit: true,
    },
    DEMOLISH: {
        name: 'Demolish',
        id: 66,
        generatesEsprit: true,
    },
    ROCKBREAKER: {
        name: 'Rockbreaker',
        id: 70,
        generatesEsprit: true,
    },
    DRAGON_KICK: {
        name: 'Dragon Kick',
        id: 74,
        generatesEsprit: true,
    },
    FOUR_POINT_FURY: {
        name: 'Four Point Fury',
        id: 16473,
        generatesEsprit: true,
    },
    SIX_SIDED_STAR: {
        name: 'Six-sided Star',
        id: 16476,
        generatesEsprit: true,
    },
    ELIXIR_FIELD: {
        name: 'Elixir Field',
        id: 3545,
        generatesEsprit: true,
    },
    RISING_PHOENIX: {
        name: 'Rising Phoenix',
        id: 25768,
        generatesEsprit: true,
    },
    PHANTOM_RUSH: {
        name: 'Phantom Rush',
        id: 25769,
        generatesEsprit: true,
    },
    SHADOW_OF_THE_DESTROYER: {
        name: 'Shadow of the Destroyer',
        id: 25767,
        generatesEsprit: true,
        autoCrit: true,
    },
    TORNADO_KICK: {
        name: 'Tornado Kick',
        id: 3543,
        generatesEsprit: true,
    },
    CELESTIAL_REVOLUTION: {
        name: 'Celestial Revolution',
        id: 25765,
        generatesEsprit: true,
    },
    FLINT_STRIKE: {
        name: 'Flint Strike',
        id: 25882,
        generatesEsprit: true,
    },
    LEAPING_OPO: {
        name: 'Leaping Opo',
        id: 36945,
        generatesEsprit: true,
        autoCrit: true,
    },
    RISING_RAPTOR: {
        name: 'Rising Raptor',
        id: 36946,
        generatesEsprit: true,
    },
    POUNCING_COEURL: {
        name: 'Pouncing Coeurl',
        id: 36947,
        generatesEsprit: true,
    },
    ELIXIR_BURST: {
        name: 'Elixir Burst',
        id: 36948,
        generatesEsprit: true,
    },
    WINDS_REPLY: {
        name: 'Wind\'s Reply',
        id: 36949,
        generatesEsprit: true,
    },
    FIRES_REPLY: {
        name: 'Fire\'s Reply',
        id: 36950,
        generatesEsprit: true,
    },
})
