export { createClient } from './createClient';
export { NadeoClient } from './NadeoClient';
export type * from './NadeoClient';
export { NadeoServicesClient } from './NadeoServicesClient';
export type * from './NadeoServicesClient';
export { NadeoClubClient } from './NadeoClubClient';
export type * from './NadeoClubClient';

export * from './util';

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

export type Audience = 'NadeoServices' | 'NadeoLiveServices' | 'NadeoClubServices';

import { createClient } from './createClient';
import { UBISOFT_EMAIL, UBISOFT_PASSWORD, UA_EMAIL } from '$env/static/private';

export const NadeoServices = createClient(UBISOFT_EMAIL, UBISOFT_PASSWORD, 'NadeoServices', `cotd-countrystats / ${UA_EMAIL}`);
export const NadeoClub = createClient(UBISOFT_EMAIL, UBISOFT_PASSWORD, 'NadeoClubServices', `cotd-countrystats / ${UA_EMAIL}`);