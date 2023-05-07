import { VERCEL_ENV, VERCEL_GIT_COMMIT_SHA, VERCEL_GIT_COMMIT_MESSAGE } from '$env/static/private';
import { getPlayerZonesFromDB } from '$lib/server/nadeo/util/getPlayerZonesFromDB';
import { getFullCompetitionLeaderboard } from '$lib/server/nadeo/util/getFullCompetitionLeaderboard';
import { combineLeaderboardAndZonesData } from '$lib/server/nadeo/util/combineLeaderboardAndZonesData.js';
import { countCountries } from '$lib/countCountries';
import { averageRank } from '$lib/averageRank';
import { NadeoClub, type ZonesResponse } from '$lib/server/nadeo';

export async function load({ fetch }) {
    const info = `Data from competition 5770 from the top 2048 players.`;

    const zonesResponse = (await fetch('/api/getZones').then((res) => res.json())) as ZonesResponse;
    
    const streamedData = async() => {
        const NadeoClubClient = await NadeoClub;

        const players = await getFullCompetitionLeaderboard(NadeoClubClient, 5770, 2048, 0);
        const playerIdList = players.map((player) => player.participant);
        
        const playersWithZones = await getPlayerZonesFromDB(...playerIdList);
        const playerList = combineLeaderboardAndZonesData(zonesResponse, players, playersWithZones);

        const countryCount = countCountries(zonesResponse, playersWithZones);
        const averageRankData = averageRank(playerList);

        return {
            test: averageRankData,
            countryCount
        };
    };
    
    

    return {
        title: 'Country Stats',
        info,
        streamed: {
            data: new Promise<ReturnType<typeof streamedData>>((fulfil) => fulfil(streamedData())),
        }
    };
}
