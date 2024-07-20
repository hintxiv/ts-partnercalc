import { Action } from 'types'
import { preserve } from 'util/typeutils'
import { AST_ACTIONS } from './AST'
import { BLM_ACTIONS } from './BLM'
import { BRD_ACTIONS } from './BRD'
import { DNC_ACTIONS } from './DNC'
import { DRG_ACTIONS } from './DRG'
import { DRK_ACTIONS } from './DRK'
import { GNB_ACTIONS } from './GNB'
import { MCH_ACTIONS } from './MCH'
import { MNK_ACTIONS } from './MNK'
import { NIN_ACTIONS } from './NIN'
import { PCT_ACTIONS } from './PCT'
import { PLD_ACTIONS } from './PLD'
import { RDM_ACTIONS } from './RDM'
import { RPR_ACTIONS } from './RPR'
import { SAM_ACTIONS } from './SAM'
import { SCH_ACTIONS } from './SCH'
import { SGE_ACTIONS } from './SGE'
import { SMN_ACTIONS } from './SMN'
import { VPR_ACTIONS } from './VPR'
import { WAR_ACTIONS } from './WAR'
import { WHM_ACTIONS } from './WHM'

export const ACTIONS = preserve<Action>()({
    ...AST_ACTIONS,
    ...BLM_ACTIONS,
    ...BRD_ACTIONS,
    ...DNC_ACTIONS,
    ...DRG_ACTIONS,
    ...DRK_ACTIONS,
    ...GNB_ACTIONS,
    ...MCH_ACTIONS,
    ...MNK_ACTIONS,
    ...NIN_ACTIONS,
    ...PCT_ACTIONS,
    ...PLD_ACTIONS,
    ...RDM_ACTIONS,
    ...RPR_ACTIONS,
    ...SAM_ACTIONS,
    ...SCH_ACTIONS,
    ...SGE_ACTIONS,
    ...SMN_ACTIONS,
    ...VPR_ACTIONS,
    ...WAR_ACTIONS,
    ...WHM_ACTIONS,
})
