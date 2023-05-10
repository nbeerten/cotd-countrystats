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

export const Zones = sqliteTable('zones', {
    zoneId: text('zone_id').primaryKey().notNull(),
    parentId: text('parent_id'),
    name: text('name'),
    icon: text('icon'),
});

export type Zone = InferModel<typeof Zones>;
export type NewZone = InferModel<typeof Zones, 'insert'>;
