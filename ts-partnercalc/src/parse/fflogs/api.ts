import ky, { Options } from 'ky'
import { Fight, Friend, PetFriend } from './fight'
import { Report, ReportFight, ReportFriend, ReportPetFriend } from './report'

const NO_FAKE_FRIENDS = [
    'Ground Effect',
    'Multiple Players',
    'Limit Break',
]

const options: Options = {
    prefixUrl: process.env.FFLOGS_API_URL,
    searchParams: {
        api_key: process.env.FFLOGS_API_KEY,
        translate: true,
    },
    timeout: 20000, // up to 20s for potentially large requests
}

const fflogs = ky.create(options)

export interface FFLogsQuery
{
    start: number
    end: number
    sourceid?: number
    filter?: string
}

interface FFLogsResponseEvent
{
    timestamp: number
    sourceID: number
    type: string
    ability?: {
        guid: number
    }
    amount?: number
    hitType?: number
    directHit?: boolean
    tick?: boolean
    expectedCritRate?: number
    actorPotencyRatio?: number
    buffs?: string
    targetID?: number
    targetInstance?: number
    // ... some other stuff too, but we only care about these fields
}

export async function fetchFight(reportID: string, fightID: number): Promise<Fight> {
    const report: Report = await fflogs.get(`fights/${reportID}/`).json()
    const friends: Friend[] = []
    const friendlyPets: PetFriend[] = []

    report.friendlies.forEach((friend: ReportFriend) => {
        if (!NO_FAKE_FRIENDS.includes(friend.name)) {
            if (friend.fights.some(fight => fight.id === fightID)) {
                friends.push(friend)
            }
        }
    })

    report.friendlyPets.forEach((pet: ReportPetFriend) => {
        if (pet.fights.some(fight => fight.id === fightID)) {
            friendlyPets.push(pet)
        }
    })

    const reportFight: ReportFight = report.fights
        .filter((fight: ReportFight) => fight.id === fightID)[0]

    return {
        reportID: reportID,
        fightID: reportFight.id,
        zoneID: reportFight.zoneID,
        encounter: reportFight.name,
        start: reportFight.start_time,
        end: reportFight.end_time,
        friends: friends,
        pets: friendlyPets,
    }
}

export async function fetchLastFightID(reportID: string): Promise<number> {
    const report: Report = await fflogs.get(`fights/${reportID}/`).json()

    return report.fights.slice(-1)[0].id
}

export async function fetchEvents(fight: Fight, query: FFLogsQuery): Promise<{events: FFLogsResponseEvent[]}> {
    const searchParams = query as Record<keyof FFLogsQuery, string | number>

    const events = await fflogs.get(
        `events/summary/${fight.reportID}`,
        {searchParams: searchParams}
    )

    return events.json()
}
