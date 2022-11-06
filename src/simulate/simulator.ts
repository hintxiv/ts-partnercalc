import { FFLogsEvent } from 'api/fflogs/event'
import { Friend } from 'api/fflogs/fight'
import { FFLogsParser } from 'api/fflogs/parser'
import { DataProvider } from 'data/provider'
import { ComputedPlayer, ComputedStandard, DamageTotals } from 'types'
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

    constructor(parser: FFLogsParser, dancer: Friend) {
        this.parser = parser
        this.data = new DataProvider()
        this.dancer = new Dancer(dancer.id, this.registerNewStandard, this.data)
        this.enemies = new EnemyHandler(parser.fight.friends, this.data)

        // The Dancer can't partner themselves
        const potentialPartners = parser.fight.friends.filter(player => player.id !== dancer.id)
        this.players = new PlayerHandler(potentialPartners, this.registerNewSnapshot, this.data)
    }

    public async calculatePartnerDamage(/* TODO: player stats */): Promise<ComputedStandard[]> {
        if (this.standards.length === 0) {
            // Build + cache standard windows from the report
            await this.buildStandardWindows()
        }

        const results: ComputedStandard[] = []

        for (const standard of this.standards) {
            results.push(this.calculateStandard(standard))
        }

        return results
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

        return {
            start: standard.start,
            end: standard.end ?? this.parser.fight.end,
            appliedBy: standard.isTillana ? 'Tillana' : 'Standard Finish',
            players: players,
            actualPartner: players.find(player => player.id === standard.targetID),
            bestPartner: players[0],
            events: [],
        }
    }

    private async buildStandardWindows(): Promise<void> {
        const debuffIDs = Object.values(this.data.debuffs)
            .map(effect => effect.id)

        const events = this.parser.getEvents(debuffIDs)

        for await (const event of events) {
            this.processEvent(event)
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
        snapshot.effects.push(...debuffs)

        standard.processSnapshot(snapshot)
    }
}
