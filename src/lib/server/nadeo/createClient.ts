import { NadeoServicesClient, NadeoClubClient, type Audience } from '.';
import { getTokens } from './getTokens';

export async function createClient(
    username: string,
    password: string,
    audience: 'NadeoClubServices',
    userAgent: string
): Promise<NadeoClubClient>;
export async function createClient(
    username: string,
    password: string,
    audience: 'NadeoServices',
    userAgent: string
): Promise<NadeoServicesClient>;
export async function createClient(
    username: string,
    password: string,
    audience: Audience,
    userAgent: string
) {
    const tokens = await getTokens(username, password, audience, userAgent);

    if (audience === 'NadeoServices') {
        return new NadeoServicesClient(tokens, {
            audience,
            userAgent,
        });
    } else if (audience === 'NadeoClubServices') {
        return new NadeoClubClient(tokens, {
            audience,
            userAgent,
        });
    } else if (audience === 'NadeoLiveServices') {
        throw new Error('Not implemented yet');
    }
}
