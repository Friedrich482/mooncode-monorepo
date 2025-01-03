import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { dailyData } from "./dailyData";
import { relations } from "drizzle-orm";
import { timestamps } from "../columns.helpers";

export const languages = pgTable("languages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  dailyDataId: integer("daily_time_id").notNull(),
  languageName: text("language_name").notNull(),
  timeSpent: integer("time_spent").notNull().default(0),
  ...timestamps,
});

export const languagesRelations = relations(languages, ({ one }) => ({
  dailyData: one(dailyData, {
    fields: [languages.dailyDataId],
    references: [dailyData.id],
  }),
}));
