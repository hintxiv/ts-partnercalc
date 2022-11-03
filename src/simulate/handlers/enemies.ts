import { FFLogsEvent } from 'api/fflogs/event'
import { Friend } from 'api/fflogs/fight'
import { DataProvider } from 'data/provider'
import { Enemy } from 'simulate/modules/entities/enemy'
import { Effect } from 'types'

export class EnemyHandler {
    private enemies: Map<string, Enemy> = new Map()
    private friends: Friend[]
    private data: DataProvider

    constructor(friends: Friend[], data: DataProvider) {
        this.friends = friends
        this.data = data
    }

    public processEvent(event: FFLogsEvent) {
        if (this.friends.some(friend => friend.id === event.targetID)) {
            return
        }

        const enemy = this.getEnemy(event.targetKey)
        enemy.processEvent(event)
    }

    public getEnemyDebuffs(key: string): Effect[] {
        return this.getEnemy(key).activeDebuffs
    }

    private getEnemy(key: string): Enemy {
        if (this.enemies.has(key)) {
            return this.enemies.get(key)
        }

        const newEnemy = new Enemy(key, this.data)
        this.enemies.set(key, newEnemy)

        return newEnemy
    }
}
