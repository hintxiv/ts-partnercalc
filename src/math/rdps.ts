import { BUFFS, RAID_BUFFS } from 'data/raidbuffs'
import { Effect, Stats } from 'models'
import { CastInstance, DamageInstance, DamageOptions } from 'simulate/instances'

// TODO memoize everything here

// Applies the given Effects to the given Stats to return a buffed set of Stats
function applyEffects(stats: Stats, effects: Effect[]): Stats {
    const newStats = Object.assign({}, stats)

    for (const effect of effects) {
        newStats.critRate += effect.critRate ?? 0
        newStats.DHRate += effect.DHRate ?? 0
        newStats.critMultiplier *= effect.critMultiplier ?? 1
        newStats.DHMultiplier *= effect.DHMultiplier ?? 1
    }

    return newStats
}

function hasStandard(cast: CastInstance): boolean {
    return cast.effects.some(effect => effect.id === BUFFS.STANDARD_FINISH.id)
}

function hasDevilment(cast: CastInstance): boolean {
    return cast.effects.some(effect => effect.id === BUFFS.DEVILMENT.id)
}

function getBuffedStats(
    cast: CastInstance,
    stats: Stats,
    isDevilmentUp: boolean,
): Stats {
    const devilmentEffect = RAID_BUFFS[BUFFS.DEVILMENT.id]
    const simulatedEffects = [...cast.effects]

    // Add devilment if the player would've had it by being the real partner
    if (isDevilmentUp && !hasDevilment(cast)) {
        simulatedEffects.push(devilmentEffect)
    }

    return applyEffects(stats, simulatedEffects)
}

// Returns the expected crit/DH multiplier for a set of Stats
function expectedMultiplier(stats: Stats): number {
    const CDH = (stats.critRate * stats.DHRate) * (stats.critMultiplier * stats.DHMultiplier)
    const crit = (stats.critRate * (1 - stats.DHRate)) * stats.critMultiplier
    const DH = ((1 - stats.critRate) * stats.DHRate) * stats.DHMultiplier
    const none = ((1 - stats.critRate) * (1 - stats.DHRate))

    return CDH + crit + DH + none
}

// Strips crit/DH from an instance of damage, based on the given Stats
function getBaseDamage(damage: DamageInstance, options: DamageOptions, stats: Stats): number {
    // DoTs have normalized crit/DH baked in already
    if (damage.type === 'tick') {
        return damage.amount / expectedMultiplier(stats)
    }

    let strippedDamage = damage.amount

    if (options.critType !== 'auto' && damage.isCrit) {
        // Strip damage from a natural crit
        strippedDamage /= stats.critMultiplier
    }

    if (options.DHType !== 'auto' && damage.isDH) {
        // Strip damage from a natural DH
        strippedDamage /= stats.DHMultiplier
    }

    return strippedDamage
}

function normalizeDamage(damage: DamageInstance, options: DamageOptions, stats: Stats): number {
    let expectedDamage = getBaseDamage(damage, options, stats)

    if (options.critType === 'normal') {
        expectedDamage *= (1 + (stats.critMultiplier - 1) * stats.critRate)
    }

    if (options.DHType === 'normal') {
        expectedDamage *= (1 + (stats.DHMultiplier - 1) * stats.DHRate)

    }

    return expectedDamage
}

export function simulateStandard(
    cast: CastInstance,
    stats: Stats,
    isDevilmentUp: boolean,
): number {
    const standardEffect = RAID_BUFFS[BUFFS.STANDARD_FINISH.id]
    const buffedStats = getBuffedStats(cast, stats, isDevilmentUp)
    let simulatedDamage = 0

    for (const damage of cast.damage) {
        let expectedDamage = normalizeDamage(damage, cast.options, buffedStats)

        if (hasStandard(cast)) {
            // Don't double count standard's contribution
            expectedDamage /= standardEffect.potency
        }

        simulatedDamage += expectedDamage * (standardEffect.potency - 1)
    }

    return simulatedDamage
}
