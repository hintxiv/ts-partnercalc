import { SnapshotHandler } from 'simulator/handlers/snapshots'
import { Snapshot } from 'types/snapshot'

export abstract class BuffWindow {
    public start: number
    public end?: number
    public target: number

    protected snapshots: SnapshotHandler = new SnapshotHandler()

    constructor(start: number, target: number) {
        this.start = start
        this.target = target
    }

    public processSnapshot(snapshot: Snapshot) {
        if (this.isOpen) {
            this.snapshots.handleSnapshot(snapshot)
        }
    }

    public get isOpen() {
        return this.end == null
    }

    public close(end: number) {
        this.end = end
    }
}
