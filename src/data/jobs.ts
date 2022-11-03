import * as ICONS from 'components/JobIcons'
import { Job } from 'types'
import { preserve } from 'util/typeutils'

export const JOBS = preserve<Job>()({
    Unknown: {
        name: 'Unknown',
        color: '#000000',
        espritRate: 'unknown',
        Icon: ICONS.DancerIcon,
    },

    // Tanks
    DarkKnight: {
        name: 'Dark Knight',
        color: '#d126cc',
        espritRate: 'unknown',
        Icon: ICONS.DarkKnightIcon,
    },
    Gunbreaker: {
        name: 'Gunbreaker',
        color: '#796d30',
        espritRate: 'unknown',
        Icon: ICONS.GunbreakerIcon,
    },
    Paladin: {
        name: 'Paladin',
        color: '#a8d2e6',
        espritRate: 'unknown',
        Icon: ICONS.PaladinIcon,
    },
    Warrior: {
        name: 'Warrior',
        color: '#cf2621',
        espritRate: 'unknown',
        Icon: ICONS.WarriorIcon,
    },

    // Healers
    Astrologian: {
        name: 'Astrologian',
        color: '#ffe74a',
        espritRate: 'unknown',
        Icon: ICONS.AstrologianIcon,
    },
    Sage: {
        name: 'Sage',
        color: '#80a0f0',
        espritRate: 'unknown',
        Icon: ICONS.SageIcon,
    },
    Scholar: {
        name: 'Scholar',
        color: '#8657ff',
        espritRate: 'unknown',
        Icon: ICONS.ScholarIcon,
    },
    WhiteMage: {
        name: 'White Mage',
        color: '#fff0dc',
        espritRate: 'unknown',
        Icon: ICONS.WhiteMageIcon,
    },

    // Melee
    Dragoon: {
        name: 'Dragoon',
        color: '#4164cd',
        espritRate: 0.2,
        Icon: ICONS.DragoonIcon,
    },
    Monk: {
        name: 'Monk',
        color: '#d69c00',
        espritRate: 0.1685,
        Icon: ICONS.MonkIcon,
    },
    Ninja: {
        name: 'Ninja',
        color: '#af1964',
        espritRate: 0.2,
        Icon: ICONS.NinjaIcon,
    },
    Reaper: {
        name: 'Reaper',
        color: '#965a90',
        espritRate: 0.2,
        Icon: ICONS.ReaperIcon,
    },
    Samurai: {
        name: 'Samurai',
        color: '#e46d04',
        espritRate: 0.2,
        Icon: ICONS.SamuraiIcon,
    },

    // Physical Ranged
    Bard: {
        name: 'Bard',
        color: '#91ba5e',
        espritRate: 'unknown',
        Icon: ICONS.BardIcon,
    },
    Dancer: {
        name: 'Dancer',
        color: '#e2b0af',
        espritRate: 0.2,
        Icon: ICONS.DancerIcon,
    },
    Machinist: {
        name: 'Machinist',
        color: '#6ee1d6',
        espritRate: 'unknown',
        Icon: ICONS.MachinistIcon,
    },

    // Casters
    BlackMage: {
        name: 'Black Mage',
        color: '#a579d6',
        espritRate: 0.2481,
        Icon: ICONS.BlackMageIcon,
    },
    RedMage: {
        name: 'Red Mage',
        color: '#e87b7b',
        espritRate: 'unknown',
        Icon: ICONS.RedMageIcon,
    },
    Summoner: {
        name: 'Summoner',
        color: '#2d9b78',
        espritRate: 'unknown',
        Icon: ICONS.SummonerIcon,
    },
})
