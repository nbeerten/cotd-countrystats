// import type { CompMatch } from "$lib/types/tmio/compMatch";
// import type { Comp } from "$lib/types/tmio/comp";

// const UA = "Thing/0.0 (Discord: nbeerten#2620; Dev environment)";

// export async function getCompMatch(comp: number, match: number, page = 0) {
//     const response = await fetch(`https://trackmania.io/api/comp/${comp}/match/${match}/${page}`, {
//         headers: {
//             "User-Agent": UA,
//         }
//     });

//     return response.json() as Promise<CompMatch>;
// };

// export async function getComp(comp: number) {
//     const response = await fetch(`https://trackmania.io/api/comp/${comp}`, {
//         headers: {
//             "User-Agent": UA,
//         }
//     });

//     return response.json() as Promise<Comp>;
// };
