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

export interface ReportFriend {
    id: number
    name: string
    type: string
    fights: ReportFight[]
}

export interface ReportPet {
    id: number
    name: string
    petOwner: number
    fights: ReportFight[]
}

export interface Report {
    friendlies: ReportFriend[]
    friendlyPets: ReportPet[]
    fights: ReportFight[]
}
