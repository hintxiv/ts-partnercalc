import { DataProvider } from 'data/provider'
import { ComputedDamage, Snapshot } from 'types'
import { WindowInfo } from './buffWindow'

export abstract class Buff {
    public abstract readonly type: string
    public start: number
    public end?: number
    protected data: DataProvider

    constructor(start: number, data: DataProvider) {
        this.start = start
        this.data = data
    }

    public get isOpen() {
        return this.end == null
    }

    public close(end: number) {
        if (this.isOpen) {
            this.end = end
        }
    }

    public abstract calculateDamageFromSnapshot(
        snapshot: Snapshot,
        windowInfo: WindowInfo,
    ): ComputedDamage
}
