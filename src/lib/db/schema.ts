import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { InferModel } from 'drizzle-orm';

export const Players = sqliteTable('players', {
    accountId: text('account_id').primaryKey().notNull(),
    zoneId: text('zone_id'),
    continentId: text('continent_id'),
    countryId: text('country_id'),
});

export type Player = InferModel<typeof Players>;
export type NewPlayer = InferModel<typeof Players, 'insert'>;
