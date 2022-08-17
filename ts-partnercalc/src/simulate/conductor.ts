import { FFLogsEvent } from 'parse/fflogs/event'
import { Friend } from 'parse/fflogs/fight'
import { FFLogsParser } from 'parse/fflogs/parser'
import { EnemyHandler } from './handlers/enemy'
import { PlayerHandler } from './handlers/player'

export class Conductor {
    private parser: FFLogsParser
    private dancer: Friend
    private enemies: EnemyHandler
    private players: PlayerHandler

    constructor(parser: FFLogsParser, dancer: Friend) {
        this.parser = parser
        this.dancer = dancer
        this.enemies = new EnemyHandler(parser.fight.friends)
    }

    private processEvent(event: FFLogsEvent) {
        this.enemies.processEvent(event)
        this.players.processEvent(event)
        // processEvent on dancer?
    }
}
