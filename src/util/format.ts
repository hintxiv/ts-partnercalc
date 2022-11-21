/* eslint-disable @typescript-eslint/no-magic-numbers */
const MS_PER_MINUTE = 60000

/**
 * @param elapsed time elapsed since the beginning of the report, in ms
 */
export function formatTimestamp(elapsed: number): string {
    const mm = Math.floor(elapsed / MS_PER_MINUTE)
    const ss = Math.floor((elapsed % MS_PER_MINUTE) / 1000)

    return `${mm < 10 ? '0' + mm : mm}:${ss < 10 ? '0' + ss : ss}`
}

export function formatDamage(damage: number): string {
    // Get rid of trailing zeroes
    const pretty = (damage: number, sig: number) =>
        parseFloat(damage.toFixed(sig)).toString()

    if (damage < 100000) {
        // separate thousands with commas
        return pretty(damage, 2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    if (damage < 1000000) {
        // Shorten numbers over 100K with 'K'
        return pretty(damage / 1000, 1) + 'K'
    }

    // Shorten numbers over 1M with 'M'
    return pretty(damage / 1000000, 2) + 'M'
}
