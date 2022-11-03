import { Action } from 'types'
import { preserve } from 'util/typeutils'

export const BLM_ACTIONS = preserve<Action>()({
    BLIZZARD_I: {
        name: 'Blizzard I',
        id: 142,
        generatesEsprit: true,
    },
    BLIZZARD_II: {
        name: 'Blizzard II',
        id: 146,
        generatesEsprit: true,
    },
    BLIZZARD_III: {
        name: 'Blizzard III',
        id: 154,
        generatesEsprit: true,
    },
    BLIZZARD_IV: {
        name: 'Blizzard IV',
        id: 3576,
        generatesEsprit: true,
    },
    FREEZE: {
        name: 'Freeze',
        id: 159,
        generatesEsprit: true,
    },
    FIRE_I: {
        name: 'Fire I',
        id: 141,
        generatesEsprit: true,
    },
    FIRE_II: {
        name: 'Fire II',
        id: 147,
        generatesEsprit: true,
    },
    FIRE_III: {
        name: 'Fire III',
        id: 152,
        generatesEsprit: true,
    },
    FIRE_IV: {
        name: 'Fire IV',
        id: 3577,
        generatesEsprit: true,
    },
    FLARE: {
        name: 'Flare',
        id: 162,
        generatesEsprit: true,
    },
    DESPAIR: {
        name: 'Despair',
        id: 16505,
        generatesEsprit: true,
    },
    THUNDER: {
        name: 'Thunder',
        id: 144,
        generatesEsprit: true,
    },
    THUNDER_II: {
        name: 'Thunder II',
        id: 7447,
        generatesEsprit: true,
    },
    THUNDER_III: {
        name: 'Thunder III',
        id: 153,
        generatesEsprit: true,
    },
    THUNDER_IV: {
        name: 'Thunder IV',
        id: 7420,
        generatesEsprit: true,
    },
    SCATHE: {
        name: 'Scathe',
        id: 156,
        generatesEsprit: true,
    },
    FOUL: {
        name: 'Foul',
        id: 7422,
        generatesEsprit: true,
    },
    XENOGLOSSY: {
        name: 'Xenoglossy',
        id: 16507,
        generatesEsprit: true,
    },
    HIGH_FIRE_II: {
        name: 'High Fire II',
        id: 25794,
        generatesEsprit: true,
    },
    HIGH_BLIZZARD_II: {
        name: 'High Blizzard II',
        id: 25795,
        generatesEsprit: true,
    },
    PARADOX: {
        name: 'Paradox',
        id: 25797,
        generatesEsprit: true,
    },
})
