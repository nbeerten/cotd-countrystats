import { NadeoClient } from './NadeoClient';

export type CompetitionLeaderboardResponse = {
    participant: string;
    rank: number;
    score: number;
    zone: string;
}[];

export type CompetitionResponse = {
    id: number;
    liveId: string;
    creator: string;
    name: string;
    participantType: string;
    description: string;
    registrationStart: unknown;
    registrationEnd: unknown;
    startDate: number;
    endDate: number;
    matchesGenerationDate: number;
    nbPlayers: number;
    spotStructure: string;
    leaderboardId: number;
    manialink: unknown;
    rulesUrl: string | null;
    streamUrl: string | null;
    websiteUrl: string | null;
    logoUrl: string | null;
    verticalUrl: string | null;
    allowedZones: Array<string>;
    deletedOn: unknown;
    autoNormalizeSeeds: boolean;
    region: string;
    autoGetParticipantSkillLevel: string;
    matchAutoMode: string;
    partition: string;
};
export type CompetitionRoundsResponse = unknown;

export class NadeoClubClient extends NadeoClient {
    public async getCompetitionLeaderboard(
        competitionId: string | number,
        length = 10,
        offset = 0
    ) {
        if (length > 255) {
            throw new Error("`length` must be less than 255 because of Nadeo's API");
        }

        const competitionLeaderboardRes = await fetch(
            `https://competition.trackmania.nadeo.club/api/competitions/${competitionId}/leaderboard?length=${length}&offset=${offset}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `nadeo_v1 t=${this.accessToken}`,
                    'User-Agent': this.userAgent,
                },
            }
        );

        return (await competitionLeaderboardRes.json()) as CompetitionLeaderboardResponse;
    }

    public async getCompetition(competitionId: string | number) {
        const competitionRes = await fetch(
            `https://competition.trackmania.nadeo.club/api/competitions/${competitionId}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `nadeo_v1 t=${this.accessToken}`,
                    'User-Agent': this.userAgent,
                },
            }
        );

        return (await competitionRes.json()) as CompetitionResponse;
    }

    public async getCompetitionRounds(competitionId: string | number) {
        const competitionRoundsRes = await fetch(
            `https://competition.trackmania.nadeo.club/api/competitions/${competitionId}/rounds`,
            {
                method: 'GET',
                headers: {
                    Authorization: `nadeo_v1 t=${this.accessToken}`,
                    'User-Agent': this.userAgent,
                },
            }
        );

        return (await competitionRoundsRes.json()) as CompetitionRoundsResponse;
    }
}
