// import { getCompMatch } from "$lib/server/tmioFetch";
// import type { Zone } from "$lib/types/tmio/compMatch";
// import type { CountryWithPositions } from "$lib/types/data";

// interface ParsedZone {
//     world: string;
//     continent: string;
//     country: string;
// };

// export async function getCotdStats(comp: number) {
//     // const { rounds: [ round ] } = await getComp(comp);
//     // const { matches } = round;

//     const matchIds = [ 55063 ]; // 55063, 55064

//     const countries: Record<string, number[]> = {};

//     for(const matchId of matchIds) {
//         const responses = await Promise.all([
//             await getCompMatch(comp, matchId, 0), // 0-25
//             await getCompMatch(comp, matchId, 1), // 26-50
//             await getCompMatch(comp, matchId, 2)  // 51-64
//         ]);

//         responses.forEach((response) => {
//             response.results.forEach((player) => {
//                 const playerZone = parseZone(player.player.zone);
//                 const { country } = playerZone;
//                 if (player.position !== 0) {
//                     countries[country] = [...(countries[country] || []), player.position ];
//                 }
//             })
//         });
//     }

//     return countries;
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
