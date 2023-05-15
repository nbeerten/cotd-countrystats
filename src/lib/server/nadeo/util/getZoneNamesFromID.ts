import type { ZonesResponse } from '..';
import ISO_to_IOC from '../../../ISO_to_IOC_map.json';

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
    ISO?: string | null;
}

export function getZoneNamesFromID(zonesResponse: ZonesResponse, zoneID: string) {
    const zones = getZoneObjectFromZoneID(zonesResponse, zoneID) as ParsedPlayerZones;

    const IOC = zonesResponse.find((zone) => zones.country?.name === zone.name)?.icon.slice(19, -4);
    const ISO = Object.entries(ISO_to_IOC).find(([, value]) => value === IOC)?.[0] ?? null;
    zones['ISO'] = ISO ?? IOC;

    return zones;
}

function getZoneObjectFromZoneID(
    zones: ZonesResponse,
    zoneId: string,
    previous: FlatArray<ZonesResponse, 0>[] = []
): ParsedPlayerZones {
    if (!('find' in zones)) {
        throw new Error('zones is not valid');
    }
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
