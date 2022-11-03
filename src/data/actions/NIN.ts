import { Action } from 'types'
import { preserve } from 'util/typeutils'

export const NIN_ACTIONS = preserve<Action>()({
    SPINNING_EDGE: {
        name: 'Spinning Edge',
        id: 2240,
        generatesEsprit: true,
    },
    GUST_SLASH: {
        name: 'Gust Slash',
        id: 2242,
        generatesEsprit: true,
    },
    AEOLIAN_EDGE: {
        name: 'Aeolian Edge',
        id: 2255,
        generatesEsprit: true,
    },
    SHADOW_FANG: {
        name: 'Shadow Fang',
        id: 2257,
        generatesEsprit: true,
    },
    DEATH_BLOSSOM: {
        name: 'Death Blossom',
        id: 2254,
        generatesEsprit: true,
    },
    THROWING_DAGGER: {
        name: 'Throwing Dagger',
        id: 2247,
        generatesEsprit: true,
    },
    ARMOR_CRUSH: {
        name: 'Armor Crush',
        id: 3563,
        generatesEsprit: true,
    },
    HURAIJIN: {
        name: 'Huraijin',
        id: 25876,
        generatesEsprit: true,
    },
    PHANTOM_KAMAITACHI: {
        name: 'Phantom Kamaitachi',
        id: 25774,
        generatesEsprit: true,
    },
    FORKED_RAIJU: {
        name: 'Forked Raiju',
        id: 25777,
        generatesEsprit: true,
    },
    FLEETING_RAIJU: {
        name: 'Fleeting Raiju',
        id: 25778,
        generatesEsprit: true,
    },
})
