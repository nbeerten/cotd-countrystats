import { createClient } from '@libsql/client/web';
import { TURSO_DB_URL, TURSO_DB_AUTH_TOKEN } from '$env/static/private';
import { drizzle } from 'drizzle-orm/libsql';

const libSQL = createClient({
    url: TURSO_DB_URL,
    authToken: TURSO_DB_AUTH_TOKEN,
});
export default libSQL;

export const db = drizzle(libSQL);
