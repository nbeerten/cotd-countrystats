import type { ZonesResponse } from '$lib/server/nadeo';
import { getZoneNamesFromID, type getPlayerZonesFromDB } from '$lib/server/nadeo/util';
import ISO_to_flag from '$lib/ISO_to_flag_map.json';

export function countCountries(
    zonesResponse: ZonesResponse,
    playersWithZones: Awaited<ReturnType<typeof getPlayerZonesFromDB>>
) {
    const countryCount: Record<string, number> = {};
    for (const [, player] of playersWithZones.entries()) {
        if (!player.zoneId) {
            continue;
        }
        const playerZones = getZoneNamesFromID(zonesResponse, player.zoneId);

        if (!playerZones.country) {
            continue;
        }

        const flag = playerZones.ISO
            ? (ISO_to_flag as Record<string, string>)[playerZones.ISO] ?? playerZones.ISO
            : playerZones.ISO;
        const country = `${flag} ${playerZones.country.name}`;
        countryCount[country] = (countryCount[country] || 0) + 1;
    }

    const sortedCountries: Record<string, number> = Object.entries(countryCount)
        .sort((a, b) => b[1] - a[1])
        .reduce((result, [key, value]) => ({ ...result, [key]: value }), {});

    return sortedCountries;
}
