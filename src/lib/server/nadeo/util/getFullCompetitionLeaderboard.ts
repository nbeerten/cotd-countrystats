import type { NadeoClubClient, CompetitionLeaderboardResponse } from '..';

export async function getFullCompetitionLeaderboard(
    NadeoClub: NadeoClubClient,
    competitionId: string | number,
    length: number | 'all' = 10,
    offset = 0
) {
    if (length === 'all') {
        const competitionInformation = await NadeoClub.getCompetition(competitionId);
        length = competitionInformation.nbPlayers;
    }

    const iterationsNeeded = Math.ceil(length / 255);

    const playerSet = new Set<FlatArray<CompetitionLeaderboardResponse, 0>>();

    for (let i = 0; i < iterationsNeeded; i++) {
        let IDsLeft = 255;
        if (playerSet.size + 255 > length) {
            IDsLeft = length - playerSet.size;
        }

        const iterationPlayers = await NadeoClub.getCompetitionLeaderboard(
            competitionId,
            IDsLeft,
            offset + i * 255
        );

        if (iterationPlayers.length === 0) {
            throw new Error(`No players found for competition with ID: ${competitionId}`);
        }

        for (const player of iterationPlayers) {
            playerSet.add(player);
        }
    }

    return Array.from(playerSet);
}
