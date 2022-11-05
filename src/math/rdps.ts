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

function getBuffedStats(
    snapshot: Snapshot,
    stats: Stats,
    isDevilmentUp: boolean,
): Stats {
    const simulatedEffects = [...snapshot.effects]

    // Add devilment if the player would've had it by being the real partner
    if (isDevilmentUp && !hasDevilment(snapshot)) {
        simulatedEffects.push(EFFECTS.DEVILMENT)
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
    const multiplier = EFFECTS.STANDARD_FINISH.potency
    const buffedStats = getBuffedStats(snapshot, stats, isDevilmentUp)
    let simulatedDamage = 0

    for (const damage of snapshot.damage) {
        let expectedDamage = normalizeDamage(damage, snapshot.options, buffedStats)

        if (hasStandard(snapshot)) {
            // Don't double count standard's contribution
            expectedDamage /= multiplier
        }

        simulatedDamage += expectedDamage * (multiplier - 1)
    }

    return simulatedDamage
}

function devilmentRdps(base: number, options: DamageOptions, stats: Stats, unbuffed: Stats): number {
    const devilment = EFFECTS.DEVILMENT

    // Shorthand consts because these formulas are way too fucking long
    const Dm = stats.DHMultiplier
    const Cm = stats.critMultiplier
    const Dr = stats.DHRate
    const Cr = stats.critRate
    const Du = unbuffed.DHRate
    const Cu = unbuffed.critRate

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

        return (CDHProbability * CDHRdps) + (DHProbability * DHRdps) + (critProbability * critRdps)
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
    const buffedStats = getBuffedStats(snapshot, stats, true)
    let simulatedDamage = 0

    for (const damage of snapshot.damage) {
        const baseDamage = getBaseDamage(damage, snapshot.options, buffedStats)
        simulatedDamage += devilmentRdps(baseDamage, snapshot.options, buffedStats, stats)
    }

    return simulatedDamage
}
