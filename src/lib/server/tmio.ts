import type { CotdDivData, Zone, Result } from "$lib/types/tmio";

interface ParsedResult {
    player: Omit<Result['player'], 'zone'> & {
        zone: ParsedZone;
    };
    position: Result['position'];
    score: Result['score'];
};

interface ParsedZone {
    world: string;
    continent: string;
    country: string;
};

async function fetchDivPlayers(fetchFunc: typeof fetch = fetch, page: number) {
    const divPlayerPageResponse = await fetchFunc(`https://trackmania.io/api/comp/5722/match/55063/${page}`, {
        headers: {
            "User-Agent": "Thing/0.0 (Discord: nbeerten#2620)",
        }
    });
    const divPlayersJson: CotdDivData = await divPlayerPageResponse.json();
    return divPlayersJson.results;
}

export async function getDiv1Players(fetchFunc: typeof fetch = fetch) {
    const ITERATIONS_NEEDED = 3; // 25 per page, 64 total, so 3 pages are needed
    const players = new Map<number, ParsedResult>();

    for (let i = 0; i < ITERATIONS_NEEDED; i++) {
        const DivPlayerPageReq = await fetchDivPlayers(fetchFunc, i);
        DivPlayerPageReq.forEach((player) => {
            const parsedPlayer = parseResult(player);
            if (player.position === 0) {
                players.set(players.size + 1, parsedPlayer);
            } else {
                players.set(player.position, parsedPlayer);
            }
        });
    }

    return players;
}

function parseResult(result: Result): ParsedResult {
    return {
        ...result,
        player: {
            ...result.player,
            zone: parseZone(result.player.zone)
        }
    }
}

function parseZone(zone: Zone, names: string[] = []): ParsedZone {
    names.unshift(zone.name);
    if (!zone.parent) {
        return {
            world: names[0],
            continent: names[1],
            country: names[2],
        };
    }
    return parseZone(zone.parent, names);
}