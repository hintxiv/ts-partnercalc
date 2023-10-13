import {
    ApplyBuffEvent,
    CastEvent,
    FFLogsEvent,
    RemoveBuffEvent,
    SnapshotEvent,
} from 'api/fflogs/event'
import { DataProvider } from 'data/provider'
import { BuffWindow } from 'simulator/buffwindow/buffwindow'
import { Devilment } from 'simulator/buffwindow/devilment'
import { PrepullStandard } from 'simulator/buffwindow/prepullStandard'
import { Standard } from 'simulator/buffwindow/standard'
import { Entity } from './entity'

const MIN_WINDOW_LENGTH = 10000 // ~4 GCDs

type BuffWindowHook = (window: BuffWindow) => void

export class Dancer extends Entity {
    public id: number
    private emitWindow: BuffWindowHook
    private prepullStandard: PrepullStandard | undefined
    private currentStandard: Standard | undefined
    private currentDevilment: Devilment | undefined
    private activeWindow: BuffWindow | undefined

    private potencyRatios: number[] = []

    constructor(id: number, start: number, buffWindowHook: BuffWindowHook, data: DataProvider) {
        super(id.toString(), data)
        this.id = id
        this.emitWindow = buffWindowHook
        this.createPrepullStandard(start)
        this.init()
    }

    protected createPrepullStandard(start: number) {
        this.prepullStandard = new PrepullStandard(start, this.data)
        this.currentStandard = this.prepullStandard
        this.handleNewWindow(this.prepullStandard)
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
        this.addHook('cast', this.onDevilmentCast, { actionID: this.data.actions.DEVILMENT.id })
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

    private onDevilmentCast(event: CastEvent) {
        if (this.currentDevilment != null) {
            this.currentDevilment.addDevilmentCast(event.timestamp, event.targetID)
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

    private mergeWindow(window: BuffWindow) {
        if (!this.activeWindow.hasOpenBuffOfType(window.type)) {
            this.activeWindow.addChild(window)
        }
    }

    private handleNewWindow(window: BuffWindow) {
        if (this.activeWindow && this.activeWindow.isOpen) {
            if (this.activeWindow.hasOpenBuffOfType('devilment')) {
                // Swapping partners here would drop devilment
                this.mergeWindow(window)
                return
            }

            if (window.start < this.activeWindow.start + MIN_WINDOW_LENGTH) {
                // The previous window was too short
                this.mergeWindow(window)
                return
            }

            if (window.type === 'devilment') {
                // Always merge devilment uses if a window is open
                this.mergeWindow(window)
                return
            }
        }

        if (this.activeWindow) {
            this.activeWindow.close(window.start)
        }

        this.activeWindow = window
        this.emitWindow(window)
    }

    private onStandard(event: ApplyBuffEvent) {
        if (this.prepullStandard != null) {
            this.resolvePrepullStandard(event)
        }

        const standard = new Standard(event.timestamp, event.targetID, this.data)
        this.currentStandard = standard
        this.handleNewWindow(standard)
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

        const devilment = new Devilment(event.timestamp, event.targetID, this.data)
        this.currentDevilment = devilment
        this.handleNewWindow(devilment)
    }

    private onRemoveDevilment(event: RemoveBuffEvent) {
        if (this.currentDevilment) {
            this.currentDevilment.close(event.timestamp)
            this.currentDevilment = undefined
        }
    }
}
