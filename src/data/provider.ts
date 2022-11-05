import { Action, Effect, Status } from 'types'
import { ACTIONS } from './actions'
import { BUFFS, DEBUFFS, EFFECTS } from './effects'
import { STATUSES } from './statuses'

export type ActionKey = keyof typeof ACTIONS
export type StatusKey = keyof typeof STATUSES

/**
 * Makes accessing action / status / etc. data a bit more convenient
 */
export class DataProvider {
    private actionMap: Map<number, Action> = new Map()
    private statusMap: Map<number, Status> = new Map()
    private effectMap: Map<number, Effect> = new Map()

    constructor() {
        Object.values(ACTIONS).forEach(action => {
            this.actionMap.set(action.id, action)
        })

        Object.values(STATUSES).forEach(status => {
            this.statusMap.set(status.id, status)
        })

        Object.values(EFFECTS).forEach(effect => {
            this.effectMap.set(effect.id, effect)
        })
    }

    public get actions() {
        return ACTIONS
    }

    public get statuses() {
        return STATUSES
    }

    public get effects() {
        return EFFECTS
    }

    public get buffs() {
        return BUFFS
    }

    public get debuffs() {
        return DEBUFFS
    }

    public getAction(actionID: number): Action | undefined {
        return this.actionMap.get(actionID)
    }

    public getStatus(statusID: number): Status | undefined {
        return this.statusMap.get(statusID)
    }

    public getEffect(statusID: number): Effect | undefined {
        return this.effectMap.get(statusID)
    }
}
