import type { getDiv1Players } from '$lib/server/tmio';

export function averageRank(players: Awaited<ReturnType<typeof getDiv1Players>>) {
    const countryCount: Record<string, number[]> = {};

    players.forEach((player, i) => {
        const country = player.player.zone.country;
        countryCount[country] = [...(countryCount[country] || []), i];
    });
    
    const calcAvgs: Record<string, number> = Object.entries(countryCount).map(([key, value]) => {
        const avg = value.reduce((a, b) => a + b, 0) / value.length;
        return [key, avg];
    }).reduce((result, [key, value]) => ({ ...result, [key]: value }), {});

    const sortedCountries = Object.entries(calcAvgs)
        .sort((a, b) => a[1] - b[1])
        .reduce((result, [key, value]) => ({ ...result, [key]: value }), {});

    return sortedCountries;
}