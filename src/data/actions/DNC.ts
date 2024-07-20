import { Action } from 'types'
import { preserve } from 'util/typeutils'

export const DNC_ACTIONS = preserve<Action>()({
    DOUBLE_STANDARD_FINISH: {
        name: 'Double Standard Finish',
        id: 16192,
        potency: 720,
        falloff: true,
    },
    QUADRUPLE_TECHNICAL_FINISH: {
        name: 'Quadruple Technical Finish',
        id: 16196,
        potency: 1200,
        falloff: true,
    },
    CASCADE: {
        name: 'Cascade',
        id: 15989,
        potency: 220,
        generatesEsprit: true,
    },
    FOUNTAIN: {
        name: 'Fountain',
        id: 15990,
        potency: 280,
        generatesEsprit: true,
    },
    REVERSE_CASCADE: {
        name: 'Reverse Cascade',
        id: 15991,
        potency: 280,
        generatesEsprit: true,
    },
    FOUNTAINFALL: {
        name: 'Fountainfall',
        id: 15992,
        potency: 340,
        generatesEsprit: true,
    },
    WINDMILL: {
        name: 'Windmill',
        id: 15993,
        potency: 100,
        generatesEsprit: true,
    },
    BLADESHOWER: {
        name: 'Bladeshower',
        id: 15994,
        potency: 140,
        generatesEsprit: true,
    },
    RISING_WINDMILL: {
        name: 'Rising Windmill',
        id: 15995,
        potency: 140,
        generatesEsprit: true,
    },
    BLOODSHOWER: {
        name: 'Bloodshower',
        id: 15996,
        potency: 180,
        generatesEsprit: true,
    },
    SABER_DANCE: {
        name: 'Saber Dance',
        id: 16005,
        potency: 480,
        falloff: true,
    },
    FAN_DANCE: {
        name: 'Fan Dance',
        id: 16007,
        potency: 150,
    },
    FAN_DANCE_II: {
        name: 'Fan Dance II',
        id: 16008,
        potency: 100,
    },
    FAN_DANCE_III: {
        name: 'Fan Dance III',
        id: 16009,
        potency: 200,
        falloff: true,
    },
    FAN_DANCE_IV: {
        name: 'Fan Dance IV',
        id: 25791,
        potency: 300,
        falloff: true,
    },
    TILLANA: {
        name: 'Tillana',
        id: 25790,
        potency: 360,
        falloff: true,
    },
    STARFALL_DANCE: {
        name: 'Starfall Dance',
        id: 25792,
        potency: 600,
        falloff: true,
        autoCrit: true,
        autoDH: true,
    },
    DEVILMENT: {
        name: 'Devilment',
        id: 16011,
    },
    CLOSED_POSITION: {
        name: 'Closed Position',
        id: 16006,
    },
    FINISHING_MOVE: {
        name: 'Finishing Move',
        id: 36984,
        potency: 850,
        falloff: true,
    },
})
