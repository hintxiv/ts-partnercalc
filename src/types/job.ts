export interface Job {
    name: string
    color: string
    /* The empirical rate of esprit generation per GCD for this job */
    espritRate: number | 'unknown'
    Icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
}
