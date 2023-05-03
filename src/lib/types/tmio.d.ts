export interface CotdDivData {
    results: Result[]
    unit: string
}

export interface Result {
    player: Player
    position: number
    score: number
}

export interface Player {
    name: string
    tag?: string
    id: string
    zone: Zone
    meta?: Meta
}

export interface Zone {
    name: string
    flag: string
    parent?: Zone
}

export interface Meta {
    twitch?: string
    twitter?: string
    youtube?: string
    vanity?: string
    tmgl?: boolean
}