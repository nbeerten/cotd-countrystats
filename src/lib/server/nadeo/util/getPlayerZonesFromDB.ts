import { Players, type NewPlayer } from '$lib/db/schema';
import { inArray } from 'drizzle-orm';
import { NadeoServices } from '../';
import { createClient } from '@libsql/client/web';
import { TURSO_DB_URL, TURSO_DB_AUTH_TOKEN } from '$env/static/private';
import { drizzle } from 'drizzle-orm/libsql';

export interface Zone {
    zoneId: string | null; // The ID of most specific zone (usually the district or region)
    // continentId: string | null; // The ID of the continent      (e.g. Europe)
    // countryId: string | null; // The ID of the country        (e.g. Germany)
}

export async function getPlayerZonesFromDB(...accountIds: string[]) {
    const libSQL = createClient({
        url: TURSO_DB_URL,
        authToken: TURSO_DB_AUTH_TOKEN,
    });

    const db = drizzle(libSQL);

    const NadeoServicesClient = await NadeoServices;

    const accountIdRegex = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;
    accountIds.forEach((accountId) => {
        if (!accountIdRegex.test(accountId)) {
            throw new Error(`Invalid accountId: ${accountId}`);
        }
    });

    const accountIdQueue = new Set(accountIds);
    const resultsMap = new Map<string, Zone>();

    const resnew = await db
        .select({
            accountId: Players.accountId,
            zoneId: Players.zoneId,
        })
        .from(Players)
        .where(inArray(Players.accountId, accountIds))
        .all();

    for (const row of resnew) {
        const { accountId, zoneId } = row;

        accountIdQueue.delete(accountId);

        resultsMap.set(accountId, {
            zoneId,
        });
    }

    if (accountIdQueue.size > 0) {
        const databaseBatch = [];
        const newDatabaseBatch: NewPlayer[] = [];
        const iterationsNeeded = Math.ceil(accountIdQueue.size / 200);

        for (let i = 0; i < iterationsNeeded; i++) {
            console.debug(
                `Had to retrieve ${accountIdQueue.size} account from Nadeo. ${Math.ceil(
                    accountIdQueue.size / 200
                )} requests left`
            );
            // const offset = i * 200;
            const accountIdQueueArray = Array.from(accountIdQueue);
            const groupOfAccountIds = accountIdQueueArray.slice(0, 200);
            const res = await NadeoServicesClient.getPlayerZones(...groupOfAccountIds);

            res.forEach((player) => {
                accountIdQueue.delete(player.accountId);

                const newPlayerZones: Zone = {
                    zoneId: player.zoneId,
                    // continentId: playerZones.continentId,
                    // countryId: playerZones.countryId,
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
                    // continentId: newPlayerZones.continentId,
                    // countryId: newPlayerZones.countryId,
                };

                newDatabaseBatch.push(newPlayer);
            });

            if (i !== iterationsNeeded - 1) {
                await new Promise((r) => setTimeout(r, 3000));
            }
        }

        await db
            .insert(Players)
            .values([...newDatabaseBatch])
            .run();
    }

    return resultsMap;
}
