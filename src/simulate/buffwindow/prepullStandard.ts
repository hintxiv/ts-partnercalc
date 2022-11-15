import { DataProvider } from 'data/provider'
import { Standard } from './standard'

export class PrepullStandard extends Standard {
    constructor(start: number, data: DataProvider) {
        super(start, -1, data)
    }

    public addTarget(targetID: number) {
        this.targetID = targetID
    }
}
