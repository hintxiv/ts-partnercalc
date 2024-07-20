import { Action } from 'types'
import { preserve } from 'util/typeutils'

export const MCH_ACTIONS = preserve<Action>()({
    SPLIT_SHOT: {
        name: 'Split Shot',
        id: 2866,
        onGCD: true,
        generatesEsprit: true,
    },
    SLUG_SHOT: {
        name: 'Slug Shot',
        id: 2868,
        onGCD: true,
        generatesEsprit: true,
    },
    SPREAD_SHOT: {
        name: 'Spread Shot',
        id: 2870,
        onGCD: true,
        generatesEsprit: true,
    },
    HOT_SHOT: {
        name: 'Hot Shot',
        id: 2872,
        onGCD: true,
        generatesEsprit: true,
    },
    CLEAN_SHOT: {
        name: 'Clean Shot',
        id: 2873,
        onGCD: true,
        generatesEsprit: true,
    },
    HEATED_SPLIT_SHOT: {
        name: 'Heated Split Shot',
        id: 7411,
        onGCD: true,
        generatesEsprit: true,
    },
    HEATED_SLUG_SHOT: {
        name: 'Heated Slug Shot',
        id: 7412,
        onGCD: true,
        generatesEsprit: true,
    },
    HEATED_CLEAN_SHOT: {
        name: 'Heated Clean Shot',
        id: 7413,
        onGCD: true,
        generatesEsprit: true,
    },
    HEAT_BLAST: {
        name: 'Heat Blast',
        id: 7410,
        onGCD: true,
        generatesEsprit: true,
    },
    AUTO_CROSSBOW: {
        name: 'Auto Crossbow',
        id: 16497,
        onGCD: true,
        generatesEsprit: true,
    },
    DRILL: {
        name: 'Drill',
        id: 16498,
        onGCD: true,
        generatesEsprit: true,
    },
    BIOBLASTER: {
        name: 'Bioblaster',
        id: 16499,
        onGCD: true,
        generatesEsprit: true,
    },
    AIR_ANCHOR: {
        name: 'Air Anchor',
        id: 16500,
        onGCD: true,
        generatesEsprit: true,
    },
    CHAIN_SAW: {
        name: 'Chain Saw',
        id: 25788,
        onGCD: true,
        generatesEsprit: true,
    },
    SCATTERGUN: {
        name: 'Scattergun',
        id: 25786,
        onGCD: true,
        generatesEsprit: true,
    },
    BLAZING_SHOT: {
        name: 'Blazing Shot',
        id: 36978,
        onGCD: true,
        generatesEsprit: true,
    },
    EXCAVATOR: {
        name: 'Excavator',
        id: 36981,
        onGCD: true,
        generatesEsprit: true,
    },
    FULL_METAL_FIELD: {
        name: 'Full Metal Field',
        id: 36982,
        onGCD: true,
        generatesEsprit: true,
        autoCrit: true,
        autoDH: true,
    },
})
