import { Action } from 'types'
import { preserve } from 'util/typeutils'

export const DNC_ACTIONS = preserve<Action>()({
    DOUBLE_STANDARD_FINISH: {
        name: 'Double Standard Finish',
        id: 16192,
        generatesEsprit: true,
    },
    QUADRUPLE_TECHNICAL_FINISH: {
        name: 'Quadruple Technical Finish',
        id: 16196,
        generatesEsprit: true,
    },
    CASCADE: {
        name: 'Cascade',
        id: 15989,
        generatesEsprit: true,
    },
    FOUNTAIN: {
        name: 'Fountain',
        id: 15990,
        generatesEsprit: true,
    },
    REVERSE_CASCADE: {
        name: 'Reverse Cascade',
        id: 15991,
        generatesEsprit: true,
    },
    FOUNTAINFALL: {
        name: 'Fountainfall',
        id: 15992,
        generatesEsprit: true,
    },
    WINDMILL: {
        name: 'Windmill',
        id: 15993,
        generatesEsprit: true,
    },
    BLADESHOWER: {
        name: 'Bladeshower',
        id: 15994,
        generatesEsprit: true,
    },
    RISING_WINDMILL: {
        name: 'Rising Windmill',
        id: 15995,
        generatesEsprit: true,
    },
    BLOODSHOWER: {
        name: 'Bloodshower',
        id: 15996,
        generatesEsprit: true,
    },
    SABER_DANCE: {
        name: 'Saber Dance',
        id: 16005,
        generatesEsprit: true,
    },
    FAN_DANCE: {
        name: 'Fan Dance',
        id: 16007,
    },
    FAN_DANCE_II: {
        name: 'Fan Dance II',
        id: 16008,
    },
    FAN_DANCE_III: {
        name: 'Fan Dance III',
        id: 16009,
    },
    FAN_DANCE_IV: {
        name: 'Fan Dance IV',
        id: 25791,
    },
    TILLANA: {
        name: 'Tillana',
        id: 25790,
        generatesEsprit: true,
    },
    STARFALL_DANCE: {
        name: 'Starfall Dance',
        id: 25792,
        generatesEsprit: true,
    },
})
