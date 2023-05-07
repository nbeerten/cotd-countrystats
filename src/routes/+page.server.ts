import { NadeoClub } from '$lib/server/nadeo';
import { error } from '@sveltejs/kit';

export async function load({ url }) {
    const page = Number(url.searchParams.get('page') || 1) - 1;

    const NadeoClubClient = await NadeoClub;

    const rawCompetitionList = await NadeoClubClient.getCompetitions(100, 100 * page);

    const compNameRegex = /^(?:COTD|Cup of the Day) [0-9]{4}-[0-9]{2}-[0-9]{2}(?: #[1-3])?$/i;
    const filteredCompetitionList = rawCompetitionList.filter((competition) => {
        return compNameRegex.test(competition.name) && competition.nbPlayers > 0;
    });

    if (filteredCompetitionList.length < 1) throw error(404, 'No more competitions left');

    const competitionType = (compName: string) => {
        if (compName.endsWith('#1')) return 'Main';
        else if (compName.endsWith('#2')) return 'COTN';
        else if (compName.endsWith('#3')) return 'COTM';
        else return 'Main';
    };

    const competitionList = filteredCompetitionList.map((competition) => {
        return {
            id: competition.id,
            name: competition.name,
            nbPlayers: competition.nbPlayers,
            type: competitionType(competition.name),
            time: new Date(competition.startDate * 1000),
            date: new Date(competition.startDate * 1000).toLocaleDateString('en-UK', {
                timeZone: 'Europe/Paris',
            }),
        };
    });

    return {
        cotdList: competitionList,
    };
}
