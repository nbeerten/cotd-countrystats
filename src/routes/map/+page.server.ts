// import { createClient } from '@libsql/client/web';
// import { drizzle } from 'drizzle-orm/libsql';
// import { Zones } from '$lib/db/schema';
// import { TURSO_DB_URL, TURSO_DB_AUTH_TOKEN } from '$env/static/private';

export async function load() {
    // const libSQL = createClient({
    //     url: TURSO_DB_URL,
    //     authToken: TURSO_DB_AUTH_TOKEN,
    // });

    // const db = drizzle(libSQL);

    // const zonesFromDB = await db.select().from(Zones).all();

    return {
        zones: 'a',
    };
}
