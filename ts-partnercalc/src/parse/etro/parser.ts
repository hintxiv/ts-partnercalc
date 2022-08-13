import { ENCOUNTERS } from 'data/encounters'
import { MATERIA } from 'data/materia'
import { equipmentKeys, EtroResponseGearset, fetchEquipment, fetchGearset, fetchRelic, fetchFood, statIDs }  from './api'
import { Food, Gear, gearMap, Gearset } from './gear/gear'
import { makeStats, statMap, Stats } from './gear/stats'

const paramKeys = [
    'param0', 'param1', 'param2', 'param3', 'param4', 'param5',
] as const

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
type ValueKey = `param${0 | 1 | 2 | 3 | 4 | 5}Value`
type DamageKey = `damage${'Phys' | 'Mag'}`

function getMateriaStats(materiaList: Record<string, number>, equipStats: Partial<Stats>, maxParams: Record<number, number>) {
    const materiaStats: Partial<Stats> = {}

    for (const materiaID of Object.values(materiaList)) {
        if (materiaID in MATERIA) {
            const materia = MATERIA[materiaID]
            if (materia.stat in materiaStats) {
                materiaStats[materia.stat] += materia.amount
            } else {
                materiaStats[materia.stat] = materia.amount
            }
        } else {
            console.error("Found a materia that I don't know about yet.")
        }
    }

    // Handle stat overcap
    for (const param in maxParams) {
        const stat = statIDs[param]
        if (stat && stat in materiaStats) {
            const statOnGear = stat in equipStats ? equipStats[stat] : 0
            materiaStats[stat] = Math.min(materiaStats[stat], maxParams[param] - statOnGear)
        }
    }

    return materiaStats
}

async function getFoodStats(food: Food, stats: Stats): Promise<Partial<Stats>> {
    const foodStats: Partial<Stats> = {}

    for (const {stat, max, multiplier} of food.stats) {
        foodStats[stat] = Math.min(max, Math.floor(stats[stat] * multiplier))
    }

    return foodStats
}

async function getGear(gearset: EtroResponseGearset, weaponDamageType: DamageKey): Promise<Gear[]> {
    const gear: Gear[] = []

    for (const key of equipmentKeys) {
        const equipID = gearset[key]
        if (equipID == null) { continue }

        const equip = await fetchEquipment(equipID)
        const equipStats: Partial<Stats> = {}

        for (const p of paramKeys) {
            if (p in equip && equip[p] !== null) {
                const stat = statIDs[equip[p]]
                const vKey = `${p}Value` as ValueKey
                const value = equip[vKey]
                equipStats[stat] = value
            }
        }

        let materiaKey = equipID
        if (key === 'fingerL') {
            materiaKey += 'L'
        } else if (key === 'fingerR') {
            materiaKey += 'R'
        }

        let materiaStats = {}
        if (gearset.materia && materiaKey in gearset.materia) {
            // Include materia stats if this piece isn't synced
            const materiaList = gearset.materia[materiaKey]
            materiaStats = getMateriaStats(materiaList, equipStats, equip.maxParams)
        }

        // Get weapon damage
        if (weaponDamageType in equip) {
            equipStats.weaponDamage = equip[weaponDamageType]
        }

        const maxSubstat = Object.keys(equipStats)
            .filter(stat => ['critical', 'skillspeed', 'spellspeed', 'determination', 'direct', 'piety', 'tenacity'].includes(stat))
            .reduce((stat1: keyof Stats, stat2: keyof Stats) => equipStats[stat1] > equipStats[stat2] ? stat1 : stat2)

        gear.push({
            name: equip.name,
            gearGroup: gearMap[key],
            itemLevel: equip.itemLevel,
            stats: equipStats,
            advancedMelding: equip.advancedMelding,
            materiaStats: materiaStats,
            maxSubstat: equipStats[maxSubstat as keyof Stats],

        })
    }

    return gear
}

async function getRelic(relicID: string, weaponDamageType: DamageKey): Promise<Gear> {
    const relic = await fetchRelic(relicID)
    const base = relic.baseItem
    const relicStats: Partial<Stats> = {}

    for (const p of paramKeys) {
        if (p in relic && relic[p] !== null) {
            const stat = statIDs[relic[p]]
            const vKey = `${p}Value` as ValueKey
            const value = relic[vKey]
            relicStats[stat] = value
        }

        if (p in base && base[p] !== null) {
            const stat = statIDs[base[p]]
            const vKey = `${p}Value` as ValueKey
            const value = base[vKey]
            relicStats[stat] = value
        }
    }

    // Get weapon damage
    if (weaponDamageType in base) {
        relicStats.weaponDamage = base[weaponDamageType]
    }

    const maxSubstat = Object.keys(relicStats)
        .filter(stat => ['critical', 'skillspeed', 'spellspeed', 'direct', 'piety', 'tenacity'].includes(stat))
        .reduce((stat1: keyof Stats, stat2: keyof Stats) => relicStats[stat1] > relicStats[stat2] ? stat1 : stat2)

    return {
        name: relic.name,
        gearGroup: 'weapon',
        itemLevel: base.itemLevel,
        stats: relicStats,
        advancedMelding: base.advancedMelding,
        maxSubstat: relicStats[maxSubstat as keyof Stats],
    }
}

async function getFood(foodID: string): Promise<Food> {
    const food = await fetchFood(foodID)

    return {
        name: food.name,
        stats: [
            {
                stat: statIDs[food.param0],
                max: food.maxHQ0,
                multiplier: (food.valueHQ0 / 100),
            },
            {
                stat: statIDs[food.param1],
                max: food.maxHQ1,
                multiplier: (food.valueHQ0 / 100),
            },
            {
                stat: statIDs[food.param2],
                max: food.maxHQ2,
                multiplier: (food.valueHQ0 / 100),
            },
        ],
    }
}

export async function getGearset(id: string, zoneID: number): Promise<Gearset> {
    const gearset = await fetchGearset(id)
    const name = gearset.name
    const stats = makeStats()

    const enc = zoneID in ENCOUNTERS
        ? ENCOUNTERS[zoneID]
        : undefined

    let statCaps
    let weaponDamageType: DamageKey

    // TODO other roles
    if (['BRD', 'MCH', 'DNC'].includes(gearset.jobAbbrev)) {
        if (enc) {
            statCaps = enc.rangedStatCaps
        }
        weaponDamageType = 'damagePhys'
    } else if (['RPR', 'NIN'].includes(gearset.jobAbbrev)) {
        if (enc) {
            statCaps = enc.meleeStatCaps
        }
        weaponDamageType = 'damagePhys'
    }

    const gear = await getGear(gearset, weaponDamageType)

    if (gearset.relics?.weapon) {
        const relic = await getRelic(gearset.relics.weapon, weaponDamageType)
        gear.push(relic)
    }

    for (const g of gear) {
        if (enc && g.itemLevel > enc.ilvlSync) {
            const caps = statCaps[g.gearGroup]
            Object.keys(g.stats).forEach((stat: keyof Stats) => {
                stats[stat] += Math.min(g.stats[stat], caps[statMap[stat]])
            })

        } else {
            Object.keys(g.stats).forEach((stat: keyof Stats) => {
                stats[stat] += g.stats[stat]
            })

            // Gear isn't synced, so include materia
            if (g.materiaStats) {
                Object.keys(g.materiaStats).forEach((stat: keyof Stats) => {
                    stats[stat] += g.materiaStats[stat]
                })
            }
        }
    }

    let food = undefined

    if (gearset.food) {
        food = await getFood(gearset.food)
        const foodStats = await getFoodStats(food, stats)

        Object.keys(foodStats).forEach((stat: keyof Stats) => {
            stats[stat] += foodStats[stat]
        })
    }

    return {
        id: id,
        name: name,
        gear: gear,
        food: food,
        stats: stats,
    }
}
