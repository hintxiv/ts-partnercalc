export interface Job {
    name: string
    iconPath: string
    color: string
    /* The empirical rate of esprit generation per GCD for this job */
    espritRate: number | 'unknown'
}
