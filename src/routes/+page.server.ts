import { VERCEL_ENV } from '$env/static/private';
import { createClient } from '$lib/server/nadeo';
import { getZonesForCompetitionLeaderboard } from '$lib/server/nadeo/data';
import { UBISOFT_EMAIL, UBISOFT_PASSWORD } from '$env/static/private';

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

    const players = await NadeoClub.getCompetitionLeaderboard('5722', 64, 0);

    const playerZones = getZonesForCompetitionLeaderboard(players, NadeoServices);

    const info = `${VERCEL_ENV}`;

    return {
        title: 'Country Stats',
        info,
        test: playerZones,
    };
}
