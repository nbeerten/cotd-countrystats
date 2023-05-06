import type { Tokens, Audience } from '.';
import kv from '@vercel/kv';

export async function getTokens(
    username: string,
    password: string,
    audience: Audience,
    userAgent: string
) {
    const NADEO_TOKEN = `NADEO_TOKEN_${audience.toUpperCase()}`;

    if (kv.exists(NADEO_TOKEN)) {
        console.time('getTokens from kv');
        const tokenFromKv = await kv.get<Tokens>(NADEO_TOKEN);
        console.timeEnd('getTokens from kv');

        if (tokenFromKv && 'accessToken' in tokenFromKv && 'refreshToken' in tokenFromKv) {
            console.log('Using cached tokens.');
            return tokenFromKv;
        } else {
            console.warn('Failed to use cached tokens while it does exist.');
            kv.del(NADEO_TOKEN);
        }
    }

    const ubisoftTicketRes = await fetch(
        'https://public-ubiservices.ubi.com/v3/profiles/sessions',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Ubi-AppId': '86263886-327a-4328-ac69-527f0d20a237',
                Authorization: `Basic ${btoa(`${username}:${password}`)}`,
                'User-Agent': userAgent,
            },
        }
    );
    const ubisoftTicketJson = (await ubisoftTicketRes.json()) as { ticket: string };
    if ('ticket' in ubisoftTicketJson !== true) {
        throw new Error('Error while retrieving ticket from Ubisoft Services');
    }
    const { ticket: ubisoftTicket } = ubisoftTicketJson;

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
        throw new Error('Error while retrieving accessToken from Nadeo Services');
    }

    console.time('set token kv');
    kv.set(NADEO_TOKEN, tokens, {
        ex: 60 * 55, // 55 minutes
    });
    console.timeEnd('set token kv');

    return tokens;
}
