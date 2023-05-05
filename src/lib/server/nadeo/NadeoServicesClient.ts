import { NadeoClient } from './NadeoClient';

export type PlayerZonesResponse = {
    accountId: string;
    timestamp: string;
    zoneId: string;
}[];

export type ZonesResponse = {
    icon: string;
    name: string;
    parentId: string;
    timestamp: string;
    zoneId: string;
}[];

export class NadeoServicesClient extends NadeoClient {
    public async getPlayerZones(...accountIds: string[]) {
        const accountIdList = accountIds.join(',');
        const requestUrl = `https://prod.trackmania.core.nadeo.online/accounts/zones/?accountIdList=${encodeURIComponent(
            accountIdList
        )}`;

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

        return (await playerZonesRes.json()) as PlayerZonesResponse;
    }

    public async getZones() {
        const zonesRes = await fetch('https://prod.trackmania.core.nadeo.online/zones', {
            method: 'GET',
            headers: {
                Authorization: `nadeo_v1 t=${this.accessToken}`,
                'User-Agent': this.userAgent,
            },
        });

        return (await zonesRes.json()) as ZonesResponse;
    }
}
