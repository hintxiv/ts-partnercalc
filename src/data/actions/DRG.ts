import { Action } from 'types'
import { preserve } from 'util/typeutils'

export const DRG_ACTIONS = preserve<Action>()({
    TRUE_THRUST: {
        name: 'True Thrust',
        id: 75,
        onGCD: true,
        generatesEsprit: true,
    },
    VORPAL_THRUST: {
        name: 'Vorpal Thrust',
        id: 78,
        onGCD: true,
        generatesEsprit: true,
    },
    PIERCING_TALON: {
        name: 'Piercing Talon',
        id: 90,
        onGCD: true,
        generatesEsprit: true,
    },
    FULL_THRUST: {
        name: 'Full Thrust',
        id: 84,
        onGCD: true,
        generatesEsprit: true,
    },
    DISEMBOWEL: {
        name: 'Disembowel',
        id: 87,
        onGCD: true,
        generatesEsprit: true,
    },
    CHAOS_THRUST: {
        name: 'Chaos Thrust',
        id: 88,
        onGCD: true,
        generatesEsprit: true,
    },
    DOOM_SPIKE: {
        name: 'Doom Spike',
        id: 86,
        onGCD: true,
        generatesEsprit: true,
    },
    FANG_AND_CLAW: {
        name: 'Fang and Claw',
        id: 3554,
        onGCD: true,
        generatesEsprit: true,
    },
    WHEELING_THRUST: {
        name: 'Wheeling Thrust',
        id: 3556,
        onGCD: true,
        generatesEsprit: true,
    },
    RAIDEN_THRUST: {
        name: 'Raiden Thrust',
        id: 16479,
        onGCD: true,
        generatesEsprit: true,
    },
    SONIC_THRUST: {
        name: 'Sonic Thrust',
        id: 7397,
        onGCD: true,
        generatesEsprit: true,
    },
    COERTHAN_TORMENT: {
        name: 'Coerthan Torment',
        id: 16477,
        onGCD: true,
        generatesEsprit: true,
    },
    DRACONIAN_FURY: {
        name: 'Draconian Fury',
        id: 25770,
        onGCD: true,
        generatesEsprit: true,
    },
    HEAVENS_THRUST: {
        name: "Heavens' Thrust",
        id: 25771,
        onGCD: true,
        generatesEsprit: true,
    },
    CHAOTIC_SPRING: {
        name: 'Chaotic Spring',
        id: 25772,
        onGCD: true,
        generatesEsprit: true,
    },
    DRAKESBANE: {
        name: 'Drakesbane',
        id: 36952,
        onGCD: true,
        generatesEsprit: true,
    },
    LANCE_BARRAGE: {
        name: 'Lance Barrage',
        id: 36954,
        onGCD: true,
        generatesEsprit: true,
    },
    SPIRAL_BLOW: {
        name: 'Spiral Blow',
        id: 36955,
        onGCD: true,
        generatesEsprit: true,
    },
})
