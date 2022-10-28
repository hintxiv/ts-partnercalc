import { Debuff, Effect } from 'models'
import { preserve } from 'util/typeutils'
import { BUFFS, DEBUFFS } from './statuses/raidbuffs'

export { BUFFS, DEBUFFS }

export const RAID_BUFFS = preserve<Effect>()({
    [BUFFS.BATTLE_LITANY.id]: {
        id: BUFFS.BATTLE_LITANY.id,
        critRate: 0.1,
    },
    [BUFFS.BATTLE_VOICE.id]: {
        id: BUFFS.BATTLE_VOICE.id,
        DHRate: 0.2,
    },
    [BUFFS.DEVILMENT.id]: {
        id: BUFFS.DEVILMENT.id,
        critRate: 0.2,
        DHRate: 0.2,
    },
    [BUFFS.STANDARD_FINISH.id]: {
        id: BUFFS.STANDARD_FINISH.id,
        potency: 1.05,
    },
    [BUFFS.TECHNICAL_FINISH.id]: {
        id: BUFFS.TECHNICAL_FINISH.id,
        potency: 1.05,
    },
})

export const RAID_DEBUFFS = preserve<Debuff>()({
    [DEBUFFS.CHAIN_STRATAGEM.id]: {
        effect: {
            id: DEBUFFS.CHAIN_STRATAGEM.id,
            critRate: 0.1,
        },
        castActions: [7436],
    },
})
