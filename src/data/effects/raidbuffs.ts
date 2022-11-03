import { STATUSES } from 'data/statuses'
import { Effect } from 'types'
import { preserve } from 'util/typeutils'

export const RAID_BUFFS = preserve<Effect>()({
    BATTLE_LITANY: {
        id: STATUSES.BATTLE_LITANY.id,
        critRate: 0.1,
    },
    BATTLE_VOICE: {
        id: STATUSES.BATTLE_VOICE.id,
        DHRate: 0.2,
    },
    DEVILMENT: {
        id: STATUSES.DEVILMENT.id,
        critRate: 0.2,
        DHRate: 0.2,
    },
    STANDARD_FINISH: {
        id: STATUSES.STANDARD_FINISH.id,
        potency: 1.05,
    },
    TECHNICAL_FINISH: {
        id: STATUSES.TECHNICAL_FINISH.id,
        potency: 1.05,
    },
})

export const RAID_DEBUFFS = preserve<Effect>()({
    CHAIN_STRATAGEM: {
        id: STATUSES.CHAIN_STRATAGEM.id,
        critRate: 0.1,
    },
})
