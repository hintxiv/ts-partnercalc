import { FFLogsEvent } from 'api/fflogs/event'
import { Friend } from 'api/fflogs/fight'
import { FFLogsParser } from 'api/fflogs/parser'
import { DataProvider } from 'data/provider'
import {
    ComputedEvent,
    ComputedPlayer,
    ComputedStandard,
    DamageTotals,
    OverallDamage,
} from 'types'
import { Snapshot } from '../types/snapshot'
import { Standard } from './buffwindow/standard'
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
    private standards: Standard[] = []
    private results: ComputedStandard[] = []

    constructor(parser: FFLogsParser, dancer: Friend) {
        this.parser = parser
        this.data = new DataProvider()
        this.dancer = new Dancer(dancer.id, parser.fight.start, this.registerNewStandard, this.data)
        this.enemies = new EnemyHandler(parser.fight.friends, this.data)

        // The Dancer can't partner themselves
        const potentialPartners = parser.fight.friends.filter(player => player.id !== dancer.id)
        this.players = new PlayerHandler(potentialPartners, this.registerNewSnapshot, this.data)
    }

    public async calculatePartnerDamage(/* TODO: player stats */): Promise<ComputedStandard[]> {
        if (this.results.length === 0) {
            // Build + cache standard windows from the report
            await this.buildStandardWindows()
        }

        return this.results
    }

    public calculateOverallDamage(): OverallDamage {
        const playerMap: Map<number, ComputedPlayer> = new Map()

        for (const standard of this.results) {
            for (const player of standard.players) {
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

        this.results = this.standards.map(this.calculateStandard, this)
    }

    private calculateStandard(standard: Standard, /* TODO: player stats */): ComputedStandard {
        const players: ComputedPlayer[] = []

        for (const player of this.players.getPlayers()) {
            // TODO override these stats if we have better ones
            const stats = player.getEstimatedStats()
            const computedDamage = standard.getPlayerContribution(player, stats, this.dancer.potencyRatio)

            if (computedDamage.length === 0) { continue }

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

            players.push({
                id: player.id,
                name: player.name,
                job: player.job,
                damage: computedDamage,
                totals: damageTotals,
            })
        }

        // Sort from high DPS to low DPS
        players.sort((a, b) => b.totals.total - a.totals.total)

        const events: ComputedEvent[] = standard.getEvents().map(event => ({
            action: event.action,
            timestamp: event.timestamp,
            target: players.find(player => player.id === event.targetID),
        }))

        return {
            start: standard.start,
            end: standard.end ?? this.parser.fight.end,
            players: players,
            actualPartner: players.find(player => player.id === standard.target),
            bestPartner: players[0],
            events: events,
        }
    }

    private processEvent(event: FFLogsEvent) {
        this.dancer.processEvent(event)
        this.players.processEvent(event)
        this.enemies.processEvent(event)
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

    private registerNewStandard = (standard: Standard) => {
        this.standards.push(standard)
    }

    private registerNewSnapshot: SnapshotHook = (snapshot: Snapshot) => {
        const standard = this.getStandard(snapshot.timestamp)

        if (!standard) { return }

        const debuffs = this.enemies.getEnemyDebuffs(snapshot.target)
        snapshot.addDebuffs(debuffs)

        standard.processSnapshot(snapshot)
    }
}
