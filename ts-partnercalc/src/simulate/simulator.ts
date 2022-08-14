import { FFLogsEvent } from 'parse/fflogs/event'
import { Friend } from 'parse/fflogs/fight'
import { FFLogsParser } from 'parse/fflogs/parser'
import { EnemyHandler } from './handlers/enemy'

export class Simulator {
    private parser: FFLogsParser
    private dancer: Friend
    private enemies: EnemyHandler

    constructor(parser: FFLogsParser, dancer: Friend) {
        this.parser = parser
        this.dancer = dancer
        this.enemies = new EnemyHandler(parser.fight.friends)
    }

    private processEvent(event: FFLogsEvent) {
        this.enemies.processEvent(event)

        // processEvent on each ally?
        // processEvent on dancer?
    }
}
