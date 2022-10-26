import { Job } from 'models'
import { preserve } from 'util/typeutils'

export const JOBS = preserve<Job>()({
    Unknown: {
        name: 'Unknown',
        iconPath: '/jobicons/dnc.svg',
        color: '#000000',
    },

    // Tanks
    DarkKnight: {
        name: 'Dark Knight',
        iconPath: '/jobicons/brd.svg',
        color: '#d126cc',
    },
    Gunbreaker: {
        name: 'Gunbreaker',
        iconPath: '/jobicons/brd.svg',
        color: '#796d30',
    },
    Paladin: {
        name: 'Paladin',
        iconPath: '/jobicons/brd.svg',
        color: '#a8d2e6',
    },
    Warrior: {
        name: 'Warrior',
        iconPath: '/jobicons/brd.svg',
        color: '#cf2621',
    },

    // Healers
    Astrologian: {
        name: 'Astrologian',
        iconPath: '/jobicons/brd.svg',
        color: '#ffe74a',
    },
    Sage: {
        name: 'Sage',
        iconPath: '/jobicons/brd.svg',
        color: '#80a0f0',
    },
    Scholar: {
        name: 'Scholar',
        iconPath: '/jobicons/brd.svg',
        color: '#8657ff',
    },
    WhiteMage: {
        name: 'White Mage',
        iconPath: '/jobicons/brd.svg',
        color: '#fff0dc',
    },

    // Melee
    Dragoon: {
        name: 'Dragoon',
        iconPath: '/jobicons/brd.svg',
        color: '#4164cd',
    },
    Monk: {
        name: 'Monk',
        iconPath: '/jobicons/brd.svg',
        color: '#d69c00',
    },
    Ninja: {
        name: 'Ninja',
        iconPath: '/jobicons/nin.svg',
        color: '#af1964',
    },
    Reaper: {
        name: 'Reaper',
        iconPath: '/jobicons/rpr.svg',
        color: '#965a90',
    },
    Samurai: {
        name: 'Samurai',
        iconPath: '/jobicons/brd.svg',
        color: '#e46d04',
    },

    // Physical Ranged
    Bard: {
        name: 'Bard',
        iconPath: '/jobicons/brd.svg',
        color: '#91ba5e',
    },
    Dancer: {
        name: 'Dancer',
        iconPath: '/jobicons/dnc.svg',
        color: '#e2b0af',
    },
    Machinist: {
        name: 'Machinist',
        iconPath: '/jobicons/mch.svg',
        color: '#6ee1d6',
    },

    // Casters
    BlackMage: {
        name: 'Black Mage',
        iconPath: '/jobicons/brd.svg',
        color: '#a579d6',
    },
    RedMage: {
        name: 'Red Mage',
        iconPath: '/jobicons/brd.svg',
        color: '#e87b7b',
    },
    Summoner: {
        name: 'Summoner',
        iconPath: '/jobicons/brd.svg',
        color: '#2d9b78',
    },
})
