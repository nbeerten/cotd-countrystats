import type { ZonesResponse } from '..';

export interface ParsedPlayerZone {
    zoneId: string;
    name: string;
}
export interface ParsedPlayerZones {
    world: ParsedPlayerZone | null;
    continent: ParsedPlayerZone | null;
    country: ParsedPlayerZone | null;
    region: ParsedPlayerZone | null;
    district: ParsedPlayerZone | null;
}

export function getZoneNamesFromID(zonesResponse: ZonesResponse, zoneID: string) {
    const zones = getZoneObjectFromZoneID(zonesResponse, zoneID) as ParsedPlayerZones;

    return zones;
}

function getZoneObjectFromZoneID(
    zones: ZonesResponse,
    zoneId: string,
    previous: FlatArray<ZonesResponse, 0>[] = []
): ParsedPlayerZones {
    const zone = zones.find((zone) => zone.zoneId === zoneId);

    if (!zone) {
        return {
            world: null,
            continent: null,
            country: null,
            region: null,
            district: null,
        };
    }

    previous.unshift(zone);

    if (!zone.parentId || zone.parentId === zone.zoneId) {
        const zones = previous.map((zone) => {
            return {
                name: zone.name,
                zoneId: zone.zoneId,
            };
        });

        return {
            world: zones[0] ?? null,
            continent: zones[1] ?? null,
            country: zones[2] ?? null,
            region: zones[3] ?? null,
            district: zones[4] ?? null,
        };
    }

    return getZoneObjectFromZoneID(zones, zone.parentId, previous);
}
