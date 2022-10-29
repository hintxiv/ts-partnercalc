import { ApplyBuffEvent, FFLogsEvent, RemoveBuffEvent } from 'api/fflogs/event'
import { BUFFS } from 'data/raidbuffs'
import { Devilment } from 'simulate/buffwindow/devilment'
import { Standard } from 'simulate/buffwindow/standard'
import { Entity } from './entity'

type StandardHook = (standard: Standard) => void

const TILLANA_ID = 25790

export class Dancer extends Entity {
    public id: number
    private emitStandard: StandardHook
    private currentStandard: Standard | undefined
    private currentDevilment: Devilment | undefined

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
    }

    public processEvent(event: FFLogsEvent) {
        if (event.sourceID !== this.id || event.targetID === this.id) {
            return
        }
        super.processEvent(event)
    }

    private onStandard(event: ApplyBuffEvent) {
        const isTillana = (event.appliedBy && event.appliedBy === TILLANA_ID)
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
        if (event.targetID === this.id) { return }

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
