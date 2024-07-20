import {
    ApplyBuffEvent,
    CastEvent,
    FFLogsEvent,
    RemoveBuffEvent,
    SnapshotEvent,
} from 'api/fflogs/event'
import { DataProvider } from 'data/provider'
import { Buff, BuffWindow, Devilment, PrepullWindow, StandardFinish } from 'simulator/buffWindow'
import { Entity } from './entity'

const MIN_WINDOW_LENGTH = 10000 // ~4 GCDs

type BuffWindowHook = (window: BuffWindow) => void

export class Dancer extends Entity {
    public id: number
    private emitWindow: BuffWindowHook
    private prepullWindow: PrepullWindow | undefined
    private activeWindow: BuffWindow | undefined

    private potencyRatios: number[] = []

    constructor(id: number, start: number, buffWindowHook: BuffWindowHook, data: DataProvider) {
        super(id.toString(), data)
        this.id = id
        this.emitWindow = buffWindowHook
        this.createPrepullWindow(start)
        this.init()
    }

    // Creates a buff window with an unknown target to account for a prepull Standard
    protected createPrepullWindow(start: number) {
        const prepullWindow = new PrepullWindow(start, this.data)
        prepullWindow.addBuff(new StandardFinish(start, this.data))

        this.prepullWindow = prepullWindow
        this.activeWindow = prepullWindow
        this.emitWindow(prepullWindow)
    }

    protected init() {
        const standardFilter = { actionID: this.data.statuses.STANDARD_FINISH.id }
        const devilmentFilter = { actionID: this.data.statuses.DEVILMENT.id }

        this.addHook('applybuff', this.onStandard, standardFilter)
        this.addHook('removebuff', this.onRemoveStandard, standardFilter)
        this.addHook('applybuff', this.onDevilment, devilmentFilter)
        this.addHook('removebuff', this.onRemoveDevilment, devilmentFilter)
        this.addHook('cast', this.onStandardCast, { actionID: this.data.actions.FINISHING_MOVE.id })
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

    private resolvePrepullWindow(event: ApplyBuffEvent | RemoveBuffEvent) {
        this.prepullWindow.addTarget(event.targetID)
        this.prepullWindow = undefined
    }

    private onStandardCast(event: CastEvent) {
        if (this.activeWindow != null) {
            const isFinishingMove = event.actionID === this.data.actions.FINISHING_MOVE.id
            this.activeWindow.addStandardCast(isFinishingMove, event.timestamp)
        }
    }

    private onDevilmentCast(event: CastEvent) {
        if (this.activeWindow != null) {
            this.activeWindow.addDevilmentCast(event.timestamp)
        }
    }

    private onTechnicalCast(event: CastEvent) {
        if (this.activeWindow != null) {
            this.activeWindow.addTechnical(event.timestamp)
        }
    }

    private onPartnerSwap(event: CastEvent) {
        if (this.activeWindow != null) {
            this.activeWindow.addClosedPosition(event.timestamp, event.targetID)
        }
    }

    private onSnapshot(event: SnapshotEvent) {
        const action = this.data.getAction(event.actionID)

        if (action == null || action.potency == null || action.falloff) {
            return
        }

        this.potencyRatios.push(event.amount / action.potency)
    }

    private handleNewBuff(buff: Buff, targetID: number) {
        if (this.activeWindow && this.activeWindow.isOpen) {
            if (this.activeWindow.hasActiveBuffOfType('devilment')) {
                // Swapping partners here would drop devilment
                this.activeWindow.addBuff(buff)
                return
            }

            if (buff.start < this.activeWindow.start + MIN_WINDOW_LENGTH) {
                // The previous window was too short to swap
                this.activeWindow.addBuff(buff)
                return
            }

            if (buff.type === 'devilment') {
                // Always merge devilment into the active window
                this.activeWindow.addBuff(buff)
                return
            }
        }

        this.activeWindow.close(buff.start)

        const newWindow = new BuffWindow(buff.start, targetID, this.data)
        newWindow.addBuff(buff)

        this.emitWindow(newWindow)
        this.activeWindow = newWindow
    }

    private onStandard(event: ApplyBuffEvent) {
        if (this.prepullWindow != null) {
            this.resolvePrepullWindow(event)
        }

        const standard = new StandardFinish(event.timestamp, this.data)
        this.handleNewBuff(standard, event.targetID)
    }

    private onRemoveStandard(event: RemoveBuffEvent) {
        if (this.prepullWindow != null) {
            this.resolvePrepullWindow(event)
        }

        if (this.activeWindow) {
            this.activeWindow.closeStandard(event.timestamp)
        }
    }

    private onDevilment(event: ApplyBuffEvent) {
        if (event.targetID === this.id) {
            return
        }

        const devilment = new Devilment(event.timestamp, this.data)
        this.handleNewBuff(devilment, event.targetID)
    }

    private onRemoveDevilment(event: RemoveBuffEvent) {
        if (this.activeWindow) {
            this.activeWindow.closeDevilment(event.timestamp)
        }
    }
}
