import type { Tokens, Audience } from '.';
import kv from '@vercel/kv';

export type UbisoftAuthResponse = {
    platformType: string;
    ticket: string;
    twoFactorAuthenticationTicket: string;
    profileId: string;
    userId: string;
    nameOnPlatform: string;
    environment: string;
    expiration: string;
    spaceId: string;
    clientIp: string;
    clientIpCountry: string;
    serverTime: string;
    sessionId: string;
    sessionKey: string;
    rememberMeTicket: string;
};

export async function getTokens(
    username: string,
    password: string,
    audience: Audience,
    userAgent: string
) {
    const UBISOFT_TICKET = `UBISOFT_AUTH_RES`;
    const NADEO_TOKEN = `NADEO_TOKEN_${audience.toUpperCase()}`;
    // const NADEO_ACCESS_TOKEN = `NADEO_ACCESS_TOKEN_${audience.toUpperCase()}`;
    // const NADEO_REFRESH_TOKEN = `NADEO_REFRESH_TOKEN_${audience.toUpperCase()}`;

    if (await kv.exists(NADEO_TOKEN)) {
        const tokenFromKv = await kv.get<Tokens>(NADEO_TOKEN);

        if (tokenFromKv && 'accessToken' in tokenFromKv && 'refreshToken' in tokenFromKv) {
            console.debug('Using cached tokens.');
            return tokenFromKv;
        } else {
            console.warn(`Failed to use cached tokens because they aren't valid.`);
            kv.del(NADEO_TOKEN);
        }
    }

    const UBISOFT_RATELIMIT_ENDSAT = 'UBISOFT_RATELIMIT_ENDS_AT';
    const UBISOFT_PREVENT_RATELIMIT_ENDSAT = 'UBISOFT_PREVENTATIVE_RATELIMIT_ENDS_AT';

    if (await kv.exists(UBISOFT_RATELIMIT_ENDSAT)) {
        const endsAt = await kv.get<number>(UBISOFT_RATELIMIT_ENDSAT);
        if (endsAt && endsAt > Date.now()) {
            throw new Error(
                `Ubisoft rate limit reached. Rate limit ends at ${new Date(
                    endsAt
                ).toLocaleString()}`
            );
        }
    }

    let ubisoftTicket: string;
    if (await kv.exists(UBISOFT_TICKET)) {
        const ubisoftTicketFromKV = await kv.get<string>(UBISOFT_TICKET);

        if (ubisoftTicketFromKV === null) {
            await kv.del(UBISOFT_TICKET);
            throw new Error('Ubisoft ticket from KV is invalid.', { cause: ubisoftTicketFromKV });
        }

        ubisoftTicket = ubisoftTicketFromKV;
    } else {
        console.warn('Had to fetch Ubisoft ticket from Ubisoft API.');
        const ubisoftPreventRateLimit = await kv.get<number>(UBISOFT_PREVENT_RATELIMIT_ENDSAT);

        if (ubisoftPreventRateLimit && ubisoftPreventRateLimit > Date.now()) {
            throw new Error(
                `Prevent-rate-limit system rate limit reached. Block ends at ${new Date(
                    ubisoftPreventRateLimit
                ).toLocaleString()}`
            );
        }

        const base64token = Buffer.from(`${username}:${password}`).toString('base64');

        const ubisoftTicketRes = await fetch(
            'https://public-ubiservices.ubi.com/v3/profiles/sessions',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Ubi-AppId': '86263886-327a-4328-ac69-527f0d20a237',
                    Authorization: `Basic ${base64token}`,
                    'User-Agent': userAgent,
                },
            }
        );
        const ubisoftTicketJson = (await ubisoftTicketRes.json()) as UbisoftAuthResponse;

        await kv.set(UBISOFT_PREVENT_RATELIMIT_ENDSAT, Date.now() + 100 * 60 * 2, {
            ex: 60 * 2, // 2 minutes
        });

        const ubisoftTicketRegex = /^(?:[\w-]*\.){2}[\w-]*$/gm;

        if (
            'ticket' in ubisoftTicketJson !== true &&
            ubisoftTicketRegex.test(ubisoftTicketJson.ticket)
        ) {
            if (
                'httpCode' in ubisoftTicketJson &&
                (ubisoftTicketJson.httpCode === 429 || ubisoftTicketJson.httpCode === 401)
            ) {
                await kv.set(UBISOFT_RATELIMIT_ENDSAT, Date.now() + 100 * 60 * 60, {
                    ex: 60 * 60, // 1 hour
                });

                throw new Error('Ubisoft rate limit reached.', { cause: ubisoftTicketJson });
            } else if (
                'httpCode' in ubisoftTicketJson &&
                (ubisoftTicketJson.httpCode as number) > 400
            ) {
                await kv.set(UBISOFT_RATELIMIT_ENDSAT, Date.now() + 100 * 60 * 5, {
                    ex: 60 * 5, // 5 minutes
                });
            }
            throw new Error('Error while retrieving ticket from Ubisoft Services', {
                cause: ubisoftTicketJson,
            });
        } else {
            const { ticket } = ubisoftTicketJson;
            ubisoftTicket = ticket;

            await kv.set(UBISOFT_TICKET, ubisoftTicket, {
                pxat: new Date(ubisoftTicketJson.expiration).getTime(),
            });
        }
    }

    const nadeoTokenRes = await fetch(
        'https://prod.trackmania.core.nadeo.online/v2/authentication/token/ubiservices',
        {
            method: 'POST',
            body: JSON.stringify({
                audience: audience,
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `ubi_v1 t=${ubisoftTicket}`,
                'User-Agent': userAgent,
            },
        }
    );
    const tokens = (await nadeoTokenRes.json()) as Tokens;
    if ('accessToken' in tokens !== true && 'refreshToken' in tokens !== true) {
        throw new Error('Error while retrieving accessToken from Nadeo Services', {
            cause: tokens,
        });
    }

    // await kv.set(NADEO_ACCESS_TOKEN, tokens.accessToken, {
    //     ex: 60 * 55, // 1 hour
    // });

    // await kv.set(NADEO_REFRESH_TOKEN, tokens.refreshToken, {

    // })

    await kv.set(NADEO_TOKEN, tokens, {
        ex: 60 * 55, // 55 minutes
    });

    return tokens;
}
