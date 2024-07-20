import { Action } from 'types'
import { preserve } from 'util/typeutils'

export const BRD_ACTIONS = preserve<Action>()({
    HEAVY_SHOT: {
        name: 'Heavy Shot',
        id: 97,
        generatesEsprit: true,
    },
    VENOMOUS_BITE: {
        name: 'Venomous Bite',
        id: 100,
        generatesEsprit: true,
    },
    QUICK_NOCK: {
        name: 'Quick Nock',
        id: 106,
        generatesEsprit: true,
    },
    STRAIGHT_SHOT: {
        name: 'Straight Shot',
        id: 98,
        generatesEsprit: true,
    },
    WINDBITE: {
        name: 'Windbite',
        id: 113,
        generatesEsprit: true,
    },
    MAGES_BALLAD: {
        name: "Mage's Ballad",
        id: 114,
        generatesEsprit: true,
    },
    ARMYS_PAEON: {
        name: "Army's Paeon",
        id: 116,
        generatesEsprit: true,
    },
    THE_WANDERERS_MINUET: {
        name: "The Wanderer's Minuet",
        id: 3559,
        generatesEsprit: true,
    },
    IRON_JAWS: {
        name: 'Iron Jaws',
        id: 3560,
        generatesEsprit: true,
    },
    CAUSTIC_BITE: {
        name: 'Caustic Bite',
        id: 7406,
        generatesEsprit: true,
    },
    STORMBITE: {
        name: 'Stormbite',
        id: 7407,
        generatesEsprit: true,
    },
    REFULGENT_ARROW: {
        name: 'Refulgent Arrow',
        id: 7409,
        generatesEsprit: true,
    },
    APEX_ARROW: {
        name: 'Apex Arrow',
        id: 16496,
        generatesEsprit: true,
    },
    BURST_SHOT: {
        name: 'Burst Shot',
        id: 16495,
        generatesEsprit: true,
    },
    BLAST_ARROW: {
        name: 'Blast Arrow',
        id: 25784,
        generatesEsprit: true,
    },
    LADONSBITE: {
        name: 'Ladonsbite',
        id: 25783,
        generatesEsprit: true,
    },
    SHADOWBITE: {
        name: 'Shadowbite',
        id: 16494,
        generatesEsprit: true,
    },
    WIDE_VOLLEY: {
        name: 'Wide Volley',
        id: 36974,
        generatesEsprit: true,
    },
    RESONANT_ARROW: {
        name: 'Resonant Arrow',
        id: 36976,
        generatesEsprit: true,
    },
    RADIANT_ENCORE: {
        name: 'Radiant Encore',
        id: 36977,
        generatesEsprit: true,
    },
})
