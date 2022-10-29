import { Job } from 'types'

export interface Friend {
    id: number
    name: string
    job: Job
}

export interface Pet {
    id: number
    name: string
    ownerID: number
}

export interface Fight {
    reportID: string
    fightID: number
    zoneID: number
    encounter: string
    start: number
    end: number
    friends: Friend[]
    pets: Pet[]
}
