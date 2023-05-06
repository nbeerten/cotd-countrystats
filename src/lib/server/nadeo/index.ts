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
