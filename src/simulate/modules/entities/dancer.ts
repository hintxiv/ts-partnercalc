import { ApplyBuffEvent, CastEvent, FFLogsEvent, RemoveBuffEvent } from 'api/fflogs/event'
import { BUFFS } from 'data/raidbuffs'
import { Devilment } from 'simulate/buffwindow/devilment'
import { Standard } from 'simulate/buffwindow/standard'
import { Entity } from './entity'

type StandardHook = (standard: Standard) => void

const TILLANA_ID = 25790
const STANDARD_ID = 16192
const MIN_WINDOW_LENGTH = 10000 // ~4 GCDs

export class Dancer extends Entity {
    public id: number
    private emitStandard: StandardHook
    private currentStandard: Standard | undefined
    private currentDevilment: Devilment | undefined
    private lastApplierID: number | undefined

    constructor(id: number, standardHook: StandardHook) {
        super(id.toString())
        this.id = id
        this.emitStandard = standardHook
        this.init()
    }

    protected init() {
        this.addHook('applybuff', this.onStandard, { actionID: BUFFS.STANDARD_FINISH.id })
        this.addHook('removebuff', this.onRemoveStandard, { actionID: BUFFS.STANDARD_FINISH.id })
        this.addHook('applybuff', this.onDevilment, { actionID: BUFFS.DEVILMENT.id })
        this.addHook('removebuff', this.onRemoveDevilment, { actionID: BUFFS.DEVILMENT.id })
        this.addHook('cast', this.onCast, { actionID: TILLANA_ID })
        this.addHook('cast', this.onCast, { actionID: STANDARD_ID })
    }

    public processEvent(event: FFLogsEvent) {
        if (event.sourceID !== this.id) {
            return
        }
        super.processEvent(event)
    }

    private onCast(event: CastEvent) {
        this.lastApplierID = event.actionID
    }

    private onStandard(event: ApplyBuffEvent) {
        if (this.currentStandard) {
            if (this.currentDevilment?.isOpen) {
                // Switching partners here would drop Devilment -- merge this window
                return
            }

            if (event.timestamp < this.currentStandard.start + MIN_WINDOW_LENGTH) {
                // The previous window was too short for swapping to be viable -- merge this window
                return
            }

            this.currentStandard.close(event.timestamp)
        }

        console.log(`new standard at ${event.timestamp / 1000} on ${event.targetID}`)

        const isTillana = (this.lastApplierID != null) && (this.lastApplierID === TILLANA_ID)
        const standard = new Standard(event.timestamp, event.targetID, isTillana)

        this.currentStandard = standard
        this.emitStandard(standard)
    }

    private onRemoveStandard(event: RemoveBuffEvent) {
        if (this.currentStandard) {
            this.currentStandard.close(event.timestamp)
            this.currentStandard = undefined
        }
    }

    private onDevilment(event: ApplyBuffEvent) {
        if (event.targetID === this.id) {
            return
        }

        if (!this.currentStandard) {
            console.warn('Devilment found with no standard?')
            return
        }

        const devilment = new Devilment(event.timestamp, event.targetID)
        this.currentDevilment = devilment
        this.currentStandard.addDevilment(devilment)
    }

    private onRemoveDevilment(event: RemoveBuffEvent) {
        if (this.currentDevilment) {
            this.currentDevilment.close(event.timestamp)
            this.currentDevilment = undefined
        }
    }
}
