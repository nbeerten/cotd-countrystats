import kv from '@vercel/kv';
import type {
    CompetitionLeaderboardResponse,
    NadeoServicesClient,
    ZonesResponse,
} from '$lib/server/nadeo';

export async function getZonesForCompetitionLeaderboard(
    compPlayers: CompetitionLeaderboardResponse,
    NadeoServicesClient: NadeoServicesClient
) {
    const NADEO_ZONES = 'NADEO_ZONES';

    let zones: ZonesResponse;
    if (kv.exists(NADEO_ZONES)) {
        const zonesRes = await kv.get<ZonesResponse>(NADEO_ZONES);

        if (zonesRes && 'zoneId' in zonesRes[0]) {
            console.debug('Using cached zones.');
            zones = zonesRes;
        } else {
            console.warn(
                `Failed to use cached zones. Missing 'zoneId' from vercel KV stored ${NADEO_ZONES} key.`
            );
            kv.del(NADEO_ZONES);
            zones = await NadeoServicesClient.getZones();

            kv.set(NADEO_ZONES, zones, {
                ex: 60 * 60 * 24 * 7,
            });
        }
    } else {
        zones = await NadeoServicesClient.getZones();

        kv.set(NADEO_ZONES, zones, {
            ex: 60 * 60 * 24 * 7,
        });
    }

    const playerIdList = compPlayers.map((player) => player.participant);

    const zonesOfPlayers = await NadeoServicesClient.getPlayerZones(...playerIdList);

    const playersWithZoneIds = compPlayers.map((player) => {
        const zone = zonesOfPlayers.find((zone) => zone.accountId === player.participant);
        return {
            accountId: player.participant,
            rank: player.rank,
            score: player.score,
            zoneId: zone?.zoneId ?? null,
        };
    });

    const playersWithZones = playersWithZoneIds.map((player) => {
        const zone = zones.find((zone) => zone.zoneId === player.zoneId);

        return {
            ...player,
            zone: getCountryZone(zones, zone.zoneId),
        };
    });

    return playersWithZones;
}

function getCountryZone(zones: ZonesResponse, zoneId: string): FlatArray<ZonesResponse, 0> | null {
    const zone = zones.find((zone) => zone.zoneId === zoneId);
    const isCountryRegex = /file:\/\/Media\/Flags\/([A-Z]{3})\.dds/; // TODO: find a better way to do this
    const isCountryZone = (zone: FlatArray<ZonesResponse, 0>) => isCountryRegex.test(zone.icon);

    if (isCountryZone(zone)) {
        return zone;
    }
    if (!zone.parentId || zone.parentId === zone.zoneId) {
        return null;
    }

    return getCountryZone(zones, zone.parentId);
}
