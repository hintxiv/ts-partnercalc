import { CRITICAL_MATERIA } from './critical'
import { DETERMINATION_MATERIA } from './determination'
import { DIRECT_MATERIA } from './direct'
import { Materia } from './materia'
import { SKILLSPEED_MATERIA } from './speed'

export { Materia }

export const MATERIA: Record<number, Materia> = {
    ...CRITICAL_MATERIA,
    ...DETERMINATION_MATERIA,
    ...DIRECT_MATERIA,
    ...SKILLSPEED_MATERIA,
}
