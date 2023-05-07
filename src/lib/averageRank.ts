import type { combineLeaderboardAndZonesData } from '$lib/server/nadeo/util';

export function averageRank(players: Awaited<ReturnType<typeof combineLeaderboardAndZonesData>>) {
    const countryCount: Record<string, number[]> = {};

    players.forEach((player, i) => {
        const country = player.country;
        if (country) {
            countryCount[country.name] = [...(countryCount[country.name] || []), i + 1];
        }
    });

    const calcAvgs: Record<string, number> = Object.entries(countryCount)
        .map(([key, value]) => {
            const avg = value.reduce((a, b) => a + b, 0) / value.length;
            return [key, avg];
        })
        .reduce((result, [key, value]) => ({ ...result, [key]: value }), {});

    const sortedCountries = Object.entries(calcAvgs)
        .sort((a, b) => a[1] - b[1])
        .reduce((result, [key, value]) => ({ ...result, [key]: value }), {});

    return sortedCountries;
}
