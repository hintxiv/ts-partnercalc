import { FFLogsEvent } from 'api/fflogs/event'
import { Friend } from 'api/fflogs/fight'
import { CastHook } from 'simulate/hooks'
import { Player } from 'simulate/modules/entities/player'

export class PlayerHandler {
    private players: Map<number, Player> = new Map()
    private friends: Friend[]
    private castHook: CastHook

    constructor(friends: Friend[], castHook: CastHook) {
        this.friends = friends
        this.castHook = castHook
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

        const newPlayer = new Player(friend, this.castHook)
        this.players.set(friend.id, newPlayer)

        return newPlayer
    }
}
