import { NadeoClient } from './NadeoClient';
import { z } from 'zod';

export type PlayerZonesResponse = z.infer<typeof PlayerZonesSchema>;

export const PlayerZonesSchema = z.array(
    z.object({
        accountId: z.string().uuid(),
        timestamp: z.string(),
        zoneId: z.string().uuid(),
    })
);

export type ZonesResponse = z.infer<typeof ZonesSchema>;

export const ZonesSchema = z.array(
    z.object({
        icon: z.string(),
        name: z.string(),
        parentId: z.string().uuid().nullable(),
        timestamp: z.string(),
        zoneId: z.string().uuid(),
    })
);

export class NadeoServicesClient extends NadeoClient {
    public async getPlayerZones(...accountIds: string[]) {
        const accountIdList = accountIds.join(',');
        const requestUrl = `https://prod.trackmania.core.nadeo.online/accounts/zones/?accountIdList=${accountIdList}`;

        if (requestUrl.length >= 8220) {
            throw new Error(
                `Request URL with ${accountIds.length} account IDs is too long. Maximum of 8220 characters is allowed.`
            );
        }

        const playerZonesRes = await fetch(requestUrl, {
            method: 'GET',
            headers: {
                Authorization: `nadeo_v1 t=${this.accessToken}`,
                'User-Agent': this.userAgent,
            },
        });

        const validatedResponse = PlayerZonesSchema.safeParse(await playerZonesRes.json());

        if (!validatedResponse.success) {
            throw new Error(validatedResponse.error.message);
        }

        return validatedResponse.data;
    }

    public async getZones() {
        const zonesRes = await fetch('https://prod.trackmania.core.nadeo.online/zones', {
            method: 'GET',
            headers: {
                Authorization: `nadeo_v1 t=${this.accessToken}`,
                'User-Agent': this.userAgent,
            },
        });

        const validatedResponse = ZonesSchema.safeParse(await zonesRes.json());

        if (!validatedResponse.success) {
            throw new Error(validatedResponse.error.message);
        }

        return validatedResponse.data;
    }
}
