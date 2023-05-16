import {
    getPlayerZonesFromDB,
    getFullCompetitionLeaderboard,
    combineLeaderboardAndZonesData,
} from '$lib/server/nadeo/util';
import { countCountries } from '$lib/countCountries';
import { averageRank } from '$lib/averageRank';
import { NadeoClub, type ZonesResponse } from '$lib/server/nadeo';
import { error } from '@sveltejs/kit';
import type { ServerlessConfig } from '@sveltejs/adapter-vercel';

export const config: ServerlessConfig = {
    isr: {
        expiration: false,
    },
};

export async function load({ fetch, params }) {
    const id = params.id;

    if (!/^[0-9]+$/.test(id)) {
        throw error(400, 'ID must be a number');
    }

    const zonesResponse = (await fetch('/api/getZones').then((res) => res.json())) as ZonesResponse;

    const streamedData = async () => {
        try {
            const NadeoClubClient = await NadeoClub;

            // also possible with 'all' option in getFullCompetitionLeaderboard function, but this prevents a duplicate request because information is used in webpage as well
            const compInfo = await NadeoClubClient.getCompetition(id);

            if (compInfo.nbPlayers === 0)
                return {
                    compInfo: null,
                    averageRankData: null,
                    countryCount: null,
                    error: 'Competition has no players.',
                };

            const players = await getFullCompetitionLeaderboard(
                NadeoClubClient,
                id,
                compInfo.nbPlayers,
                0
            );
            const playerIdList = players.map((player) => player.participant);

            const playersWithZones = await getPlayerZonesFromDB(...playerIdList);
            const playerList = combineLeaderboardAndZonesData(
                zonesResponse,
                players,
                playersWithZones
            );

            const countryCount = countCountries(zonesResponse, playersWithZones);
            const averageRankData = averageRank(playerList);

            compInfo.partition =
                compInfo.partition === 'crossplay' || compInfo.partition === 'luna'
                    ? compInfo.partition.charAt(0).toUpperCase() + compInfo.partition.slice(1)
                    : compInfo.partition.toUpperCase();

            return {
                compInfo,
                averageRankData,
                countryCount,
                error: null,
            };
        } catch (err) {
            // @ts-expect-error TODO
            throw error(500, err.message);
        }
    };

    return {
        id,
        streamed: {
            data: streamedData(),
        },
    };
}
