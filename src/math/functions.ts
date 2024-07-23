/**
 * Sorry for not making this code super clean. Lv 100 / Dawntrail assumed.
 */

export const computeCritRate = (critStat: number): number => {
    console.log(Math.floor((200 * (critStat - 420) / 2780) + 50) / 1000)
    return Math.floor((200 * (critStat - 420) / 2780) + 50) / 1000
}

export const computeCritMultiplier = (critStat: number): number => {
    console.log(Math.floor(200 * ((critStat - 420) / 2780) + 1400) / 1000)
    return Math.floor(200 * ((critStat - 420) / 2780) + 1400) / 1000
}

export const computeDHRate = (dhStat: number): number => {
    return Math.floor((550 * (dhStat - 420)) / 2780) / 1000
}
