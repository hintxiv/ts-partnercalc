import { CastInstance } from 'simulate/instances'

export class CastHandler {
    private casts: Map<number, CastInstance[]> = new Map()

    public handleCast(cast: CastInstance) {
        const friendly = this.getFriendly(cast.source)
        friendly.push(cast)
    }

    public getPlayerCasts(id: number): CastInstance[] | false {
        if (this.casts.has(id)) {
            return this.casts.get(id)
        }
        return false
    }

    private getFriendly(id: number): CastInstance[] {
        if (this.casts.has(id)) {
            return this.casts.get(id)
        }

        const casts: CastInstance[]  = []
        this.casts.set(id, casts)

        return casts
    }
}
