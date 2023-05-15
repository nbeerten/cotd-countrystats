import type {
    PlayerLeaderboardAndZone,
    ZonesResponse,
    CompetitionResponse,
} from '$lib/server/nadeo';

export interface ConstructorData {
    playerLeaderboardAndZone: PlayerLeaderboardAndZone;
    zonesResponse: ZonesResponse;
    competitionResponse: CompetitionResponse;
}

export class Data {
    protected playerLeaderboardAndZone: PlayerLeaderboardAndZone;
    protected zonesResponse: ZonesResponse;
    protected competitionResponse: CompetitionResponse;

    constructor(data: ConstructorData) {
        this.playerLeaderboardAndZone = data.playerLeaderboardAndZone;
        this.zonesResponse = data.zonesResponse;
        this.competitionResponse = data.competitionResponse;
    }
}
