export interface Action {
    name: string
    id: number
    potency?: number
    falloff?: boolean
    onGCD?: boolean
    generatesEsprit?: boolean
    autoCrit?: boolean
    autoDH?: boolean
}
