import { fetchEvents, fetchFight, FFLogsQuery } from './api'
import { EventFields, FFLogsEvent } from './event'
import { Fight } from './fight'
import { HitType } from './report'

export class FFLogsParser {
    public reportID: string
    public fightID: number
    public fight: Fight

    constructor(reportID: string, fightID: number) {
        this.reportID = reportID
        this.fightID = fightID
    }

    public async init() {
        this.fight = await fetchFight(this.reportID, this.fightID)
    }

    public async * getEvents(sourceID: number, debuffIDs: number[]): AsyncGenerator<FFLogsEvent, void, undefined> {
        const eventsQuery: FFLogsQuery = {
            start: this.fight.start,
            end: this.fight.end,
            sourceid: sourceID,
        }

        // Need to send a second query to get raid debuffs (trick / chain)
        const debuffFilter = debuffIDs
            .map(id => `ability.id=${id}`)
            .join(' or ')

        const debuffsQuery: FFLogsQuery = {
            start: this.fight.start,
            end: this.fight.end,
            filter: debuffFilter,
        }

        const playerEventsJSON = await fetchEvents(this.fight, eventsQuery)
        const debuffEventsJSON = await fetchEvents(this.fight, debuffsQuery)

        const events = [...playerEventsJSON.events, ...debuffEventsJSON.events]
            .sort((a, b) => a.timestamp - b.timestamp)

        for (const e of events) {
            const targetID = e.targetID ?? e.sourceID
            const targetInstance = e.targetInstance ?? 0

            const fields: EventFields = {
                timestamp: e.timestamp,
                sourceID: e.sourceID,
                targetID: e.targetID,
                targetKey: `${targetID}-${targetInstance}`,
            }

            if (e.type === 'applybuff') {
                yield { type: e.type, statusID: e.ability.guid, ...fields }

            } else if (e.type === 'removebuff') {
                yield { type: e.type, statusID: e.ability.guid, ...fields }

            } else if (e.type === 'applydebuff') {
                yield { type: e.type, statusID: e.ability.guid, ...fields }

            } else if (e.type === 'removedebuff') {
                yield { type: e.type, statusID: e.ability.guid, ...fields }

            } else if (e.type === 'cast') {
                yield { type: e.type, actionID: e.ability.guid, ...fields }

            } else if (e.type === 'damage') {
                if (e.tick) {
                    yield {
                        type: 'tick',
                        statusID: e.ability.guid,
                        expectedCritRate: e.expectedCritRate,
                        actorPotencyRatio: e.actorPotencyRatio,
                        ...fields,
                    }

                } else {
                    yield {
                        type: 'damage',
                        actionID: e.ability.guid,
                        amount: e.amount,
                        isCrit: e.hitType === HitType.CRITICAL,
                        isDH: !!e.directHit,
                        ...fields,
                    }
                }
            }
        }
    }
}
