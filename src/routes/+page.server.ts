import { VERCEL_ENV } from '$env/static/private';
import { getPlayerZonesFromDB } from '$lib/server/nadeo/util/getPlayerZonesFromDB';
import { NadeoClub, type ZonesResponse } from '$lib/server/nadeo';

export async function load({ fetch }) {
    const NadeoClubClient = await NadeoClub;
    
    const players = await NadeoClubClient.getCompetitionLeaderboard('5770', 255, 0);
    const playerIdList = players.map((player) => player.participant);

    const info = `${VERCEL_ENV}`;

    const zonesResponse = await fetch('/api/getZones').then((res) => res.json()) as ZonesResponse;

    const test = Object.fromEntries(await getPlayerZonesFromDB(zonesResponse, ...playerIdList));

    return {
        title: 'Country Stats',
        info,
        test,
    };
}
