import { FFLogsEvent } from 'api/fflogs/event'
import { Friend } from 'api/fflogs/fight'
import { FFLogsParser } from 'api/fflogs/parser'
import { DataProvider } from 'data/provider'
import {
    ComputedEvent,
    ComputedPlayer,
    ComputedWindow,
    DamageTotals,
    OverallDamage,
} from 'types'
import { Snapshot } from '../types/snapshot'
import { BuffWindow } from './buffwindow/buffwindow'
import { EnemyHandler } from './handlers/enemies'
import { PlayerHandler } from './handlers/players'
import { SnapshotHook } from './hooks'
import { Dancer } from './modules/entities/dancer'

export class Simulator {
    private parser: FFLogsParser
    private data: DataProvider
    private dancer: Dancer
    private enemies: EnemyHandler
    private players: PlayerHandler
    private buffWindows: BuffWindow[] = []
    private results: ComputedWindow[] = []

    constructor(parser: FFLogsParser, dancer: Friend) {
        this.parser = parser
        this.data = new DataProvider()
        this.dancer = new Dancer(dancer.id, parser.fight.start, this.registerNewBuffWindow, this.data)
        this.enemies = new EnemyHandler(parser.fight.friends, this.data)

        // The Dancer can't partner themselves
        const potentialPartners = parser.fight.friends.filter(player => player.id !== dancer.id)
        this.players = new PlayerHandler(potentialPartners, this.registerNewSnapshot, this.data)
    }

    public async calculatePartnerDamage(/* TODO: player stats */): Promise<ComputedWindow[]> {
        if (this.results.length === 0) {
            // Build + cache standard windows from the report
            await this.buildStandardWindows()
        }

        return this.results
    }

    public calculateOverallDamage(): OverallDamage {
        const playerMap: Map<number, ComputedPlayer> = new Map()

        for (const window of this.results) {
            for (const player of window.players) {
                if (playerMap.has(player.id)) {
                    const totals = playerMap.get(player.id).totals

                    totals.standard += player.totals.standard
                    totals.esprit += player.totals.esprit
                    totals.devilment += player.totals.devilment
                    totals.total += player.totals.total

                } else {
                    playerMap.set(player.id, {
                        ...player,
                        damage: [],
                        totals: { ...player.totals },
                    })
                }
            }
        }

        const players = [...playerMap.values()]
        players.sort((a, b) => b.totals.total - a.totals.total)

        return {
            players: players,
            bestPartner: players[0],
        }
    }

    private async buildStandardWindows(): Promise<void> {
        const debuffIDs = Object.values(this.data.debuffs)
            .map(effect => effect.id)

        const events = this.parser.getEvents(debuffIDs)

        for await (const event of events) {
            this.processEvent(event)
        }

        this.results = this.buffWindows
            .map(this.calculateBuffWindow, this)
            .filter(window => window != null)
    }

    private calculateBuffWindow(window: BuffWindow, /* TODO: player stats */): ComputedWindow | undefined {
        const computedPlayers: ComputedPlayer[] = []
        const players = this.players.getPlayers()
        const actualPartner = players.find(player => player.id === window.target)

        if (actualPartner == null) {
            // Something weird happened, skip this window
            return
        }

        for (const player of players) {
            // TODO override these stats if we have better ones
            const computedDamage = window.getPlayerContribution({
                stats: player.getEstimatedStats(),
                player: player,
                potencyRatio: this.dancer.potencyRatio,
            })

            if (computedDamage.length === 0 && player !== actualPartner) {
                continue
            }

            const damageTotals: DamageTotals = {
                standard: 0,
                esprit: 0,
                devilment: 0,
                total: 0,
            }

            for (const damage of computedDamage) {
                damageTotals.standard += damage.standard
                damageTotals.devilment += damage.devilment
                damageTotals.esprit += damage.esprit
                damageTotals.total += damage.standard + damage.devilment + damage.esprit
            }

            computedPlayers.push({
                id: player.id,
                name: player.name,
                job: player.job,
                damage: computedDamage,
                totals: damageTotals,
            })
        }

        if (computedPlayers.length === 1 && computedPlayers[0].totals.total === 0) {
            // Empty window, skip
            return
        }

        // Sort from high DPS to low DPS
        computedPlayers.sort((a, b) => b.totals.total - a.totals.total)

        const events: ComputedEvent[] = window.getEvents().map(event => ({
            action: event.action,
            timestamp: event.timestamp,
            target: computedPlayers.find(player => player.id === event.targetID),
        }))

        return {
            start: window.start,
            end: window.end ?? this.parser.fight.end,
            players: computedPlayers,
            actualPartner: computedPlayers.find(player => player.id === window.target),
            bestPartner: computedPlayers[0],
            events: events,
        }
    }

    private processEvent(event: FFLogsEvent) {
        this.dancer.processEvent(event)
        this.players.processEvent(event)
        this.enemies.processEvent(event)
    }

    private getWindow(time: number): BuffWindow | undefined {
        const lastWindow = this.buffWindows.at(-1)

        if (!lastWindow) { return undefined }

        const start = lastWindow.start
        const end = lastWindow.end

        if (lastWindow && time > start && (!end || time > end)) {
            return lastWindow
        }

        return undefined
    }

    private registerNewBuffWindow = (window: BuffWindow) => {
        this.buffWindows.push(window)
    }

    private registerNewSnapshot: SnapshotHook = (snapshot: Snapshot) => {
        const window = this.getWindow(snapshot.timestamp)

        if (!window) { return }

        const debuffs = this.enemies.getEnemyDebuffs(snapshot.target)
        snapshot.addDebuffs(debuffs)

        window.processSnapshot(snapshot)
    }
}
