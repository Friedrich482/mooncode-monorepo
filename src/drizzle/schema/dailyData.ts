import { InferSelectModel, relations } from "drizzle-orm";
import { date, integer, pgTable } from "drizzle-orm/pg-core";
import { languages } from "./languages";
import { timestamps } from "../columns.helpers";
import { users } from "./users";

export const dailyData = pgTable("daily_data", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull(),
  date: date().notNull(),
  timeSpent: integer("time_spent").notNull(),
  ...timestamps,
});

export const dailyDataRelations = relations(dailyData, ({ many, one }) => ({
  languages: many(languages),
  users: one(users, {
    fields: [dailyData.userId],
    references: [users.id],
  }),
}));

export type DailyData = InferSelectModel<typeof dailyData>;
