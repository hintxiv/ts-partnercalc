import { BUFFS, RAID_BUFFS } from 'data/raidbuffs'
import { Effect, Stats } from 'types'
import { DamageInstance, DamageOptions, Snapshot } from 'types/snapshot'

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

function hasStandard(snapshot: Snapshot): boolean {
    return snapshot.effects.some(effect => effect.id === BUFFS.STANDARD_FINISH.id)
}

function hasDevilment(snapshot: Snapshot): boolean {
    return snapshot.effects.some(effect => effect.id === BUFFS.DEVILMENT.id)
}

function getBuffedStats(
    snapshot: Snapshot,
    stats: Stats,
    isDevilmentUp: boolean,
): Stats {
    const devilmentEffect = RAID_BUFFS[BUFFS.DEVILMENT.id]
    const simulatedEffects = [...snapshot.effects]

    // Add devilment if the player would've had it by being the real partner
    if (isDevilmentUp && !hasDevilment(snapshot)) {
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
    snapshot: Snapshot,
    stats: Stats,
    isDevilmentUp: boolean,
): number {
    const standardEffect = RAID_BUFFS[BUFFS.STANDARD_FINISH.id]
    const buffedStats = getBuffedStats(snapshot, stats, isDevilmentUp)
    let simulatedDamage = 0

    for (const damage of snapshot.damage) {
        let expectedDamage = normalizeDamage(damage, snapshot.options, buffedStats)

        if (hasStandard(snapshot)) {
            // Don't double count standard's contribution
            expectedDamage /= standardEffect.potency
        }

        simulatedDamage += expectedDamage * (standardEffect.potency - 1)
    }

    return simulatedDamage
}

function devilmentRdps(amount: number, options: DamageOptions, stats: Stats, unbuffed: Stats): number {
    const devilmentEffect = RAID_BUFFS[BUFFS.DEVILMENT.id]

    // Shorthand consts because these formulas are way too fucking long
    const Dm = stats.DHMultiplier
    const Cm = stats.critMultiplier
    const Dr = stats.DHRate
    const Cr = stats.critRate
    const Du = unbuffed.DHRate
    const Cu = unbuffed.critRate

    const CDHProbability = Dr * Cr
    const DHProbability = Dr - CDHProbability
    const critProbability = Cr - CDHProbability

    if (options.DHType === 'normal' && options.critType === 'normal') {
        // The normal case, assign crit/DH damage to devilment according to % rates
        const CDHRdps = amount * (1 - (1 / (Dm * Cm))) * (devilmentEffect.DHRate / Dr) * (devilmentEffect.critRate / Cr)
        + amount * (1 - (1 / Cm)) * ((Dr - devilmentEffect.DHRate) / Dr) * (devilmentEffect.critRate / Cr)
        + amount * (1 - (1 / Dm)) * (devilmentEffect.DHRate / Dr) * ((Cr - devilmentEffect.critRate) / Cr)

        const DHRdps = amount * (1 - (1 / Dm)) * (devilmentEffect.DHRate / Dr)
        const critRdps = amount * (1 - (1 / Cm)) * (devilmentEffect.critRate / Cr)

        return (CDHProbability * CDHRdps) + (DHProbability * DHRdps) + (critProbability * critRdps)
    }

    if (options.DHType === 'normal' && options.critType === 'auto') {
        // The auto-crit case, treat Devilment as a flat crit multipler + assign DH damage according to DH rate
        const autoCritMultiplier = (1 + (Cr - Cu) * (Cm - 1))
        const base = amount / autoCritMultiplier
        const amountWithoutDevilment = base * (1 + (Cr - Cu - devilmentEffect.critRate) * (Cm - 1))

        const CDHRdps = amount * (1 - (1 / Dm)) * (devilmentEffect.DHRate / Dr)
        const critRdps = amount - amountWithoutDevilment

        return (Dr * CDHRdps) + critRdps
    }

    if (options.DHType === 'auto' && options.critType === 'auto') {
        // The auto-CDH case, treat devilment as a flat multiplier
        const autoDHMultiplier = (1 + (Dr - Du) * (Dm - 1))
        const autoCritMultiplier = (1 + (Cr - Cu) * (Cm - 1))
        const base = amount / (autoDHMultiplier * autoCritMultiplier)

        const amountWithoutDevilment = base
            * (1 + (Dr - Du - devilmentEffect.DHRate) * (Dm - 1))
            * (1 + (Cr - Cu - devilmentEffect.critRate) * (Cm - 1))

        return amount - amountWithoutDevilment
    }
}

export function simulateDevilment(
    snapshot: Snapshot,
    stats: Stats,
): number {
    const buffedStats = getBuffedStats(snapshot, stats, true)
    let simulatedDamage = 0

    for (const damage of snapshot.damage) {
        const expectedDamage = normalizeDamage(damage, snapshot.options, buffedStats)
        simulatedDamage += devilmentRdps(expectedDamage, snapshot.options, buffedStats, stats)
    }

    return simulatedDamage
}
