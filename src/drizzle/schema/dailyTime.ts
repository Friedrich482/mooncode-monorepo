import { date, integer, pgTable } from "drizzle-orm/pg-core";
import { languages } from "./languages";
import { relations } from "drizzle-orm";
import { timestamps } from "../columns.helpers";

export const dailyTime = pgTable("daily_time", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  date: date().notNull(),
  timeSpent: integer("time_spent").notNull(),
  ...timestamps,
});

export const dailyTimeRelations = relations(languages, ({ many }) => ({
  languages: many(languages),
}));
