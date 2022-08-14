export type ActionType =
    | 'Ability'
    | 'Auto'
    | 'Spell'
    | 'Weaponskill'

export interface Action {
    id: number
    type: ActionType
}
