import { Job } from 'types'
import { preserve } from 'util/typeutils'

export const JOBS = preserve<Job>()({
    Unknown: {
        name: 'Unknown',
        iconPath: '/jobicons/dnc.svg',
        color: '#000000',
        espritRate: 'unknown',
    },

    // Tanks
    DarkKnight: {
        name: 'Dark Knight',
        iconPath: '/jobicons/brd.svg',
        color: '#d126cc',
        espritRate: 'unknown',
    },
    Gunbreaker: {
        name: 'Gunbreaker',
        iconPath: '/jobicons/brd.svg',
        color: '#796d30',
        espritRate: 'unknown',
    },
    Paladin: {
        name: 'Paladin',
        iconPath: '/jobicons/brd.svg',
        color: '#a8d2e6',
        espritRate: 'unknown',
    },
    Warrior: {
        name: 'Warrior',
        iconPath: '/jobicons/brd.svg',
        color: '#cf2621',
        espritRate: 'unknown',
    },

    // Healers
    Astrologian: {
        name: 'Astrologian',
        iconPath: '/jobicons/brd.svg',
        color: '#ffe74a',
        espritRate: 'unknown',
    },
    Sage: {
        name: 'Sage',
        iconPath: '/jobicons/brd.svg',
        color: '#80a0f0',
        espritRate: 'unknown',
    },
    Scholar: {
        name: 'Scholar',
        iconPath: '/jobicons/brd.svg',
        color: '#8657ff',
        espritRate: 'unknown',
    },
    WhiteMage: {
        name: 'White Mage',
        iconPath: '/jobicons/brd.svg',
        color: '#fff0dc',
        espritRate: 'unknown',
    },

    // Melee
    Dragoon: {
        name: 'Dragoon',
        iconPath: '/jobicons/brd.svg',
        color: '#4164cd',
        espritRate: 0.2,
    },
    Monk: {
        name: 'Monk',
        iconPath: '/jobicons/brd.svg',
        color: '#d69c00',
        espritRate: 0.1685,
    },
    Ninja: {
        name: 'Ninja',
        iconPath: '/jobicons/nin.svg',
        color: '#af1964',
        espritRate: 0.2,
    },
    Reaper: {
        name: 'Reaper',
        iconPath: '/jobicons/rpr.svg',
        color: '#965a90',
        espritRate: 0.2,
    },
    Samurai: {
        name: 'Samurai',
        iconPath: '/jobicons/brd.svg',
        color: '#e46d04',
        espritRate: 0.2,
    },

    // Physical Ranged
    Bard: {
        name: 'Bard',
        iconPath: '/jobicons/brd.svg',
        color: '#91ba5e',
        espritRate: 'unknown',
    },
    Dancer: {
        name: 'Dancer',
        iconPath: '/jobicons/dnc.svg',
        color: '#e2b0af',
        espritRate: 0.2,
    },
    Machinist: {
        name: 'Machinist',
        iconPath: '/jobicons/mch.svg',
        color: '#6ee1d6',
        espritRate: 'unknown',
    },

    // Casters
    BlackMage: {
        name: 'Black Mage',
        iconPath: '/jobicons/brd.svg',
        color: '#a579d6',
        espritRate: 0.2481,
    },
    RedMage: {
        name: 'Red Mage',
        iconPath: '/jobicons/brd.svg',
        color: '#e87b7b',
        espritRate: 'unknown',
    },
    Summoner: {
        name: 'Summoner',
        iconPath: '/jobicons/brd.svg',
        color: '#2d9b78',
        espritRate: 'unknown',
    },
})
