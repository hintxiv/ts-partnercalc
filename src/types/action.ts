export interface Action {
    name: string
    id: number
    potency?: number
    falloff?: boolean
    generatesEsprit?: boolean
    autoCrit?: boolean
    autoDH?: boolean
}
