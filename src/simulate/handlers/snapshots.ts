import { Snapshot } from 'types/snapshot'

export class SnapshotHandler {
    private snapshots: Map<number, Snapshot[]> = new Map()

    public handleSnapshot(snapshot: Snapshot) {
        const friendly = this.getFriendly(snapshot.source)
        friendly.push(snapshot)
    }

    public getPlayerSnapshots(id: number): Snapshot[] | false {
        if (this.snapshots.has(id)) {
            return this.snapshots.get(id)
        }
        return false
    }

    private getFriendly(id: number): Snapshot[] {
        if (this.snapshots.has(id)) {
            return this.snapshots.get(id)
        }

        const casts: Snapshot[]  = []
        this.snapshots.set(id, casts)

        return casts
    }
}
