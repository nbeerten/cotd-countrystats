import { VERCEL_ENV, VERCEL_GIT_COMMIT_SHA, VERCEL_GIT_COMMIT_MESSAGE } from '$env/static/private';
import { getPlayerZonesFromDB } from '$lib/server/nadeo/util/getPlayerZonesFromDB';
import { NadeoClub, type ZonesResponse } from '$lib/server/nadeo';

export async function load({ fetch }) {
    const NadeoClubClient = await NadeoClub;
    
    const players = await NadeoClubClient.getCompetitionLeaderboard('5770', 255, 0);
    const playerIdList = players.map((player) => player.participant);

    const info = `Env: ${VERCEL_ENV} | Commit: ${VERCEL_GIT_COMMIT_SHA || "none"} | Last commit message: ${VERCEL_GIT_COMMIT_MESSAGE || "none"}`;

    const zonesResponse = await fetch('/api/getZones').then((res) => res.json()) as ZonesResponse;

    const test = Object.fromEntries(await getPlayerZonesFromDB(zonesResponse, ...playerIdList));

    return {
        title: 'Country Stats',
        info,
        test,
    };
}
