import { BUFFS, RAID_BUFFS } from 'data/raidbuffs'
import { Effect, Stats } from 'models'
import { CastInstance, DamageInstance, DamageOptions } from 'simulate/instances'

// TODO memoize everything here

function applyEffects(stats: Stats, effects: Effect[]): Stats {
    const newStats = Object.assign({}, stats)

    for (const effect of effects) {
        newStats.critRate += effect.critRate ?? 0
        newStats.dhRate += effect.dhRate ?? 0
        newStats.critMultiplier *= effect.critMultiplier ?? 0
        newStats.dhMultiplier *= effect.dhMultiplier ?? 0
    }

    return newStats
}

function getBuffedStats(
    stats: Stats,
    effects: Effect[],
    isDevilmentUp: boolean,
    isRealPartner: boolean,
): Stats {
    const devilmentEffect = RAID_BUFFS[BUFFS.DEVILMENT.id]
    const simulatedEffects = [...effects]

    // Add devilment if they would've had it by being the real partner
    if (isDevilmentUp && !isRealPartner) {
        simulatedEffects.push(devilmentEffect)
    }

    return applyEffects(stats, simulatedEffects)
}

function getBaseDamage(damage: DamageInstance, options: DamageOptions, stats: Stats): number {
    let baseDamage = damage.amount

    if (options.critType !== 'auto' && damage.isCrit) {
        // Strip damage from a natural crit
        baseDamage /= stats.critMultiplier
    }

    if (options.dhType !== 'auto' && damage.isDH) {
        // Strip damage from a natural DH
        baseDamage /= stats.dhMultiplier
    }

    return baseDamage
}

function simulateDamage(damage: DamageInstance, options: DamageOptions, stats: Stats): number {
    let expectedDamage = getBaseDamage(damage, options, stats)

    if (options.critType === 'normal') {
        expectedDamage *= (1 + (stats.critMultiplier - 1) * stats.critRate)
    }

    if (options.dhType === 'normal') {
        expectedDamage *= (1 + (stats.dhMultiplier - 1) * stats.dhRate)

    }

    return expectedDamage
}

export function simulateStandard(
    cast: CastInstance,
    stats: Stats,
    effects: Effect[],
    isDevilmentUp: boolean,
    isRealPartner: boolean,
): number {
    const standardEffect = RAID_BUFFS[BUFFS.STANDARD_FINISH.id]
    const buffedStats = getBuffedStats(stats, effects, isDevilmentUp, isRealPartner)
    let simulatedDamage = 0

    for (const damage of cast.damage) {
        let expectedDamage = simulateDamage(damage, cast.options, buffedStats)

        if (isRealPartner) {
            // Don't double count standard's contribution
            expectedDamage /= standardEffect.potency
        }

        simulatedDamage += expectedDamage * (1 - standardEffect.potency)
    }

    return simulatedDamage
}
