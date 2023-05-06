import { NadeoClient } from './NadeoClient';

export type CompetitionLeaderboardResponse = {
    participant: string;
    rank: number;
    score: number;
    zone: string;
}[];

export type CompetitionResponse = unknown;
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
