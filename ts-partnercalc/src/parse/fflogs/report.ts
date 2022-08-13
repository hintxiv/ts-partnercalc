import { Friend, PetFriend } from './fight'

export enum HitType {
    MISS = 0,
    NORMAL = 1,
    CRITICAL = 2,
    BLOCK = 4,
    DODGE = 7,
}

export interface ReportFight {
    id: number
    zoneID: number
    start_time: number
    end_time: number
    name: string
}

export type ReportFriend = Friend & { fights: ReportFight[] }
export type ReportPetFriend = PetFriend & { fights: ReportFight[] }

export interface Report {
    friendlies: ReportFriend[]
    friendlyPets: ReportPetFriend[]
    fights: ReportFight[]
}
