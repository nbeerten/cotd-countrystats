import { VERCEL_ENV } from '$env/static/private';
import { createClient } from '$lib/server/nadeo';
import { UBISOFT_EMAIL, UBISOFT_PASSWORD } from '$env/static/private';
import { getPlayerZonesFromDB } from '$lib/server/nadeo/util/getPlayerZonesFromDB';

export const prerender = true;

export async function load() {
    const NadeoClub = await createClient(
        UBISOFT_EMAIL,
        UBISOFT_PASSWORD,
        'NadeoClubServices',
        'cotd-countrystats / nbeerten@outlook.com'
    );
    const NadeoServices = await createClient(
        UBISOFT_EMAIL,
        UBISOFT_PASSWORD,
        'NadeoServices',
        'cotd-countrystats / nbeerten@outlook.com'
    );

    const players = await NadeoClub.getCompetitionLeaderboard('5770', 255, 0);
    const playerIdList = players.map((player) => player.participant);

    const info = `${VERCEL_ENV}`;

    const test = Object.fromEntries(await getPlayerZonesFromDB(NadeoServices, ...playerIdList));

    return {
        title: 'Country Stats',
        info,
        test,
    };
}
