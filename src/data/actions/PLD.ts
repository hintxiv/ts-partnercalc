import { Action } from 'types'
import { preserve } from 'util/typeutils'

export const PLD_ACTIONS = preserve<Action>()({
    FAST_BLADE: {
        name: 'Fast Blade',
        id: 9,
        generatesEsprit: true,
    },
    RIOT_BLADE: {
        name: 'Riot Blade',
        id: 15,
        generatesEsprit: true,
    },
    SHIELD_LOB: {
        name: 'Shield Lob',
        id: 24,
        generatesEsprit: true,
    },
    SHIELD_BASH: {
        name: 'Shield Bash',
        id: 16,
        generatesEsprit: true,
    },
    RAGE_OF_HALONE: {
        name: 'Rage of Halone',
        id: 21,
        generatesEsprit: true,
    },
    TOTAL_ECLIPSE: {
        name: 'Total Eclipse',
        id: 7381,
        generatesEsprit: true,
    },
    PROMINENCE: {
        name: 'Prominence',
        id: 16457,
        generatesEsprit: true,
    },
    GORING_BLADE: {
        name: 'Goring Blade',
        id: 3538,
        generatesEsprit: true,
    },
    ROYAL_AUTHORITY: {
        name: 'Royal Authority',
        id: 3539,
        generatesEsprit: true,
    },
    HOLY_SPIRIT: {
        name: 'Holy Spirit',
        id: 7384,
        generatesEsprit: true,
    },
    HOLY_CIRCLE: {
        name: 'Holy Circle',
        id: 16458,
        generatesEsprit: true,
    },
    ATONEMENT: {
        name: 'Atonement',
        id: 16460,
        generatesEsprit: true,
    },
    CONFITEOR: {
        name: 'Confiteor',
        id: 16459,
        generatesEsprit: true,
    },
    BLADE_OF_FAITH: {
        name: 'Blade of Faith',
        id: 25748,
        generatesEsprit: true,
    },
    BLADE_OF_TRUTH: {
        name: 'Blade of Truth',
        id: 25749,
        generatesEsprit: true,
    },
    BLADE_OF_VALOR: {
        name: 'Blade of Valor',
        id: 25750,
        generatesEsprit: true,
    },
    SUPPLICATION: {
        name: 'Supplication',
        id: 36918,
        generatesEsprit: true,
    },
    SEPULCHRE: {
        name: 'Sepulchre',
        id: 36919,
        generatesEsprit: true,
    },
})
