// import type { getDiv1PlayerZones } from '$lib/server/tmio';

// export function countCountries(players: Awaited<ReturnType<typeof getDiv1PlayerZones>>) {
//     const countryCount: Record<string, number> = {};

//     players.forEach((player) => {
//         const country = player.country;
//         countryCount[country] = (countryCount[country] || 0) + 1;
//     });

//     const sortedCountries = Object.entries(countryCount)
//         .sort((a, b) => b[1] - a[1])
//         .reduce((result, [key, value]) => ({ ...result, [key]: value }), {});

//     return sortedCountries;
// }
