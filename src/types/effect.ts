/**
 * Represents a set of damage modifiers
 * @param potency - a multiplicative modifier (10% buff = 1.1)
 * @param critRate - an additive critical hit rate buff (10% buff = 0.1)
 * @param DHRate - an additive direct hit rate buff
 * @param critMultiplier - a multiplicative modifier for critical hits
 * @param DHMultiplier - a multiplicative modifier for direct hits
 * @param mainStat - an additive main stat buff
 */
export interface Effect {
    id: number
    potency?: number
    critRate?: number
    DHRate?: number
    critMultiplier?: number
    DHMultiplier?: number
    mainStat?: number
}
