import { Stats } from 'api/etro/gear/stats'

export interface Materia
{
    id: number
    name: string
    stat: keyof Stats
    amount: number
}
