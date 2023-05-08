import type { RequestHandler } from './$types';
import { NadeoServices } from '$lib/server/nadeo';

export const GET: RequestHandler = async () => {
    const NadeoServicesClient = await NadeoServices;

    const zones = await NadeoServicesClient.getZones();

    return new Response(JSON.stringify(zones), {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=2678400, immutable',
        },
    });
};
