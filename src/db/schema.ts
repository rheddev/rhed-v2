import { pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const appAccessTokens = pgTable("app_access_tokens", {
    accessToken: varchar("access_token", {length: 100}).notNull(),
    expirationDate: timestamp("expiration_date").notNull(),
    tokenType: varchar("token_type", {length: 100}).notNull(),
});