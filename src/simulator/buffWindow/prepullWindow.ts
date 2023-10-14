import { DataProvider } from 'data/provider'
import { BuffWindow } from './buffWindow'

export class PrepullWindow extends BuffWindow {
    constructor(start: number, data: DataProvider) {
        super(start, -1, data)
    }

    public addTarget(target: number) {
        this.target = target
    }
}
