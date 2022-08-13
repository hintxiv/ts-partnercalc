import { Encounter } from './encounter'
import { TEA } from './tea'

export { Encounter }

export const ENCOUNTERS: Record<number, Encounter> = {
    [TEA.zoneID]: TEA,
}
