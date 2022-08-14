import { Buff, Debuff } from 'models/status'
import { STATUSES } from './statuses/raidbuffs'

export const RAID_BUFFS: Buff[] = [
    {
        id: STATUSES.BATTLE_LITANY.id,
        effect: {
            critRate: 0.1,
        },
    },
    {
        id: STATUSES.BATTLE_VOICE.id,
        effect: {
            directRate: 0.2,
        },
    },
    {
        id: STATUSES.BROTHERHOOD.id,
        effect: {
            potency: 1.05,
        },
    },
    {
        id: STATUSES.DIVINATION.id,
        effect: {
            potency: 1.06,
        },
    },
    {
        id: STATUSES.DEVILMENT.id,
        effect: {
            critRate: 0.2,
            directRate: 0.2,
        },
    },
    {
        id: STATUSES.EMBOLDEN.id,
        effect: {
            potency: 1.05,
        },
    },
    {
        id: STATUSES.STANDARD_FINISH.id,
        effect: {
            potency: 1.05,
        },
    },
    {
        id: STATUSES.TECHNICAL_FINISH.id,
        effect: {
            potency: 1.05,
        },
    },
    {
        id: STATUSES.LEFT_EYE.id,
        effect: {
            potency: 1.05,
        },
    },
    {
        id: STATUSES.ARCANE_CIRCLE.id,
        effect: {
            potency: 1.03,
        },
    },
    {
        id: STATUSES.SEARING_LIGHT.id,
        effect: {
            potency: 1.03,
        },
    },
    {
        id: STATUSES.RADIANT_FINALE.id,
        effect: {
            potency: 1.06,
        },
    },
]

export const RAID_DEBUFFS: Debuff[] = [
    {
        id: STATUSES.CHAIN_STRATAGEM.id,
        castActions: [7436],
        effect: {
            critRate: 0.1,
        },
    },
    {
        id: STATUSES.MUG.id,
        castActions: [2248],
        effect: {
            potency: 1.05,
        },
    },
]
