import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { dailyTime } from "./dailyTime";
import { relations } from "drizzle-orm";
import { timestamps } from "../columns.helpers";

export const languages = pgTable("languages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  dailyTimeId: integer("daily_time_id").notNull(),
  languageName: text("language_name").notNull(),
  timeSpent: integer("time_spent").notNull().default(0),
  ...timestamps,
});

export const languagesRelations = relations(dailyTime, ({ one }) => ({
  dailyTime: one(dailyTime, {
    fields: [languages.dailyTimeId],
    references: [dailyTime.id],
  }),
}));
