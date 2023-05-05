import type { Tokens, Audience } from '.';

interface Options {
    audience: Audience;
    userAgent: string;
}

export class NadeoClient {
    audience: Audience = 'NadeoServices';
    userAgent: string;

    protected accessToken: string;
    protected refreshToken: string;

    constructor(tokens: Tokens, options: Options) {
        this.accessToken = tokens.accessToken;
        this.refreshToken = tokens.refreshToken;
        this.audience = options.audience;
        this.userAgent = options.userAgent;
    }
}
