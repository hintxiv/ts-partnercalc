import { Debuff, Effect } from 'models'
import { preserve } from 'util/typeutils'
import { BUFFS, DEBUFFS } from './statuses/raidbuffs'

export { BUFFS, DEBUFFS }

export const RAID_BUFFS = preserve<Effect>()({
    [BUFFS.BATTLE_LITANY.id]: {
        critRate: 0.1,
    },
    [BUFFS.BATTLE_VOICE.id]: {
        dhRate: 0.2,
    },
    [BUFFS.BROTHERHOOD.id]: {
        potency: 1.05,
    },
    [BUFFS.DIVINATION.id]: {
        potency: 1.06,
    },
    [BUFFS.DEVILMENT.id]: {
        critRate: 0.2,
        dhRate: 0.2,
    },
    [BUFFS.EMBOLDEN.id]: {
        potency: 1.05,
    },
    [BUFFS.STANDARD_FINISH.id]: {
        potency: 1.05,
    },
    [BUFFS.TECHNICAL_FINISH.id]: {
        potency: 1.05,
    },
    [BUFFS.LEFT_EYE.id]: {
        potency: 1.05,
    },
    [BUFFS.ARCANE_CIRCLE.id]: {
        potency: 1.03,
    },
    [BUFFS.SEARING_LIGHT.id]: {
        potency: 1.03,
    },
    [BUFFS.RADIANT_FINALE.id]: {
        potency: 1.06,
    },
})

export const RAID_DEBUFFS = preserve<Debuff>()({
    [DEBUFFS.CHAIN_STRATAGEM.id]: {
        effect: {
            critRate: 0.1,
        },
        castActions: [7436],
    },
    [DEBUFFS.MUG.id]: {
        effect: {
            potency: 1.05,
        },
        castActions: [2248],
    },
})
