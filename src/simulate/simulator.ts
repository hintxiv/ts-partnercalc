import { FFLogsEvent } from 'api/fflogs/event'
import { Friend } from 'api/fflogs/fight'
import { FFLogsParser } from 'api/fflogs/parser'
import { DEBUFFS } from 'data/raidbuffs'
import { ComputedPlayer, ComputedStandard, DamageTotals } from 'models'
import { Standard } from './buffwindow/standard'
import { EnemyHandler } from './handlers/enemies'
import { PlayerHandler } from './handlers/players'
import { CastHook } from './hooks'
import { CastInstance } from './instances'
import { Dancer } from './modules/entities/dancer'

export class Simulator {
    private parser: FFLogsParser
    private dancer: Dancer
    private enemies: EnemyHandler
    private players: PlayerHandler
    private standards: Standard[] = []

    constructor(parser: FFLogsParser, dancer: Friend) {
        this.parser = parser
        this.dancer = new Dancer(dancer.id, this.assignStandard)
        this.enemies = new EnemyHandler(parser.fight.friends)

        // The Dancer can't partner themselves
        const potentialPartners = parser.fight.friends.filter(player => player.id !== dancer.id)
        this.players = new PlayerHandler(potentialPartners, this.assignCast)
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

        for (const friend of this.parser.fight.friends) {
            const computedDamage = standard.getPlayerContribution(friend.id)

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
                name: friend.name,
                job: friend.job,
                damage: computedDamage,
                totals: damageTotals,
            })
        }

        players.sort((a, b) => a.totals.total - b.totals.total)

        return {
            start: standard.start,
            end: standard.end ?? this.parser.fight.end,
            players: players,
        }
    }

    private async buildStandardWindows(): Promise<void> {
        const debuffIDs = Object.values(DEBUFFS)
            .map(status => status.id)

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
