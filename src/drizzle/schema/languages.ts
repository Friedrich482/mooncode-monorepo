import { InferSelectModel, relations } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { dailyData } from "./dailyData";
import { timestamps } from "../columns.helpers";
import { ulid } from "ulid";

export const languages = pgTable("languages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => ulid()),
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

export type Language = InferSelectModel<typeof languages>;
