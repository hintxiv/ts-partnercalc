import { DataProvider } from 'data/provider'
import { Job, Snapshot } from 'types'

const POTENCY_PER_ESPRIT = 3.56  // from ringabel's calculations
const ESPRIT_PER_WEAPONSKILL = 10
const DEFAULT_ESPRIT_RATE = 0.2

// const PARTNER_LOSS_MS = 5300  // from io's calculations

export function simulateEsprit(
    snapshot: Snapshot,
    job: Job,
    potencyRatio: number,
    data: DataProvider
): number {
    const action = data.getAction(snapshot.id)

    if (action != null && action.generatesEsprit) {
        // If tech was up, this action would've generated esprit regardless of partner
        if (snapshot.effects.some(effect => effect.id === data.statuses.TECHNICAL_FINISH.id)) {
            return 0
        }

        const espritRate = job.espritRate === 'unknown'
            ? DEFAULT_ESPRIT_RATE
            : job.espritRate

        const expectedEsprit = espritRate * ESPRIT_PER_WEAPONSKILL

        return expectedEsprit * potencyRatio * POTENCY_PER_ESPRIT
    }

    return 0
}
