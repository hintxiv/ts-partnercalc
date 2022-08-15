import { Debuff, Effect } from 'models'
import { preserve } from 'util/typeutils'
import { STATUSES } from './statuses/raidbuffs'

export { STATUSES }

export const RAID_BUFFS = preserve<Effect>()({
    [STATUSES.BATTLE_LITANY.id]: {
        critRate: 0.1,
    },
    [STATUSES.BATTLE_VOICE.id]: {
        dhRate: 0.2,
    },
    [STATUSES.BROTHERHOOD.id]: {
        potency: 1.05,
    },
    [STATUSES.DIVINATION.id]: {
        potency: 1.06,
    },
    [STATUSES.DEVILMENT.id]: {
        critRate: 0.2,
        dhRate: 0.2,
    },
    [STATUSES.EMBOLDEN.id]: {
        potency: 1.05,
    },
    [STATUSES.STANDARD_FINISH.id]: {
        potency: 1.05,
    },
    [STATUSES.TECHNICAL_FINISH.id]: {
        potency: 1.05,
    },
    [STATUSES.LEFT_EYE.id]: {
        potency: 1.05,
    },
    [STATUSES.ARCANE_CIRCLE.id]: {
        potency: 1.03,
    },
    [STATUSES.SEARING_LIGHT.id]: {
        potency: 1.03,
    },
    [STATUSES.RADIANT_FINALE.id]: {
        potency: 1.06,
    },
})

export const RAID_DEBUFFS = preserve<Debuff>()({
    [STATUSES.CHAIN_STRATAGEM.id]: {
        effect: {
            critRate: 0.1,
        },
        castActions: [7436],
    },
})
