import { FFLogsEvent } from 'parse/fflogs/event'
import { Friend } from 'parse/fflogs/fight'
import { FFLogsParser } from 'parse/fflogs/parser'
import { Standard } from './buffwindow/standard'
import { EnemyHandler } from './handlers/enemies'
import { PlayerHandler } from './handlers/players'
import { CastHook } from './hooks'
import { CastInstance } from './instances'
import { Dancer } from './modules/entity/dancer'

export class Conductor {
    private parser: FFLogsParser
    private dancer: Dancer
    private enemies: EnemyHandler
    private players: PlayerHandler
    private standards: Standard[] = []

    constructor(parser: FFLogsParser, dancer: Friend) {
        this.parser = parser
        this.dancer = new Dancer(dancer.id, this.assignStandard)
        this.players = new PlayerHandler(parser.fight.friends, this.assignCast)
        this.enemies = new EnemyHandler(parser.fight.friends)
    }

    private processEvent(event: FFLogsEvent) {
        this.enemies.processEvent(event)
        this.players.processEvent(event)
        // processEvent on dancer?
    }

    private getStandard(time: number): Standard | undefined {
        const lastStandard = this.standards.at(-1)

        if (!lastStandard) { return undefined }

        const start = lastStandard.start
        const end = lastStandard.end

        if (lastStandard && time > start && (!end || time > end)) {
            return lastStandard
        }

        return undefined
    }

    private assignStandard = (standard: Standard) => {
        this.standards.push(standard)
    }

    private assignCast: CastHook = (cast: CastInstance) => {
        const standard = this.getStandard(cast.timestamp)

        if (!standard) { return }

        const debuffs = this.enemies.getEnemyDebuffs(cast.target)
        cast.effects.push(...debuffs)

        standard.processCast(cast)
    }
}
