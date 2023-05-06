import type { ZonesResponse, NadeoServicesClient } from '../';
import { db } from '$lib/db';
import { Players, type NewPlayer } from '$lib/db/schema';
import { inArray } from 'drizzle-orm';
import kv from '@vercel/kv';

export interface Zone {
    zoneId: string | null; // The ID of most specific zone (usually the district or region)
    continentId: string | null; // The ID of the continent      (e.g. Europe)
    countryId: string | null; // The ID of the country        (e.g. Germany)
}

export async function getPlayerZonesFromDB(
    NadeoServicesClient: NadeoServicesClient,
    ...accountIds: string[]
) {
    const accountIdQueue = new Set(accountIds);
    const resultsMap = new Map<string, Zone>();

    const resnew = await db
        .select()
        .from(Players)
        .where(inArray(Players.accountId, accountIds))
        .all();

    for (const row of resnew) {
        const { accountId, zoneId, continentId, countryId } = row;

        accountIdQueue.delete(accountId);

        resultsMap.set(accountId, {
            zoneId,
            continentId,
            countryId,
        });
    }

    if (accountIdQueue.size > 0) {
        const databaseBatch = [];
        const newDatabaseBatch: NewPlayer[] = [];

        const zones = await cachedGetZones(NadeoServicesClient);

        for (let i = 0; i < Math.ceil(accountIdQueue.size / 200); i++) {
            console.log(
                `Had to retrieve ${accountIdQueue.size} account from Nadeo. ${i}/${Math.ceil(
                    accountIdQueue.size / 200
                )} requests done`
            );
            const offset = i * 200;
            const accountIdQueueArray = Array.from(accountIdQueue);
            const groupOfAccountIds = accountIdQueueArray.slice(offset, offset + 200);
            const res = await NadeoServicesClient.getPlayerZones(...groupOfAccountIds);

            res.forEach((player) => {
                accountIdQueue.delete(player.accountId);

                const playerZones = getPlayerZones(zones, player.zoneId);

                const newPlayerZones: Zone = {
                    zoneId: player.zoneId,
                    continentId: playerZones.continentId,
                    countryId: playerZones.countryId,
                };

                resultsMap.set(player.accountId, newPlayerZones);

                databaseBatch.push({
                    sql: `INSERT INTO players VALUES (:account_id, :zone_id)`,
                    args: {
                        account_id: player.accountId,
                        zone_id: player.zoneId,
                    },
                });

                const newPlayer: NewPlayer = {
                    accountId: player.accountId,
                    zoneId: newPlayerZones.zoneId,
                    continentId: newPlayerZones.continentId,
                    countryId: newPlayerZones.countryId,
                };

                newDatabaseBatch.push(newPlayer);
            });
        }

        // const dbInsert = await dbraw.batch(databaseBatch);
        db.insert(Players)
            .values([...newDatabaseBatch])
            .run();
    }

    return resultsMap;
}

export async function cachedGetZones(NadeoServicesClient: NadeoServicesClient) {
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

    return zones;
}

function getPlayerZones(
    zones: ZonesResponse,
    zoneId: string,
    previous: string[] = []
): {
    worldId: string;
    continentId: string;
    countryId: string;
    regionId: string;
    districtId: string;
} {
    const zoneObj = (findZoneId: string) => zones.find((zone) => zone.zoneId === findZoneId);
    previous.unshift(zoneId);

    if (!zoneObj(zoneId).parentId || zoneObj(zoneId).parentId === zoneObj(zoneId).zoneId) {
        return {
            worldId: previous[0] ?? null,
            continentId: previous[1] ?? null,
            countryId: previous[2] ?? null,
            regionId: previous[3] ?? null,
            districtId: previous[4] ?? null,
        };
    }

    return getPlayerZones(zones, zoneObj(zoneId).parentId, previous);
}
