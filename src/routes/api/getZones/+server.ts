import { NadeoServices } from '$lib/server/nadeo';
import { createClient } from '@libsql/client/web';
import { drizzle } from 'drizzle-orm/libsql';
import { Zones, type NewZone } from '$lib/db/schema';
import { TURSO_DB_URL, TURSO_DB_AUTH_TOKEN } from '$env/static/private';

export async function GET() {
    const libSQL = createClient({
        url: TURSO_DB_URL,
        authToken: TURSO_DB_AUTH_TOKEN,
    });

    const db = drizzle(libSQL);

    const zonesFromDB = await db.select().from(Zones).all();

    if (Math.random() < 0.01) {
        const zoneIdsToCheck = new Set<string>(zonesFromDB.map((z) => z.zoneId));

        const NadeoServicesClient = await NadeoServices;
        const nadeoZones = await NadeoServicesClient.getZones();

        for (const zone of nadeoZones) {
            zoneIdsToCheck.delete(zone.zoneId);
        }

        const databaseBatch: NewZone[] = [];
        for (const zoneId of zoneIdsToCheck) {
            const zone = nadeoZones.find((z) => z.zoneId === zoneId);
            if (!zone) {
                continue;
            }

            databaseBatch.push({
                zoneId: zone.zoneId,
                parentId: zone.parentId,
                name: zone.name,
                icon: zone.icon,
            });
        }

        if (databaseBatch.length > 0) {
            await db.insert(Zones).values(databaseBatch).run();
        }

        return new Response(JSON.stringify(nadeoZones), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=2678400, immutable',
            },
        });
    } else {
        return new Response(JSON.stringify(zonesFromDB), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=2678400, immutable',
            },
        });
    }
}
