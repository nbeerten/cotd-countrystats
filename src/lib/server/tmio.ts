// import { getCompMatch } from "$lib/server/tmioFetch";
// import type { Zone } from "$lib/types/tmio";

// interface ParsedZone {
//     world: string;
//     continent: string;
//     country: string;
// };

// export async function getDiv1PlayerZones() {
//     const ITERATIONS_NEEDED = 3; // 25 per page, 64 total, so 3 pages are needed
//     const playerZones = new Map<number, ParsedZone>();

//     for (let i = 0; i < ITERATIONS_NEEDED; i++) {
//         const { results } = await getCompMatch(5722, 55063, i);

//         results.forEach((player) => {
//             const playerZone = parseZone(player.player.zone);
//             if (player.position === 0) {
//                 playerZones.set(playerZones.size + 1, playerZone);
//             } else {
//                 playerZones.set(player.position, playerZone);
//             }
//         });
//     }

//     return playerZones;
// }

// function parseZone(zone: Zone, names: string[] = []): ParsedZone {
//     names.unshift(zone.name);
//     if (!zone.parent) {
//         return {
//             world: names[0],
//             continent: names[1],
//             country: names[2],
//         };
//     }
//     return parseZone(zone.parent, names);
// }
