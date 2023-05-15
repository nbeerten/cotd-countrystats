import { NadeoClub } from '$lib/server/nadeo';
import { error } from '@sveltejs/kit';

export async function load({ url }) {
    const page = Number(url.searchParams.get('page') || 1) - 1;
    const type = url.searchParams.get('type') ?? 'crossplay';
    if (!/(crossplay|pc|psn|xbl|luna)/i.test(type)) {
        throw error(400, 'Invalid type');
    }

    const streamedData = async () => {
        const NadeoClubClient = await NadeoClub;

        const rawCompetitionList = await NadeoClubClient.getCompetitions(100, 100 * page);

        const crossPlayCOTDNameRegex =
            /^(?:COTD|Cup of the Day) [0-9]{4}-[0-9]{2}-[0-9]{2}(?: #[1-3])?$/i;

        const pcCOTDNameRegex = /^COTD [0-9]{4}-[0-9]{2}-[0-9]{2} #[1-3] pc$/i;
        const psnCOTDNameRegex = /^COTD [0-9]{4}-[0-9]{2}-[0-9]{2} #[1-3] psn$/i;
        const xblCOTDNameRegex = /^COTD [0-9]{4}-[0-9]{2}-[0-9]{2} #[1-3] xbl$/i;
        const lunaCOTDNameRegex = /^COTD [0-9]{4}-[0-9]{2}-[0-9]{2} #[1-3] luna$/i;

        let typeRegex: RegExp;
        switch (type) {
            case 'crossplay':
                typeRegex = crossPlayCOTDNameRegex;
                break;
            case 'pc':
                typeRegex = pcCOTDNameRegex;
                break;
            case 'psn':
                typeRegex = psnCOTDNameRegex;
                break;
            case 'xbl':
                typeRegex = xblCOTDNameRegex;
                break;
            case 'luna':
                typeRegex = lunaCOTDNameRegex;
                break;
            default:
                typeRegex = crossPlayCOTDNameRegex;
                break;
        }

        const COTDs = rawCompetitionList.filter((competition) => {
            return typeRegex.test(competition.name) && competition.nbPlayers > 0;
        });

        // if (COTDs.length < 1) throw error(404, 'No more competitions left');

        const competitionType = (compName: string) => {
            if (compName.includes('#1')) return 'Main';
            else if (compName.includes('#2')) return 'COTN';
            else if (compName.includes('#3')) return 'COTM';
            else return 'Main';
        };

        const cotdList = COTDs.map((competition) => {
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
            cotdList,
        };
    };

    return {
        streamed: {
            data: new Promise<ReturnType<typeof streamedData>>((fulfil) => fulfil(streamedData())),
        },
    };
}
