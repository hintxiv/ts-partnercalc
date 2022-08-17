import { BUFFS } from 'data/raidbuffs'
import { ApplyBuffEvent, FFLogsEvent, RemoveBuffEvent } from 'parse/fflogs/event'
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
        this.emitStandard = standardHook
    }

    protected init() {
        this.addHook('applybuff', BUFFS.STANDARD_FINISH.id, this.onStandard)
        this.addHook('removebuff', BUFFS.STANDARD_FINISH.id, this.onRemoveStandard)
        this.addHook('applybuff', BUFFS.DEVILMENT.id, this.onDevilment)
        this.addHook('removebuff', BUFFS.DEVILMENT.id, this.onRemoveDevilment)
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
