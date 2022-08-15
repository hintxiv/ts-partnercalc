import { CastHandler } from 'simulate/handlers/casts'
import { CastInstance } from 'simulate/instances'

export abstract class BuffWindow {
    public start: number
    public end?: number
    public target: number

    protected casts: CastHandler = new CastHandler()

    constructor(start: number, target: number) {
        this.start = start
        this.target = target
    }

    public processCast(cast: CastInstance) {
        this.casts.handleCast(cast)
    }

    public close(end: number) {
        this.end = end
    }
}
