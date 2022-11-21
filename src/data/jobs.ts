import * as ICONS from 'components/JobIcons'
import {
    DarkKnight,
    Dragoon,
    Machinist,
    Ninja,
    Player,
    Summoner,
    Warrior,
} from 'simulator/modules/entities/player'
import { Job } from 'types'
import { preserve } from 'util/typeutils'

export const JOBS = preserve<Job>()({
    Unknown: {
        name: 'Unknown',
        color: '#000000',
        espritRate: 'unknown',
        constructor: Player,
        Icon: ICONS.DancerIcon,
    },

    // Tanks
    DarkKnight: {
        name: 'Dark Knight',
        color: '#d126cc',
        espritRate: 'unknown',
        constructor: DarkKnight,
        Icon: ICONS.DarkKnightIcon,
    },
    Gunbreaker: {
        name: 'Gunbreaker',
        color: '#796d30',
        espritRate: 'unknown',
        constructor: Player,
        Icon: ICONS.GunbreakerIcon,
    },
    Paladin: {
        name: 'Paladin',
        color: '#a8d2e6',
        espritRate: 'unknown',
        constructor: Player,
        Icon: ICONS.PaladinIcon,
    },
    Warrior: {
        name: 'Warrior',
        color: '#cf2621',
        espritRate: 'unknown',
        constructor: Warrior,
        Icon: ICONS.WarriorIcon,
    },

    // Healers
    Astrologian: {
        name: 'Astrologian',
        color: '#ffe74a',
        espritRate: 'unknown',
        constructor: Player,
        Icon: ICONS.AstrologianIcon,
    },
    Sage: {
        name: 'Sage',
        color: '#80a0f0',
        espritRate: 'unknown',
        constructor: Player,
        Icon: ICONS.SageIcon,
    },
    Scholar: {
        name: 'Scholar',
        color: '#8657ff',
        espritRate: 'unknown',
        constructor: Player,
        Icon: ICONS.ScholarIcon,
    },
    WhiteMage: {
        name: 'White Mage',
        color: '#fff0dc',
        espritRate: 'unknown',
        constructor: Player,
        Icon: ICONS.WhiteMageIcon,
    },

    // Melee
    Dragoon: {
        name: 'Dragoon',
        color: '#4164cd',
        espritRate: 0.2,
        constructor: Dragoon,
        Icon: ICONS.DragoonIcon,
    },
    Monk: {
        name: 'Monk',
        color: '#d69c00',
        espritRate: 0.1685,
        constructor: Player,
        Icon: ICONS.MonkIcon,
    },
    Ninja: {
        name: 'Ninja',
        color: '#af1964',
        espritRate: 0.2,
        constructor: Ninja,
        Icon: ICONS.NinjaIcon,
    },
    Reaper: {
        name: 'Reaper',
        color: '#965a90',
        espritRate: 0.2,
        constructor: Player,
        Icon: ICONS.ReaperIcon,
    },
    Samurai: {
        name: 'Samurai',
        color: '#e46d04',
        espritRate: 0.2,
        constructor: Player,
        Icon: ICONS.SamuraiIcon,
    },

    // Physical Ranged
    Bard: {
        name: 'Bard',
        color: '#91ba5e',
        espritRate: 'unknown',
        constructor: Player,
        Icon: ICONS.BardIcon,
    },
    Dancer: {
        name: 'Dancer',
        color: '#e2b0af',
        espritRate: 0.2,
        constructor: Player,
        Icon: ICONS.DancerIcon,
    },
    Machinist: {
        name: 'Machinist',
        color: '#6ee1d6',
        espritRate: 'unknown',
        constructor: Machinist,
        Icon: ICONS.MachinistIcon,
    },

    // Casters
    BlackMage: {
        name: 'Black Mage',
        color: '#a579d6',
        espritRate: 0.2481,
        constructor: Player,
        Icon: ICONS.BlackMageIcon,
    },
    RedMage: {
        name: 'Red Mage',
        color: '#e87b7b',
        espritRate: 'unknown',
        constructor: Player,
        Icon: ICONS.RedMageIcon,
    },
    Summoner: {
        name: 'Summoner',
        color: '#2d9b78',
        espritRate: 'unknown',
        constructor: Summoner,
        Icon: ICONS.SummonerIcon,
    },
})
