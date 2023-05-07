import type { ZonesResponse } from '$lib/server/nadeo';
import { getZoneNamesFromID, type getPlayerZonesFromDB } from '$lib/server/nadeo/util';

export function countCountries(
    zonesResponse: ZonesResponse,
    playersWithZones: Awaited<ReturnType<typeof getPlayerZonesFromDB>>
) {
    const countryCount: Record<string, number> = {};
    for (const [, player] of playersWithZones.entries()) {
        const playerZones = getZoneNamesFromID(zonesResponse, player.zoneId);

        const country = playerZones.country.name;
        countryCount[country] = (countryCount[country] || 0) + 1;
    }

    const sortedCountries: Record<string, number> = Object.entries(countryCount)
        .sort((a, b) => b[1] - a[1])
        .reduce((result, [key, value]) => ({ ...result, [key]: value }), {});

    return sortedCountries;
}
