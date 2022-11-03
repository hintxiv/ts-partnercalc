import { Action } from 'types'
import { preserve } from 'util/typeutils'

export const DRG_ACTIONS = preserve<Action>()({
    TRUE_THRUST: {
        name: 'True Thrust',
        id: 75,
        generatesEsprit: true,
    },
    VORPAL_THRUST: {
        name: 'Vorpal Thrust',
        id: 78,
        generatesEsprit: true,
    },
    PIERCING_TALON: {
        name: 'Piercing Talon',
        id: 90,
        generatesEsprit: true,
    },
    FULL_THRUST: {
        name: 'Full Thrust',
        id: 84,
        generatesEsprit: true,
    },
    DISEMBOWEL: {
        name: 'Disembowel',
        id: 87,
        generatesEsprit: true,
    },
    CHAOS_THRUST: {
        name: 'Chaos Thrust',
        id: 88,
        generatesEsprit: true,
    },
    DOOM_SPIKE: {
        name: 'Doom Spike',
        id: 86,
        generatesEsprit: true,
    },
    FANG_AND_CLAW: {
        name: 'Fang and Claw',
        id: 3554,
        generatesEsprit: true,
    },
    WHEELING_THRUST: {
        name: 'Wheeling Thrust',
        id: 3556,
        generatesEsprit: true,
    },
    RAIDEN_THRUST: {
        name: 'Raiden Thrust',
        id: 16479,
        generatesEsprit: true,
    },
    SONIC_THRUST: {
        name: 'Sonic Thrust',
        id: 7397,
        generatesEsprit: true,
    },
    COERTHAN_TORMENT: {
        name: 'Coerthan Torment',
        id: 16477,
        generatesEsprit: true,
    },
    DRACONIAN_FURY: {
        name: 'Draconian Fury',
        id: 25770,
        generatesEsprit: true,
    },
    HEAVENS_THRUST: {
        name: "Heavens' Thrust",
        id: 25771,
        generatesEsprit: true,
    },
    CHAOTIC_SPRING: {
        name: 'Chaotic Spring',
        id: 25772,
        generatesEsprit: true,
    },
})
