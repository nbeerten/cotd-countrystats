import type { ZonesResponse } from '..';
import type { getFullCompetitionLeaderboard } from './getFullCompetitionLeaderboard';
import type { getPlayerZonesFromDB } from './getPlayerZonesFromDB';
import { getZoneNamesFromID, type ParsedPlayerZone } from './getZoneNamesFromID';

export type PlayerLeaderboardAndZone = {
    participant: string;
    rank: number;
    score: number;
    zone: string;
    world?: ParsedPlayerZone | null;
    continent?: ParsedPlayerZone | null;
    country?: ParsedPlayerZone | null;
    region?: ParsedPlayerZone | null;
    district?: ParsedPlayerZone | null;
}[];

export function combineLeaderboardAndZonesData(
    zonesResponse: ZonesResponse,
    fullCompetitionLeaderboard: Awaited<ReturnType<typeof getFullCompetitionLeaderboard>>,
    playerZonesFromDB: Awaited<ReturnType<typeof getPlayerZonesFromDB>>
) {
    const playerLeaderboardAndZone: PlayerLeaderboardAndZone = fullCompetitionLeaderboard;

    const playerZonesObject = Object.fromEntries(playerZonesFromDB);

    playerLeaderboardAndZone.forEach((player) => {
        const playerZone = playerZonesObject[player.participant];
        if (!playerZone || !playerZone.zoneId) {
            player.world = null;
            player.continent = null;
            player.country = null;
            player.region = null;
            player.district = null;
            return;
        }

        const zoneNames = getZoneNamesFromID(
            zonesResponse,
            playerZone.zoneId
        );
        player.world = zoneNames.world;
        player.continent = zoneNames.continent;
        player.country = zoneNames.country;
        player.region = zoneNames.region;
        player.district = zoneNames.district;
    });

    return playerLeaderboardAndZone;
}
