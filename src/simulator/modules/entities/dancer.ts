import {
    ApplyBuffEvent,
    CastEvent,
    FFLogsEvent,
    RemoveBuffEvent,
    SnapshotEvent,
} from 'api/fflogs/event'
import { DataProvider } from 'data/provider'
import { Devilment } from 'simulator/buffwindow/devilment'
import { PrepullStandard } from 'simulator/buffwindow/prepullStandard'
import { Standard } from 'simulator/buffwindow/standard'
import { Entity } from './entity'

const MIN_WINDOW_LENGTH = 10000 // ~4 GCDs

type StandardHook = (standard: Standard) => void

export class Dancer extends Entity {
    public id: number
    private emitStandard: StandardHook
    private prepullStandard: PrepullStandard | undefined
    private currentStandard: Standard | undefined
    private currentDevilment: Devilment | undefined

    private potencyRatios: number[] = []

    constructor(id: number, start: number, standardHook: StandardHook, data: DataProvider) {
        super(id.toString(), data)
        this.id = id
        this.emitStandard = standardHook
        this.createPrepullStandard(start)
        this.init()
    }

    protected createPrepullStandard(start: number) {
        this.prepullStandard = new PrepullStandard(start, this.data)
        this.currentStandard = this.prepullStandard
        this.emitStandard(this.prepullStandard)
    }

    protected init() {
        const standardFilter = { actionID: this.data.statuses.STANDARD_FINISH.id }
        const devilmentFilter = { actionID: this.data.statuses.DEVILMENT.id }

        this.addHook('applybuff', this.onStandard, standardFilter)
        this.addHook('removebuff', this.onRemoveStandard, standardFilter)
        this.addHook('applybuff', this.onDevilment, devilmentFilter)
        this.addHook('removebuff', this.onRemoveDevilment, devilmentFilter)
        this.addHook('cast', this.onStandardCast, { actionID: this.data.actions.TILLANA.id })
        this.addHook('cast', this.onStandardCast, { actionID: this.data.actions.DOUBLE_STANDARD_FINISH.id })
        this.addHook('cast', this.onTechnicalCast, { actionID: this.data.actions.QUADRUPLE_TECHNICAL_FINISH.id })
        this.addHook('cast', this.onPartnerSwap, { actionID: this.data.actions.CLOSED_POSITION.id })
        this.addHook('snapshot', this.onSnapshot, { sourceID: this.id })
    }

    public processEvent(event: FFLogsEvent) {
        if (event.sourceID !== this.id) {
            return
        }
        super.processEvent(event)
    }

    public get potencyRatio() {
        const sum = this.potencyRatios.reduce((sum, x) => sum + x, 0)
        return sum / this.potencyRatios.length
    }

    private resolvePrepullStandard(event: ApplyBuffEvent | RemoveBuffEvent) {
        this.prepullStandard.addTarget(event.targetID)
        this.prepullStandard = undefined
    }

    private onStandardCast(event: CastEvent) {
        if (this.currentStandard != null) {
            const isTillana = event.actionID === this.data.actions.TILLANA.id
            this.currentStandard.addStandardCast(isTillana, event.timestamp, event.targetID)
        }
    }

    private onTechnicalCast(event: CastEvent) {
        if (this.currentStandard != null) {
            this.currentStandard.addTechnical(event.timestamp)
        }
    }

    private onPartnerSwap(event: CastEvent) {
        if (this.currentStandard != null) {
            this.currentStandard.addClosedPosition(event.timestamp, event.targetID)
        }
    }

    private onSnapshot(event: SnapshotEvent) {
        const action = this.data.getAction(event.actionID)

        if (action == null || action.potency == null || action.falloff) {
            return
        }

        this.potencyRatios.push(event.amount / action.potency)
    }

    private onStandard(event: ApplyBuffEvent) {
        if (this.prepullStandard != null) {
            this.resolvePrepullStandard(event)
        }

        if (this.currentStandard) {
            if (this.currentDevilment?.isOpen
                || event.timestamp < this.currentStandard.start + MIN_WINDOW_LENGTH) {
                /* Switching partners here would drop Devilment
                    OR the previous window was too short
                    -> merge the new standard application into the current window
                */
                return
            }

            this.currentStandard.close(event.timestamp)
        }

        const standard = new Standard(event.timestamp, event.targetID, this.data)

        this.currentStandard = standard
        this.emitStandard(standard)
    }

    private onRemoveStandard(event: RemoveBuffEvent) {
        if (this.prepullStandard != null) {
            this.resolvePrepullStandard(event)
        }

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
