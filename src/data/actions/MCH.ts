import { Action } from 'types'
import { preserve } from 'util/typeutils'

export const MCH_ACTIONS = preserve<Action>()({
    SPLIT_SHOT: {
        name: 'Split Shot',
        id: 2866,
        generatesEsprit: true,
    },
    SLUG_SHOT: {
        name: 'Slug Shot',
        id: 2868,
        generatesEsprit: true,
    },
    SPREAD_SHOT: {
        name: 'Spread Shot',
        id: 2870,
        generatesEsprit: true,
    },
    HOT_SHOT: {
        name: 'Hot Shot',
        id: 2872,
        generatesEsprit: true,
    },
    CLEAN_SHOT: {
        name: 'Clean Shot',
        id: 2873,
        generatesEsprit: true,
    },
    HEATED_SPLIT_SHOT: {
        name: 'Heated Split Shot',
        id: 7411,
        generatesEsprit: true,
    },
    HEATED_SLUG_SHOT: {
        name: 'Heated Slug Shot',
        id: 7412,
        generatesEsprit: true,
    },
    HEATED_CLEAN_SHOT: {
        name: 'Heated Clean Shot',
        id: 7413,
        generatesEsprit: true,
    },
    HEAT_BLAST: {
        name: 'Heat Blast',
        id: 7410,
        generatesEsprit: true,
    },
    AUTO_CROSSBOW: {
        name: 'Auto Crossbow',
        id: 16497,
        generatesEsprit: true,
    },
    DRILL: {
        name: 'Drill',
        id: 16498,
        generatesEsprit: true,
    },
    BIOBLASTER: {
        name: 'Bioblaster',
        id: 16499,
        generatesEsprit: true,
    },
    AIR_ANCHOR: {
        name: 'Air Anchor',
        id: 16500,
        generatesEsprit: true,
    },
    CHAIN_SAW: {
        name: 'Chain Saw',
        id: 25788,
        generatesEsprit: true,
    },
    SCATTERGUN: {
        name: 'Scattergun',
        id: 25786,
        generatesEsprit: true,
    },
})
