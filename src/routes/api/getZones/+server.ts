import type { RequestHandler } from './$types';
import kv from '@vercel/kv';
import { NadeoServices, type ZonesResponse } from '$lib/server/nadeo';

export const GET: RequestHandler = async () => {
    const NadeoServicesClient = await NadeoServices;

    console.time("/api/getZones");
    const NADEO_ZONES = 'NADEO_ZONES';

    let zones: ZonesResponse;
    if (kv.exists(NADEO_ZONES)) {
        const zonesRes = await kv.get<ZonesResponse>(NADEO_ZONES);

        if (zonesRes && 'zoneId' in zonesRes[0]) {
            console.debug('Using cached zones from /api/getZones.');
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

    console.timeEnd("/api/getZones");

    return new Response(JSON.stringify(zones), {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=2678400, immutable',
        },
    });
};