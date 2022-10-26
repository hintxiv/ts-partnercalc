import { JOBS } from 'data/jobs'
import ky, { Options } from 'ky'
import { Fight, Friend, Pet } from './fight'
import { Report, ReportFight, ReportFriend, ReportPet } from './report'

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

export interface FFLogsQuery {
    start: number
    end: number
    sourceid?: number
    filter?: string
}

interface FFLogsResponseEvent {
    timestamp: number
    sourceID: number
    type: string
    ability?: {
        guid: number
    }
    extraAbility?: {
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
}

interface FFLogsResponse {
    events: FFLogsResponseEvent[]
    nextPageTimestamp: number
}

function adaptReportFriend(friend: ReportFriend): Friend {
    return {
        id: friend.id,
        name: friend.name,
        job: friend.type in JOBS
            ? JOBS[friend.type as keyof typeof JOBS]
            : JOBS.Unknown,
    }
}

function adaptReportPet(pet: ReportPet): Pet {
    return {
        id: pet.id,
        name: pet.name,
        ownerID: pet.petOwner,
    }
}

export async function fetchFight(reportID: string, fightID: number): Promise<Fight> {
    const report: Report = await fflogs.get(`fights/${reportID}/`).json()
    const friends: Friend[] = []
    const friendlyPets: Pet[] = []

    report.friendlies.forEach((friend: ReportFriend) => {
        if (!NO_FAKE_FRIENDS.includes(friend.name)) {
            if (friend.fights.some(fight => fight.id === fightID)) {
                friends.push(adaptReportFriend(friend))
            }
        }
    })

    report.friendlyPets.forEach((pet: ReportPet) => {
        if (pet.fights.some(fight => fight.id === fightID)) {
            friendlyPets.push(adaptReportPet(pet))
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

export async function fetchEvents(fight: Fight, query: FFLogsQuery): Promise<FFLogsResponseEvent[]> {
    const searchParams = query as Record<keyof FFLogsQuery, string | number>

    let response: FFLogsResponse = await fflogs.get(
        `events/summary/${fight.reportID}`,
        {searchParams: searchParams}
    ).json()

    const events: FFLogsResponseEvent[] = response.events

    // Handle pagination
    while (response.nextPageTimestamp && response.events.length > 0) {
        searchParams.start = response.nextPageTimestamp
        response = await fflogs.get(
            `events/summary/${fight.reportID}`,
            {searchParams: searchParams}
        ).json()
        events.push(...response.events)
    }

    return events
}
