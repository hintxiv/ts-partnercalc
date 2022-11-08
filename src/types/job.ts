import { Player } from 'simulate/modules/entities/player'

export interface Job {
    name: string
    color: string
    /* The empirical rate of esprit generation per GCD for this job */
    espritRate: number | 'unknown'
    constructor: new(...args: ConstructorParameters<typeof Player>) => Player
    Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
}
