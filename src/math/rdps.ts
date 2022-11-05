import { EFFECTS } from 'data/effects'
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
    return snapshot.effects.some(effect => effect.id === EFFECTS.STANDARD_FINISH.id)
}

function hasDevilment(snapshot: Snapshot): boolean {
    return snapshot.effects.some(effect => effect.id === EFFECTS.DEVILMENT.id)
}

function getPartneredStats(
    snapshot: Snapshot,
    stats: Stats,
    isDevilmentUp: boolean,
): Stats {
    const simulatedEffects = [...snapshot.effects]

    if (isDevilmentUp && !hasDevilment(snapshot)) {
        simulatedEffects.push(EFFECTS.DEVILMENT)
    }

    return applyEffects(stats, simulatedEffects)
}

// Returns the expected crit/DH multiplier for a set of Stats
function expectedMultiplier(stats: Stats): number {
    const expectedCritMultiplier = 1 + ((stats.critMultiplier - 1) * stats.critRate)
    const expectedDHMultiplier = 1 + ((stats.DHMultiplier - 1) * stats.DHRate)

    return expectedCritMultiplier * expectedDHMultiplier
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

function normalizeDamage(
    snapshot: Snapshot,
    damage: DamageInstance,
    unbuffedStats: Stats,
    partneredStats: Stats,
): number {
    const buffedStats = applyEffects(unbuffedStats, snapshot.effects)
    let expectedDamage = getBaseDamage(damage, snapshot.options, buffedStats)

    if (snapshot.options.critType === 'normal') {
        expectedDamage *= (1 + (partneredStats.critMultiplier - 1) * partneredStats.critRate)
    }

    if (snapshot.options.DHType === 'normal') {
        expectedDamage *= (1 + (partneredStats.DHMultiplier - 1) * partneredStats.DHRate)

    }

    return expectedDamage
}

export function simulateStandard(
    snapshot: Snapshot,
    stats: Stats,
    isDevilmentUp: boolean,
): number {
    const multiplier = EFFECTS.STANDARD_FINISH.potency
    const partneredStats = getPartneredStats(snapshot, stats, isDevilmentUp)
    let simulatedDamage = 0

    for (const damage of snapshot.damage) {
        let expectedDamage = normalizeDamage(snapshot, damage, stats, partneredStats)

        if (hasStandard(snapshot)) {
            // Don't double count standard's contribution
            expectedDamage /= multiplier
        }

        simulatedDamage += expectedDamage * (multiplier - 1)
    }

    return simulatedDamage
}

function devilmentRdps(
    base: number,
    options: DamageOptions,
    unbuffedStats: Stats,
    partneredStats: Stats,
): number {
    const devilment = EFFECTS.DEVILMENT

    // Shorthand consts because these formulas are way too fucking long
    const Dm = partneredStats.DHMultiplier
    const Cm = partneredStats.critMultiplier
    const Dr = partneredStats.DHRate
    const Cr = partneredStats.critRate
    const Du = unbuffedStats.DHRate
    const Cu = unbuffedStats.critRate

    const CDHProbability = Dr * Cr
    const critProbability = Cr - CDHProbability
    const DHProbability = Dr - CDHProbability

    if (options.DHType === 'normal' && options.critType === 'normal') {
        // The normal case, assign crit/DH damage to devilment according to % rates
        const CDHRdps = base * (Cm * Dm - 1) * (devilment.DHRate / Dr) * (devilment.critRate / Cr)
            + base * (Cm - 1) * Dm * (devilment.critRate / Cr) * ((Dr - devilment.DHRate) / Dr)
            + base * Cm * (Dm - 1) * ((Cr - devilment.critRate) / Cr) * (devilment.DHRate / Dr)

        const critRdps = base * (Cm - 1) * (devilment.critRate / Cr)
        const DHRdps = base * (Dm - 1) * (devilment.DHRate / Dr)

        console.log('base:', base)
        console.log(CDHRdps, critRdps, DHRdps)
        console.log(CDHProbability, critProbability, DHProbability)

        return (CDHProbability * CDHRdps) + (critProbability * critRdps) + (DHProbability * DHRdps)
    }

    // TODO unfuck auto crit / auto DH formulas

    if (options.DHType === 'normal' && options.critType === 'auto') {
        // The auto-crit case, treat Devilment as a flat crit multipler + assign DH damage according to DH rate
        const autoCritMultiplier = (1 + (Cr - Cu) * (Cm - 1))
        const noAutoCrit = base / autoCritMultiplier
        const amountWithoutDevilment = noAutoCrit * (1 + (Cr - Cu - devilment.critRate) * (Cm - 1))

        const CDHRdps = base * (Cm - 1) * (Dm - 1) * (devilment.DHRate / Dr)
        const critRdps = (Cm - 1) * (base - amountWithoutDevilment)

        return (Dr * CDHRdps) + critRdps
    }

    // The auto-CDH case, treat devilment as a flat multiplier
    const autoDHMultiplier = (1 + (Dr - Du) * (Dm - 1))
    const autoCritMultiplier = (1 + (Cr - Cu) * (Cm - 1))
    const noAutoCDH = base / (autoDHMultiplier * autoCritMultiplier)

    const amountWithoutDevilment = noAutoCDH
        * (1 + (Cr - Cu - devilment.critRate) * (Cm - 1))
        * (1 + (Dr - Du - devilment.DHRate) * (Dm - 1))

    return (base - amountWithoutDevilment) * (Cm - 1) * (Dm - 1)
}

export function simulateDevilment(
    snapshot: Snapshot,
    stats: Stats,
): number {
    const buffedStats = applyEffects(stats, snapshot.effects)
    const partneredStats = getPartneredStats(snapshot, stats, true)
    let simulatedDamage = 0

    for (const damage of snapshot.damage) {
        const baseDamage = getBaseDamage(damage, snapshot.options, buffedStats)
        simulatedDamage += devilmentRdps(baseDamage, snapshot.options, stats, partneredStats)
    }

    return simulatedDamage
}
