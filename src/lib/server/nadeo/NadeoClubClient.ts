import { NadeoClient } from './NadeoClient';
import { z } from 'zod';

export type CompetitionLeaderboardResponse = z.infer<typeof CompetitionLeaderboardSchema>;

export const CompetitionLeaderboardSchema = z.array(
    z.object({
        participant: z.string().uuid(),
        rank: z.number(),
        score: z.number(),
        zone: z.string(),
    })
);

export type CompetitionResponse = z.infer<typeof CompetitionSchema>;

export const CompetitionSchema = z.object({
    id: z.number(),
    liveId: z.string(),
    creator: z.string(),
    name: z.string(),
    participantType: z.string(),
    description: z.string().nullable(),
    registrationStart: z.unknown(),
    registrationEnd: z.unknown(),
    startDate: z.number(),
    endDate: z.number(),
    matchesGenerationDate: z.number(),
    nbPlayers: z.number(),
    spotStructure: z.string(),
    leaderboardId: z.number(),
    manialink: z.unknown(),
    rulesUrl: z.string().nullable(),
    streamUrl: z.string().nullable(),
    websiteUrl: z.string().nullable(),
    logoUrl: z.string().nullable(),
    verticalUrl: z.string().nullable(),
    allowedZones: z.array(z.string()),
    deletedOn: z.unknown(),
    autoNormalizeSeeds: z.boolean(),
    region: z.string(),
    autoGetParticipantSkillLevel: z.string(),
    matchAutoMode: z.string(),
    partition: z.string(),
});

export type CompetitionsResponse = z.infer<typeof CompetitionsSchema>;

export const CompetitionsSchema = z.array(
    z.object({
        id: z.number(),
        liveId: z.string(),
        creator: z.string(),
        name: z.string(),
        participantType: z.string(),
        description: z.string().nullable(),
        registrationStart: z.unknown(),
        registrationEnd: z.unknown(),
        startDate: z.number(),
        endDate: z.number(),
        matchesGenerationDate: z.number().nullable(),
        nbPlayers: z.number(),
        spotStructure: z.string(),
        leaderboardId: z.number(),
        manialink: z.unknown(),
        rulesUrl: z.string().nullable(),
        streamUrl: z.string().nullable(),
        websiteUrl: z.string().nullable(),
        logoUrl: z.string().nullable(),
        verticalUrl: z.string().nullable(),
        allowedZones: z.array(z.string()),
        deletedOn: z.unknown(),
        autoNormalizeSeeds: z.boolean(),
        region: z.string().nullable(),
        autoGetParticipantSkillLevel: z.string(),
        matchAutoMode: z.string(),
        partition: z.string(),
    })
);

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

        const validatedResponse = CompetitionLeaderboardSchema.safeParse(
            await competitionLeaderboardRes.json()
        );

        if (!validatedResponse.success) {
            throw new Error(validatedResponse.error.message);
        }

        return validatedResponse.data;
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

        const validatedResponse = CompetitionSchema.safeParse(await competitionRes.json());

        if (!validatedResponse.success) {
            throw new Error(validatedResponse.error.message);
        }

        return validatedResponse.data;
    }

    public async getCompetitions(length = 10, offset = 0) {
        const competitionsRes = await fetch(
            `https://competition.trackmania.nadeo.club/api/competitions?length=${length}&offset=${offset}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `nadeo_v1 t=${this.accessToken}`,
                    'User-Agent': this.userAgent,
                },
            }
        );

        const validatedResponse = CompetitionsSchema.safeParse(await competitionsRes.json());

        if (!validatedResponse.success) {
            throw new Error(validatedResponse.error.message);
        }

        return validatedResponse.data;
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
