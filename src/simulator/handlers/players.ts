import { FFLogsEvent } from 'api/fflogs/event'
import { Friend } from 'api/fflogs/fight'
import { DataProvider } from 'data/provider'
import { SnapshotHook } from 'simulator/hooks'
import { Player } from 'simulator/modules/entities/player'

export class PlayerHandler {
    private players: Map<number, Player> = new Map()
    private friends: Friend[]
    private snapshotHook: SnapshotHook
    private data: DataProvider

    constructor(friends: Friend[], snapshotHook: SnapshotHook, data: DataProvider) {
        this.friends = friends
        this.snapshotHook = snapshotHook
        this.data = data
    }

    public * getPlayers(): Generator<Player, void, undefined> {
        for (const friend of this.friends) {
            if (this.players.has(friend.id)) {
                yield this.players.get(friend.id)
            }
        }
    }

    public processEvent(event: FFLogsEvent) {
        // TODO we'll probably need a pet map for this a la partnercalc 1.0
        const playerID = ['applybuff', 'removebuff'].includes(event.type)
            ? event.targetID
            : event.sourceID

        const friend = this.friends.find(friend => friend.id === playerID)

        if (!friend) { return }

        const player = this.getPlayer(friend)
        player.processEvent(event)
    }

    private getPlayer(friend: Friend): Player {
        if (this.players.has(friend.id)) {
            return this.players.get(friend.id)
        }

        const PlayerClass = friend.job.constructor
        const newPlayer = new PlayerClass(friend, this.snapshotHook, this.data)
        this.players.set(friend.id, newPlayer)

        return newPlayer
    }
}
